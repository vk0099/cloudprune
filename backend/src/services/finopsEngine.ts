import { CostResource, FinOpsRecommendation, CostAnomaly, DailySpendPoint, FinOpsOverviewSummary } from '../types/index.js';

export class FinOpsEngine {
  private resources: CostResource[] = [
    {
      id: 'i-09f1a238d8271',
      name: 'prod-api-worker-c5.4xlarge',
      service: 'EC2',
      region: 'us-east-1',
      monthlyCostUSD: 496.40,
      wastedCostUSD: 372.30,
      utilizationPct: 8.4,
      status: 'OVERPROVISIONED',
      details: 'Average CPU utilization < 10% over last 30 days. Recommend downsizing to c5.xlarge.'
    },
    {
      id: 'rds-pg-analytics-db.m5.2xlarge',
      name: 'analytics-replica-staging',
      service: 'RDS',
      region: 'us-east-1',
      monthlyCostUSD: 712.00,
      wastedCostUSD: 712.00,
      utilizationPct: 1.2,
      status: 'IDLE',
      details: 'Zero incoming client queries in past 14 days. Idle staging RDS instance.'
    },
    {
      id: 'vol-0a87f1c4e92b516',
      name: 'unattached-app-log-backup',
      service: 'EBS',
      region: 'us-west-2',
      monthlyCostUSD: 180.00,
      wastedCostUSD: 180.00,
      utilizationPct: 0.0,
      status: 'UNATTACHED',
      details: '1.8 TB gp2 volume detached for 42 days since instance termination.'
    },
    {
      id: 'vol-0e3189d71c89012',
      name: 'core-database-storage-gp2',
      service: 'EBS',
      region: 'us-east-1',
      monthlyCostUSD: 320.00,
      wastedCostUSD: 64.00,
      utilizationPct: 65.0,
      status: 'ACTIVE',
      details: 'Legacy GP2 volume. Upgrading to GP3 saves 20% while providing baseline 3,000 IOPS.'
    },
    {
      id: 's3-data-lake-raw-telemetry',
      name: 'raw-telemetry-dumps',
      service: 'S3',
      region: 'us-east-1',
      monthlyCostUSD: 640.00,
      wastedCostUSD: 390.00,
      utilizationPct: 100.0,
      status: 'OVERPROVISIONED',
      details: '16.5 TB Standard S3 storage untouched for >90 days. Apply S3 Glacier Instant Retrieval lifecycle rule.'
    },
    {
      id: 'nat-0182749abcef1928',
      name: 'dev-vpc-nat-gateway',
      service: 'NAT_GATEWAY',
      region: 'us-east-1',
      monthlyCostUSD: 115.00,
      wastedCostUSD: 115.00,
      utilizationPct: 0.5,
      status: 'IDLE',
      details: 'Idle NAT Gateway in staging VPC with zero egress traffic. Replace with VPC S3/DynamoDB endpoints.'
    },
    {
      id: 'eip-081729481723',
      name: 'dangling-static-ip-1',
      service: 'ELASTIC_IP',
      region: 'us-east-1',
      monthlyCostUSD: 36.50,
      wastedCostUSD: 36.50,
      utilizationPct: 0.0,
      status: 'UNATTACHED',
      details: 'Unassociated Elastic IP incurring AWS hourly idle penalty.'
    }
  ];

  private recommendations: FinOpsRecommendation[] = [
    {
      id: 'rec-001',
      title: 'Downsize Overprovisioned EC2 Instance (c5.4xlarge → c5.xlarge)',
      service: 'EC2',
      resourceId: 'i-09f1a238d8271',
      currentMonthlyCost: 496.40,
      projectedMonthlyCost: 124.10,
      estimatedMonthlySavings: 372.30,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'The production worker has averaged 8.4% CPU over the past 30 days. Downsizing reduces spend by 75% without compromising throughput.',
      actionCommand: 'aws ec2 modify-instance-attribute --instance-id i-09f1a238d8271 --instance-type c5.xlarge',
      status: 'PENDING'
    },
    {
      id: 'rec-002',
      title: 'Stop or Terminate Idle Staging RDS PostgreSQL Instance',
      service: 'RDS',
      resourceId: 'rds-pg-analytics-db.m5.2xlarge',
      currentMonthlyCost: 712.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 712.00,
      impact: 'CRITICAL',
      difficulty: 'ONE_CLICK',
      description: 'Zero queries received on this staging replica over 14 days. Stopping this database recovers $712.00/month immediately.',
      actionCommand: 'aws rds stop-db-instance --db-instance-identifier rds-pg-analytics-db.m5.2xlarge',
      status: 'PENDING'
    },
    {
      id: 'rec-003',
      title: 'Delete Unattached 1.8 TB EBS Volume',
      service: 'EBS',
      resourceId: 'vol-0a87f1c4e92b516',
      currentMonthlyCost: 180.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 180.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'Volume was orphaned 42 days ago when an EC2 worker was terminated. Taking a final snapshot and deleting the volume stops continuous charges.',
      actionCommand: 'aws ec2 create-snapshot --volume-id vol-0a87f1c4e92b516 && aws ec2 delete-volume --volume-id vol-0a87f1c4e92b516',
      status: 'PENDING'
    },
    {
      id: 'rec-004',
      title: 'Migrate EBS Volumes from GP2 to GP3',
      service: 'EBS',
      resourceId: 'vol-0e3189d71c89012',
      currentMonthlyCost: 320.00,
      projectedMonthlyCost: 256.00,
      estimatedMonthlySavings: 64.00,
      impact: 'MEDIUM',
      difficulty: 'CONFIG_CHANGE',
      description: 'GP3 provides identical throughput at 20% lower cost per GB with independent IOPS scaling.',
      actionCommand: 'aws ec2 modify-volume --volume-id vol-0e3189d71c89012 --volume-type gp3',
      status: 'PENDING'
    },
    {
      id: 'rec-005',
      title: 'Enable S3 Glacier Instant Retrieval Lifecycle Rule',
      service: 'S3',
      resourceId: 's3-data-lake-raw-telemetry',
      currentMonthlyCost: 640.00,
      projectedMonthlyCost: 250.00,
      estimatedMonthlySavings: 390.00,
      impact: 'HIGH',
      difficulty: 'CONFIG_CHANGE',
      description: 'Transition 16.5 TB of raw telemetry logs unaccessed after 90 days to Glacier Instant Retrieval ($0.004/GB vs $0.023/GB).',
      actionCommand: 'aws s3api put-bucket-lifecycle-configuration --bucket s3-data-lake-raw-telemetry --lifecycle-configuration file://lifecycle.json',
      status: 'PENDING'
    },
    {
      id: 'rec-006',
      title: 'Decommission Idle Dev VPC NAT Gateway',
      service: 'NAT_GATEWAY',
      resourceId: 'nat-0182749abcef1928',
      currentMonthlyCost: 115.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 115.00,
      impact: 'MEDIUM',
      difficulty: 'PLANNED_DOWNTIME',
      description: 'Development subnet has no public routing dependencies. Removing the unused NAT Gateway saves baseline hourly fees.',
      actionCommand: 'aws ec2 delete-nat-gateway --nat-gateway-id nat-0182749abcef1928',
      status: 'PENDING'
    },
    {
      id: 'rec-007',
      title: 'Release Unattached Elastic IP',
      service: 'ELASTIC_IP',
      resourceId: 'eip-081729481723',
      currentMonthlyCost: 36.50,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 36.50,
      impact: 'LOW',
      difficulty: 'ONE_CLICK',
      description: 'AWS charges $0.005/hr for unused Elastic IPs. Releasing this allocated address eliminates ongoing waste.',
      actionCommand: 'aws ec2 release-address --allocation-id eip-081729481723',
      status: 'PENDING'
    }
  ];

