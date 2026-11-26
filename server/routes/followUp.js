import express from 'express';
import { getFollowUpStatus, runFollowUpPulse } from '../services/followUpCadenceEngine.js';

const router = express.Router();

// GET /api/followup/status — Get follow-up status & analytics
router.get('/status', (req, res) => {
  try {
    const status = getFollowUpStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/followup/trigger-pulse — Trigger automated follow-up batch
router.post('/trigger-pulse', async (req, res) => {
  try {
    const { maxBatch } = req.body || {};
    const result = await runFollowUpPulse(maxBatch || 3);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
