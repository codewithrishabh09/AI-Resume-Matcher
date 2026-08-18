from app.ml.preprocessing.skill_extractor import extract_skills, get_skill_gap


def analyze_skill_gap(resume_text: str, job_description: str) -> dict:
    """Analyze skill gap between resume and job."""
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    gap = get_skill_gap(resume_skills, job_skills)

    return {
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matching_skills": gap["matching_skills"],
        "missing_skills": gap["missing_skills"],
        "extra_skills": gap["extra_skills"],
        "match_percentage": gap["match_percentage"],
        "total_required": gap["total_required"],
        "total_matched": gap["total_matched"]
    }


def get_skill_recommendations(missing_skills: list) -> list:
    """Return learning recommendations for missing skills."""
    recommendations = {
        "python": "Learn Python at python.org or freeCodeCamp",
        "fastapi": "FastAPI docs at fastapi.tiangolo.com",
        "docker": "Docker getting started at docs.docker.com",
        "postgresql": "PostgreSQL tutorial at postgresql.org",
        "aws": "AWS free tier + Cloud Practitioner certification",
        "kubernetes": "Kubernetes basics at kubernetes.io",
        "react": "React docs at react.dev",
        "machine learning": "Andrew Ng ML course on Coursera",
        "django": "Django docs at djangoproject.com",
        "git": "Git tutorial at git-scm.com",
    }

    return [
        {
            "skill": skill,
            "resource": recommendations.get(
                skill, f"Search '{skill} tutorial' on YouTube or Udemy"
            )
        }
        for skill in missing_skills
    ]