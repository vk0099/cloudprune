import {
  CostResource,
  FinOpsRecommendation,
  CostAnomaly,
  DailySpendPoint,
  FinOpsOverviewSummary,
  CloudProvider,
  ProviderSpendSummary
} from '../types/index.js';

export class FinOpsEngine {
  private resources: CostResource[] = [
    // ==========================================
    // 1. AWS (Amazon Web Services) Resources
    // ==========================================
    {
      id: 'i-09f1a238d8271',
      name: 'prod-api-worker-c5.4xlarge',
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
      service: 'ELASTIC_IP',
      region: 'us-east-1',
      monthlyCostUSD: 36.50,
      wastedCostUSD: 36.50,
      utilizationPct: 0.0,
      status: 'UNATTACHED',
      details: 'Unassociated Elastic IP incurring AWS hourly idle penalty.'
    },

    // ==========================================
    // 2. Oracle Cloud Infrastructure (OCI) Resources
    // ==========================================
    {
      id: 'ocid1.instance.oc1.iad.abuwcljtsq...',
      name: 'oci-ampere-a1-flex-app-cluster',
      provider: 'OCI',
      service: 'OCI_COMPUTE',
      region: 'us-ashburn-1',
      monthlyCostUSD: 345.60,
      wastedCostUSD: 240.00,
      utilizationPct: 12.5,
      status: 'OVERPROVISIONED',
      details: 'Configured with 8 OCPUs / 48GB RAM. Average utilization is under 15%. Downsize to 4 OCPUs / 24GB.'
    },
    {
      id: 'ocid1.bootvolume.oc1.iad.abuwcljtvpu...',
      name: 'oci-prod-boot-volume-120vpu',
      provider: 'OCI',
      service: 'OCI_BOOT_VOLUME',
      region: 'us-ashburn-1',
      monthlyCostUSD: 168.00,
      wastedCostUSD: 126.00,
      utilizationPct: 18.0,
      status: 'OVERPROVISIONED',
      details: 'Allocated Ultra High Performance (120 VPU) for web frontend. Tune down to Balanced (10 VPU).'
    },
    {
      id: 'ocid1.autonomousdb.oc1.iad.abuwcljtatp...',
      name: 'oci-staging-atp-datawarehouse',
      provider: 'OCI',
      service: 'OCI_AUTONOMOUS_DB',
      region: 'us-ashburn-1',
      monthlyCostUSD: 840.00,
      wastedCostUSD: 840.00,
      utilizationPct: 0.0,
      status: 'IDLE',
      details: 'Autonomous Transaction Processing database idle over weekends and off-hours. Enable Auto-Stop.'
    },
    {
      id: 'ocid1.bucket.oc1.iad.archive-logs...',
      name: 'oci-raw-audit-logs-bucket',
      provider: 'OCI',
      service: 'OCI_OBJECT_STORAGE',
      region: 'us-ashburn-1',
      monthlyCostUSD: 215.00,
      wastedCostUSD: 172.00,
      utilizationPct: 95.0,
      status: 'OVERPROVISIONED',
      details: '8.2 TB in Standard Tier untouched for 60+ days. Transition to OCI Archive Storage Tier ($0.0026/GB).'
    },

    // ==========================================
    // 3. Google Cloud Platform (GCP) Resources
    // ==========================================
    {
      id: 'gcp-n2-standard-16-worker-pool',
      name: 'gcp-ml-inference-n2-standard-16',
      provider: 'GCP',
      service: 'GCP_COMPUTE',
      region: 'us-central1-a',
      monthlyCostUSD: 588.00,
      wastedCostUSD: 410.00,
      utilizationPct: 14.2,
      status: 'OVERPROVISIONED',
      details: 'Custom N2 instance over-allocated for baseline workload. Recommend switching to E2-standard-4 or Spot.'
    },
    {
      id: 'gcp-sql-pg-analytics-dev',
      name: 'gcp-cloudsql-postgres-dev',
      provider: 'GCP',
      service: 'GCP_CLOUD_SQL',
      region: 'us-central1-b',
      monthlyCostUSD: 290.00,
      wastedCostUSD: 290.00,
      utilizationPct: 0.0,
      status: 'IDLE',
      details: 'Cloud SQL instance in dev environment active 24/7 without weekend schedule or sleep mode.'
    },
    {
      id: 'gcp-pd-ssd-unattached-disk-500g',
      name: 'gcp-unattached-ssd-persistent-disk',
      provider: 'GCP',
      service: 'GCP_PERSISTENT_DISK',
      region: 'us-central1-c',
      monthlyCostUSD: 85.00,
      wastedCostUSD: 85.00,
      utilizationPct: 0.0,
      status: 'UNATTACHED',
      details: '500 GB SSD persistent disk orphaned after GKE node pool recreation.'
    },

    // ==========================================
    // 4. Microsoft Azure Resources
    // ==========================================
    {
      id: '/subscriptions/sub-1/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/vm-app-d8s-v5',
      name: 'azure-backend-vm-standard-d8s-v5',
      provider: 'AZURE',
      service: 'AZURE_VM',
      region: 'eastus2',
      monthlyCostUSD: 412.00,
      wastedCostUSD: 288.00,
      utilizationPct: 11.0,
      status: 'OVERPROVISIONED',
      details: 'Standard D8s v5 instance averaging 11% CPU. Downsize to D4s v5 or B-series burstable.'
    },
    {
      id: '/subscriptions/sub-1/resourceGroups/rg-data/providers/Microsoft.Sql/servers/sql-staging/databases/db-test',
      name: 'azure-sql-db-staging-gp-gen5-4',
      provider: 'AZURE',
      service: 'AZURE_SQL',
      region: 'eastus2',
      monthlyCostUSD: 365.00,
      wastedCostUSD: 365.00,
      utilizationPct: 0.8,
      status: 'IDLE',
      details: 'General Purpose 4-vCore Azure SQL database idle in staging subscription.'
    },
    {
      id: '/subscriptions/sub-1/resourceGroups/rg-infra/providers/Microsoft.Compute/disks/disk-unattached-p30',
      name: 'azure-unattached-premium-ssd-1tb',
      provider: 'AZURE',
      service: 'AZURE_MANAGED_DISK',
      region: 'eastus2',
      monthlyCostUSD: 135.00,
      wastedCostUSD: 135.00,
      utilizationPct: 0.0,
      status: 'UNATTACHED',
      details: '1 TB P30 Premium SSD disk detached and unreferenced for 28 days.'
    }
  ];

