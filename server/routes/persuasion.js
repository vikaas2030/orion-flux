import express from 'express';
import { getConversations, autoPersuadeClient, generate5xStrategy } from '../services/autoPersuasionEngine.js';
import { getDB } from '../config/database.js';

const router = express.Router();

// GET /api/persuasion/conversations
router.get('/conversations', (req, res) => {
  try {
    res.json(getConversations());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/persuasion/auto-respond
router.post('/auto-respond', (req, res) => {
  try {
    const { convId, objection, touchIndex } = req.body;
    const result = autoPersuadeClient(convId, objection, touchIndex);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/persuasion/blueprint/:dealId
router.get('/blueprint/:dealId', (req, res) => {
  try {
    const db = getDB();
    const deal = (db.data.deals || []).find(d => String(d.id) === String(req.params.dealId));
    if (!deal) return res.status(404).json({ error: true, message: 'Deal not found' });

    const strategy = generate5xStrategy(deal);
    res.json({ success: true, strategy });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
