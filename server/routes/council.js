import express from 'express';
import { getCouncilStatus, conveneAutonomousCouncilSession } from '../services/neuralCouncilEngine.js';

const router = express.Router();

// GET /api/council/status — Get current council status, board members & recent decrees
router.get('/status', (req, res) => {
  try {
    const data = getCouncilStatus();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/council/convene — Manually convene an executive board meeting
router.post('/convene', (req, res) => {
  try {
    const { triggerType } = req.body || {};
    const session = conveneAutonomousCouncilSession(triggerType || 'MANUAL_CONVENE');
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/council/resolutions — Get all ratified executive orders
router.get('/resolutions', (req, res) => {
  try {
    const data = getCouncilStatus();
    res.json({ success: true, resolutions: data.activeResolutions });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
