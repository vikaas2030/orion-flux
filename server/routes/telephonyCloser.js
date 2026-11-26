import express from 'express';
import {
  getTelephonyCredentials,
  initiateRealPhoneCall,
  generateVoiceTwiML
} from '../services/autonomousTelephonyCloser.js';
import { getDB } from '../config/database.js';

const router = express.Router();

// GET /api/telephony/status — Check Telephony Gateway & Carrier Configuration
router.get('/status', (req, res) => {
  try {
    const creds = getTelephonyCredentials();
    const db = getDB();
    const history = db.data.telephony_call_history || [];

    res.json({
      success: true,
      isConfigured: creds.isConfigured,
      gateway: creds.gateway,
      fromNumber: creds.fromNumber || 'Not Configured',
      accountSid: creds.accountSid ? `${creds.accountSid.slice(0, 6)}...${creds.accountSid.slice(-4)}` : null,
      totalCalls: history.length,
      recentCalls: history.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telephony/config — Save Telecom Carrier Credentials (Twilio / Exotel)
router.post('/config', (req, res) => {
  try {
    const { accountSid = '', authToken = '', phoneNumber = '' } = req.body;
    const db = getDB();
    if (!db.data.settings) db.data.settings = {};

    db.data.settings.twilio_account_sid = accountSid.trim();
    db.data.settings.twilio_auth_token = authToken.trim();
    db.data.settings.twilio_phone_number = phoneNumber.trim();
    db.save();

    res.json({
      success: true,
      message: 'Telephony carrier credentials saved successfully!',
      isConfigured: Boolean(accountSid.trim() && authToken.trim() && phoneNumber.trim())
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telephony/trigger-call — Initiate Real Physical Phone Call to Client
router.post('/trigger-call', async (req, res) => {
  try {
    const { clientPhone, clientName, companyName, dealValue, currency, dealId } = req.body;
    if (!clientPhone) {
      return res.status(400).json({ error: true, message: 'clientPhone is required' });
    }

    const result = await initiateRealPhoneCall({
      clientPhone,
      clientName,
      companyName,
      dealValue,
      currency,
      dealId
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// ALL /api/telephony/twiml-voice — TwiML Voice Entrypoint when call connects
router.all('/twiml-voice', (req, res) => {
  try {
    const company = req.query.company || req.body?.company || 'Valued Partner';
    const currency = req.query.currency || req.body?.currency || 'INR';
    const dealValue = req.query.dealValue || req.body?.dealValue || 45000;

    const xml = generateVoiceTwiML({
      company,
      currency,
      dealValue,
      step: 'intro'
    });

    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (err) {
    res.set('Content-Type', 'text/xml');
    res.send(`<Response><Say>Connection established. Goodbye.</Say><Hangup/></Response>`);
  }
});

// POST /api/telephony/voice-respond — Real-Time Conversational AI Response to Spoken Client Speech
router.post('/voice-respond', (req, res) => {
  try {
    const company = req.query.company || 'Valued Partner';
    const currency = req.query.currency || 'INR';
    const dealValue = req.query.dealValue || 45000;
    const speechResult = req.body?.SpeechResult || req.query.SpeechResult || '';

    const xml = generateVoiceTwiML({
      company,
      currency,
      dealValue,
      step: 'conversation',
      speechResult
    });

    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (err) {
    res.set('Content-Type', 'text/xml');
    res.send(`<Response><Say>Thank you for connecting with ORION FLUX. Have a wonderful day.</Say><Hangup/></Response>`);
  }
});

// POST /api/telephony/call-status — Carrier Status Callback Webhook
router.post('/call-status', (req, res) => {
  try {
    const { CallSid, CallStatus, Duration, To, From } = req.body;
    const db = getDB();

    if (!db.data.telephony_call_history) db.data.telephony_call_history = [];
    const existing = db.data.telephony_call_history.find(c => c.twilioCallSid === CallSid);

    if (existing) {
      existing.status = CallStatus;
      existing.duration = Duration;
      existing.updatedAt = new Date().toISOString();
    } else {
      db.data.telephony_call_history.unshift({
        twilioCallSid: CallSid,
        to: To,
        from: From,
        status: CallStatus,
        duration: Duration,
        loggedAt: new Date().toISOString()
      });
    }

    db.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(200);
  }
});

export default router;
