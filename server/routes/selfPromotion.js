// ═════════════════════════════════════════════════════════════════════
//  SELF-PROMOTION & REAL-WORLD DISTRIBUTION ROUTER
//  API routes exposing real-world outreach, social syndication,
//  and inbound freelance marketplace proposals to the frontend cockpit.
// ═════════════════════════════════════════════════════════════════════

import express from 'express';
import {
  getSyndicationPayloads,
  getFreelanceOpportunities,
  dispatchRealPromotionEmail,
  triggerAutonomousPromotionPulse,
  getPromotionMetrics
} from '../services/autonomousSelfPromotionEngine.js';

const router = express.Router();

// GET /api/promotion/status - Overall metrics & outer world edge info
router.get('/status', (req, res) => {
  try {
    const metrics = getPromotionMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/promotion/syndication - Pre-rendered viral posts with 1-click web intents
router.get('/syndication', (req, res) => {
  try {
    const payloads = getSyndicationPayloads();
    res.json(payloads);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/promotion/freelance-jobs - Live freelance opportunities with auto-generated bids
router.get('/freelance-jobs', async (req, res) => {
  try {
    const jobs = await getFreelanceOpportunities();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/promotion/send-email - Dispatch authentic promotion email to lead or custom recipient
router.post('/send-email', async (req, res) => {
  try {
    const { leadId, customEmail, customName, customCompany } = req.body;
    const result = await dispatchRealPromotionEmail({
      leadId,
      customEmail,
      customName,
      customCompany
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/promotion/pulse - Trigger autonomous promotion pulse across verified leads
router.post('/pulse', async (req, res) => {
  try {
    const pulseResult = await triggerAutonomousPromotionPulse();
    res.json(pulseResult);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
