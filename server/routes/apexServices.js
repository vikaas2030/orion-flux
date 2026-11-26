// ═════════════════════════════════════════════════════════════════════
//  APEX SERVICE & VIP FACILITY ROUTER
// ═════════════════════════════════════════════

import express from 'express';
import {
  getCatalog,
  generateInstantSolution,
  getServiceFacilitiesMetrics
} from '../services/apexServiceFacilityEngine.js';

const router = express.Router();

// GET /api/apex-services/catalog - Get turnkey kits, VIP tiers & industry templates
router.get('/catalog', (req, res) => {
  try {
    const catalog = getCatalog();
    res.json({ success: true, ...catalog });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/apex-services/generate-solution - Generate instant 60-second MVP quotation & token invoice
router.post('/generate-solution', (req, res) => {
  try {
    const solution = generateInstantSolution(req.body);
    res.json({ success: true, solution });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/apex-services/metrics - Live telemetry of services, kits, and facilities
router.get('/metrics', (req, res) => {
  try {
    const metrics = getServiceFacilitiesMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
