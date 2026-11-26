import express from 'express';
import { generateClientVideoPackage, getVideoPackageBySlug } from '../services/videoPitchEngine.js';
import { getPitchOptimizerStatus, recordPitchResponse } from '../services/pitchOptimizerEngine.js';
import getDB from '../config/database.js';

const router = express.Router();

// GET /api/video-pitch/package/:slug — Returns personalized 4K video storyboard & visual package
router.get('/package/:slug', (req, res) => {
  try {
    const pkg = getVideoPackageBySlug(req.params.slug);
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/video-pitch/generate — Generates video package for a specific lead
router.post('/generate', (req, res) => {
  try {
    const pkg = generateClientVideoPackage(req.body);
    res.json({ success: true, package: pkg });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/video-pitch/optimizer-status — Telemetry for self-evolving A/B pitch testing
router.get('/optimizer-status', (req, res) => {
  try {
    res.json(getPitchOptimizerStatus());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/video-pitch/record-feedback — Logs a client response to award weights to winning pitch hook
router.post('/record-feedback', (req, res) => {
  try {
    const { variantId } = req.body;
    recordPitchResponse(variantId);
    res.json({ success: true, message: `Feedback registered for ${variantId}. AI model adapted.` });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
