import { modelMetrics } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function ModelComparisonTable() {
  const best = modelMetrics.reduce((a, b) => (a.f1 > b.f1 ? a : b));

  return (
    <div className="glass-card p-6 overflow-x-auto">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">Model Comparison</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'Train Time'].map((h) => (
              <th key={h} className="text-left py-3 px-2 text-xs font-heading text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modelMetrics.map((m, i) => {
            const isBest = m.name === best.name;
            return (
              <motion.tr
                key={m.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`border-b border-border/50 ${isBest ? 'bg-primary/5' : ''}`}
              >
                <td className="py-3 px-2 font-medium text-foreground flex items-center gap-2">
                  {isBest && <Trophy className="w-4 h-4 text-primary" />}
                  {m.name}
                </td>
                <td className="py-3 px-2 font-heading text-foreground">{(m.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-2 font-heading text-foreground">{(m.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-2 font-heading text-foreground">{(m.recall * 100).toFixed(1)}%</td>
                <td className={`py-3 px-2 font-heading font-bold ${isBest ? 'text-primary' : 'text-foreground'}`}>{(m.f1 * 100).toFixed(1)}%</td>
                <td className="py-3 px-2 text-muted-foreground">{m.trainTime}</td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
