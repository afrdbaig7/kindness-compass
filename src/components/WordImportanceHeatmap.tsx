import { wordImportance, type PredictionClass } from '@/lib/mockData';
import { motion } from 'framer-motion';

const classColors: Record<PredictionClass, string> = {
  hate: 'hsl(0, 72%, 51%)',
  offensive: 'hsl(32, 95%, 54%)',
  neutral: 'hsl(160, 84%, 39%)',
};

export default function WordImportanceHeatmap() {
  const sorted = [...wordImportance].sort((a, b) => b.tfidf - a.tfidf);

  return (
    <div className="glass-card p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-2">Word Importance (TF-IDF)</h3>
      <p className="text-xs text-muted-foreground mb-4">Top features by TF-IDF score, colored by associated class</p>
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <motion.div
            key={item.word}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3"
          >
            <span className="w-20 text-xs font-heading text-muted-foreground text-right truncate">{item.word}</span>
            <div className="flex-1 h-6 bg-muted/50 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.tfidf * 100}%` }}
                transition={{ delay: i * 0.04 + 0.2, duration: 0.6 }}
                className="h-full rounded"
                style={{ backgroundColor: classColors[item.class], opacity: 0.3 + item.tfidf * 0.7 }}
              />
            </div>
            <span className="w-10 text-xs font-heading text-foreground">{item.tfidf.toFixed(2)}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-4">
        {(['hate', 'offensive', 'neutral'] as const).map((cls) => (
          <div key={cls} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: classColors[cls] }} />
            <span className="text-xs text-muted-foreground capitalize">{cls}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
