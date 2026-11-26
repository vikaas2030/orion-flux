import express from 'express';
import { getDB } from '../config/database.js';

const router = express.Router();

// GET /api/activities
router.get('/', (req, res) => {
  try {
    const db = getDB();
    const { lead_id, deal_id, type, limit: lim } = req.query;
    let list = [...(db.data.activities || [])];

    if (lead_id) {
      list = list.filter(a => String(a.lead_id) === String(lead_id));
    }
    if (deal_id) {
      list = list.filter(a => String(a.deal_id) === String(deal_id));
    }
    if (type) {
      list = list.filter(a => a.type === type);
    }

    if (lim) {
      list = list.slice(0, parseInt(lim));
    }

    res.json({ activities: list });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/activities
router.post('/', (req, res) => {
  try {
    const db = getDB();
    const { lead_id, deal_id, type, title, description, scheduled_at } = req.body;
    if (!title || !type) return res.status(400).json({ error: true, message: 'Title and type are required' });

    if (!db.data.activities) db.data.activities = [];

    const newActivity = {
      id: Date.now(),
      lead_id: lead_id || null,
      deal_id: deal_id || null,
      type,
      title,
      description: description || '',
      scheduled_at: scheduled_at || null,
      is_completed: 0,
      created_at: new Date().toISOString()
    };

    db.data.activities.unshift(newActivity);
    db.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// PUT /api/activities/:id/complete
router.put('/:id/complete', (req, res) => {
  try {
    const db = getDB();
    const id = parseInt(req.params.id);
    const act = (db.data.activities || []).find(a => a.id === id);
    if (!act) return res.status(404).json({ error: true, message: 'Activity not found' });

    act.is_completed = 1;
    act.completed_at = new Date().toISOString();
    db.save();
    res.json(act);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// DELETE /api/activities/:id
router.delete('/:id', (req, res) => {
  try {
    const db = getDB();
    const id = parseInt(req.params.id);
    db.data.activities = (db.data.activities || []).filter(a => a.id !== id);
    db.save();
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
