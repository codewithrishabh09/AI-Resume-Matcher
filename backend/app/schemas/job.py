from pydantic import BaseModel
from datetime import datetime
from typing import List

class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    location: str | None = None
    salary_range: str | None = None

class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: List[str] | None = None
    location: str | None = None
    salary_range: str | None = None
    status: str | None = None

class JobOut(BaseModel):
    id: str
    employer_id: str
    title: str
    description: str
    required_skills: List[str] | None
    location: str | None
    salary_range: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}

class JobListOut(BaseModel):
    total: int
    page: int
    page_size: int
    jobs: List[JobOut]