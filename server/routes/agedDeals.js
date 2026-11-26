import express from 'express';
import { getAgedDealsMetrics, getAgedDealsForClosing } from '../services/agedDealsCloserEngine.js';
import { executeBankReconciliation } from '../services/bankReconciliationEngine.js';
import {
  getAutonomousUpgradesStatus,
  toggleAutonomousUpgradesAutoPilot,
  runAutonomousUpgradesPulse
} from '../services/autonomousUpgradesOrchestrator.js';
import { getHunterMetrics, huntNewBestDeals } from '../services/autonomousDealsHunterEngine.js';

const router = express.Router();

/**
 * GET /api/aged-deals/autopilot/status
 * Get real-time status of 24x7 autonomous closer engine
 */
router.get('/autopilot/status', (req, res) => {
  try {
    res.json({ success: true, data: getAutonomousUpgradesStatus() });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * POST /api/aged-deals/autopilot/toggle
 * Toggle 24x7 autonomous auto-pilot mode
 */
router.post('/autopilot/toggle', (req, res) => {
  try {
    const { enable } = req.body;
    const status = toggleAutonomousUpgradesAutoPilot(enable);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * POST /api/aged-deals/autopilot/trigger
 * Force an immediate autonomous upgrades cycle
 */
router.post('/autopilot/trigger', async (req, res) => {
  try {
    const result = await runAutonomousUpgradesPulse();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * GET /api/aged-deals/metrics
 * Fetch all deals older than 10 days with tailored revival plays & phone scripts
 */
router.get('/metrics', (req, res) => {
  try {
    const threshold = parseInt(req.query.days) || 10;
    const data = getAgedDealsMetrics(threshold);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * POST /api/aged-deals/quick-settle
 * 1-Click Settle an aged deal into WON status with bank UTR
 */
router.post('/quick-settle', (req, res) => {
  try {
    const { dealId, amount, utrNumber, bankName } = req.body;
    if (!dealId || !amount) {
      return res.status(400).json({ error: true, message: 'dealId and amount are required' });
    }
    const utr = utrNumber || `UTR-${Date.now().toString().slice(-8)}`;
    const result = executeBankReconciliation({
      dealId,
      amount,
      utrNumber: utr,
      bankName: bankName || 'UPI Instant Bank Transfer (9690973030@ibl)',
      notes: 'Revived & Won via 10+ Days Aged Deals Strike Force Engine'
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * GET /api/aged-deals/hunter/metrics
 * Get fresh high-yield discovered deals & scouting metrics
 */
router.get('/hunter/metrics', (req, res) => {
  try {
    const data = getHunterMetrics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * POST /api/aged-deals/hunter/scout-now
 * Trigger real-time autonomous hunt for new high-ticket deals
 */
router.post('/hunter/scout-now', (req, res) => {
  try {
    const batchSize = parseInt(req.body.batchSize) || 4;
    const result = huntNewBestDeals(batchSize);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
