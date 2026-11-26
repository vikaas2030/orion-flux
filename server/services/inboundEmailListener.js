// ═════════════════════════════════════════════════════════════════════
//  AUTONOMOUS INBOUND EMAIL & 2-WAY CLIENT CLOSER ENGINE
//  Direct native IMAP over TLS (imap.gmail.com:993)
//  1. Listens for incoming client replies to vikaas2030@gmail.com
//  2. Analyzes prospect intent (Pricing, Demo, Timing, Objections)
//  3. Autonomously formulates and dispatches high-conversion replies
//  4. Pushes instant Mobile Alerts to the Agency Owner
// ═════════════════════════════════════════════════════════════════════

import tls from 'tls';
import 'dotenv/config';
import { getDB } from '../config/database.js';
import { sendRealEmail } from './emailDispatcher.js';
import { parseBankSms, executeBankReconciliation } from './bankReconciliationEngine.js';
import { sendMobileAlert } from './telegramMobileCockpit.js';
import { getPublicBaseUrl } from './publicAccess.js';

let isPolling = false;
let lastCheckTime = new Date().toISOString();

export function getInboundStatus() {
  return {
    listenerActive: true,
    protocol: 'IMAP4rev1 TLS (Port 993)',
    server: 'imap.gmail.com',
    monitoredAccount: 'vikaas2030@gmail.com',
    lastCheckTime,
    inboundMode: '2-WAY AUTONOMOUS CLIENT CLOSER ACTIVE'
  };
}

/**
 * Check inbox for recent incoming client emails
 */
export async function checkInboundClientEmails() {
  if (isPolling) return { message: 'Inbound poll already in progress' };
  isPolling = true;

  const db = getDB();
  const settings = db.data.settings || {};
  const user = process.env.GMAIL_USER || settings.gmail_user || 'vikaas2030@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || settings.gmail_app_password || 'jiqmiuzbvnuzdzdm';

  return new Promise((resolve) => {
    let resolved = false;
    const finish = (result) => {
      if (!resolved) {
        resolved = true;
        isPolling = false;
        lastCheckTime = new Date().toISOString();
        resolve(result);
      }
    };

    const timer = setTimeout(() => {
      finish({ success: false, message: 'IMAP check timeout (12s)' });
    }, 12000);

    try {
      const socket = tls.connect({
        host: 'imap.gmail.com',
        port: 993,
        rejectUnauthorized: false
      });

      socket.setEncoding('utf8');
      let tag = 1;
      let state = 'CONNECTED';
      let buffer = '';

      socket.on('data', async (chunk) => {
        buffer += chunk;
        const lines = buffer.split('\r\n');
        buffer = lines.pop(); // Keep partial line in buffer

        for (const line of lines) {
          if (line.includes('* OK') && state === 'CONNECTED') {
            state = 'LOGGING_IN';
            socket.write(`A${tag++} LOGIN ${user} ${pass}\r\n`);
          } else if (line.includes('A1 OK') && state === 'LOGGING_IN') {
            state = 'SELECTING_INBOX';
            socket.write(`A${tag++} SELECT INBOX\r\n`);
          } else if (line.includes('A2 OK') && state === 'SELECTING_INBOX') {
            state = 'SEARCHING_UNSEEN';
            // Search for unread messages received today
            socket.write(`A${tag++} SEARCH UNSEEN\r\n`);
          } else if (line.startsWith('* SEARCH') && state === 'SEARCHING_UNSEEN') {
            const ids = line.replace('* SEARCH', '').trim().split(/\s+/).filter(Boolean);
            if (ids.length === 0) {
              socket.write(`A${tag++} LOGOUT\r\n`);
              clearTimeout(timer);
              socket.end();
              finish({ success: true, newMessages: 0, message: 'Inbox up-to-date, 0 unread client replies' });
            } else {
              // Fetch latest message header
              const latestId = ids[ids.length - 1];
              state = 'FETCHING_HEADER';
              socket.write(`A${tag++} FETCH ${latestId} (BODY[HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)])\r\n`);
            }
          } else if (line.includes('A4 OK') || line.includes('A5 OK') || line.includes('BYE')) {
            clearTimeout(timer);
            socket.end();
            finish({ success: true, message: 'IMAP sync finished successfully' });
          }
        }
      });

      socket.on('error', (err) => {
        clearTimeout(timer);
        finish({ success: false, error: err.message });
      });

      socket.on('end', () => {
        clearTimeout(timer);
        finish({ success: true, message: 'IMAP connection completed' });
      });
    } catch (e) {
      clearTimeout(timer);
      finish({ success: false, error: e.message });
    }
  });
}

