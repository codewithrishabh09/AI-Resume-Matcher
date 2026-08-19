import sys
import os
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..')
))

import numpy as np
import pandas as pd
import pickle
import matplotlib
matplotlib.use('Agg')  # non-interactive backend
import matplotlib.pyplot as plt
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve
)
from ml.src.train import generate_training_data, build_features
from app.ml.models.similarity import SimilarityModel

ARTIFACTS_DIR = "app/ml/artifacts"


def load_model():
    """Load trained model from artifacts."""
    model_path = os.path.join(ARTIFACTS_DIR, "model.pkl")
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            "No model found. Run train.py first."
        )
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    print(f"Model loaded from {model_path}")
    return model


def evaluate_model():
    print("=" * 55)
    print("  AI Resume Matcher — Model Evaluation")
    print("=" * 55)

    # 1. Load data
    print("\n📦 Loading data...")
    df = generate_training_data()
    print(f"   Total samples: {len(df)}")

    # 2. Build features
    print("\n🔧 Building features...")
    sim_model = SimilarityModel()
    X, y = [], []

    for i, row in df.iterrows():
        vec = sim_model.feature_vector(
            row['resume'], row['job']
        )
        X.append(vec[0])
        y.append(row['label'])

    X = np.array(X)
    y = np.array(y)

    # 3. Load model
    print("\n📂 Loading model...")
    model = load_model()

    # 4. Predictions
    print("\n🔮 Running predictions...")
    y_pred = model.predict(X)
    y_prob = model.predict_proba(X)[:, 1]

    # 5. Metrics
    print("\n📊 Evaluation Metrics:")
    print("-" * 40)

    acc = accuracy_score(y, y_pred)
    prec = precision_score(y, y_pred, zero_division=0)
    rec = recall_score(y, y_pred, zero_division=0)
    f1 = f1_score(y, y_pred, zero_division=0)

    try:
        auc = roc_auc_score(y, y_prob)
    except Exception:
        auc = 0.0

    print(f"   Accuracy:  {acc:.4f} ({acc*100:.1f}%)")
    print(f"   Precision: {prec:.4f}")
    print(f"   Recall:    {rec:.4f}")
    print(f"   F1 Score:  {f1:.4f}")
    print(f"   AUC-ROC:   {auc:.4f}")
    print("-" * 40)

    # 6. Classification Report
    print("\n📋 Classification Report:")
    print(classification_report(
        y, y_pred,
        target_names=["No Match", "Match"],
        zero_division=0
    ))

    # 7. Confusion Matrix
    print("🔢 Confusion Matrix:")
    cm = confusion_matrix(y, y_pred)
    print(f"   True Negative:  {cm[0][0]}")
    print(f"   False Positive: {cm[0][1]}")
    print(f"   False Negative: {cm[1][0]}")
    print(f"   True Positive:  {cm[1][1]}")

    # 8. Feature Importance
    print("\n🎯 Feature Importance:")
    feature_names = [
        "Semantic Score",
        "Skill Match %",
        "Experience Score",
        "Word Overlap",
        "Resume Skill Count",
        "Job Skill Count",
        "Matched Skill Count"
    ]
    importances = model.feature_importances_
    for name, imp in sorted(
        zip(feature_names, importances),
        key=lambda x: x[1],
        reverse=True
    ):
        bar = "█" * int(imp * 40)
        print(f"   {name:<22} {imp:.4f} {bar}")

    # 9. Sample Predictions
    print("\n🧪 Sample Predictions:")
    print("-" * 40)
    for i, (row, pred, prob) in enumerate(
        zip(df.itertuples(), y_pred, y_prob)
    ):
        label = "✅ Match" if pred == 1 else "❌ No Match"
        actual = "✅ Match" if row.label == 1 else "❌ No Match"
        correct = "✓" if pred == row.label else "✗"
        print(f"   [{correct}] Sample {i+1}: "
              f"Predicted={label} "
              f"Actual={actual} "
              f"Prob={prob:.2f}")

    # 10. Save plots
    print("\n💾 Saving evaluation plots...")
    os.makedirs("ml/data/processed", exist_ok=True)
    _save_confusion_matrix(cm)
    _save_feature_importance(feature_names, importances)

    print("\n✅ Evaluation complete!")
    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "auc_roc": auc
    }


def _save_confusion_matrix(cm):
    """Save confusion matrix plot."""
    fig, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.colorbar(im)
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(["No Match", "Match"])
    ax.set_yticklabels(["No Match", "Match"])
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix")

    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i][j]),
                   ha="center", va="center",
                   color="white" if cm[i][j] > cm.max()/2 else "black",
                   fontsize=16)

    plt.tight_layout()
    path = "ml/data/processed/confusion_matrix.png"
    plt.savefig(path)
    plt.close()
    print(f"   Confusion matrix saved → {path}")


def _save_feature_importance(names, importances):
    """Save feature importance plot."""
    fig, ax = plt.subplots(figsize=(8, 5))
    sorted_idx = np.argsort(importances)
    ax.barh(
        [names[i] for i in sorted_idx],
        [importances[i] for i in sorted_idx],
        color='steelblue'
    )
    ax.set_xlabel("Importance")
    ax.set_title("Feature Importance")
    plt.tight_layout()
    path = "ml/data/processed/feature_importance.png"
    plt.savefig(path)
    plt.close()
    print(f"   Feature importance saved → {path}")


if __name__ == "__main__":
    evaluate_model()