// server/api/apiRoutes.js
import express from 'express';
import { fetchInitialVolatility, fetchAlerts } from './apiController.js';

const router = express.Router();

router.post('/fetchInitialVolatility', (req, res) => {
  fetchInitialVolatility();
  console.log(req.body);
  res.json({ message: 'Initial volatility data fetched' });
});

router.get('/fetchAlerts', (req, res) => {
  fetchAlerts();
  res.json({ message: 'Alerts data fetched' });
});

export default router;
