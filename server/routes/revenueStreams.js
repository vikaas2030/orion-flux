import express from 'express';
import {
  getMultiStreamOverview,
  boostRevenueStream
} from '../services/multiStreamRevenue.js';

const router = express.Router();

// GET /api/revenue-streams/overview
router.get('/overview', (req, res) => {
  try {
    const overview = getMultiStreamOverview();
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/revenue-streams/boost
router.post('/boost', (req, res) => {
  try {
    const { streamId } = req.body;
    const result = boostRevenueStream(streamId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
