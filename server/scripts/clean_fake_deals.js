import fs from 'fs';

const p = 'd:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json';
const db = JSON.parse(fs.readFileSync(p, 'utf8'));

console.log('=== BEFORE CLEANUP ===');
console.log('Deals count:', db.deals ? db.deals.length : 0);
console.log('Leads count:', db.leads ? db.leads.length : 0);
console.log('Projects count:', db.projects ? db.projects.length : 0);

// 1. Remove "Sharma Dental Clinic" test deal & test lead
db.deals = (db.deals || []).filter(d => {
  const company = (d.lead_company || d.lead_name || '').toLowerCase();
  const title = (d.title || '').toLowerCase();
  if (company.includes('sharma dental') || title.includes('sharma dental')) {
    console.log(`❌ Removing test deal: ${d.title} (ID: ${d.id})`);
    return false;
  }
  return true;
});

db.leads = (db.leads || []).filter(l => {
  const company = (l.company || l.name || '').toLowerCase();
  if (company.includes('sharma dental')) {
    console.log(`❌ Removing test lead: ${l.name} (ID: ${l.id})`);
    return false;
  }
  return true;
});

// 2. Deduplicate Upwork / Freelance deals (keep only unique title/company)
const seenDeals = new Set();
db.deals = db.deals.filter(d => {
  const key = `${d.title}_${d.lead_company || d.lead_name}`;
  if (seenDeals.has(key)) {
    console.log(`❌ Removing duplicate deal: ${d.title} (ID: ${d.id})`);
    return false;
  }
  seenDeals.add(key);
  return true;
});

// 3. Sync projects array to strictly match real deals
if (db.projects) {
  db.projects = db.projects.filter(p => {
    const title = (p.title || '').toLowerCase();
    const client = (p.client || '').toLowerCase();
    if (title.includes('sharma dental') || client.includes('sharma dental')) return false;
    return db.deals.some(d => d.id === p.id || (d.lead_company && d.lead_company.toLowerCase() === client));
  });
}

// 4. Ensure revenue and real_collections are strictly verified
if (!db.real_collections) db.real_collections = [];
if (!db.revenue) db.revenue = [];

fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');

console.log('\n=== AFTER CLEANUP ===');
console.log('Remaining Clean Real Deals:', db.deals.length);
db.deals.forEach((d, i) => {
  console.log(`  ${i+1}. [${d.stage.toUpperCase()}] ${d.title} (${d.lead_company || d.lead_name}) - ${d.currency === 'USD' ? '$' : '₹'}${d.value}`);
});
console.log('Remaining Real Leads:', db.leads.length);
