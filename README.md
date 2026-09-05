# 💵 CloudPrune — Enterprise AWS FinOps & Cost Optimization Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://reactjs.org/)
[![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20Cost%20Explorer%20%7C%20CloudWatch-FF9900.svg?logo=amazon-aws)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/Terraform-1.5+-844FBA.svg?logo=terraform)](https://www.terraform.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-OpenMetrics-E6522C.svg?logo=prometheus)](https://prometheus.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg?logo=docker)](https://www.docker.com/)

**CloudPrune** is an automated AWS FinOps and cloud cost intelligence platform. It continuously audits cloud environments, detects idle and overprovisioned infrastructure (EC2, RDS, EBS, S3, NAT Gateways), calculates anomaly spikes, and provides one-click remediation recipes to reduce monthly AWS bills by **30% to 45%**.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[AWS CloudWatch & Cost Explorer API] -->|Telemetry & Utilization| B[CloudPrune Node.js FinOps Engine]
    B -->|Heuristic Anomaly Detection| C[Cost Wastage Analyzer]
    C -->|Projected 30-Day Run-Rate| D[REST API Server /api/overview]
    D -->|OpenMetrics /metrics| E[Prometheus Scraper]
    D -->|JSON Stream| F[React 18 Executive Dashboard]
    F -->|One-Click Fixes| G[Automated Remediation Service]
    G -->|AWS CLI / SDK Calls| H[AWS Infrastructure Rightsizing]
```

---

## ⚡ Key Capabilities & ROI

1. **Autonomous Waste Detection**:
   - Identifies oversized EC2 instances with <10% CPU utilization.
   - Detects idle staging/dev RDS databases receiving zero queries.
   - Flags unattached EBS volumes and unassociated Elastic IPs incurring hourly penalties.
   - Audits stale S3 buckets for Glacier Instant Retrieval lifecycle transitions.
2. **Real-Time Cost Anomaly Spikes**:
   - Pinpoints unexpected billing spikes (e.g. recursive Lambda triggers, rogue NAT Gateway data transfers).
3. **Interactive FinOps Savings Simulator**:
   - Real-time parameter sliders modeling non-prod weekend shutdowns, GP2-to-GP3 storage migrations, and Spot instance adoption.
4. **Exportable Remediation Recipes**:
   - Ready-to-copy AWS CLI commands and automated API triggers.

---

## 🚀 Quickstart (Docker Compose)

Launch the full stack (Node.js Backend, React Frontend, and Prometheus) locally in seconds:

```bash
# Clone the repository
git clone https://github.com/your-username/cloudprune.git
cd cloudprune

# Start all microservices
docker-compose up --build -d
```

- **Frontend Dashboard:** [http://localhost:3001](http://localhost:3001)
- **Backend API:** [http://localhost:4000/api/overview](http://localhost:4000/api/overview)
- **Prometheus Metrics:** [http://localhost:4000/metrics](http://localhost:4000/metrics)

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Node.js 20, TypeScript, Express, prom-client (OpenMetrics)
- **Cloud & IaC:** AWS IAM Roles, CloudWatch Alarms, Terraform IaC
- **Containerization:** Multi-Stage Dockerfiles (Node Alpine + Nginx Alpine)

---

## 📄 License
MIT © 2026 Vance K · Built for High-Growth Cloud Engineering Teams
