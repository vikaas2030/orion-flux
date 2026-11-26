// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX TITAN OMNICHANNEL COGNITIVE CLOSER ENGINE
//  World-Class Agency-Grade Autonomous Client Outreach & Multi-Channel Closer
//  Mandate: 100% Free, Automated & Real Communication.
//  Channels:
//    1. Fast WhatsApp Auto-Queue (Universal native zero-cost sequence)
//    2. 100 Free Native SMS/Day Fallback (For non-WhatsApp cellular clients)
//    3. Gatekeeper-Bypass Landline Calling Protocol (For 011/022 clinic/office desks)
//    4. Google SMTP Real Email Infiltration (vikaas2030@gmail.com)
//  Authorized Signatory: Vikas Singh (Founder & Managing Principal)
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';
import { sendRealEmail } from './emailDispatcher.js';

/**
 * Classifies phone number into channel capability:
 * - WHATSAPP_MOBILE (10-digit Indian or E.164 mobile starting with 6,7,8,9)
 * - LANDLINE_OFFICE (Starts with STD codes like 011, 022, 080, 033, 044 or length < 10)
 * - INTERNATIONAL_MOBILE (Starts with +1, +971, +44 etc.)
 */
export function classifyChannelProfile(phone, country = 'India') {
  if (!phone) return { channel: 'EMAIL_ONLY', isMobile: false, isWhatsAppCapable: false };

  const digits = phone.replace(/[^0-9]/g, '');

  // Indian Landline Detection (STD codes: 011 Delhi, 022 Mumbai, 080 Bangalore, 044 Chennai, 033 Kolkata, etc.)
  const isIndianLandline = digits.startsWith('011') || digits.startsWith('022') ||
    digits.startsWith('080') || digits.startsWith('044') || digits.startsWith('033') ||
    digits.startsWith('020') || digits.startsWith('0124') || digits.startsWith('0120') ||
    (digits.length === 8 && !digits.startsWith('9') && !digits.startsWith('8') && !digits.startsWith('7') && !digits.startsWith('6'));

  if (isIndianLandline) {
    return {
      channel: 'LANDLINE_OFFICE',
      isMobile: false,
      isWhatsAppCapable: false,
      recommendedAction: 'GATEKEEPER_BYPASS_CALL',
      label: '☎️ Office Landline (Requires Gatekeeper Triage Call)'
    };
  }

  // Indian Cellular Mobile (10 digits starting with 6, 7, 8, 9 or prefixed with 91/0)
  const isIndianMobile = (digits.length === 10 && /^[6-9]/.test(digits)) ||
    (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) ||
    (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1)));

  if (isIndianMobile) {
    const clean10 = digits.slice(-10);
    return {
      channel: 'CELLULAR_MOBILE',
      cleanDigits: '91' + clean10,
      isMobile: true,
      isWhatsAppCapable: true,
      hasSmsFallback: true,
      recommendedAction: 'WHATSAPP_PRIMARY_SMS_FALLBACK',
      label: '📱 Cellular Mobile (WhatsApp + 100 Free Daily SMS)'
    };
  }

  // International Mobile (e.g. Dubai 971, UK 44, US 1)
  if (digits.length >= 10) {
    return {
      channel: 'INTERNATIONAL_MOBILE',
      cleanDigits: digits,
      isMobile: true,
      isWhatsAppCapable: true,
      hasSmsFallback: true,
      recommendedAction: 'WHATSAPP_INTERNATIONAL',
      label: '🌐 Global Cellular (WhatsApp + Direct Dial)'
    };
  }

  return {
    channel: 'EMAIL_ONLY',
    isMobile: false,
    isWhatsAppCapable: false,
    recommendedAction: 'EMAIL_SMTP_DISPATCH',
    label: '📧 Email Direct Outreach'
  };
}

/**
 * Builds the complete multi-channel payload for a lead
 */
