"""
app.py — Kindness Compass FastAPI Backend

Endpoints:
  GET  /health   — liveness probe
  POST /predict  — classify text as hate / offensive / neutral

Run:
  uvicorn backend.app:app --reload --port 8000
  (from the repo root directory)
"""
import pathlib
import re
import sys

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── Paths ────────────────────────────────────────────────────────────────────
HERE = pathlib.Path(__file__).resolve().parent   # backend/
MODEL_PATH = HERE / "model" / "model.pkl"
VEC_PATH = HERE / "model" / "vectorizer.pkl"
METRICS_PATH = HERE / "model" / "metrics.json"

CLASS_NAMES = {0: "hate", 1: "offensive", 2: "neutral"}

# ─── Load model (once at startup) ─────────────────────────────────────────────
_model = None
_vectorizer = None


def _load():
    global _model, _vectorizer
    if not MODEL_PATH.exists() or not VEC_PATH.exists():
        raise RuntimeError(
            "Model files not found. Run: python -m backend.pipeline.train"
        )
    _model = joblib.load(MODEL_PATH)
    _vectorizer = joblib.load(VEC_PATH)


try:
    _load()
    MODEL_READY = True
except RuntimeError as e:
    print(f"[app] WARNING: {e}", file=sys.stderr)
    MODEL_READY = False


# ─── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Kindness Compass API",
    description="Hate speech & offensive language classifier (LR + TF-IDF)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # restrict in production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Schemas ──────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    text: str


class WordScore(BaseModel):
    word: str
    score: float


class PredictResponse(BaseModel):
    prediction: str
    confidence: dict[str, float]
    top_words: list[WordScore]


# ─── Preprocessing (inline, no external deps) ─────────────────────────────────
def _clean(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ─── Explainability helper ─────────────────────────────────────────────────────
def _top_words(cleaned_text: str, predicted_class_idx: int, top_n: int = 10) -> list[WordScore]:
    """
    Return top-N words contributing to the predicted class.
    Method: element-wise product of TF-IDF feature values × LR coefficient
    for the predicted class, then pick the largest positive values.
    """
    vec = _vectorizer.transform([cleaned_text])          # (1, n_features)
    feature_names = np.array(_vectorizer.get_feature_names_out())
    coef = _model.coef_[predicted_class_idx]             # (n_features,)

    # Only consider features present in the input
    nonzero_indices = vec.nonzero()[1]
    if len(nonzero_indices) == 0:
        return []

    scores = vec[0, nonzero_indices].toarray().flatten() * coef[nonzero_indices]
    words = feature_names[nonzero_indices]

    # Sort by score descending, keep positive contributions only
    order = np.argsort(scores)[::-1]
    top = [(words[i], float(round(scores[i], 4))) for i in order[:top_n] if scores[i] > 0]
    return [WordScore(word=w, score=s) for w, s in top]


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_ready": MODEL_READY,
        "model": "LogisticRegression + TF-IDF",
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not MODEL_READY:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run: python -m backend.pipeline.train",
        )

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Text must not be empty.")

    cleaned = _clean(text)
    vec = _vectorizer.transform([cleaned])
    proba = _model.predict_proba(vec)[0]          # [hate_p, offensive_p, neutral_p]

    # The model's classes_ array maps index → integer label
    class_indices = _model.classes_               # e.g. [0, 1, 2]
    proba_by_name = {CLASS_NAMES[c]: float(round(p, 4)) for c, p in zip(class_indices, proba)}

    # Predicted class
    pred_idx = int(np.argmax(proba))
    pred_label = CLASS_NAMES[class_indices[pred_idx]]

    # Explainability
    top = _top_words(cleaned, pred_idx)

    return PredictResponse(
        prediction=pred_label,
        confidence=proba_by_name,
        top_words=top,
    )
