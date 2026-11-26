import fs from 'fs';
const d = JSON.parse(fs.readFileSync('d:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json', 'utf8'));
console.log('Total Leads:', d.leads.length);
d.leads.slice(0, 10).forEach((l, i) => {
  console.log(`${i+1}. [${l.countryFlag || '🌐'} ${l.city}, ${l.country}] ${l.name} | ${l.industry} | Advance: ${l.currencySymbol || '₹'}${l.pricingAdvance} | Total: ${l.currencySymbol || '₹'}${l.pricingTotal}`);
});
