import React from 'react';
import { CostResource } from '../types';

interface ResourcesTableProps {
  resources: CostResource[];
}

export const ResourcesTable: React.FC<ResourcesTableProps> = ({ resources }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">OPTIMAL</span>;
      case 'IDLE':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-semibold">100% IDLE</span>;
      case 'UNATTACHED':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-semibold">DANGLING</span>;
      case 'OVERPROVISIONED':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-semibold">OVERSIZED</span>;
      default:
        return null;
    }
  };

  const getProviderBadge = (provider: 'AWS' | 'OCI' | 'GCP' | 'AZURE') => {
    switch (provider) {
      case 'OCI':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            OCI
          </span>
        );
      case 'AWS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            AWS
          </span>
        );
      case 'GCP':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            GCP
          </span>
        );
      case 'AZURE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            AZURE
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800/80 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Multi-Cloud Resource Inventory & Utilization</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry scan across OCI, AWS, GCP, and Azure compute, storage, and databases.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">{resources.length} Resources Tracked</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <th className="pb-3 font-semibold">CLOUD</th>
              <th className="pb-3 font-semibold">RESOURCE</th>
              <th className="pb-3 font-semibold">SERVICE & REGION</th>
              <th className="pb-3 font-semibold">UTILIZATION</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold">MONTHLY COST</th>
              <th className="pb-3 font-semibold text-right">WASTED COST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-dark-950/40 transition-colors">
                <td className="py-3">
                  {getProviderBadge(res.provider)}
                </td>
                <td className="py-3 font-mono font-semibold text-slate-200">
                  <div>{res.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{res.id}</div>
                </td>
                <td className="py-3">
                  <div className="text-slate-300 font-semibold">{res.service}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{res.region}</div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-dark-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${res.utilizationPct < 15 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.max(5, res.utilizationPct)}%` }}
                      />
                    </div>
                    <span className="font-mono text-slate-300">{res.utilizationPct}%</span>
                  </div>
                </td>
                <td className="py-3">{getStatusBadge(res.status)}</td>
                <td className="py-3 font-mono text-slate-300">${res.monthlyCostUSD.toFixed(2)}</td>
                <td className="py-3 font-mono font-bold text-rose-400 text-right">
                  {res.wastedCostUSD > 0 ? `-$${res.wastedCostUSD.toFixed(2)}` : '$0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
