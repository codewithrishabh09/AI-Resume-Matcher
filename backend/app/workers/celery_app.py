from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

# Create Celery app FIRST
celery_app = Celery(
    "ai_resume_matcher",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks"]
)

# Configuration AFTER creation
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    result_expires=3600,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=50,
    task_routes={
        "app.workers.tasks.parse_resume_task": {"queue": "ml"},
        "app.workers.tasks.run_matching_task": {"queue": "ml"},
        "app.workers.tasks.batch_match_task": {"queue": "ml"},
        "app.workers.tasks.send_notification_task": {"queue": "default"},
        "app.workers.tasks.cleanup_old_files_task": {"queue": "default"},
    },
    beat_schedule={
        "cleanup-old-files": {
            "task": "app.workers.tasks.cleanup_old_files_task",
            "schedule": crontab(hour=0, minute=0),
        },
    }
)