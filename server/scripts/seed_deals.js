import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../database/orion_flux_data.json');

const raw = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(raw);

const existingTitles = new Set((data.deals || []).map(d => d.title));

const richDeals = [
  {
    id: 101,
    lead_id: 10,
    lead_name: 'Vikram Malhotra',
    lead_company: 'Apex Realty Group',
    email: 'vikram@apexrealty.in',
    phone: '+91 98112 23344',
    title: 'Luxury Villa Buyer AI & Automated WhatsApp Booking Rail',
    value: 125000,
    currency: 'INR',
    stage: 'negotiation',
    probability: 90,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: 'Director Vikram Malhotra agreed to ₹1,25,000 package. Waiting for 50% advance token (₹62,500) and signed MSA.'
  },
  {
    id: 102,
    lead_id: 11,
    lead_name: 'Dr. Kunal Roy',
    lead_company: 'SmileCraft Dental Care & Aesthetics',
    email: 'drkunal@smilecraft.in',
    phone: '+91 98334 45566',
    title: 'Patient No-Show Reducer & 24/7 Clinic Reception Assistant',
    value: 80000,
    currency: 'INR',
    stage: 'proposal',
    probability: 75,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: 'Proposal sent with 3-tier SLA. Dr. Kunal reviewed 5-star clinic demo and requested contract review.'
  },
  {
    id: 103,
    lead_id: 12,
    lead_name: 'Pooja Kapoor',
    lead_company: 'LuxeLiving Interior Studios',
    email: 'pooja@luxeliving.co',
    phone: '+91 98556 67788',
    title: 'Cinematic 4K Villa Walkthroughs & Architect Client Intake System',
    value: 110000,
    currency: 'INR',
    stage: 'negotiation',
    probability: 85,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: 'Pooja loved the Veo 3D sample video. Ready to sign retainer for ₹1,10,000.'
  },
  {
    id: 104,
    lead_id: 13,
    lead_name: 'Rohan Mehra',
    lead_company: 'Artisan Crafted Organics',
    email: 'rohan@artisancrafted.in',
    phone: '+91 98667 78899',
    title: 'D2C 20-Video Ad Campaign & OmniBot WhatsApp Cart Recovery',
    value: 180000,
    currency: 'INR',
    stage: 'qualified',
    probability: 70,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    notes: 'E-commerce founder interested in cutting video production costs by 70%.'
  },
  {
    id: 105,
    lead_id: 14,
    lead_name: 'Anand Verma',
    lead_company: 'Prime Estate Partners',
    email: 'anand@primeestate.co.in',
    phone: '+91 98223 34455',
    title: '99acres & MagicBricks Instant 60-Second Lead Qualifier Rail',
    value: 95000,
    currency: 'INR',
    stage: 'contacted',
    probability: 50,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    notes: 'Replied to cold pitch message with interest for live demo.'
  },
  {
    id: 106,
    lead_id: 15,
    lead_name: 'Devendra Patel',
    lead_company: 'Horizon Cloud Infotech',
    email: 'dev@horizoncloud.io',
    phone: '+91 97123 45678',
    title: 'Enterprise Multi-Agent Data Extraction & Business Automation',
    value: 240000,
    currency: 'INR',
    stage: 'new',
    probability: 40,
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    notes: 'Captured via Google Maps B2B search.'
  }
];

if (!data.deals) data.deals = [];

// Filter out duplicates and append
for (const d of richDeals) {
  if (!existingTitles.has(d.title)) {
    data.deals.push(d);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully seeded rich deals! Total deals:', data.deals.length);
