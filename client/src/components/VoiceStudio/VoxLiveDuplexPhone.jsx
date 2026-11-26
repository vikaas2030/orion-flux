import React, { useState, useEffect, useRef } from 'react';

const SAMPLE_CALLER_PROMPTS = [
  'What are the charges and GST?',
  'How fast can you deploy my bot?',
  'Can you send me the live demo on WhatsApp?',
  'I have paid ₹2,500 advance via UPI, what is next?'
];

export default function VoxLiveDuplexPhone({ initialPhone = '+91 9690973030', companyName = 'Business Client' }) {
  // Mode: 'carrier' (Real Cellular Phone Call via Twilio) vs 'browser' (Mic/Audio Duplex Tester)
  const [activeTab, setActiveTab] = useState('carrier');

  // Carrier Telephony State
  const [carrierStatus, setCarrierStatus] = useState({
    isConfigured: false,
    gateway: 'Checking carrier...',
    fromNumber: 'Not Configured',
    totalCalls: 0,
    recentCalls: []
  });
  const [targetPhone, setTargetPhone] = useState(initialPhone);
  const [targetName, setTargetName] = useState(companyName);
  const [dealValue, setDealValue] = useState(45000);
  const [currency, setCurrency] = useState('INR');
  const [isCallingCarrier, setIsCallingCarrier] = useState(false);
  const [carrierCallResult, setCarrierCallResult] = useState(null);

  // Twilio Settings Modal
  const [showSettings, setShowSettings] = useState(false);
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioNumber, setTwilioNumber] = useState('');
  const [configSaving, setConfigSaving] = useState(false);
  const [configMsg, setConfigMsg] = useState('');

  // In-Browser Duplex Call State (Microphone & Synthesis)
  const [isBrowserCallActive, setIsBrowserCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState([
    {
      speaker: 'VOX AI',
      text: `Namaste! Main VOX bol raha hoon ORION FLUX Autonomous Studio se. Aapke business automation aur 24/7 AI intake ke baare mein aap mujhse koi bhi sawal pooch sakte hain.`
    }
  ]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInputText, setUserInputText] = useState('');
  const recognitionRef = useRef(null);

  // Fetch Telephony Status from backend
  const fetchCarrierStatus = async () => {
    try {
      const res = await fetch('/api/telephony/status');
      const data = await res.json();
      if (data.success) {
        setCarrierStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch telephony status:', err);
    }
  };

  useEffect(() => {
    fetchCarrierStatus();
  }, []);

  // Save Telephony Carrier Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigMsg('');
    try {
      const res = await fetch('/api/telephony/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountSid: twilioSid,
          authToken: twilioToken,
          phoneNumber: twilioNumber
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfigMsg('✅ Carrier credentials saved & verified!');
        fetchCarrierStatus();
        setTimeout(() => setShowSettings(false), 1200);
      } else {
        setConfigMsg(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setConfigMsg(`❌ Network Error: ${err.message}`);
    } finally {
      setConfigSaving(false);
    }
  };

  // Trigger Real Outbound Cellular Call via Twilio
  const handleTriggerCarrierCall = async () => {
    setIsCallingCarrier(true);
    setCarrierCallResult(null);
    try {
      const res = await fetch('/api/telephony/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientPhone: targetPhone,
          clientName: targetName,
          companyName: targetName,
          dealValue: Number(dealValue),
          currency
        })
      });
      const data = await res.json();
      setCarrierCallResult(data);
      fetchCarrierStatus();
    } catch (err) {
      setCarrierCallResult({
        success: false,
        message: `Network Error: ${err.message}`
      });
    } finally {
      setIsCallingCarrier(false);
    }
  };

  // -------------------------------------------------------------
  // In-Browser Duplex Call (SpeechSynthesis + Web Speech API)
  // -------------------------------------------------------------
  useEffect(() => {
    let timer = null;
    if (isBrowserCallActive) {
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      clearInterval(timer);
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isBrowserCallActive]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const spokenText = event.results[lastIndex][0].transcript.trim();
        if (spokenText) {
          handleCallerSpeech(spokenText);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => {
        if (isBrowserCallActive) {
          try { recognition.start(); } catch {}
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isBrowserCallActive]);

  const speakAiResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    utter.onstart = () => setIsAiSpeaking(true);
    utter.onend = () => setIsAiSpeaking(false);
    utter.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const handleStartBrowserCall = () => {
    setIsBrowserCallActive(true);
    setIsListening(true);
    const greeting = `Namaste ${targetName}! Main VOX bol raha hoon ORION FLUX Studio se. Aapki inquiry ke liye shukriya. B ਪ੍ਰਸ਼ਨ poochiye, main live guide karunga.`;
    speakAiResponse(greeting);

    try {
      recognitionRef.current?.start();
    } catch {}
  };

  const handleEndBrowserCall = () => {
    setIsBrowserCallActive(false);
    setIsListening(false);
    window.speechSynthesis?.cancel();
    setIsAiSpeaking(false);
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  const handleCallerSpeech = (spokenText) => {
    setTranscript(prev => [...prev, { speaker: 'Caller', text: spokenText }]);

    let aiReply = '';
    const clean = spokenText.toLowerCase();

    if (/price|pricing|charge|cost|rate|kitna|fees/i.test(clean)) {
      aiReply = `Hamara total fee flat ₹${Number(dealValue).toLocaleString()} hai bina kisi extra GST tax ke, Section 22 CGST Act ke exemption ke tehat. Initial 50% milestone advance token sirf ₹${Math.round(dealValue * 0.5).toLocaleString()} hai.`;
    } else if (/deploy|kitne din|delivery|time|ready/i.test(clean)) {
      aiReply = `Humara Autonomous Engine advance confirm hone ke baad 5 se 7 business days mein complete turnkey production handover kar deta hai, sath hi full source code aur IP ownership deed provide karta hai.`;
    } else if (/demo|whatsapp|portal|link/i.test(clean)) {
      aiReply = `Maine aapke liye private working demo portal stage kar diya hai. Link aapke WhatsApp par send ho chuka hai, jahan aap 4K video aur live intake bot test kar sakte hain.`;
    } else if (/paid|payment|paytm|gpay|utr/i.test(clean)) {
      aiReply = `Dhanyawad! Jaise hi aapka UTR confirm hota hai, hamara Zero-Human Delivery Engine turant aapke custom files compile karke staging portal unlock kar dega.`;
    } else {
      aiReply = `Bahut accha sawal hai. ORION FLUX aapke business ke liye 24/7 automated WhatsApp customer response aur 4K video ads build karta hai taaki koi client drop na ho. Kya aap aaj hi advance par apna setup shuru karwana chahte hain?`;
    }

    setTimeout(() => {
      setTranscript(prev => [...prev, { speaker: 'VOX AI', text: aiReply }]);
      speakAiResponse(aiReply);
    }, 400);
  };

  const handleManualSend = (e) => {
    e.preventDefault();
    if (!userInputText.trim()) return;
    handleCallerSpeech(userInputText.trim());
    setUserInputText('');
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      backgroundColor: '#070714',
      borderRadius: '16px',
      border: '1px solid #1e293b',
      borderTop: '3px solid #06b6d4',
      padding: '24px',
      marginBottom: '24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            border: '1px solid #06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            📞
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              VOX Autonomous Real AI Telephony & Voice Closer
            </h3>
            <span style={{ fontSize: '12px', color: '#38bdf8' }}>
              Autonomous Cellular Calling Rail + Real-Time Spoken Objection Handling & Closing
            </span>
          </div>
        </div>

        {/* Carrier Status Indicator & Config Button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: carrierStatus.isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
            border: `1px solid ${carrierStatus.isConfigured ? '#10b981' : '#eab308'}`,
            color: carrierStatus.isConfigured ? '#34d399' : '#fde047',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{carrierStatus.isConfigured ? '🟢 CARRIER ACTIVE' : '⚠️ CARRIER CREDENTIALS REQUIRED'}</span>
            <span style={{ color: '#94a3b8' }}>({carrierStatus.fromNumber})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚙️</span> Carrier Setup
          </button>
        </div>
      </div>

      {/* Settings Modal / Drawer */}
      {showSettings && (
        <div style={{
          backgroundColor: '#0a0f1d',
          border: '1px solid #38bdf8',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#38bdf8' }}>
            ⚙️ Telecom Carrier Integration (Twilio / Exotel Voice API)
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94a3b8' }}>
            Enter your Twilio Voice credentials to enable the system to autonomously ring real physical SIM cards anywhere in the world and talk to clients in fluent Hindi/English.
          </p>
          <form onSubmit={handleSaveConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Twilio Account SID</label>
              <input
                type="text"
                value={twilioSid}
                onChange={e => setTwilioSid(e.target.value)}
                placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Twilio Auth Token</label>
              <input
                type="password"
                value={twilioToken}
                onChange={e => setTwilioToken(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Twilio Outbound Phone Number</label>
              <input
                type="text"
                value={twilioNumber}
                onChange={e => setTwilioNumber(e.target.value)}
                placeholder="+1234567890 or +91..."
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <button
                type="submit"
                disabled={configSaving}
                style={{
                  padding: '9px 18px',
                  borderRadius: '6px',
                  backgroundColor: '#10b981',
                  color: '#020617',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {configSaving ? 'Saving...' : 'Save Carrier'}
              </button>
            </div>
          </form>
          {configMsg && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: configMsg.includes('✅') ? '#34d399' : '#f87171' }}>
              {configMsg}
            </div>
          )}
        </div>
      )}

      {/* Mode Switch Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('carrier')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'carrier' ? '#06b6d4' : '#1e293b',
            color: activeTab === 'carrier' ? '#000' : '#cbd5e1',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>📱</span> Real Cellular Phone Calling (Twilio Carrier)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('browser')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: activeTab === 'browser' ? '#10b981' : '#1e293b',
            color: activeTab === 'browser' ? '#000' : '#cbd5e1',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🎙️</span> In-Browser Microphone AI Tester (Free)
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: REAL CELLULAR TELEPHONE CALLING
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'carrier' && (
        <div style={{
          backgroundColor: '#020617',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          padding: '20px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f1f5f9' }}>
            📞 Autonomous Outbound Real Phone Call Dispatcher
          </h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#94a3b8' }}>
            This will ring the client's actual physical cellular smartphone. When they answer, the AI voice engine (Amazon Polly Hindi/English) speaks, understands their responses with speech recognition, answers objections, and sends the advance invoice to their WhatsApp.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Client Mobile Number (E.164 format)</label>
              <input
                type="text"
                value={targetPhone}
                onChange={e => setTargetPhone(e.target.value)}
                placeholder="+919690973030 or +1..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Company / Client Name</label>
              <input
                type="text"
                value={targetName}
                onChange={e => setTargetName(e.target.value)}
                placeholder="Business Name"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Deal Value ({currency})</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  style={{ padding: '10px 8px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px' }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <input
                  type="number"
                  value={dealValue}
                  onChange={e => setDealValue(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              disabled={isCallingCarrier}
              onClick={handleTriggerCarrierCall}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '800',
                fontSize: '14px',
                cursor: isCallingCarrier ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)'
              }}
            >
              <span>{isCallingCarrier ? '⏳' : '📞'}</span>
              {isCallingCarrier ? 'Placing Carrier Call...' : `Trigger Real Call to ${targetPhone}`}
            </button>

            {/* Direct Mobile Link */}
            <a
              href={`tel:${targetPhone.replace(/[^0-9+]/g, '')}`}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📲</span> 1-Tap Mobile Direct Dial (Vikas Handset)
            </a>

            <a
              href={`https://api.whatsapp.com/send?phone=${targetPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Namaste! Main Vikas Singh baat kar raha hoon ORION FLUX se ${targetName} ke liye. Humne aapka 24/7 AI system prepare kiya hai: https://dbaa24f9968e8a.lhr.life/demo`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: '#065f46',
                border: '1px solid #10b981',
                color: '#a7f3d0',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>💬</span> Direct WhatsApp Pitch
            </a>
          </div>

          {/* Call Result Alert */}
          {carrierCallResult && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: carrierCallResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              border: `1px solid ${carrierCallResult.success ? '#10b981' : '#eab308'}`,
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: carrierCallResult.success ? '#34d399' : '#fde047', marginBottom: '4px' }}>
                {carrierCallResult.success ? '✅ Call Dispatched to Carrier' : '⚠️ Action Notice'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.5 }}>
                {carrierCallResult.message}
              </div>
              {carrierCallResult.carrierSid && (
                <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '6px' }}>
                  Twilio Call SID: <code>{carrierCallResult.carrierSid}</code>
                </div>
              )}
            </div>
          )}

          {/* How the Real Autonomous Call Works */}
          <div style={{
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: '#070b16',
            border: '1px solid #1e293b'
          }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ℹ️ How Autonomous Calling Operates:
            </h5>
            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
              <li><strong>Carrier Dialing:</strong> Server makes REST call to Twilio/Exotel to ring client's mobile phone via cellular networks.</li>
              <li><strong>Pickup & Greeting:</strong> When client answers, the engine generates dynamic TwiML with Amazon Polly voice (fluent Hindi/English).</li>
              <li><strong>Real-Time Dialog:</strong> The engine listens to client's speech using Twilio Speech Recognition, classifies intent (pricing, timing, demo, objections), and replies intelligently.</li>
              <li><strong>Deal Closure:</strong> Client is offered 50% milestone advance or ₹2,500 pilot token, and invoice QR code is dispatched to their WhatsApp instantly.</li>
            </ol>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: IN-BROWSER MICROPHONE AI TESTER (FREE)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'browser' && (
        <div style={{
          backgroundColor: '#020617',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>In-Browser Simulation:</span>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                {targetName} ({targetPhone})
              </div>
            </div>

            <div>
              {!isBrowserCallActive ? (
                <button
                  type="button"
                  onClick={handleStartBrowserCall}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <span>🎙️</span> Start In-Browser Duplex Call
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndBrowserCall}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🔴</span> End Browser Call ({formatSeconds(callDuration)})
                </button>
              )}
            </div>
          </div>

          {/* Acoustic Indicator */}
          {isBrowserCallActive && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '12px', color: isAiSpeaking ? '#38bdf8' : '#10b981', fontWeight: '700' }}>
                {isAiSpeaking ? '🔊 VOX Speaking...' : isListening ? '🎙️ Listening to your mic... Speak in Hindi or English!' : 'Acoustic Standby'}
              </span>
            </div>
          )}

          {/* Transcript Box */}
          <div style={{
            backgroundColor: '#0a0e1a',
            borderRadius: '8px',
            padding: '14px',
            border: '1px solid #1e293b',
            maxHeight: '220px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '14px'
          }}>
            {transcript.map((item, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: item.speaker === 'Caller' ? 'flex-end' : 'flex-start',
                  backgroundColor: item.speaker === 'Caller' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: item.speaker === 'Caller' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '85%',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700', color: item.speaker === 'Caller' ? '#38bdf8' : '#34d399', marginBottom: '2px' }}>
                  {item.speaker}
                </div>
                <div style={{ color: '#f1f5f9' }}>{item.text}</div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
              💡 Quick Questions to Test VOX AI Responses:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {SAMPLE_CALLER_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCallerSpeech(p)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <form onSubmit={handleManualSend} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={userInputText}
                onChange={e => setUserInputText(e.target.value)}
                placeholder="Or type what a client would say to VOX..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#10b981',
                  color: '#020617',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Test AI
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
