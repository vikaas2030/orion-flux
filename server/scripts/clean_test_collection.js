import fs from 'fs';

const p = 'd:/ANTIGRAVITY VK/orion-flux/database/orion_flux_data.json';
const db = JSON.parse(fs.readFileSync(p, 'utf8'));

// Check test entry
console.log('Real collections count before:', db.real_collections ? db.real_collections.length : 0);

// Remove the test collection
db.real_collections = [];
db.revenue = [];

// Revert Sharma Dental Clinic deal stage back to negotiation
const sharmaDeal = (db.deals || []).find(d => (d.lead_company || '').includes('Sharma Dental'));
if (sharmaDeal) {
  sharmaDeal.stage = 'negotiation';
  sharmaDeal.probability = 65;
  delete sharmaDeal.advancePaid;
  delete sharmaDeal.transactionRef;
  delete sharmaDeal.finalizedAt;
  delete sharmaDeal.contractStatus;
}

// Revert corresponding lead
const sharmaLead = (db.leads || []).find(l => (l.company || '').includes('Sharma Dental'));
if (sharmaLead) {
  sharmaLead.status = 'negotiation';
  delete sharmaLead.wonAt;
}

fs.writeFileSync(p, JSON.stringify(db, null, 2), 'utf8');
console.log('Cleaned test collection. Real collections count:', db.real_collections.length);
console.log('Total revenue reset to: 0');
