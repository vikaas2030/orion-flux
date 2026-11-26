import express from 'express';
import { getInboundStatus, checkInboundClientEmails, handleInboundClientMessage } from '../services/inboundEmailListener.js';

const router = express.Router();

// GET /api/inbound/status — Status of 2-way listener
router.get('/status', (req, res) => {
  try {
    const status = getInboundStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/inbound/check-now — Trigger immediate IMAP sync
router.post('/check-now', async (req, res) => {
  try {
    const result = await checkInboundClientEmails();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/inbound/handle-reply — Process an incoming client message & auto-reply
router.post('/handle-reply', async (req, res) => {
  try {
    const { fromEmail, prospectName, messageContent, subject } = req.body;
    if (!fromEmail || !messageContent) {
      return res.status(400).json({ error: true, message: 'fromEmail and messageContent are required' });
    }

    const result = await handleInboundClientMessage({
      fromEmail,
      prospectName,
      messageContent,
      subject
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
