import { confusionMatrix } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function ConfusionMatrixChart() {
  const { labels, matrix } = confusionMatrix;
  const maxVal = Math.max(...matrix.flat());

  return (
    <div className="glass-card p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">Confusion Matrix</h3>
      <div className="flex">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-center mr-2 gap-1">
          {labels.map((l) => (
            <div key={l} className="h-16 sm:h-20 flex items-center">
              <span className="text-xs text-muted-foreground text-right w-16 sm:w-20 truncate">{l}</span>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-1">
            {matrix.map((row, i) =>
              row.map((val, j) => {
                const intensity = val / maxVal;
                const isDiag = i === j;
                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i * 3 + j) * 0.05 }}
                    className="h-16 sm:h-20 rounded-lg flex items-center justify-center text-xs sm:text-sm font-heading font-bold transition-all"
                    style={{
                      backgroundColor: isDiag
                        ? `hsl(160 84% 39% / ${0.15 + intensity * 0.6})`
                        : `hsl(0 72% 51% / ${intensity * 0.4})`,
                      color: intensity > 0.5 ? 'hsl(210 20% 92%)' : 'hsl(215 12% 50%)',
                    }}
                  >
                    {val.toLocaleString()}
                  </motion.div>
                );
              })
            )}
          </div>
          {/* X-axis labels */}
          <div className="grid grid-cols-3 gap-1 mt-2">
            {labels.map((l) => (
              <div key={l} className="text-center text-xs text-muted-foreground truncate">{l}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Predicted →</span>
        <span>Actual ↓</span>
      </div>
    </div>
  );
}
