from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "seeker"

class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None

class UserOut(BaseModel):
    id: str
    full_name: str | None
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}