import React from 'react';
import { DollarSign, Sliders, RotateCcw, Cloud, ShieldCheck } from 'lucide-react';
import { CloudProvider } from '../types';

interface NavbarProps {
  efficiencyScore: number;
  selectedProvider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
  onOpenSimulator: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  efficiencyScore,
  selectedProvider,
  onSelectProvider,
  onOpenSimulator,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">CloudPrune</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                Multi-Cloud FinOps
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              OCI · AWS · GCP · Azure Cost Governance & Waste Pruning
            </p>
          </div>
        </div>

        {/* Live System Status & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Tenancy Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-400">Live Tenancy:</span>
            <span className="font-semibold text-slate-200">
              {selectedProvider === 'ALL'
                ? '4 Cloud Providers Connected'
                : selectedProvider === 'OCI'
                ? 'OCI (ap-hyderabad-1 / Tenancy vk)'
                : selectedProvider === 'AWS'
                ? 'AWS (prod-us-east-1)'
                : selectedProvider === 'GCP'
                ? 'GCP (us-central1-a)'
                : 'Azure (eastus / Sub-01)'}
            </span>
          </div>

          {/* Efficiency Score Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Efficiency:</span>
            <span
              className={`font-mono font-bold ${
                efficiencyScore >= 75
                  ? 'text-emerald-400'
                  : efficiencyScore >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {efficiencyScore}/100
            </span>
          </div>

          {/* Savings Simulator Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-105"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulator</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            title="Reset Remediation Actions"
            className="p-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
