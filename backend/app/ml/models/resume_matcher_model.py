import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from typing import Dict, List

class ResumeMatcher:
    def __init__(self, model_type: str = "random_forest"):
        self.model_type = model_type
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            "skill_match",
            "experience_match", 
            "education_match",
            "technology_match",
            "certification_match",
            "title_match"
        ]
        
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            random_state=42,
            n_jobs=-1
        )
    
    def prepare_features(self, resume_data: Dict, job_data: Dict) -> np.ndarray:
        """Prepare features for model"""
        features = []
        
        # Skill match
        skill_match = self._safe_match(
            resume_data.get("skills", []),
            job_data.get("required_skills", [])
        )
        features.append(skill_match)
        
        # Experience match
        exp_match = self._safe_exp_match(
            resume_data.get("years_of_experience", 0),
            job_data.get("experience_required", 0)
        )
        features.append(exp_match)
        
        # Other matches (simplified)
        features.append(0.5)  # education_match
        features.append(0.5)  # technology_match
        features.append(0.5)  # certification_match
        features.append(0.5)  # title_match
        
        return np.array(features).reshape(1, -1)
    
    def _safe_match(self, resume_list: List, job_list: List) -> float:
        if not job_list:
            return 1.0
        matched = len(set(resume_list) & set(job_list))
        return matched / len(job_list)
    
    def _safe_exp_match(self, resume_years: int, job_years: int) -> float:
        if job_years == 0:
            return 1.0
        if resume_years >= job_years:
            return 1.0
        return resume_years / job_years if job_years > 0 else 0.0
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray, 
             model_path: str = "models/resume_matcher.pkl"):
        """Train the model"""
        print(f"Training {self.model_type} model...")
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_train_scaled, y_train)
        
        self.is_trained = True
        
        os.makedirs(os.path.dirname(model_path) or ".", exist_ok=True)
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, model_path.replace(".pkl", "_scaler.pkl"))
        
        print(f"✅ Model trained and saved to {model_path}")
    
    def load(self, model_path: str = "models/resume_matcher.pkl"):
        """Load trained model"""
        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(model_path.replace(".pkl", "_scaler.pkl"))
            self.is_trained = True
            print(f"✅ Model loaded from {model_path}")
        except:
            print(f"⚠️  Could not load model from {model_path}")
    
    def predict(self, resume_data: Dict, job_data: Dict) -> float:
        """Predict match score"""
        if not self.is_trained:
            return 50.0  # Default score
        
        try:
            features = self.prepare_features(resume_data, job_data)
            features_scaled = self.scaler.transform(features)
            match_score = self.model.predict_proba(features_scaled)[0][1]
            return round(match_score * 100, 2)
        except:
            return 50.0
    
    def predict_with_confidence(self, resume_data: Dict, job_data: Dict) -> Dict:
        """Predict with confidence"""
        score = self.predict(resume_data, job_data)
        
        return {
            "score": score,
            "confidence": 0.75,
            "interpretation": "🟢 Excellent Match" if score > 85 else "Good Match" if score > 70 else "Moderate Match"
        }
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict:
        """Evaluate model"""
        if not self.is_trained:
            return {}
        
        X_test_scaled = self.scaler.transform(X_test)
        y_pred = self.model.predict(X_test_scaled)
        
        return {
            "accuracy": round(accuracy_score(y_test, y_pred), 4),
            "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
            "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
            "f1": round(f1_score(y_test, y_pred, zero_division=0), 4),
        }