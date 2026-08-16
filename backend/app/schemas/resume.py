from pydantic import BaseModel
from datetime import datetime
from typing import List

class ResumeUploadResponse(BaseModel):
    id: str
    file_name: str
    is_parsed: bool
    message: str = "Resume uploaded successfully. Processing in background."

class ResumeUpdate(BaseModel):
    skills: List[str] | None = None
    experience_yrs: int | None = None
    education: str | None = None

class ResumeOut(BaseModel):
    id: str
    user_id: str
    file_name: str
    file_path: str
    raw_text: str | None
    skills: List[str] | None
    experience_yrs: int | None
    education: str | None
    is_parsed: bool
    created_at: datetime

    model_config = {"from_attributes": True}