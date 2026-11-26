import express from 'express';
import { 
  getMultinationalOverview, 
  generateGlobalInvoice, 
  FX_RATES, 
  GLOBAL_HUBS 
} from '../services/multinationalEarningEngine.js';

const router = express.Router();

// GET /api/multinational/overview
router.get('/overview', (req, res) => {
  try {
    const data = getMultinationalOverview();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/multinational/generate-invoice
router.post('/generate-invoice', (req, res) => {
  try {
    const { clientName, country, currency, amount, serviceDescription } = req.body;
    const result = generateGlobalInvoice({ clientName, country, currency, amount, serviceDescription });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/multinational/fx-rates
router.get('/fx-rates', (req, res) => {
  res.json({ success: true, fxRates: FX_RATES, hubs: GLOBAL_HUBS });
});

export default router;