export function buildOmnichannelDossier(lead) {
  const publicBase = getPublicBaseUrl();
  const company = lead.company || lead.name || 'Valued Enterprise';
  const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const portalUrl = `${publicBase}/portal/${slug}`;
  const city = lead.city || 'your city';
  const isUSD = lead.currency === 'USD';
  const currencySymbol = isUSD ? '$' : '₹';
  const totalFee = lead.pricingTotal || (isUSD ? 2400 : 15000);
  const milestoneAdvance = lead.pricingAdvance || Math.round(totalFee * 0.5);
  // Micro-tripwire refundable pilot token for 5x-10x higher cold conversion
  const pilotAdvance = isUSD ? 49 : 999;

  const phoneProfile = classifyChannelProfile(lead.phone, lead.country);
  const cleanPhone = phoneProfile.cleanDigits || lead.phone;

  // 1. WhatsApp Rich Text Pitch (Formatted for maximum conversion)
  const whatsappPitch = isUSD
    ? `Hello ${company} Team,\n\n` +
      `This is Vikas Singh from ORION FLUX Autonomous Studio. We noticed your business in ${city} handles customer inquiries, where after-hours leads often slip away.\n\n` +
      `We have deployed a 24/7 AI Client Intake Assistant and 4K CineFlow showcase for ${company}.\n\n` +
      `🔗 Live Demo Portal:\n${portalUrl}\n\n` +
      `⚡ We back this with a 14-Day 100% money-back guarantee on a refundable $${pilotAdvance} pilot token.\n\n` +
      `Direct PayPal / Wire: payments@orionflux.agency\n` +
      `Can we connect for a 2-minute live demo today?\n\n` +
      `[Reply STOP to opt out]`
    : `Namaste ${company} Team 🙏\n\n` +
      `Main Vikas Singh bol raha hoon ORION FLUX Autonomous Studio se.\n` +
      `Maine dekha ki ${city} me aapke business par kaafi customer inquiries aati hain, lekin manual follow-up ki deri se valuable clients drop ho jaate hain.\n\n` +
      `Humne aapke liye 24/7 WhatsApp AI Intake Assistant aur 4K video ads live stage kiya hai:\n\n` +
      `🔗 Live Demo Portal dekhiye:\n${portalUrl}\n\n` +
      `⚡ Flat fee ₹${totalFee.toLocaleString()} (Section 22 Net-Zero Tax Exempt). 14-Day 100% Money-Back Guarantee ke sath sirf ₹${pilotAdvance.toLocaleString()} refundable token par shuru kar sakte hain.\n\n` +
      `Direct UPI ID: 9690973030@ibl (Vikas Singh)\n` +
      `Kya aap 2-minute live demo ke liye available hain?\n\n` +
      `[Reply STOP to opt out • Section 22 CGST Exempt]`;

  // 2. Native SMS (For clients whose cellular number is NOT on WhatsApp — under 160 chars)
  const smsPitch = isUSD
    ? `ORION FLUX: Hi ${company}, your 24/7 AI client intake portal is live: ${portalUrl}. Start with $${pilotAdvance} refundable token. Reply to connect with Vikas.`
    : `ORION FLUX: Namaste ${company}, aapka 24/7 AI WhatsApp intake portal ready hai: ${portalUrl}. Sirf ₹${pilotAdvance} token advance. UPI: 9690973030@ibl. Call/Reply Vikas`;

  // 3. Gatekeeper-Bypass Landline Script (When calling office/clinic front desk)
  const gatekeeperScript = {
    hook: `Namaste, main Vikas Singh bol raha hoon ORION FLUX Autonomous Agency se Director / Dr. ${company} ke office se connected matter ke regarding.`,
    triage: `Unki leadership team ke liye humne ek private 24/7 automated client intake portal live stage kiya hai jo after-hours patient queries ko 60 seconds me book karta hai.`,
    ask: `Kripya mujhe unke direct office extension ya unke personal WhatsApp coordinator se connect karwaiye taaki main unka private portal access share kar sakoon.`,
    rebuttalIfHesitant: `Yeh koi marketing promotional call nahi hai, unka portal link ${portalUrl} already stage ho chuka hai. Unka direct email ya WhatsApp number note karwa dijiye please.`
  };

  // 4. Executive Email Pitch (Google SMTP ready)
  const emailSubject = isUSD
    ? `[Private Staging] 24/7 AI Client Intake & 4K Reel for ${company}`
    : `[Live Portal] 24/7 WhatsApp AI Booking System & 4K Video Ads: ${company}`;

  const emailBody = `Dear ${company} Leadership Team,\n\n` +
    `I am writing to you directly from ORION FLUX Autonomous Global OS.\n\n` +
    `We have engineered an autonomous 24/7 client intake and booking system specifically tailored for ${company} in ${city}.\n\n` +
    `You can inspect your live private staging portal immediately:\n` +
    `👉 ${portalUrl}\n\n` +
    `KEY DELIVERABLES:\n` +
    `1. Sub-2s WhatsApp AI Booking Assistant\n` +
    `2. 4K Retina CineFlow Video Showcase Reel\n` +
    `3. Net-Zero Tax Exemption (Section 22 CGST Act)\n` +
    `4. 14-Day 100% Money-Back Guarantee\n\n` +
    `To initiate production, we require only a refundable ${currencySymbol}${pilotAdvance.toLocaleString()} pilot milestone advance.\n` +
    `Domestic UPI: 9690973030@ibl (Vikas Singh)\n` +
    `International Wire: payments@orionflux.agency\n\n` +
    `Best regards,\n` +
    `Vikas Singh\n` +
    `Founder & Managing Principal\n` +
    `ORION FLUX Autonomous Systems`;

  // Deep Links
  const waUrl = phoneProfile.isWhatsAppCapable
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappPitch)}`
    : null;

  const smsUrl = phoneProfile.isMobile
    ? `sms:${cleanPhone}?body=${encodeURIComponent(smsPitch)}`
    : null;

  const directCallUrl = lead.phone ? `tel:${lead.phone.replace(/[^0-9+]/g, '')}` : null;

  return {
    leadId: lead.id,
    company,
    city,
    country: lead.country,
    phone: lead.phone,
    email: lead.email,
    portalUrl,
    phoneProfile,
    totalFee,
    milestoneAdvance,
    pilotAdvance,
    currencySymbol,
    whatsappPitch,
    smsPitch,
    gatekeeperScript,
    emailSubject,
    emailBody,
    waUrl,
    smsUrl,
    directCallUrl
  };
}

/**
 * Returns prioritized omnichannel queue of all active CRM leads
 */
export function getOmnichannelQueue() {
  const db = getDB();
  const leads = db.data.leads || [];

  const dossiers = leads.map(lead => buildOmnichannelDossier(lead));

  // Sort by highest conversion velocity: Indian Cellular > International Cellular > Landline > Email Only
  return dossiers.sort((a, b) => {
    const score = (d) => {
      if (d.phoneProfile.channel === 'CELLULAR_MOBILE') return 100;
      if (d.phoneProfile.channel === 'INTERNATIONAL_MOBILE') return 80;
      if (d.phoneProfile.channel === 'LANDLINE_OFFICE') return 50;
      if (d.email && !d.email.includes('example.com') && !d.email.includes('_')) return 30;
      return 10;
    };
    return score(b) - score(a);
  });
}

/**
 * Dispatches Email for non-WhatsApp clients via verified Google SMTP
 */
export async function executeEmailFallback(leadId) {
  const db = getDB();
  const lead = (db.data.leads || []).find(l => String(l.id) === String(leadId));

  if (!lead || !lead.email || lead.email.includes('example.com')) {
    throw new Error('Valid verified email address required for email outreach.');
  }

  const dossier = buildOmnichannelDossier(lead);

  const emailResult = await sendRealEmail({
    to: lead.email,
    subject: dossier.emailSubject,
    text: dossier.emailBody
  });

  if (emailResult.delivered) {
    lead.emailSent = true;
    lead.emailSentAt = new Date().toISOString();
    lead.emailMessageId = emailResult.messageId;
    lead.status = 'email_contacted';

    if (!db.data.activities) db.data.activities = [];
    db.data.activities.unshift({
      id: `act-email-${Date.now()}`,
      type: 'email_dispatched_smtp',
      title: `📧 Non-WhatsApp Fallback Email Sent: ${dossier.company}`,
      description: `Dispatched to ${lead.email} via Google SMTP (Message ID: ${emailResult.messageId}). Portal: ${dossier.portalUrl}`,
      timestamp: new Date().toISOString()
    });

    db.save();
  }

  return emailResult;
}
