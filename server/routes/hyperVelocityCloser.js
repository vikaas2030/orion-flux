// ═════════════════════════════════════════════════════════════════════
//  HYPER-VELOCITY 15-TO-20 DAY DEAL CLOSER ROUTER
// ═════════════════════════════════════════════════════════════════════

import express from 'express';
import {
  get15DayPipelineMetrics,
  generate15DayCloserKit,
  advanceDealStage,
  sendCloserEmailToDeal,
  settleAndWinDeal
} from '../services/hyperVelocityDealCloser.js';

const router = express.Router();

// GET /api/hyper-closer/pipeline - Get 15-day categorized pipeline
router.get('/pipeline', (req, res) => {
  try {
    const data = get15DayPipelineMetrics();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/hyper-closer/kit/:dealId - Get 15-day closing kit for a specific deal
router.get('/kit/:dealId', (req, res) => {
  try {
    const kit = generate15DayCloserKit(req.params.dealId);
    res.json({ success: true, kit });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/hyper-closer/advance - Advance deal stage
router.post('/advance', (req, res) => {
  try {
    const { dealId, stage } = req.body;
    const result = advanceDealStage(dealId, stage);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/hyper-closer/send-email - Dispatch authentic email closer nudge via Google SMTP
router.post('/send-email', async (req, res) => {
  try {
    const { dealId } = req.body;
    const result = await sendCloserEmailToDeal(dealId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/hyper-closer/settle-won - Settle and close deal as WON with verified UTR
router.post('/settle-won', (req, res) => {
  try {
    const { dealId, utrNumber, amount, paymentMethod } = req.body;
    const result = settleAndWinDeal(dealId, { utrNumber, amount, paymentMethod });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

export default router;
