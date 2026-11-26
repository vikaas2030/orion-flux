import express from 'express';
import { getDomesticFastCashDeals, getDomesticMetrics, createCustomDomesticDeal } from '../services/domesticFastCashCloser.js';

const router = express.Router();

// GET /api/domestic-closer/metrics — Get summary & all domestic deals
router.get('/metrics', (req, res) => {
  try {
    const data = getDomesticMetrics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/domestic-closer/deals — Get list of domestic deals with UPI links
router.get('/deals', (req, res) => {
  try {
    const deals = getDomesticFastCashDeals();
    res.json({ success: true, count: deals.length, deals });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/domestic-closer/custom-deal — Generate custom bespoke deal, invoice & payment link
router.post('/custom-deal', (req, res) => {
  try {
    const { company, contact, category, city, phone, scope, totalValueINR, advance50INR, pilotTokenINR } = req.body;
    if (!company || !company.trim()) {
      return res.status(400).json({ error: true, message: 'Company name is required' });
    }
    const newDeal = createCustomDomesticDeal({ company, contact, category, city, phone, scope, totalValueINR, advance50INR, pilotTokenINR });
    res.json({ success: true, deal: newDeal });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
