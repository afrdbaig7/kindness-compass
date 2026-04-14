import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { mockPredict, type PredictionResult, type PredictionClass } from '@/lib/mockData';

const classConfig: Record<PredictionClass, { label: string; icon: typeof AlertTriangle; bgClass: string; textClass: string; glowClass: string }> = {
  hate: { label: 'Hate Speech', icon: ShieldAlert, bgClass: 'bg-hate/10', textClass: 'text-hate', glowClass: 'glow-hate' },
  offensive: { label: 'Offensive Language', icon: AlertTriangle, bgClass: 'bg-offensive/10', textClass: 'text-offensive', glowClass: 'glow-offensive' },
  neutral: { label: 'Neither / Neutral', icon: CheckCircle2, bgClass: 'bg-neutral/10', textClass: 'text-neutral', glowClass: 'glow-neutral' },
};

export default function PredictionPanel() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await mockPredict(text);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="pulse-dot" />
          <span className="terminal-text text-sm">MODEL: BERT-fine-tuned | STATUS: READY</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze for hate speech or offensive language..."
          className="w-full h-32 bg-muted/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-body text-sm"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result }: { result: PredictionResult }) {
  const config = classConfig[result.prediction];
  const Icon = config.icon;

  return (
    <div className={`glass-card p-6 ${config.glowClass} space-y-5`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${config.textClass}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Predicted Class</p>
          <p className={`text-xl font-heading font-bold ${config.textClass}`}>{config.label}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confidence</span>
          <span className={`font-heading font-bold ${config.textClass}`}>
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              result.prediction === 'hate' ? 'bg-hate' :
              result.prediction === 'offensive' ? 'bg-offensive' : 'bg-neutral'
            }`}
          />
        </div>
      </div>

      {/* Probability breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {(['hate', 'offensive', 'neutral'] as const).map((cls) => (
          <div key={cls} className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground capitalize mb-1">{cls === 'hate' ? 'Hate Speech' : cls === 'offensive' ? 'Offensive' : 'Neutral'}</p>
            <p className={`font-heading font-bold text-lg ${classConfig[cls].textClass}`}>
              {(result.probabilities[cls] * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
