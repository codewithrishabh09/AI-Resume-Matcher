import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer


class SemanticEmbedder:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print(f"Loading embedder: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.model_name = model_name

    def encode(self, texts: list) -> np.ndarray:
        """Encode list of texts to embeddings."""
        return self.model.encode(texts, convert_to_numpy=True)

    def similarity(self, text1: str, text2: str) -> float:
        """Compute cosine similarity between two texts."""
        emb1 = self.encode([text1])
        emb2 = self.encode([text2])
        score = cosine_similarity(emb1, emb2)[0][0]
        return float(round(score, 4))

    def batch_similarity(
        self, query: str, candidates: list
    ) -> list:
        """Compute similarity between one query and many candidates."""
        query_emb = self.encode([query])
        cand_emb = self.encode(candidates)
        scores = cosine_similarity(query_emb, cand_emb)[0]
        return [float(round(s, 4)) for s in scores]