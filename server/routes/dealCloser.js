import express from 'express';
import {
  generateProformaInvoice,
  getObjectionAnnihilator,
  executeDealClosingPush
} from '../services/dealCloserBot.js';

const router = express.Router();

/**
 * GET /api/deal-closer/proforma/:dealId
 */
router.get('/proforma/:dealId', (req, res) => {
  try {
    const invoice = generateProformaInvoice(req.params.dealId);
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/deal-closer/objection/:type/:dealId
 */
router.get('/objection/:type/:dealId', (req, res) => {
  try {
    const result = getObjectionAnnihilator(req.params.type, req.params.dealId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/deal-closer/push/:dealId
 */
router.post('/push/:dealId', async (req, res) => {
  try {
    const { objectionType } = req.body;
    const result = await executeDealClosingPush(req.params.dealId, objectionType || 'DISCOUNT_REQUEST');
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
