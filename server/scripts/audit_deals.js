import fs from 'fs';

const p = 'd:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json';
const db = JSON.parse(fs.readFileSync(p, 'utf8'));

const leads = db.leads || [];
const deals = db.deals || [];
const realCollections = db.real_collections || [];

// Current local date check (2026-10-24 and 2026-10-23 UTC/IST)
console.log('--- STATS AUDIT ---');
console.log('Total Leads in CRM:', leads.length);
console.log('Total Deals in Pipeline:', deals.length);
console.log('Settled Real Bank Collections:', realCollections.length);

console.log('\n--- DEALS BREAKDOWN ---');
deals.forEach((d, i) => {
  console.log(`${i+1}. [${d.stage.toUpperCase()}] ${d.title} | Client: ${d.lead_company || d.lead_name} | Value: ${d.currency === 'USD' ? '$' : '₹'}${d.value} | Created: ${d.created_at}`);
});

const wonDeals = deals.filter(d => d.stage === 'won');
console.log('\nFinalized (Won) Deals Count:', wonDeals.length);

const todayStr = '2026-10-24';
const yesterdayStr = '2026-10-23';

const leadsToday = leads.filter(l => (l.created_at || '').startsWith(todayStr));
const leadsYesterday = leads.filter(l => (l.created_at || '').startsWith(yesterdayStr));

console.log('\nLeads created on 2026-10-24:', leadsToday.length);
console.log('Leads created on 2026-10-23:', leadsYesterday.length);

const dealsToday = deals.filter(d => (d.created_at || '').startsWith(todayStr));
console.log('Deals created on 2026-10-24:', dealsToday.length);
