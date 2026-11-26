import express from 'express';
import { getEscrowFundedJobs, dispatchEscrowProposal } from '../services/escrowContractCloser.js';

const router = express.Router();

// GET /api/escrow-jobs/list — Get all 100% escrow-funded high-intent jobs
router.get('/list', (req, res) => {
  try {
    const data = getEscrowFundedJobs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/escrow-jobs/dispatch — 1-Click Dispatch Winning Proposal to Escrow Job
router.post('/dispatch', (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: true, message: 'jobId is required' });
    const result = dispatchEscrowProposal(jobId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
