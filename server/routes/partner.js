import express from 'express';
import {
  getPartnerNetworkStats,
  registerNewPartner,
  attributeDealToPartner,
  trackPartnerClick,
  recordPartnerPayout,
  scoutRealPartnerProspects,
  getPartnerProspects,
  sendPartnerInvitation,
  runAutonomousPartnerPulse,
  seedVerifiedGlobalAgencies,
  generateBilateralPartnerBond,
  ratifyAllPartnerBondsAndOnboard,
  PARTNER_TIERS
} from '../services/globalPartnerEngine.js';

const router = express.Router();

// GET /api/partner/stats — Comprehensive partner stats & leaderboard (100% Real Data)
router.get('/stats', (req, res) => {
  try {
    const data = getPartnerNetworkStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/partner/tiers — Partner commission tier structures
router.get('/tiers', (req, res) => {
  res.json({ success: true, tiers: PARTNER_TIERS });
});

// GET /api/partner/prospects — List all real scouted partner prospects
router.get('/prospects', (req, res) => {
  try {
    const data = getPartnerProspects();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/seed-verified — Initialize & seed curated verified global digital agencies
router.post('/seed-verified', (req, res) => {
  try {
    const result = seedVerifiedGlobalAgencies();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/partner/bond/:code — Generate & fetch official Bilateral Strategic Partnership Bond
router.get('/bond/:code', (req, res) => {
  try {
    const { code } = req.params;
    
    // Look up in active partners or prospects
    const data = getPartnerNetworkStats();
    const partner = (data.partners || []).find(p => p.partnerCode && p.partnerCode.toLowerCase() === code.toLowerCase() || p.id === code) ||
                    (getPartnerProspects().prospects || []).find(p => p.prospectCode && p.prospectCode.toLowerCase() === code.toLowerCase() || p.id === code);

    const partnerPayload = partner || {
      partnerCode: code,
      agencyName: 'Authorized Strategic Partner Agency',
      city: 'Global Financial Hub',
      country: 'International',
      commissionPct: 20
    };

    const bond = generateBilateralPartnerBond(partnerPayload);
    res.json({ success: true, bond });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/ratify-all — Mass ratify bilateral partnership bonds & onboard all agencies
router.post('/ratify-all', (req, res) => {
  try {
    const result = ratifyAllPartnerBondsAndOnboard();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/scout — Scout real B2B agencies & consultancies via OpenStreetMap Nominatim
router.post('/scout', async (req, res) => {
  try {
    const { city, country, category } = req.body;
    const result = await scoutRealPartnerProspects({ city, country, category });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/invite — Dispatch real email partnership invitation via verified Google SMTP
router.post('/invite', async (req, res) => {
  try {
    const { prospectId } = req.body;
    if (!prospectId) {
      return res.status(400).json({ error: true, message: 'prospectId is required' });
    }
    const result = await sendPartnerInvitation(prospectId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/register or public-join — Onboard a genuine affiliate or agency partner
router.post('/register', (req, res) => {
  try {
    const { name, email, phone, agencyName, country, city, paymentRail, tier, partnerCode } = req.body;
    if (!name && !agencyName) {
      return res.status(400).json({ error: true, message: 'Name or Agency Name is required' });
    }

    const result = registerNewPartner({
      name,
      email,
      phone,
      agencyName,
      country,
      city,
      paymentRail,
      tier,
      partnerCode
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Alias for public registration
router.post('/public-join', (req, res) => {
  try {
    const { name, email, phone, agencyName, country, city, paymentRail, tier, partnerCode } = req.body;
    if (!name && !agencyName) {
      return res.status(400).json({ error: true, message: 'Name or Agency Name is required' });
    }

    const result = registerNewPartner({
      name,
      email,
      phone,
      agencyName,
      country,
      city,
      paymentRail,
      tier,
      partnerCode
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/pulse — Run autonomous partner promotion & health pulse
router.post('/pulse', (req, res) => {
  try {
    const result = runAutonomousPartnerPulse();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/partner/track/:code — Track real click on partner referral link
router.get('/track/:code', (req, res) => {
  try {
    const { code } = req.params;
    const result = trackPartnerClick(code);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/attribute — Attribute deal to partner upon settlement
router.post('/attribute', (req, res) => {
  try {
    const { partnerCode, dealValue, currency } = req.body;
    if (!partnerCode || !dealValue) {
      return res.status(400).json({ error: true, message: 'partnerCode and dealValue are required' });
    }

    const result = attributeDealToPartner(partnerCode, dealValue, currency || 'INR');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/partner/payout — Record commission payout to partner
router.post('/payout', (req, res) => {
  try {
    const { partnerId, amount, utrNumber, paymentMethod } = req.body;
    if (!partnerId) {
      return res.status(400).json({ error: true, message: 'partnerId is required' });
    }

    const result = recordPartnerPayout(partnerId, { amount, utrNumber, paymentMethod });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
