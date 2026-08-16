import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id              : Mapped[str]   = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id       : Mapped[str]   = mapped_column(String, ForeignKey("resumes.id"), nullable=False, index=True)
    job_id          : Mapped[str]   = mapped_column(String, ForeignKey("jobs.id"), nullable=False, index=True)
    match_score     : Mapped[float] = mapped_column(Float, nullable=False)          # 0.0 - 100.0
    ranking         : Mapped[int]   = mapped_column(Integer, nullable=True)
    matching_skills : Mapped[list]  = mapped_column(ARRAY(String), nullable=True)
    missing_skills  : Mapped[list]  = mapped_column(ARRAY(String), nullable=True)
    summary         : Mapped[str]   = mapped_column(Text, nullable=True)            # human-readable explanation
    created_at      : Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)