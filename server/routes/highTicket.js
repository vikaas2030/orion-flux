import express from 'express';
import {
  HIGH_TICKET_MARKETS,
  runHighTicketBatch,
  getHighTicketStatus
} from '../services/highTicketHunter.js';
import getDB from '../config/database.js';

const router = express.Router();

// GET /api/high-ticket/markets — Returns high-ticket regions, niches, and pricing tiers
router.get('/markets', (req, res) => {
  res.json({
    success: true,
    markets: HIGH_TICKET_MARKETS
  });
});

// POST /api/high-ticket/hunt — Executes high-ticket search and provisions deals in pipeline
router.post('/hunt', async (req, res) => {
  try {
    const { markets = [], limitPerNiche = 2 } = req.body;
    const result = await runHighTicketBatch(markets, limitPerNiche);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/high-ticket/status — Live polling of hunt progress
router.get('/status', (req, res) => {
  res.json(getHighTicketStatus());
});

// GET /api/high-ticket/deals — Returns high-ticket USD/GBP deals currently in pipeline
router.get('/deals', (req, res) => {
  try {
    const db = getDB();
    const usdDeals = (db.data.deals || []).filter(d => d.currency === 'USD' || d.currency === 'GBP');
    const totalUsdPipeline = usdDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    const totalUsdAdvance = usdDeals.reduce((sum, d) => sum + (parseFloat(d.advance) || (parseFloat(d.value) * 0.5) || 0), 0);

    res.json({
      success: true,
      deals: usdDeals,
      totalCount: usdDeals.length,
      totalUsdPipeline,
      totalUsdAdvance,
      totalUsdPipelineFormatted: `$${totalUsdPipeline.toLocaleString()} USD`,
      totalUsdAdvanceFormatted: `$${totalUsdAdvance.toLocaleString()} USD`
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
