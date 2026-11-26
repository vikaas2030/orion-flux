import express from 'express';
import {
  getHyperSpeedStatus,
  toggleTurboMode,
  triggerInstantCashPulse,
  verifyAllPlatformSubsystems
} from '../services/hyperSpeedEngine.js';

const router = express.Router();

// GET /api/hyperspeed/status
router.get('/status', (req, res) => {
  try {
    const status = getHyperSpeedStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/hyperspeed/turbo-toggle
router.post('/turbo-toggle', (req, res) => {
  try {
    const { enabled } = req.body;
    const status = toggleTurboMode(enabled);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/hyperspeed/instant-cash-trigger
router.post('/instant-cash-trigger', (req, res) => {
  try {
    const result = triggerInstantCashPulse();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/hyperspeed/verify-all
router.get('/verify-all', (req, res) => {
  try {
    const verification = verifyAllPlatformSubsystems();
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
