import os
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

def validate_file(file: UploadFile) -> None:
    """Validate file type and size."""

    # Check extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}"
        )

    # Check content type
    allowed_content_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    }
    if file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type: {file.content_type}"
        )

def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower()