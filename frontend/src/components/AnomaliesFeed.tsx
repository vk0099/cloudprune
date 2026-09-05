import React from 'react';
import { CostAnomaly } from '../types';
import { AlertOctagon, TrendingUp, Calendar, Info } from 'lucide-react';

interface AnomaliesFeedProps {
  anomalies: CostAnomaly[];
}

export const AnomaliesFeed: React.FC<AnomaliesFeedProps> = ({ anomalies }) => {
  return (
    <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800/80 shadow-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Cost Anomaly Spikes Detected</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Automated root-cause analysis on anomalous CloudWatch billing events.
        </p>
      </div>

      <div className="space-y-3">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className="p-4 rounded-2xl bg-dark-950 border border-rose-500/20 space-y-2 hover:border-rose-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold">
                  +{anom.percentageSpike}% SPIKE
                </span>
                <span className="text-xs font-bold text-white">{anom.service}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Calendar className="w-3 h-3" />
                <span>{anom.date}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {anom.rootCause}
            </p>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 font-mono border-t border-slate-800/60">
              <span>Expected: ${anom.expectedSpendUSD.toFixed(2)}/day</span>
              <span className="text-rose-400 font-bold">Actual: ${anom.actualSpendUSD.toFixed(2)}/day</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
