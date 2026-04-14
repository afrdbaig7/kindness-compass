# Kindness Compass 🧭

An NLP-powered hate speech and offensive language detector. Enter any text and get an instant, explainable classification — **Hate Speech**, **Offensive Language**, or **Neither**.

Built with **React + Vite + Tailwind** on the frontend and a **FastAPI + Logistic Regression + TF-IDF** backend, trained on the [Davidson et al. (2017) hate speech dataset](https://github.com/t-davidson/hate-speech-and-offensive-language).

---

## Architecture

```
kindness-compass/
├── src/                   # React + Vite frontend (Tailwind / shadcn/ui)
│   ├── components/
│   │   └── PredictionPanel.tsx   ← calls POST /predict
│   └── lib/
│       └── mockData.ts           ← apiPredict() + offline fallback
└── backend/
    ├── app.py             # FastAPI entrypoint
    ├── requirements.txt   # Python dependencies (5 packages)
    ├── pipeline/
    │   ├── preprocess.py  # Text cleaning (regex only, no spaCy)
    │   └── train.py       # Train + evaluate + save .pkl
    ├── model/             # model.pkl + vectorizer.pkl (generated)
    └── data/              # dataset.csv (downloaded on first train)
```

---

## Quick Start

### 1 — Frontend

```bash
npm install
npm run dev          # http://localhost:5173
```

### 2 — Backend

```bash
# Create and activate a virtual environment (recommended)
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3 — Train the model

Run once from the **repo root**:

```bash
python -m backend.pipeline.train
```

This will:
1. Download the Davidson dataset (~3 MB) to `backend/data/dataset.csv`
2. Preprocess and vectorise 24,783 tweets with TF-IDF
3. Train a Logistic Regression classifier
4. Print accuracy / F1 to the console
5. Save `backend/model/model.pkl` and `backend/model/vectorizer.pkl`

Expected output (~30 seconds):

```
============================================================
  Kindness Compass — Model Training
============================================================
[train] Downloading dataset...
[train] Total samples: 24783
[train] Preprocessing text...
[train] Train: 19826 | Test: 4957
[train] Fitting TF-IDF vectorizer...
[train] Training Logistic Regression (class_weight=balanced)...

[train] === Evaluation Results ===
  Accuracy : 0.8860  (88.60%)
  F1 Score : 0.8841  (weighted)
...
[train] ✓ Training complete.
```

### 4 — Start the API server

From the **repo root**:

```bash
uvicorn backend.app:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.

---

## API Reference

### `GET /health`

Liveness probe.

```bash
curl http://localhost:8000/health
```

```json
{
  "status": "ok",
  "model_ready": true,
  "model": "LogisticRegression + TF-IDF"
}
```

---

### `POST /predict`

Classify a piece of text.

**Request**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "You are such an idiot, just shut up"}'
```

**Response**

```json
{
  "prediction": "offensive",
  "confidence": {
    "hate": 0.04,
    "offensive": 0.87,
    "neutral": 0.09
  },
  "top_words": [
    { "word": "idiot", "score": 0.341 },
    { "word": "shut",  "score": 0.298 }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `prediction` | `"hate" \| "offensive" \| "neutral"` | Predicted class |
| `confidence` | `object` | Per-class probability (sums to 1) |
| `top_words` | `array` | Words that contributed most to the prediction (TF-IDF × LR weight) |

---

## Model Details

| Property | Value |
|---|---|
| Algorithm | Logistic Regression (multinomial) |
| Features | TF-IDF unigrams (max 10,000 features) |
| Class imbalance | `class_weight='balanced'` |
| Dataset | Davidson et al. — 24,783 tweets |
| Classes | `0` hate · `1` offensive · `2` neutral |
| Expected accuracy | ~88–91% |
| Expected F1 (weighted) | ~87–90% |

---

## Frontend — Offline Fallback

If the backend is not running, the `PredictionPanel` automatically falls back to a client-side mock. A **"Offline mock"** badge appears on the result card so users know the real model is not active. When the backend is running, the badge reads **"Live model"**.

Set a custom API URL in a `.env` file at the repo root:

```env
VITE_API_URL=http://localhost:8000
```

---

## Development Notes

- **Retrain**: Delete `backend/model/*.pkl` and re-run `python -m backend.pipeline.train`
- **CORS**: The API allows all origins (`"*"`) for local dev — restrict in production
- **Port conflict**: Change the port with `uvicorn backend.app:app --port <PORT>` and update `VITE_API_URL` accordingly
- **Git**: `model/*.pkl` and `data/dataset.csv` are not committed (see `backend/.gitignore`)

---

## Dataset Attribution

Davidson, T., Warmsley, D., Macy, M., & Weber, I. (2017). *Automated Hate Speech Detection and the Problem of Offensive Language*. ICWSM.  
GitHub: https://github.com/t-davidson/hate-speech-and-offensive-language
