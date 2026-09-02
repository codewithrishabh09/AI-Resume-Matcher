from app.ml.models.similarity import SimilarityModel

# Singleton — loaded once at startup
_similarity_model = None


def _get_similarity_model() -> SimilarityModel:
    """Get or create SimilarityModel singleton."""
    global _similarity_model
    if _similarity_model is None:
        _similarity_model = SimilarityModel()
    return _similarity_model


def _get_recommendation(score: float) -> str:
    if score >= 85:
        return "Excellent Match — Highly Recommended"
    elif score >= 70:
        return "Good Match — Worth Considering"
    elif score >= 50:
        return "Moderate Match — May Need Upskilling"
    else:
        return "Low Match — Significant Skill Gap"


def match_resume_to_job(
    resume_text: str,
    job_text: str
) -> dict:
    """
    Main matching function used by FastAPI.
    Accepts two raw text strings and returns a full result dict.
    """
    try:
        model = _get_similarity_model()
        features = model.compute_features(resume_text, job_text)

        semantic_similarity = round(features["semantic_score"] * 100, 2)
        skill_match_pct = round(features["skill_match_pct"] * 100, 2)
        experience_years = features.get("experience_years", 0)
        matching_skills = features.get("matching_skills", [])
        missing_skills = features.get("missing_skills", [])

        # Weighted composite score: 60% semantic + 40% skill match
        match_score = round(
            (semantic_similarity * 0.6) + (skill_match_pct * 0.4), 2
        )

        return {
            "match_score": match_score,
            "semantic_similarity": semantic_similarity,
            "skill_match_percentage": skill_match_pct,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "experience_years": experience_years,
            "recommendation": _get_recommendation(match_score),
        }

    except Exception as e:
        print(f"⚠️  match_resume_to_job error: {e}")
        # Return safe fallback with all required keys
        return {
            "match_score": 0.0,
            "semantic_similarity": 0.0,
            "skill_match_percentage": 0.0,
            "matching_skills": [],
            "missing_skills": [],
            "experience_years": 0,
            "recommendation": "Error during matching — please try again.",
        }