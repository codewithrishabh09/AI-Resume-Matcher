from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.job import JobCreate, JobOut, JobUpdate, JobListOut
from app.services.job_service import (
    create_job,
    get_all_jobs,
    get_job_by_id,
    update_job,
    delete_job
)

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobOut, status_code=201)
def create(
    data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job listing. Employers only."""
    return create_job(data, current_user, db)


@router.get("/", response_model=JobListOut)
def list_jobs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all active job listings with pagination."""
    return get_all_jobs(db, page, page_size)


@router.get("/{job_id}", response_model=JobOut)
def get_job(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get a single job by ID."""
    return get_job_by_id(job_id, db)


@router.patch("/{job_id}", response_model=JobOut)
def update(
    job_id: str,
    data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a job listing."""
    return update_job(job_id, data, current_user, db)


@router.delete("/{job_id}")
def delete(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a job listing."""
    return delete_job(job_id, current_user, db)