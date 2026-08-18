import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis
from app.models.user import User
from app.ml.inference.matcher import match_resume_to_job
from app.services.skill_service import (
    analyze_skill_gap,
    get_skill_recommendations
)


def run_matching(
    resume_id: str,
    job_id: str,
    current_user: User,
    db: Session
) -> dict:
    """Run ML matching between a resume and job."""

    # 1. Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    # 2. Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 3. Check if analysis already exists
    existing = db.query(Analysis).filter(
        Analysis.resume_id == resume_id,
        Analysis.job_id == job_id
    ).first()

    if existing:
        return _format_result(existing, resume, job)

    # 4. Run ML prediction
    if not resume.raw_text:
        raise HTTPException(
            status_code=400,
            detail="Resume has no text. Please re-upload."
        )

    job_text = f"{job.title} {job.description} {' '.join(job.required_skills or [])}"
    result = match_resume_to_job(resume.raw_text, job_text)

    # 5. Skill analysis
    skill_analysis = analyze_skill_gap(resume.raw_text, job_text)
    recommendations = get_skill_recommendations(
        skill_analysis["missing_skills"]
    )

    # 6. Save to DB
    analysis = Analysis(
        id=str(uuid.uuid4()),
        resume_id=resume_id,
        job_id=job_id,
        match_score=result["match_score"],
        matching_skills=result["matching_skills"],
        missing_skills=result["missing_skills"],
        summary=f"{result['recommendation']} — "
                f"Skill match: {result['skill_match_percentage']}%, "
                f"Semantic similarity: {result['semantic_similarity']}%"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "analysis_id": analysis.id,
        "resume_id": resume_id,
        "job_id": job_id,
        "job_title": job.title,
        "match_score": result["match_score"],
        "recommendation": result["recommendation"],
        "semantic_similarity": result["semantic_similarity"],
        "skill_match_percentage": result["skill_match_percentage"],
        "matching_skills": result["matching_skills"],
        "missing_skills": result["missing_skills"],
        "experience_years": result["experience_years"],
        "skill_recommendations": recommendations,
        "summary": analysis.summary
    }


def get_top_jobs_for_resume(
    resume_id: str,
    current_user: User,
    db: Session,
    limit: int = 10
) -> list:
    """Get top matching jobs for a resume."""

    # Get resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get all active jobs
    from app.models.job import JobStatus
    jobs = db.query(Job).filter(Job.status == JobStatus.active).all()

    if not jobs or not resume.raw_text:
        return []

    # Score each job
    results = []
    for job in jobs:
        job_text = f"{job.title} {job.description} {' '.join(job.required_skills or [])}"
        try:
            result = match_resume_to_job(resume.raw_text, job_text)
            results.append({
                "job_id": job.id,
                "job_title": job.title,
                "location": job.location,
                "salary_range": job.salary_range,
                "match_score": result["match_score"],
                "recommendation": result["recommendation"],
                "matching_skills": result["matching_skills"],
                "missing_skills": result["missing_skills"]
            })
        except Exception:
            continue

    # Sort by score descending
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:limit]


def get_top_resumes_for_job(
    job_id: str,
    current_user: User,
    db: Session,
    limit: int = 10
) -> list:
    """Get top matching resumes for a job. Employers only."""

    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only employers can view resume matches"
        )

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.employer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    # Get all resumes
    resumes = db.query(Resume).filter(Resume.raw_text.isnot(None)).all()

    if not resumes:
        return []

    job_text = f"{job.title} {job.description} {' '.join(job.required_skills or [])}"

    results = []
    for resume in resumes:
        try:
            result = match_resume_to_job(resume.raw_text, job_text)
            results.append({
                "resume_id": resume.id,
                "user_id": resume.user_id,
                "file_name": resume.file_name,
                "match_score": result["match_score"],
                "recommendation": result["recommendation"],
                "matching_skills": result["matching_skills"],
                "missing_skills": result["missing_skills"],
                "experience_years": result["experience_years"]
            })
        except Exception:
            continue

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:limit]


def _format_result(analysis: Analysis, resume: Resume, job: Job) -> dict:
    """Format existing analysis result."""
    return {
        "analysis_id": analysis.id,
        "resume_id": analysis.resume_id,
        "job_id": analysis.job_id,
        "job_title": job.title,
        "match_score": analysis.match_score,
        "matching_skills": analysis.matching_skills or [],
        "missing_skills": analysis.missing_skills or [],
        "summary": analysis.summary,
        "cached": True
    }