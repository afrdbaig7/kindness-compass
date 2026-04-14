import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertTriangle, ShieldAlert, CheckCircle2, Zap, WifiOff } from 'lucide-react';
import { apiPredict, type ApiPredictionResult, type PredictionClass, type TopWord } from '@/lib/mockData';

const classConfig: Record<PredictionClass, { label: string; icon: typeof AlertTriangle; bgClass: string; textClass: string; glowClass: string }> = {
  hate: { label: 'Hate Speech', icon: ShieldAlert, bgClass: 'bg-hate/10', textClass: 'text-hate', glowClass: 'glow-hate' },
  offensive: { label: 'Offensive Language', icon: AlertTriangle, bgClass: 'bg-offensive/10', textClass: 'text-offensive', glowClass: 'glow-offensive' },
  neutral: { label: 'Neither / Neutral', icon: CheckCircle2, bgClass: 'bg-neutral/10', textClass: 'text-neutral', glowClass: 'glow-neutral' },
};

export default function PredictionPanel() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiPredictionResult | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    const before = Date.now();
    const res = await apiPredict(text);
    // If the response came back instantly with empty top_words and no latency → fallback
    const elapsed = Date.now() - before;
    setUsingFallback(res.top_words.length === 0 && elapsed < 200);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="pulse-dot" />
          <span className="terminal-text text-sm">MODEL: LR + TF-IDF | STATUS: READY</span>
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
            <ResultCard result={result} usingFallback={usingFallback} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result, usingFallback }: { result: ApiPredictionResult; usingFallback: boolean }) {
  const config = classConfig[result.prediction];
  const Icon = config.icon;

  return (
    <div className={`glass-card p-6 ${config.glowClass} space-y-5`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.textClass}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Predicted Class</p>
            <p className={`text-xl font-heading font-bold ${config.textClass}`}>{config.label}</p>
          </div>
        </div>
        {usingFallback ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            <WifiOff className="w-3 h-3" />
            <span>Offline mock</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            <span>Live model</span>
          </div>
        )}
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
            <p className="text-xs text-muted-foreground capitalize mb-1">
              {cls === 'hate' ? 'Hate Speech' : cls === 'offensive' ? 'Offensive' : 'Neutral'}
            </p>
            <p className={`font-heading font-bold text-lg ${classConfig[cls].textClass}`}>
              {(result.probabilities[cls] * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>

      {/* Top contributing words (explainability) */}
      {result.top_words && result.top_words.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading">
            Key Contributing Words
          </p>
          <div className="flex flex-wrap gap-2">
            {result.top_words.map((tw: TopWord, i: number) => (
              <motion.span
                key={tw.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono
                  ${config.bgClass} ${config.textClass} border border-current/20`}
              >
                {tw.word}
                <span className="opacity-60 text-[10px]">{(tw.score * 100).toFixed(0)}%</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
