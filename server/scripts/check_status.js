import fs from 'fs';
const p = 'd:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json';
const db = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('Real Collections:', db.real_collections);
console.log('Won Deals:', (db.deals || []).filter(d => d.stage === 'won'));
