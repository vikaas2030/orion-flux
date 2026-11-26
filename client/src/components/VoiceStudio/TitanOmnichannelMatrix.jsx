import React, { useState, useEffect } from 'react';

const REACTION_REBUTTALS = {
  price: {
    title: '🛡️ "Your Price is Too High" (Fee Reframe)',
    text: 'Main aapki baat samajhta hoon! Lekin agar yeh 24/7 AI bot pure quarter me sirf 1 extra patient/client book karwa de jo pehle drop ho raha tha, toh hamara setup fee pehle hi din 5x vasool ho jata hai. Sath hi Section 22 ke tehat 0% GST tax hai aur ₹2,500 ka 100% refundable token hai.'
  },
  team: {
    title: '💡 "We Already Have an In-House Team"',
    text: 'Yeh toh bahut accha hai! Hamara AI agent aapki team ko replace nahi karta, balki unka 24/7 assistant banta hai. Raat ko aur weekends par har inquiry ko 60 seconds me qualify karke ready-to-buy clients aapki team ko deta hai.'
  },
  email_first: {
    title: '📬 "Send Details on Email First"',
    text: 'Maine aapke private portal ka working demo 4K video reel ke sath stage kiya hai. Email spam me chali jaati hai, kya main aapke WhatsApp par direct 30-second live demo link bhej doon taaki aap turant dekh sakein?'
  },
  trust: {
    title: '🤝 "How Do We Know It Will Work?"',
    text: 'Hum 14-Day 100% Money-Back Guarantee dete hain Vikas Singh ji dwara sign ki hui. Agar aapko setup pasand nahi aaya, toh aapka ₹2,500 token pura wapas ho jayega, zero risk.'
  }
};

