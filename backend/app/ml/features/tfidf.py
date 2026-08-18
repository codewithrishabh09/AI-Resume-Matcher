import pickle
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

ARTIFACTS_DIR = os.path.join(
    os.path.dirname(__file__), '..', 'artifacts'
)


class TFIDFFeatureExtractor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english'
        )
        self.is_fitted = False

    def fit(self, texts: list):
        """Fit vectorizer on list of texts."""
        self.vectorizer.fit(texts)
        self.is_fitted = True

    def transform(self, texts: list) -> np.ndarray:
        """Transform texts to TF-IDF vectors."""
        if not self.is_fitted:
            raise ValueError("Vectorizer not fitted yet.")
        return self.vectorizer.transform(texts).toarray()

    def fit_transform(self, texts: list) -> np.ndarray:
        """Fit and transform in one step."""
        self.fit(texts)
        return self.transform(texts)

    def save(self):
        """Save vectorizer to disk."""
        path = os.path.join(ARTIFACTS_DIR, "vectorizer.pkl")
        os.makedirs(ARTIFACTS_DIR, exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self.vectorizer, f)
        print(f"Vectorizer saved → {path}")

    def load(self):
        """Load vectorizer from disk."""
        path = os.path.join(ARTIFACTS_DIR, "vectorizer.pkl")
        if not os.path.exists(path):
            raise FileNotFoundError(f"No vectorizer found at {path}")
        with open(path, "rb") as f:
            self.vectorizer = pickle.load(f)
        self.is_fitted = True
        print(f"Vectorizer loaded ← {path}")