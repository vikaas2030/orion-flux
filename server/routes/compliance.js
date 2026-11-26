import express from 'express';
import { auditAllActiveRequirements, getComplianceStatusReport } from '../services/complianceFulfillmentEngine.js';

const router = express.Router();

// GET /api/compliance/status
router.get('/status', (req, res) => {
  try {
    const report = getComplianceStatusReport();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/compliance/audit-now
router.post('/audit-now', (req, res) => {
  try {
    const result = auditAllActiveRequirements();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
