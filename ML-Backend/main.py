from fastapi import FastAPI,Depends,Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List,Annotated
import re
from dotenv import load_dotenv 
load_dotenv()
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

import models
from models import Video
from database import engine,SessionLocal

models.Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session,Depends(get_db)]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= GLOBAL STATE =================
retriever = None   # 👈 this is key

# ================= MODELS =================
llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    temperature=0.3
)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001"
)

prompt = PromptTemplate(
    template="""You are a helpful AI assistant that answers questions about YouTube videos based on their transcripts.

Using the context below, provide a clear and accurate answer to the user's question.
If the answer is in the context, explain it naturally.
Only say "I don't have enough information to answer that" if the context truly doesn't contain relevant information.

Context from video transcript:
{context}

User's Question: {question}

Answer:""",
    input_variables=["context", "question"]
)

parser = StrOutputParser()

# ================= HELPERS =================
def extract_video_id(url: str):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11})"
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    raise ValueError("Invalid YouTube URL")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# ================= REQUEST SCHEMAS =================
class UrlRequest(BaseModel):
    URL: str

class ChatRequest(BaseModel):
    question: str

# ================= ROUTES =================
@app.post("/url")
def load_video(data: UrlRequest, db:db_dependency):
    global retriever

    video_id = extract_video_id(data.URL)

    try:
        transcript_list = YouTubeTranscriptApi().fetch(video_id)
        
        full_text=""
        for transcript in transcript_list: 
            full_text += transcript.text + " "
            
        print(f"📹 Video ID: {video_id}")
        print(f"📝 Transcript length: {len(full_text)} characters")
        print(f"📄 First 200 chars: {full_text[:200]}")  # Debug: see actual content
            
        new_video = Video(
            video_id = video_id,
            url = data.URL,
            transcript = full_text
        )
        db.add(new_video)
        db.commit()
        db.refresh(new_video)
    except TranscriptsDisabled:
        return {"error": "No captions available"}

    # 🔹 SPLIT
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    docs = splitter.create_documents([full_text])
    print(f"📦 Created {len(docs)} document chunks")  # Debug

    # 🔹 VECTOR STORE
    vector_store = FAISS.from_documents(docs, embedding_model)

    # 🔹 RETRIEVER (SAVE IT)
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )
    
    print(f"✅ Retriever created successfully")  # Debug

    return {"message": "Video loaded successfully"}

@app.post("/chat")
def chat(data: ChatRequest):
    if retriever is None:
        return {"error": "No video loaded yet"}

    print(f"❓ Question: {data.question}")  # Debug
    
    # Test retriever directly
    retrieved_docs = retriever.invoke(data.question)
    print(f"🔍 Retrieved {len(retrieved_docs)} documents")  # Debug
    print(f"📄 First doc preview: {retrieved_docs[0].page_content[:200] if retrieved_docs else 'NONE'}")  # Debug

    chain = (
        RunnableParallel({
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough()
        })
        | prompt
        | llm
        | parser
    )

    answer = chain.invoke(data.question)
    print(f"💬 Answer: {answer}")  # Debug
    return {"answer": answer}