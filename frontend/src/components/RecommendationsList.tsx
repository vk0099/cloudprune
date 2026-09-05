import React, { useState } from 'react';
import { FinOpsRecommendation } from '../types';
import {
  Zap,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  ArrowRight,
  Server,
  Database,
  HardDrive,
  Cloud,
  Network
} from 'lucide-react';

interface RecommendationsListProps {
  recommendations: FinOpsRecommendation[];
  onRemediate: (id: string) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onRemediate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCommand = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'EC2': return <Server className="w-4 h-4 text-indigo-400" />;
      case 'RDS': return <Database className="w-4 h-4 text-sky-400" />;
      case 'EBS': return <HardDrive className="w-4 h-4 text-amber-400" />;
      case 'S3': return <Cloud className="w-4 h-4 text-emerald-400" />;
      case 'NAT_GATEWAY': return <Network className="w-4 h-4 text-rose-400" />;
      default: return <Zap className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800/80 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Actionable FinOps Recommendations</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            One-click automated remediations and AWS CLI command recipes.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {recommendations.filter(r => r.status === 'PENDING').length} Pending Actions
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isRemediated = rec.status === 'REMEDIATED';

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all ${
                isRemediated
                  ? 'bg-dark-950/60 border-emerald-500/30 opacity-75'
                  : 'bg-dark-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Left: Metadata & Description */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="p-1 rounded-lg bg-dark-900 border border-slate-800">
                      {getServiceIcon(rec.service)}
                    </span>
                    <span className="text-xs font-bold text-white">{rec.title}</span>

                    {/* Impact Tag */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        rec.impact === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : rec.impact === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {rec.impact} IMPACT
                    </span>

                    {/* Difficulty */}
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {rec.difficulty.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Resource ID & Command snippet */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 truncate">
                      {rec.actionCommand}
                    </div>
                    <button
                      onClick={() => copyCommand(rec.id, rec.actionCommand)}
                      title="Copy AWS CLI Command"
                      className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Right: Savings Metric & Remediation Trigger */}
                <div className="flex sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-3 min-w-[170px] border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-mono">ESTIMATED SAVINGS</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      +${rec.estimatedMonthlySavings.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/mo</span>
                    </div>
                  </div>

                  {isRemediated ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Remediated</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onRemediate(rec.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Apply Fix</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
