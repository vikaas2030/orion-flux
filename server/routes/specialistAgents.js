import express from 'express';
import {
  SPECIALIST_AGENTS,
  auditRealDeliveryChannels,
  getLethalObjectionResponses
} from '../services/specialistCloserAgents.js';
import { createCustomDomesticDeal } from '../services/domesticFastCashCloser.js';

const router = express.Router();

/**
 * GET /api/specialist-agents/status
 * Get status of the 4 specialist cash-settlement agents
 */
router.get('/status', (req, res) => {
  try {
    res.json({
      success: true,
      agents: Object.values(SPECIALIST_AGENTS),
      settlementRail: '9690973030@ibl (Vikas Singh)',
      taskforceObjective: 'Eliminate phantom relay gap and force physical cash into Vikas Singh bank account'
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * GET /api/specialist-agents/actionable-leads
 * Get real audited leads with real mobile numbers ready for 1-click WhatsApp dispatch
 */
router.get('/actionable-leads', (req, res) => {
  try {
    const data = auditRealDeliveryChannels();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * GET /api/specialist-agents/objections
 * Get lethal objection scripts
 */
router.get('/objections', (req, res) => {
  try {
    const objections = getLethalObjectionResponses();
    res.json({ success: true, objections });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

/**
 * POST /api/specialist-agents/inject-real-lead
 * Inject a real business contact that Vikas Singh actually knows or has verified
 */
router.post('/inject-real-lead', (req, res) => {
  try {
    const { company, contact, phone, city, niche, totalValueINR, pilotTokenINR } = req.body;
    if (!company || !phone) {
      return res.status(400).json({ error: true, message: 'Company name and real phone number are required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const deal = createCustomDomesticDeal({
      company,
      contact: contact || 'Business Owner',
      category: niche || 'Local Enterprise',
      city: city || 'Local Metro',
      phone: cleanPhone,
      totalValueINR: totalValueINR || 25000,
      pilotTokenINR: pilotTokenINR || 2500
    });

    res.json({
      success: true,
      message: 'Real lead successfully armed with bespoke portal & payment links!',
      deal
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
