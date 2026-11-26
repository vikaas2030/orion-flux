import express from 'express';
import {
  getProjectsList,
  run4LayerQATest,
  deliverProjectToClient
} from '../services/qaVerificationEngine.js';

const router = express.Router();

// GET /api/projects — List real client projects and 4-layer QA statuses
router.get('/', (req, res) => {
  try {
    const projects = getProjectsList();
    res.json({ projects, count: projects.length });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/projects/:id/run-4layer-qa — Run thorough 4-Layer Testing on project
router.post('/:id/run-4layer-qa', (req, res) => {
  try {
    const result = run4LayerQATest(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/projects/:id/deliver — Certify & Deliver project to client with QA report
router.post('/:id/deliver', (req, res) => {
  try {
    const result = deliverProjectToClient(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
