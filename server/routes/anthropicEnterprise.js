// ═════════════════════════════════════════════════════════════════════
//  ANTHROPIC CLAUDE ENTERPRISE & MULTI-INCOME API ROUTER
// ═════════════════════════════════════════════

import express from 'express';
import {
  getAnthropicEnterpriseOverview,
  executeAnthropicTask,
  executeMultiAgentSwarm,
  createSaaSOrder,
  generateDeveloperApiKey,
  createPartnerAffiliate,
  createWhiteLabelInstance
} from '../services/anthropicEnterpriseEngine.js';

const router = express.Router();

// GET /api/anthropic/overview - Get all models, subscription plans, and telemetry
router.get('/overview', (req, res) => {
  try {
    const data = getAnthropicEnterpriseOverview();
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/task - Execute single-agent task via Anthropic Claude
router.post('/task', async (req, res) => {
  try {
    const { message, agentRole, model } = req.body;
    if (!message) return res.status(400).json({ error: true, message: 'Message is required' });

    const result = await executeAnthropicTask({ message, agentRole, model });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/swarm - Execute sequential Multi-Agent Swarm
router.post('/swarm', async (req, res) => {
  try {
    const { goal, agents } = req.body;
    if (!goal) return res.status(400).json({ error: true, message: 'Enterprise goal is required' });

    const result = await executeMultiAgentSwarm({ goal, agents });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/subscribe - Order SaaS recurring subscription
router.post('/subscribe', (req, res) => {
  try {
    const { planId, clientName, clientEmail, currency } = req.body;
    const order = createSaaSOrder({ planId, clientName, clientEmail, currency });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/generate-key - Generate metered developer API key
router.post('/generate-key', (req, res) => {
  try {
    const { clientName, plan } = req.body;
    const keyData = generateDeveloperApiKey({ clientName, plan });
    res.json(keyData);
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/affiliate - Create 20% Partner Referral link
router.post('/affiliate', (req, res) => {
  try {
    const { partnerName, partnerEmail, phone } = req.body;
    const affiliate = createPartnerAffiliate({ partnerName, partnerEmail, phone });
    res.json({ success: true, affiliate });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

// POST /api/anthropic/whitelabel - Create White-Label client portal
router.post('/whitelabel', (req, res) => {
  try {
    const { clientName, appName, primaryColor, customDomain } = req.body;
    const instance = createWhiteLabelInstance({ clientName, appName, primaryColor, customDomain });
    res.json({ success: true, instance });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

export default router;
