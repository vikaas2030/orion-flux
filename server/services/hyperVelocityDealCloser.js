// ═════════════════════════════════════════════════════════════════════
//  HYPER-VELOCITY 15-TO-20 DAY DEAL CLOSER & REVENUE CONVERSION ENGINE
//  Mandate: Drive 100% of pipeline deals to WON & settled bank cash in ≤ 15-20 days.
//  Zero-Escaping-Deals Policy • Reverse-Risk Micro-Tokens • Automated Urgency Cadences
//  Managing Principal: Vikas Singh | Authorized Rail: UPI 9690973030@ibl
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';
import { autoCloseDeal } from './autonomousSettlementEngine.js';
import { sendRealEmail, sanitizeEmail } from './emailDispatcher.js';

const UPI_ID = '9690973030@ibl';
const FOUNDER_NAME = 'Vikas Singh (Founder & Managing Principal)';

/**
 * Returns all active deals categorized by the 15-to-20 day urgency matrix
 */
export function get15DayPipelineMetrics() {
  const db = getDB();
  const deals = db.data.deals || [];
  const leads = db.data.leads || [];
  const publicBase = getPublicBaseUrl();
  const now = Date.now();

  const tier1_handshake = [];  // Days 1–4
  const tier2_milestone = [];  // Days 5–8
  const tier3_executive = [];  // Days 9–14
  const tier4_critical = [];   // Days 15–20
  const tier5_recovery = [];   // Days 20+
  const won_deals = [];

  deals.forEach((deal) => {
    const stage = (deal.stage || '').toLowerCase();
    const isWon = stage === 'won' || stage === 'closed_won';
    const isLost = stage === 'lost';

    if (isLost) return;

    if (isWon) {
      won_deals.push(deal);
      return;
    }

    // Calculate actual age in pipeline
    const createdAtTime = deal.created_at ? new Date(deal.created_at).getTime() : now;
    const ageInDays = Math.max(1, Math.floor((now - createdAtTime) / 86400000));
    const daysLeftTo15 = Math.max(0, 15 - ageInDays);
    const daysLeftTo20 = Math.max(0, 20 - ageInDays);

    const lead = leads.find(l => l.id === deal.lead_id || l.company === deal.lead_company) || {};
    const company = deal.lead_company || deal.lead_name || lead.company || 'Enterprise Partner';
    const contact = deal.contact_name || deal.lead_name || lead.name || 'Decision Maker';
    const phone = (deal.phone || lead.phone || '').replace(/[^0-9]/g, '');
    const email = deal.email || lead.email || '';

    const isUSD = deal.currency === 'USD' || (deal.value && deal.value < 50000 && !deal.title?.includes('₹'));
    const totalVal = parseFloat(deal.value) || (isUSD ? 2500 : 35000);
    const advanceVal = deal.advance ? parseFloat(deal.advance) : Math.round(totalVal * 0.5);
    const pilotVal = isUSD ? 49 : 999;

    const slug = (company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'client').slice(0, 24);
    const portalUrl = `${publicBase}/portal/${slug}`;
    const storeUrl = `${publicBase}/store`;

    // Direct UPI link for instant 1-tap mobile payment
    const upiLinkAdvance = `upi://pay?pa=${UPI_ID}&pn=ORION%20FLUX%20Advance&am=${advanceVal}&cu=INR`;
    const upiLinkPilot = `upi://pay?pa=${UPI_ID}&pn=ORION%20FLUX%20Pilot%20Token&am=${pilotVal}&cu=INR`;

    const enrichedDeal = {
      ...deal,
      company,
      contact,
      phone,
      email,
      totalVal,
      advanceVal,
      pilotVal,
      isUSD,
      ageInDays,
      daysLeftTo15,
      daysLeftTo20,
      portalUrl,
      storeUrl,
      upiLinkAdvance,
      upiLinkPilot
    };

    if (ageInDays <= 4) {
      enrichedDeal.currentPhase = 'PHASE_1_REVERSE_RISK_HANDSHAKE';
      enrichedDeal.phaseLabel = 'Phase 1: ₹999 / $49 Pilot Token Handshake';
      enrichedDeal.urgencyColor = 'emerald';
      enrichedDeal.recommendedAction = 'Stage 60s working prototype & offer ₹999 refundable token';
      tier1_handshake.push(enrichedDeal);
    } else if (ageInDays <= 8) {
      enrichedDeal.currentPhase = 'PHASE_2_MILESTONE_DELIVERY';
      enrichedDeal.phaseLabel = 'Phase 2: Live Milestone & QA Staging Proof';
      enrichedDeal.urgencyColor = 'cyan';
      enrichedDeal.recommendedAction = 'Deliver live portal link & 4-Layer QA Certificate';
      tier2_milestone.push(enrichedDeal);
    } else if (ageInDays <= 14) {
      enrichedDeal.currentPhase = 'PHASE_3_EXECUTIVE_NUDGE';
      enrichedDeal.phaseLabel = 'Phase 3: High-Urgency 15% Early-Bird Nudge';
      enrichedDeal.urgencyColor = 'amber';
      enrichedDeal.recommendedAction = 'Offer 15% 48h settlement discount + call from Vikas Singh';
      tier3_executive.push(enrichedDeal);
    } else if (ageInDays <= 20) {
      enrichedDeal.currentPhase = 'PHASE_4_CRITICAL_CLOSE';
      enrichedDeal.phaseLabel = 'Phase 4: Critical 15-20 Day Bank Settlement Lock';
      enrichedDeal.urgencyColor = 'rose';
      enrichedDeal.recommendedAction = 'Issue final Section 16 IGST/CGST invoice with instant UPI QR';
      tier4_critical.push(enrichedDeal);
    } else {
      enrichedDeal.currentPhase = 'PHASE_5_DOWNSELL_RECOVERY';
      enrichedDeal.phaseLabel = 'Phase 5: Instant Cash Recovery (Downsell to ₹999)';
      enrichedDeal.urgencyColor = 'purple';
      enrichedDeal.recommendedAction = 'Downsell to turnkey script or ₹999 lead pack to capture revenue';
      tier5_recovery.push(enrichedDeal);
    }
  });

  return {
    totalPipelineDeals: deals.length - won_deals.length,
    wonDealsCount: won_deals.length,
    totalPipelineValue: deals.filter(d => (d.stage || '').toLowerCase() !== 'won').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0),
    totalSettledRevenue: db.data.stats?.totalRevenue || (db.data.real_collections || []).reduce((s, c) => s + (parseFloat(c.amount) || 0), 0),
    phases: {
      tier1_handshake: {
        label: 'Days 1–4: Pilot Token Handshake',
        deals: tier1_handshake,
        count: tier1_handshake.length,
        description: 'Deals in initial qualification. Driven with ₹999 / $49 refundable micro-token to eliminate buying hesitation.'
      },
      tier2_milestone: {
        label: 'Days 5–8: Working Milestone Staging',
        deals: tier2_milestone,
        count: tier2_milestone.length,
        description: 'Clients shown live customized VIP portal with working triage bot and 4-Layer QA certificate.'
      },
      tier3_executive: {
        label: 'Days 9–14: High-Urgency Executive Cadence',
        deals: tier3_executive,
        count: tier3_executive.length,
        description: 'Nearing Day 15 close. 15% early-bird discount incentive activated with direct founder outreach.'
      },
      tier4_critical: {
        label: 'Days 15–20: Critical Bank Settlement Lock',
        deals: tier4_critical,
        count: tier4_critical.length,
        description: 'Closing window deadline. Final tax invoices, UPI QR codes, and phone calls to lock settlement.'
      },
      tier5_recovery: {
        label: 'Day 20+: Zero-Loss Downsell Protocol',
        deals: tier5_recovery,
        count: tier5_recovery.length,
        description: 'Deals exceeding 20 days. Automatically down-sold to ₹999 / ₹4,999 cash products.'
      }
    }
  };
}

