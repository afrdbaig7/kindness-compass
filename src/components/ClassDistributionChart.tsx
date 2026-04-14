import { classDistribution } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['hsl(0, 72%, 51%)', 'hsl(32, 95%, 54%)', 'hsl(160, 84%, 39%)'];

export default function ClassDistributionChart() {
  return (
    <div className="glass-card p-6">
      <h3 className="font-heading font-bold text-lg text-foreground mb-4">Class Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={classDistribution}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            strokeWidth={2}
            stroke="hsl(220, 20%, 7%)"
          >
            {classDistribution.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220, 18%, 10%)',
              border: '1px solid hsl(220, 14%, 18%)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {classDistribution.map((d, i) => (
          <div key={d.name} className="text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS[i] }} />
            <p className="text-xs text-muted-foreground">{d.name}</p>
            <p className="font-heading font-bold text-sm text-foreground">{d.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
