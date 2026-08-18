import re

SKILLS_DB = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#",
    "go", "rust", "php", "ruby", "swift", "kotlin", "scala",
    # Web Frameworks
    "django", "flask", "fastapi", "react", "vue", "angular",
    "spring", "nodejs", "express", "nextjs", "laravel",
    # Databases
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "sqlite", "oracle", "cassandra", "dynamodb",
    # DevOps & Cloud
    "docker", "kubernetes", "aws", "gcp", "azure", "jenkins",
    "git", "linux", "terraform", "ansible", "ci/cd",
    # ML & Data
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "nlp", "computer vision",
    "data science", "sql", "tableau", "power bi",
    # Other
    "rest api", "graphql", "html", "css", "agile",
    "scrum", "microservices", "system design"
]


def extract_skills(text: str) -> list:
    """Extract skills from text using skills database."""
    text_lower = text.lower()
    found = []
    for skill in SKILLS_DB:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return found


def get_skill_gap(resume_skills: list, job_skills: list) -> dict:
    """Calculate skill gap between resume and job."""
    resume_set = set(s.lower() for s in resume_skills)
    job_set = set(s.lower() for s in job_skills)

    matching = list(resume_set & job_set)
    missing = list(job_set - resume_set)
    extra = list(resume_set - job_set)

    match_pct = (
        round((len(matching) / len(job_set)) * 100, 2)
        if job_set else 0.0
    )

    return {
        "matching_skills": matching,
        "missing_skills": missing,
        "extra_skills": extra,
        "match_percentage": match_pct,
        "total_required": len(job_set),
        "total_matched": len(matching)
    }