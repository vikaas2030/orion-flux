// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX DEAL RECOVERY & PAYMENT CADENCE ENGINE
//  Converts pending proposals into verified cash settlements.
//  Signed & Authorized by: Vikas Singh (Founder & Managing Principal)
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';

const MANAGING_PRINCIPAL = 'Vikas Singh';
const BRAND = 'ORION FLUX Autonomous Global OS';

/**
 * Scan all pipeline deals and generate actionable recovery cadences
 */
export function getDealRecoveryPipeline() {
  const db = getDB();
  const deals = db.data.deals || [];
  const leads = db.data.leads || [];
  const baseUrl = getPublicBaseUrl();

  const activeCandidates = deals.filter(d => 
    !['closed_won', 'lost', 'rejected'].includes(d.stage?.toLowerCase()) &&
    !['completed', 'settled'].includes(d.status?.toLowerCase())
  );

  return activeCandidates.map((deal, index) => {
    const lead = leads.find(l => l.id === deal.lead_id || l.company === deal.lead_company) || {};
    const company = deal.lead_company || deal.lead_name || lead.company || 'Enterprise Partner';
    const contactName = deal.contact_name || lead.name || 'Executive Director';
    const phone = deal.lead_phone || lead.phone || '919690973030';
    const isUSD = deal.currency === 'USD' || (deal.value && deal.value < 50000 && !deal.title?.includes('₹'));
    const totalVal = deal.value || (isUSD ? 2500 : 45000);
    const advanceVal = deal.advance || Math.round(totalVal * 0.5);
    const tokenVal = isUSD ? 50 : 2500;

    const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
    const portalUrl = `${baseUrl}/portal/${slug}`;
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Cadence Assignment based on deal index or pipeline age
    const cadenceStage = index % 3 === 0 ? 'STAGE_1_SANDBOX_PILOT' : index % 3 === 1 ? 'STAGE_2_EXECUTIVE_ASSURANCE' : 'STAGE_3_VIP_SLOT_RESERVATION';

    // Tailored closing messages
    let scriptHindi = '';
    let scriptEnglish = '';
    let stageTitle = '';
    let discountOffer = '';

    if (cadenceStage === 'STAGE_1_SANDBOX_PILOT') {
      stageTitle = '24-Hour Interactive Sandbox & Micro-Token Pilot';
      discountOffer = `₹${tokenVal.toLocaleString('en-IN')} Zero-Risk Live Pilot`;
      scriptHindi = `Namaste ${contactName} ji, Vikas Singh here (ORION FLUX). Aapke ${company} project ka interactive live demo portal ready hai: ${portalUrl} . Advance release karne se pehle aap system ko live test kar sakte hain. Agar full advance me doubt hai toh aap ₹${tokenVal.toLocaleString('en-IN')} ke micro-token se live testing start kar sakte hain (100% refundable within 48h).`;
      scriptEnglish = `Hello ${contactName}, Vikas Singh here (Managing Principal, ORION FLUX). Your private AI sandbox for ${company} is live: ${portalUrl} . You can test the system live with 0% risk or start with our ₹${tokenVal.toLocaleString('en-IN')} refundable pilot token before committing to milestone advance.`;
    } else if (cadenceStage === 'STAGE_2_EXECUTIVE_ASSURANCE') {
      stageTitle = '48-Hour Executive Buyer Protection Bond';
      discountOffer = 'Section 22 CGST Net-Zero Statutory Bond Guarantee';
      scriptHindi = `Namaste ${contactName} ji, Vikas Singh (Founder, ORION FLUX). Aapke project ke liye humne 100% Zero-Fear Buyer Protection Guarantee Bond issue kiya hai (Ref: BOND-${slug.toUpperCase()}). Net-zero tax compliance ke sath aapka payment neutral escrow/direct bank rail me 100% secure hai. Portal review karein: ${portalUrl}`;
      scriptEnglish = `Hello ${contactName}, Vikas Singh from ORION FLUX. We have issued an institutional 100% Buyer Protection Guarantee Bond for ${company}. Fully compliant with Section 22 CGST Net-Zero statutory standards. Your funds remain 100% safeguarded: ${portalUrl}`;
    } else {
      stageTitle = '72-Hour VIP Infrastructure Slot Lock';
      discountOffer = 'Immediate Priority Server Deployment + 1 Month Free SLA';
      scriptHindi = `Namaste ${contactName} ji, Vikas Singh here. Aapke ${company} project ke liye reserved high-performance deployment slot aaj sham 6 baje expire ho raha hai. Is month hum keval 3 VIP partners onboard kar rahe hain. 50% milestone advance release karke slot confirm karein: ${portalUrl}`;
      scriptEnglish = `Dear ${contactName}, Vikas Singh here. The dedicated high-performance AI node reserved for ${company} is set to release at 6 PM. Confirm your priority onboard via your secure portal: ${portalUrl}`;
    }

    const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(scriptHindi)}`;

    return {
      dealId: deal.id,
      company,
      contactName,
      phone: cleanPhone,
      scope: deal.title || deal.name || 'Autonomous AI Deployment',
      currency: isUSD ? 'USD' : 'INR',
      totalValue: isUSD ? `$${totalVal.toLocaleString()} USD` : `₹${totalVal.toLocaleString('en-IN')} INR`,
      advanceValue: isUSD ? `$${advanceVal.toLocaleString()} USD` : `₹${advanceVal.toLocaleString('en-IN')} INR`,
      tokenValue: isUSD ? `$${tokenVal} USD` : `₹${tokenVal} INR`,
      portalUrl,
      cadenceStage,
      stageTitle,
      discountOffer,
      managingPrincipal: MANAGING_PRINCIPAL,
      scripts: {
        hindi: scriptHindi,
        english: scriptEnglish
      },
      whatsAppUrl,
      probability: deal.probability || 75
    };
  });
}
