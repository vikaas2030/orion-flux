// ═════════════════════════════════════════════════════════════════════
//  AUTONOMOUS GLOBAL PROMOTION & VIRAL MARKETING ENGINE
//  Mandate: Autonomously promote ORION FLUX 3.0 worldwide, drive organic
//  and outbound traffic, broadcast viral hooks, and acquire paying clients.
//  Chief Promoter: Vikas Singh | Authorized Settlement: UPI 9690973030@ibl
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';
import { sendRealEmail, sanitizeEmail } from './emailDispatcher.js';
import { dispatchHighOpenEmail } from './highOpenRateEngine.js';

const PRIMARY_UPI = '9690973030@ibl';
const FOUNDER_NAME = 'Vikas Singh';
const SENDER_EMAIL = 'vikaas2030@gmail.com';

/**
 * Generates comprehensive multi-channel promotional campaigns
 */
export function getViralMarketingCampaigns() {
  const publicBase = getPublicBaseUrl();
  const storeUrl = `${publicBase}/store`;
  const portalUrl = `${publicBase}/portal`;

  // ── CAMPAIGN 1: SHORT-FORM VIDEO SCRIPTS (Instagram Reels & YouTube Shorts) ──
  const videoReelsScripts = [
    {
      id: 'reel_001',
      title: 'How I Built an Autonomous Agency That Makes ₹1,00,000/Mo',
      platform: 'Instagram Reels / YouTube Shorts',
      estimatedDuration: '45 seconds',
      hookText: 'Stop selling your time by the hour. Here is how I automated an entire agency with AI and Node.js.',
      visualNotes: 'Start with screen recording of terminal and live incoming UPI payment alerts. Show dashboard on laptop.',
      script: `[0-3s HOOK]: If you are still cold-calling clients for 10 hours a day, stop scrolling right now.
[3-15s VALUE]: This is ORION FLUX. It is an autonomous operating system that hunts verified business leads, stages 24/7 AI WhatsApp intake bots, and issues Section 16 IGST tax invoices completely on autopilot.
[15-30s PROOF]: When a clinic or real estate broker visits their private VIP portal, the system automatically demonstrates their working system in under 20 seconds.
[30-45s CTA]: I packaged our entire source code, our 5,000+ verified lead datasets, and turnkey WhatsApp scripts on our live digital store starting from just ₹499.
Link is in my bio — go check it out before the price increases!`,
      ctaUrl: storeUrl
    },
    {
      id: 'reel_002',
      title: 'The ₹50,000 Clinic Mistake (And the 60s WhatsApp Fix)',
      platform: 'Instagram Reels / YouTube Shorts',
      estimatedDuration: '30 seconds',
      hookText: 'Most dental and healthcare clinics lose ₹50,000 every single month from one simple mistake.',
      visualNotes: 'Show split screen: Left side = missed phone call; Right side = instant automated WhatsApp appointment booking bot.',
      script: `[0-3s HOOK]: 60% of clinic patients never book an appointment if no one answers within 5 minutes.
[3-15s THE FIX]: We built an autonomous WhatsApp triage assistant that answers patients in 15 seconds, schedules consultations, and collects advance deposits 24/7.
[15-30s CTA]: You can test your clinic's live demo today with a 100% refundable ₹999 pilot token.
Comment "BOT" or visit the link in bio for instant setup!`,
      ctaUrl: storeUrl
    },
    {
      id: 'reel_003',
      title: '5,000 Verified B2B Leads for Less Than a Pizza (₹499)',
      platform: 'Instagram Reels / YouTube Shorts',
      estimatedDuration: '30 seconds',
      hookText: 'Need high-ticket clients in Delhi-NCR or Mumbai? Here is the exact dataset we use.',
      visualNotes: 'Scroll through clean CSV file showing verified mobile numbers, names, and company domains.',
      script: `[0-3s HOOK]: Stop buying fake email lists that bounce 80% of the time.
[3-15s VALUE]: We cleaned and verified 5,000+ real estate brokers, HNW investors, and luxury business owners across Delhi, Gurgaon, Noida, and Pune. 100% WhatsApp-ready mobile numbers.
[15-30s CTA]: Available right now on our live store for just ₹499 with instant CSV download.
Hit the link in bio to grab your copy right now!`,
      ctaUrl: storeUrl
    }
  ];

  // ── CAMPAIGN 2: LINKEDIN B2B THOUGHT LEADERSHIP POSTS ──────────────
  const linkedInCampaigns = [
    {
      id: 'li_001',
      title: 'Why AI Agencies are Replacing Traditional 10-Person Teams',
      preview: 'Traditional agencies burn ₹3,00,000/mo on salaries just to do manual follow-ups...',
      fullText: `Traditional B2B agencies burn ₹3,00,000 to ₹5,00,000 a month on payroll just to do manual lead generation, follow-ups, and milestone tracking.

At ORION FLUX, we tested a radically different model:
An autonomous operating system that runs 24x7:

✅ Verified Lead Discovery across Indian & Global Metros
✅ Sub-2s WhatsApp Patient & Customer Triage Bots
✅ 4-Layer Cryptographic QA Certification (Zero bugs guaranteed)
✅ Reverse-Risk Micro-Tokens (₹999 / $49 refundable deposit protocol)
✅ Automated Section 16 IGST / Section 22 CGST Tax Invoicing

The result?
Deals close in 15–20 days instead of 3 months because client hesitation is reduced to zero.

Explore our live Digital Store & Client VIP Portals:
🔗 Store: ${storeUrl}
🔗 Live Work: ${portalUrl}

Founder: Vikas Singh | Managing Principal, ORION FLUX
Direct WhatsApp: +91-9690973030 | UPI: ${PRIMARY_UPI}`,
      intentUrl: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
        `Traditional B2B agencies burn ₹3,00,000 to ₹5,00,000 a month on payroll just to do manual lead generation, follow-ups, and milestone tracking.\n\nAt ORION FLUX, we tested a radically different model:\nAn autonomous operating system that runs 24x7:\n\n✅ Verified Lead Discovery across Indian & Global Metros\n✅ Sub-2s WhatsApp Patient & Customer Triage Bots\n✅ 4-Layer Cryptographic QA Certification (Zero bugs guaranteed)\n✅ Reverse-Risk Micro-Tokens (₹999 / $49 refundable deposit protocol)\n✅ Automated Section 16 IGST / Section 22 CGST Tax Invoicing\n\nThe result? Deals close in 15–20 days instead of 3 months because client hesitation is reduced to zero.\n\nExplore our live Digital Store & Client VIP Portals:\n🔗 Store: ${storeUrl}\n🔗 Live Work: ${portalUrl}\n\nFounder: Vikas Singh | Managing Principal, ORION FLUX\nDirect WhatsApp: +91-9690973030 | UPI: ${PRIMARY_UPI}`
      )}`
    }
  ];

  // ── CAMPAIGN 3: TWITTER / X VIRAL MEGA-THREADS ─────────────────────
  const twitterCampaigns = [
    {
      id: 'tw_001',
      title: 'Building an Autonomous $10k/Mo Agency in Public',
      tweet1: `1/7 🚀 How I automated my entire B2B Agency to run 24x7 without a single employee.

Here is the exact architecture, stack, and how we deliver real client results: 🧵👇`,
      tweet2: `2/7 The Problem:
90% of local businesses lose 60% of inquiries because their front desk takes >5 minutes to reply.

The Fix:
A 24/7 autonomous WhatsApp bot that responds in 15 seconds, qualifies the lead, and books the slot.`,
      tweet3: `3/7 The Stack:
• Node.js v24 + Express ESM
• Anthropic Claude 3.5 Multi-Agent Swarms (Legal, Finance, Dev, Sales)
• LowDB instant persistence + TLS Edge Tunnel
• Direct Bank UPI Settlement Rail (Zero Gateway Fees)`,
      tweet4: `4/7 The Turnkey Products:
We packaged our best assets on our live store starting from just ₹499:
1. 5,000+ Verified Delhi-NCR & Pune Leads (.CSV)
2. AI WhatsApp Auto-Reply Bot Script
3. 30 Viral 4K Business Promo Reels Pack

👉 Live Store: ${storeUrl}`,
      tweet5: `5/7 Want to test the client VIP portal?
Check our live milestone transparency engine:
👉 ${portalUrl}

Built by Vikas Singh (@orionflux). RT if you love autonomous systems! 🔁`,
      intentUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `🚀 How I automated my entire B2B Agency to run 24x7 with Node.js & Claude AI:\n\n• 24/7 AI WhatsApp Client Triage Bots\n• 5,000+ Verified B2B Lead Datasets\n• 15-Day Guaranteed Deal Closing SLA\n\nInstant digital products starting from ₹499:\n👉 ${storeUrl}\n\n#AI #StartupIndia #BuildInPublic #SaaS`
      )}`
    }
  ];

  // ── CAMPAIGN 4: REDDIT VALUE-FIRST POSTS (r/startups, r/freelance) ──
  const redditCampaigns = [
    {
      id: 'red_001',
      subreddit: 'r/startups / r/SideProject / r/developersIndia',
      title: '[Free Resource + Showcase] How I built an autonomous B2B agency engine with Node.js & React (Live Store & Portals)',
      body: `Hey everyone,

