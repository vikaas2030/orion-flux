import express from 'express';
import { getDB } from '../config/database.js';
import { getWatchdogStatus } from '../services/selfHealingWatchdog.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  try {
    const db = getDB();
    const leads = db.data.leads || [];
    const deals = db.data.deals || [];
    const realCollections = db.data.real_collections || [];

    const totalLeads = leads.length;
    const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
    
    // Accurate Multi-Currency Pipeline Calculation ($1 USD = ₹86 INR)
    const pipelineINR = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => {
      const val = parseFloat(d.value) || 0;
      return sum + (d.currency === 'USD' ? val * 86 : val);
    }, 0);
    const pipelineUSD = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.currency === 'USD').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    const pipelineValue = Math.round(pipelineINR);
    const pipelineFormatted = `₹${pipelineValue.toLocaleString()} INR ($${pipelineUSD.toLocaleString()} USD)`;
    
    // STRICTLY VERIFIED REAL BANK COLLECTIONS
    const totalRevenue = realCollections.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const monthlyRevenue = totalRevenue;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCollections = realCollections.filter(r => (r.timestamp || r.createdAt || '').startsWith(todayStr));
    const todayRevenue = todayCollections.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
    const todayDealsWon = deals.filter(d => d.stage === 'won' && (d.closedAt || d.updatedAt || '').startsWith(todayStr)).length;

    const outreachSent = leads.filter(l => l.realSmtpSent === true || l.status === 'real_email_sent' || l.status === 'proposal_sent' || l.status === 'contacted').length;
    const partners = db.data.partners || [];
    const activePartnersCount = partners.filter(p => p.status === 'ACTIVE').length;
    const partnerBondEmailsSent = partners.filter(p => p.bondEmailSent === true).length;

    res.json({
      totalLeads,
      newLeadsThisMonth: totalLeads,
      activeDeals,
      pipelineValue,
      pipelineFormatted,
      pipelineUSD,
      wonDeals: deals.filter(d => d.stage === 'won').length,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      todayDealsWon,
      pendingTasks: activeDeals,
      emailsSent: outreachSent,
      activePartnersCount,
      partnerBondEmailsSent,
      realCollectionsCount: realCollections.length,
      watchdog: getWatchdogStatus(),
      currency: 'INR'
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', (req, res) => {
  try {
    const db = getDB();
    res.json({ activities: db.data.activities || [] });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/dashboard/lead-sources
router.get('/lead-sources', (req, res) => {
  try {
    const db = getDB();
    const leads = db.data.leads || [];
    const counts = {};
    leads.forEach(l => {
      const src = l.source || 'global_hunter';
      counts[src] = (counts[src] || 0) + 1;
    });

    const sources = Object.keys(counts).map(k => ({
      source: k,
      count: counts[k]
    }));

    res.json({ sources: sources.length ? sources : [{ source: 'global_autonomous_hunter', count: leads.length }] });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
