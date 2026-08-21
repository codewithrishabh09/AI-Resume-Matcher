import os
import uuid
from celery import shared_task
from celery.utils.log import get_task_logger

from app.workers.celery_app import celery_app

logger = get_task_logger(__name__)


# ─────────────────────────────────────────
# TASK 1: Parse Resume (async after upload)
# ─────────────────────────────────────────
@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,
    name="app.workers.tasks.parse_resume_task"
)
def parse_resume_task(self, resume_id: str, file_path: str):
    """
    Background task: Parse resume text and extract skills.
    Triggered after resume upload.
    """
    logger.info(f"Starting resume parsing for: {resume_id}")

    try:
        from app.core.database import SessionLocal
        from app.models.resume import Resume
        from app.utils.pdf_parser import parse_pdf
        from app.utils.docx_parser import parse_docx
        from app.ml.preprocessing.skill_extractor import extract_skills
        from app.ml.preprocessing.text_cleaner import (
            extract_experience_years, preprocess
        )

        db = SessionLocal()

        try:
            # 1. Get resume from DB
            resume = db.query(Resume).filter(
                Resume.id == resume_id
            ).first()

            if not resume:
                logger.error(f"Resume not found: {resume_id}")
                return {"status": "error", "message": "Resume not found"}

            # 2. Extract text
            ext = os.path.splitext(file_path)[1].lower()
            if ext == ".pdf":
                raw_text = parse_pdf(file_path)
            elif ext in [".docx", ".doc"]:
                raw_text = parse_docx(file_path)
            else:
                return {"status": "error", "message": "Unsupported file"}

            # 3. Extract features
            processed = preprocess(raw_text)
            skills = extract_skills(raw_text)
            experience = extract_experience_years(raw_text)

            # 4. Update resume in DB
            resume.raw_text = raw_text
            resume.skills = skills
            resume.experience_yrs = experience
            resume.is_parsed = True
            db.commit()

            logger.info(f"Resume parsed successfully: {resume_id}")
            logger.info(f"Skills found: {skills}")

            return {
                "status": "success",
                "resume_id": resume_id,
                "skills_found": len(skills),
                "experience_years": experience,
                "word_count": processed["word_count"]
            }

        finally:
            db.close()

    except Exception as exc:
        logger.error(f"Resume parsing failed: {exc}")
        raise self.retry(exc=exc, countdown=60)


# ─────────────────────────────────────────
# TASK 2: Run ML Matching (async)
# ─────────────────────────────────────────
@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=30,
    name="app.workers.tasks.run_matching_task"
)
def run_matching_task(self, resume_id: str, job_id: str):
    """
    Background task: Run ML matching between resume and job.
    Saves results to analyses table.
    """
    logger.info(f"Running ML match: resume={resume_id}, job={job_id}")

    try:
        from app.core.database import SessionLocal
        from app.models.resume import Resume
        from app.models.job import Job
        from app.models.analysis import Analysis
        from app.ml.inference.matcher import match_resume_to_job
        from app.services.skill_service import (
            analyze_skill_gap, get_skill_recommendations
        )

        db = SessionLocal()

        try:
            # 1. Get resume and job
            resume = db.query(Resume).filter(
                Resume.id == resume_id
            ).first()
            job = db.query(Job).filter(Job.id == job_id).first()

            if not resume or not job:
                return {
                    "status": "error",
                    "message": "Resume or job not found"
                }

            if not resume.raw_text:
                return {
                    "status": "error",
                    "message": "Resume not parsed yet"
                }

            # 2. Run ML matching
            job_text = (
                f"{job.title} {job.description} "
                f"{' '.join(job.required_skills or [])}"
            )
            result = match_resume_to_job(resume.raw_text, job_text)

            # 3. Check if analysis already exists
            existing = db.query(Analysis).filter(
                Analysis.resume_id == resume_id,
                Analysis.job_id == job_id
            ).first()

            if existing:
                # Update existing
                existing.match_score = result["match_score"]
                existing.matching_skills = result["matching_skills"]
                existing.missing_skills = result["missing_skills"]
                existing.summary = (
                    f"{result['recommendation']} — "
                    f"Skill match: {result['skill_match_percentage']}%"
                )
                db.commit()
                analysis_id = existing.id
            else:
                # Create new analysis
                analysis = Analysis(
                    id=str(uuid.uuid4()),
                    resume_id=resume_id,
                    job_id=job_id,
                    match_score=result["match_score"],
                    matching_skills=result["matching_skills"],
                    missing_skills=result["missing_skills"],
                    summary=(
                        f"{result['recommendation']} — "
                        f"Skill match: {result['skill_match_percentage']}%"
                    )
                )
                db.add(analysis)
                db.commit()
                analysis_id = analysis.id

            logger.info(
                f"Match complete: score={result['match_score']}%"
            )

            return {
                "status": "success",
                "analysis_id": analysis_id,
                "resume_id": resume_id,
                "job_id": job_id,
                "match_score": result["match_score"],
                "recommendation": result["recommendation"]
            }

        finally:
            db.close()

    except Exception as exc:
        logger.error(f"Matching task failed: {exc}")
        raise self.retry(exc=exc, countdown=30)


