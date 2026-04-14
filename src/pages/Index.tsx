import PredictionPanel from '@/components/PredictionPanel';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-3xl px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <div className="pulse-dot" />
            <span className="text-xs font-heading text-primary">NLP-Powered Detection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            Hate Speech <span className="text-primary">&</span> Offensive Language Detection
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Analyze text using state-of-the-art NLP models trained on the Davidson et al. dataset. 
            Classify content as hate speech, offensive language, or neutral.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: Shield, label: '24,783 samples', sub: 'Training Data' },
            { icon: Brain, label: '93.8% F1', sub: 'BERT Model' },
            { icon: Zap, label: '<200ms', sub: 'Inference' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="glass-card p-4 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="font-heading font-bold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </motion.div>

        <PredictionPanel />
      </div>
    </div>
  );
}