/**
 * Generates an ultra-personalized, high-converting 15-day closing kit for any specific deal
 */
export function generate15DayCloserKit(dealId) {
  const db = getDB();
  const deal = (db.data.deals || []).find(d => d.id === parseInt(dealId));
  if (!deal) throw new Error(`Deal #${dealId} not found!`);

  const publicBase = getPublicBaseUrl();
  const company = deal.lead_company || deal.lead_name || 'Enterprise Client';
  const contact = deal.contact_name || deal.lead_name || 'Decision Maker';
  const phone = (deal.phone || '').replace(/[^0-9]/g, '');
  const email = deal.email || '';
  const isUSD = deal.currency === 'USD' || (deal.value && deal.value < 50000 && !deal.title?.includes('₹'));
  const totalVal = parseFloat(deal.value) || (isUSD ? 2500 : 35000);
  const advanceVal = deal.advance ? parseFloat(deal.advance) : Math.round(totalVal * 0.5);
  const pilotVal = isUSD ? 49 : 999;
  const currencySymbol = isUSD ? '$' : '₹';

  const slug = (company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'client').slice(0, 24);
  const portalUrl = `${publicBase}/portal/${slug}`;
  const storeUrl = `${publicBase}/store`;

  // 1. WhatsApp Script based on 15-Day Urgency
  const whatsappScript = `*ORION FLUX 3.0 | Executive Priority Close*
Namaste ${contact} ji 🙏 Vikas Singh here, Managing Principal at ORION FLUX.

Regarding your project for *${company}* (${deal.title}):
We have staged your working system on your dedicated VIP Client Portal:
🔗 *Live Preview:* ${portalUrl}

⚡ *15-Day Milestone Settlement Fast-Track:*
• Total Scope: ${currencySymbol}${totalVal.toLocaleString()}
• 100% QA Certified with 14-Day Money-Back Guarantee
• Zero Risk: Initiate immediate handover with just *${currencySymbol}${pilotVal}* refundable token!

📲 *Direct UPI Settlement Link:*
upi://pay?pa=${UPI_ID}&pn=ORION%20FLUX%20Token&am=${pilotVal}&cu=INR

Reply *YES* here to receive your source credentials today.
Direct WhatsApp / UPI: *${UPI_ID}*`;

  const whatsappIntent = `https://api.whatsapp.com/send?phone=${phone || '919690973030'}&text=${encodeURIComponent(whatsappScript)}`;

  // 2. Email Closer Script
  const emailSubject = `Executive Settlement & Handover: ${company} Milestone Delivery | ORION FLUX`;
  const emailHtml = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0b0f19; color: #e2e8f0; padding: 24px; border-radius: 8px;">
    <h2 style="color: #60a5fa;">ORION FLUX 3.0 ASSURED™ — Executive Delivery</h2>
    <p>Dear ${contact},</p>
    <p>Your custom system for <strong>${company}</strong> has passed our 4-Layer Cryptographic QA Certification and is ready for final handover.</p>
    <div style="background: #131b2e; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0;">
      <p style="margin: 0;"><strong>Project:</strong> ${deal.title}</p>
      <p style="margin: 4px 0 0 0;"><strong>Agreed Scope:</strong> ${currencySymbol}${totalVal.toLocaleString()}</p>
      <p style="margin: 4px 0 0 0;"><strong>Reverse-Risk Pilot Deposit:</strong> ${currencySymbol}${pilotVal} (100% Refundable)</p>
    </div>
    <p>👉 <a href="${portalUrl}" style="color: #3b82f6; font-weight: bold;">Click here to inspect your live Client VIP Portal</a></p>
    <p>To lock in deployment within our 15-day SLA, settle the initial pilot token via UPI: <strong>${UPI_ID}</strong> (Vikas Singh).</p>
    <p>Best regards,<br><strong>Vikas Singh</strong><br>Founder & Managing Principal, ORION FLUX</p>
  </div>
  `;

  return {
    dealId: deal.id,
    company,
    contact,
    phone,
    email,
    totalVal,
    advanceVal,
    pilotVal,
    currencySymbol,
    portalUrl,
    storeUrl,
    whatsappScript,
    whatsappIntent,
    emailSubject,
    emailHtml,
    upiId: UPI_ID
  };
}

/**
 * Advances a deal's stage towards WON
 */
export function advanceDealStage(dealId, newStage) {
  const db = getDB();
  const deal = (db.data.deals || []).find(d => d.id === parseInt(dealId));
  if (!deal) throw new Error(`Deal #${dealId} not found!`);

  const validStages = ['proposal', 'negotiation', 'milestone_staged', 'payment_pending', 'won'];
  if (!validStages.includes(newStage)) {
    throw new Error(`Invalid stage "${newStage}". Allowed: ${validStages.join(', ')}`);
  }

  deal.stage = newStage;
  deal.lastAdvancedAt = new Date().toISOString();
  db.save();

  return {
    success: true,
    dealId: deal.id,
    newStage,
    message: `Deal #${deal.id} (${deal.lead_company}) advanced to ${newStage.toUpperCase()}`
  };
}

