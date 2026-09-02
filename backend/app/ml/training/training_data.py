"""Training data for ML model"""

TRAINING_SAMPLES = [
    # Sample 1: Good Match
    {
        "resume": {
            "skills": ["python", "django", "postgresql"],
            "years_of_experience": 5,
            "education": [{"degree": "BS", "field": "computer science"}],
            "job_titles": ["senior developer"],
            "certifications": ["aws"],
            "technologies": ["python", "django", "postgresql"]
        },
        "job": {
            "required_skills": ["python", "django", "postgresql"],
            "experience_required": 4,
            "education_required": ["BS"],
            "job_titles": ["senior developer"],
            "required_certifications": ["aws"],
            "tech_stack": ["python", "django", "postgresql"]
        },
        "match": 1  # Match!
    },
    
    # Sample 2: Poor Match
    {
        "resume": {
            "skills": ["marketing", "excel"],
            "years_of_experience": 2,
            "education": [{"degree": "BA", "field": "business"}],
            "job_titles": ["marketing manager"],
            "certifications": [],
            "technologies": []
        },
        "job": {
            "required_skills": ["python", "django", "react"],
            "experience_required": 4,
            "education_required": ["BS"],
            "job_titles": ["backend engineer"],
            "required_certifications": [],
            "tech_stack": ["python", "django", "react"]
        },
        "match": 0  # No match
    },
    
    # Add 13+ more samples...
]

def prepare_training_data():
    """Prepare X_train and y_train"""
    from app.ml.models.resume_matcher_model import ResumeMatcher
    import numpy as np
    
    matcher = ResumeMatcher()
    X_train = []
    y_train = []
    
    for sample in TRAINING_SAMPLES:
        features = matcher.prepare_features(sample["resume"], sample["job"])
        X_train.append(features[0])
        y_train.append(sample["match"])
    
    return np.array(X_train), np.array(y_train)