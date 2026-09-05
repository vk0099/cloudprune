import React, { useState } from 'react';
import { ShieldCheck, Cpu, HardDrive, Zap, Info, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface OciAlwaysFreeCardProps {
  currentOcpus?: number;
  currentRamGb?: number;
  currentStorageGb?: number;
}

export const OciAlwaysFreeCard: React.FC<OciAlwaysFreeCardProps> = ({
  currentOcpus = 2,
  currentRamGb = 12,
  currentStorageGb = 200
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Oracle Cloud Always Free Limits
  const maxFreeOcpus = 4;
  const maxFreeRamGb = 24;
  const maxFreeStorageGb = 200;
  const maxMonthlyOcpuHours = 3000;
  const maxMonthlyRamGbHours = 18000;

  // Monthly Calculations for 744-hour month (31 days)
  const monthlyHours = 744;
  const monthlyOcpuHoursUsed = currentOcpus * monthlyHours;
  const monthlyRamGbHoursUsed = currentRamGb * monthlyHours;

  const ocpuPercent = Math.round((currentOcpus / maxFreeOcpus) * 100);
  const ramPercent = Math.round((currentRamGb / maxFreeRamGb) * 100);
  const storagePercent = Math.round((currentStorageGb / maxFreeStorageGb) * 100);

  return (
    <div className="rounded-3xl bg-gradient-to-b from-dark-900 via-dark-900/90 to-dark-950 border border-emerald-500/30 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Oracle Cloud (OCI) Always Free Quota & Guardrail</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                $0.00 / Month Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tenancy Allowance: 3,000 OCPU-hours & 18,000 GB-hours recurring monthly free tier
            </p>
          </div>
        </div>

        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto font-mono"
        >
          <Info className="w-3.5 h-3.5 text-accent-cyan" />
          <span>{detailsOpen ? 'Hide Calculation' : 'How 3,000 hrs = Free'}</span>
          {detailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3-Column Quota Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {/* 1. Compute (OCPU) */}
        <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-400 text-xs font-mono font-bold">
              <Cpu className="w-4 h-4" />
              <span>Ampere A1 Compute</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% Free</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-white font-mono">
              {currentOcpus} <span className="text-xs text-slate-400 font-normal">/ {maxFreeOcpus} OCPUs</span>
            </span>
            <span className="text-xs font-mono text-slate-400">{ocpuPercent}% Used</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${ocpuPercent}%` }} />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>{monthlyOcpuHoursUsed.toLocaleString()} hrs used</span>
            <span>Max 3,000 hrs/mo</span>
          </div>
        </div>

        {/* 2. Memory (RAM) */}
        <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-cyan text-xs font-mono font-bold">
              <Zap className="w-4 h-4" />
              <span>Memory (RAM)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% Free</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-white font-mono">
              {currentRamGb} <span className="text-xs text-slate-400 font-normal">/ {maxFreeRamGb} GB</span>
            </span>
            <span className="text-xs font-mono text-slate-400">{ramPercent}% Used</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-accent-cyan rounded-full transition-all" style={{ width: `${ramPercent}%` }} />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>{monthlyRamGbHoursUsed.toLocaleString()} GB-hrs</span>
            <span>Max 18,000 GB-hrs/mo</span>
          </div>
        </div>

        {/* 3. Storage */}
        <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-emerald text-xs font-mono font-bold">
              <HardDrive className="w-4 h-4" />
              <span>NVMe Storage</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">100% Free</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-white font-mono">
              {currentStorageGb} <span className="text-xs text-slate-400 font-normal">/ {maxFreeStorageGb} GB</span>
            </span>
            <span className="text-xs font-mono text-slate-400">{storagePercent}% Used</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>10 VPU Balanced</span>
            <span>Max 200 GB Free</span>
          </div>
        </div>
      </div>

      {/* Collapsible Mathematical Proof & Policy Explanation */}
      {detailsOpen && (
        <div className="mt-4 p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-accent-cyan font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Why Oracle Cloud Provides 3,000 OCPU Hours Free Every Month:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 text-[11px] text-slate-300">
            <div className="space-y-1">
              <span className="text-white font-bold block">1. Compute Hour Calculation:</span>
              <p className="text-slate-400">
                A 31-day month has 744 total hours (24h × 31d). Running 4 OCPUs 24/7 consumes:
              </p>
              <p className="text-emerald-400 font-bold bg-dark-900 p-1.5 rounded border border-slate-800">
                4 OCPUs × 744 hours = 2,976 OCPU-hours (&lt; 3,000 free quota) = $0.00
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-white font-bold block">2. RAM GB-Hour Calculation:</span>
              <p className="text-slate-400">
                Running 24 GB RAM 24/7 in a 31-day month consumes:
              </p>
              <p className="text-accent-cyan font-bold bg-dark-900 p-1.5 rounded border border-slate-800">
                24 GB × 744 hours = 17,856 GB-hours (&lt; 18,000 free quota) = $0.00
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              CloudPrune FinOps Policy: Tenancy is locked to <code className="text-slate-200">VM.Standard.A1.Flex</code>. Any attempt to provision non-free shapes (e.g. E4/Intel) or exceed 4 OCPUs/24GB RAM triggers an immediate Cost Anomaly alarm.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
