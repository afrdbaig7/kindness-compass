import { samplePredictions, type PredictionClass } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const icons: Record<PredictionClass, typeof ShieldAlert> = { hate: ShieldAlert, offensive: AlertTriangle, neutral: CheckCircle2 };
const colors: Record<PredictionClass, string> = { hate: 'text-hate', offensive: 'text-offensive', neutral: 'text-neutral' };
const bgs: Record<PredictionClass, string> = { hate: 'bg-hate/10', offensive: 'bg-offensive/10', neutral: 'bg-neutral/10' };

export default function SamplePredictions() {
  return (
    <div className="glass-card p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">Sample Predictions</h3>
      <div className="space-y-3">
        {samplePredictions.map((s, i) => {
          const Icon = icons[s.prediction];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className={`w-8 h-8 rounded-lg ${bgs[s.prediction]} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${colors[s.prediction]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">"{s.text}"</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-heading font-bold ${colors[s.prediction]} capitalize`}>{s.prediction}</span>
                  <span className="text-xs text-muted-foreground">{(s.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
