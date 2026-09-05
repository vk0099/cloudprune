variable "aws_region" {
  description = "Target AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment Environment (prod, staging, dev)"
  type        = string
  default     = "production"
}

variable "daily_cost_threshold_usd" {
  description = "Daily AWS estimated spend threshold before firing CloudWatch alarm"
  type        = number
  default     = 200.0
}
