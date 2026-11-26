import express from 'express';
import {
  getActiveRetainerPipeline,
  generateRetainerProposal,
  getMRRMetrics,
  activateSubscription,
  runRetainerBillingCycle,
  RETAINER_PLANS
} from '../services/retainerEngine.js';

const router = express.Router();

// GET /api/retainer/pipeline — Get all active recurring retainer projections
router.get('/pipeline', (req, res) => {
  try {
    const data = getActiveRetainerPipeline();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/retainer/mrr — Get SaaS MRR & subscription analytics
router.get('/mrr', (req, res) => {
  try {
    const data = getMRRMetrics();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/retainer/deal/:id — Get retainer proposal for a specific deal
router.get('/deal/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');
    const deal = (db?.data?.deals || []).find(d => String(d.id) === String(id)) || { id, title: 'Automation', currency: 'INR' };
    const proposal = generateRetainerProposal(deal);
    res.json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/retainer/activate — Activate a recurring subscription
router.post('/activate', (req, res) => {
  try {
    const { dealId, planKey, customNotes } = req.body;
    if (!dealId) return res.status(400).json({ error: true, message: 'dealId is required' });

    const result = activateSubscription(dealId, planKey, customNotes);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/retainer/run-cycle — Trigger billing cycle evaluation
router.post('/run-cycle', (req, res) => {
  try {
    const result = runRetainerBillingCycle();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