# ─────────────────────────────────────────
# TASK 3: Send Notification
# ─────────────────────────────────────────
@celery_app.task(
    bind=True,
    max_retries=3,
    name="app.workers.tasks.send_notification_task"
)
def send_notification_task(
    self,
    user_email: str,
    subject: str,
    message: str
):
    """
    Background task: Send email notification.
    """
    logger.info(f"Sending notification to: {user_email}")

    try:
        # TODO: integrate with SendGrid or AWS SES
        # For now just log it
        logger.info(f"Email to: {user_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Message: {message}")

        # Example SendGrid integration:
        # import sendgrid
        # sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        # ...

        return {
            "status": "success",
            "recipient": user_email,
            "subject": subject
        }

    except Exception as exc:
        logger.error(f"Notification failed: {exc}")
        raise self.retry(exc=exc, countdown=60)


# ─────────────────────────────────────────
# TASK 4: Cleanup Old Files
# ─────────────────────────────────────────
@celery_app.task(name="app.workers.tasks.cleanup_old_files_task")
def cleanup_old_files_task():
    """
    Periodic task: Clean up old uploaded files.
    Runs daily via Celery Beat.
    """
    logger.info("Starting cleanup of old files...")

    try:
        from app.core.database import SessionLocal
        from app.models.resume import Resume
        from datetime import datetime, timedelta

        db = SessionLocal()
        deleted_count = 0

        try:
            # Find resumes older than 30 days
            cutoff = datetime.utcnow() - timedelta(days=30)
            old_resumes = db.query(Resume).filter(
                Resume.created_at < cutoff,
                Resume.is_parsed == True
            ).all()

            for resume in old_resumes:
                # Only delete file, keep DB record
                if resume.file_path and os.path.exists(resume.file_path):
                    os.remove(resume.file_path)
                    deleted_count += 1
                    logger.info(f"Deleted file: {resume.file_path}")

            logger.info(f"Cleanup complete: {deleted_count} files deleted")
            return {
                "status": "success",
                "files_deleted": deleted_count
            }

        finally:
            db.close()

    except Exception as exc:
        logger.error(f"Cleanup failed: {exc}")
        return {"status": "error", "message": str(exc)}


# ─────────────────────────────────────────
# TASK 5: Batch Match All Jobs for Resume
# ─────────────────────────────────────────
@celery_app.task(
    bind=True,
    name="app.workers.tasks.batch_match_task"
)
def batch_match_task(self, resume_id: str):
    """
    Background task: Match resume against all active jobs.
    Triggered after resume parsing completes.
    """
    logger.info(f"Starting batch match for resume: {resume_id}")

    try:
        from app.core.database import SessionLocal
        from app.models.resume import Resume
        from app.models.job import Job, JobStatus

        db = SessionLocal()

        try:
            resume = db.query(Resume).filter(
                Resume.id == resume_id
            ).first()

            if not resume or not resume.raw_text:
                return {"status": "error", "message": "Resume not ready"}

            # Get all active jobs
            jobs = db.query(Job).filter(
                Job.status == JobStatus.active
            ).all()

            logger.info(f"Matching against {len(jobs)} jobs...")

            # Queue individual matching tasks
            for job in jobs:
                run_matching_task.delay(resume_id, job.id)

            return {
                "status": "success",
                "resume_id": resume_id,
                "jobs_queued": len(jobs)
            }

        finally:
            db.close()

    except Exception as exc:
        logger.error(f"Batch match failed: {exc}")
        raise self.retry(exc=exc, countdown=60)