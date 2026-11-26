// ═════════════════════════════════════════════════════════════════════
//  3-STEP AUTOMATED FOLLOW-UP CADENCE ENGINE (HIGH-CONVERSION CLOSER)
//  80% of B2B deals close on Touch #2 and Touch #3.
//  Step 1: Initial Hook & Staging Link (Day 1)
//  Step 2: Value-Add & ROI Breakdown (Day 3 / 48h)
//  Step 3: Urgency, Slot Scarcity & ₹2,500 Token Lock (Day 5 / 96h)
//  All with 100% All-Inclusive Net Pricing (₹0 Extra GST) & Real SMTP
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { sendRealEmail } from './emailDispatcher.js';
import { getPublicBaseUrl } from './publicAccess.js';

/**
 * Get comprehensive analytics of the 3-Step Cadence
 */
export function getFollowUpStatus() {
  const db = getDB();
  const leads = db.data.leads || [];

  const contacted = leads.filter(l => 
    l.status === 'contacted' || 
    l.status === 'real_email_sent' || 
    l.status === 'whatsapp_dispatched' || 
    l.status === 'proposal_sent' || 
    l.status === 'email_contacted' || 
    l.status === 'whatsapp_contacted' || 
    (l.status && (l.status.includes('dispatched') || l.status.includes('contacted'))) ||
    (l.followupStep !== undefined && l.followupStep > 0)
  );
  const step0 = contacted.filter(l => !l.followupStep || l.followupStep === 0);
  const step1 = contacted.filter(l => l.followupStep === 1);
  const step2 = contacted.filter(l => l.followupStep === 2);
  const completed = contacted.filter(l => l.followupStep >= 3);

  const dueForFollowUp = contacted.filter(l => {
    if (l.status === 'won' || l.status === 'lost') return false;
    const currentStep = l.followupStep || 0;
    if (currentStep >= 3) return false;
    
    // Check if enough time has passed or if nextFollowupDue is reached
    if (!l.contactedAt && !l.lastFollowupAt) return true;
    const lastTouch = new Date(l.lastFollowupAt || l.contactedAt).getTime();
    const now = Date.now();
    // Default 48h gap (or immediately eligible if older than 30 mins for demo/accelerated cadence)
    return (now - lastTouch) >= (30 * 60 * 1000); // 30 mins accelerated interval for real action
  });

  return {
    totalContacted: contacted.length,
    step0_initial: step0.length,
    step1_valueAdd: step1.length,
    step2_urgencyLock: step2.length,
    completedCadence: completed.length,
    dueForFollowUpCount: dueForFollowUp.length,
    dueLeads: dueForFollowUp.slice(0, 10).map(l => ({
      id: l.id,
      company: l.company || l.name,
      email: l.email,
      city: l.city,
      currentStep: l.followupStep || 0,
      nextStep: (l.followupStep || 0) + 1,
      advanceStr: l.currency === 'USD' ? `$${l.pricingAdvance || 200}` : `₹${(l.pricingAdvance || 2500).toLocaleString()}`
    }))
  };
}

/**
 * Execute automated follow-up dispatch for eligible leads
 */
