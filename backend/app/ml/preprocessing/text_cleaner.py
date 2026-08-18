import re
import string
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

STOP_WORDS = set(stopwords.words('english'))


def clean_text(text: str) -> str:
    """Clean and normalize raw text."""
    if not text:
        return ""
    # Lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    # Remove emails
    text = re.sub(r'\S+@\S+', '', text)
    # Remove special characters
    text = re.sub(r'[^\w\s\-]', ' ', text)
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text


def remove_stopwords(text: str) -> str:
    """Remove stopwords from text."""
    tokens = text.split()
    filtered = [w for w in tokens if w not in STOP_WORDS]
    return ' '.join(filtered)


def extract_experience_years(text: str) -> int:
    """Extract years of experience from text."""
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)',
        r'(?:experience|exp)[^\d]*(\d+)\+?\s*(?:years?|yrs?)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return min(int(match.group(1)), 30)
    return 0


def preprocess(text: str) -> dict:
    """Full text preprocessing pipeline."""
    cleaned = clean_text(text)
    filtered = remove_stopwords(cleaned)
    experience = extract_experience_years(text)

    return {
        "cleaned_text": cleaned,
        "filtered_text": filtered,
        "experience_years": experience,
        "word_count": len(cleaned.split())
    }