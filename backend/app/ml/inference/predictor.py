import numpy as np
from app.ml.models.similarity import SimilarityModel
from app.ml.models.classifier import MatchClassifier


class Predictor:
    def __init__(self):
        self.similarity_model = SimilarityModel()
        self.classifier = MatchClassifier()
        try:
            self.classifier.load()
            self.use_ml = True
        except FileNotFoundError:
            print("⚠️  No trained model — using similarity score only")
            self.use_ml = False

    def predict(self, resume_text: str, job_text: str) -> dict:
        """Run full prediction pipeline."""

        # 1. Compute features
        features = self.similarity_model.compute_features(
            resume_text, job_text
        )
        feature_vector = self.similarity_model.feature_vector(
            resume_text, job_text
        )

        # 2. Get match score
        if self.use_ml:
            match_score = self.classifier.predict_score(feature_vector)
        else:
            # Fallback: weighted average of features
            match_score = round(
                (features['semantic_score'] * 0.4 +
                 features['skill_match_pct'] * 0.5 +
                 features['experience_score'] * 0.1) * 100, 2
            )

        # 3. Build recommendation
        if match_score >= 75:
            recommendation = "Strong Match ✅"
        elif match_score >= 50:
            recommendation = "Partial Match ⚠️"
        else:
            recommendation = "Weak Match ❌"

        return {
            "match_score": match_score,
            "recommendation": recommendation,
            "semantic_similarity": round(
                features['semantic_score'] * 100, 2
            ),
            "skill_match_percentage": features['skill_gap']['match_percentage'],
            "matching_skills": features['matching_skills'],
            "missing_skills": features['missing_skills'],
            "experience_years": features['experience_years'],
            "resume_skills": features['resume_skills'],
            "job_skills": features['job_skills']
        }