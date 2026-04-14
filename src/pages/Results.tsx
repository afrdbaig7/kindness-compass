import { motion } from 'framer-motion';
import ModelComparisonTable from '@/components/ModelComparisonTable';
import SamplePredictions from '@/components/SamplePredictions';
import { modelMetrics } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const chartData = modelMetrics.map((m) => ({
  name: m.name.split('+')[0].trim().split('(')[0].trim(),
  Accuracy: +(m.accuracy * 100).toFixed(1),
  Precision: +(m.precision * 100).toFixed(1),
  Recall: +(m.recall * 100).toFixed(1),
  F1: +(m.f1 * 100).toFixed(1),
}));

export default function Results() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Results</h1>
          <p className="text-muted-foreground text-sm">Comprehensive model evaluation and sample predictions</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ModelComparisonTable />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">Model Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                  <XAxis dataKey="name" stroke="hsl(215 12% 50%)" fontSize={11} />
                  <YAxis stroke="hsl(215 12% 50%)" fontSize={12} domain={[75, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(220 18% 10%)', border: '1px solid hsl(220 14% 18%)', borderRadius: '8px', fontFamily: 'JetBrains Mono', fontSize: '12px' }} />
                  <Legend />
                  <Bar dataKey="Accuracy" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Precision" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recall" fill="hsl(32, 95%, 54%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <SamplePredictions />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
