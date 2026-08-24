import re

STOP_WORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at',
    'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was',
    'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
    'it', 'its', 'they', 'their', 'what', 'which', 'who',
    'as', 'if', 'then', 'than', 'so', 'yet', 'both', 'not'
}


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^\w\s\-]', ' ', text)
    text = ' '.join(text.split())
    return text


def remove_stopwords(text: str) -> str:
    tokens = text.split()
    filtered = [w for w in tokens if w not in STOP_WORDS]
    return ' '.join(filtered)


def extract_experience_years(text: str) -> int:
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
    cleaned = clean_text(text)
    filtered = remove_stopwords(cleaned)
    experience = extract_experience_years(text)
    return {
        "cleaned_text": cleaned,
        "filtered_text": filtered,
        "experience_years": experience,
        "word_count": len(cleaned.split())
    }