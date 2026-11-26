import express from 'express';
import { get5LakhTargetStatus } from '../services/target5LakhEngine.js';

const router = express.Router();

/**
 * GET /api/target-5lakh/status
 * Complete 30-day ₹5 Lakh target tracking telemetry
 */
router.get('/status', (req, res) => {
  try {
    const status = get5LakhTargetStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
