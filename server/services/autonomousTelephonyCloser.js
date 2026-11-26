// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX AUTONOMOUS REAL AI TELEPHONY & VOICE CLOSER ENGINE
//  Real Outbound Telecom Calling Rail (Twilio / Exotel SIP REST API)
//  Natural Conversational Speech Dialog, Objection Answering & Automated Closing
//  Authorized Signatory: Vikas Singh (Founder & Managing Principal)
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';
import { dispatchOwnerAlert } from './ownerAlertEngine.js';

let telephonyState = {
  activeCalls: [],
  callHistory: [],
  totalCallsPlaced: 0,
  totalCallsCompleted: 0
};

/**
 * Normalizes phone numbers to standard E.164 international format (+91... or +1...)
 */
export function formatE164Phone(rawPhone, defaultCountry = 'India') {
  if (!rawPhone) return null;
  let digits = rawPhone.replace(/[^0-9+]/g, '');
  if (digits.startsWith('+')) return digits;
  
  if (defaultCountry.toLowerCase() === 'india') {
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  } else if (defaultCountry.toLowerCase() === 'united states' || defaultCountry.toLowerCase() === 'usa') {
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  } else if (defaultCountry.toLowerCase() === 'united arab emirates' || defaultCountry.toLowerCase() === 'uae') {
    if (digits.startsWith('971')) return `+${digits}`;
    if (digits.startsWith('0')) return `+971${digits.slice(1)}`;
  } else if (defaultCountry.toLowerCase() === 'united kingdom' || defaultCountry.toLowerCase() === 'uk') {
    if (digits.startsWith('44')) return `+${digits}`;
    if (digits.startsWith('0')) return `+44${digits.slice(1)}`;
  }
  
  return digits.length >= 10 ? `+${digits}` : null;
}

/**
 * Checks if real telecom credentials (Twilio) are configured
 */
export function getTelephonyCredentials() {
  const db = getDB();
  const settings = db.data.settings || {};

  const accountSid = process.env.TWILIO_ACCOUNT_SID || settings.twilio_account_sid || null;
  const authToken = process.env.TWILIO_AUTH_TOKEN || settings.twilio_auth_token || null;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || settings.twilio_phone_number || null;

  const isConfigured = Boolean(
    accountSid && 
    authToken && 
    fromNumber && 
    !accountSid.includes('your-') && 
    !authToken.includes('your-')
  );

  return {
    isConfigured,
    accountSid,
    authToken,
    fromNumber,
    gateway: isConfigured ? 'Twilio Voice Telecom Carrier' : 'Unconfigured (Requires Twilio Account SID & Token)'
  };
}

/**
 * Initiates a REAL Outbound Telephone Call to a Client's Mobile Phone
 */
