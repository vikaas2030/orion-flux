import express from 'express';
import { getDB } from '../config/database.js';
import { recordPortalVisit, runGoldenWindowPulse, getGoldenWindowTelemetry } from '../services/goldenWindowCloser.js';
import { getCheckoutTiersForDeal, verifyAndRecordManualUtr, buildUpiPayload } from '../services/dynamicQRGenerator.js';
import { getClientReferralPass, getViralMultiplierMetrics } from '../services/viralMultiplierEngine.js';
import { HIGH_INTENT_ESCROW_JOBS } from '../services/escrowContractCloser.js';
import { getPublicBaseUrl } from '../services/publicAccess.js';

const router = express.Router();

/**
 * GET /api/money-machine/overview
 * Real-time unified command center for real income generation
 */
router.get('/overview', (req, res) => {
  try {
    const db = getDB();
    const deals = db.data.deals || [];
    const realCollections = db.data.real_collections || [];
    const revenue = db.data.revenue || [];

    const totalRealCash = realCollections.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const goldenTelemetry = getGoldenWindowTelemetry();
    const viralMetrics = getViralMultiplierMetrics();

    // Top 3 Hot Indian Deals for Instant WhatsApp UPI Closing
    const hotIndianDeals = deals
      .filter(d => d.currency !== 'USD' && d.stage !== 'won' && d.phone && d.phone.length > 5 && !d.phone.includes('Google Maps'))
      .slice(0, 3)
      .map(d => {
        const company = d.lead_company || d.lead_name || 'Client';
        const cleanPhone = (d.phone || '').replace(/[^0-9]/g, '');
        const advance = d.advance || 2500;
        const total = d.value || 6000;
        const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const portalUrl = `${getPublicBaseUrl()}/portal/${slug}`;
        const upiPayLink = buildUpiPayload({
          amount: advance,
          clientName: company,
          note: '50% Milestone Advance'
        });
        const tokenPayLink = buildUpiPayload({
          amount: 999,
          clientName: company,
          note: 'Sprint Reservation Token'
        });

        const whatsappPitch = `Namaste ${company} Team 🙏\n\n` +
          `Main ORION FLUX Autonomous Studio se contact kar raha hoon. Aapke business ke liye hamara 24/7 automated client intake assistant live ready hai:\n\n` +
          `🔗 Live Client Portal: ${portalUrl}\n\n` +
          `⚡ Fast-Start Guarantee: Sirf ₹999 refundable token par 48-hour development slot reserve karein (100% Money-Back Guarantee).\n` +
          `Direct UPI Pay: ${tokenPayLink}\n\n` +
          `Kya hum aaj live setup initiate karein?`;

        return {
          id: d.id,
          company,
          phone: d.phone,
          cleanPhone,
          value: total,
          advance,
          portalUrl,
          upiPayLink,
          tokenPayLink,
          whatsappDirectUrl: `https://wa.me/${cleanPhone.startsWith('91') || cleanPhone.length === 10 ? (cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone) : cleanPhone}?text=${encodeURIComponent(whatsappPitch)}`
        };
      });

    // Total Escrow Pool available for 1-click dispatch
    const totalEscrowPoolUSD = HIGH_INTENT_ESCROW_JOBS.reduce((sum, j) => sum + j.budgetUSD, 0);
    const totalEscrowAdvancesUSD = HIGH_INTENT_ESCROW_JOBS.reduce((sum, j) => sum + j.advance50USD, 0);

    res.json({
      success: true,
      bankingStatus: {
        verifiedCashInBank: totalRealCash,
        verifiedCashFormatted: `₹${totalRealCash.toLocaleString()} INR ($0 USD)`,
        realCollectionsCount: realCollections.length,
        primaryUpiId: '9690973030@ibl',
        accountHolder: 'Vikas Singh',
        settlementPolicy: '100% Genuine Physical Settlement Only'
      },
      goldenWindow: goldenTelemetry,
      viralMultiplier: viralMetrics,
      hotIndianDeals,
      escrowSummary: {
        totalJobs: HIGH_INTENT_ESCROW_JOBS.length,
        totalPoolUSD: totalEscrowPoolUSD,
        totalAdvancesUSD: totalEscrowAdvancesUSD,
        totalPoolFormatted: `$${totalEscrowPoolUSD.toLocaleString()} USD (~₹${Math.round(totalEscrowPoolUSD * 86).toLocaleString('en-IN')})`,
        jobs: HIGH_INTENT_ESCROW_JOBS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/money-machine/portal-visit
 * Triggered whenever a client portal is loaded
 */
router.post('/portal-visit', (req, res) => {
  try {
    const { slug } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = recordPortalVisit(slug, { ip, userAgent });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/money-machine/verify-utr
 * 1-Click instant verification of incoming bank SMS / UTR
 */
router.post('/verify-utr', (req, res) => {
  try {
    const { clientSlug, utrNumber, amount, paymentMethod, notes } = req.body;
    const result = verifyAndRecordManualUtr({
      clientSlug,
      utrNumber,
      amount,
      paymentMethod,
      notes
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/money-machine/checkout-tiers/:slug
 */
router.get('/checkout-tiers/:slug', (req, res) => {
  try {
    const db = getDB();
    const slug = (req.params.slug || '').toLowerCase();
    const deals = db.data.deals || [];
    const deal = deals.find(d => {
      const cSlug = (d.lead_company || d.lead_name || d.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      return cSlug.includes(slug) || slug.includes(cSlug);
    }) || { value: 7500, currency: 'INR' };

    const company = deal.lead_company || deal.lead_name || slug.toUpperCase();
    const tiers = getCheckoutTiersForDeal(deal, company);
    res.json({ success: true, company, ...tiers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/money-machine/referral-pass/:slug
 */
router.get('/referral-pass/:slug', (req, res) => {
  try {
    const pass = getClientReferralPass(req.params.slug);
    res.json(pass);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
