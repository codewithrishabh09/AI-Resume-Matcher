import sys
import os
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..')
))

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

from app.ml.models.similarity import SimilarityModel
from app.ml.models.classifier import MatchClassifier


def generate_training_data():
    return pd.DataFrame([
        # Strong matches
        {
            "resume": "5 years Python FastAPI PostgreSQL Docker AWS Redis",
            "job": "Python developer FastAPI PostgreSQL Docker AWS",
            "label": 1
        },
        {
            "resume": "React JavaScript TypeScript NodeJS MongoDB 3 years",
            "job": "Frontend developer React JavaScript TypeScript",
            "label": 1
        },
        {
            "resume": "Java Spring Boot Kubernetes microservices 7 years",
            "job": "Java backend Spring Boot Kubernetes microservices",
            "label": 1
        },
        {
            "resume": "Data scientist Python pandas numpy scikit-learn 4 years",
            "job": "Data scientist machine learning Python scikit-learn",
            "label": 1
        },
        {
            "resume": "DevOps AWS Docker Kubernetes Jenkins Linux 6 years",
            "job": "DevOps engineer AWS Docker Kubernetes Jenkins",
            "label": 1
        },
        {
            "resume": "Python django postgresql rest api 3 years backend",
            "job": "Python backend developer django rest api postgresql",
            "label": 1
        },
        # Weak matches
        {
            "resume": "PHP Laravel MySQL WordPress 3 years",
            "job": "Python developer FastAPI PostgreSQL Docker AWS",
            "label": 0
        },
        {
            "resume": "Android Java Kotlin mobile 2 years",
            "job": "Frontend developer React JavaScript TypeScript",
            "label": 0
        },
        {
            "resume": "Manual QA testing selenium 1 year",
            "job": "Java backend Spring Boot Kubernetes microservices",
            "label": 0
        },
        {
            "resume": "Project manager agile scrum PMP 5 years",
            "job": "Data scientist machine learning Python scikit-learn",
            "label": 0
        },
        {
            "resume": "UI/UX designer figma photoshop 4 years",
            "job": "DevOps engineer AWS Docker Kubernetes Jenkins",
            "label": 0
        },
        {
            "resume": "Business analyst excel powerpoint 3 years",
            "job": "Python backend developer django rest api postgresql",
            "label": 0
        },
    ])


def train():
    print("=" * 50)
    print("  AI Resume Matcher — Model Training")
    print("=" * 50)

    # 1. Data
    print("\n📦 Generating training data...")
    df = generate_training_data()
    print(f"   Samples: {len(df)} "
          f"(+{df['label'].sum()} / -{len(df)-df['label'].sum()})")

    # 2. Features
    print("\n🔧 Building features...")
    sim_model = SimilarityModel()
    X, y = [], []

    for i, row in df.iterrows():
        print(f"   Processing sample {i+1}/{len(df)}...")
        vec = sim_model.feature_vector(row['resume'], row['job'])
        X.append(vec[0])
        y.append(row['label'])

    X = np.array(X)
    y = np.array(y)
    print(f"   Feature matrix: {X.shape}")

    # 3. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 4. Train
    print("\n🤖 Training XGBoost classifier...")
    classifier = MatchClassifier(model_type="xgboost")
    classifier.train(X_train, y_train)

    # 5. Evaluate
    print("\n📊 Evaluating...")
    y_pred = classifier.model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"   Accuracy: {acc:.3f}")
    print(classification_report(
        y_test, y_pred,
        target_names=['No Match', 'Match'],
        zero_division=0
    ))

    # 6. Save
    print("💾 Saving model...")
    classifier.save()
    print("\n✅ Training complete!")


if __name__ == "__main__":
    train()