import { Router, Request, Response } from 'express';
import { FinOpsEngine } from '../services/finopsEngine.js';

export const finopsRouter = Router();
const engine = new FinOpsEngine();

// Get summary overview
finopsRouter.get('/overview', (req: Request, res: Response) => {
  const summary = engine.getSummary();
  res.json({ success: true, data: summary });
});

// Get daily spend trajectory
finopsRouter.get('/spend-trajectory', (req: Request, res: Response) => {
  const trajectory = engine.getDailySpendTrajectory();
  res.json({ success: true, data: trajectory });
});

// Get actionable recommendations
finopsRouter.get('/recommendations', (req: Request, res: Response) => {
  const recommendations = engine.getRecommendations();
  res.json({ success: true, data: recommendations });
});

// Get resources analyzed
finopsRouter.get('/resources', (req: Request, res: Response) => {
  const resources = engine.getResources();
  res.json({ success: true, data: resources });
});

// Get cost anomalies
finopsRouter.get('/anomalies', (req: Request, res: Response) => {
  const anomalies = engine.getAnomalies();
  res.json({ success: true, data: anomalies });
});

// Apply one-click remediation
finopsRouter.post('/remediate/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = engine.remediate(id);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Recommendation not found' });
  }
  res.json({ success: true, data: updated, summary: engine.getSummary() });
});

// Reset simulation
finopsRouter.post('/reset', (req: Request, res: Response) => {
  engine.resetRemediations();
  res.json({ success: true, message: 'All remediation actions reset', summary: engine.getSummary() });
});
