import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FinOpsOverview } from './components/FinOpsOverview';
import { CostTrajectoryChart } from './components/CostTrajectoryChart';
import { RecommendationsList } from './components/RecommendationsList';
import { AnomaliesFeed } from './components/AnomaliesFeed';
import { ResourcesTable } from './components/ResourcesTable';
import { SavingsSimulatorModal } from './components/SavingsSimulatorModal';
import { FinOpsOverviewSummary, DailySpendPoint, FinOpsRecommendation, CostAnomaly, CostResource } from './types';
import { Sparkles, Terminal, Shield, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<FinOpsOverviewSummary>({
    totalMonthlySpendUSD: 4250.00,
    totalIdentifiedWasteUSD: 1870.00,
    potentialAnnualSavingsUSD: 22440.00,
    savingsPercentage: 44,
    efficiencyScore: 56,
    totalResourcesScanned: 7,
    activeRecommendationsCount: 7,
    resolvedRecommendationsCount: 0,
    remediatedSavingsUSD: 0
  });

  const [trajectory, setTrajectory] = useState<DailySpendPoint[]>([]);
  const [recommendations, setRecommendations] = useState<FinOpsRecommendation[]>([]);
  const [resources, setResources] = useState<CostResource[]>([]);
  const [anomalies, setAnomalies] = useState<CostAnomaly[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, trajRes, recRes, resRes, anomRes] = await Promise.all([
        fetch('/api/overview').then(r => r.json()).catch(() => null),
        fetch('/api/spend-trajectory').then(r => r.json()).catch(() => null),
        fetch('/api/recommendations').then(r => r.json()).catch(() => null),
        fetch('/api/resources').then(r => r.json()).catch(() => null),
        fetch('/api/anomalies').then(r => r.json()).catch(() => null),
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemediate = async (id: string) => {
    try {
      const res = await fetch(`/api/remediate/${id}`, { method: 'POST' });
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
      // Local fallback in case offline
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
          efficiencyScore: Math.min(100, prev.efficiencyScore + 7)
        };
      });
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      fetchData();
    } catch {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 font-sans">
      <Navbar
        efficiencyScore={summary.efficiencyScore}
        onOpenSimulator={() => setSimulatorOpen(true)}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                AUTOMATED FINOPS AUDIT
              </span>
              <span className="text-xs text-slate-400 font-mono">Scan completed 3m ago</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AWS Cloud Cost Intelligence & Waste Pruning
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time heuristic analysis identifies idle infrastructure, oversized instances, orphaned storage, and rogue data egress before your month-end AWS bill spikes.
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

        {/* High-Level FinOps Metric Cards */}
        <FinOpsOverview summary={summary} />

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
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-950 py-8 text-center text-xs text-slate-500 font-mono">
        CloudPrune FinOps Engine · Engineered with React 18, TypeScript, Tailwind CSS & Recharts · Multi-Cloud Cost Optimization
      </footer>
    </div>
  );
};