  private recommendations: FinOpsRecommendation[] = [
    // AWS Recommendations
    {
      id: 'rec-001',
      title: 'Downsize Overprovisioned EC2 Instance (c5.4xlarge → c5.xlarge)',
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
      service: 'EBS',
      resourceId: 'vol-0a87f1c4e92b516',
      currentMonthlyCost: 180.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 180.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'Volume was orphaned 42 days ago when an EC2 worker was terminated. Taking a snapshot and deleting the volume stops continuous charges.',
      actionCommand: 'aws ec2 create-snapshot --volume-id vol-0a87f1c4e92b516 && aws ec2 delete-volume --volume-id vol-0a87f1c4e92b516',
      status: 'PENDING'
    },
    {
      id: 'rec-004',
      title: 'Migrate EBS Volumes from GP2 to GP3',
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
      provider: 'AWS',
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
    },

    // OCI Recommendations
    {
      id: 'rec-008',
      title: 'Rightsize OCI Ampere A1 Flex Shape to Always Free Quota (8 OCPUs/48GB → 4 OCPUs/24GB)',
      provider: 'OCI',
      service: 'OCI_COMPUTE',
      resourceId: 'ocid1.instance.oc1.iad.abuwcljtsq...',
      currentMonthlyCost: 345.60,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 345.60,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'Ampere A1 Flex instance is overprovisioned. Downsizing to 4 OCPUs / 24 GB RAM brings usage within the 3,000 OCPU-hours/mo Always Free allowance ($0.00/mo).',
      actionCommand: 'oci compute instance update --instance-id ocid1.instance.oc1.iad.abuwcljtsq... --shape-config "{\\"ocpus\\":4,\\"memoryInGBs\\":24}"',
      status: 'PENDING'
    },
    {
      id: 'rec-009',
      title: 'Tune OCI Boot Volume VPU Performance (120 VPU → 10 Balanced VPU)',
      provider: 'OCI',
      service: 'OCI_BOOT_VOLUME',
      resourceId: 'ocid1.bootvolume.oc1.iad.abuwcljtvpu...',
      currentMonthlyCost: 168.00,
      projectedMonthlyCost: 42.00,
      estimatedMonthlySavings: 126.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'Volume is configured with 120 VPU Ultra High Performance for standard web workload. Changing to 10 VPU saves 75% without disk latency degradation.',
      actionCommand: 'oci bv boot-volume update --boot-volume-id ocid1.bootvolume.oc1.iad.abuwcljtvpu... --vpu 10',
      status: 'PENDING'
    },
    {
      id: 'rec-010',
      title: 'Enable Auto-Stop Schedule on Staging Autonomous DB (ATP)',
      provider: 'OCI',
      service: 'OCI_AUTONOMOUS_DB',
      resourceId: 'ocid1.autonomousdb.oc1.iad.abuwcljtatp...',
      currentMonthlyCost: 840.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 840.00,
      impact: 'CRITICAL',
      difficulty: 'ONE_CLICK',
      description: 'Autonomous Database in staging has received 0 queries. Halting compute recovers $840.00/mo while preserving database storage.',
      actionCommand: 'oci db autonomous-database stop --autonomous-database-id ocid1.autonomousdb.oc1.iad.abuwcljtatp...',
      status: 'PENDING'
    },
    {
      id: 'rec-011',
      title: 'Configure OCI Object Storage Lifecycle to Archive Tier',
      provider: 'OCI',
      service: 'OCI_OBJECT_STORAGE',
      resourceId: 'ocid1.bucket.oc1.iad.archive-logs...',
      currentMonthlyCost: 215.00,
      projectedMonthlyCost: 43.00,
      estimatedMonthlySavings: 172.00,
      impact: 'MEDIUM',
      difficulty: 'CONFIG_CHANGE',
      description: 'Move 8.2 TB of historical audit logs to OCI Archive Tier ($0.0026/GB/month) via bucket lifecycle policy.',
      actionCommand: 'oci os object-lifecycle-policy put --namespace-name prod --bucket-name oci-raw-audit-logs-bucket --items file://policy.json',
      status: 'PENDING'
    },

    // GCP Recommendations
    {
      id: 'rec-012',
      title: 'Downsize GCP Custom Compute Instance (n2-standard-16 → e2-standard-4)',
      provider: 'GCP',
      service: 'GCP_COMPUTE',
      resourceId: 'gcp-n2-standard-16-worker-pool',
      currentMonthlyCost: 588.00,
      projectedMonthlyCost: 178.00,
      estimatedMonthlySavings: 410.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'Average CPU is 14.2%. Switching to cost-efficient E2 series saves $410.00/month with zero SLA disruption.',
      actionCommand: 'gcloud compute instances set-machine-type gcp-ml-inference-n2-standard-16 --zone=us-central1-a --machine-type=e2-standard-4',
      status: 'PENDING'
    },
    {
      id: 'rec-013',
      title: 'Schedule Automatic Weekend Shutdown on GCP Cloud SQL Dev DB',
      provider: 'GCP',
      service: 'GCP_CLOUD_SQL',
      resourceId: 'gcp-sql-pg-analytics-dev',
      currentMonthlyCost: 290.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 290.00,
      impact: 'CRITICAL',
      difficulty: 'CONFIG_CHANGE',
      description: 'Development database active continuously. Stopping non-production databases during off-peak saves 100% of compute.',
      actionCommand: 'gcloud sql instances patch gcp-cloudsql-postgres-dev --activation-policy=NEVER',
      status: 'PENDING'
    },
    {
      id: 'rec-014',
      title: 'Delete Orphaned 500GB SSD Persistent Disk in GCP',
      provider: 'GCP',
      service: 'GCP_PERSISTENT_DISK',
      resourceId: 'gcp-pd-ssd-unattached-disk-500g',
      currentMonthlyCost: 85.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 85.00,
      impact: 'MEDIUM',
      difficulty: 'ONE_CLICK',
      description: 'Unattached SSD persistent disk incurring daily storage billing after cluster deletion.',
      actionCommand: 'gcloud compute disks delete gcp-unattached-ssd-persistent-disk --zone=us-central1-c --quiet',
      status: 'PENDING'
    },

    // Azure Recommendations
    {
      id: 'rec-015',
      title: 'Rightsize Azure VM (Standard_D8s_v5 → Standard_D4s_v5)',
      provider: 'AZURE',
      service: 'AZURE_VM',
      resourceId: '/subscriptions/sub-1/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/vm-app-d8s-v5',
      currentMonthlyCost: 412.00,
      projectedMonthlyCost: 124.00,
      estimatedMonthlySavings: 288.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'VM utilized at 11% CPU over 30 days. Downsizing to D4s v5 saves $288.00/month.',
      actionCommand: 'az vm update --resource-group rg-prod --name vm-app-d8s-v5 --size Standard_D4s_v5',
      status: 'PENDING'
    },
    {
      id: 'rec-016',
      title: 'Pause or Scale Down Idle Azure SQL Database (4 vCore)',
      provider: 'AZURE',
      service: 'AZURE_SQL',
      resourceId: '/subscriptions/sub-1/resourceGroups/rg-data/providers/Microsoft.Sql/servers/sql-staging/databases/db-test',
      currentMonthlyCost: 365.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 365.00,
      impact: 'CRITICAL',
      difficulty: 'ONE_CLICK',
      description: 'Zero incoming requests on test database. Switching to Serverless Auto-Pause saves $365.00/month.',
      actionCommand: 'az sql db update --resource-group rg-data --server sql-staging --name db-test --edition GeneralPurpose --family Gen5 --capacity 1 --compute-model Serverless --auto-pause-delay 60',
      status: 'PENDING'
    },
    {
      id: 'rec-017',
      title: 'Delete Unattached 1TB Azure Premium SSD Managed Disk',
      provider: 'AZURE',
      service: 'AZURE_MANAGED_DISK',
      resourceId: '/subscriptions/sub-1/resourceGroups/rg-infra/providers/Microsoft.Compute/disks/disk-unattached-p30',
      currentMonthlyCost: 135.00,
      projectedMonthlyCost: 0.00,
      estimatedMonthlySavings: 135.00,
      impact: 'HIGH',
      difficulty: 'ONE_CLICK',
      description: 'P30 Premium SSD disk has been unattached for 28 days following VM cleanup.',
      actionCommand: 'az disk delete --resource-group rg-infra --name disk-unattached-p30 --yes',
      status: 'PENDING'
    }
  ];

