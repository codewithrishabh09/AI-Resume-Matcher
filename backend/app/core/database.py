from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    from app.models.user import User
    from app.models.resume import Resume
    from app.models.job import Job
    from app.models.analysis import Analysis
    from app.models.application import Application
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created!")