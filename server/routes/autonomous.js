import express from 'express';
import {
  getAutonomousStatus,
  toggleAutonomousMode,
  runAutonomousPulse,
  triggerAutoProposalPulse,
  setRevenueTarget,
  dispatchOpportunity
} from '../services/autonomousAgent.js';

const router = express.Router();

// GET /api/autonomous/status — Full Revenue Hunger, All-Agents Auto-Send State
router.get('/status', (req, res) => {
  try {
    res.json(getAutonomousStatus());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/autonomous/toggle — Toggle Master Autonomous Mode
router.post('/toggle', (req, res) => {
  try {
    const { enable } = req.body;
    const status = toggleAutonomousMode(enable);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/autonomous/trigger-auto-send — Force immediate autonomous proposal dispatch
router.post('/trigger-auto-send', (req, res) => {
  try {
    const status = triggerAutoProposalPulse();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/autonomous/set-target — Update monthly financial goal
router.post('/set-target', (req, res) => {
  try {
    const { target } = req.body;
    const status = setRevenueTarget(target);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/autonomous/dispatch-opportunity — Mark deal pitched and log
router.post('/dispatch-opportunity', (req, res) => {
  try {
    const { id } = req.body;
    const status = dispatchOpportunity(id);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/autonomous/trigger-pulse — Force immediate radar sweep
router.post('/trigger-pulse', (req, res) => {
  try {
    runAutonomousPulse();
    res.json({ message: 'Radar pulse triggered successfully', ...getAutonomousStatus() });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
