import express from 'express';
import { getVoiceStudioLeads, logVoiceNoteDispatched } from '../services/voiceNoteEngine.js';

const router = express.Router();

// GET /api/voice-studio/leads
router.get('/leads', (req, res) => {
  try {
    const leads = getVoiceStudioLeads();
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/voice-studio/log-dispatched
router.post('/log-dispatched', (req, res) => {
  try {
    const { leadId, company, language } = req.body;
    const result = logVoiceNoteDispatched(leadId, company, language);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
