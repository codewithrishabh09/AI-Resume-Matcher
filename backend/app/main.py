from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.rate_limiter import Limiter, rate_limit_exceeded_handler
from app.api.routes import auth, resumes, jobs, matching, users, applications

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resumes.router)
app.include_router(jobs.router)
app.include_router(matching.router)
app.include_router(applications.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the AI Resume Matcher API!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Healthy"
    }

