from typing import Dict

class Predictor:
    def __init__(self):
        self.matcher = None
        try:
            from app.ml.models.resume_matcher_model import ResumeMatcher
            self.matcher = ResumeMatcher()
            try:
                self.matcher.load("models/resume_matcher_rf.pkl")
            except:
                pass
        except Exception as e:
            print(f"⚠️  Predictor init error: {e}")
    
    def predict(self, resume_features: Dict, job_data: Dict) -> float:
        """Predict match score"""
        if not self.matcher:
            return 50.0
        return self.matcher.predict(resume_features, job_data)
    
    def predict_with_confidence(self, resume_features: Dict, job_data: Dict) -> Dict:
        """Predict with confidence"""
        if not self.matcher:
            return {"score": 50.0, "confidence": 0.0, "interpretation": "Unknown"}
        return self.matcher.predict_with_confidence(resume_features, job_data)