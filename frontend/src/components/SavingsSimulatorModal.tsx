import React, { useState } from 'react';
import { X, Sliders, DollarSign, ArrowRight, Check } from 'lucide-react';

interface SavingsSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseSpend: number;
}

export const SavingsSimulatorModal: React.FC<SavingsSimulatorModalProps> = ({
  isOpen,
  onClose,
  baseSpend
}) => {
  const [weekendShutdown, setWeekendShutdown] = useState(true);
  const [devShutdownHours, setDevShutdownHours] = useState(12); // hours off per weekday
  const [spotAdoptionPct, setSpotAdoptionPct] = useState(40);
  const [gp3Migration, setGp3Migration] = useState(true);

  if (!isOpen) return null;

  // Calculate dynamic projected savings
  let simulatedSavingsMonthly = 0;

  // Non-prod auto-shutdown: ~35% of total spend is dev/staging
  const nonProdSpend = baseSpend * 0.35;
  const weekendHoursSavedPct = weekendShutdown ? (48 / 168) : 0;
  const weekdayHoursSavedPct = (devShutdownHours * 5) / 168;
  const totalScheduleSavingsPct = Math.min(0.70, weekendHoursSavedPct + weekdayHoursSavedPct);
  simulatedSavingsMonthly += nonProdSpend * totalScheduleSavingsPct;

  // Spot instances for stateless workers: ~25% of total spend
  const workerSpend = baseSpend * 0.25;
  simulatedSavingsMonthly += workerSpend * (spotAdoptionPct / 100) * 0.65; // Spot is ~65% cheaper

  // GP3 migration: ~15% of spend is EBS
  if (gp3Migration) {
    const ebsSpend = baseSpend * 0.15;
    simulatedSavingsMonthly += ebsSpend * 0.20; // 20% discount on gp3
  }

  const simulatedAnnualSavings = simulatedSavingsMonthly * 12;
  const newMonthlySpend = Math.max(0, baseSpend - simulatedSavingsMonthly);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-dark-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2">
          <Sliders className="w-4 h-4" />
          <span>AUTONOMOUS FINOPS SIMULATOR</span>
        </div>

        <h3 className="text-2xl font-bold text-white">Project AWS Cost Reductions</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Adjust architectural levers to calculate instant monthly & annual cloud savings.
        </p>

        {/* Projected Outcome Card */}
        <div className="p-4 rounded-2xl bg-dark-950 border border-emerald-500/30 mb-6 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">PROJECTED MONTHLY SAVINGS</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              +${simulatedSavingsMonthly.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">ANNUAL RUN-RATE ROI</div>
            <div className="text-lg font-bold text-white font-mono">
              ${simulatedAnnualSavings.toFixed(2)}/yr
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-5">

          {/* Weekend Shutdown Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Weekend Auto-Shutdown (Dev/Staging)</div>
              <div className="text-[11px] text-slate-400">Turn off non-production RDS and EC2 on Sat & Sun</div>
            </div>
            <input
              type="checkbox"
              checked={weekendShutdown}
              onChange={(e) => setWeekendShutdown(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Daily Nightly Sleep Slider */}
          <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Nightly Dev Idle Sleep</span>
              <span className="font-mono text-emerald-400 font-bold">{devShutdownHours} hrs/day off</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={devShutdownHours}
              onChange={(e) => setDevShutdownHours(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0h (24/7 on)</span>
              <span>8h (Overnight)</span>
              <span>16h (Aggressive)</span>
            </div>
          </div>

          {/* Spot Instance % Slider */}
          <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white">Spot Instance Worker Mix</span>
              <span className="font-mono text-emerald-400 font-bold">{spotAdoptionPct}% Spot</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="10"
              value={spotAdoptionPct}
              onChange={(e) => setSpotAdoptionPct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% On-Demand only</span>
              <span>40% Balanced</span>
              <span>80% Max Savings</span>
            </div>
          </div>

          {/* GP2 to GP3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Automate GP2 → GP3 Storage Upgrade</div>
              <div className="text-[11px] text-slate-400">Save 20% on baseline storage with zero downtime</div>
            </div>
            <input
              type="checkbox"
              checked={gp3Migration}
              onChange={(e) => setGp3Migration(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Apply Parameters to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
