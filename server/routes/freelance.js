import express from 'express';
import {
  getFreelanceGigs,
  triggerSelfEvolution,
  importGigToCRM,
  generateCustomProposal
} from '../services/freelanceMarketplace.js';

const router = express.Router();

// GET /api/freelance/gigs — Get analyzed freelance jobs and evolution metrics
router.get('/gigs', (req, res) => {
  try {
    res.json(getFreelanceGigs());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/freelance/evolve — Trigger recursive self-evolution
router.post('/evolve', (req, res) => {
  try {
    const result = triggerSelfEvolution();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/freelance/import-to-crm — 1-Click Import Freelance Gig into CRM & Deal Pipeline
router.post('/import-to-crm', (req, res) => {
  try {
    const { gigId } = req.body;
    if (!gigId) return res.status(400).json({ error: true, message: 'Gig ID is required' });
    const result = importGigToCRM(gigId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/freelance/generate-proposal — Generate custom AI proposal for any gig
router.post('/generate-proposal', (req, res) => {
  try {
    const { title, description, platform } = req.body;
    if (!title) return res.status(400).json({ error: true, message: 'Job Title is required' });
    const result = generateCustomProposal(title, description, platform);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
