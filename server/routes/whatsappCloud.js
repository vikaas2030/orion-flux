import express from 'express';
import getDB from '../config/database.js';
import {
  getWhatsAppStatus,
  sendRealWhatsAppMessage,
  handleClientDealOutcome
} from '../services/realWhatsAppEngine.js';
import { getPublicBaseUrl } from '../services/publicAccess.js';

const router = express.Router();

/**
 * ORION FLUX Real WhatsApp & Conversational Deal Closer API
 * Supports Meta Cloud API, Twilio WhatsApp API, and Native 1-Tap Launch
 */

// GET /api/whatsapp/status — Check WhatsApp Channels & Carrier Status
router.get('/status', (req, res) => {
  try {
    const status = getWhatsAppStatus();
    const db = getDB();
    const recent = (db.data.whatsapp_messages || []).slice(0, 15);
    res.json({ ...status, recentMessages: recent });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/whatsapp/send — Send Real WhatsApp Message
router.post('/send', async (req, res) => {
  try {
    const { toPhone, messageText, leadId, company, clientName, dealValue, currency } = req.body;
    if (!toPhone) {
      return res.status(400).json({ error: true, message: 'toPhone is required' });
    }

    const result = await sendRealWhatsAppMessage({
      toPhone,
      messageText,
      leadId,
      company,
      clientName,
      dealValue,
      currency
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/whatsapp/outcome — Record Client Response, Objection, or Close Deal with UTR
router.post('/outcome', async (req, res) => {
  try {
    const { leadId, dealId, outcomeType, notes, utrNumber, amountPaid } = req.body;
    const result = await handleClientDealOutcome({
      leadId,
      dealId,
      outcomeType,
      notes,
      utrNumber,
      amountPaid
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/whatsapp/config — Save Meta WhatsApp Cloud API Credentials
router.post('/config', (req, res) => {
  try {
    const { accessToken = '', phoneNumberId = '', businessAccountId = '', verifyToken = 'orion_flux_secret_2026' } = req.body;
    const db = getDB();
    if (!db.data.settings) db.data.settings = {};

    db.data.settings.whatsapp_access_token = accessToken.trim();
    db.data.settings.whatsapp_phone_number_id = phoneNumberId.trim();
    db.data.settings.whatsapp_business_account_id = businessAccountId.trim();
    db.data.settings.whatsapp_verify_token = verifyToken.trim();
    db.save();

    res.json({
      success: true,
      message: 'Meta WhatsApp Cloud API credentials saved successfully!',
      isConfigured: Boolean(accessToken.trim() && phoneNumberId.trim())
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/whatsapp/twilio-config — Save Twilio WhatsApp Carrier Credentials
router.post('/twilio-config', (req, res) => {
  try {
    const { accountSid = '', authToken = '', whatsappNumber = '' } = req.body;
    const db = getDB();
    if (!db.data.settings) db.data.settings = {};

    db.data.settings.twilio_account_sid = accountSid.trim();
    db.data.settings.twilio_auth_token = authToken.trim();
    db.data.settings.twilio_whatsapp_number = whatsappNumber.trim();
    db.save();

    res.json({
      success: true,
      message: 'Twilio WhatsApp carrier credentials saved successfully!',
      isConfigured: Boolean(accountSid.trim() && authToken.trim())
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/whatsapp/webhook — Meta Webhook Verification Endpoint (Hub Challenge)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const db = getDB();
  const expectedToken = db.data.settings?.whatsapp_verify_token || 'orion_flux_secret_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('✅ [WHATSAPP WEBHOOK] Verified by Meta Cloud Servers successfully.');
    if (!db.data.settings) db.data.settings = {};
    db.data.settings.whatsapp_webhook_verified = true;
    db.save();
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// POST /api/whatsapp/webhook — Incoming WhatsApp Messages from Clients
router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (message) {
      const fromPhone = message.from;
      const text = message.text?.body || message.button?.text || '';
      console.log(`📱 [INCOMING WHATSAPP] From: ${fromPhone} | Body: "${text}"`);

      const reply = generateConversationalWhatsAppReply(text, fromPhone);

      const db = getDB();
      if (!db.data.whatsapp_messages) db.data.whatsapp_messages = [];
      db.data.whatsapp_messages.unshift({
        id: `wa-msg-${Date.now()}`,
        fromPhone,
        customerText: text,
        aiResponseText: reply.responseText,
        intentDetected: reply.intent,
        timestamp: new Date().toISOString()
      });
      db.save();

      // Dispatch response via Meta Cloud API if token configured
      const token = db.data.settings?.whatsapp_access_token;
      const phoneId = db.data.settings?.whatsapp_phone_number_id;

      if (token && phoneId) {
        fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: fromPhone,
            type: 'text',
            text: { body: reply.responseText }
          })
        }).catch(err => console.warn('[WhatsApp Dispatch Error]:', err.message));
      }
    }

    res.status(200).json({ status: 'EVENT_RECEIVED' });
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    res.status(200).json({ error: true });
  }
});

function generateConversationalWhatsAppReply(rawText = '', fromPhone = '') {
  const text = rawText.toLowerCase().trim();
  const db = getDB();
  const upiId = db.data.settings?.upi_id || '9690973030@ibl';

  const clean = fromPhone.replace(/\D/g, '');
  const lead = (db.data.leads || []).find(l => {
    if (!l.phone) return false;
    const lClean = l.phone.replace(/\D/g, '');
    return lClean.length >= 10 && clean.includes(lClean.slice(-10));
  });

  const company = lead?.company || 'Valued Business';
  const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const portalUrl = `${getPublicBaseUrl()}/portal/${slug}`;

  // 1. Intent: PRICING / CHARGES / RATE
  if (/price|pricing|charge|cost|fees|kitna|rate|kitne/i.test(text)) {
    return {
      intent: 'PRICING_INQUIRY',
      responseText: `Namaste ${company}! Hamari pricing 100% all-inclusive net hai bina kisi extra tax ke (Sec 22 CGST Exempt):\n\n` +
        `• Total Setup Fee: Flat ₹45,000 ($2,400)\n` +
        `• Refundable Pilot Token: Sirf ₹2,500 ($49)\n` +
        `• Includes: 24/7 WhatsApp AI Bot, 4K Showcase Video Reel, & Turnkey Staging Portal.\n\n` +
        `Live Client Portal dekhiye:\n${portalUrl}\n\n` +
        `Direct UPI ID for advance: ${upiId}`
    };
  }

  // 2. Intent: YES / INTERESTED / READY
  if (/yes|ha|haan|interested|ready|bhejo|demo|chalu/i.test(text)) {
    return {
      intent: 'POSITIVE_BUYING_SIGNAL',
      responseText: `Bahut badhiya! Humne ${company} ke liye private live client portal stage kar diya hai:\n\n` +
        `🔗 ${portalUrl}\n\n` +
        `Aap is link par click karke bot ko live test kar sakte hain. Sirf ₹2,500 token advance par hamara sprint aaj hi chalu ho jayega. UPI: ${upiId}`
    };
  }

  // 3. Intent: UTR / PAYMENT CONFIRMATION
  if (/[0-9]{12}|paid|transfer|done|gpay|phonepe/i.test(text)) {
    const utrMatch = text.match(/\b([0-9]{12})\b/);
    const utr = utrMatch ? utrMatch[1] : `UTR-PENDING`;

    return {
      intent: 'PAYMENT_UTR_SUBMITTED',
      responseText: `Dhanyawad! Transaction UTR ${utr} note kar liya gaya hai.\n\n` +
        `Hamara Autonomous Factory Engine verification ke baad aapke tamam assets compile karke live portal par unlock kar dega:\n${portalUrl}`
    };
  }

  // 4. Default Intelligent Fallback
  return {
    intent: 'GENERAL_INQUIRY',
    responseText: `Namaste ${company} Team! Main ORION FLUX Autonomous Studio se connect kar raha hoon.\n\n` +
      `Hum aapke business ke liye 24/7 WhatsApp customer inquiry bot aur 4K video ads setup karte hain taaki koi bhi customer reply na milne ki wajah se drop na ho.\n\n` +
      `Aapka private working demo portal yahan live hai:\n${portalUrl}\n\n` +
      `Kya aapko live demo pasand aaya?`
  };
}

export default router;