  private anomalies: CostAnomaly[] = [
    {
      id: 'anom-01',
      provider: 'AWS',
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
      provider: 'OCI',
      service: 'OCI_BOOT_VOLUME',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 24.00,
      actualSpendUSD: 168.00,
      percentageSpike: 600,
      rootCause: 'Terraform script applied 120 VPU Ultra Performance to dev compute boot volume instead of Balanced 10 VPU.',
      severity: 'HIGH'
    },
    {
      id: 'anom-03',
      provider: 'AWS',
      service: 'LAMBDA',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 8.50,
      actualSpendUSD: 49.30,
      percentageSpike: 480,
      rootCause: 'Recursive S3 event trigger caused infinite loop execution in data-parser-lambda.',
      severity: 'HIGH'
    },
    {
      id: 'anom-04',
      provider: 'GCP',
      service: 'GCP_CLOUD_NAT',
      date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 12.00,
      actualSpendUSD: 110.00,
      percentageSpike: 816,
      rootCause: 'Cross-region BigQuery export piped raw dataset through external Cloud NAT IP.',
      severity: 'CRITICAL'
    },
    {
      id: 'anom-05',
      provider: 'AZURE',
      service: 'AZURE_BLOB_STORAGE',
      date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      expectedSpendUSD: 35.00,
      actualSpendUSD: 195.00,
      percentageSpike: 457,
      rootCause: 'Application diagnostic logging set to Verbose level without retention lifecycle policy.',
      severity: 'MEDIUM'
    }
  ];

