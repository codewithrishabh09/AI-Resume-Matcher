from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rate_limiter import limiter
from app.core.cache import get_cache, set_cache, cache_key
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.matching_service import (
    run_matching,
    get_top_jobs_for_resume,
    get_top_resumes_for_job
)

router = APIRouter(prefix="/match", tags=["Matching"])


@router.post("/{resume_id}/{job_id}")
@limiter.limit("30/minute")
def match_resume_to_job(
    request: Request,
    resume_id: str,
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try cache first
    key = cache_key("match", resume_id, job_id)
    cached = get_cache(key)
    if cached:
        cached["from_cache"] = True
        return cached

    result = run_matching(resume_id, job_id, current_user, db)

    # Cache match result for 1 hour
    set_cache(key, result, ttl=3600)
    return result


@router.get("/resume/{resume_id}/top-jobs")
@limiter.limit("20/minute")
def top_jobs_for_resume(
    request: Request,
    resume_id: str,
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try cache first
    key = cache_key("top_jobs", resume_id, limit)
    cached = get_cache(key)
    if cached:
        return {"results": cached, "from_cache": True}

    results = get_top_jobs_for_resume(
        resume_id, current_user, db, limit
    )

    # Cache for 30 minutes
    set_cache(key, results, ttl=1800)
    return {"results": results, "total": len(results)}


@router.get("/job/{job_id}/top-resumes")
@limiter.limit("20/minute")
def top_resumes_for_job(
    request: Request,
    job_id: str,
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try cache first
    key = cache_key("top_resumes", job_id, limit)
    cached = get_cache(key)
    if cached:
        return {"results": cached, "from_cache": True}

    results = get_top_resumes_for_job(
        job_id, current_user, db, limit
    )

    # Cache for 30 minutes
    set_cache(key, results, ttl=1800)
    return {"results": results, "total": len(results)}