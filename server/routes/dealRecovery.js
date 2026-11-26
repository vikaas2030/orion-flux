import express from 'express';
import { getDealRecoveryPipeline } from '../services/dealRecoveryEngine.js';

const router = express.Router();

// GET /api/deal-recovery/pipeline — List all actionable deals with cadence scripts & WhatsApp links
router.get('/pipeline', (req, res) => {
  try {
    const cadenceList = getDealRecoveryPipeline();
    res.json({
      success: true,
      count: cadenceList.length,
      pipeline: cadenceList
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
