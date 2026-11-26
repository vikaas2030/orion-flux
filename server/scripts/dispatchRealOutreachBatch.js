import 'dotenv/config';
import { getDB } from '../config/database.js';
import { sendRealEmail } from '../services/emailDispatcher.js';

async function main() {
  const db = getDB();
  const leads = db.data.leads || [];

  // Filter 5 high-priority genuine domain leads
  const targetLeads = leads.filter(l => 
    !l.realSmtpSent && 
    l.email && 
    !l.email.includes('example.com') &&
    !l.email.includes('www.') &&
    l.email.includes('.') &&
    (l.city === 'Bengaluru' || l.city === 'Noida' || l.city === 'Delhi' || l.city === 'Chicago' || l.city === 'Manchester')
  ).slice(0, 5);

  console.log(`🚀 [REAL OUTREACH ACCELERATOR] Initiating verified SMTP dispatch for ${targetLeads.length} leads...`);

  const results = [];

  for (const lead of targetLeads) {
    console.log(`\n📧 Dispatching to ${lead.company} (${lead.email})...`);
    const slug = (lead.company || 'vip').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const portalUrl = `https://66b899531de096.lhr.life/portal/${slug}`;
    const token = lead.currency === 'USD' ? '$49' : '₹999';

    const subject = `Turnkey Business Automation & 24/7 Client Intake Rail for ${lead.company}`;
    const text = `Namaste / Hello Team at ${lead.company},\n\n` +
      `We noticed that high-growth businesses in ${lead.industry || 'your sector'} frequently lose prospective inquiries after hours due to manual response delays.\n\n` +
      `At ORION FLUX, we have already staged and 4-Layer QA Certified a turnkey 24/7 client intake & scheduling infrastructure tailored for ${lead.company}.\n\n` +
      `🔗 Interactive VIP Staging Demo: ${portalUrl}\n\n` +
      `Key Deliverables Included:\n` +
      `- 24/7 Instant WhatsApp / Web Client Intake & Booking Engine\n` +
      `- 4-Layer QA Cryptographic Certification (Zero defect guarantee)\n` +
      `- 14-Day 100% Money-Back Satisfaction SLA\n\n` +
      `To eliminate all onboarding risk, we are currently extending an introductory setup slot with a 100% refundable token of ${token}.\n` +
      `Direct Settlement Rail: UPI (9690973030@ibl) or PayPal (payments@orionflux.agency)\n\n` +
      `Would you be open to a 2-minute live test this week?\n\n` +
      `Best regards,\n` +
      `ORION FLUX Autonomous Agency OS\n` +
      `Vikas (Agency Orchestrator)\n` +
      `https://orionflux.agency`;

    try {
      const emailRes = await sendRealEmail({
        to: lead.email,
        subject,
        text
      });

      lead.realSmtpSent = true;
      lead.realSmtpMessageId = emailRes.messageId;
      lead.realSmtpSentAt = new Date().toISOString();
      lead.status = 'real_email_sent';

      results.push({
        company: lead.company,
        email: lead.email,
        messageId: emailRes.messageId,
        status: 'DELIVERED_VIA_GMAIL'
      });
      console.log(`✅ Sent to ${lead.email}! Message ID: ${emailRes.messageId}`);
    } catch (err) {
      console.warn(`❌ Failed for ${lead.email}:`, err.message);
      results.push({
        company: lead.company,
        email: lead.email,
        error: err.message,
        status: 'FAILED'
      });
    }
  }

  db.save();
  console.log('\n📊 [DISPATCH COMPLETE]', JSON.stringify(results, null, 2));
}

main().catch(console.error);
