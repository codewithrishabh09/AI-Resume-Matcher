import sys
import os
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..')
))

from app.ml.inference.matcher import match_resume_to_job


def test_prediction():
    resume = """
    Senior Python developer with 5 years experience.
    Skills: Python, FastAPI, PostgreSQL, Docker, AWS, Redis, Git.
    Worked on REST APIs and microservices architecture.
    """

    job = """
    We need a Python Backend Developer.
    Required: Python, FastAPI, PostgreSQL, Docker, AWS.
    3+ years experience required.
    """

    print("=" * 50)
    print("  Resume Matching Prediction")
    print("=" * 50)

    result = match_resume_to_job(resume, job)

    print(f"\n📊 Match Score:      {result['match_score']}%")
    print(f"🎯 Recommendation:   {result['recommendation']}")
    print(f"🔗 Semantic Score:   {result['semantic_similarity']}%")
    print(f"🛠  Skill Match:      {result['skill_match_percentage']}%")
    print(f"✅ Matching Skills:  {result['matching_skills']}")
    print(f"❌ Missing Skills:   {result['missing_skills']}")
    print(f"📅 Experience:       {result['experience_years']} years")


if __name__ == "__main__":
    test_prediction()