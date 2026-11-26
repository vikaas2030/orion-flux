import express from 'express';
import { getDB } from '../config/database.js';
import { getTransporter } from '../services/emailDispatcher.js';

const router = express.Router();

// GET /api/settings
router.get('/', (req, res) => {
  try {
    const db = getDB();
    const settings = db.data.settings || {};
    const raw = Object.entries(settings).map(([key, value]) => ({ key, value }));
    res.json({ settings, raw });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// PUT /api/settings
router.put('/', (req, res) => {
  try {
    const db = getDB();
    if (!db.data.settings) {
      db.data.settings = {};
    }
    const updates = req.body;
    Object.entries(updates).forEach(([key, value]) => {
      db.data.settings[key] = value;
    });
    db.save();
    res.json({ message: 'Settings updated successfully', settings: db.data.settings });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settings/test-email
router.post('/test-email', async (req, res) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      return res.status(400).json({
        success: false,
        message: 'No Gmail credentials configured. Please enter your Gmail address and 16-character App Password, then save settings first.'
      });
    }

    await transporter.verify();
    res.json({
      success: true,
      message: '✅ Gmail SMTP Connected Successfully! The system is now ready to send automated emails directly to clients.'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `❌ Gmail SMTP Error: ${err.message}. Please make sure 2-Step Verification is ON and you generated an App Password at https://myaccount.google.com/apppasswords`
    });
  }
});

export default router;
