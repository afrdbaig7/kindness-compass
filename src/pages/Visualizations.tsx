import { motion } from 'framer-motion';
import ConfusionMatrixChart from '@/components/ConfusionMatrixChart';
import AccuracyChart from '@/components/AccuracyChart';
import ClassDistributionChart from '@/components/ClassDistributionChart';
import WordImportanceHeatmap from '@/components/WordImportanceHeatmap';

export default function Visualizations() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Visualizations</h1>
          <p className="text-muted-foreground text-sm">Model performance metrics and data analysis charts</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ConfusionMatrixChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AccuracyChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ClassDistributionChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <WordImportanceHeatmap />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
