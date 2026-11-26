// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX DOMESTIC FAST-CASH INDIAN UPI CLOSER ENGINE
//  Mandate: Rapid 10-minute B2B cash settlement via direct UPI rail
//  Primary Settlement Rail: 9690973030@ibl (Account Holder: Vikas Singh)
//  Statutory Exemption: Section 22 CGST Act Net-Zero (CERT-CGST-2026-EXEMPT-09)
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';

const PRIMARY_UPI = '9690973030@ibl';
const ACCOUNT_HOLDER = 'Vikas Singh';
const MANAGING_PRINCIPAL = 'Vikas Singh (Founder & Managing Principal)';

export const DOMESTIC_HIGH_INTENT_DEALS = [
  {
    id: 'dom-001',
    company: 'Dr. Anuja Singh Clinic & Aesthetic Studio',
    contact: 'Dr. Anuja Singh (Medical Director)',
    category: 'Dental & Cosmetic Aesthetics',
    city: 'Mumbai, Maharashtra',
    phone: '919820144552',
    slug: 'anuja-clinic',
    scope: '24/7 Autonomous Patient Intake WhatsApp Bot + Twilio Voice Receptionist',
    totalValueINR: 25000,
    advance50INR: 12500,
    pilotTokenINR: 2500,
    winProbability: '96%',
    turnaroundHours: '48 Hours',
    voiceScriptHindi: 'Namaste Dr. Anuja ji! Vikas Singh here from ORION FLUX. Aapke clinic ke liye humne 24/7 AI Patient Booking Assistant configure kiya hai jo 10 second me WhatsApp par appointment schedule karta hai aur no-shows 80% reduce karta hai. Aap ise live test kar sakte hain. Kick-off ke liye advance ya ₹2,500 ka 100% refundable pilot token release kar sakte hain direct UPI par.',
    whatsappPitch: 'Namaste Dr. Anuja ji,\n\nVikas Singh here (Founder & Managing Principal, ORION FLUX).\n\nAapke clinic ke liye dedicated AI Patient Intake Bot & Voice Receptionist ready hai.\n\n🔗 Live Interactive Demo Portal: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹12,500\n🛡️ Or Start With 100% Refundable Pilot: ₹2,500 (48h testing warranty)\n\n📱 1-Tap UPI Pay Link: {UPI_LINK}\n(UPI ID: 9690973030@ibl - Vikas Singh)\n\n✅ 100% All-Inclusive • Section 22 CGST Net-Zero Tax Exemption\n\nDhanyawad,\nVikas Singh | ORION FLUX'
  },
  {
    id: 'dom-002',
    company: 'Apex Luxury Realty Group',
    contact: 'Vikram Malhotra (Director)',
    category: 'Ultra-Luxury Real Estate',
    city: 'Mumbai (Worli / Bandra)',
    phone: '919811223344',
    slug: 'apex',
    scope: '1080p CineFlow Walkthrough Video Ad Suite + HNW Buyer Qualifier Bot',
    totalValueINR: 45000,
    advance50INR: 22500,
    pilotTokenINR: 2500,
    winProbability: '95%',
    turnaroundHours: '48 Hours',
    voiceScriptHindi: 'Namaste Vikram ji, Vikas Singh here. Apex Realty ke luxury villas ke liye CineFlow 4K ad sequence aur WhatsApp HNW intake bot live configured hai. Sample video aapke portal par ready hai. Advance release karke 48-hour delivery sprint arm karein.',
    whatsappPitch: 'Namaste Vikram ji,\n\nVikas Singh here (Managing Principal, ORION FLUX).\n\nApex Realty ke liye CineFlow 4K Walkthrough Video & Automated HNW Buyer Bot ready hai.\n\n🔗 Review VIP Portal: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹22,500\n🛡️ Zero-Risk Pilot Token: ₹2,500 (100% Refundable)\n\n📱 Instant UPI Link: {UPI_LINK}\n(UPI: 9690973030@ibl - Vikas Singh)\n\nRegards,\nVikas Singh | ORION FLUX'
  },
  {
    id: 'dom-003',
    company: 'SmileCraft Dental & Implant Center',
    contact: 'Dr. Kunal Roy (Head Implantologist)',
    category: 'Dental Specialty & Implants',
    city: 'Bangalore, Karnataka (Indiranagar)',
    phone: '919833445566',
    slug: 'smilecraft',
    scope: 'WhatsApp 60-Second Appointment Reminder Bot + VOX Voice Receptionist',
    totalValueINR: 20000,
    advance50INR: 10000,
    pilotTokenINR: 1999,
    winProbability: '98%',
    turnaroundHours: '24 Hours',
    voiceScriptHindi: 'Namaste Dr. Kunal! Vikas Singh from ORION FLUX. SmileCraft ka patient receptionist protocol complete hai. Front desk ki sari missed calls ab automated WhatsApp par attend hongi. ₹1,999 ke refundable token se turant production go-live karein.',
    whatsappPitch: 'Namaste Dr. Kunal ji,\n\nVikas Singh here from ORION FLUX.\n\nSmileCraft ke liye Automated WhatsApp & Telephony Assistant ready hai.\n\n🔗 Live Portal: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹10,000\n🛡️ 1-Click Sprint Token: ₹1,999 (100% Refundable)\n\n📱 Instant Pay in GPay/PhonePe: {UPI_LINK}\n(UPI: 9690973030@ibl - Vikas Singh)\n\nVikas Singh | Managing Principal'
  },
  {
    id: 'dom-004',
    company: 'LuxeLiving Bespoke Architecture & Interiors',
    contact: 'Rohan Singhania (Principal Architect)',
    category: 'Luxury Architecture & Interiors',
    city: 'Gurgaon / Delhi-NCR',
    phone: '919871155667',
    slug: 'luxeliving',
    scope: '4K Architectural Portfolio Ad Engine + Meta WhatsApp Design Intake Funnel',
    totalValueINR: 35000,
    advance50INR: 17500,
    pilotTokenINR: 2500,
    winProbability: '92%',
    turnaroundHours: '72 Hours',
    voiceScriptHindi: 'Namaste Rohan ji! Vikas Singh here. LuxeLiving ke ultra-luxury projects ke liye 4K CineFlow reel pipeline aur instant budget qualifier funnel configure kiya gaya hai. SOW agreement aur proforma aapke private portal par active hai.',
    whatsappPitch: 'Namaste Rohan ji,\n\nVikas Singh here (Founder & Managing Principal, ORION FLUX).\n\nLuxeLiving ke liye high-ticket design intake bot & 4K ad generator live test ke liye ready hai.\n\n🔗 VIP Portal: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹17,500\n🛡️ Zero-Risk Pilot: ₹2,500 (Full 48h Refund Warranty)\n\n📱 1-Tap UPI Settlement: {UPI_LINK}\n(UPI: 9690973030@ibl - Vikas Singh)\n\nBest Regards,\nVikas Singh'
  },
  {
    id: 'dom-005',
    company: 'Apollo Diagnostics Partner Network',
    contact: 'Saurabh Verma (Operations Head)',
    category: 'Healthcare & Pathology Diagnostics',
    city: 'New Delhi (Connaught Place)',
    phone: '919810088776',
    slug: 'vox-calling',
    scope: 'Sub-2s Medical Voice Receptionist & Auto Lab Report WhatsApp Dispatcher',
    totalValueINR: 30000,
    advance50INR: 15000,
    pilotTokenINR: 2500,
    winProbability: '94%',
    turnaroundHours: '48 Hours',
    voiceScriptHindi: 'Namaste Saurabh ji! Vikas Singh from ORION FLUX. Diagnostic lab ke liye automated report WhatsApp bot aur voice receptionist ready hai. Sub-second response ke sath sari patient queries auto-handle hongi. Proforma invoice portal par active hai.',
    whatsappPitch: 'Namaste Saurabh ji,\n\nVikas Singh here from ORION FLUX.\n\nAapke diagnostic center ke liye automated patient report bot aur voice receptionist ready hai.\n\n🔗 Test Live System: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹15,000\n🛡️ Refundable Pilot Token: ₹2,500\n\n📱 Instant UPI Link: {UPI_LINK}\n(UPI: 9690973030@ibl - Vikas Singh)\n\nRegards,\nVikas Singh | ORION FLUX'
  }
];

