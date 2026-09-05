import express from 'express';
import cors from 'cors';
import { finopsRouter } from './routes/finops.js';
import { healthRouter } from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api', finopsRouter);
app.use('/', healthRouter);

app.listen(PORT, () => {
  console.log(`[CloudPrune] FinOps Optimization Engine running on port ${PORT}`);
  console.log(`[CloudPrune] Prometheus metrics ready at http://localhost:${PORT}/metrics`);
});
