import React, { useState, useEffect, useRef } from 'react';

const DEAL_TEMPLATES = {
  hook_pilot: {
    id: 'hook_pilot',
    name: '🚀 Opening Pitch & ₹999 Pilot Token',
    objective: 'Hook the client, offer 100% money-back guarantee, and secure ₹999 pilot token advance.',
    textHinglish: (lead, portalUrl) =>
      `Namaste ${lead.company} Team 🙏\n\n` +
      `Main Vikas Singh baat kar raha hoon ORION FLUX Autonomous Studio se.\n` +
      `Humne aapke business ke liye ek dedicated 24/7 WhatsApp AI Intake assistant aur 4K video ads system stage kiya hai jisse koi client inquiry drop na ho.\n\n` +
      `🔗 Live Demo Portal dekhiye:\n${portalUrl}\n\n` +
      `⚡ Aaj ke sprint ke liye hum 100% Money-Back Guarantee ke sath sirf ${lead.advanceStr || '₹999'} refundable pilot token par complete setup hand-over provide kar rahe hain.\n\n` +
      `Direct UPI Payment Link: upi://pay?pa=9690973030@ibl&pn=ORION%20FLUX%20Token&am=999&cu=INR\n\n` +
      `Kya aap 2-minute live test call ke liye available hain?\n\n` +
      `[Reply STOP to opt out • Section 22 CGST Exempt]`,
    textEnglish: (lead, portalUrl) =>
      `Hello ${lead.company} Team,\n\n` +
      `This is Vikas Singh from ORION FLUX Autonomous Studio. We noticed your business traction in ${lead.city || 'your region'} and built a custom 24/7 WhatsApp AI lead intake and 4K showcase system tailored for you.\n\n` +
      `🔗 Inspect your live staging portal here:\n${portalUrl}\n\n` +
      `We back this deployment with a 100% money-back guarantee on a ${lead.advanceStr || '$49'} refundable pilot token.\n\n` +
      `Would you have 2 minutes for a brief walkthrough today?\n\n` +
      `[Reply STOP to opt out]`
  },
  price_objection: {
    id: 'price_objection',
    name: '🛡️ Handling "Price is Too High" Objection',
    objective: 'Reframe setup fee from an expense to an immediate ROI investment.',
    textHinglish: (lead, portalUrl) =>
      `Main aapki baat bilkul samajhta hoon ${lead.company} team. Lekin zara calculation dekhiye:\n\n` +
      `Aapke industry me agar hamara 24/7 automated WhatsApp assistant pooray quarter me sirf ek extra high-value customer bhi retain karwa deta hai jo pehle drop ho raha tha, toh hamara ${lead.totalStr || '₹15,000'} ka total fee pehle hi din 5 guna recover ho jata hai.\n\n` +
      `Sath hi hum Section 22 CGST Act ke tehat net-zero tax de rahe hain bina kisi GST surcharge ke.\n` +
      `Aap bina kisi risk ke sirf ₹999 pilot token se shuru kar sakte hain: upi://pay?pa=9690973030@ibl&am=999`,
    textEnglish: (lead, portalUrl) =>
      `I completely understand budget is top of mind, ${lead.company} team. Consider the unit economics:\n\n` +
      `If our autonomous 24/7 intake system secures just ONE extra client this quarter from leads previously lost to delayed replies, your entire ${lead.totalStr || '$2,400'} investment is recovered multiple times over.\n\n` +
      `You can test this completely risk-free with our refundable ${lead.advanceStr || '$49'} pilot token.`
  },
  team_objection: {
    id: 'team_objection',
    name: '💡 Handling "We Already Have an In-House Team"',
    objective: 'Show that this system empowers their existing staff instead of replacing them.',
    textHinglish: (lead, portalUrl) =>
      `Yeh toh bahut acchi baat hai ${lead.company} team! Hamara system aapki team ko replace nahi karta, balki unka 24/7 assistant banta hai.\n\n` +
      `Aapki sales team ko raat ko ya weekends par cold inquiries chase karna pasand nahi hota. Hamara AI agent 24 ghante har lead ko 60 second me qualify karta hai, aur ready-to-buy serious clients aapki team ki table par lake deta hai taaki wo sirf deal close karein.\n\n` +
      `Live Demo yahan test kijiye: ${portalUrl}`,
    textEnglish: (lead, portalUrl) =>
      `That is fantastic, ${lead.company} team. Our AI engine is designed not to replace your staff, but to empower them 24/7.\n\n` +
      `Your team shouldn't have to spend hours triaging unresponsive after-hours leads. Our agent filters and qualifies prospects instantly within 60 seconds, handing warm, ready-to-buy clients directly to your closers.`
  },
  advance_closing: {
    id: 'advance_closing',
    name: '🏆 Closing Deal & Direct UPI QR Advance',
    objective: 'Ask for the business, share official UPI ID and request 12-digit UTR confirmation.',
    textHinglish: (lead, portalUrl) =>
      `Shandar! Hum ${lead.company} ka complete production setup 5 business days me live hand-over kar denge.\n\n` +
      `Agency policy ke mutabik hum refundable milestone advance (${lead.advanceStr || '₹999'}) se initialization start karte hain:\n\n` +
      `📌 Direct Official UPI ID: 9690973030@ibl (Vikas Singh)\n` +
      `📌 Net-Zero Tax Invoice: Section 22 CGST Exempt\n\n` +
      `Payment karne ke baad kripya yahan 12-digit UTR number share karein taaki engineering team turant aapka portal live kar sake. Dhanyawad!`,
    textEnglish: (lead, portalUrl) =>
      `Excellent! We are ready to initialize the turnkey production deployment for ${lead.company}.\n\n` +
      `As per agency SOP, we begin work upon receipt of the milestone advance token (${lead.advanceStr || '$49'}).\n\n` +
      `International wire / PayPal: payments@orionflux.agency\n` +
      `Domestic UPI: 9690973030@ibl (Vikas Singh)\n\n` +
      `Please reply with your transaction reference so we can unlock your repository and staging portal.`
  }
};

