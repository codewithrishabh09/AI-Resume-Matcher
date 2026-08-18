from app.ml.inference.predictor import Predictor

# Singleton predictor — loaded once at startup
_predictor = None


def get_predictor() -> Predictor:
    """Get or create predictor singleton."""
    global _predictor
    if _predictor is None:
        _predictor = Predictor()
    return _predictor


def match_resume_to_job(
    resume_text: str,
    job_text: str
) -> dict:
    """Main matching function used by FastAPI."""
    predictor = get_predictor()
    return predictor.predict(resume_text, job_text)