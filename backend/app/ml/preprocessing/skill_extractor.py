import re
from typing import List, Dict

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

JOB_TITLES = [
    "software engineer", "senior developer", "junior developer",
    "full stack developer", "backend engineer", "frontend engineer",
    "devops engineer", "data scientist", "machine learning engineer",
    "cloud architect", "solutions architect", "tech lead",
]

CERTIFICATIONS_DB = [
    "aws", "azure", "gcp", "kubernetes", "docker",
    "cissp", "comptia", "pmp", "agile", "scrum master",
]

def extract_skills(text: str) -> list:
    """Extract skills from text"""
    text_lower = text.lower()
    found = []
    for skill in SKILLS_DB:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)
    return list(set(found))

def extract_experience(text: str) -> List[Dict]:
    """Extract job experience"""
    experience = []
    text_lower = text.lower()
    
    pattern = r'([a-z\s&,\.]+)\s+(?:at|@)\s+([a-z\s&,\.]+?)(?:\n|,|[0-9]{4})'
    matches = re.finditer(pattern, text_lower, re.IGNORECASE)
    
    for match in matches:
        title = match.group(1).strip()
        company = match.group(2).strip()
        if title and company and len(title) < 50 and len(company) < 50:
            experience.append({"title": title, "company": company})
    
    return list({(e['title'], e['company']): e for e in experience}.values())

def extract_education(text: str) -> List[Dict]:
    """Extract education"""
    education = []
    text_lower = text.lower()
    
    degrees = ["BS", "BA", "MS", "MA", "PhD", "MBA", "B.Tech", "M.Tech"]
    fields = ["computer science", "software engineering", "data science"]
    
    for degree in degrees:
        for field in fields:
            pattern = rf'{degree}\s+(?:in|of)?\s+{field}'
            if re.search(pattern, text_lower, re.IGNORECASE):
                education.append({"degree": degree, "field": field})
    
    return list({(e['degree'], e['field']): e for e in education}.values())

def extract_certifications(text: str) -> List[str]:
    """Extract certifications"""
    text_lower = text.lower()
    found_certs = []
    
    for cert in CERTIFICATIONS_DB:
        pattern = r'\b' + re.escape(cert) + r'\b'
        if re.search(pattern, text_lower):
            found_certs.append(cert)
    
    return list(set(found_certs))

def calculate_years_experience(text: str) -> int:
    """Extract years of experience"""
    text_lower = text.lower()
    pattern = r'(\d+)\+?\s+(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)'
    matches = re.findall(pattern, text_lower, re.IGNORECASE)
    
    if matches:
        return max([int(m) for m in matches])
    return 0

def extract_job_titles(text: str) -> List[str]:
    """Extract job titles"""
    text_lower = text.lower()
    found_titles = []
    
    for title in JOB_TITLES:
        pattern = r'\b' + re.escape(title) + r'\b'
        if re.search(pattern, text_lower):
            found_titles.append(title)
    
    return list(set(found_titles))

def extract_all_features(text: str) -> Dict:
    """Extract all resume features"""
    return {
        "skills": extract_skills(text),
        "experience": extract_experience(text),
        "education": extract_education(text),
        "certifications": extract_certifications(text),
        "years_of_experience": calculate_years_experience(text),
        "job_titles": extract_job_titles(text),
    }

def get_skill_gap(resume_skills: list, job_skills: list) -> dict:
    """Calculate skill gap"""
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

def calculate_overall_match(resume_features: Dict, job_data: Dict) -> Dict:
    """Calculate comprehensive match score"""
    
    def safe_match(resume_list, job_list):
        if not job_list:
            return 100.0
        matched = len(set(resume_list) & set(job_list))
        return (matched / len(job_list)) * 100
    
    def safe_exp_match(resume_years, required_years):
        if not required_years or required_years == 0:
            return 100.0
        if resume_years >= required_years:
            return 100.0
        return (resume_years / required_years) * 100
    
    skill_match = safe_match(
        resume_features.get("skills", []),
        job_data.get("required_skills", [])
    )
    
    exp_match = safe_exp_match(
        resume_features.get("years_of_experience", 0),
        job_data.get("experience_required", 0)
    )
    
    overall = (skill_match * 0.6) + (exp_match * 0.4)
    
    return {
        "overall_score": round(overall, 2),
        "skill_match": round(skill_match, 2),
        "experience_match": round(exp_match, 2),
    }