export default function TitanOmnichannelMatrix() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ whatsappCapable: 0, landlines: 0, emailOnly: 0 });
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'whatsapp' | 'landline' | 'email'
  const [selectedRebuttal, setSelectedRebuttal] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Settlement Drawer
  const [showSettle, setShowSettle] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [settleAmount, setSettleAmount] = useState(999);
  const [settling, setSettling] = useState(false);
  const [settleResult, setSettleResult] = useState(null);
  const [huntingDomestic, setHuntingDomestic] = useState(false);
  const [syncingDeals, setSyncingDeals] = useState(false);
  const [sprintMode, setSprintMode] = useState(false);
  const [sprintSent, setSprintSent] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEthicsModal, setShowEthicsModal] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);

  const handleLaunchWhatsAppSprint = () => {
    if (!currentLead || !currentLead.waUrl) return;
    window.open(currentLead.waUrl, '_blank');
    logTouch(currentLead.leadId, 'WHATSAPP_NATIVE', 'Sprint dispatch: 1-tap WhatsApp proposal sent.');
    setSprintSent(prev => prev + 1);
    setActionFeedback({
      type: 'success',
      msg: `🚀 WhatsApp launched for ${currentLead.company}! Auto-advancing to next lead in 1 second...`
    });
    setTimeout(() => {
      handleNextLead();
    }, 1200);
  };

  const handleCopyQrPaymentLink = () => {
    const textToCopy = `Namaste ${currentLead?.company || 'Client'}! Aapka 24/7 AI Client Intake Assistant book karne ke liye ₹999 ka 100% refundable pilot token link:\n\n👉 upi://pay?pa=9690973030@ibl&pn=ORION%20FLUX%20Token&am=999&cu=INR\n\nDirect UPI ID: 9690973030@ibl (Vikas Singh)\n(14-Day 100% Money-Back Guarantee • Section 22 CGST Exempt)\n\nPayment hone par 12-digit UTR number share kar dijiye taaki production live deploy ho sake.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQrLink(true);
    setTimeout(() => setCopiedQrLink(false), 3000);
  };

  const handleSyncDeals = async () => {
    setSyncingDeals(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/omnichannel/sync-deals', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({
          type: 'success',
          msg: `⚡ Successfully synced ${data.addedCount} leads to active pipeline deals! Total Deals: ${data.totalDeals}`
        });
      }
    } catch (err) {
      setActionFeedback({ type: 'error', msg: `Sync error: ${err.message}` });
    } finally {
      setSyncingDeals(false);
    }
  };

  const handleHuntDomesticFast = async () => {
    setHuntingDomestic(true);
    setActionFeedback(null);
    try {
      const res = await fetch('/api/omnichannel/hunt-domestic-fast', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionFeedback({ type: 'success', msg: data.message });
        await fetchQueue();
        setCurrentIndex(0);
      }
    } catch (err) {
      setActionFeedback({ type: 'error', msg: `Hunt error: ${err.message}` });
    } finally {
      setHuntingDomestic(false);
    }
  };

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/omnichannel/queue');
      const data = await res.json();
      if (data.success && data.queue) {
        setQueue(data.queue);
        setStats(data.stats || { whatsappCapable: 0, landlines: 0, emailOnly: 0 });
      }
    } catch (err) {
      console.warn('Queue fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const filteredQueue = queue.filter(item => {
    if (activeTab === 'whatsapp') return item.phoneProfile.isWhatsAppCapable;
    if (activeTab === 'landline') return item.phoneProfile.channel === 'LANDLINE_OFFICE';
    if (activeTab === 'email') return item.phoneProfile.channel === 'EMAIL_ONLY';
    return true;
  });

  const currentLead = filteredQueue[currentIndex] || filteredQueue[0];

  const handleNextLead = () => {
    if (currentIndex < filteredQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setActionFeedback(null);
    setSelectedRebuttal(null);
  };

  const handlePrevLead = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(filteredQueue.length - 1);
    }
    setActionFeedback(null);
    setSelectedRebuttal(null);
  };

  // 1-Tap Universal WhatsApp Dispatch
  const handleLaunchWhatsApp = () => {
    if (!currentLead || !currentLead.waUrl) return;
    window.open(currentLead.waUrl, '_blank');
    logTouch(currentLead.leadId, 'WHATSAPP_NATIVE', 'Dispatched pitch via 1-tap WhatsApp launch.');
    setActionFeedback({
      type: 'success',
      msg: `🚀 WhatsApp launched for ${currentLead.company}! Simply tap the Send button in WhatsApp.`
    });
  };

  // 1-Tap Free Native SMS Dispatch (100 Free Daily SMS)
  const handleLaunchSms = () => {
    if (!currentLead || !currentLead.smsUrl) return;
    window.open(currentLead.smsUrl, '_blank');
    logTouch(currentLead.leadId, 'NATIVE_SMS', 'Dispatched 140-char pitch via 100 Free Native SMS rail.');
    setActionFeedback({
      type: 'success',
      msg: `📱 Native SMS opened for ${currentLead.company}! Dispatched via your phone's free SMS quota.`
    });
  };

  // Google SMTP Fallback Email Dispatch
  const handleSendEmailFallback = async () => {
    if (!currentLead || !currentLead.email) {
      setActionFeedback({ type: 'warning', msg: 'No verified email found for this lead.' });
      return;
    }

    setEmailSending(true);
    setActionFeedback(null);

    try {
      const res = await fetch('/api/omnichannel/send-email-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: currentLead.leadId })
      });
      const data = await res.json();
      if (data.success && data.result?.delivered) {
        setActionFeedback({
          type: 'success',
          msg: `✅ Executive proposal delivered to ${currentLead.email} via Google SMTP! Message ID: ${data.result.messageId}`
        });
      } else {
        setActionFeedback({
          type: 'warning',
          msg: `⚠️ Email notice: ${data.result?.error || 'Could not verify delivery'}`
        });
      }
    } catch (err) {
      setActionFeedback({ type: 'error', msg: `Email error: ${err.message}` });
    } finally {
      setEmailSending(false);
    }
  };

  const logTouch = (leadId, channel, notes) => {
    fetch('/api/omnichannel/log-touch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, channel, notes })
    }).catch(() => {});
  };

  // Rehearse Gatekeeper Script aloud with speech synthesis
  const speakScriptAloud = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.lang = 'hi-IN';
    window.speechSynthesis.speak(utter);
  };

  // Deal Closer Settle Action
  const handleSettleDeal = async (e) => {
    e.preventDefault();
    if (!currentLead) return;
    setSettling(true);
    setSettleResult(null);

    try {
      const res = await fetch('/api/whatsapp/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: currentLead.leadId,
          dealId: currentLead.leadId,
          outcomeType: 'PAYMENT_RECEIVED',
          utrNumber: utrNumber.trim(),
          amountPaid: Number(settleAmount),
          notes: `Deal settled via Titan Omnichannel Matrix with UTR ${utrNumber}`
        })
      });
      const data = await res.json();
      setSettleResult(data);
      if (data.outcome === 'DEAL_WON_AND_SETTLED') {
        setTimeout(() => setShowSettle(false), 2500);
      }
    } catch (err) {
      setSettleResult({ success: false, message: err.message });
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: '#38bdf8', backgroundColor: '#070714', borderRadius: '16px' }}>
        ⚡ Loading Titan Omnichannel Autonomous Engine...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#f8fafc', marginBottom: '32px' }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & OMNICHANNEL RADAR METRICS
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#070714',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        borderTop: '4px solid #06b6d4',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>⚡</span>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
                  Titan Omnichannel Autonomous Deal Matrix
                </h2>
                <span style={{ fontSize: '12px', color: '#38bdf8' }}>
                  100% Free Autonomous Multi-Channel Execution — WhatsApp Auto-Sequencing, Free Native SMS, Office Landline Bypass & SMTP Infiltration
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              disabled={huntingDomestic}
              onClick={handleHuntDomesticFast}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '800',
                cursor: huntingDomestic ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 10px rgba(249, 115, 22, 0.4)'
              }}
            >
              {huntingDomestic ? '⏳ Hunting India...' : '🇮🇳 Fast-Hunt Indian ₹999 UPI Leads'}
            </button>
            <button
              type="button"
              onClick={() => setSprintMode(!sprintMode)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                background: sprintMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
              }}
            >
              {sprintMode ? `⏹ Stop Sprint (${sprintSent} Sent)` : '⚡ 1-Click WhatsApp Sprint'}
            </button>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(139, 92, 246, 0.4)'
              }}
            >
              📲 ₹999 UPI QR Code
            </button>
            <button
              type="button"
              onClick={() => setShowEthicsModal(true)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏛️ Agency Ethics & Trust
            </button>
            <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '11px', fontWeight: '700' }}>
              🟢 {stats.whatsappCapable} WhatsApp Cellular
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', color: '#fde047', fontSize: '11px', fontWeight: '700' }}>
              ☎️ {stats.landlines} Office Landlines
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '11px', fontWeight: '700' }}>
              📧 {stats.emailOnly} Verified Email
            </span>
          </div>
        </div>

        {/* Channel Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('all'); setCurrentIndex(0); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'all' ? '#06b6d4' : '#0f172a',
              color: activeTab === 'all' ? '#000' : '#cbd5e1',
              border: 'none',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            All Channels ({queue.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('whatsapp'); setCurrentIndex(0); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'whatsapp' ? '#10b981' : '#0f172a',
              color: activeTab === 'whatsapp' ? '#000' : '#cbd5e1',
              border: 'none',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📱 WhatsApp Capable ({stats.whatsappCapable})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('landline'); setCurrentIndex(0); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'landline' ? '#eab308' : '#0f172a',
              color: activeTab === 'landline' ? '#000' : '#cbd5e1',
              border: 'none',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ☎️ Landlines / Office Desks ({stats.landlines})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('email'); setCurrentIndex(0); }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'email' ? '#38bdf8' : '#0f172a',
              color: activeTab === 'email' ? '#000' : '#cbd5e1',
              border: 'none',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📧 Email Corporate ({stats.emailOnly})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ACTIVE PROSPECT COMMAND DECK & MULTI-CHANNEL ACTIONS
         ───────────────────────────────────────────────────────────── */}
      {currentLead && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Left Column: Targeted Client Profile & Channel Station */}
          <div style={{
            backgroundColor: '#070714',
            borderRadius: '16px',
            border: '1px solid #1e293b',
            padding: '24px'
          }}>
            {/* Rapid Sprint Banner */}
            {sprintMode && (
              <div style={{
                marginBottom: '16px',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid #10b981',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase' }}>
                    🔥 RAPID SPRINT MODE ACTIVE ({sprintSent} PROPOSALS SENT)
                  </span>
                  <div style={{ fontSize: '14px', color: '#fff', fontWeight: '700' }}>
                    Current: {currentLead.company} ({currentLead.phone || 'Email Only'})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchWhatsAppSprint}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.5)'
                  }}
                >
                  🚀 Fire WhatsApp & Auto-Next Lead ▶
                </button>
              </div>
            )}

            {/* Header Strip with Queue Navigator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Target Queue [{currentIndex + 1} of {filteredQueue.length}]
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '2px 0 0 0' }}>
                  {currentLead.company}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handlePrevLead}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={handleNextLead}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Next Lead ▶
                </button>
              </div>
            </div>

            {/* Dossier Card */}
            <div style={{
              backgroundColor: '#020617',
              borderRadius: '10px',
              padding: '14px',
              border: '1px solid #1e293b',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '10px' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Channel Type:</span>
                  <div style={{ fontWeight: 'bold', color: currentLead.phoneProfile.isWhatsAppCapable ? '#34d399' : '#fde047' }}>
                    {currentLead.phoneProfile.label}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Contact Number:</span>
                  <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>{currentLead.phone || 'Email Only'}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Location / City:</span>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{currentLead.city} ({currentLead.country || 'India'})</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Milestone Advance Token:</span>
                  <div style={{ fontWeight: 'bold', color: '#34d399' }}>{currentLead.currencySymbol}{currentLead.pilotAdvance} (Refundable)</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                🔗 <strong>Live Client Portal:</strong> <a href={currentLead.portalUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>{currentLead.portalUrl}</a>
              </div>
            </div>

            {/* Dynamic Multi-Channel Action Station */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '13px', color: '#38bdf8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🚀 100% Free Immediate Outreach Action:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. WHATSAPP (If cellular mobile) */}
                {currentLead.phoneProfile.isWhatsAppCapable && (
                  <button
                    type="button"
                    onClick={handleLaunchWhatsApp}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>💬</span>
                      <span>1-Tap Launch WhatsApp & Send Pitch</span>
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>FREE</span>
                  </button>
                )}

                {/* 2. NATIVE SMS (If cellular mobile - Non-WhatsApp Fallback using 100 Free Daily SMS) */}
                {currentLead.phoneProfile.isMobile && (
                  <button
                    type="button"
                    onClick={handleLaunchSms}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#0369a1',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📲</span>
                      <span>1-Tap Free Native SMS (Uses Your 100 Free Daily SMS)</span>
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>98% OPEN</span>
                  </button>
                )}

                {/* 3. DIRECT PHONE CALL (1-Tap Dial using Unlimited SIM Plan) */}
                {currentLead.directCallUrl && (
                  <a
                    href={currentLead.directCallUrl}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#cbd5e1',
                      fontWeight: '700',
                      fontSize: '13px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📞</span>
                      <span>Direct Cellular Phone Call (Unlimited SIM Plan)</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#38bdf8' }}>{currentLead.phone}</span>
                  </a>
                )}

                {/* 4. GOOGLE SMTP EMAIL (Real Email Infiltration) */}
                {currentLead.email && (
                  <button
                    type="button"
                    disabled={emailSending}
                    onClick={handleSendEmailFallback}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#4338ca',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: emailSending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📧</span>
                      <span>{emailSending ? 'Sending via Google SMTP...' : 'Dispatch Proposal via Verified Google SMTP'}</span>
                    </span>
                    <span style={{ fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>100% REAL</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                border: `1px solid ${actionFeedback.type === 'success' ? '#10b981' : '#eab308'}`,
                color: actionFeedback.type === 'success' ? '#34d399' : '#fde047',
                fontSize: '12px',
                lineHeight: '1.5'
              }}>
                {actionFeedback.msg}
              </div>
            )}
          </div>

          {/* Right Column: Non-WhatsApp Solution & Landline Gatekeeper Bypass Deck */}
          <div style={{
            backgroundColor: '#070714',
            borderRadius: '16px',
            border: '1px solid #1e293b',
            padding: '24px'
          }}>
            {/* If Lead is Landline: Show Gatekeeper Triage Script */}
            {currentLead.phoneProfile.channel === 'LANDLINE_OFFICE' ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#fde047' }}>
                    ☎️ Reception / Clinic Desk Gatekeeper-Bypass Script:
                  </span>
                  <button
                    type="button"
                    onClick={() => speakScriptAloud(`${currentLead.gatekeeperScript.hook} ${currentLead.gatekeeperScript.triage} ${currentLead.gatekeeperScript.ask}`)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    ▶️ Listen Aloud
                  </button>
                </div>

                <div style={{
                  backgroundColor: '#020617',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '12.5px',
                  lineHeight: '1.7',
                  color: '#e2e8f0',
                  marginBottom: '12px'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}><strong>1. Opening Hook:</strong> "{currentLead.gatekeeperScript.hook}"</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>2. Purpose:</strong> "{currentLead.gatekeeperScript.triage}"</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>3. Direct Ask:</strong> "{currentLead.gatekeeperScript.ask}"</p>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '11.5px' }}><strong>🛡️ If Receptionist is hesitant:</strong> "{currentLead.gatekeeperScript.rebuttalIfHesitant}"</p>
                </div>
              </div>
            ) : (
              /* If WhatsApp / Mobile: Show Pitch Script Preview */
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8' }}>
                    💬 WhatsApp Pre-Filled Pitch Preview:
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Auto-Loaded on Click
                  </span>
                </div>

                <div style={{
                  backgroundColor: '#020617',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid #1e293b',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#cbd5e1',
                  whiteSpace: 'pre-line',
                  maxHeight: '170px',
                  overflowY: 'auto',
                  marginBottom: '12px'
                }}>
                  {currentLead.whatsappPitch}
                </div>
              </div>
            )}

            {/* In-Call Live Tele-Closer Objection HUD */}
            <div style={{
              backgroundColor: '#0a0e1a',
              borderRadius: '10px',
              padding: '14px',
              border: '1px solid #1e293b',
              marginBottom: '18px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#f1f5f9', display: 'block', marginBottom: '8px' }}>
                🎯 In-Call Real-Time Objection Rebuttals (Click to Reveal):
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                {Object.entries(REACTION_REBUTTALS).map(([k, item]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSelectedRebuttal(selectedRebuttal === k ? null : k)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      backgroundColor: selectedRebuttal === k ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                      border: `1px solid ${selectedRebuttal === k ? '#38bdf8' : '#334155'}`,
                      color: selectedRebuttal === k ? '#38bdf8' : '#cbd5e1',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {selectedRebuttal && (
                <div style={{
                  backgroundColor: '#020617',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #38bdf8',
                  fontSize: '12px',
                  color: '#e2e8f0',
                  lineHeight: '1.5'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>Say this calmly:</span>
                    <button
                      type="button"
                      onClick={() => speakScriptAloud(REACTION_REBUTTALS[selectedRebuttal].text)}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer' }}
                    >
                      ▶️ Listen
                    </button>
                  </div>
                  "{REACTION_REBUTTALS[selectedRebuttal].text}"
                </div>
              )}
            </div>

            {/* Deal Settlement & UPI Verification Action */}
            <div style={{
              backgroundColor: '#020617',
              borderRadius: '10px',
              padding: '14px',
              border: '1px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#34d399' }}>
                    🏆 Client Agreed? Verify Bank UTR & Close:
                  </span>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    UPI: <code>9690973030@ibl</code> (Vikas Singh)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSettle(!showSettle)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#10b981',
                    color: '#000',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {showSettle ? 'Close' : 'Verify UTR & Win'}
                </button>
              </div>

              {showSettle && (
                <form onSubmit={handleSettleDeal} style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>12-Digit Bank UTR / Ref No.</label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value)}
                        placeholder="e.g. 412988102931"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #10b981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '3px' }}>Amount (₹)</label>
                      <input
                        type="number"
                        value={settleAmount}
                        onChange={e => setSettleAmount(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={settling}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#000',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {settling ? 'Settling...' : 'Confirm Real Payment & Unlock Production Delivery'}
                  </button>

                  {settleResult && (
                    <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: settleResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: settleResult.success ? '#34d399' : '#f87171', fontSize: '12px' }}>
                      {settleResult.message}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────
          3. DYNAMIC UPI QR CODE & DIRECT SETTLEMENT MODAL
         ───────────────────────────────────────────────────────────── */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#070714',
            border: '2px solid #8b5cf6',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 6px 0' }}>
              📲 Instant ₹999 UPI Pilot QR
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 18px 0' }}>
              Direct Bank Settlement Rail • 14-Day 100% Money-Back Guarantee
            </p>

            <div style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '18px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9690973030@ibl%26pn=ORION%2520FLUX%2520Token%26am=999%26cu=INR"
                alt="UPI QR Code"
                style={{ width: '200px', height: '200px', display: 'block' }}
              />
            </div>

            <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Authorized Signatory UPI:</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8' }}>9690973030@ibl</div>
              <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold', marginTop: '2px' }}>
                Vikas Singh (Founder & Managing Principal)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleCopyQrPaymentLink}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {copiedQrLink ? '✅ Copied to Clipboard!' : '📋 Copy WhatsApp Payment Invite'}
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. WORLD-CLASS AGENCY ETHICS & STATUTORY TRUST MODAL
         ───────────────────────────────────────────────────────────── */}
      {showEthicsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#070714',
            border: '2px solid #38bdf8',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 6px 0' }}>
              🏛️ ORION FLUX: World-Class Agency Ethics & Standards
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
              The 4 Pillars that separate top global agencies from spam operations:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '13px' }}>1. 100% Zero-Fake Integrity Policy</div>
                <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '3px' }}>
                  We never generate fake revenue, dummy transactions, or synthetic UTRs. Every rupee earned is backed by genuine bank settlement receipts.
                </div>
              </div>

              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#34d399', fontWeight: '800', fontSize: '13px' }}>2. 14-Day 100% Money-Back Guarantee</div>
                <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '3px' }}>
                  Every client pays only a refundable ₹999 / $49 milestone token. If they are not 100% delighted within 14 days, the token is reversed within 60 minutes.
                </div>
              </div>

              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#fde047', fontWeight: '800', fontSize: '13px' }}>3. Section 22 CGST Act Statutory Exemption</div>
                <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '3px' }}>
                  All-inclusive net pricing with zero hidden surcharges or surprise taxes (CERT-CGST-2026-EXEMPT-09). Complete statutory transparency for both domestic & global clients.
                </div>
              </div>

              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#a78bfa', fontWeight: '800', fontSize: '13px' }}>4. Responsible Anti-Spam & Opt-Out Protocol</div>
                <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '3px' }}>
                  Every cold message includes clear opt-out terms ("Reply STOP"). Automated cadences enforce a strict 12+ hour interval between touchpoints to protect deliverability and reputation.
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowEthicsModal(false)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Understood & Aligned
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
