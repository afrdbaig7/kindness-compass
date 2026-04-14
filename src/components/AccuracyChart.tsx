import { accuracyOverEpochs } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AccuracyChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">Training & Validation Accuracy</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={accuracyOverEpochs}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
          <XAxis dataKey="epoch" stroke="hsl(215 12% 50%)" fontSize={12} />
          <YAxis stroke="hsl(215 12% 50%)" fontSize={12} domain={[0.6, 1]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220 18% 10%)',
              border: '1px solid hsl(220 14% 18%)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="train" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3 }} name="Training" />
          <Line type="monotone" dataKey="val" stroke="hsl(32, 95%, 54%)" strokeWidth={2} dot={{ r: 3 }} name="Validation" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