  public getSummary(provider: CloudProvider = 'ALL'): FinOpsOverviewSummary {
    const filterProvider = (p: 'AWS' | 'OCI' | 'GCP' | 'AZURE') => provider === 'ALL' || provider === p;

    const filteredResources = this.resources.filter(r => filterProvider(r.provider));
    const filteredRecs = this.recommendations.filter(r => filterProvider(r.provider));

    const pendingRecs = filteredRecs.filter(r => r.status === 'PENDING');
    const remediatedRecs = filteredRecs.filter(r => r.status === 'REMEDIATED');

    const totalMonthlySpendUSD = filteredResources.reduce((acc, r) => acc + r.monthlyCostUSD, 0);
    const totalIdentifiedWasteUSD = pendingRecs.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);
    const remediatedSavingsUSD = remediatedRecs.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);
    const potentialAnnualSavingsUSD = (totalIdentifiedWasteUSD + remediatedSavingsUSD) * 12;

    const savingsPercentage = totalMonthlySpendUSD > 0
      ? Math.round((totalIdentifiedWasteUSD / totalMonthlySpendUSD) * 100)
      : 0;
    const efficiencyScore = totalMonthlySpendUSD > 0
      ? Math.max(0, Math.min(100, Math.round(100 - (totalIdentifiedWasteUSD / totalMonthlySpendUSD) * 100)))
      : 100;

    // Helper for provider breakdown
    const getProviderSummary = (p: 'AWS' | 'OCI' | 'GCP' | 'AZURE'): ProviderSpendSummary => {
      const pResources = this.resources.filter(r => r.provider === p);
      const pRecs = this.recommendations.filter(r => r.provider === p && r.status === 'PENDING');
      const spend = pResources.reduce((acc, r) => acc + r.monthlyCostUSD, 0);
      const waste = pRecs.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);
      const score = spend > 0 ? Math.max(0, Math.min(100, Math.round(100 - (waste / spend) * 100))) : 100;
      return {
        spendUSD: Number(spend.toFixed(2)),
        wasteUSD: Number(waste.toFixed(2)),
        resourcesCount: pResources.length,
        recommendationsCount: pRecs.length,
        efficiencyScore: score
      };
    };

    return {
      totalMonthlySpendUSD: Number(totalMonthlySpendUSD.toFixed(2)),
      totalIdentifiedWasteUSD: Number(totalIdentifiedWasteUSD.toFixed(2)),
      potentialAnnualSavingsUSD: Number(potentialAnnualSavingsUSD.toFixed(2)),
      savingsPercentage,
      efficiencyScore,
      totalResourcesScanned: filteredResources.length,
      activeRecommendationsCount: pendingRecs.length,
      resolvedRecommendationsCount: remediatedRecs.length,
      remediatedSavingsUSD: Number(remediatedSavingsUSD.toFixed(2)),
      providerBreakdown: {
        AWS: getProviderSummary('AWS'),
        OCI: getProviderSummary('OCI'),
        GCP: getProviderSummary('GCP'),
        AZURE: getProviderSummary('AZURE')
      }
    };
  }

  public getDailySpendTrajectory(provider: CloudProvider = 'ALL'): DailySpendPoint[] {
    const summary = this.getSummary(provider);
    const points: DailySpendPoint[] = [];
    const baseDailySpend = summary.totalMonthlySpendUSD / 30;
    const optimizedDailySpend = (summary.totalMonthlySpendUSD - summary.totalIdentifiedWasteUSD) / 30;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const variance = (Math.sin(i / 3) * (baseDailySpend * 0.1)) + (Math.random() * (baseDailySpend * 0.05));
      const actual = Number((baseDailySpend + variance).toFixed(2));
      const optimized = Number((optimizedDailySpend + variance * 0.35).toFixed(2));

      points.push({
        date: dateStr,
        actualSpendUSD: actual,
        optimizedSpendUSD: optimized,
        wasteUSD: Number(Math.max(0, actual - optimized).toFixed(2))
      });
    }

    return points;
  }

  public getRecommendations(provider: CloudProvider = 'ALL'): FinOpsRecommendation[] {
    if (provider === 'ALL') return this.recommendations;
    return this.recommendations.filter(r => r.provider === provider);
  }

  public getResources(provider: CloudProvider = 'ALL'): CostResource[] {
    if (provider === 'ALL') return this.resources;
    return this.resources.filter(r => r.provider === provider);
  }

  public getAnomalies(provider: CloudProvider = 'ALL'): CostAnomaly[] {
    if (provider === 'ALL') return this.anomalies;
    return this.anomalies.filter(r => r.provider === provider);
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

export const finopsEngine = new FinOpsEngine();