I wanted to share our autonomous agency stack and newly launched digital store:

We solve the response-time problem for Indian and global SMBs:
1. Turnkey AI WhatsApp Auto-Reply Bot Script (Node.js & Python)
2. 5,000+ Verified Real Estate & Commercial Business Leads
3. 30 Viral 4K Business Promo Reels Pack

Live Store:
${storeUrl}

Live VIP Client Portals:
${portalUrl}

Would love feedback on the architecture, UX, and conversion flow!

Founder: Vikas Singh | ORION FLUX`
    }
  ];

  // ── CAMPAIGN 5: WHATSAPP STATUS & B2B BROADCAST ───────────────────
  const whatsappStatusBroadcast = {
    title: 'WhatsApp Status / Business Broadcast Blaster',
    statusText: `*ORION FLUX 3.0 | Instant Digital Store Live!* 🚀
Namaste dosto! 🙏 Vikas Singh here.

Hamare instant business automation products aur verified lead datasets ab live hain:
1️⃣ *5,000+ Verified B2B Leads (.CSV)* — Sirf ₹499
2️⃣ *Turnkey AI WhatsApp Auto-Reply Bot Script* — ₹999
3️⃣ *30 Viral 4K Business Promo Reels Pack* — ₹499

🛒 *View Live Store & Instant Download:*
${storeUrl}