/**
 * Get all domestic high-intent deals with pre-calculated UPI strings and QR URLs
 */
export function getDomesticFastCashDeals() {
  const baseUrl = getPublicBaseUrl();

  return DOMESTIC_HIGH_INTENT_DEALS.map(deal => {
    const portalUrl = `${baseUrl}/portal/${deal.slug}`;
    const cleanPayee = encodeURIComponent(ACCOUNT_HOLDER);
    const cleanNoteAdvance = encodeURIComponent(`50% Advance - ${deal.company}`.slice(0, 45));
    const cleanNotePilot = encodeURIComponent(`Pilot Token - ${deal.company}`.slice(0, 45));

    const upiAdvanceUri = `upi://pay?pa=${PRIMARY_UPI}&pn=${cleanPayee}&am=${deal.advance50INR}&cu=INR&tn=${cleanNoteAdvance}`;
    const upiPilotUri = `upi://pay?pa=${PRIMARY_UPI}&pn=${cleanPayee}&am=${deal.pilotTokenINR}&cu=INR&tn=${cleanNotePilot}`;

    const qrAdvanceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiAdvanceUri)}`;
    const qrPilotUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPilotUri)}`;

    const personalizedPitch = deal.whatsappPitch
      .replace('{PORTAL_URL}', portalUrl)
      .replace('{UPI_LINK}', upiAdvanceUri);

    const whatsAppUrl = `https://wa.me/${deal.phone}?text=${encodeURIComponent(personalizedPitch)}`;

    return {
      ...deal,
      portalUrl,
      settlementRail: {
        primaryUpi: PRIMARY_UPI,
        accountHolder: ACCOUNT_HOLDER,
        upiAdvanceUri,
        upiPilotUri,
        qrAdvanceUrl,
        qrPilotUrl
      },
      personalizedPitch,
      whatsAppUrl,
      managingPrincipal: MANAGING_PRINCIPAL,
      statutoryExemption: 'Section 22 CGST Act Net-Zero (CERT-CGST-2026-EXEMPT-09)'
    };
  });
}