  private anomalies: CostAnomaly[] = [
    {
      id: 'anom-01',
      service: 'NAT_GATEWAY',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 14.20,
      actualSpendUSD: 182.50,
      percentageSpike: 1185,
      rootCause: 'Unoptimized Docker container pulled 4.2 TB from public registry through NAT Gateway instead of ECR endpoint.',
      severity: 'CRITICAL'
    },
    {
      id: 'anom-02',
      service: 'LAMBDA',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 8.50,
      actualSpendUSD: 49.30,
      percentageSpike: 480,
      rootCause: 'Recursive S3 event trigger caused infinite loop execution in data-parser-lambda.',
      severity: 'HIGH'
    },
    {
      id: 'anom-03',
      service: 'EC2',
      date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 125.00,
      actualSpendUSD: 240.00,
      percentageSpike: 92,
      rootCause: 'Developer ran un-throttled batch ML job on On-Demand g4dn.2xlarge without Spot instance pricing.',
      severity: 'MEDIUM'
    }
  ];

  public getSummary(): FinOpsOverviewSummary {
    const totalMonthlySpendUSD = 4250.00;
    const pendingRecs = this.recommendations.filter(r => r.status === 'PENDING');
    const remediatedRecs = this.recommendations.filter(r => r.status === 'REMEDIATED');

    const totalIdentifiedWasteUSD = pendingRecs.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);
    const remediatedSavingsUSD = remediatedRecs.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);
    const potentialAnnualSavingsUSD = (totalIdentifiedWasteUSD + remediatedSavingsUSD) * 12;
    const savingsPercentage = Math.round((totalIdentifiedWasteUSD / totalMonthlySpendUSD) * 100);
    const efficiencyScore = Math.max(0, Math.min(100, Math.round(100 - (totalIdentifiedWasteUSD / totalMonthlySpendUSD) * 100)));

    return {
      totalMonthlySpendUSD,
      totalIdentifiedWasteUSD,
      potentialAnnualSavingsUSD,
      savingsPercentage,
      efficiencyScore,
      totalResourcesScanned: this.resources.length,
      activeRecommendationsCount: pendingRecs.length,
      resolvedRecommendationsCount: remediatedRecs.length,
      remediatedSavingsUSD
    };
  }

  public getDailySpendTrajectory(): DailySpendPoint[] {
    const points: DailySpendPoint[] = [];
    const baseDailySpend = 141.66; // $4,250 / 30
    const optimizedDailySpend = 79.33; // $2,380 / 30

    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const variance = (Math.sin(i / 3) * 12) + (Math.random() * 8);
      const actual = Number((baseDailySpend + variance).toFixed(2));
      const optimized = Number((optimizedDailySpend + variance * 0.4).toFixed(2));

      points.push({
        date: dateStr,
        actualSpendUSD: actual,
        optimizedSpendUSD: optimized,
        wasteUSD: Number((actual - optimized).toFixed(2))
      });
    }

    return points;
  }

  public getRecommendations(): FinOpsRecommendation[] {
    return this.recommendations;
  }

  public getResources(): CostResource[] {
    return this.resources;
  }

  public getAnomalies(): CostAnomaly[] {
    return this.anomalies;
  }

  public remediate(id: string): FinOpsRecommendation | null {
    const rec = this.recommendations.find(r => r.id === id);
    if (!rec) return null;
    rec.status = 'REMEDIATED';
    rec.remediatedAt = new Date().toISOString();
    return rec;
  }

  public resetRemediations(): void {
    this.recommendations.forEach(r => {
      r.status = 'PENDING';
      delete r.remediatedAt;
    });
  }
}
