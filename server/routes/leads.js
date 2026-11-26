import express from 'express';
import { getDB } from '../config/database.js';
import { scoreAllLeadsInDB, getRankedOutreachQueue, calculateLeadScore } from '../services/leadScoringEngine.js';

const router = express.Router();

// GET /api/leads/ranked - Get AI Propensity-Scored Leads Matrix
router.get('/ranked', (req, res) => {
  try {
    const scoredSummary = scoreAllLeadsInDB();
    const rankedQueue = getRankedOutreachQueue();
    res.json({
      success: true,
      summary: scoredSummary,
      rankedQueue: rankedQueue.slice(0, 50)
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/leads/rescore - Force recalculate AI Propensity scores across all leads
router.post('/rescore', (req, res) => {
  try {
    const result = scoreAllLeadsInDB();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/leads
router.get('/', (req, res) => {
  try {
    const db = getDB();
    let leads = [...db.data.leads];
    const { search, status, source, limit } = req.query;

    if (search) {
      const s = search.toLowerCase().trim();
      leads = leads.filter(l =>
        (l.name && l.name.toLowerCase().includes(s)) ||
        (l.company && l.company.toLowerCase().includes(s)) ||
        (l.email && l.email.toLowerCase().includes(s)) ||
        (l.phone && l.phone.toLowerCase().includes(s)) ||
        (l.city && l.city.toLowerCase().includes(s)) ||
        (l.industry && l.industry.toLowerCase().includes(s)) ||
        (l.role && l.role.toLowerCase().includes(s))
      );
    }
    if (status) {
      leads = leads.filter(l => l.status === status);
    }
    if (source) {
      leads = leads.filter(l => l.source === source);
    }

    // Ensure propensity scores are populated
    leads = leads.map(l => {
      if (l.aiScore === undefined || !l.propensityTier) {
        const sc = calculateLeadScore(l);
        return { ...l, aiScore: sc.score, propensityTier: sc.tier, scoreLabel: sc.label, scoreReasons: sc.reasons };
      }
      return l;
    });

    const total = leads.length;
    if (limit && parseInt(limit) > 0) {
      leads = leads.slice(0, parseInt(limit));
    }

    res.json({ leads, total, page: 1, limit: limit ? parseInt(limit) : total, totalPages: 1 });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/leads/stats
router.get('/stats', (req, res) => {
  try {
    const db = getDB();
    const leads = db.data.leads;
    res.json({
      total: leads.length,
      recentLeads: leads.slice(-5).reverse()
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/leads
router.post('/', (req, res) => {
  try {
    const db = getDB();
    const { name, email, phone, company, website, source, status, score, industry, city, country } = req.body;

    if (!name) return res.status(400).json({ error: true, message: 'Name is required' });

    const newLead = {
      id: Date.now(),
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      website: website || null,
      source: source || 'manual',
      status: status || 'new',
      score: score || 50,
      industry: industry || null,
      city: city || null,
      country: country || null,
      created_at: new Date().toISOString()
    };

    db.data.leads.unshift(newLead);
    db.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', (req, res) => {
  try {
    const db = getDB();
    const id = parseInt(req.params.id);
    db.data.leads = db.data.leads.filter(l => l.id !== id);
    db.save();
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/leads/bulk
router.post('/bulk', (req, res) => {
  try {
    const db = getDB();
    const { leads } = req.body;
    if (!leads || !Array.isArray(leads)) return res.status(400).json({ error: true, message: 'leads array is required' });

    let imported = 0;
    leads.forEach(l => {
      if (l.name || l.company) {
        db.data.leads.unshift({
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: l.name || l.company,
          email: l.email || '',
          phone: l.phone || '',
          company: l.company || l.name,
          website: l.website || '',
          source: l.source || 'scraper',
          status: 'new',
          score: 80,
          created_at: new Date().toISOString()
        });
        imported++;
      }
    });

    db.save();
    res.json({ message: `Imported ${imported} leads`, imported });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
