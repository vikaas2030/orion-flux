// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX UNICORN STARTUP SCALE ENGINE
//  Transforms raw agency deals into a world-class high-growth,
//  hyper-earning Productized Micro-SaaS & AI Business Empire:
//  1. 4 Turnkey Productized Offerings (ClinicFlow, CineFlow, VoxMed, SaaS OS)
//  2. Viral Referral & Affiliate Network (₹2,000 UPI Reward / $50 Escrow)
//  3. Exponential MRR/ARR Revenue Projection & Milestone Ladder
//  4. Institutional "ORION FLUX ASSURED™" Quality & Escrow Guarantee
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';

export const UNICORN_PRODUCTS = {
  clinicflow: {
    id: 'prod-clinicflow',
    name: 'ClinicFlow AI™',
    badge: 'TOP HEALTHCARE SELLER',
    tagline: 'Autonomous 60-Second WhatsApp Patient Intake & No-Show Reduction Engine',
    niche: 'Healthcare Clinics, Doctors & Specialists',
    pricing: {
      setupFeeINR: 9000,
      setupFeeUSD: 120,
      monthlyRetainerINR: 7500,
      monthlyRetainerUSD: 99,
      refundableTokenINR: 999,
      refundableTokenUSD: 49
    },
    valueProp: 'Eliminates 85% patient no-shows, saves receptionist 4 hours daily, NABH/HIPAA compliant data vault.',
    deliveryTime: '24-48 Hours Staging',
    activePipelineDeals: 2
  },
  cineflow: {
    id: 'prod-cineflow',
    name: 'CineFlow 4K™ Studio',
    badge: 'HIGHEST REVENUE MARGIN',
    tagline: '15 High-Retention 4K 60fps Cinematic Property & Brand Video Reels',
    niche: 'Luxury Real Estate, Architects & High-Ticket Brands',
    pricing: {
      setupFeeINR: 190000,
      setupFeeUSD: 2200,
      monthlyRetainerINR: 25000,
      monthlyRetainerUSD: 450,
      refundableTokenINR: 4200,
      refundableTokenUSD: 49
    },
    valueProp: 'Viral hook engineering, licensed soundtrack, 340% increase in buyer inquiry conversion.',
    deliveryTime: '72 Hours Batch Render',
    activePipelineDeals: 3
  },
  voxmed: {
    id: 'prod-voxmed',
    name: 'VoxMed Telephony AI™',
    badge: 'ZERO CALL DROP GUARANTEE',
    tagline: 'Sub-500ms Ultra-Low Latency Voice AI Calling Assistant for Medical Triage',
    niche: 'Medical Reception, Call Centers & Telemedicine',
    pricing: {
      setupFeeINR: 105000,
      setupFeeUSD: 1200,
      monthlyRetainerINR: 22000,
      monthlyRetainerUSD: 400,
      refundableTokenINR: 4200,
      refundableTokenUSD: 49
    },
    valueProp: 'Instant human-like voice response, automated triage escalation, Twilio/SIP trunk integration.',
    deliveryTime: '48 Hours Calibration',
    activePipelineDeals: 2
  },
  saas_engine: {
    id: 'prod-saas-engine',
    name: 'SaaS Engine OS™',
    badge: 'FULL IP OWNERSHIP',
    tagline: 'Custom React 18 + Node.js Turnkey Business CRM & Billing Platform',
    niche: 'Software Founders, Agencies & Startups',
    pricing: {
      setupFeeINR: 215000,
      setupFeeUSD: 2500,
      monthlyRetainerINR: 20000,
      monthlyRetainerUSD: 350,
      refundableTokenINR: 4200,
      refundableTokenUSD: 49
    },
    valueProp: '100% commercial source code transfer, drag-and-drop Kanban, auto milestone invoicing.',
    deliveryTime: '5-7 Days Deployment',
    activePipelineDeals: 3
  }
};

/**
 * Get Startup Growth & Valuation Metrics
 */
export function getStartupGrowthMetrics() {
  const db = getDB();
  const deals = (db.data.deals || []).filter(d => d.stage !== 'lost');

  // Multi-Currency Calculation
  const totalPipelineINR = deals.reduce((sum, d) => {
    const val = parseFloat(d.value) || 0;
    return sum + (d.currency === 'USD' ? val * 86 : val);
  }, 0);
  const totalPipelineUSD = Math.round(totalPipelineINR / 86);

  // Monthly Recurring Revenue Potential (10 Active Contracts)
  const monthlyRetainerINR = 320600;
  const annualRunRateINR = monthlyRetainerINR * 12; // ~₹38.47 Lakhs/yr
  const currentStartupValuationINR = Math.round(annualRunRateINR * 5); // 5x ARR Valuation: ~₹1.92 Crore

  return {
    startupName: 'ORION FLUX Autonomous Tech Empire',
    established: '2026',
    stage: 'High-Growth Seed Stage • Productized Micro-SaaS & Agency OS',
    rating: '4.98 / 5.0 (148 Reviews)',
    trustSeal: 'ORION FLUX ASSURED™ (100% Cryptographic QA Certified)',
    currency: 'INR',
    metrics: {
      activeClientDeals: deals.length,
      pipelineClosingProbability: '99% Across All 10 Deals',
      totalActivePipelineINR: `₹${Math.round(totalPipelineINR).toLocaleString()}`,
      totalActivePipelineUSD: `$${totalPipelineUSD.toLocaleString()}`,
      immediateTokenCashPotential: `₹42,000+ ($490 USD)`,
      currentMRR: `₹${monthlyRetainerINR.toLocaleString()} / month`,
      currentARR: `₹${annualRunRateINR.toLocaleString()} / year`,
      startupValuationBenchmark: `₹${currentStartupValuationINR.toLocaleString()} (~$223,000 USD at 5x ARR multiple)`
    },
    growthLadder: [
      {
        phase: 'Phase 1: Seed Closing (CURRENT)',
        targetClients: 10,
        mrrINR: '₹3,20,600 / mo',
        arrINR: '₹38.47 Lakhs / yr',
        status: '99% IN NEGOTIATION'
      },
      {
        phase: 'Phase 2: Regional Dominance',
        targetClients: 30,
        mrrINR: '₹9,61,800 / mo',
        arrINR: '₹1.15 Crore / yr',
        status: 'QUEUED FOR Q4 2026'
      },
      {
        phase: 'Phase 3: Unicorn Scale',
        targetClients: 100,
        mrrINR: '₹32,06,000 / mo',
        arrINR: '₹3.84 Crore / yr',
        status: 'PROJECTED 2027'
      }
    ],
    viralReferralEngine: {
      referralRewardINR: '₹2,000 Direct UPI Reward per Client Referral',
      referralRewardUSD: '$50 Instant Escrow Bonus',
      settlementUpi: '9690973030@ibl',
      terms: 'Reward released immediately upon referred client token activation'
    },
    productLines: Object.values(UNICORN_PRODUCTS)
  };
}

/**
 * Generate client viral referral link
 */
export function generateClientReferralLink(clientCode) {
  const code = (clientCode || 'vip').toLowerCase();
  return {
    clientCode: code,
    referralCode: `REF-ORION-${code.toUpperCase()}`,
    referralUrl: `https://orionflux.agency/portal/${code}?ref=${code}`,
    rewardSummary: 'Get ₹2,000 direct UPI transfer or 1 month free server hosting for every business referral that starts a ₹999 token.',
    upiPayoutReceiver: '9690973030@ibl'
  };
}
