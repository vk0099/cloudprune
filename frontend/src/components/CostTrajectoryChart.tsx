import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DailySpendPoint } from '../types';
import { TrendingDown, Sparkles } from 'lucide-react';

interface CostTrajectoryChartProps {
  data: DailySpendPoint[];
}

export const CostTrajectoryChart: React.FC<CostTrajectoryChartProps> = ({ data }) => {
  return (
    <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800/80 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Daily Spend vs. Optimized Trajectory</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              Last 30 Days
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing current unoptimized burn rate against projected post-remediation baseline.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="text-slate-300">Actual Spend ($)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-300">Optimized Target ($)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="optGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(val) => val.split('-').slice(1).join('/')}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c111a',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(value: any, name: string) => [
                `$${Number(value).toFixed(2)}`,
                name === 'actualSpendUSD' ? 'Actual Spend' : 'Optimized Target'
              ]}
            />
            <Area
              type="monotone"
              dataKey="actualSpendUSD"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#actualGradient)"
            />
            <Area
              type="monotone"
              dataKey="optimizedSpendUSD"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#optGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
