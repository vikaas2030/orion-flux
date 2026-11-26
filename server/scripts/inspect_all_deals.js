import fs from 'fs';

const p = 'd:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json';
const db = JSON.parse(fs.readFileSync(p, 'utf8'));

console.log('=== FULL DEALS AUDIT ===');
console.log('Total deals count:', db.deals ? db.deals.length : 0);

(db.deals || []).forEach((d, i) => {
  console.log(`\nDeal #${i + 1}:`);
  console.log(`  ID: ${d.id}`);
  console.log(`  Title: ${d.title}`);
  console.log(`  Company: ${d.lead_company || d.lead_name}`);
  console.log(`  Phone: ${d.phone}`);
  console.log(`  Value: ${d.currency === 'USD' ? '$' : '₹'}${d.value}`);
  console.log(`  Stage: ${d.stage}`);
  console.log(`  Created: ${d.created_at}`);
  console.log(`  Notes: ${d.notes}`);
});
