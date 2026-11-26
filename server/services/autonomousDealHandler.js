import { getDB } from '../config/database.js';

export const OBJECTION_SCRIPTS = {
  PRICE_RESISTANCE: {
    intent: 'Price Resistance / Asking Discount',
    strategy: 'Value Anchoring & High ROI Framing',
    generateReply: (clientName, businessName, fee, advance, upiId) => `Completely understand your point, ${clientName || 'ji'}! 

Lekin is tarah sochiye: Hamara ₹${fee.toLocaleString()} ka package aapke liye kharcha nahi, balki investment hai. Agar hamara automated system aapke ${businessName || 'business'} ke liye mahine me sirf 2 ya 3 naye clients bhi book kar deta hai, to aapki poori investment pehle hi hafte me 3x recover ho jayegi!

Aur aapke trust ke liye: Hum 14-Day Zero-Risk Performance Guarantee dete hain. Agar aapko value na mile, to advance wapas.

Setup shuru karne ke liye sirf 50% advance token (₹${advance.toLocaleString()}) lagta hai.
Direct UPI: ${upiId}
Payment karke screenshot share karein, hum turant kaam shuru kar denge!`
  },

  PORTFOLIO_PROOF: {
    intent: 'Proof of Work / Requesting Sample',
    strategy: 'Live Deliverable Proof & Quality Assurance',
    generateReply: (clientName, businessName, fee, advance, upiId) => `Bilkul sahi sawaal hai, ${clientName || 'ji'}! Kaam dekh kar hi vishwas hota hai.

Humne hamare Deliverables Vault me already aapke niche ke high-retention 1080p sample video ads aur verified automated WhatsApp flows ready rakhe hain. 

Aap hamare portfolio deliverable ko direct review kar sakte hain. Saath hi, hum delivery se pehle 100% Bug-Free Quality Assurance aur 2-hour rapid revision guarantee contract me sign karke dete hain.

Package shuru karne ke liye 50% advance token: ₹${advance.toLocaleString()} (UPI: ${upiId}).
Kya hum aaj onboarding process complete karein?`
  },

  TRUST_ADVANCE: {
    intent: 'Advance Hesitation / Trust Concerns',
    strategy: 'Legally-Compliant Security & Refund Assurance',
    generateReply: (clientName, businessName, fee, advance, upiId) => `Aapka concern bilkul valid hai, ${clientName || 'ji'}. Market me trust sabse zaroori hai.

Hamari agency standard corporate protocol follow karti hai:
1. Advance lene se pehle hum official Tax Invoice & Statement of Work issue karte hain.
2. Hamara UPI ID (${upiId}) verified bank account se linked hai.
3. Hamara 14-Day 100% Refund Guarantee rehta hai agar agreed scope deliver na ho.

Advance token (₹${advance.toLocaleString()}) sirf server allocation aur initial setup queue reserve karne ke liye hai.
Aap yahan direct UPI pay kar sakte hain: ${upiId}
Payment ke 10 minute me aapko official invoice aur welcome receipt mil jayega.`
  },

  TIMELINE_URGENCY: {
    intent: 'Delivery Timeline / Fast Delivery Request',
    strategy: 'HyperSpeed 24-48 Hour Turnaround SLA',
    generateReply: (clientName, businessName, fee, advance, upiId) => `Hum HyperSpeed Turnaround follow karte hain, ${clientName || 'ji'}!

Aapka complete setup 24 se 48 ghante ke andar live kar diya jayega:
- Day 1: System architecture setup & script finalization
- Day 2: WhatsApp bot / Video assets live testing & client handover

Hamari team aaj hi setup queue start kar sakti hai jaise hi ₹${advance.toLocaleString()} ka token advance receive hota hai.
Direct UPI: ${upiId}
Aapka payment aate hi technical team instant start kar degi!`
  },

  READY_TO_BUY: {
    intent: 'Ready to Pay / Asking Payment Details',
    strategy: 'Instant UPI Payment Rail & Instant Confirmation',
    generateReply: (clientName, businessName, fee, advance, upiId) => `Awesome ${clientName || 'ji'}! Welcome to ORION FLUX Agency.

Aapka 50% advance token ₹${advance.toLocaleString()} hai.
Yahan direct UPI details hain:
UPI ID: ${upiId}
Pay Link: upi://pay?pa=${upiId}&pn=ORION_FLUX&am=${advance}&cu=INR

Google Pay, PhonePe ya Paytm se scan/pay karke UTR transaction number yahan share karein. Hum 5 minute me kickoff confirmation bhejte hain!`
  }
};

