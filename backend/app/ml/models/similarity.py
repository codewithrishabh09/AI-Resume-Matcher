import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.ml.features.embeddings import SemanticEmbedder
from app.ml.preprocessing.skill_extractor import (
    extract_skills, get_skill_gap
)
from app.ml.preprocessing.text_cleaner import extract_experience_years


class SimilarityModel:
    def __init__(self):
        self.embedder = SemanticEmbedder()

    def compute_features(
        self, resume_text: str, job_text: str
    ) -> dict:
        """Compute all similarity features."""

        # 1. Semantic similarity
        sem_score = self.embedder.similarity(resume_text, job_text)

        # 2. Skill analysis
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_text)
        skill_gap = get_skill_gap(resume_skills, job_skills)

        # 3. Experience
        exp_years = extract_experience_years(resume_text)

        # 4. Word overlap
        r_words = set(resume_text.lower().split())
        j_words = set(job_text.lower().split())
        overlap = len(r_words & j_words) / max(len(j_words), 1)

        return {
            "semantic_score": sem_score,
            "skill_match_pct": skill_gap['match_percentage'] / 100,
            "experience_score": min(exp_years / 10, 1.0),
            "word_overlap": overlap,
            "resume_skill_count": len(resume_skills),
            "job_skill_count": len(job_skills),
            "matched_skill_count": len(skill_gap['matching_skills']),
            # Full details
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            "matching_skills": skill_gap['matching_skills'],
            "missing_skills": skill_gap['missing_skills'],
            "experience_years": exp_years,
            "skill_gap": skill_gap
        }

    def feature_vector(
        self, resume_text: str, job_text: str
    ) -> np.ndarray:
        """Return feature vector for ML model."""
        f = self.compute_features(resume_text, job_text)
        return np.array([[
            f['semantic_score'],
            f['skill_match_pct'],
            f['experience_score'],
            f['word_overlap'],
            f['resume_skill_count'],
            f['job_skill_count'],
            f['matched_skill_count'],
        ]])