from fastapi import FastAPI,Depends,Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List,Annotated
import re
from dotenv import load_dotenv 
load_dotenv()
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
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


def extract_video_id(url: str):
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11})"
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    raise ValueError("Invalid YouTube URL")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

class UrlRequest(BaseModel):
    URL: str
    Id : int

@app.post("/url")
def load_video(data: UrlRequest, db:db_dependency):
    print(data)
    video_id = extract_video_id(data.URL)

    try:
        transcript_list = YouTubeTranscriptApi().fetch(video_id)
        
        full_text=""
        for transcript in transcript_list: 
            full_text += transcript.text + " "
        
        new_video = Video(
            user_id = data.Id,
            video_id = video_id,
            url = data.URL,
            transcript = full_text
        )
        db.add(new_video)
        db.commit()
        db.refresh(new_video)
        return {"video_info":new_video}
    except TranscriptsDisabled:
        return {"error": "No captions available"}

@app.get("/get-url/{user_id}")
def get_all_urls(user_id:int,db:db_dependency):
    stmt = select(Video).where(Video.user_id==user_id)
    result = db.execute(stmt).scalars().all()
    for data in result:
        print(data.url,"\n")

   