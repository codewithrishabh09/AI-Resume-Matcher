import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id             : Mapped[str]      = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id        : Mapped[str]      = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    file_name      : Mapped[str]      = mapped_column(String, nullable=False)
    file_path      : Mapped[str]      = mapped_column(String, nullable=False)   # S3 path or local path
    raw_text       : Mapped[str]      = mapped_column(Text, nullable=True)
    skills         : Mapped[list]     = mapped_column(ARRAY(String), nullable=True, default=list)
    experience_yrs : Mapped[int]      = mapped_column(Integer, nullable=True, default=0)
    education      : Mapped[str]      = mapped_column(String, nullable=True)
    is_parsed      : Mapped[bool]     = mapped_column(default=False)            # True after ML pipeline runs
    created_at     : Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at     : Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)