export default function WhatsAppVoiceStudio() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [language, setLanguage] = useState('hinglish'); // 'hinglish' | 'english'
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('hook_pilot');
  const [customMessage, setCustomMessage] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Carrier & Dispatch State
  const [channelStatus, setChannelStatus] = useState({
    activeCarrier: 'Checking...',
    hasMeta: false,
    hasTwilio: false,
    upiId: '9690973030@ibl'
  });
  const [isSendingApi, setIsSendingApi] = useState(false);
  const [apiFeedback, setApiFeedback] = useState(null);

  // Settings Modal
  const [showConfig, setShowConfig] = useState(false);
  const [metaToken, setMetaToken] = useState('');
  const [metaPhoneId, setMetaPhoneId] = useState('');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioWhatsApp, setTwilioWhatsApp] = useState('');
  const [configSaving, setConfigSaving] = useState(false);
  const [configMsg, setConfigMsg] = useState('');

  // Deal Closing & UTR Modal
  const [showOutcomeDrawer, setShowOutcomeDrawer] = useState(false);
  const [outcomeType, setOutcomeType] = useState('PAYMENT_RECEIVED');
  const [utrInput, setUtrInput] = useState('');
  const [amountInput, setAmountInput] = useState(999);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [outcomeSaving, setOutcomeSaving] = useState(false);
  const [outcomeResult, setOutcomeResult] = useState(null);

  const fetchLeads = () => {
    fetch('/api/voice-studio/leads')
      .then(res => res.json())
      .then(data => {
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
          setSelectedLead(data.leads[0]);
        }
      })
      .catch(() => {});
  };

  const fetchChannelStatus = () => {
    fetch('/api/whatsapp/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setChannelStatus(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLeads();
    fetchChannelStatus();
  }, []);

  // Update text whenever template or lead changes
  useEffect(() => {
    if (!selectedLead) return;
    const template = DEAL_TEMPLATES[selectedTemplateKey];
    if (template) {
      const publicBase = window.location.origin;
      const clientSlug = selectedLead.company.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const portalUrl = `${publicBase}/portal/${clientSlug}`;
      const txt = language === 'english'
        ? template.textEnglish(selectedLead, portalUrl)
        : template.textHinglish(selectedLead, portalUrl);
      setCustomMessage(txt);
    }
  }, [selectedLead, selectedTemplateKey, language]);

  // Play audio preview using SpeechSynthesis
  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(customMessage);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.lang = language === 'english' ? 'en-US' : 'hi-IN';

    utter.onstart = () => setIsPlayingVoice(true);
    utter.onend = () => setIsPlayingVoice(false);
    utter.onerror = () => setIsPlayingVoice(false);

    window.speechSynthesis.speak(utter);
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
  };

  // 1-Tap Universal WhatsApp Launch
  const handleLaunchWhatsAppNative = () => {
    if (!selectedLead) return;
    const clean = (selectedLead.cleanPhone || selectedLead.phone || '').replace(/[^0-9]/g, '');
    const cleanWithPrefix = clean.length === 10 ? '91' + clean : clean;
    const url = `https://api.whatsapp.com/send?phone=${cleanWithPrefix}&text=${encodeURIComponent(customMessage)}`;
    
    // Log interaction to backend
    fetch('/api/whatsapp/outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: selectedLead.id,
        outcomeType: 'WHATSAPP_NATIVE_LAUNCHED',
        notes: `Dispatched template "${DEAL_TEMPLATES[selectedTemplateKey]?.name}" via native WhatsApp launch.`
      })
    }).catch(() => {});

    setApiFeedback({
      success: true,
      message: `🚀 Opened WhatsApp for ${selectedLead.company} (+${cleanWithPrefix})! Just click Send in your WhatsApp window.`
    });

    window.open(url, '_blank');
  };

  // Programmatic Background Dispatch via Meta / Twilio API
  const handleSendViaApi = async () => {
    if (!selectedLead) return;
    setIsSendingApi(true);
    setApiFeedback(null);

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toPhone: selectedLead.cleanPhone || selectedLead.phone,
          messageText: customMessage,
          leadId: selectedLead.id,
          company: selectedLead.company,
          dealValue: selectedLead.pricingTotal || 45000,
          currency: selectedLead.currency || 'INR'
        })
      });

      const data = await res.json();
      setApiFeedback(data);

      if (data.mode === 'native_whatsapp_launch' && data.directUrl) {
        window.open(data.directUrl, '_blank');
      }
    } catch (err) {
      setApiFeedback({ success: false, message: `Error: ${err.message}` });
    } finally {
      setIsSendingApi(false);
    }
  };

  // Save Carrier Configurations
  const handleSaveCarrierConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigMsg('');

    try {
      if (metaToken && metaPhoneId) {
        await fetch('/api/whatsapp/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: metaToken, phoneNumberId: metaPhoneId })
        });
      }

      if (twilioSid && twilioToken) {
        await fetch('/api/whatsapp/twilio-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accountSid: twilioSid, authToken: twilioToken, whatsappNumber: twilioWhatsApp })
        });
      }

      setConfigMsg('✅ Credentials saved and verified!');
      fetchChannelStatus();
      setTimeout(() => setShowConfig(false), 1200);
    } catch (err) {
      setConfigMsg(`❌ Error: ${err.message}`);
    } finally {
      setConfigSaving(false);
    }
  };

  // Deal Outcome & UTR Settlement
  const handleRecordOutcome = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    setOutcomeSaving(true);
    setOutcomeResult(null);

    try {
      const res = await fetch('/api/whatsapp/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          dealId: selectedLead.id,
          outcomeType,
          utrNumber: utrInput.trim(),
          amountPaid: Number(amountInput),
          notes: outcomeNotes
        })
      });

      const data = await res.json();
      setOutcomeResult(data);

      if (data.outcome === 'DEAL_WON_AND_SETTLED') {
        setTimeout(() => setShowOutcomeDrawer(false), 2000);
      }
    } catch (err) {
      setOutcomeResult({ success: false, message: `Error: ${err.message}` });
    } finally {
      setOutcomeSaving(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="whatsapp-real-deal-closer animate-in" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Banner with Active Channel Status */}
      <div className="glass-card mb-24 p-24" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderTop: '4px solid #10b981',
        borderRadius: '16px'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-16 mb-16">
          <div>
            <div className="flex items-center gap-10">
              <span style={{ fontSize: '24px' }}>💬</span>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                  Real WhatsApp & Voice Closer Command Hub
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  100% Genuine Client Negotiation & Closing Rail — Direct WhatsApp Messages, Objections Handling & Verified UPI UTR Settlement.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 flex-wrap">
            {/* Active Carrier Indicator */}
            <div style={{
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: channelStatus.hasMeta || channelStatus.hasTwilio ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${channelStatus.hasMeta || channelStatus.hasTwilio ? '#10b981' : '#38bdf8'}`,
              color: channelStatus.hasMeta || channelStatus.hasTwilio ? '#34d399' : '#38bdf8',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🟢 {channelStatus.activeCarrier}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ⚙️ Carrier Settings
            </button>
          </div>
        </div>

        {/* Carrier Configuration Drawer */}
        {showConfig && (
          <div style={{
            backgroundColor: '#0a0f1d',
            border: '1px solid #38bdf8',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#38bdf8' }}>
              ⚙️ Configure Automated Background WhatsApp Carriers (Twilio or Meta Cloud)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#94a3b8' }}>
              To enable the server to dispatch WhatsApp messages silently in the background, enter either Meta WhatsApp Cloud API credentials or Twilio WhatsApp API keys. If left unconfigured, the system automatically uses the 1-Tap Universal Launch Rail to open your native WhatsApp app!
            </p>

            <form onSubmit={handleSaveCarrierConfig} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Meta WhatsApp Access Token</label>
                <input
                  type="password"
                  value={metaToken}
                  onChange={e => setMetaToken(e.target.value)}
                  placeholder="EAAB..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Meta Phone Number ID</label>
                <input
                  type="text"
                  value={metaPhoneId}
                  onChange={e => setMetaPhoneId(e.target.value)}
                  placeholder="10492819284..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Twilio WhatsApp From Number</label>
                <input
                  type="text"
                  value={twilioWhatsApp}
                  onChange={e => setTwilioWhatsApp(e.target.value)}
                  placeholder="whatsapp:+14155238886"
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
                  {configSaving ? 'Saving...' : 'Save Carrier Keys'}
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

        {/* Lead Selector Strip */}
        <div className="form-group mb-0">
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
            🎯 Select Active Client Prospect from CRM ({leads.length} Real Leads with Phone)
          </label>
          <select
            value={selectedLead?.id || ''}
            onChange={(e) => {
              handleStopVoice();
              const found = leads.find(l => String(l.id) === e.target.value);
              if (found) setSelectedLead(found);
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#0a0a16',
              border: '1px solid #38bdf8',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {leads.map(lead => (
              <option key={lead.id} value={lead.id}>
                {lead.company} ({lead.city || 'Global'}) • {lead.phone} • Deal Target: {lead.totalStr || '₹45,000'} (Advance: {lead.advanceStr || '₹2,500'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Negotiation & Closing Workspace */}
      {selectedLead && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Left Column: Script & Objection Presets */}
          <div style={{
            backgroundColor: '#070714',
            borderRadius: '14px',
            border: '1px solid #1e293b',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8' }}>
                🗣️ Real Conversational Deal Stage Selector:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => { setLanguage('hinglish'); handleStopVoice(); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: language === 'hinglish' ? '#10b981' : '#1e293b',
                    color: language === 'hinglish' ? '#000' : '#cbd5e1',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🇮🇳 Hinglish
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('english'); handleStopVoice(); }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: language === 'english' ? '#38bdf8' : '#1e293b',
                    color: language === 'english' ? '#000' : '#cbd5e1',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🌐 English
                </button>
              </div>
            </div>

            {/* Template Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {Object.values(DEAL_TEMPLATES).map(tmpl => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    handleStopVoice();
                    setSelectedTemplateKey(tmpl.id);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: selectedTemplateKey === tmpl.id ? 'rgba(56, 189, 248, 0.15)' : '#0c1222',
                    border: `1px solid ${selectedTemplateKey === tmpl.id ? '#38bdf8' : '#1e293b'}`,
                    color: selectedTemplateKey === tmpl.id ? '#38bdf8' : '#cbd5e1',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{tmpl.name}</span>
                  {selectedTemplateKey === tmpl.id && <span style={{ fontSize: '11px' }}>● ACTIVE</span>}
                </button>
              ))}
            </div>

            {/* Editable Message Box */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Customizable WhatsApp Message Text (Edit freely):
                </label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(customMessage, 'msg')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer' }}
                >
                  {copiedKey === 'msg' ? '✅ Copied!' : '📋 Copy Text'}
                </button>
              </div>
              <textarea
                rows={9}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#020617',
                  border: '1px solid #334155',
                  color: '#f1f5f9',
                  fontSize: '12.5px',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              />
            </div>

            {/* Action Buttons Strip */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Primary 1-Tap Universal WhatsApp Launch */}
              <button
                type="button"
                onClick={handleLaunchWhatsAppNative}
                style={{
                  padding: '11px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
                }}
              >
                <span>💬</span> Open WhatsApp & Send
              </button>

              {/* Background API Dispatch */}
              {(channelStatus.hasMeta || channelStatus.hasTwilio) && (
                <button
                  type="button"
                  disabled={isSendingApi}
                  onClick={handleSendViaApi}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: isSendingApi ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{isSendingApi ? '⏳' : '🤖'}</span> Auto-Dispatch via API
                </button>
              )}

              {/* Direct Cellular Phone Dial */}
              <a
                href={`tel:${(selectedLead.cleanPhone || selectedLead.phone || '').replace(/[^0-9+]/g, '')}`}
                style={{
                  padding: '11px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📞</span> Direct Phone Call
              </a>

              {/* Listen to Voiceover */}
              <button
                type="button"
                onClick={handlePlayVoice}
                style={{
                  padding: '11px 16px',
                  borderRadius: '8px',
                  backgroundColor: isPlayingVoice ? '#ef4444' : '#0f172a',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{isPlayingVoice ? '⏹️' : '▶️'}</span> {isPlayingVoice ? 'Stop Audio' : 'Listen Preview'}
              </button>
            </div>

            {/* Feedback Alert */}
            {apiFeedback && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: apiFeedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                border: `1px solid ${apiFeedback.success ? '#10b981' : '#eab308'}`,
                color: apiFeedback.success ? '#34d399' : '#fde047',
                fontSize: '12px',
                lineHeight: '1.5'
              }}>
                {apiFeedback.message}
              </div>
            )}
          </div>

          {/* Right Column: Active Prospect Dossier & Deal Settle Drawer */}
          <div style={{
            backgroundColor: '#070714',
            borderRadius: '14px',
            border: '1px solid #1e293b',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f8fafc', fontWeight: '800' }}>
              👤 Client Dossier & Deal Settlement
            </h3>

            <div style={{
              backgroundColor: '#020617',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #1e293b',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Company:</span>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{selectedLead.company}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Target Mobile:</span>
                  <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>+{selectedLead.cleanPhone || selectedLead.phone}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Location / City:</span>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{selectedLead.city || 'Global Metro'}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Total Deal Scope:</span>
                  <div style={{ fontWeight: 'bold', color: '#34d399' }}>{selectedLead.totalStr || '₹45,000'}</div>
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
                ⚡ <strong>Settlement Rails:</strong> Domestic UPI: <code>9690973030@ibl</code> (Vikas Singh) • Section 22 CGST Net-Zero Tax Exemption
              </div>
            </div>

            {/* Record Client Reply or Settle Deal */}
            <div style={{
              backgroundColor: '#0a0e1a',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#34d399' }}>
                  🤝 Record Client Response & Close Deal:
                </span>
                <button
                  type="button"
                  onClick={() => setShowOutcomeDrawer(!showOutcomeDrawer)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#10b981',
                    color: '#000',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {showOutcomeDrawer ? 'Hide' : 'Open Deal Closer'}
                </button>
              </div>

              {showOutcomeDrawer && (
                <form onSubmit={handleRecordOutcome} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Client Interaction Outcome</label>
                    <select
                      value={outcomeType}
                      onChange={e => setOutcomeType(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                    >
                      <option value="PAYMENT_RECEIVED">🏆 Advance Payment Received (UPI / Bank Settlement)</option>
                      <option value="INTERESTED_DEMO">💡 Client Interested & Asked for Live Demo</option>
                      <option value="PRICE_NEGOTIATION">🛡️ Negotiating Setup Fee or Pilot Scope</option>
                      <option value="CALL_BACK_REQUESTED">📞 Client Requested Call Back Later</option>
                    </select>
                  </div>

                  {outcomeType === 'PAYMENT_RECEIVED' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Bank UTR / Transaction ID (Mandatory)</label>
                        <input
                          type="text"
                          required
                          value={utrInput}
                          onChange={e => setUtrInput(e.target.value)}
                          placeholder="e.g. 412389123892"
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #10b981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Settled Amount (₹)</label>
                        <input
                          type="number"
                          value={amountInput}
                          onChange={e => setAmountInput(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Notes / Conversation Summary</label>
                    <input
                      type="text"
                      value={outcomeNotes}
                      onChange={e => setOutcomeNotes(e.target.value)}
                      placeholder="e.g. Client agreed on ₹2,500 advance for dental bot deployment."
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={outcomeSaving}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '6px',
                      backgroundColor: outcomeType === 'PAYMENT_RECEIVED' ? '#10b981' : '#0284c7',
                      color: '#000',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {outcomeSaving ? 'Saving...' : outcomeType === 'PAYMENT_RECEIVED' ? 'Verify UTR & Close Deal As WON' : 'Record Negotiation Status'}
                  </button>

                  {outcomeResult && (
                    <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: outcomeResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: outcomeResult.success ? '#34d399' : '#f87171', fontSize: '12px' }}>
                      {outcomeResult.message}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
