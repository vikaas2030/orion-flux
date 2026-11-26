import express from 'express';
import { 
  getLearningDashboard, 
  recordMistake, 
  cleanseDatabaseLeads, 
  runSelfLearningPulse 
} from '../services/autonomousSelfLearningEngine.js';

const router = express.Router();

// GET /api/learning/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const data = getLearningDashboard();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/learning/record-mistake
router.post('/record-mistake', (req, res) => {
  try {
    const { category, details, rootCause, autoCorrectionApplied } = req.body;
    const entry = recordMistake({ category, details, rootCause, autoCorrectionApplied });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/learning/cleanse-leads
router.post('/cleanse-leads', (req, res) => {
  try {
    const result = cleanseDatabaseLeads();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/learning/pulse
router.post('/pulse', async (req, res) => {
  try {
    const result = await runSelfLearningPulse();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
