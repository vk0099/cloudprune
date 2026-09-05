import { Router, Request, Response } from 'express';
import { finopsEngine } from '../services/finopsEngine.js';
import { CloudProvider } from '../types/index.js';

export const finopsRouter = Router();

const parseProvider = (req: Request): CloudProvider => {
  const provider = (req.query.provider as string)?.toUpperCase();
  if (provider === 'AWS' || provider === 'OCI' || provider === 'GCP' || provider === 'AZURE') {
    return provider;
  }
  return 'ALL';
};

// Get summary overview
finopsRouter.get('/overview', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  const summary = finopsEngine.getSummary(provider);
  res.json({ success: true, data: summary });
});

// Get daily spend trajectory
finopsRouter.get('/spend-trajectory', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  const trajectory = finopsEngine.getDailySpendTrajectory(provider);
  res.json({ success: true, data: trajectory });
});

// Get actionable recommendations
finopsRouter.get('/recommendations', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  const recommendations = finopsEngine.getRecommendations(provider);
  res.json({ success: true, data: recommendations });
});

// Get resources analyzed
finopsRouter.get('/resources', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  const resources = finopsEngine.getResources(provider);
  res.json({ success: true, data: resources });
});

// Get cost anomalies
finopsRouter.get('/anomalies', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  const anomalies = finopsEngine.getAnomalies(provider);
  res.json({ success: true, data: anomalies });
});

// Apply one-click remediation
finopsRouter.post('/remediate/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const provider = parseProvider(req);
  const updated = finopsEngine.remediate(id);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Recommendation not found' });
  }
  res.json({ success: true, data: updated, summary: finopsEngine.getSummary(provider) });
});

// Reset simulation
finopsRouter.post('/reset', (req: Request, res: Response) => {
  const provider = parseProvider(req);
  finopsEngine.resetRemediations();
  res.json({ success: true, message: 'All remediation actions reset', summary: finopsEngine.getSummary(provider) });
});
