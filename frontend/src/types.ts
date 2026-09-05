export type CloudProvider = 'ALL' | 'AWS' | 'OCI' | 'GCP' | 'AZURE';

export type AWSService = 'EC2' | 'RDS' | 'EBS' | 'S3' | 'NAT_GATEWAY' | 'ELASTIC_IP' | 'LAMBDA';
export type OCIService = 'OCI_COMPUTE' | 'OCI_BLOCK_STORAGE' | 'OCI_AUTONOMOUS_DB' | 'OCI_OBJECT_STORAGE' | 'OCI_VCN_NAT' | 'OCI_BOOT_VOLUME';
export type GCPService = 'GCP_COMPUTE' | 'GCP_CLOUD_SQL' | 'GCP_PERSISTENT_DISK' | 'GCP_CLOUD_STORAGE' | 'GCP_CLOUD_NAT';
export type AzureService = 'AZURE_VM' | 'AZURE_SQL' | 'AZURE_MANAGED_DISK' | 'AZURE_BLOB_STORAGE' | 'AZURE_NAT_GATEWAY';

export type CloudService = AWSService | OCIService | GCPService | AzureService;

export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ActionStatus = 'PENDING' | 'REMEDIATED' | 'IGNORED';

export interface CostResource {
  id: string;
  name: string;
  provider: 'AWS' | 'OCI' | 'GCP' | 'AZURE';
  service: CloudService;
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
  provider: 'AWS' | 'OCI' | 'GCP' | 'AZURE';
  service: CloudService;
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
  provider: 'AWS' | 'OCI' | 'GCP' | 'AZURE';
  service: CloudService;
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

export interface ProviderSpendSummary {
  spendUSD: number;
  wasteUSD: number;
  resourcesCount: number;
  recommendationsCount: number;
  efficiencyScore: number;
}

export interface FinOpsOverviewSummary {
  totalMonthlySpendUSD: number;
  totalIdentifiedWasteUSD: number;
  potentialAnnualSavingsUSD: number;
  savingsPercentage: number;
  efficiencyScore: number;
  totalResourcesScanned: number;
  activeRecommendationsCount: number;
  resolvedRecommendationsCount: number;
  remediatedSavingsUSD: number;
  providerBreakdown?: {
    AWS: ProviderSpendSummary;
    OCI: ProviderSpendSummary;
    GCP: ProviderSpendSummary;
    AZURE: ProviderSpendSummary;
  };
}
