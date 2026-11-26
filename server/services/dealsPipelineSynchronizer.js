// ═════════════════════════════════════════════════════════════════════
//  DEALS PIPELINE SYNCHRONIZER (ORION FLUX VIP ENGINE)
//  Synchronizes all discovered leads into high-velocity pipeline deals
//  Configured for instant closing with ₹999 / $49 refundable pilot token
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';

export function syncAllLeadsToPipeline() {
  const db = getDB();
  const leads = db.data.leads || [];
  if (!db.data.deals) db.data.deals = [];
  const deals = db.data.deals;

  let addedCount = 0;

  for (const lead of leads) {
    const leadId = lead.id;
    const company = lead.company || lead.name || 'Valued Business';
    const alreadyLinked = deals.some(d => d.lead_id === leadId || d.lead_company?.toLowerCase() === company.toLowerCase());

    if (!alreadyLinked) {
      const isUSD = lead.currency === 'USD' || (lead.country && lead.country !== 'India' && lead.country !== 'IN');
      const totalValue = lead.pricingTotal || (isUSD ? 2400 : 15000);
      const pilotAdvance = isUSD ? 49 : 999;
      const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const newDeal = {
        id: Date.now() + Math.floor(Math.random() * 50000),
        title: `${company} — 24/7 AI Client Intake & 4K Suite`,
        lead_id: leadId,
        lead_name: lead.name || company,
        lead_company: company,
        value: totalValue,
        advance: pilotAdvance,
        currency: isUSD ? 'USD' : 'INR',
        stage: 'proposal',
        probability: 90,
        phone: lead.phone || null,
        email: lead.email || null,
        city: lead.city || 'Global Metro',
        country: lead.country || (isUSD ? 'International' : 'India'),
        deliverables: 'Sub-2s WhatsApp AI Booking Assistant, 4K Retina CineFlow Video Showcase, Net-Zero Section 22 Invoice',
        clientPortalUrl: `/portal/${slug}`,
        hasVideoPackage: true,
        videoPackageId: `VID-4K-${Math.floor(100000 + Math.random() * 900000)}`,
        created_at: new Date().toISOString()
      };

      deals.unshift(newDeal);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    if (!db.data.activities) db.data.activities = [];
    db.data.activities.unshift({
      id: `act-sync-${Date.now()}`,
      type: 'deals_pipeline_synced',
      title: `⚡ Synced ${addedCount} Leads to Active Deals Pipeline`,
      description: `All leads now armed with ₹999 / $49 refundable pilot advance & 1-tap WhatsApp closing rails.`,
      timestamp: new Date().toISOString()
    });
    db.save();
  }

  return {
    success: true,
    addedCount,
    totalDeals: deals.length
  };
}
