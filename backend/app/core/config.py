from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "AI Resume Matcher"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str

    # JWT
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # File uploads
    MAX_FILE_SIZE_MB: int = 5
    UPLOAD_DIR: str = "./uploads"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings() 