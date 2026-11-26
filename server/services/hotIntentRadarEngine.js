/**
 * ORION FLUX - 60-Second Hot Intent Real-Time Radar Engine (ESM)
 * 
 * Tracks live client engagement on /pay/:slug and /portal/:code in real-time.
 * When a high-ticket prospect views checkout or copies UPI, alerts Vikas Singh instantly
 * with a pre-crafted 1-click WhatsApp nudge & direct phone script.
 */

class HotIntentRadarEngine {
  constructor() {
    this.activeSessions = new Map();
    this.sessionHistory = [];
    this.MAX_HISTORY = 100;
  }

  recordPing({ slug, portalCode, clientName, clientPhone, action, amount, page, userAgent, ip }) {
    const key = slug || portalCode || ip || 'unknown-prospect';
    const now = Date.now();

    const existing = this.activeSessions.get(key) || {
      id: key,
      slug: slug || null,
      portalCode: portalCode || null,
      clientName: clientName || (slug ? this.formatSlugName(slug) : 'High-Value Prospect'),
      clientPhone: clientPhone || this.lookupPhone(slug || portalCode),
      firstSeen: now,
      actions: [],
      amount: amount || 0,
      page: page || '/pay',
      userAgent: userAgent || '',
      ip: ip || 'Edge Node'
    };

    const actionEntry = {
      action: action || 'PAGE_VIEW',
      timestamp: now,
      elapsedSec: 0
    };

    existing.lastSeen = now;
    existing.actions.unshift(actionEntry);
    if (existing.actions.length > 20) existing.actions.pop();
    if (amount) existing.amount = amount;
    if (clientPhone) existing.clientPhone = clientPhone;

    existing.intentScore = this.calculateIntentScore(existing);
    existing.nudgeScript = this.generateWhatsAppNudge(existing);
    existing.phoneScript = this.generatePhoneScript(existing);

    this.activeSessions.set(key, existing);

    this.sessionHistory.unshift({
      id: key,
      clientName: existing.clientName,
      action: action || 'PAGE_VIEW',
      timestamp: now,
      amount: existing.amount
    });
    if (this.sessionHistory.length > this.MAX_HISTORY) {
      this.sessionHistory.pop();
    }

    return existing;
  }

  formatSlugName(slug) {
    const directory = {
      'anuja-clinic': 'Dr. Anuja Singh Clinic (Mumbai)',
      'apex-realty': 'Apex Luxury Realty Group (Mumbai)',
      'smilecraft-dental': 'SmileCraft Dental & Aesthetics (Bangalore)',
      'luxeliving-arch': 'LuxeLiving Bespoke Architecture (Gurgaon)',
      'apollo-diagnostics': 'Apollo Diagnostics Network (Delhi)',
      'apex': 'Apex Global Enterprise',
      'solaris': 'Solaris Tech Solutions',
      'vanguard': 'Vanguard Global Assets'
    };
    return directory[slug] || slug.replace(/-/g, ' ').toUpperCase();
  }

  lookupPhone(identifier) {
    const phones = {
      'anuja-clinic': '+91 98201 44892',
      'apex-realty': '+91 98190 22341',
      'smilecraft-dental': '+91 97412 88301',
      'luxeliving-arch': '+91 99103 77412',
      'apollo-diagnostics': '+91 98114 55902',
      'apex': '+91 98200 11223'
    };
    return phones[identifier] || '+91 96909 73030';
  }

  calculateIntentScore(session) {
    let score = 40;
    const actions = session.actions.map(a => a.action);

    if (actions.includes('SUBMIT_UTR_ATTEMPT')) score += 50;
    if (actions.includes('COPY_UPI')) score += 30;
    if (actions.includes('VIEW_QR')) score += 25;
    if (actions.includes('SELECT_ADVANCE_50')) score += 20;
    if (actions.includes('SELECT_PILOT')) score += 15;
    if (actions.includes('DOWNLOAD_INVOICE')) score += 20;
    if (actions.includes('SIMULATE_ROI')) score += 15;
    if (session.actions.length > 5) score += 10;

    return Math.min(100, score);
  }

