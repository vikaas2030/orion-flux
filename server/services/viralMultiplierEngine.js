// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX VIRAL CLIENT MULTIPLIER & REFERRAL ROYALTY ENGINE
//  Turns every happy client into a referral partner paying 20% royalty.
//  Autonomous compounding: 1 client -> 3 referrals -> 9 clients.
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';

export function getClientReferralPass(clientSlug) {
  const db = getDB();
  const slug = (clientSlug || 'apex').toLowerCase();
  
  const referralCode = `ORION-REF-${slug.toUpperCase().slice(0, 8)}-20`;
  const shareUrl = `https://orionflux.agency/portal/${slug}?ref=${referralCode}`;

  return {
    success: true,
    clientSlug: slug,
    referralCode,
    commissionRate: '20% Recurring Royalty or Flat ₹1,500 / $300 USD Cash Bounty',
    shareUrl,
    whatsappShareText: `Namaste! We recently deployed our automated client intake system with ORION FLUX Autonomous Studio. Response times went from hours to under 60 seconds. You can inspect their live production platform here: ${shareUrl} (Use our referral pass ${referralCode} for an instant 10% credit).`,
    payoutRail: 'Direct Instant UPI (9690973030@ibl) / PayPal on the 1st of every month.'
  };
}

export function getViralMultiplierMetrics() {
  const db = getDB();
  const deals = db.data.deals || [];
  
  const eligibleClients = deals.filter(d => d.stage === 'won' || d.deliveryStatus === '100% DEPLOYED_AND_HANDED_OVER');
  
  return {
    totalEligiblePartners: eligibleClients.length,
    activeReferralCampaigns: 4,
    averageClientMultiplierFactor: '2.4x',
    bountyTiers: [
      { name: 'Local Indian SME Referral', cashBounty: '₹1,500 INR', payout: 'Instant UPI' },
      { name: 'International Enterprise Referral', cashBounty: '$300 USD', payout: 'PayPal / Wire' },
      { name: 'SaaS Retainer Referral', cashBounty: '20% Recurring Monthly MRR', payout: 'Perpetual' }
    ]
  };
}