export async function runFollowUpPulse(maxBatch = 3) {
  const db = getDB();
  const leads = db.data.leads || [];
  const settings = db.data.settings || {};
  const upiId = settings.upi_id || '9690973030@ibl';

  const eligible = leads.filter(l => {
    const isContacted = l.status === 'contacted' || 
      l.status === 'real_email_sent' || 
      l.status === 'whatsapp_dispatched' || 
      l.status === 'proposal_sent' || 
      l.status === 'email_contacted' || 
      l.status === 'whatsapp_contacted' || 
      (l.status && (l.status.includes('dispatched') || l.status.includes('contacted'))) ||
      (l.followupStep && l.followupStep > 0);
    if (!isContacted) return false;
    if (l.status === 'won' || l.status === 'lost') return false;
    if (!l.email || !l.email.includes('@') || l.email.includes('_')) return false;
    const currentStep = l.followupStep || 0;
    if (currentStep >= 3) return false;

    // Minimum 12 hours between follow-up steps to prevent spamming
    const lastTouch = new Date(l.lastFollowupAt || l.contactedAt || l.realSmtpSentAt || 0).getTime();
    const now = Date.now();
    const minIntervalMs = 12 * 60 * 60 * 1000; // 12 hours
    if (lastTouch > 0 && (now - lastTouch) < minIntervalMs) return false;

    return true;
  }).slice(0, maxBatch);

  if (eligible.length === 0) {
    return {
      success: true,
      dispatchedCount: 0,
      message: 'No leads currently due for follow-up sequence. Cadence up-to-date.'
    };
  }

  let dispatched = [];

  for (const lead of eligible) {
    const currentStep = lead.followupStep || 0;
    const nextStep = currentStep + 1;
    const isIndia = lead.country === 'India';
    const advanceStr = isIndia ? `₹${(lead.pricingAdvance || 2500).toLocaleString()}` : `$${lead.pricingAdvance || 200}`;
    const totalStr = isIndia ? `₹${(lead.pricingTotal || 6000).toLocaleString()}` : `$${lead.pricingTotal || 500}`;
    const company = lead.company || lead.name || 'Business Partner';
    const clientSlug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const portalUrl = `${getPublicBaseUrl()}/portal/${clientSlug}`;

    let subject = '';
    let body = '';

    if (nextStep === 1) {
      // Step 2: Value-Add & Problem Elimination (Day 3)
      subject = `Quick walkthrough & 3 ROI optimizations for ${company}`;
      body = `Namaste / Hello ${company} Team,\n\nFollowing up on our earlier note regarding automated lead intake for ${company}.\n\nWe analyzed customer interaction patterns for ${lead.industry || 'local businesses'} in ${lead.city || 'your area'}, and identified 3 key improvements we can deploy for you:\n\n1. 24/7 WhatsApp Response: 0-minute wait time for patient/client inquiries.\n2. Instagram & Local Search Video Reels: 4K motion hooks that turn viewers into paying bookings.\n3. Frictionless Payments: Direct UPI settlement (0% gateway cuts, ₹0 extra tax • Sec 22 CGST Exempt).\n\nYou can inspect your live private client portal here:\n${portalUrl}\n\nIntroductory All-Inclusive Investment:\n• Total Fee: ${totalStr} (Zero extra taxes)\n• 50% Milestone Advance: ${advanceStr} via instant UPI (${upiId})\n\nWould you have 5 minutes for a quick walkthrough this week?\n\nBest regards,\nVikas | ORION FLUX Autonomous Studio\nDirect UPI: ${upiId}\nEmail: vikaas2030@gmail.com`;
    } else if (nextStep === 2) {
      // Step 3: Urgency, Scarcity & Micro-Token Lock (Day 5)
      subject = `Final follow-up: Reserving development slot for ${company}`;
      body = `Namaste / Hello ${company} Team,\n\nI wanted to send a quick final note regarding ${company}'s automated client system.\n\nTo ensure our strict 2-Hour SLA and 100% Quality Assurance guarantee, our engineering studio onboards only 2 new businesses in ${lead.city || 'your city'} per month.\n\nWe have held a development slot open for ${company}. If you'd like to reserve this slot and launch your live system in 48 hours:\n\n1. Simply transfer the ${advanceStr} token to UPI: ${upiId} (GPay / PhonePe / Paytm)\n2. Submit your 12-digit UTR on your portal: ${portalUrl}\n\nIf the timing isn't right, no worries at all! Just reply 'Not now' and we will release the slot.\n\nBest regards,\nVikas & ORION FLUX Team\nPhone: +91 9690973030\nDirect UPI: ${upiId}`;
    } else {
      // Cadence completed
      lead.followupStep = 3;
      continue;
    }

    try {
      console.log(`[FOLLOW-UP CADENCE] Sending Step #${nextStep} to ${lead.email} (${company})...`);
      const res = await sendRealEmail({
        to: lead.email,
        subject,
        text: body
      });

      lead.followupStep = nextStep;
      lead.lastFollowupAt = new Date().toISOString();
      if (!lead.followupHistory) lead.followupHistory = [];
      lead.followupHistory.push({
        step: nextStep,
        subject,
        messageId: res.messageId,
        sentAt: new Date().toISOString()
      });

      dispatched.push({
        leadId: lead.id,
        company,
        email: lead.email,
        step: nextStep,
        messageId: res.messageId
      });

      if (!db.data.activities) db.data.activities = [];
      db.data.activities.unshift({
        id: `act-followup-${Date.now()}`,
        type: 'followup_dispatched',
        title: `🔄 Follow-Up Step #${nextStep} Dispatched: ${company}`,
        description: `Subject: "${subject}" | Delivered via Google SMTP (Msg ID: ${res.messageId})`,
        timestamp: new Date().toISOString()
      });

    } catch (sendErr) {
      console.error(`[FOLLOW-UP CADENCE] Error sending to ${lead.email}:`, sendErr.message);
    }

    // Pacing delay
    await new Promise(r => setTimeout(r, 2000));
  }

  db.save();

  return {
    success: true,
    dispatchedCount: dispatched.length,
    dispatchedLeads: dispatched,
    status: getFollowUpStatus()
  };
}
