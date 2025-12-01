/**
 * Express Router, health check or status endpoint, creates an acesible endpoint  at GET /health
 * Use:
 */

const { Router } = require('express');
const healthRouter = Router();
healthRouter.get('/', (_req, res) => res.json({ok:true, service: 'rinku'}));

module.exports = healthRouter;