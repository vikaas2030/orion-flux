import express from 'express';
import { getOwnerAlerts, markAlertsAsRead, dispatchOwnerAlert } from '../services/ownerAlertEngine.js';

const router = express.Router();

// GET /api/alerts — Fetch recent owner mobile alerts
router.get('/', (req, res) => {
  try {
    const alerts = getOwnerAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/alerts/mark-read — Mark all alerts as read
router.post('/mark-read', (req, res) => {
  try {
    const result = markAlertsAsRead();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/alerts/test-ping — Send test mobile alert
router.post('/test-ping', async (req, res) => {
  try {
    const result = await dispatchOwnerAlert({
      type: 'TEST_PING',
      title: '🔔 Test Mobile Alert from Orion Flux',
      message: 'Your Instant Owner Mobile Alert Engine is 100% active and connected!',
      client: 'Antigravity Agency HQ',
      dealValue: 'Verified',
      priority: 'HIGH'
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
