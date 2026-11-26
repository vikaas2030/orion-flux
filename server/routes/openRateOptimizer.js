// ═════════════════════════════════════════════════════════════════════
//  HIGH-OPEN-RATE OPTIMIZER & TRACKING ROUTER
// ═════════════════════════════════════════════

import express from 'express';
import {
  getHighOpenTemplates,
  dispatchHighOpenEmail,
  recordEmailOpen,
  getTrackingStats
} from '../services/highOpenRateEngine.js';

const router = express.Router();

// GET /api/open-optimizer/templates
router.get('/templates', (req, res) => {
  try {
    const { company, contact, email, phone, currency, value } = req.query;
    const templates = getHighOpenTemplates({
      company,
      contact,
      email,
      phone,
      currency,
      value
    });
    res.json({ success: true, templates });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/open-optimizer/send
router.post('/send', async (req, res) => {
  try {
    const { to, company, contact, archetypeId, entityId } = req.body;
    const result = await dispatchHighOpenEmail({
      to,
      company,
      contact,
      archetypeId,
      entityId
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// GET /api/open-optimizer/stats
router.get('/stats', (req, res) => {
  try {
    const stats = getTrackingStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// 1x1 Invisible Tracking Pixel Endpoint: GET /api/track/open/:trackingId
const handlePixelOpen = (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown Mail Client';
    const gifBuffer = recordEmailOpen(req.params.trackingId, { ip, userAgent });

    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': gifBuffer.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(gifBuffer);
  } catch (_) {
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    res.end();
  }
};

router.get('/open/:trackingId', handlePixelOpen);
router.get('/track/open/:trackingId', handlePixelOpen);

export default router;
