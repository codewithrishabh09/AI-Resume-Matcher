import pdfplumber
from fastapi import HTTPException

def parse_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to parse PDF: {str(e)}"
        )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="PDF appears to be empty or image-based (no extractable text)"
        )

    return text.strip()