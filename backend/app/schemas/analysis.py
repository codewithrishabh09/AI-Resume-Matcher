from pydantic import BaseModel
from datetime import datetime
from typing import List

class SkillGapOut(BaseModel):
    matching_skills: List[str]
    missing_skills: List[str]
    total_required: int
    match_percentage: float

class MatchResult(BaseModel):
    resume_id: str
    job_id: str
    match_score: float
    skill_gap: SkillGapOut

class AnalysisOut(BaseModel):
    id: str
    resume_id: str
    job_id: str
    match_score: float
    ranking: int | None
    matching_skills: List[str] | None
    missing_skills: List[str] | None
    summary: str | None
    created_at: datetime

    model_config = {"from_attributes": True}