import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.resume import Resume

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/{job_id}", status_code=201)
def apply_for_job(
    job_id: str,
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Apply for a job with a resume."""

    # Check job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Check resume exists and belongs to user
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found or doesn't belong to you"
        )

    # Check not already applied
    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already applied for this job"
        )

    # Create application
    application = Application(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        job_id=job_id,
        resume_id=resume_id,
        status=ApplicationStatus.pending
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Application submitted successfully",
        "application_id": application.id,
        "job_title": job.title,
        "status": application.status
    }


@router.get("/my")
def my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all applications for current user."""
    apps = db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()

    result = []
    for app in apps:
        job = db.query(Job).filter(Job.id == app.job_id).first()
        result.append({
            "application_id": app.id,
            "job_id": app.job_id,
            "job_title": job.title if job else "Unknown",
            "status": app.status,
            "applied_at": app.applied_at
        })
    return result


@router.get("/job/{job_id}")
def job_applications(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all applications for a job. Employers only."""
    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Employers only"
        )

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    apps = db.query(Application).filter(
        Application.job_id == job_id
    ).all()

    return {
        "job_title": job.title,
        "total_applications": len(apps),
        "applications": [
            {
                "application_id": app.id,
                "user_id": app.user_id,
                "resume_id": app.resume_id,
                "status": app.status,
                "applied_at": app.applied_at
            }
            for app in apps
        ]
    }


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: str,
    status: ApplicationStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update application status. Employers only."""
    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(status_code=403, detail="Employers only")

    app = db.query(Application).filter(
        Application.id == application_id
    ).first()
    if not app:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    app.status = status
    db.commit()
    db.refresh(app)

    return {
        "message": f"Status updated to {status}",
        "application_id": app.id,
        "status": app.status
    }