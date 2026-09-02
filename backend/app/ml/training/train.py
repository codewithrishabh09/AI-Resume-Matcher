"""Train the ML model"""
from sklearn.model_selection import train_test_split
from app.ml.models.resume_matcher_model import ResumeMatcher
from app.ml.training.training_data import prepare_training_data

def train_model():
    """Train model on data"""
    print("🚀 Training model...")
    
    # Prepare data
    X_train, y_train = prepare_training_data()
    
    # Split data
    X_train_split, X_test, y_train_split, y_test = train_test_split(
        X_train, y_train, test_size=0.2, random_state=42
    )
    
    # Train model
    matcher = ResumeMatcher()
    matcher.train(X_train_split, y_train_split, "models/resume_matcher_rf.pkl")
    
    # Evaluate
    metrics = matcher.evaluate(X_test, y_test)
    print(f"\n✅ Model Performance:")
    print(f"   Accuracy:  {metrics['accuracy']}")
    print(f"   Precision: {metrics['precision']}")
    print(f"   Recall:    {metrics['recall']}")
    print(f"   F1:        {metrics['f1']}")

if __name__ == "__main__":
    train_model()