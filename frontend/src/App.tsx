import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FinOpsOverview } from './components/FinOpsOverview';
import { CostTrajectoryChart } from './components/CostTrajectoryChart';
import { RecommendationsList } from './components/RecommendationsList';
import { AnomaliesFeed } from './components/AnomaliesFeed';
import { ResourcesTable } from './components/ResourcesTable';
import { SavingsSimulatorModal } from './components/SavingsSimulatorModal';
import {
  FinOpsOverviewSummary,
  DailySpendPoint,
  FinOpsRecommendation,
  CostAnomaly,
  CostResource,
  CloudProvider
} from './types';
import { Sparkles, Shield, Layers, Server } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('ALL');
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<FinOpsOverviewSummary>({
    totalMonthlySpendUSD: 7420.00,
    totalIdentifiedWasteUSD: 3120.00,
    potentialAnnualSavingsUSD: 37440.00,
    savingsPercentage: 42,
    efficiencyScore: 58,
    totalResourcesScanned: 13,
    activeRecommendationsCount: 13,
    resolvedRecommendationsCount: 0,
    remediatedSavingsUSD: 0
  });

  const [trajectory, setTrajectory] = useState<DailySpendPoint[]>([]);
  const [recommendations, setRecommendations] = useState<FinOpsRecommendation[]>([]);
  const [resources, setResources] = useState<CostResource[]>([]);
  const [anomalies, setAnomalies] = useState<CostAnomaly[]>([]);

  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/cloudprune')) {
      return '/cloudprune/api';
    }
    return '/api';
  };

  const fetchData = useCallback(async (provider: CloudProvider) => {
    try {
      setLoading(true);
      const apiBase = getApiBase();
      const q = provider === 'ALL' ? '' : `?provider=${provider}`;

      const [sumRes, trajRes, recRes, resRes, anomRes] = await Promise.all([
        fetch(`${apiBase}/overview${q}`).then(r => r.json()).catch(() => null),
        fetch(`${apiBase}/spend-trajectory${q}`).then(r => r.json()).catch(() => null),
        fetch(`${apiBase}/recommendations${q}`).then(r => r.json()).catch(() => null),
        fetch(`${apiBase}/resources${q}`).then(r => r.json()).catch(() => null),
        fetch(`${apiBase}/anomalies${q}`).then(r => r.json()).catch(() => null),
      ]);

      if (sumRes?.data) setSummary(sumRes.data);
      if (trajRes?.data) setTrajectory(trajRes.data);
      if (recRes?.data) setRecommendations(recRes.data);
      if (resRes?.data) setResources(resRes.data);
      if (anomRes?.data) setAnomalies(anomRes.data);
    } catch (err) {
      console.error('Failed to fetch FinOps data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedProvider);
  }, [selectedProvider, fetchData]);

  const handleRemediate = async (id: string) => {
    try {
      const apiBase = getApiBase();
      const q = selectedProvider === 'ALL' ? '' : `?provider=${selectedProvider}`;
      const res = await fetch(`${apiBase}/remediate/${id}${q}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRecommendations(prev =>
          prev.map(r => r.id === id ? { ...r, status: 'REMEDIATED', remediatedAt: new Date().toISOString() } : r)
        );
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      // Local fallback
      setRecommendations(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'REMEDIATED', remediatedAt: new Date().toISOString() } : r)
      );
      setSummary(prev => {
        const rec = recommendations.find(r => r.id === id);
        const savings = rec ? rec.estimatedMonthlySavings : 0;
        const newWaste = Math.max(0, prev.totalIdentifiedWasteUSD - savings);
        return {
          ...prev,
          totalIdentifiedWasteUSD: newWaste,
          remediatedSavingsUSD: prev.remediatedSavingsUSD + savings,
          resolvedRecommendationsCount: prev.resolvedRecommendationsCount + 1,
          activeRecommendationsCount: Math.max(0, prev.activeRecommendationsCount - 1),
          efficiencyScore: Math.min(100, prev.efficiencyScore + 5)
        };
      });
    }
  };

  const handleReset = async () => {
    try {
      const apiBase = getApiBase();
      const q = selectedProvider === 'ALL' ? '' : `?provider=${selectedProvider}`;
      await fetch(`${apiBase}/reset${q}`, { method: 'POST' });
      fetchData(selectedProvider);
    } catch {
      fetchData(selectedProvider);
    }
  };

  const providerFilters: { key: CloudProvider; label: string; badge?: string }[] = [
    { key: 'ALL', label: 'All Clouds (Consolidated)' },
    { key: 'OCI', label: 'Oracle Cloud (OCI)', badge: 'Live Tenancy' },
    { key: 'AWS', label: 'Amazon AWS' },
    { key: 'GCP', label: 'Google Cloud (GCP)' },
    { key: 'AZURE', label: 'Microsoft Azure' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 font-sans">
      <Navbar
        efficiencyScore={summary.efficiencyScore}
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        onOpenSimulator={() => setSimulatorOpen(true)}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                MULTI-CLOUD FINOPS GOVERNANCE
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-time scan active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedProvider === 'ALL' && 'Multi-Cloud Cost Intelligence & Autonomous Waste Pruning'}
              {selectedProvider === 'OCI' && 'Oracle Cloud (OCI) FinOps & Flex Shape Rightsizing'}
              {selectedProvider === 'AWS' && 'AWS Cost Governance & Resource Optimization'}
              {selectedProvider === 'GCP' && 'Google Cloud (GCP) Machine & Disk Waste Pruner'}
              {selectedProvider === 'AZURE' && 'Microsoft Azure Cloud Cost Intelligence'}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              {selectedProvider === 'ALL' &&
                'Autonomous heuristic analysis across Oracle Cloud (OCI), AWS, GCP, and Azure. Identifies oversized shapes, idle databases, dangling disks, and unoptimized storage tiering.'}
              {selectedProvider === 'OCI' &&
                'Fine-tune OCPU & RAM allocations on VM.Standard.A1/E4 Flex shapes, reduce Block Volume VPUs from 120 to 10, auto-stop idle Autonomous DBs, and enforce Always Free tier quotas.'}
              {selectedProvider === 'AWS' &&
                'Prune idle staging RDS instances, downsize oversized EC2 compute, migrate GP2 to GP3 EBS volumes, and transition S3 buckets to Glacier Instant Retrieval.'}
              {selectedProvider === 'GCP' &&
                'Rightsize Custom N2 compute to cost-effective E2 shapes, schedule Cloud SQL off-peak sleep, and purge orphaned Persistent SSD disks.'}
              {selectedProvider === 'AZURE' &&
                'Downsize oversized Standard D-series VMs, activate Serverless SQL auto-pause, and eliminate unattached P30 Premium SSD managed disks.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSimulatorOpen(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Simulator</span>
            </button>
          </div>
        </div>

        {/* Multi-Cloud Provider Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
          <span className="text-xs text-slate-400 font-mono mr-1 hidden sm:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Scope:
          </span>
          {providerFilters.map((p) => {
            const isSelected = selectedProvider === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedProvider(p.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{p.label}</span>
                {p.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* High-Level FinOps Metric Cards & Provider Breakdown */}
        <FinOpsOverview
          summary={summary}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
        />

        {/* Cost Spend vs Trajectory Chart */}
        {trajectory.length > 0 && <CostTrajectoryChart data={trajectory} />}

        {/* Actionable Recommendations List */}
        <RecommendationsList
          recommendations={recommendations}
          onRemediate={handleRemediate}
        />

        {/* Grid: Anomalies Feed & Scanned Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AnomaliesFeed anomalies={anomalies} />
          </div>
          <div className="lg:col-span-2">
            <ResourcesTable resources={resources} />
          </div>
        </div>

      </main>

      {/* Simulator Modal */}
      <SavingsSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        baseSpend={summary.totalMonthlySpendUSD}
        selectedProvider={selectedProvider}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-950 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CloudPrune Multi-Cloud FinOps Engine · VanceK Platform</span>
          <span className="text-slate-400">Oracle Cloud (OCI) · Amazon AWS · Google Cloud (GCP) · Microsoft Azure</span>
        </div>
      </footer>
    </div>
  );
};