Direct UPI: *9690973030@ibl*
Reply 'DEMO' for a free 10-minute AI intake bot test for your business!`,
    intentUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `*ORION FLUX 3.0 | Instant Digital Store Live!* 🚀\nNamaste! Vikas Singh here from ORION FLUX.\n\nHamare instant business automation products ab live hain:\n1️⃣ *5,000+ Verified B2B Leads (.CSV)* — ₹499\n2️⃣ *Turnkey AI WhatsApp Auto-Reply Bot Script* — ₹999\n3️⃣ *30 Viral 4K Business Promo Reels Pack* — ₹499\n\n🛒 *View Live Store & Instant Download:*\n${storeUrl}\n\nDirect UPI: *9690973030@ibl*\nReply 'DEMO' for a free AI consultation!`
    )}`
  };

  return {
    publicBase,
    storeUrl,
    portalUrl,
    videoReelsScripts,
    linkedInCampaigns,
    twitterCampaigns,
    redditCampaigns,
    whatsappStatusBroadcast
  };
}

/**
 * Triggers an autonomous promotion wave:
 * Selects 3-5 uncontacted verified business leads, and dispatches high-open curiosity emails
 * via Google SMTP (vikaas2030@gmail.com) with 1x1 tracking pixels.
 */
export async function launchAutonomousEmailWave(batchSize = 3) {
  const db = getDB();
  const leads = db.data.leads || [];

  const eligibleLeads = leads.filter(l => {
    if (!l.email || l.isQuarantined) return false;
    if (l.email.includes('example.com') || l.email.includes('test')) return false;
    if (l.status === 'PROMOTION_DISPATCHED' || l.status === 'WON') return false;
    return true;
  });

  if (eligibleLeads.length === 0) {
    return {
      success: true,
      dispatchedCount: 0,
      message: 'All verified leads have received promotional dispatches. System is scanning for fresh inbound leads.'
    };
  }

  const targetLeads = eligibleLeads.slice(0, batchSize);
  const results = [];

  for (const lead of targetLeads) {
    try {
      const res = await dispatchHighOpenEmail({
        to: lead.email,
        company: lead.company,
        contact: lead.contact_name || lead.name || 'Business Leader',
        archetypeId: 'email_curiosity',
        entityId: lead.id
      });

      lead.status = 'PROMOTION_DISPATCHED';
      lead.lastPromotionAt = new Date().toISOString();
      lead.lastPromotionMsgId = res.messageId;

      results.push({
        company: lead.company,
        email: lead.email,
        success: true,
        messageId: res.messageId,
        trackingId: res.trackingId
      });
    } catch (err) {
      results.push({
        company: lead.company,
        email: lead.email,
        success: false,
        error: err.message
      });
    }
  }

  db.save();

  return {
    success: true,
    batchSize: targetLeads.length,
    dispatchedCount: results.filter(r => r.success).length,
    results,
    timestamp: new Date().toISOString()
  };
}

/**
 * Real-Time Promotion Telemetry
 */
export function getPromotionTelemetry() {
  const db = getDB();
  const leads = db.data.leads || [];
  const trackings = Object.values(db.data.email_tracking || {});
  const activities = db.data.activities || [];

  const promotedLeads = leads.filter(l => l.status === 'PROMOTION_DISPATCHED');
  const openedEmails = trackings.filter(t => t.opened);

  return {
    publicUrl: getPublicBaseUrl(),
    storeUrl: `${getPublicBaseUrl()}/store`,
    portalUrl: `${getPublicBaseUrl()}/portal`,
    totalVerifiedLeads: leads.filter(l => !l.isQuarantined).length,
    totalPromotionalEmailsDispatched: trackings.length,
    totalVerifiedOpens: openedEmails.length,
    liveOpenRatePct: trackings.length > 0 ? Math.round((openedEmails.length / trackings.length) * 100) : 0,
    activeCampaignChannels: ['YouTube Shorts / Reels', 'LinkedIn B2B', 'Twitter/X', 'Reddit', 'WhatsApp Status', 'Google SMTP Outreach'],
    settlementRail: `${PRIMARY_UPI} (Vikas Singh)`
  };
}
