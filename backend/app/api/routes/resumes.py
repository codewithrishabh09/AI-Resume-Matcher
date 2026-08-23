from fastapi import APIRouter, Depends, UploadFile, File, Request
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.resume import ResumeOut, ResumeUploadResponse
from app.services.resume_service import (
    upload_resume,
    get_resume,
    get_all_resumes,
    delete_resume
)

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeUploadResponse, status_code=201)
@limiter.limit("10/minute")
def upload(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a resume PDF or DOCX."""
    resume = upload_resume(file, current_user, db)
    return ResumeUploadResponse(
        id=resume.id,
        file_name=resume.file_name,
        is_parsed=resume.is_parsed,
        message="Resume uploaded and text extracted successfully."
    )


@router.get("/", response_model=List[ResumeOut])
@limiter.limit("30/minute")
def list_resumes(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all resumes for logged-in user."""
    return get_all_resumes(current_user, db)


@router.get("/{resume_id}", response_model=ResumeOut)
@limiter.limit("30/minute")
def get_single_resume(
    request: Request,
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single resume by ID."""
    return get_resume(resume_id, current_user, db)


@router.delete("/{resume_id}")
@limiter.limit("10/minute")
def delete(
    request: Request,
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a resume."""
    return delete_resume(resume_id, current_user, db)