export async function initiateRealPhoneCall({ clientPhone, clientName, companyName, dealValue, currency = 'INR', dealId }) {
  const creds = getTelephonyCredentials();
  const formattedTo = formatE164Phone(clientPhone, currency === 'USD' ? 'USA' : 'India');

  if (!formattedTo) {
    throw new Error(`Invalid or unroutable client phone number: "${clientPhone}"`);
  }

  const baseUrl = getPublicBaseUrl();
  const company = companyName || clientName || 'Enterprise Partner';
  const callPayload = {
    callId: `CALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    clientName,
    company,
    phone: formattedTo,
    dealId,
    dealValue: dealValue || (currency === 'USD' ? 2400 : 45000),
    currency,
    initiatedAt: new Date().toISOString(),
    status: 'DIALING'
  };

  // If real Twilio credentials are active, place actual carrier call
  if (creds.isConfigured) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${creds.accountSid}:${creds.authToken}`).toString('base64');
      const twimlUrl = `${baseUrl}/api/telephony/twiml-voice?callId=${encodeURIComponent(callPayload.callId)}&company=${encodeURIComponent(company)}&currency=${currency}&dealValue=${callPayload.dealValue}`;
      const statusCallback = `${baseUrl}/api/telephony/call-status`;

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${creds.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: creds.fromNumber,
          Url: twimlUrl,
          StatusCallback: statusCallback,
          StatusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
          Record: 'true'
        }),
        signal: AbortSignal.timeout(10000)
      });

      const data = await response.json();

      if (response.ok && data.sid) {
        callPayload.twilioCallSid = data.sid;
        callPayload.status = data.status || 'QUEUED_ON_CARRIER';
        telephonyState.totalCallsPlaced++;
        telephonyState.callHistory.unshift(callPayload);

        const db = getDB();
        if (!db.data.activities) db.data.activities = [];
        db.data.activities.unshift({
          id: `act-call-${Date.now()}`,
          type: 'real_phone_call_initiated',
          title: `📞 Real Outbound Phone Call Placed: ${company}`,
          description: `Dialed ${formattedTo} via Telecom Rail (${creds.fromNumber}). Twilio Call SID: ${data.sid}. Conversational AI live on line.`,
          timestamp: new Date().toISOString()
        });
        db.save();

        return {
          success: true,
          mode: 'real_telecom_carrier',
          carrierSid: data.sid,
          status: data.status,
          message: `✅ Real telephone call initiated to ${formattedTo}. The client's physical phone is ringing!`,
          callPayload
        };
      } else {
        throw new Error(data.message || 'Carrier rejected outbound call request');
      }
    } catch (carrierErr) {
      console.warn('[Telecom Carrier Error]:', carrierErr.message);
      return {
        success: false,
        mode: 'carrier_error',
        error: carrierErr.message,
        message: `⚠️ Telecom carrier error: ${carrierErr.message}. Ensure Twilio account has outbound calling credits enabled.`
      };
    }
  }

  // If credentials are not yet entered, stage the call and provide instructions
  return {
    success: false,
    mode: 'credentials_required',
    error: 'TWILIO_NOT_CONFIGURED',
    formattedPhone: formattedTo,
    message: `Telecom gateway credentials not found. To place real physical phone calls directly to ${formattedTo}, enter your Twilio Account SID, Auth Token & Twilio Number in Settings, or use 1-Tap Mobile Dial below.`,
    directDialUrl: `tel:${formattedTo}`,
    callPayload
  };
}

/**
 * Generates Conversational TwiML for incoming/answered telecom voice calls
 */