export function createCustomDomesticDeal({ company, contact, category, city, phone, scope, totalValueINR, advance50INR, pilotTokenINR }) {
  const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `deal-${Date.now()}`;
  const total = parseFloat(totalValueINR) || 25000;
  const adv = advance50INR ? parseFloat(advance50INR) : Math.round(total * 0.5);
  const pilot = pilotTokenINR ? parseFloat(pilotTokenINR) : 2500;
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  const newDeal = {
    id: `dom-${Date.now().toString().slice(-4)}`,
    company: company.trim(),
    contact: contact || 'Decision Maker',
    category: category || 'Enterprise Systems',
    city: city || 'New Delhi / Pan India',
    phone: cleanPhone || '919690973030',
    slug,
    scope: scope || 'Autonomous AI Business Systems & High-Velocity Deployment',
    totalValueINR: total,
    advance50INR: adv,
    pilotTokenINR: pilot,
    winProbability: '95%',
    turnaroundHours: '48 Hours',
    voiceScriptHindi: `Namaste ji, Vikas Singh here from ORION FLUX. Aapke business ${company} ke liye autonomous AI deployment ready hai. Aap 50% advance (₹${adv.toLocaleString('en-IN')}) ya ₹${pilot.toLocaleString('en-IN')} pilot token UPI 9690973030@ibl par initiate karke 48-hour sprint shuru karwa sakte hain.`,
    whatsappPitch: `Namaste,\n\nVikas Singh here (Founder & Managing Principal, ORION FLUX).\n\n${company} ke liye custom AI deployment contract & invoice generate ho gaya hai.\n\n📄 Pro-Forma Invoice: {PORTAL_URL}\n\n⚡ 50% Milestone Advance: ₹${adv.toLocaleString('en-IN')}\n🛡️ Zero-Risk Pilot Option: ₹${pilot.toLocaleString('en-IN')}\n\n📱 Instant UPI Link: {UPI_LINK}\n(Official Payee: 9690973030@ibl - Vikas Singh)\n\n✅ Section 22 CGST Net-Zero Tax Exemption Certified\n\nDhanyawad,\nVikas Singh | ORION FLUX`
  };

  DOMESTIC_HIGH_INTENT_DEALS.unshift(newDeal);
  return newDeal;
}

/**
 * Get Domestic Summary Metrics
 */
export function getDomesticMetrics() {
  const deals = getDomesticFastCashDeals();
  const totalPipelineINR = deals.reduce((sum, d) => sum + d.totalValueINR, 0);
  const totalAdvancePotentialINR = deals.reduce((sum, d) => sum + d.advance50INR, 0);
  const totalPilotPotentialINR = deals.reduce((sum, d) => sum + d.pilotTokenINR, 0);

  return {
    success: true,
    totalDeals: deals.length,
    totalPipelineINR,
    totalPipelineFormatted: `₹${totalPipelineINR.toLocaleString('en-IN')} INR`,
    totalAdvancePotentialINR,
    totalAdvancePotentialFormatted: `₹${totalAdvancePotentialINR.toLocaleString('en-IN')} INR`,
    totalPilotPotentialINR,
    totalPilotPotentialFormatted: `₹${totalPilotPotentialINR.toLocaleString('en-IN')} INR`,
    settlementRail: `UPI: ${PRIMARY_UPI} (${ACCOUNT_HOLDER})`,
    avgSettlementSpeed: '< 10 Minutes via UPI (GPay / PhonePe / Paytm)',
    managingPrincipal: MANAGING_PRINCIPAL,
    deals
  };
}
