import express from 'express';
import { generateUniversalCheckout, recordClientPaymentSubmission, PAYMENT_RAILS } from '../services/universalCheckoutEngine.js';

const router = express.Router();

// GET /api/checkout/deal/:id — Get dynamic multi-currency checkout options
router.get('/deal/:id', (req, res) => {
  try {
    const { id } = req.params;
    const checkout = generateUniversalCheckout(id);
    res.json(checkout);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/checkout/rails — Get available payment rails & buyer protections
router.get('/rails', (req, res) => {
  res.json({ success: true, rails: PAYMENT_RAILS });
});

// POST /api/checkout/submit — Client submits payment UTR / PayPal transaction ID
router.post('/submit', (req, res) => {
  try {
    const result = recordClientPaymentSubmission(req.body);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
