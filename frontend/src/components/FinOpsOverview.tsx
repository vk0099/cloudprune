import React from 'react';
import { DollarSign, Trash2, TrendingDown, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { FinOpsOverviewSummary } from '../types';

interface FinOpsOverviewProps {
  summary: FinOpsOverviewSummary;
}

export const FinOpsOverview: React.FC<FinOpsOverviewProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Monthly Cloud Spend',
      value: `$${summary.totalMonthlySpendUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'Across 7 AWS Services in 2 Regions',
      icon: DollarSign,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Identified Waste',
      value: `$${summary.totalIdentifiedWasteUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: `${summary.savingsPercentage}% of monthly spend can be cut`,
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

  return (
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
  );
};
