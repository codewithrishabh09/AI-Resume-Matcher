import mammoth
from fastapi import HTTPException

def parse_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    try:
        with open(file_path, "rb") as docx_file:
            result = mammoth.extract_raw_text(docx_file)
            text = result.value
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to parse DOCX: {str(e)}"
        )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="DOCX appears to be empty"
        )

    return text.strip()