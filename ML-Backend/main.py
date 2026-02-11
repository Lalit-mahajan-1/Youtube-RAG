from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Annotated
import re, os
from dotenv import load_dotenv

load_dotenv()

import models
from models import Video, ChatMessage
from database import engine, SessionLocal

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (
    RunnableParallel,
    RunnablePassthrough,
    RunnableLambda
)
from langchain_pinecone import PineconeVectorStore

# ------------------ DB SETUP ------------------

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# ------------------ FASTAPI APP ------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
    "https://youtube-rag-alpha.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ LLM + PROMPT ------------------

prompt = PromptTemplate(
    template="""
You are a helpful AI assistant answering questions about a YouTube video.

Rules:
- Use the transcript as the primary source.
- If the answer is partially present, infer reasonably.
- If some details are missing, you may add general knowledge,
  but clearly mention that it is outside the video.
- Say "I don't know" ONLY if the question is completely unrelated.

Transcript context:
{context}

Question:
{question}

Answer:
""",
    input_variables=["context", "question"]
)

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    temperature=0.3
)

parser = StrOutputParser()

# ------------------ HELPERS ------------------

def extract_video_id(url: str):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11})"
    match = re.search(pattern, url)
    if not match:
        raise ValueError("Invalid YouTube URL")
    return match.group(1)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def get_vector_store():
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = pc.Index("youtube-rag")

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001"
    )

    return PineconeVectorStore(
        index=index,
        embedding=embeddings
    )

def generate_chunks(text: str, user_id: int, video_id: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.create_documents([text])

    for chunk in chunks:
        chunk.metadata["user_id"] = user_id
        chunk.metadata["video_id"] = video_id

    return chunks

# ------------------ SCHEMAS ------------------

class UrlRequest(BaseModel):
    URL: str
    Id: int

class QRequest(BaseModel):
    Query: str

# ------------------ ROUTES ------------------

@app.post("/url")
def load_video(data: UrlRequest, db: db_dependency):
    video_id = extract_video_id(data.URL)

    try:
        transcript_list = YouTubeTranscriptApi().fetch(video_id)

        full_text = " ".join([t.text for t in transcript_list])

        chunks = generate_chunks(full_text, data.Id, video_id)
        vector_store = get_vector_store()
        vector_store.add_documents(chunks)

        new_video = Video(
            user_id=data.Id,
            video_id=video_id,
            url=data.URL,
            transcript=full_text
        )

        db.add(new_video)
        db.commit()
        db.refresh(new_video)

        return {"video_info": new_video}

    except TranscriptsDisabled:
        return {"error": "No captions available for this video"}

@app.get("/get-url/{user_id}")
def get_all_urls(user_id: int, db: db_dependency):
    stmt = select(Video).where(Video.user_id == user_id)
    return db.execute(stmt).scalars().all()

@app.post("/chat/{user_id}/{video_id}")
def chat_with_video(
    user_id: int,
    video_id: str,
    data: QRequest,
    db: db_dependency
):
    vector_store = get_vector_store()

    retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 8,
            "fetch_k": 20,
            "filter": {
                "user_id": user_id,
                "video_id": video_id
            }
        }
    )

    parallel_chain = RunnableParallel({
        "context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough()
    })

    main_chain = parallel_chain | prompt | llm | parser

    # Save user message
    user_msg = ChatMessage(
        user_id=user_id,
        video_id=video_id,
        role="user",
        content=data.Query
    )
    db.add(user_msg)
    db.commit()

    answer = main_chain.invoke(data.Query)

    # Save AI message
    ai_msg = ChatMessage(
        user_id=user_id,
        video_id=video_id,
        role="ai",
        content=answer
    )
    db.add(ai_msg)
    db.commit()

    return {"answer": answer}

@app.get("/chat-history/{user_id}/{video_id}")
def get_chat_history(
    user_id: int,
    video_id: str,
    db: db_dependency
):
    stmt = (
        select(ChatMessage)
        .where(
            ChatMessage.user_id == user_id,
            ChatMessage.video_id == video_id
        )
        .order_by(ChatMessage.created_at.asc())
    )

    chats = db.execute(stmt).scalars().all()

    return [
        {
            "role": c.role,
            "content": c.content,
            "created_at": c.created_at
        }
        for c in chats
    ]
