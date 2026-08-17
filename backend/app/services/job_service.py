import uuid
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.job import Job, JobStatus
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate


def create_job(data: JobCreate, current_user: User, db: Session) -> Job:
    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only employers can post jobs"
        )
    job = Job(
        id=str(uuid.uuid4()),
        employer_id=current_user.id,
        title=data.title,
        description=data.description,
        required_skills=data.required_skills,
        location=data.location,
        salary_range=data.salary_range,
        status=JobStatus.active
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_all_jobs(db: Session, page: int = 1, page_size: int = 10) -> dict:
    total = db.query(Job).filter(Job.status == JobStatus.active).count()
    jobs = db.query(Job).filter(
        Job.status == JobStatus.active
    ).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "jobs": jobs
    }


def get_job_by_id(job_id: str, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


def update_job(
    job_id: str,
    data: JobUpdate,
    current_user: User,
    db: Session
) -> Job:
    job = get_job_by_id(job_id, db)
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    if data.title is not None:
        job.title = data.title
    if data.description is not None:
        job.description = data.description
    if data.required_skills is not None:
        job.required_skills = data.required_skills
    if data.location is not None:
        job.location = data.location
    if data.salary_range is not None:
        job.salary_range = data.salary_range
    if data.status is not None:
        job.status = data.status

    db.commit()
    db.refresh(job)
    return job


def delete_job(job_id: str, current_user: User, db: Session) -> dict:
    job = get_job_by_id(job_id, db)
    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}