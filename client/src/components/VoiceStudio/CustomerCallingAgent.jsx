import React, { useState, useEffect } from 'react';

export default function CustomerCallingAgent() {
  const [activeScenario, setActiveScenario] = useState('cold_hook');
  const [selectedClient, setSelectedClient] = useState({
    name: 'Vikram Malhotra (Apex Realty Group)',
    phone: '+91 98112 23344',
    city: 'Mumbai',
    niche: 'Luxury Real Estate',
    dealSize: '₹1,20,000'
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [callSaved, setCallSaved] = useState(false);
  const [isDialingCarrier, setIsDialingCarrier] = useState(false);
  const [carrierDialFeedback, setCarrierDialFeedback] = useState(null);

  const handleAutoCarrierDial = async () => {
    setIsDialingCarrier(true);
    setCarrierDialFeedback(null);
    try {
      const res = await fetch('/api/telephony/trigger-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientPhone: selectedClient.phone,
          clientName: selectedClient.name,
          companyName: selectedClient.name,
          dealValue: 120000,
          currency: 'INR'
        })
      });
      const data = await res.json();
      setCarrierDialFeedback(data);
    } catch (err) {
      setCarrierDialFeedback({ success: false, message: `Dial error: ${err.message}` });
    } finally {
      setIsDialingCarrier(false);
    }
  };

  // Scenarios Database with exact scripts (Hinglish + English)
  const callScenarios = {
    cold_hook: {
      title: '📞 Cold Call Opening Hook (First 20 Seconds)',
      objective: 'Hook the client without sounding like a spam telemarketer, establish instant authority and secure 2 minutes of attention.',
      dialogueEn: 'Namaste Vikram ji, this is calling regarding Apex Realty\'s luxury properties in Mumbai. I am calling because we noticed your property inquiries on MagicBricks and 99acres are taking hours to get responses. We built an autonomous WhatsApp lead follow-up system that books site visits with qualified buyers within 60 seconds. Do you have 2 minutes to see how this works?',
      dialogueHi: 'नमस्ते विक्रम जी, मैं ओरियन फ्लक्स से बात कर रहा हूँ। मैंने देखा कि मुंबई में एपेक्स रियल्टी की लक्ज़री लिस्टिंग्स पर बहुत बायर्स इन्क्वायरी कर रहे हैं, लेकिन फॉलो-अप में देरी की वजह से 40% बायर्स छूट जाते हैं। हमने एक ऐसा सिस्टम बनाया है जो 60 सेकंड के अंदर बायर्स से ऑटोमैटिक साइट विजिट बुक कर देता है। क्या आपके पास 2 मिनट हैं?',
      proTip: 'Speak slowly and calmly. Never ask "Is this a good time?" — jump straight into the painful problem you are solving.'
    },
    qualification: {
      title: '💡 Inbound Lead Qualification Call',
      objective: 'Ask diagnostic questions to determine their budget, urgency, and decision-making power.',
      dialogueEn: 'Vikram ji, before we show you the architecture: How many property inquiries do your sales managers handle every week? And approximately what percentage of them actually show up for site visits? ... Understood. Our system ensures at least 3x more confirmed visits by filtering out non-serious window shoppers automatically.',
      dialogueHi: 'विक्रम जी, सिस्टम दिखाने से पहले मैं समझना चाहता हूँ: हर हफ़्ते आपकी टीम के पास कितने बायर्स की कॉल्स आती हैं? और उनमें से कितने लोग सच में साइट देखने पहुँचते हैं? ... समझ गया। हमारा सिस्टम बिना किसी मेहनत के सीरियस बायर्स को फ़िल्टर करके आपकी साइट विजिट्स को 3 गुना बढ़ा देता है।',
      proTip: 'Listen 70% of the time. Let the client vent about how difficult manual follow-up is.'
    },
    price_objection: {
      title: '🛡️ Handling "Your Price is Too High" (₹75k - ₹1.5L)',
      objective: 'Reframe the price from an expense to an investment that generates 3x - 10x returns.',
      dialogueEn: 'I completely understand budget is important, Vikram ji. But let\'s look at the math: In Mumbai luxury real estate, a single flat sale earns you ₹10 Lakh to ₹25 Lakh in brokerage. If our system helps you close just ONE extra apartment this entire quarter from leads you were previously losing, the ₹1,20,000 setup fee is covered 10 times over on day one. Doesn\'t it make sense to protect your lead pipeline?',
      dialogueHi: 'मैं आपकी बात बिल्कुल समझता हूँ विक्रम जी। लेकिन ज़रा गणित देखिए: मुंबई में एक भी फ्लैट बिकने पर आपको 10 से 20 लाख का कमीशन मिलता है। अगर हमारा सिस्टम पूरे 3 महीने में सिर्फ एक एक्स्ट्रा फ्लैट भी बिकवा दे जो लीड आप वैसे गँवा रहे थे, तो यह ₹1,20,000 का खर्च पहले ही दिन 10 गुना वसूल हो जाता है। क्या यह सही नहीं है?',
      proTip: 'Never discount your price immediately. Contrast the fee against the value of ONE closed client.'
    },
    team_objection: {
      title: '🛡️ Handling "We Already Have an In-House Team"',
      objective: 'Show that this AI agent empowers their existing team rather than replacing them.',
      dialogueEn: 'That\'s fantastic Vikram ji, having a good sales team is critical. Our AI system doesn\'t replace your staff; it acts as their 24/7 assistant. Your team hates cold dialing and chasing unresponsive leads. Our agent does the boring 24/7 lead qualification, and hands your sales reps warm, ready-to-buy clients on a silver platter so they can focus on closing.',
      dialogueHi: 'यह तो बहुत अच्छी बात है विक्रम जी! हम आपकी टीम को हटा नहीं रहे, बल्कि उनका काम 10 गुना आसान कर रहे हैं। आपकी टीम को रात को 11 बजे लीड्स को कॉल करना पसंद नहीं होता। हमारा AI एजेंट 24 घंटे लीड्स को फ़िल्टर करके सिर्फ गरम बायर्स आपकी टीम की टेबल पर लाकर देता है ताकि वे सिर्फ डील क्लोज़ करें।',
      proTip: 'Position yourself as an ally who will make their sales team look like rockstars.'
    },
    closing_advance: {
      title: '🏆 Closing the Deal & Securing 50% Advance with UPI',
      objective: 'Confidently ask for the business, confirm start date, and issue the advance payment invoice.',
      dialogueEn: 'Excellent Vikram ji! We can have your full lead automation live in 5 business days. As per our standard agency SOP, we begin with a 50% advance of ₹60,000, and the remaining after deployment. I have just generated your tax invoice with a direct UPI QR code. Can I send it over WhatsApp right now so our engineering team can initialize your setup today?',
      dialogueHi: 'बहुत बढ़िया विक्रम जी! हम 5 दिनों के अंदर आपका पूरा सिस्टम लाइव कर देंगे। हमारी एजेंसी पॉलिसी के मुताबिक हम 50% एडवांस (₹60,000) से शुरुआत करते हैं और बाकी काम पूरा होने के बाद। मैंने आपका ऑफिशियल टैक्स इनवॉइस और UPI QR कोड तैयार कर लिया है। क्या मैं अभी व्हाट्सएप पर भेज दूँ ताकि हमारी टीम आज ही काम शुरू कर दे?',
      proTip: 'Assume the close. Send the UPI QR code immediately while their enthusiasm is at its peak.'
    }
  };

  const activeData = callScenarios[activeScenario];

  // Web Speech API Voiceover (Speaks Aloud)
  const speakDialogue = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Natural measured pace
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveCallLog = () => {
    setCallSaved(true);
    setTimeout(() => setCallSaved(false), 3000);
  };

  return (
    <div className="glass-card mb-24 animate-in" style={{ padding: '24px', borderLeft: '4px solid #06b6d4' }}>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '30px',
            background: 'rgba(6, 182, 212, 0.15)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #06b6d4'
          }}>
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                VOX Voice Closer AI — Customer Calling & Handling Agent
              </h3>
              <span className="badge badge-won" style={{ background: '#06b6d4', color: '#000', fontWeight: 'bold' }}>
                LIVE SPEECH SYNTHESIS ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Takes the stress, hesitation, and fear out of customer phone calls. Synthesizes professional closing dialogue aloud and guides every conversation to a paid advance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <span className="badge badge-new" style={{ fontSize: '11px', padding: '6px 12px' }}>
            🤝 Stress-Free Tele-Closing Protocol
          </span>
        </div>
      </div>

      {/* Client Quick Selector Strip */}
      <div className="glass-card mb-20" style={{ padding: '14px 18px', background: '#07070f', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center flex-wrap gap-12">
          <div className="flex items-center gap-10">
            <span style={{ fontSize: '18px' }}>👤</span>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active Prospect Call Profile</div>
              <strong style={{ fontSize: '13.5px', color: '#f1f5f9' }}>{selectedClient.name}</strong>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            📍 {selectedClient.city} • <strong>Target Deal:</strong> <span style={{ color: '#34d399', fontWeight: 'bold' }}>{selectedClient.dealSize}</span>
          </div>

          <div className="flex gap-8 items-center flex-wrap">
            {/* Auto AI Cellular Call via Twilio Carrier */}
            <button
              type="button"
              onClick={handleAutoCarrierDial}
              disabled={isDialingCarrier}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{isDialingCarrier ? '⏳' : '🤖'}</span>
              {isDialingCarrier ? 'Dialing SIM...' : 'Auto AI Cellular Dial'}
            </button>

            {/* Direct Phone Dial Link */}
            <a
              href={`tel:${selectedClient.phone}`}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📞</span> Manual Dial
            </a>

            {/* Direct WhatsApp Follow-up */}
            <a
              href={`https://api.whatsapp.com/send?phone=${selectedClient.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Namaste Vikram ji, thank you for speaking with me today. As discussed, I have attached our proposal and official advance invoice with direct UPI QR code for Apex Realty: https://orionflux.app/invoice/apex`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>💬</span> WhatsApp Follow-up
            </a>
          </div>
        </div>

        {carrierDialFeedback && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            backgroundColor: carrierDialFeedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
            border: `1px solid ${carrierDialFeedback.success ? '#10b981' : '#eab308'}`,
            fontSize: '12px',
            color: carrierDialFeedback.success ? '#34d399' : '#fde047'
          }}>
            {carrierDialFeedback.message}
          </div>
        )}
      </div>

      {/* Scenario Stage Selector */}
      <div className="flex gap-8 mb-20 flex-wrap" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn btn-sm ${activeScenario === 'cold_hook' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveScenario('cold_hook')}
          style={{ background: activeScenario === 'cold_hook' ? '#06b6d4' : undefined, color: activeScenario === 'cold_hook' ? '#000' : undefined }}
        >
          📞 Cold Opening Hook
        </button>
        <button
          className={`btn btn-sm ${activeScenario === 'qualification' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveScenario('qualification')}
          style={{ background: activeScenario === 'qualification' ? '#06b6d4' : undefined, color: activeScenario === 'qualification' ? '#000' : undefined }}
        >
          💡 Lead Qualification
        </button>
        <button
          className={`btn btn-sm ${activeScenario === 'price_objection' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveScenario('price_objection')}
          style={{ background: activeScenario === 'price_objection' ? '#ec4899' : undefined }}
        >
          🛡️ Price Objection Counter
        </button>
        <button
          className={`btn btn-sm ${activeScenario === 'team_objection' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveScenario('team_objection')}
          style={{ background: activeScenario === 'team_objection' ? '#8b5cf6' : undefined }}
        >
          🛡️ In-House Team Rebuttal
        </button>
        <button
          className={`btn btn-sm ${activeScenario === 'closing_advance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveScenario('closing_advance')}
          style={{ background: activeScenario === 'closing_advance' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined }}
        >
          🏆 50% Advance UPI Closer
        </button>
      </div>

      {/* Active Scenario Display Card */}
      <div className="glass-card mb-20" style={{ padding: '22px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>
              {activeData.title}
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              🎯 <strong>Call Objective:</strong> {activeData.objective}
            </div>
          </div>

          {/* Voice Synthesis Button */}
          <div className="flex items-center gap-8">
            {isSpeaking ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={stopSpeaking}
                style={{ background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⏹️</span> Stop Voice
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => speakDialogue(activeData.dialogueEn)}
                style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', display: 'flex', alignItems: 'center', gap: '6px', color: '#000', fontWeight: 'bold' }}
              >
                <span>🔊</span> Speak Script Aloud (AI Voice)
              </button>
            )}
          </div>
        </div>

        {/* Script Boxes: Hinglish & English */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {/* Hinglish Box */}
          <div style={{ background: '#080812', padding: '16px', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <div className="flex justify-between items-center mb-8">
              <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 'bold', textTransform: 'uppercase' }}>
                🇮🇳 Hindi / Hinglish Dialogue (Read or Speak to Client)
              </span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => copyToClipboard(activeData.dialogueHi, 'hi-script')}
              >
                {copiedKey === 'hi-script' ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: '1.6', fontStyle: 'italic' }}>
              "{activeData.dialogueHi}"
            </p>
          </div>

          {/* English Box */}
          <div style={{ background: '#080812', padding: '16px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
            <div className="flex justify-between items-center mb-8">
              <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase' }}>
                🌐 International English Dialogue (Corporate Standard)
              </span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => copyToClipboard(activeData.dialogueEn, 'en-script')}
              >
                {copiedKey === 'en-script' ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: '1.6', fontStyle: 'italic' }}>
              "{activeData.dialogueEn}"
            </p>
          </div>
        </div>

        {/* Telephony Pro-Tip */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span style={{ fontSize: '12px', color: '#fbbf24' }}>
            <strong>Closer Telephony Tip:</strong> {activeData.proTip}
          </span>
        </div>
      </div>

      {/* Call Summary & Logger */}
      <div className="glass-card" style={{ padding: '18px', background: '#06060c', border: '1px solid var(--border-color)' }}>
        <h5 style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
          📝 Post-Call Log & CRM Note
        </h5>
        <div className="flex gap-10">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="e.g. Vikram ji requested demo this Thursday 4 PM. Agrees on ₹1,20,000 fee."
            value={callNotes}
            onChange={e => setCallNotes(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            onClick={handleSaveCallLog}
          >
            {callSaved ? '✅ Call Logged!' : '💾 Save to CRM'}
          </button>
        </div>
      </div>
    </div>
  );
}
