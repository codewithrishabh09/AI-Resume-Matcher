import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User
from app.utils.file_validator import validate_file, get_file_extension
from app.utils.pdf_parser import parse_pdf
from app.utils.docx_parser import parse_docx
from app.core.config import settings

UPLOAD_DIR = settings.UPLOAD_DIR

def save_upload_file(file: UploadFile, destination: str) -> None:
    """Save uploaded file to disk."""
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

def extract_text(file_path: str) -> str:
    """Route to correct parser based on extension."""
    ext = get_file_extension(file_path)
    if ext == ".pdf":
        return parse_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return parse_docx(file_path)
    raise HTTPException(status_code=400, detail="Unsupported file type")

def upload_resume(
    file: UploadFile,
    current_user: User,
    db: Session
) -> Resume:
    """Full upload flow: validate → save → parse → store in DB."""

    # 1. Validate
    validate_file(file)

    # 2. Build save path
    ext = get_file_extension(file.filename)
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, "resumes", current_user.id, unique_filename)

    # 3. Save to disk
    save_upload_file(file, file_path)

    # 4. Extract text
    try:
        raw_text = extract_text(file_path)
    except Exception as e:
        # Clean up file if parsing fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise e

    # 5. Save to DB
    resume = Resume(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        raw_text=raw_text,
        is_parsed=False       # ML pipeline runs later
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    try:
        from app.workers.tasks import (
            parse_resume_task,
            batch_match_task
        )

        # Parse resume in background
        parse_resume_task.delay(resume.id, file_path)
        # After parsing, batchh match (chained)
        # batch_match_task will run after parse_resume_task completes

    except Exception as e:
        # Dont fail upload if celery unavailable
        print(f"Celery unavailable: {e}")

    return resume

def get_resume(resume_id: str, current_user: User, db: Session) -> Resume:
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    return resume

def get_resume_by_id(resume_id: str, current_user: User, db: Session) -> Resume:
    """Get resume by ID — only owner can access."""
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    return resume

def get_all_resumes(current_user: User, db: Session) -> list[Resume]:
    """Get all resumes for current user."""
    return db.query(Resume).filter(Resume.user_id == current_user.id).all()

def delete_resume(resume_id: str, current_user: User, db: Session) -> dict:
    """Delete resume from DB and disk."""
    resume = get_resume_by_id(resume_id, current_user, db)

    # Delete file from disk
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)

    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully"}