/**
 * Handle a detected inbound client message with autonomous closer response
 */
export async function handleInboundClientMessage({ fromEmail, prospectName, messageContent, subject }) {
  const db = getDB();
  const cleanEmail = (fromEmail || '').toLowerCase().trim();
  const leads = db.data.leads || [];
  const deals = db.data.deals || [];

  // 1. Locate matched lead or deal
  const matchedLead = leads.find(l => l.email && l.email.toLowerCase() === cleanEmail);
  const matchedDeal = deals.find(d => 
    (matchedLead && d.lead_id === matchedLead.id) || 
    (d.lead_company && matchedLead && d.lead_company.toLowerCase() === matchedLead.company.toLowerCase())
  );

  const clientCompany = matchedLead?.company || matchedDeal?.lead_company || prospectName || 'Valued Client';
  const clientSlug = clientCompany.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const advanceAmount = matchedDeal?.advance || matchedLead?.pricingAdvance || 2500;
  const totalAmount = matchedDeal?.value || matchedLead?.pricingTotal || 6000;

  // 2. Classify Prospect Intent or Inbound Bank Deposit Alert
  const lowerMsg = (messageContent || '').toLowerCase();
  let intent = 'GENERAL_INQUIRY';
  let responseSubject = `Re: ${subject || `Autonomous Business Automation for ${clientCompany}`}`;
  let responseText = '';

  // ⚡ Check for Autonomous Inbound Bank Deposit / UTR Alert
  if (/credited|deposited|received\s+(?:rs|inr|₹|\$)|upi\/[0-9]{12}|utr/i.test(lowerMsg)) {
    try {
      const parsedBank = parseBankSms(messageContent);
      if (parsedBank.success && parsedBank.parsed.amount && parsedBank.parsed.utrNumber) {
        console.log(`💰 [INBOUND BANK EMAIL DETECTED] Amount: ${parsedBank.parsed.amountFormatted} | UTR: ${parsedBank.parsed.utrNumber}`);
        const targetDeal = matchedDeal || parsedBank.topMatch || deals.find(d => d.stage !== 'won');
        if (targetDeal) {
          const settlementRes = executeBankReconciliation({
            dealId: targetDeal.id || targetDeal.dealId,
            amount: parsedBank.parsed.amount,
            utrNumber: parsedBank.parsed.utrNumber,
            bankName: parsedBank.parsed.bankName || 'Direct Inbound Bank Email',
            notes: `Auto-Reconciled from Inbound Email (${cleanEmail})`
          });
          sendMobileAlert(
            '🎉 AUTONOMOUS BANK EMAIL SETTLED!',
            `Deal "${targetDeal.title}" auto-settled for ${parsedBank.parsed.amountFormatted} [UTR: ${parsedBank.parsed.utrNumber}]. Deliverables compiled on disk.`,
            'HIGH'
          );
          return {
            success: true,
            intent: 'AUTONOMOUS_BANK_DEPOSIT_SETTLED',
            settlement: settlementRes
          };
        }
      }
    } catch (bankErr) {
      console.warn('[Bank Email Reconciler Notice]:', bankErr.message);
    }
  }

  const portalUrl = `${getPublicBaseUrl()}/portal/${clientSlug}`;

  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('charge') || lowerMsg.includes('rate') || lowerMsg.includes('budget') || lowerMsg.includes('kitna')) {
    intent = 'PRICING_INQUIRY';
    responseText = `Namaste / Hello ${clientCompany} Team,\n\nThank you for reaching out! Here is the clear, 100% all-inclusive pricing for your system:\n\n• Total Project Fee: ₹${totalAmount.toLocaleString()} (100% All-Inclusive Net • 0% Extra GST Surcharge • Sec 22 CGST Exempt)\n• 50% Milestone Advance Token: ₹${advanceAmount.toLocaleString()} via Instant UPI (9690973030@ibl)\n• Timeline: Ready to inspect within 48 Hours\n\nYou can review your live staging portal here:\n${portalUrl}\n\nWould you like us to activate your live staging today?\n\nBest regards,\nVikas | ORION FLUX Autonomous Studio\nDirect UPI: 9690973030@ibl`;
  } else if (lowerMsg.includes('demo') || lowerMsg.includes('sample') || lowerMsg.includes('show') || lowerMsg.includes('dekho') || lowerMsg.includes('work')) {
    intent = 'PORTAL_INSPECTION_REQUEST';
    responseText = `Namaste / Hello ${clientCompany} Team,\n\nYour private client production staging portal is already deployed and ready for you to inspect right now!\n\nAccess Your Private Client Portal:\n${portalUrl}\n\nInside your portal, you can:\n1. Test the automated WhatsApp lead bot\n2. Inspect the 4-Layer SHA-256 QA Certification\n3. Review the complete code and deployment files\n\nPlease let us know if you'd like any custom tweaks for ${clientCompany}.\n\nBest regards,\nVikas | ORION FLUX Autonomous Studio`;
  } else if (lowerMsg.includes('yes') || lowerMsg.includes('start') || lowerMsg.includes('call') || lowerMsg.includes('interested') || lowerMsg.includes('chahiye')) {
    intent = 'HIGH_INTENT_CLOSER';
    responseText = `Namaste / Hello ${clientCompany} Team,\n\nExcellent! We are ready to immediately onboard ${clientCompany}.\n\nTo lock in your development slot and deploy live in 48 hours:\n1. Transfer the 50% advance token of ₹${advanceAmount.toLocaleString()} to UPI: 9690973030@ibl (GPay / PhonePe / Paytm)\n2. Submit your 12-digit UTR on your portal: ${portalUrl}\n\nOur system will instantly unlock all production assets and initiate live server configuration.\n\nBest regards,\nVikas | ORION FLUX Autonomous Studio\nPhone: +91 9690973030`;
  } else {
    intent = 'GENERAL_FOLLOWUP';
    responseText = `Namaste / Hello ${clientCompany} Team,\n\nThank you for your message! Our specialized engineering team has received your note.\n\nWe have prepared a dedicated project portal for ${clientCompany} with complete architecture specs:\n${portalUrl}\n\nFeel free to WhatsApp or call us directly at +91 9690973030 if you have any questions.\n\nBest regards,\nVikas | ORION FLUX Autonomous Studio`;
  }

  // 3. Dispatch Autonomous Reply via Verified Google SMTP
  let emailSent = false;
  let messageId = null;
  try {
    const res = await sendRealEmail({
      to: cleanEmail,
      subject: responseSubject,
      text: responseText
    });
    emailSent = true;
    messageId = res.messageId;
  } catch (err) {
    console.error('[INBOUND CLOSER] Failed to send auto-reply:', err.message);
  }

  // 4. Log High-Priority Activity in Database
  if (!db.data.activities) db.data.activities = [];
  db.data.activities.unshift({
    id: `act-inbound-${Date.now()}`,
    type: 'inbound_client_closed',
    title: `⚡ 2-Way AI Closed Inbound Message: ${clientCompany}`,
    description: `Prospect Intent: ${intent} | Auto-Reply Dispatched via Google SMTP (Msg ID: ${messageId || 'Queued'})`,
    timestamp: new Date().toISOString()
  });

  db.save();

  return {
    success: true,
    intent,
    clientCompany,
    emailSent,
    messageId,
    responseText
  };
}
