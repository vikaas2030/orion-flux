// ═════════════════════════════════════════════════════════════════════
//  AUTONOMOUS REVENUE FLYWHEEL ROUTER
// ═════════════════════════════════════════════

import express from 'express';
import {
  generateInteractivePrototype,
  getPrototypeByIdOrSlug,
  simulatePrototypeChat,
  claimPrototypeSettlement,
  launchAutonomousPrototypeWave,
  getFlywheelTelemetry
} from '../services/autonomousRevenueFlywheel.js';

const router = express.Router();

// GET /api/flywheel/telemetry — Live engine telemetry
router.get('/telemetry', (req, res) => {
  try {
    const telemetry = getFlywheelTelemetry();
    res.json({ success: true, telemetry });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/flywheel/generate — Generate new branded prototype
router.post('/generate', (req, res) => {
  try {
    const prototype = generateInteractivePrototype(req.body);
    res.json({ success: true, prototype });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/flywheel/prototype/:idOrSlug — Fetch prototype details for public page
router.get('/prototype/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const prototype = getPrototypeByIdOrSlug(idOrSlug);
    if (!prototype) {
      return res.status(404).json({ success: false, message: 'Prototype not found.' });
    }
    res.json({ success: true, prototype });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/flywheel/chat-sim — Interactive chat simulation with branded bot
router.post('/chat-sim', (req, res) => {
  try {
    const { prototypeId, message } = req.body;
    const response = simulatePrototypeChat(prototypeId, message);
    res.json({ success: true, ...response });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/flywheel/claim — Verify UTR and unlock commercial license
router.post('/claim', (req, res) => {
  try {
    const result = claimPrototypeSettlement(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/flywheel/launch-outbound — Launch automated personalized wave to verified leads
router.post('/launch-outbound', async (req, res) => {
  try {
    const count = parseInt(req.body.count) || 3;
    const waveResult = await launchAutonomousPrototypeWave(count);
    res.json(waveResult);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
