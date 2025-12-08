/**
 * Health check endpoint - GET /health
 */
import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ ok: true, service: 'rinku' });
});

export default healthRouter;
