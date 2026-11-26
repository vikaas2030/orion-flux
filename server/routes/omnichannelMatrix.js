import express from 'express';
import {
  getOmnichannelQueue,
  executeEmailFallback,
  classifyChannelProfile
} from '../services/omnichannelCognitiveEngine.js';
import { runMultiCityBatch } from '../services/multiCityHunter.js';
import { getDB } from '../config/database.js';

const router = express.Router();

// GET /api/omnichannel/queue — Returns Omnichannel Queue
router.get('/queue', (req, res) => {
  try {
    const queue = getOmnichannelQueue();
    const whatsappCapable = queue.filter(q => q.phoneProfile.isWhatsAppCapable).length;
    const landlines = queue.filter(q => q.phoneProfile.channel === 'LANDLINE_OFFICE').length;
    const emailOnly = queue.filter(q => q.phoneProfile.channel === 'EMAIL_ONLY').length;

    res.json({
      success: true,
      totalLeads: queue.length,
      stats: {
        whatsappCapable,
        landlines,
        emailOnly
      },
      queue
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/omnichannel/send-email-fallback — Dispatch Google SMTP Email for non-WA clients
router.post('/send-email-fallback', async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) {
      return res.status(400).json({ error: true, message: 'leadId is required' });
    }

    const result = await executeEmailFallback(leadId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/omnichannel/log-touch — Record Omnichannel Outreach Touchpoint
router.post('/log-touch', (req, res) => {
  try {
    const { leadId, channel, notes } = req.body;
    const db = getDB();

    if (db.data.leads && leadId) {
      const lead = db.data.leads.find(l => String(l.id) === String(leadId));
      if (lead) {
        lead.lastContactChannel = channel;
        lead.lastContactedAt = new Date().toISOString();
        lead.status = `${channel.toLowerCase()}_dispatched`;
      }
    }

    if (!db.data.activities) db.data.activities = [];
    db.data.activities.unshift({
      id: `act-touch-${Date.now()}`,
      type: 'omnichannel_touchpoint_logged',
      title: `⚡ Omnichannel Touchpoint: ${channel}`,
      description: notes || `Client reached via ${channel} rail.`,
      timestamp: new Date().toISOString()
    });

    db.save();

    res.json({ success: true, message: `Touchpoint "${channel}" recorded successfully.` });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/omnichannel/hunt-domestic-fast — Hunt High-Velocity Indian UPI Leads
router.post('/hunt-domestic-fast', async (req, res) => {
  try {
    const result = await runMultiCityBatch(
      ['Mumbai', 'Delhi', 'Noida', 'Bengaluru', 'Pune'],
      ['dentist', 'doctor', 'real_estate', 'interior_designer'],
      3
    );

    res.json({
      success: true,
      totalNewlyAdded: result.totalNewlyAdded || 0,
      message: `🇮🇳 Discovered ${result.totalNewlyAdded || 0} high-velocity Indian businesses for instant ₹999 UPI token closing!`
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

import { syncAllLeadsToPipeline } from '../services/dealsPipelineSynchronizer.js';

// POST /api/omnichannel/sync-deals — Synchronize all active leads into pipeline deals
router.post('/sync-deals', (req, res) => {
  try {
    const result = syncAllLeadsToPipeline();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
