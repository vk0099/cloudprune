export type AWSService = 'EC2' | 'RDS' | 'EBS' | 'S3' | 'NAT_GATEWAY' | 'ELASTIC_IP' | 'LAMBDA';

export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ActionStatus = 'PENDING' | 'REMEDIATED' | 'IGNORED';

export interface CostResource {
  id: string;
  name: string;
  service: AWSService;
  region: string;
  monthlyCostUSD: number;
  wastedCostUSD: number;
  utilizationPct: number;
  status: 'ACTIVE' | 'IDLE' | 'UNATTACHED' | 'OVERPROVISIONED';
  details: string;
}

export interface FinOpsRecommendation {
  id: string;
  title: string;
  service: AWSService;
  resourceId: string;
  currentMonthlyCost: number;
  projectedMonthlyCost: number;
  estimatedMonthlySavings: number;
  impact: ImpactLevel;
  difficulty: 'ONE_CLICK' | 'PLANNED_DOWNTIME' | 'CONFIG_CHANGE';
  description: string;
  actionCommand: string;
  status: ActionStatus;
  remediatedAt?: string;
}

export interface CostAnomaly {
  id: string;
  service: AWSService;
  date: string;
  expectedSpendUSD: number;
  actualSpendUSD: number;
  percentageSpike: number;
  rootCause: string;
  severity: ImpactLevel;
}

export interface DailySpendPoint {
  date: string;
  actualSpendUSD: number;
  optimizedSpendUSD: number;
  wasteUSD: number;
}

export interface FinOpsOverviewSummary {
  totalMonthlySpendUSD: number;
  totalIdentifiedWasteUSD: number;
  potentialAnnualSavingsUSD: number;
  savingsPercentage: number;
  efficiencyScore: number; // 0 to 100
  totalResourcesScanned: number;
  activeRecommendationsCount: number;
  resolvedRecommendationsCount: number;
  remediatedSavingsUSD: number;
}