export function classifyClientMessage(message = '') {
  const m = message.toLowerCase();

  if (m.includes('pay') || m.includes('account') || m.includes('upi') || m.includes('scanner') || m.includes('qr') || m.includes('kahan bheju') || m.includes('payment')) {
    return 'READY_TO_BUY';
  }
  if (m.includes('price') || m.includes('kam') || m.includes('discount') || m.includes('mehenga') || m.includes('expensive') || m.includes('budget') || m.includes('paisa')) {
    return 'PRICE_RESISTANCE';
  }
  if (m.includes('sample') || m.includes('proof') || m.includes('kaam') || m.includes('portfolio') || m.includes('dekha') || m.includes('result')) {
    return 'PORTFOLIO_PROOF';
  }
  if (m.includes('advance') || m.includes('pehle') || m.includes('fraud') || m.includes('trust') || m.includes('bharosa') || m.includes('guarantee')) {
    return 'TRUST_ADVANCE';
  }
  if (m.includes('kitne din') || m.includes('kab') || m.includes('time') || m.includes('urgent') || m.includes('fast') || m.includes('delivery')) {
    return 'TIMELINE_URGENCY';
  }

  // Default to price/value if generic
  return 'PRICE_RESISTANCE';
}

export function handleClientInquiry({
  clientName = 'Client',
  clientPhone = '',
  businessName = 'Business',
  clientMessage = '',
  dealValue = 7500,
  advanceFee = 2500,
  overrideIntent = null
}) {
  const db = getDB();
  const upiId = db.data.settings?.upi_id || '9690973030@ibl';

  const intentKey = overrideIntent || classifyClientMessage(clientMessage);
  const scriptObj = OBJECTION_SCRIPTS[intentKey] || OBJECTION_SCRIPTS.PRICE_RESISTANCE;

  const fee = parseFloat(dealValue) || 7500;
  const advance = parseFloat(advanceFee) || Math.round(fee * 0.4);

  const aiReply = scriptObj.generateReply(clientName, businessName, fee, advance, upiId);

  const cleanPhone = clientPhone.replace(/\D/g, '').slice(-10);
  const whatsappUrl = cleanPhone 
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(aiReply)}`
    : null;

  // Auto-record negotiation in CRM deals
  if (db.data.deals) {
    let existingDeal = db.data.deals.find(d => 
      (d.phone && cleanPhone && d.phone.includes(cleanPhone)) ||
      (d.lead_company && d.lead_company.toLowerCase() === businessName.toLowerCase())
    );

    if (existingDeal) {
      existingDeal.stage = intentKey === 'READY_TO_BUY' ? 'proposal' : 'negotiation';
      existingDeal.notes = `Autonomous AI Handled: ${scriptObj.intent}. Client: "${clientMessage.substring(0, 80)}"`;
      db.save();
    } else {
      db.data.deals.unshift({
        id: Date.now(),
        title: `${businessName} - Automation & AI Services`,
        lead_name: clientName,
        lead_company: businessName,
        phone: cleanPhone,
        value: fee,
        stage: intentKey === 'READY_TO_BUY' ? 'proposal' : 'negotiation',
        probability: intentKey === 'READY_TO_BUY' ? 85 : 65,
        currency: 'INR',
        notes: `AI Handled: ${scriptObj.intent}`,
        created_at: new Date().toISOString()
      });
      db.save();
    }
  }

  return {
    success: true,
    intentDetected: intentKey,
    intentName: scriptObj.intent,
    strategy: scriptObj.strategy,
    clientName,
    businessName,
    aiReply,
    whatsappUrl,
    advanceExpected: advance,
    totalFee: fee,
    upiId
  };
}
