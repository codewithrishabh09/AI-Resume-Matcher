"""
Training data for Resume Matcher ML model.
Each sample contains a resume, job description, and whether it's a match (1) or not (0).
"""

TRAINING_SAMPLES = [
    # Sample 1: Perfect Match - Senior Python Developer
    {
        "resume": {
            "skills": ["python", "sql", "django", "rest api", "postgresql"],
            "years_of_experience": 6,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["senior developer", "software engineer"],
            "certifications": [],
            "technologies": ["python", "django", "postgresql"]
        },
        "job": {
            "required_skills": ["python", "sql", "django", "rest api"],
            "experience_required": 5,
            "education_required": ["BS"],
            "job_titles": ["senior developer"],
            "required_certifications": [],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 1  # Good match
    },
    
    # Sample 2: Good Match - Full Stack Developer
    {
        "resume": {
            "skills": ["javascript", "python", "react", "nodejs", "postgresql", "mongodb"],
            "years_of_experience": 4,
            "education": [{"degree": "BS", "field": "information technology"}],
            "job_titles": ["full stack developer"],
            "certifications": ["aws"],
            "technologies": ["javascript", "react", "nodejs", "python"]
        },
        "job": {
            "required_skills": ["javascript", "react", "nodejs", "sql"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["full stack developer"],
            "required_certifications": [],
            "tech_stack": ["javascript", "react", "nodejs"]
        },
        "match": 1  # Good match
    },
    
    # Sample 3: Moderate Match - Junior with some skills
    {
        "resume": {
            "skills": ["python", "html", "css", "javascript", "git"],
            "years_of_experience": 1,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["junior developer"],
            "certifications": [],
            "technologies": ["python", "javascript"]
        },
        "job": {
            "required_skills": ["python", "django", "postgresql", "rest api"],
            "experience_required": 2,
            "education_required": ["BS"],
            "job_titles": ["backend engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 0  # Poor match - too junior, missing key skills
    },
    
    # Sample 4: Good Match - DevOps Engineer
    {
        "resume": {
            "skills": ["docker", "kubernetes", "aws", "terraform", "linux", "ci/cd"],
            "years_of_experience": 5,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["devops engineer"],
            "certifications": ["aws"],
            "technologies": ["docker", "kubernetes", "aws"]
        },
        "job": {
            "required_skills": ["docker", "kubernetes", "aws", "terraform"],
            "experience_required": 4,
            "education_required": ["BS"],
            "job_titles": ["devops engineer", "cloud engineer"],
            "required_certifications": ["aws"],
            "tech_stack": ["docker", "kubernetes", "aws"]
        },
        "match": 1  # Excellent match
    },
    
    # Sample 5: Poor Match - Data Scientist applying for Backend
    {
        "resume": {
            "skills": ["python", "pandas", "numpy", "tensorflow", "machine learning", "sql"],
            "years_of_experience": 4,
            "education": [{"degree": "MS", "field": "data science"}],
            "job_titles": ["data scientist"],
            "certifications": [],
            "technologies": ["python", "tensorflow", "pandas"]
        },
        "job": {
            "required_skills": ["javascript", "react", "nodejs", "postgresql"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["frontend developer"],
            "required_certifications": [],
            "tech_stack": ["javascript", "react", "nodejs"]
        },
        "match": 0  # Poor match - completely different domain
    },
    
    # Sample 6: Good Match - React Developer
    {
        "resume": {
            "skills": ["javascript", "typescript", "react", "vue", "css", "html", "rest api"],
            "years_of_experience": 3,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["frontend engineer", "react developer"],
            "certifications": [],
            "technologies": ["javascript", "typescript", "react"]
        },
        "job": {
            "required_skills": ["javascript", "react", "typescript", "css"],
            "experience_required": 2,
            "education_required": ["BS"],
            "job_titles": ["frontend engineer"],
            "required_certifications": [],
            "tech_stack": ["javascript", "react", "typescript"]
        },
        "match": 1  # Great match
    },
    
    # Sample 7: Moderate Match - Java to Python transition
    {
        "resume": {
            "skills": ["java", "spring", "sql", "python", "git", "microservices"],
            "years_of_experience": 5,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["software engineer"],
            "certifications": [],
            "technologies": ["java", "spring", "python"]
        },
        "job": {
            "required_skills": ["python", "django", "postgresql", "rest api"],
            "experience_required": 4,
            "education_required": ["BS"],
            "job_titles": ["backend engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 0  # Moderate - has experience but different tech stack
    },
    
    # Sample 8: Excellent Match - Senior Full Stack with all requirements
    {
        "resume": {
            "skills": ["python", "javascript", "django", "react", "postgresql", "mongodb", "docker", "aws"],
            "years_of_experience": 8,
            "education": [{"degree": "BS", "field": "computer science"}, {"degree": "MS", "field": "software engineering"}],
            "job_titles": ["senior developer", "tech lead", "full stack developer"],
            "certifications": ["aws"],
            "technologies": ["python", "javascript", "django", "react", "docker", "aws"]
        },
        "job": {
            "required_skills": ["python", "javascript", "django", "react", "postgresql"],
            "experience_required": 6,
            "education_required": ["BS", "MS"],
            "job_titles": ["senior developer", "tech lead"],
            "required_certifications": ["aws"],
            "tech_stack": ["python", "javascript", "django", "react"]
        },
        "match": 1  # Excellent match
    },
    
    # Sample 9: Poor Match - Bootcamp grad missing experience
    {
        "resume": {
            "skills": ["javascript", "react", "html", "css"],
            "years_of_experience": 0,
            "education": [],
            "job_titles": [],
            "certifications": [],
            "technologies": ["javascript", "react"]
        },
        "job": {
            "required_skills": ["python", "django", "postgresql", "rest api"],
            "experience_required": 4,
            "education_required": ["BS"],
            "job_titles": ["senior developer"],
            "required_certifications": ["aws"],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 0  # Very poor match
    },
    
    # Sample 10: Good Match - Cloud Architect
    {
        "resume": {
            "skills": ["aws", "gcp", "azure", "kubernetes", "terraform", "docker", "microservices"],
            "years_of_experience": 7,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["cloud architect", "solutions architect"],
            "certifications": ["aws"],
            "technologies": ["aws", "kubernetes", "terraform"]
        },
        "job": {
            "required_skills": ["aws", "kubernetes", "terraform"],
            "experience_required": 5,
            "education_required": ["BS"],
            "job_titles": ["cloud architect"],
            "required_certifications": ["aws"],
            "tech_stack": ["aws", "kubernetes", "terraform"]
        },
        "match": 1  # Excellent match
    },
    
    # Sample 11: Moderate Match - Similar but not exact skills
    {
        "resume": {
            "skills": ["python", "postgresql", "flask", "rest api", "git"],
            "years_of_experience": 3,
            "education": [{"degree": "BS", "field": "information technology"}],
            "job_titles": ["backend developer"],
            "certifications": [],
            "technologies": ["python", "flask", "postgresql"]
        },
        "job": {
            "required_skills": ["python", "django", "postgresql"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["backend engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 1  # Good match - Flask vs Django is similar
    },
    
    # Sample 12: Poor Match - Marketing person applying for engineer role
    {
        "resume": {
            "skills": ["marketing", "analytics", "seo", "google analytics"],
            "years_of_experience": 5,
            "education": [{"degree": "BA", "field": "marketing"}],
            "job_titles": ["marketing manager"],
            "certifications": [],
            "technologies": []
        },
        "job": {
            "required_skills": ["python", "javascript", "react"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["software engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "javascript", "react"]
        },
        "match": 0  # No match at all
    },
]

# Extended training data for better model
EXTENDED_TRAINING_SAMPLES = [
    # Sample 13: Partial Match - Database skills
    {
        "resume": {
            "skills": ["sql", "postgresql", "mongodb", "elasticsearch"],
            "years_of_experience": 4,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": [],
            "certifications": [],
            "technologies": ["postgresql", "mongodb"]
        },
        "job": {
            "required_skills": ["python", "sql", "postgresql"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["backend engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "postgresql"]
        },
        "match": 0  # Missing python skills
    },
    
    # Sample 14: Good Match - Mobile Developer
    {
        "resume": {
            "skills": ["kotlin", "java", "swift", "android", "ios", "rest api"],
            "years_of_experience": 4,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["android developer", "mobile engineer"],
            "certifications": [],
            "technologies": ["kotlin", "java", "swift"]
        },
        "job": {
            "required_skills": ["kotlin", "android", "java", "rest api"],
            "experience_required": 3,
            "education_required": ["BS"],
            "job_titles": ["android developer"],
            "required_certifications": [],
            "tech_stack": ["kotlin", "java", "android"]
        },
        "match": 1  # Great match
    },
    
    # Sample 15: Good Match - Overqualified but suitable
    {
        "resume": {
            "skills": ["python", "javascript", "go", "rust", "django", "react", "kubernetes", "aws"],
            "years_of_experience": 10,
            "education": [{"degree": "BS", "field": "computer science"}, {"degree": "MS", "field": "computer science"}],
            "job_titles": ["staff engineer", "senior architect"],
            "certifications": ["aws"],
            "technologies": ["python", "go", "kubernetes", "aws"]
        },
        "job": {
            "required_skills": ["python", "javascript"],
            "experience_required": 2,
            "education_required": ["BS"],
            "job_titles": ["junior developer"],
            "required_certifications": [],
            "tech_stack": ["python", "javascript"]
        },
        "match": 1  # Good match (overqualified but suitable)
    },
]


def get_training_data():
    """Get all training samples"""
    return TRAINING_SAMPLES + EXTENDED_TRAINING_SAMPLES


def get_training_data_basic():
    """Get only basic training samples"""
    return TRAINING_SAMPLES


def save_training_data(filepath: str = "training_data.json"):
    """
    Save training data to JSON file.
    
    Args:
        filepath: Path to save the training data
    """
    import json
    
    data = {
        "samples": get_training_data(),
        "total_samples": len(get_training_data()),
        "positive_matches": sum(1 for s in get_training_data() if s["match"] == 1),
        "negative_matches": sum(1 for s in get_training_data() if s["match"] == 0),
    }
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Training data saved to {filepath}")
    print(f"   Total samples: {data['total_samples']}")
    print(f"   Positive matches: {data['positive_matches']}")
    print(f"   Negative matches: {data['negative_matches']}")


def load_training_data(filepath: str = "training_data.json"):
    """
    Load training data from JSON file.
    
    Args:
        filepath: Path to load the training data
    
    Returns:
        List of training samples
    """
    import json
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            return data.get("samples", [])
    except FileNotFoundError:
        print(f"File {filepath} not found. Using default training data.")
        return get_training_data()


def prepare_training_data():
    """
    Prepare training data for model training.
    
    Returns:
        X_train (features), y_train (labels)
    """
    from ml.resume_matcher_model import ResumeMatcher
    import numpy as np
    
    # Get training samples
    samples = get_training_data()
    
    # Initialize matcher to prepare features
    matcher = ResumeMatcher()
    
    X_train = []
    y_train = []
    
    for sample in samples:
        # Prepare features
        features = matcher.prepare_features(sample["resume"], sample["job"])
        X_train.append(features[0])
        y_train.append(sample["match"])
    
    X_train = np.array(X_train)
    y_train = np.array(y_train)
    
    print(f"✅ Training data prepared")
    print(f"   X_train shape: {X_train.shape}")
    print(f"   y_train shape: {y_train.shape}")
    print(f"   Positive samples: {sum(y_train)}")
    print(f"   Negative samples: {len(y_train) - sum(y_train)}")
    
    return X_train, y_train


if __name__ == "__main__":
    # Save training data to JSON
    save_training_data("training_data.json")
    
    # Prepare training data
    X_train, y_train = prepare_training_data()