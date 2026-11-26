// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX — WORLD-CLASS REVENUE WAR ROOM ROUTER
// ═════════════════════════════════════════════════════════════════════

import express from 'express';
import {
  getTopVelocityTargets,
  calculateDynamicQuote,
  generateAssuranceCertificate
} from '../services/apexWorldClassEngine.js';

const router = express.Router();

// GET /api/world-class/top-targets — Top 10 High-Velocity Leads
router.get('/top-targets', (req, res) => {
  try {
    const targets = getTopVelocityTargets();
    res.json({ success: true, count: targets.length, targets });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/world-class/quote-calc — Calculate dynamic quote & QR payload
router.post('/quote-calc', (req, res) => {
  try {
    const quote = calculateDynamicQuote(req.body);
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/world-class/generate-certificate — Issue digital guarantee certificate
router.post('/generate-certificate', (req, res) => {
  try {
    const cert = generateAssuranceCertificate(req.body);
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
