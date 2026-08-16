from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):
    APP_NAME: str = "AI Resume Matcher"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    # JWT (NEEDED SOON IN DAY 4)
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Redics (needed in Day 9)
    REDIS_URL: str = "redis://localhost:6379/0"

    # File Uploads
    MAX_FILE_SIZE_MB: int = 10
    UPLOAD_DIRECTORY: str = "./uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Setting()
