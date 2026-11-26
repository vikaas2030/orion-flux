import express from 'express';
import hotIntentRadarEngine from '../services/hotIntentRadarEngine.js';

const router = express.Router();

/**
 * GET /api/hot-intent/radar
 * Fetch active radar leads with 1-click WhatsApp nudge & 90s phone closer scripts
 */
router.get('/radar', (req, res) => {
  try {
    const radarData = hotIntentRadarEngine.getLiveRadar();
    res.json({
      success: true,
      data: radarData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/hot-intent/ping
 * Beacon ping from client checkout or client portal
 */
router.post('/ping', (req, res) => {
  try {
    const { slug, portalCode, clientName, clientPhone, action, amount, page } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const session = hotIntentRadarEngine.recordPing({
      slug,
      portalCode,
      clientName,
      clientPhone,
      action,
      amount,
      page,
      userAgent,
      ip
    });

    res.json({
      success: true,
      sessionId: session.id,
      intentScore: session.intentScore
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/hot-intent/simulate-test
 * For operator testing of radar alert
 */
router.post('/simulate-test', (req, res) => {
  try {
    const { slug = 'anuja-clinic', action = 'VIEW_QR' } = req.body;
    const session = hotIntentRadarEngine.recordPing({
      slug,
      action,
      amount: 12500,
      page: `/pay/${slug}`,
      clientName: 'Dr. Anuja Singh Clinic (Mumbai)'
    });

    res.json({
      success: true,
      message: 'Simulated beacon ping recorded on live radar',
      session
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