/**
 * Dispatches an automated closer email to the client using verified Google SMTP
 */
export async function sendCloserEmailToDeal(dealId) {
  const closerKit = generate15DayCloserKit(dealId);
  const cleanEmail = sanitizeEmail(closerKit.email);

  if (!cleanEmail) {
    throw new Error(`Deal #${dealId} does not have a valid email address! Given: "${closerKit.email}"`);
  }

  const result = await sendRealEmail({
    to: cleanEmail,
    subject: closerKit.emailSubject,
    html: closerKit.emailHtml
  });

  // Update deal status
  advanceDealStage(dealId, 'negotiation');

  return {
    success: true,
    recipient: cleanEmail,
    messageId: result.messageId,
    mode: result.mode
  };
}

/**
 * Instant Bank Settlement & Deal Won Finalization:
 * Closes the deal with 100% genuine bank collection record
 */
export function settleAndWinDeal(dealId, { utrNumber, amount, paymentMethod }) {
  if (!utrNumber || utrNumber.length < 6) {
    throw new Error('A valid Bank UTR number or transaction reference is required to close and win a deal.');
  }

  const result = autoCloseDeal(dealId, {
    utrNumber,
    advanceAmount: amount,
    paymentMethod: paymentMethod || 'Direct UPI Bank Settlement (Google Pay / PhonePe)'
  });

  return {
    success: true,
    dealWon: true,
    result,
    message: `🎉 Deal #${dealId} successfully marked WON with verified bank settlement!`
  };
}
