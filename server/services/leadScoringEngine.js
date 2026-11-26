import getDB from '../config/database.js';

/**
 * ORION FLUX AI Propensity Lead Scoring Matrix
 * Evaluates business firmographics, city GDP tier, contact completeness,
 * and deal value to compute a cognitive 0-100 Propensity-to-Pay Score.
 */

const HIGH_GDP_CITIES = ['Dubai', 'Abu Dhabi', 'New York', 'San Francisco', 'London', 'Chicago', 'Singapore', 'Sydney', 'Vancouver'];
const METRO_TIER1_CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Gurgaon', 'Noida', 'Hyderabad', 'Pune'];

const HIGH_TICKET_NICHES = [
  'Software, Web Apps & SaaS',
  'Luxury Real Estate & Villa Developers',
  'Aesthetic & Cosmetic Surgery Clinics',
  'Specialty Hospitals & Surgery Centers',
  'Enterprise Cloud & SaaS Companies',
  'Private Healthcare & Dental Clinics (Harley St)',
  'FinTech & B2B SaaS Platforms',
  'Executive Wealth & Legal Advisory',
  'Commercial Real Estate Brokers'
];

export function calculateLeadScore(lead = {}) {
  let score = 0;
  const reasons = [];

  // 1. City & Purchasing Power (Max 25 pts)
  const city = lead.city || '';
  if (HIGH_GDP_CITIES.some(c => c.toLowerCase() === city.toLowerCase())) {
    score += 25;
    reasons.push('Global Tier-1 High-GDP Metro (+25)');
  } else if (METRO_TIER1_CITIES.some(c => c.toLowerCase() === city.toLowerCase())) {
    score += 20;
    reasons.push('India Tier-1 Business Hub (+20)');
  } else {
    score += 12;
    reasons.push('Regional Commercial Market (+12)');
  }

  // 2. High-Ticket Industry Potential (Max 25 pts)
  const ind = lead.industry || '';
  if (HIGH_TICKET_NICHES.some(n => ind.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(ind.toLowerCase()))) {
    score += 25;
    reasons.push('High-Ticket Enterprise Niche (+25)');
  } else if (/dental|doctor|clinic|interior|property|real estate|software/i.test(ind)) {
    score += 18;
    reasons.push('Professional Healthcare/Property Niche (+18)');
  } else {
    score += 10;
    reasons.push('Standard Commercial Niche (+10)');
  }

  // 3. Contact & Digital Readiness (Max 20 pts)
  let contactPts = 0;
  const hasPhone = Boolean(lead.phone && !lead.phone.includes('Google Maps') && lead.phone.replace(/\D/g, '').length >= 10);
  const hasEmail = Boolean(lead.email && !lead.email.includes('example.com') && lead.email.includes('@'));
  const hasWebsite = Boolean(lead.website && lead.website !== 'N/A');

  if (hasPhone && hasEmail && hasWebsite) contactPts = 20;
  else if (hasPhone && hasEmail) contactPts = 16;
  else if (hasEmail) contactPts = 10;
  else contactPts = 5;

  score += contactPts;
  reasons.push(`Contact Readiness: ${contactPts}/20 pts`);

  // 4. Deal Value / Currency Anchor (Max 15 pts)
  const val = parseFloat(lead.pricingTotal || lead.value) || 0;
  const isUSD = lead.currency === 'USD';
  if (isUSD && val >= 2000) {
    score += 15;
    reasons.push('High-Ticket Dollar Deal $2k+ (+15)');
  } else if (isUSD || val >= 15000) {
    score += 12;
    reasons.push('Premium Ticket Value (+12)');
  } else {
    score += 8;
    reasons.push('Standard Project Value (+8)');
  }

  // 5. Engagement & Status Velocity (Max 15 pts)
  if (lead.status === 'qualified' || lead.status === 'proposal_sent' || lead.realSmtpSent) {
    score += 15;
    reasons.push('Active Proposal Delivered (+15)');
  } else if (lead.dispatchedPortalUrl || lead.googleMapsUrl) {
    score += 10;
    reasons.push('Staging Portal Pre-Configured (+10)');
  } else {
    score += 5;
    reasons.push('New Prospect (+5)');
  }

  // Ensure score is capped between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine Propensity Tier
  let tier = 'COLD';
  let badgeColor = '#64748b';
  let emoji = '❄️';

  if (finalScore >= 85) {
    tier = 'HOT';
    badgeColor = '#ef4444';
    emoji = '🔥';
  } else if (finalScore >= 68) {
    tier = 'WARM';
    badgeColor = '#f59e0b';
    emoji = '⚡';
  }

  return {
    score: finalScore,
    tier,
    badgeColor,
    emoji,
    reasons,
    label: `${emoji} ${tier} (${finalScore}%)`
  };
}

export function scoreAllLeadsInDB() {
  const db = getDB();
  const leads = db.data.leads || [];

  leads.forEach(lead => {
    const scored = calculateLeadScore(lead);
    lead.aiScore = scored.score;
    lead.propensityTier = scored.tier;
    lead.scoreLabel = scored.label;
    lead.scoreReasons = scored.reasons;
  });

  db.save();

  const hotCount = leads.filter(l => l.propensityTier === 'HOT').length;
  const warmCount = leads.filter(l => l.propensityTier === 'WARM').length;
  const coldCount = leads.filter(l => l.propensityTier === 'COLD').length;

  return {
    totalLeads: leads.length,
    hotCount,
    warmCount,
    coldCount,
    hotLeads: leads.filter(l => l.propensityTier === 'HOT').slice(0, 10),
    topPriorityLeads: leads.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 15)
  };
}

export function getRankedOutreachQueue() {
  const db = getDB();
  const leads = db.data.leads || [];

  // Filter uncontacted or ready for follow-up and sort by AI score descending
  return leads
    .map(l => ({ ...l, scoring: calculateLeadScore(l) }))
    .sort((a, b) => b.scoring.score - a.scoring.score);
}