export function generateVoiceTwiML({ company, currency = 'INR', dealValue, step = 'intro', speechResult = '' }) {
  const isUSD = currency === 'USD';
  const currencySymbol = isUSD ? '$' : '₹';
  const fee = Number(dealValue) || (isUSD ? 2400 : 45000);
  const advance = Math.round(fee * 0.5);
  const pilotFee = isUSD ? 50 : 2500;

  const publicUrl = getPublicBaseUrl();

  // 1. Initial Greeting when client picks up
  if (step === 'intro') {
    const greetingText = isUSD
      ? `Hello! This is VOX from ORION FLUX Autonomous Global OS calling for the leadership team at ${company}. We have deployed a 24/7 AI client booking and 4K showcase video system tailored for your business. Are you available for a brief two-minute conversation about this?`
      : `Namaste! Main VOX bol raha hoon ORION FLUX Autonomous Agency se ${company} ke liye. Humne aapke business ke liye ek 24/7 automated WhatsApp customer booking aur 4K video ads system stage kiya hai jisse koi client miss na ho. Kya aap iske baare mein do minute baat kar sakte hain?`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="${isUSD ? 'en-US' : 'hi-IN'}">${greetingText}</Say>
  <Gather input="speech" timeout="4" language="${isUSD ? 'en-US' : 'hi-IN'}" action="${publicUrl}/api/telephony/voice-respond?step=conversation&amp;company=${encodeURIComponent(company)}&amp;currency=${currency}&amp;dealValue=${fee}" method="POST">
    <Pause length="1"/>
  </Gather>
  <Say voice="Polly.Aditi" language="${isUSD ? 'en-US' : 'hi-IN'}">${isUSD ? 'I could not hear your response. We have sent your private staging link via message. Have a wonderful day!' : 'Aapki aawaz hum tak nahi pahunch paayi. Humne aapka live portal link message par share kar diya hai. Dhanyawad!'}</Say>
  <Hangup/>
</Response>`;
  }

  // 2. Intelligent Real-Time Speech Evaluation & Conversational Reply
  const query = (speechResult || '').toLowerCase();
  let replyText = '';
  let shouldContinue = true;

  if (query.includes('price') || query.includes('cost') || query.includes('charge') || query.includes('kitna') || query.includes('paisa') || query.includes('kharcha')) {
    replyText = isUSD
      ? `Our turnkey enterprise AI system is a flat $${fee.toLocaleString()} USD all-inclusive with zero extra taxes. You can start with our 100% refundable $${pilotFee} pilot token, or release 50% milestone advance of $${advance.toLocaleString()} upon inspection. Would you like me to dispatch the live preview link to your phone?`
      : `Hamara complete 24/7 automated business system flat ₹${fee.toLocaleString()} ka hai bina kisi extra GST surcharge ke Section 22 ke tehat. Aap chahein to sirf ₹${pilotFee.toLocaleString()} ke fully refundable pilot token se start kar sakte hain ya 50% milestone advance jo ₹${advance.toLocaleString()} hai. Kya main aapke is number par WhatsApp link bhej doon?`;
  } else if (query.includes('yes') || query.includes('bhejo') || query.includes('send') || query.includes('haan') || query.includes('sure') || query.includes('whatsapp') || query.includes('link')) {
    replyText = isUSD
      ? `Fantastic! I am dispatching your private production staging portal to this phone right now via WhatsApp and SMS. You can inspect your 4K video reel and AI assistant immediately. Thank you for your time, have a great day!`
      : `Shandar! Main aapke is number par abhi WhatsApp aur SMS se private live staging portal share kar raha hoon. Aap wahan live bot aur 4K video preview test kar sakte hain. Vikas Singh ji ki team aapse connected rahegi. Dhanyawad!`;
    shouldContinue = false;
  } else if (query.includes('not interested') || query.includes('nahi chahiye') || query.includes('busy') || query.includes('baad me') || query.includes('later')) {
    replyText = isUSD
      ? `Understood completely! We respect your time. I will leave our contact details and portfolio link with you for future reference. Have a productive day ahead!`
      : `Bilkul koi baat nahi ji! Hum aapka samay samajhte hain. Humne aapki reference ke liye ek summary SMS bhej di hai. Jab bhi zaroorat ho aap humse connect kar sakte hain. Shubh din!`;
    shouldContinue = false;
  } else {
    // General objection / clarification
    replyText = isUSD
      ? `We understand your requirements. Unlike generic chatbots, our system guarantees sub-second response times, 4K Retina video assets, and a 14-day zero-risk money-back guarantee authorized by Vikas Singh. May I send you the 1-minute live demo?`
      : `Aapka point bilkul sahi hai. Hamara system normal bots se alag sub-second response time deta hai, 4K video reels banata hai aur Vikas Singh ji dwara 14-day money-back guarantee ke sath aata hai. Kya main aapko iska 1-minute live demo dikhaoon?`;
  }

  if (shouldContinue) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="${isUSD ? 'en-US' : 'hi-IN'}">${replyText}</Say>
  <Gather input="speech" timeout="4" language="${isUSD ? 'en-US' : 'hi-IN'}" action="${publicUrl}/api/telephony/voice-respond?step=conversation&amp;company=${encodeURIComponent(company)}&amp;currency=${currency}&amp;dealValue=${fee}" method="POST">
    <Pause length="1"/>
  </Gather>
  <Say voice="Polly.Aditi" language="${isUSD ? 'en-US' : 'hi-IN'}">${isUSD ? 'Thank you for connecting with ORION FLUX. Goodbye!' : 'ORION FLUX se baat karne ke liye dhanyawad. Namaste!'}</Say>
  <Hangup/>
</Response>`;
  } else {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="${isUSD ? 'en-US' : 'hi-IN'}">${replyText}</Say>
  <Hangup/>
</Response>`;
  }
}
