from fastapi import APIRouter

try:
    from app.api.routes import auth, resumes, jobs, matching, users
    
    api_router = APIRouter()
    
    api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
    api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
    api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
    api_router.include_router(matching.router, prefix="/matching", tags=["matching"])
    api_router.include_router(users.router, prefix="/users", tags=["users"])
    
except ImportError as e:
    print(f"Warning: Could not import all routes: {e}")
    api_router = APIRouter()

__all__ = ["api_router"]