terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# IAM Role for FinOps Read-Only Cost & Resource Auditor
resource "aws_iam_role" "finops_scanner_role" {
  name = "cloudprune-finops-scanner-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = "CloudPrune"
    ManagedBy   = "Terraform"
  }
}

# Attach AWS Managed ReadOnlyAccess for Cost Explorer & CloudWatch
resource "aws_iam_role_policy_attachment" "cost_explorer_readonly" {
  role       = aws_iam_role.finops_scanner_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_readonly" {
  role       = aws_iam_role.finops_scanner_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"
}

# Custom Policy for EC2/RDS/EBS Utilization Inspection
resource "aws_iam_policy" "finops_resource_inspection_policy" {
  name        = "cloudprune-resource-inspection-policy"
  description = "Allows CloudPrune to describe EC2, RDS, EBS, S3, and NAT Gateways for idle waste detection"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeVolumes",
          "ec2:DescribeSnapshots",
          "ec2:DescribeNatGateways",
          "ec2:DescribeAddresses",
          "rds:DescribeDBInstances",
          "s3:ListAllMyBuckets",
          "s3:GetBucketLifecycleConfiguration"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "custom_inspection_attach" {
  role       = aws_iam_role.finops_scanner_role.name
  policy_arn = aws_iam_policy.finops_resource_inspection_policy.arn
}

# CloudWatch Billing Metric Alarm for Anomalous Daily Spikes
resource "aws_cloudwatch_metric_alarm" "billing_anomaly_alarm" {
  alarm_name          = "cloudprune-daily-cost-spike-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = "86400" # 24 hours
  statistic           = "Maximum"
  threshold           = var.daily_cost_threshold_usd
  alarm_description   = "Triggered when estimated daily charges exceed the defined FinOps budget limit."

  dimensions = {
    Currency = "USD"
  }

  tags = {
    Environment = var.environment
    Project     = "CloudPrune"
  }
}
