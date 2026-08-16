import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum

class ApplicationStatus(str, enum.Enum):
    pending   = "pending"
    reviewed  = "reviewed"
    shortlisted = "shortlisted"
    rejected  = "rejected"
    hired     = "hired"

class Application(Base):
    __tablename__ = "applications"

    id          : Mapped[str]               = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id     : Mapped[str]               = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    job_id      : Mapped[str]               = mapped_column(String, ForeignKey("jobs.id"), nullable=False, index=True)
    resume_id   : Mapped[str]               = mapped_column(String, ForeignKey("resumes.id"), nullable=False)
    status      : Mapped[ApplicationStatus] = mapped_column(SAEnum(ApplicationStatus), default=ApplicationStatus.pending)
    cover_note  : Mapped[str]               = mapped_column(Text, nullable=True)
    applied_at  : Mapped[datetime]          = mapped_column(DateTime, default=datetime.utcnow)
    updated_at  : Mapped[datetime]          = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)