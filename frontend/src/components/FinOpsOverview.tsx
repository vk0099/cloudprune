import React from 'react';
import { DollarSign, Trash2, TrendingDown, CheckCircle2, Layers, Server, Cloud } from 'lucide-react';
import { FinOpsOverviewSummary, CloudProvider } from '../types';

interface FinOpsOverviewProps {
  summary: FinOpsOverviewSummary;
  selectedProvider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
}

export const FinOpsOverview: React.FC<FinOpsOverviewProps> = ({
  summary,
  selectedProvider,
  onSelectProvider
}) => {
  const cards = [
    {
      title: 'Monthly Cloud Spend',
      value: `$${summary.totalMonthlySpendUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle:
        selectedProvider === 'ALL'
          ? 'Consolidated across OCI, AWS, GCP, Azure'
          : `Total monthly run-rate for ${selectedProvider}`,
      icon: DollarSign,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Identified Waste',
      value: `$${summary.totalIdentifiedWasteUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${summary.savingsPercentage}% of monthly spend can be pruned`,
      icon: Trash2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Potential Annual Savings',
      value: `$${summary.potentialAnnualSavingsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'Calculated across 12-month run-rate',
      icon: TrendingDown,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Remediated Savings',
      value: `$${summary.remediatedSavingsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${summary.resolvedRecommendationsCount} actions applied this session`,
      icon: CheckCircle2,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    }
  ];

  const providers = [
    { key: 'OCI' as const, name: 'Oracle Cloud (OCI)', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'hover:border-rose-500/60' },
    { key: 'AWS' as const, name: 'Amazon Web Services', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'hover:border-amber-500/60' },
    { key: 'GCP' as const, name: 'Google Cloud Platform', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'hover:border-sky-500/60' },
    { key: 'AZURE' as const, name: 'Microsoft Azure', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'hover:border-blue-500/60' }
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-dark-900 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight">{card.value}</div>
              <div className="text-xs text-slate-500 mt-1">{card.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Multi-Cloud Provider Breakdown Strip (when ALL is selected or overview) */}
      {summary.providerBreakdown && (
        <div className="p-5 rounded-2xl bg-dark-900/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Multi-Cloud Provider Allocation & Efficiency</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Click card to filter single cloud</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {providers.map((p) => {
              const data = summary.providerBreakdown?.[p.key];
              if (!data) return null;
              const isSelected = selectedProvider === p.key;

              return (
                <button
                  key={p.key}
                  onClick={() => onSelectProvider(isSelected ? 'ALL' : p.key)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? `bg-dark-950 ${p.border} ring-1 ring-emerald-400/50 shadow-lg`
                      : `bg-dark-950/60 border-slate-800/80 ${p.bg}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold ${p.color}`}>{p.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      Score: {data.efficiencyScore}/100
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-white font-mono">
                      ${data.spendUSD.toFixed(2)}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      -${data.wasteUSD.toFixed(2)} waste
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/50">
                    <span>{data.resourcesCount} resources</span>
                    <span>{data.recommendationsCount} actions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
