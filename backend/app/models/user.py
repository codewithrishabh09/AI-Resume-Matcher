import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    seeker   = "seeker"
    employer = "employer"
    admin    = "admin"

class User(Base):
    __tablename__ = "users"

    id         : Mapped[str]      = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email      : Mapped[str]      = mapped_column(String, unique=True, nullable=False, index=True)
    password   : Mapped[str]      = mapped_column(String, nullable=False)
    full_name  : Mapped[str]      = mapped_column(String, nullable=True)
    role       : Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.seeker)
    is_active  : Mapped[bool]     = mapped_column(Boolean, default=True)
    created_at : Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at : Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)