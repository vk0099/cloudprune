import { Router, Request, Response } from 'express';
import client from 'prom-client';

export const healthRouter = Router();

// Create a Prometheus Registry
export const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom FinOps Metrics
export const monthlySpendGauge = new client.Gauge({
  name: 'cloudprune_total_monthly_spend_usd',
  help: 'Current total monthly AWS cloud spend in USD'
});
register.registerMetric(monthlySpendGauge);

export const identifiedWasteGauge = new client.Gauge({
  name: 'cloudprune_identified_waste_usd',
  help: 'Total identified monthly AWS wastage in USD'
});
register.registerMetric(identifiedWasteGauge);

export const efficiencyScoreGauge = new client.Gauge({
  name: 'cloudprune_efficiency_score',
  help: 'Calculated FinOps resource efficiency score from 0 to 100'
});
register.registerMetric(efficiencyScoreGauge);

monthlySpendGauge.set(4250.00);
identifiedWasteGauge.set(1870.00);
efficiencyScoreGauge.set(56);

// Liveness check
healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'cloudprune-engine',
    version: '1.0.0'
  });
});

// Prometheus OpenMetrics scrape endpoint
healthRouter.get('/metrics', async (_req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});
