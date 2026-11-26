import express from 'express';
import { getStartupGrowthMetrics, UNICORN_PRODUCTS, generateClientReferralLink } from '../services/startupScaleEngine.js';

const router = express.Router();

// GET /api/startup/metrics — Comprehensive Startup Valuation & MRR Ladder
router.get('/metrics', (req, res) => {
  try {
    const data = getStartupGrowthMetrics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/startup/products — Turnkey Productized Offerings
router.get('/products', (req, res) => {
  try {
    res.json({
      success: true,
      count: Object.keys(UNICORN_PRODUCTS).length,
      products: Object.values(UNICORN_PRODUCTS)
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/startup/referral/:code — Client Viral Referral Link
router.get('/referral/:code', (req, res) => {
  try {
    const { code } = req.params;
    const referral = generateClientReferralLink(code);
    res.json(referral);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
