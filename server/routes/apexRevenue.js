import express from 'express';
import {
  getApexRadarQueue,
  classifyAndCloseInboundReply,
  generateInstantPaymentTerminal,
  APEX_OBJECTION_BATTLECARDS
} from '../services/apexRevenueSuite.js';

const router = express.Router();

// GET /api/apex/radar — Apollo.io + Gong.io radar queue
router.get('/radar', (req, res) => {
  try {
    const queue = getApexRadarQueue();
    const tier1Count = queue.filter(q => q.propensity.tier === 'TIER_1_HOT_CONVERSION').length;
    const tier2Count = queue.filter(q => q.propensity.tier === 'TIER_2_WARM_NURTURE').length;

    res.json({
      success: true,
      totalLeads: queue.length,
      tier1Count,
      tier2Count,
      queue: queue.slice(0, 30) // top 30 highest propensity leads
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/apex/classify-reply — GoHighLevel-grade sub-2s inbound message classifier & closer
router.post('/classify-reply', (req, res) => {
  try {
    const { clientMessage, clientName, isUSD } = req.body;
    if (!clientMessage) {
      return res.status(400).json({ error: true, message: 'clientMessage is required' });
    }

    const result = classifyAndCloseInboundReply(clientMessage, clientName, isUSD);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/apex/battlecards — Gong.io objection battlecards
router.get('/battlecards', (req, res) => {
  try {
    res.json({
      success: true,
      battlecards: APEX_OBJECTION_BATTLECARDS
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/apex/terminal — Stripe/Razorpay-grade instant settlement payload
router.post('/terminal', (req, res) => {
  try {
    const dealOrLead = req.body;
    const terminal = generateInstantPaymentTerminal(dealOrLead);
    res.json({ success: true, terminal });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
