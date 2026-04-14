"""
train.py
Train a TF-IDF + Logistic Regression classifier on the Davidson et al.
hate-speech dataset. Saves model.pkl and vectorizer.pkl into ../model/.

Usage (from repo root):
    python -m backend.pipeline.train
  or from inside /backend:
    python pipeline/train.py
"""
import os
import json
import sys
import pathlib
import urllib.request

import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, classification_report

# Resolve paths relative to this file so the script works from any CWD
HERE = pathlib.Path(__file__).resolve().parent          # backend/pipeline/
BACKEND = HERE.parent                                   # backend/
DATA_PATH = BACKEND / "data" / "dataset.csv"
MODEL_DIR = BACKEND / "model"
MODEL_PATH = MODEL_DIR / "model.pkl"
VEC_PATH = MODEL_DIR / "vectorizer.pkl"
METRICS_PATH = MODEL_DIR / "metrics.json"

DATASET_URL = (
    "https://raw.githubusercontent.com/t-davidson/hate-speech-and-offensive-language"
    "/master/data/labeled_data.csv"
)

# Class label mapping (from the Davidson dataset)
CLASS_NAMES = {0: "hate", 1: "offensive", 2: "neutral"}


def download_dataset():
    """Download the Davidson dataset if not already present."""
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATA_PATH.exists():
        print(f"[train] Dataset found at {DATA_PATH}")
        return
    print(f"[train] Downloading dataset from {DATASET_URL} ...")
    urllib.request.urlretrieve(DATASET_URL, DATA_PATH)
    print(f"[train] Saved to {DATA_PATH}")


def load_data():
    """Load and return (texts, labels) as lists."""
    df = pd.read_csv(DATA_PATH)
    # Davidson CSV columns: count, hate_speech, offensive_language, neither, class, tweet
    df = df[["class", "tweet"]].dropna()
    df["class"] = df["class"].astype(int)
    return df["tweet"].tolist(), df["class"].tolist()


def preprocess_texts(texts):
    """Apply cleaning pipeline to a list of texts."""
    # Import relative to package if run as module, else relative import
    try:
        from backend.pipeline.preprocess import clean
    except ModuleNotFoundError:
        from preprocess import clean
    return [clean(t) for t in texts]


def main():
    print("=" * 60)
    print("  Kindness Compass — Model Training")
    print("=" * 60)

    # 1. Ensure dataset is available
    download_dataset()

    # 2. Load data
    print("[train] Loading data...")
    texts, labels = load_data()
    print(f"[train] Total samples: {len(texts)}")

    # 3. Preprocess
    print("[train] Preprocessing text...")
    cleaned = preprocess_texts(texts)

    # 4. Train / test split (80/20, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        cleaned, labels, test_size=0.2, random_state=42, stratify=labels
    )
    print(f"[train] Train: {len(X_train)} | Test: {len(X_test)}")

    # 5. TF-IDF vectorisation (unigrams only, cap at 10k features)
    print("[train] Fitting TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=10_000,
        ngram_range=(1, 1),
        sublinear_tf=True,
        min_df=2,
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # 6. Train Logistic Regression
    print("[train] Training Logistic Regression (class_weight=balanced)...")
    model = LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        C=1.0,
        solver="lbfgs",
        multi_class="multinomial",
        random_state=42,
    )
    model.fit(X_train_vec, y_train)

    # 7. Evaluate
    y_pred = model.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="weighted")

    print("\n[train] === Evaluation Results ===")
    print(f"  Accuracy : {acc:.4f}  ({acc*100:.2f}%)")
    print(f"  F1 Score : {f1:.4f}  (weighted)")
    print("\n[train] Full classification report:")
    target_names = [CLASS_NAMES[i] for i in sorted(CLASS_NAMES)]
    print(classification_report(y_test, y_pred, target_names=target_names))

    # 8. Save metrics
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    metrics = {
        "accuracy": round(acc, 4),
        "f1_weighted": round(f1, 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "model": "LogisticRegression",
        "features": "TF-IDF unigrams (max 10k)",
    }
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"[train] Metrics saved → {METRICS_PATH}")

    # 9. Save model and vectorizer
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VEC_PATH)
    print(f"[train] model.pkl    → {MODEL_PATH}")
    print(f"[train] vectorizer.pkl → {VEC_PATH}")
    print("\n[train] ✓ Training complete.")


if __name__ == "__main__":
    main()
