import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum

class JobStatus(str, enum.Enum):
    active   = "active"
    closed   = "closed"
    draft    = "draft"

class Job(Base):
    __tablename__ = "jobs"

    id              : Mapped[str]       = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employer_id     : Mapped[str]       = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    title           : Mapped[str]       = mapped_column(String, nullable=False)
    description     : Mapped[str]       = mapped_column(Text, nullable=False)
    required_skills : Mapped[list]      = mapped_column(ARRAY(String), nullable=True, default=list)
    location        : Mapped[str]       = mapped_column(String, nullable=True)
    salary_range    : Mapped[str]       = mapped_column(String, nullable=True)
    status          : Mapped[JobStatus] = mapped_column(SAEnum(JobStatus), default=JobStatus.active)
    created_at      : Mapped[datetime]  = mapped_column(DateTime, default=datetime.utcnow)
    updated_at      : Mapped[datetime]  = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)