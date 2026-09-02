#!/usr/bin/env python3
"""
Complete training pipeline script
Train the Resume Matcher ML model.
This script prepares data and trains the model on resume-job pairs.
"""

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.resume_matcher_model import ResumeMatcher
from data.training_data import get_training_data, prepare_training_data


def main():
    """Main training function"""
    
    print("=" * 60)
    print("🚀 Resume Matcher ML Model Training")
    print("=" * 60)
    
    # Step 1: Prepare training data
    print("\n📊 Step 1: Preparing training data...")
    X_train, y_train = prepare_training_data()
    
    print(f"\n   Dataset Statistics:")
    print(f"   ├─ Total samples: {len(X_train)}")
    print(f"   ├─ Positive matches: {sum(y_train)} ({sum(y_train)/len(y_train)*100:.1f}%)")
    print(f"   ├─ Negative matches: {len(y_train) - sum(y_train)} ({(len(y_train)-sum(y_train))/len(y_train)*100:.1f}%)")
    print(f"   └─ Features: {X_train.shape[1]}")
    
    # Step 2: Split data
    print("\n📈 Step 2: Splitting data...")
    X_train_split, X_test, y_train_split, y_test = train_test_split(
        X_train, y_train, 
        test_size=0.2, 
        random_state=42,
        stratify=y_train
    )
    
    print(f"\n   Train/Test Split:")
    print(f"   ├─ Training samples: {len(X_train_split)}")
    print(f"   └─ Testing samples: {len(X_test)}")
    
    # Step 3: Train Random Forest model
    print("\n🤖 Step 3: Training Random Forest model...")
    rf_matcher = ResumeMatcher(model_type="random_forest")
    rf_matcher.train(X_train_split, y_train_split, "models/resume_matcher_rf.pkl")
    
    # Step 4: Train Gradient Boosting model (optional)
    print("\n🤖 Step 4: Training Gradient Boosting model...")
    gb_matcher = ResumeMatcher(model_type="gradient_boosting")
    gb_matcher.train(X_train_split, y_train_split, "models/resume_matcher_gb.pkl")
    
    # Step 5: Evaluate models
    print("\n📊 Step 5: Evaluating models...")
    
    print("\n" + "=" * 60)
    print("Random Forest Evaluation")
    print("=" * 60)
    rf_metrics = rf_matcher.evaluate(X_test, y_test)
    print_metrics(rf_metrics)
    
    print("\n" + "=" * 60)
    print("Gradient Boosting Evaluation")
    print("=" * 60)
    gb_metrics = gb_matcher.evaluate(X_test, y_test)
    print_metrics(gb_metrics)
    
    # Step 6: Compare models
    print("\n" + "=" * 60)
    print("Model Comparison")
    print("=" * 60)
    print(f"\n{'Metric':<20} {'Random Forest':<20} {'Gradient Boosting':<20}")
    print("-" * 60)
    
    for metric in ['accuracy', 'precision', 'recall', 'f1']:
        rf_val = rf_metrics[metric]
        gb_val = gb_metrics[metric]
        winner = "✓ GB" if gb_val > rf_val else "✓ RF"
        print(f"{metric:<20} {rf_val:<20.4f} {gb_val:<20.4f} {winner}")
    
    # Step 7: Feature importance
    print("\n" + "=" * 60)
    print("Feature Importance (Random Forest)")
    print("=" * 60)
    importance = rf_matcher.get_feature_importance()
    for feature, imp in sorted(importance.items(), key=lambda x: x[1], reverse=True):
        bar = "█" * int(imp * 50)
        print(f"{feature:<25} {bar} {imp:.4f}")
    
    # Step 8: Save best model
    print("\n" + "=" * 60)
    print("Model Selection")
    print("=" * 60)
    
    if rf_metrics['f1'] >= gb_metrics['f1']:
        print("✅ Random Forest selected as best model")
        print("   Saved to: models/resume_matcher_rf.pkl")
        best_model = "random_forest"
    else:
        print("✅ Gradient Boosting selected as best model")
        print("   Saved to: models/resume_matcher_gb.pkl")
        best_model = "gradient_boosting"
    
    # Step 9: Test on sample data
    print("\n" + "=" * 60)
    print("Testing on Sample Data")
    print("=" * 60)
    
    # Load best model
    best_matcher = ResumeMatcher(model_type=best_model)
    best_matcher.load(f"models/resume_matcher_{best_model.split('_')[0]}.pkl")
    
    # Test sample
    sample_resume = {
        "skills": ["python", "django", "postgresql", "rest api"],
        "years_of_experience": 5,
        "education": [{"degree": "BS", "field": "computer science"}],
        "job_titles": ["senior developer"],
        "certifications": [],
        "technologies": ["python", "django", "postgresql"]
    }
    
    sample_job = {
        "required_skills": ["python", "django", "postgresql"],
        "experience_required": 4,
        "education_required": ["BS"],
        "job_titles": ["senior developer"],
        "required_certifications": [],
        "tech_stack": ["python", "django", "postgresql"]
    }
    
    prediction = best_matcher.predict_with_confidence(sample_resume, sample_job)
    print(f"\nSample Prediction:")
    print(f"  Score: {prediction['score']}%")
    print(f"  Confidence: {prediction['confidence']:.2f}")
    print(f"  Interpretation: {prediction['interpretation']}")
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ Training Complete!")
    print("=" * 60)
    print(f"\nModels saved:")
    print(f"  • Random Forest: models/resume_matcher_rf.pkl")
    print(f"  • Gradient Boosting: models/resume_matcher_gb.pkl")
    print(f"  • Best Model: {best_model}")
    print(f"\nBest Model Performance:")
    print(f"  • Accuracy: {rf_metrics['accuracy'] if best_model == 'random_forest' else gb_metrics['accuracy']:.4f}")
    print(f"  • Precision: {rf_metrics['precision'] if best_model == 'random_forest' else gb_metrics['precision']:.4f}")
    print(f"  • Recall: {rf_metrics['recall'] if best_model == 'random_forest' else gb_metrics['recall']:.4f}")
    print(f"  • F1 Score: {rf_metrics['f1'] if best_model == 'random_forest' else gb_metrics['f1']:.4f}")
    print("\n" + "=" * 60)


def print_metrics(metrics):
    """Print evaluation metrics"""
    print(f"\nAccuracy:  {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall:    {metrics['recall']:.4f}")
    print(f"F1 Score:  {metrics['f1']:.4f}")
    
    # Print confusion matrix
    cm = metrics['confusion_matrix']
    print(f"\nConfusion Matrix:")
    print(f"                 Predicted")
    print(f"                 No    Yes")
    print(f"Actual  No       {cm[0][0]:<3} {cm[0][1]:<3}")
    print(f"        Yes      {cm[1][0]:<3} {cm[1][1]:<3}")


if __name__ == "__main__":
    main()