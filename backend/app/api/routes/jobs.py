from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.cache import get_cache, set_cache, delete_cache, cache_key
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.job import JobCreate, JobOut, JobUpdate, JobListOut
from app.services.job_service import (
    create_job, get_all_jobs,
    get_job_by_id, update_job, delete_job
)

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobOut, status_code=201)
@limiter.limit("20/minute")
def create(
    request: Request,
    data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = create_job(data, current_user, db)
    # Clear jobs list cache when new job added
    delete_cache("jobs:list:*")
    return job


@router.get("/", response_model=JobListOut)
@limiter.limit("60/minute")
def list_jobs(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Try cache first
    key = cache_key("jobs", "list", page, page_size)
    cached = get_cache(key)
    if cached:
        cached["from_cache"] = True
        return cached

    # Query DB
    result = get_all_jobs(db, page, page_size)
    result_dict = {
        "total": result["total"],
        "page": result["page"],
        "page_size": result["page_size"],
        "jobs": [
            {
                "id": j.id,
                "employer_id": j.employer_id,
                "title": j.title,
                "description": j.description,
                "required_skills": j.required_skills,
                "location": j.location,
                "salary_range": j.salary_range,
                "status": j.status,
                "created_at": str(j.created_at)
            }
            for j in result["jobs"]
        ]
    }

    # Cache for 5 minutes
    set_cache(key, result_dict, ttl=300)
    return result


@router.get("/{job_id}", response_model=JobOut)
@limiter.limit("60/minute")
def get_job(
    request: Request,
    job_id: str,
    db: Session = Depends(get_db)
):
    # Try cache first
    key = cache_key("jobs", job_id)
    cached = get_cache(key)
    if cached:
        return cached

    job = get_job_by_id(job_id, db)

    # Cache for 10 minutes
    job_dict = {
        "id": job.id,
        "employer_id": job.employer_id,
        "title": job.title,
        "description": job.description,
        "required_skills": job.required_skills,
        "location": job.location,
        "salary_range": job.salary_range,
        "status": job.status,
        "created_at": str(job.created_at)
    }
    set_cache(key, job_dict, ttl=600)
    return job


@router.patch("/{job_id}", response_model=JobOut)
@limiter.limit("20/minute")
def update(
    request: Request,
    job_id: str,
    data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = update_job(job_id, data, current_user, db)
    # Clear job cache on update
    delete_cache(cache_key("jobs", job_id))
    return job


@router.delete("/{job_id}")
@limiter.limit("10/minute")
def delete(
    request: Request,
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = delete_job(job_id, current_user, db)
    # Clear job cache on delete
    delete_cache(cache_key("jobs", job_id))
    return result