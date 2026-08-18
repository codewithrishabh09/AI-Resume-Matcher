import pickle
import os
import numpy as np
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier

ARTIFACTS_DIR = os.path.join(
    os.path.dirname(__file__), '..', 'artifacts'
)


class MatchClassifier:
    def __init__(self, model_type: str = "xgboost"):
        self.model_type = model_type
        self.model = None
        self.is_trained = False

    def build(self):
        """Initialize model."""
        if self.model_type == "xgboost":
            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=4,
                learning_rate=0.1,
                random_state=42,
                eval_metric='logloss'
            )
        else:
            self.model = RandomForestClassifier(
                n_estimators=100,
                random_state=42
            )

    def train(self, X: np.ndarray, y: np.ndarray):
        """Train the model."""
        if self.model is None:
            self.build()
        self.model.fit(X, y)
        self.is_trained = True

    def predict_score(self, X: np.ndarray) -> float:
        """Return match score 0-100."""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        prob = self.model.predict_proba(X)[0][1]
        return round(float(prob) * 100, 2)

    def save(self):
        """Save model to artifacts."""
        os.makedirs(ARTIFACTS_DIR, exist_ok=True)
        path = os.path.join(ARTIFACTS_DIR, "model.pkl")
        with open(path, "wb") as f:
            pickle.dump(self.model, f)
        print(f"Model saved → {path}")

    def load(self):
        """Load model from artifacts."""
        path = os.path.join(ARTIFACTS_DIR, "model.pkl")
        if not os.path.exists(path):
            raise FileNotFoundError(f"No model at {path}. Run training first.")
        with open(path, "rb") as f:
            self.model = pickle.load(f)
        self.is_trained = True
        print(f"Model loaded ← {path}")