  generateWhatsAppNudge(session) {
    let name = 'Partner';
    if (session.clientName) {
      const parts = session.clientName.split(' ');
      if (parts[0].toLowerCase().startsWith('dr') && parts.length > 1) {
        name = `${parts[0]} ${parts[1]}`;
      } else {
        name = parts[0];
      }
    }
    
    let contextHook = "reviewing the Orion Flux deployment agreement and payment details right now.";
    const latestAction = session.actions[0]?.action;

    if (latestAction === 'COPY_UPI') {
      contextHook = "copying our official UPI ID (9690973030@ibl) for the advance settlement.";
    } else if (latestAction === 'VIEW_QR') {
      contextHook = "scanning the official Orion Flux UPI QR code for deployment booking.";
    } else if (latestAction === 'SELECT_PILOT') {
      contextHook = "evaluating the 48-Hour Rapid Pilot sprint option.";
    }

    const message = `Namaste ${name}! Vikas Singh here (Founder & Managing Principal, Orion Flux).

I noticed you are currently ${contextHook}

To make sure your deployment kicks off today without any queue delay:
• Official Settlement UPI: 9690973030@ibl (Vikas Singh)
• Statutory Status: Zero-Tax Exempt under Sec 22 CGST Act
• 100% Risk-Free: Instant refund guarantee if initial milestone is not met.

Would you like me to share the direct GPay / PhonePe quick link or answer any quick technical questions over a 2-minute call?

Warm regards,
Vikas Singh | Managing Principal, Orion Flux
📞 +91 96909 73030`;

    const encodedText = encodeURIComponent(message);
    const cleanPhone = (session.clientPhone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    return {
      message,
      waUrl,
      cleanPhone
    };
  }

  generatePhoneScript(session) {
    let name = 'Partner';
    if (session.clientName) {
      const parts = session.clientName.split(' ');
      if (parts[0].toLowerCase().startsWith('dr') && parts.length > 1) {
        name = `${parts[0]} ${parts[1]}`;
      } else {
        name = parts[0];
      }
    }
    return {
      caller: "Vikas Singh (Founder & Managing Principal)",
      duration: "90 Seconds",
      objective: "Eliminate hesitation, confirm 50% advance / ₹2,500 pilot to 9690973030@ibl, start work today.",
      scriptSections: [
        {
          step: "1. The Opening Hook (0-15s)",
          hindi: `"Namaste ${name} ji, Vikas Singh baat kar raha hoon — Orion Flux se. Mujhe system radar par alert mila ki aap abhi hamara deployment contract aur payment portal review kar rahe the. Maine socha direct connect kar loon taaki aapka time save ho."`,
          english: `"Namaste ${name}, this is Vikas Singh — Founder of Orion Flux. Our live telemetry notified me that you're reviewing our deployment portal right now, so I wanted to personally reach out to make sure your questions are answered immediately."`
        },
        {
          step: "2. The Hesitation Breaker & Guarantee (15-45s)",
          hindi: `"Aapko poora amount ek sath dene ki zaroorat nahi hai. Hum Section 22 CGST certified hain aur 100% money-back guarantee dete hain. Agar aap chahein toh abhi keval 50% advance (ya ₹2,500 pilot) 9690973030@ibl par UPI se initiate kar dijiye — hamari engineering team aaj sham se hi aapka production setup start kar degi."`,
          english: `"You do not need to commit the full project fee upfront. We operate under Section 22 CGST tax-exemption with a 100% milestone guarantee. You can simply initiate the 50% advance or even the ₹2,500 rapid pilot directly to my UPI (9690973030@ibl) and our team starts building today."`
        },
        {
          step: "3. Direct Closing Ask (45-75s)",
          hindi: `"Kya main aapke WhatsApp par direct PhonePe/GPay link drop kar doon, ya aap portal par direct scan karke 12-digit UTR enter kar rahe hain?"`,
          english: `"Should I ping the direct GPay/PhonePe one-tap link on your WhatsApp right now, or will you scan the QR directly on the checkout screen?"`
        },
        {
          step: "4. The Closing Confirmation (75-90s)",
          hindi: `"Jaise hi aap transfer karenge, hamara portal instantly digitally signed GST-exempt receipt aur client dashboard credentials issue kar dega. Dhanyawad!"`,
          english: `"The moment the UTR is submitted, our automated gateway reconciles and generates your digitally-signed receipt with client workspace credentials. Looking forward to partnering!"`
        }
      ]
    };
  }

  getLiveRadar() {
    const now = Date.now();
    const threshold = 15 * 60 * 1000;
    const live = [];

    for (const [key, session] of this.activeSessions.entries()) {
      const elapsedMs = now - session.lastSeen;
      if (elapsedMs <= threshold) {
        live.push({
          ...session,
          elapsedSeconds: Math.floor(elapsedMs / 1000),
          isHotNow: elapsedMs <= 120 * 1000
        });
      }
    }

    live.sort((a, b) => b.lastSeen - a.lastSeen);

    const fallbackProspects = [
      {
        id: 'anuja-clinic',
        slug: 'anuja-clinic',
        clientName: 'Dr. Anuja Singh Clinic (Mumbai)',
        clientPhone: '+91 98201 44892',
        page: '/pay/anuja-clinic',
        amount: 12500,
        intentScore: 92,
        lastSeen: now - 45 * 1000,
        elapsedSeconds: 45,
        isHotNow: true,
        actions: [
          { action: 'VIEW_QR', timestamp: now - 45 * 1000 },
          { action: 'SELECT_ADVANCE_50', timestamp: now - 90 * 1000 },
          { action: 'PAGE_VIEW', timestamp: now - 120 * 1000 }
        ]
      },
      {
        id: 'apex-realty',
        slug: 'apex-realty',
        clientName: 'Apex Luxury Realty Group (Mumbai)',
        clientPhone: '+91 98190 22341',
        page: '/pay/apex-realty',
        amount: 22500,
        intentScore: 88,
        lastSeen: now - 180 * 1000,
        elapsedSeconds: 180,
        isHotNow: false,
        actions: [
          { action: 'COPY_UPI', timestamp: now - 180 * 1000 },
          { action: 'PAGE_VIEW', timestamp: now - 240 * 1000 }
        ]
      },
      {
        id: 'smilecraft-dental',
        slug: 'smilecraft-dental',
        clientName: 'SmileCraft Dental & Aesthetics (Bangalore)',
        clientPhone: '+91 97412 88301',
        page: '/pay/smilecraft-dental',
        amount: 10000,
        intentScore: 85,
        lastSeen: now - 340 * 1000,
        elapsedSeconds: 340,
        isHotNow: false,
        actions: [
          { action: 'SELECT_PILOT', timestamp: now - 340 * 1000 },
          { action: 'PAGE_VIEW', timestamp: now - 400 * 1000 }
        ]
      }
    ].map(p => ({
      ...p,
      nudgeScript: this.generateWhatsAppNudge(p),
      phoneScript: this.generatePhoneScript(p)
    }));

    return {
      activeCount: live.length > 0 ? live.length : fallbackProspects.length,
      sessions: live.length > 0 ? live : fallbackProspects,
      isSimulated: live.length === 0,
      timestamp: now,
      settlementUpi: '9690973030@ibl',
      beneficiary: 'Vikas Singh (Founder & Managing Principal)'
    };
  }
}

const hotIntentRadarEngine = new HotIntentRadarEngine();
export default hotIntentRadarEngine;
