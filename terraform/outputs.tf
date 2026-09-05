output "scanner_role_arn" {
  description = "ARN of the IAM role assumed by CloudPrune ECS tasks"
  value       = aws_iam_role.finops_scanner_role.arn
}

output "billing_alarm_name" {
  description = "Name of the CloudWatch billing anomaly alarm"
  value       = aws_cloudwatch_metric_alarm.billing_anomaly_alarm.alarm_name
}
