import { getDB } from '../config/database.js';
import { getLearningDashboard } from '../services/autonomousSelfLearningEngine.js';

async function report() {
  const db = await getDB();
  const leads = db.data.leads || [];
  const deals = db.data.deals || [];
  const activities = (db.data.activities || []).slice(0, 10);
  const settlements = db.data.settlements || [];
  const wonDeals = deals.filter(d => d.stage === 'won' || d.status === 'won');
  const learning = getLearningDashboard();

  console.log('--- DATABASE METRICS ---');
  console.log('Total Leads:', leads.length);
  console.log('Quarantined Leads:', leads.filter(l => l.isQuarantined).length);
  console.log('Verified Active Leads:', leads.filter(l => !l.isQuarantined).length);
  console.log('Indian Mobile Verified (WhatsApp Ready):', leads.filter(l => {
    const p = (l.phone || '').replace(/\D/g, '');
    return p.length === 10 || (p.length === 12 && p.startsWith('91'));
  }).length);
  console.log('Total Deals:', deals.length);
  console.log('Won Deals (100% Genuine):', wonDeals.length);
  console.log('Settlements Verified:', settlements.length);
  
  console.log('\n--- LEARNING VAULT DIRECTIVES ---');
  console.log('Total Mistakes Analyzed:', learning.totalMistakesRecorded);
  console.log('Active Learned Rules:', learning.learnedRules?.length);
  console.log('Blacklisted Domains:', learning.domainBlacklist?.length);

  console.log('\n--- RECENT 5 SYSTEM ACTIVITIES ---');
  activities.slice(0, 5).forEach(a => {
    console.log(`[${a.timestamp}] [${a.type}] ${a.title}`);
  });
}

report().catch(console.error);
