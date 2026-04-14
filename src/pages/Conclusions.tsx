import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Database, TrendingUp, Code2, Rocket } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Hate Speech vs. Offensive Language',
    content: `The distinction between hate speech and offensive language is nuanced. Hate speech targets individuals or groups based on protected characteristics (race, religion, gender), while offensive language may be vulgar or inappropriate without targeting a specific group. Our models show that this boundary is often blurred — many tweets classified as "offensive" contain borderline hate speech elements, making accurate classification inherently challenging.`,
  },
  {
    icon: AlertTriangle,
    title: 'Model Limitations',
    content: `Current models struggle with: (1) Sarcasm and irony detection — "Great job ruining everything" may be classified as neutral. (2) Context-dependent language — words reclaimed by communities may be flagged incorrectly. (3) Code-switching and multilingual content. (4) Evolving language — new slurs and euphemisms emerge constantly. (5) Short text with limited context — single-word or emoji-heavy messages are difficult to classify accurately.`,
  },
  {
    icon: Database,
    title: 'Dataset Bias',
    content: `The Davidson et al. dataset has known biases: (1) Severe class imbalance — 77% offensive, only 5.8% hate speech. (2) Annotation subjectivity — inter-annotator agreement is moderate. (3) Temporal bias — collected in 2017, missing modern slang and context. (4) Platform bias — Twitter-specific language patterns don't generalize well. (5) Demographic bias in annotators may lead to systematic misclassification of African American Vernacular English (AAVE) as offensive.`,
  },
  {
    icon: TrendingUp,
    title: 'Potential Improvements',
    content: `Key areas for improvement: (1) Multi-task learning combining hate speech detection with sentiment and emotion analysis. (2) Data augmentation with back-translation and paraphrasing to address class imbalance. (3) Ensemble methods combining TF-IDF, LSTM, and Transformer models. (4) Active learning to iteratively improve on edge cases. (5) Cross-lingual transfer learning for multilingual hate speech detection. (6) Incorporating user metadata and conversation context for better accuracy.`,
  },
  {
    icon: Code2,
    title: 'Technical Architecture',
    content: `The full-stack system uses: Backend — FastAPI with scikit-learn (Logistic Regression, Naive Bayes) and PyTorch (LSTM, BERT). Preprocessing pipeline includes NLTK tokenization, stopword removal, and WordNet lemmatization. TF-IDF vectorization with 10,000 features as baseline. SMOTE for oversampling minority classes. Frontend — React with Recharts for visualization. The API serves predictions via POST /predict and model stats via GET /stats.`,
  },
  {
    icon: Rocket,
    title: 'Deployment Guide',
    content: `Backend: Deploy FastAPI to Render or Railway — set Python 3.10 runtime, add requirements.txt with fastapi, uvicorn, scikit-learn, torch, transformers, nltk. Use gunicorn with uvicorn workers for production. Frontend: Deploy React to Vercel — connect GitHub repo, set build command "npm run build", output directory "dist". Environment: Set CORS origins, API URL as environment variables. Model files: Store trained .pkl and .pt files in cloud storage (S3/GCS) and load at startup.`,
  },
];

export default function Conclusions() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Conclusions & Analysis</h1>
          <p className="text-muted-foreground text-sm">Key findings, limitations, and future directions</p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading font-bold text-lg text-foreground">{s.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
