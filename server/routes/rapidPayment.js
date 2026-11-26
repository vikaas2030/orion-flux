import express from 'express';
import {
  getRapidPaymentDossier,
  dispatchUrgencyLockToClient,
  getTopRapidClosingCandidates
} from '../services/rapidPaymentAccelerator.js';
import { verifyAndRecordManualUtr } from '../services/dynamicQRGenerator.js';

const router = express.Router();

/**
 * GET /api/rapid-payment/candidates
 * Returns top 5 deals ready for rapid payment closing
 */
router.get('/candidates', (req, res) => {
  try {
    const candidates = getTopRapidClosingCandidates();
    res.json({ success: true, count: candidates.length, candidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/rapid-payment/dossier/:dealId
 */
router.get('/dossier/:dealId', (req, res) => {
  try {
    const dossier = getRapidPaymentDossier(req.params.dealId);
    res.json({ success: true, dossier });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/rapid-payment/dispatch-urgency/:dealId
 */
router.post('/dispatch-urgency/:dealId', async (req, res) => {
  try {
    const result = await dispatchUrgencyLockToClient(req.params.dealId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/rapid-payment/instant-settle
 */
router.post('/instant-settle', (req, res) => {
  try {
    const { clientSlug, utrNumber, amount, paymentMethod } = req.body;
    const result = verifyAndRecordManualUtr({
      clientSlug,
      utrNumber,
      amount,
      paymentMethod
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
