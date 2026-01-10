from sqlalchemy import Boolean, Column, Integer, String
from database import Base


class Video(Base):
    __tablename__ = "video"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    video_id = Column(String, nullable=False)
    transcript = Column(String,nullable=False)