import express from 'express';
import { calculateUnicornMetrics, provisionMicroSaaSTenant, UNICORN_ROADMAP_STAGES } from '../services/unicornScaleEngine.js';

const router = express.Router();

// GET /api/unicorn/metrics — Real-time valuation & Sovereign $1B Unicorn Metrics
router.get('/metrics', (req, res) => {
  try {
    const data = calculateUnicornMetrics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/unicorn/roadmap — Get the 5-Stage Billion-Dollar Roadmap
router.get('/roadmap', (req, res) => {
  try {
    res.json({ success: true, stages: UNICORN_ROADMAP_STAGES });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/unicorn/provision — Provision an instant Micro-SaaS tenant
router.post('/provision', (req, res) => {
  try {
    const { productId, clientName, clientEmail, currency } = req.body;
    if (!clientName) return res.status(400).json({ error: true, message: 'clientName is required' });

    const result = provisionMicroSaaSTenant(productId, clientName, clientEmail || '', currency || 'USD');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
