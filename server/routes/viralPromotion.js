// ═════════════════════════════════════════════════════════════════════
//  VIRAL PROMOTION & MARKETING ROUTER
// ═════════════════════════════════════════════

import express from 'express';
import {
  getViralMarketingCampaigns,
  launchAutonomousEmailWave,
  getPromotionTelemetry
} from '../services/autonomousGlobalPromotionEngine.js';

const router = express.Router();

// GET /api/viral-promo/campaigns - Get all multi-channel marketing campaigns
router.get('/campaigns', (req, res) => {
  try {
    const campaigns = getViralMarketingCampaigns();
    res.json({ success: true, ...campaigns });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/viral-promo/launch-wave - Launch automated email promotional wave
router.post('/launch-wave', async (req, res) => {
  try {
    const batchSize = parseInt(req.body.batchSize) || 3;
    const waveResult = await launchAutonomousEmailWave(batchSize);
    res.json(waveResult);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/viral-promo/telemetry - Live promotion reach and stats
router.get('/telemetry', (req, res) => {
  try {
    const telemetry = getPromotionTelemetry();
    res.json({ success: true, ...telemetry });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
