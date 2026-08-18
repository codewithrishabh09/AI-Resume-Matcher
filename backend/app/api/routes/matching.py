from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.matching_service import (
    run_matching,
    get_top_jobs_for_resume,
    get_top_resumes_for_job
)

router = APIRouter(prefix="/match", tags=["Matching"])


@router.post("/{resume_id}/{job_id}")
def match_resume_to_job(
    resume_id: str,
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Run ML matching between a resume and job.
    Returns match score, skill gap, and recommendations.
    """
    return run_matching(resume_id, job_id, current_user, db)


@router.get("/resume/{resume_id}/top-jobs")
def top_jobs_for_resume(
    resume_id: str,
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get top matching jobs for a resume.
    Ranks all active jobs by ML match score.
    """
    return get_top_jobs_for_resume(resume_id, current_user, db, limit)


@router.get("/job/{job_id}/top-resumes")
def top_resumes_for_job(
    job_id: str,
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get top matching resumes for a job.
    Employers only.
    """
    return get_top_resumes_for_job(job_id, current_user, db, limit)