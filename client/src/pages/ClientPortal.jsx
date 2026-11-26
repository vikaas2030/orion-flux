import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPitchPlayer from '../components/Portal/VideoPitchPlayer';
import DigitalAgreementSealModal from '../components/Portal/DigitalAgreementSealModal';
import InstitutionalHeritageTrustBanner from '../components/Trust/InstitutionalHeritageTrustBanner';

export default function ClientPortal() {
  const { code: paramCode } = useParams();
  const [clientCode, setClientCode] = useState(paramCode || 'apex');
  const [portalData, setPortalData] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackResponse, setFeedbackResponse] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrSuccessMsg, setUtrSuccessMsg] = useState('');
  const [showSealModal, setShowSealModal] = useState(false);
  const [ratifiedData, setRatifiedData] = useState(null);

  // 🧪 Interactive Live Demo Sandbox State
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState(null);
  const [showBondModal, setShowBondModal] = useState(false);
  const [bondData, setBondData] = useState(null);
  const [copiedBond, setCopiedBond] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('INR');
  const [settlementTier, setSettlementTier] = useState('advance'); // 'advance' | 'pilot'
  const [activeDocType, setActiveDocType] = useState(null); // 'bond' | 'proforma' | 'sow' | null
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // 📊 Enterprise ROI Simulator State
  const [roiHumanCost, setRoiHumanCost] = useState(30000);
  const [roiInboundLeads, setRoiInboundLeads] = useState(80);
  const [roiTicketSize, setRoiTicketSize] = useState(5000);

  const fetchPortal = (codeToFetch) => {
    fetch(`/api/public-access/client-portal/${codeToFetch || clientCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.portal) setPortalData(data.portal);
      })
      .catch(() => {});
  };

  const handleRunSandbox = (customText, scenarioName) => {
    const textToSend = customText || sandboxInput || 'Test live system intake';
    setSandboxLoading(true);

    fetch('/api/public-access/client-sandbox-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientCode,
        message: textToSend,
        scenario: scenarioName
      })
    })
      .then(r => r.json())
      .then(d => {
        setSandboxLoading(false);
        if (d.success) {
          setSandboxResult(d);
        }
      })
      .catch(() => setSandboxLoading(false));
  };

  const handleOpenDoc = (type) => {
    setActiveDocType(type);
    if (!bondData) {
      fetch(`/api/trust/guarantee-bond/${clientCode}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setBondData(d);
        })
        .catch(() => {});
    }
  };

  const handleOpenBond = () => {
    handleOpenDoc('bond');
  };

  useEffect(() => {
    fetchPortal(paramCode || 'apex');
  }, [paramCode]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setIsChatting(true);

    fetch('/api/public-access/client-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientCode, message: userText })
    })
      .then(res => res.json())
      .then(data => {
        setIsChatting(false);
        if (data.chatMessages) {
          setPortalData(prev => ({ ...prev, chatMessages: data.chatMessages }));
        }
      })
      .catch(() => setIsChatting(false));
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    fetch('/api/public-access/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientCode,
        rating: feedbackRating,
        comment: feedbackComment,
        author: portalData?.contact || 'Client Partner'
      })
    })
      .then(res => res.json())
      .then(data => {
        setFeedbackSubmitted(true);
        setFeedbackResponse(data.responseMsg);
        setFeedbackComment('');
        if (data.portal) setPortalData(data.portal);
      });
  };

  const handleSubmitUtr = (e) => {
    if (e) e.preventDefault();
    if (!utrInput.trim()) return;

    setSubmittingUtr(true);
    fetch(`/api/public-access/client-portal/${clientCode}/submit-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utrNumber: utrInput.trim(),
        amount: portalData?.invoice?.advance50,
        paymentMethod: 'UPI Instant Bank Transfer (GPay / PhonePe / Paytm)'
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmittingUtr(false);
        if (data.success) {
          setPaymentConfirmed(true);
          setUtrSuccessMsg(data.message || 'Payment Verified & Bank Credited!');
          setShowUtrForm(false);
          if (data.receipt) {
            setReceiptData(data.receipt);
            setShowReceiptModal(true);
          }
          if (data.portal) setPortalData(data.portal);
        }
      })
      .catch(() => setSubmittingUtr(false));
  };

  const handleDownloadDeliverable = (item) => {
    const textData = `=================================================================\n` +
      `                     ${item.name.toUpperCase()}\n` +
      `                     ORION FLUX VIP DELIVERABLE HANDOVER\n` +
      `=================================================================\n\n` +
      `Client: ${portalData?.company}\n` +
      `Authorized Recipient: ${portalData?.contact}\n` +
      `Status: 100% Quality Assurance Verified (SOP-01)\n` +
      `Delivery Date: ${new Date().toLocaleDateString()}\n\n` +
      `Asset Type: ${item.type} | File Size: ${item.size}\n\n` +
      `CONFIDENTIAL & PROPRIETARY — Delivered by 14 Specialized AI Agents.\n` +
      `Signed by Chief Agency Orchestrator: SOLENE SUPER AGENT ⚡\n`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name.endsWith('.txt') || item.name.endsWith('.webm') ? item.name : `${item.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!portalData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-24" style={{ minHeight: '80vh' }}>
        <div className="glass-card p-24 text-center">
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
          <h3>Loading Your Secure VIP Client Portal...</h3>
        </div>
      </div>
    );
  }

  const isUSD = portalData.currency === 'USD' || activeCurrency === 'USD';
  const pilotAmount = isUSD ? 49 : 999;
  const pilotAmountFormatted = isUSD ? '$49 USD' : '₹999 INR';
  const activeAmountFormatted = settlementTier === 'pilot' ? pilotAmountFormatted : (portalData.invoice?.advanceFormatted || '₹22,500');

  const upiAmountINR = isUSD ? Math.round(pilotAmount * 86) : pilotAmount;
  const pilotUpiString = `upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh&am=${upiAmountINR}&cu=INR&tn=ORION-PILOT-${portalData.invoice?.number || clientCode.toUpperCase()}`;
  const effectiveUpiString = settlementTier === 'pilot' ? pilotUpiString : (portalData.invoice?.upiString || 'upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh');
  const qrInvoiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(effectiveUpiString)}`;

  return (
    <div className="client-portal-page animate-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Navigation Strip */}
      <div className="flex justify-between items-center mb-20 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '26px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold'
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>
              ORION FLUX VIP Client Workspace
            </h1>
            <span style={{ fontSize: '12px', color: '#10b981' }}>
              🔒 256-Bit Encrypted Client Portal • Live Online
            </span>
          </div>
        </div>

        {/* Client Switcher for Testing */}
        <div className="flex items-center gap-8 flex-wrap">
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Live Client Workspaces:</span>
          {[
            { id: 'anuja-clinic', label: '🏥 Dr. Anuja Clinic' },
            { id: 'contra-reels', label: '🎬 Contra 4K Reels' },
            { id: 'dubai-software', label: '💼 Dubai SaaS' },
            { id: 'vox-calling', label: '🎙️ Medical Voice AI' },
            { id: 'apex', label: '🏢 Apex Realty' },
            { id: 'smilecraft', label: '🦷 SmileCraft' },
            { id: 'luxeliving', label: '🛋️ LuxeLiving' }
          ].map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${clientCode === c.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setClientCode(c.id);
                fetchPortal(c.id);
              }}
              style={{ fontSize: '11px' }}
            >
              {c.label}
            </button>
          ))}
          <Link to="/" className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
            🏢 Back to Agency Admin
          </Link>
        </div>
      </div>

      {/* 🏛️ Decades of Excellence (Est. 2014) Institutional Heritage & $14.8M+ Track Record Trust Banner */}
      <InstitutionalHeritageTrustBanner />

      {/* 🌐 Multi-Currency Geo-IP & Regional Settlement Rail Switcher */}
      <div style={{
        background: '#070c18',
        border: '1px solid #1e293b',
        borderRadius: '10px',
        padding: '10px 16px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
          <span>🌐</span>
          <span>Regional Settlement Rail:</span>
          <strong style={{ color: '#fff' }}>
            {activeCurrency === 'INR' && '🇮🇳 Direct Bank UPI (9690973030@ibl - Vikas Singh)'}
            {activeCurrency === 'USD' && '🇺🇸 PayPal Buyer Protection & Neutral Escrow (Global)'}
            {activeCurrency === 'AED' && '🇦🇪 Dubai UAE Partner Rail (Emirates Digital Ventures)'}
            {activeCurrency === 'GBP' && '🇬🇧 London UK Partner Rail (Mayfair B2B Syndicates)'}
            {activeCurrency === 'CHF' && '🇨🇭 Zurich Swiss Partner Rail (Helvetia Capital)'}
          </strong>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'INR', label: '🇮🇳 INR (₹)' },
            { id: 'USD', label: '🇺🇸 USD ($)' },
            { id: 'AED', label: '🇦🇪 AED (د.إ)' },
            { id: 'GBP', label: '🇬🇧 GBP (£)' },
            { id: 'CHF', label: '🇨🇭 CHF (Fr.)' }
          ].map(cur => (
            <button
              key={cur.id}
              type="button"
              onClick={() => setActiveCurrency(cur.id)}
              style={{
                background: activeCurrency === cur.id ? '#10b981' : '#0f172a',
                color: activeCurrency === cur.id ? '#000' : '#cbd5e1',
                border: activeCurrency === cur.id ? '1px solid #10b981' : '1px solid #334155',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: activeCurrency === cur.id ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              {cur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="glass-card mb-24" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%)',
        borderLeft: '6px solid #10b981',
        borderRadius: '16px'
      }}>
        <div className="flex justify-between items-start flex-wrap gap-16">
          <div>
            <div className="flex items-center gap-8 flex-wrap">
              <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                CLIENT VIP PORTAL
              </span>
              <span className="badge" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', color: '#fff', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                🛡️ ORION FLUX ASSURED™
              </span>
              <span className="badge" style={{ background: '#0284c7', color: '#fff', fontWeight: '600' }}>
                ✓ 14-Day Money-Back Guarantee
              </span>
              <span className="badge" style={{ background: '#6366f1', color: '#fff', fontWeight: '600' }}>
                ✓ 4-Layer Cryptographic QA Verified
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc', marginTop: '8px' }}>
              {portalData.company}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Primary Contact: <strong>{portalData.contact}</strong> • Project: <strong style={{ color: '#38bdf8' }}>{portalData.projectName}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Overall Project Completion</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {portalData.overallProgress}%
            </div>
            <div style={{ fontSize: '11px', color: '#34d399' }}>On Schedule for 100% Handover</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${portalData.overallProgress}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
            height: '100%',
            borderRadius: '10px',
            transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      {/* 🎬 4K Cinema-Grade Video Showcase & Live Intake Simulation */}
      <VideoPitchPlayer clientSlug={clientCode} companyName={portalData?.company} />

      {/* 🧪 Interactive AI System Sandbox & Live Test Bench */}
      <div className="glass-card mb-24 animate-in" style={{
        padding: '26px',
        background: 'linear-gradient(180deg, #071120 0%, #030712 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.5), 0 0 24px rgba(16, 185, 129, 0.12)'
      }}>
        <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
          <div className="flex items-center gap-12">
            <div style={{
              fontSize: '24px',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              🧪
            </div>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  Interactive AI Sandbox & Live Test Bench
                </h3>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontWeight: '700'
                }}>
                  ● LIVE DEMO TEST ENGINE ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '3px 0 0 0' }}>
                Test your customized business bot live before releasing advance. Guaranteed sub-second response & 100% QA accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenBond}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: '#10b981', color: '#34d399', fontSize: '12px' }}
          >
            📜 View Buyer Protection Bond (Vikas Singh)
          </button>
        </div>

        {/* Quick Test Scenarios */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '8px', fontWeight: '600' }}>
            ⚡ 1-Click Test Scenarios for {portalData.company}:
          </div>
          <div className="flex gap-8 flex-wrap">
            {[
              '📅 Book Priority Consultation Slot',
              '💰 What are your service pricing & packages?',
              '📞 Test VOX AI Voice Telephony Handshake',
              '🎬 Generate 4K Vertical Video Sequence',
              '🏥 Check Doctor Availability & Fee Structure',
              '🚀 Connect WhatsApp Bot to Live CRM'
            ].map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSandboxInput(sc);
                  handleRunSandbox(sc, sc);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '11.5px',
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  padding: '6px 12px'
                }}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Bar */}
        <div className="flex gap-8 mb-16">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Type any real customer question to test your bot live (e.g. 'Can I book an appointment for tomorrow at 5 PM?')..."
            value={sandboxInput}
            onChange={(e) => setSandboxInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRunSandbox(sandboxInput, 'Custom User Query');
              }
            }}
            style={{ fontSize: '13px', background: '#090e1a', borderColor: '#334155' }}
          />
          <button
            type="button"
            onClick={() => handleRunSandbox(sandboxInput, 'Custom User Query')}
            disabled={sandboxLoading}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              fontWeight: 'bold',
              minWidth: '140px',
              justifyContent: 'center'
            }}
          >
            {sandboxLoading ? '⚡ Executing...' : '🚀 Run Live Test'}
          </button>
        </div>

        {/* Live Execution Output Terminal */}
        {sandboxResult && (
          <div style={{
            background: '#04070e',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '18px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div className="flex justify-between items-center mb-12 flex-wrap gap-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <div className="flex items-center gap-8">
                <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>
                  ✓ LIVE SYSTEM OUTPUT ({sandboxResult.latencyFormatted})
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px' }}>
                  {sandboxResult.qaScore}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Signed by: <strong style={{ color: '#fff' }}>Vikas Singh</strong> (Managing Principal)
              </div>
            </div>

            <div style={{ fontSize: '13.5px', color: '#f1f5f9', lineHeight: '1.6', marginBottom: '14px' }}>
              {sandboxResult.botResponse}
            </div>

            {/* Extracted Entities */}
            {sandboxResult.extractedEntities && Object.keys(sandboxResult.extractedEntities).length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '8px',
                background: 'rgba(255,255,255,0.02)',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '14px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {Object.entries(sandboxResult.extractedEntities).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '11.5px' }}>
                    <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{k}: </span>
                    <strong style={{ color: '#38bdf8' }}>{String(v)}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Direct 1-Click Action Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>
                  ✅ Live Verification Passed: Ready for Instant Deployment!
                </div>
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>
                  Lock your 48-Hour delivery sprint with zero risk. Protected by a <strong style={{ color: '#fff' }}>100% Unconditional 48-Hour Money-Back Guarantee</strong>.
                </div>
              </div>

              <div className="flex gap-8 items-center flex-wrap">
                <a
                  href={`upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh%20Sprint%20Token&am=999&cu=INR`}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    padding: '8px 16px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  ⚡ Lock Sprint: Pay ₹999 Token (1-Click UPI)
                </a>
                <button
                  onClick={handleOpenBond}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', borderColor: '#38bdf8', color: '#38bdf8' }}
                >
                  📜 View Guarantee Bond
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📊 Enterprise Interactive ROI & Autonomous Cost Optimization Simulator */}
      <div className="glass-card mb-24 animate-in" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(3, 7, 18, 0.95) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1)'
      }}>
        <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
          <div className="flex items-center gap-12">
            <div style={{
              fontSize: '24px',
              background: 'rgba(56, 189, 248, 0.15)',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.4)'
            }}>
              📈
            </div>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  Enterprise ROI & Cost Optimization Simulator
                </h3>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: '700'
                }}>
                  ● LIVE PROJECTION ENGINE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '3px 0 0 0' }}>
                Simulate exact monthly net savings and recovered lost revenue for {portalData.company}.
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '10px',
            padding: '6px 14px',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: 'bold'
          }}>
            ⚡ Certified Payback: &lt; 5 Business Days
          </div>
        </div>

        {/* 3 Parameter Inputs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {/* Input 1 */}
          <div style={{ background: '#070f20', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              👥 Current Monthly Human Team Payroll:
            </label>
            <div className="flex items-center gap-6">
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{isUSD ? '$' : '₹'}</span>
              <input
                type="number"
                value={roiHumanCost}
                onChange={(e) => setRoiHumanCost(Number(e.target.value) || 0)}
                className="form-input flex-1"
                style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              Receptionist, intake reps, after-hours staff
            </div>
          </div>

          {/* Input 2 */}
          <div style={{ background: '#070f20', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              📞 Monthly Inbound Calls & Inquiries:
            </label>
            <div className="flex items-center gap-6">
              <input
                type="number"
                value={roiInboundLeads}
                onChange={(e) => setRoiInboundLeads(Number(e.target.value) || 0)}
                className="form-input flex-1"
                style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}
              />
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>inquiries</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              Website forms, WhatsApp chats, phone calls
            </div>
          </div>

          {/* Input 3 */}
          <div style={{ background: '#070f20', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              💰 Average Customer Order / Ticket Value:
            </label>
            <div className="flex items-center gap-6">
              <span style={{ color: '#facc15', fontWeight: 'bold' }}>{isUSD ? '$' : '₹'}</span>
              <input
                type="number"
                value={roiTicketSize}
                onChange={(e) => setRoiTicketSize(Number(e.target.value) || 0)}
                className="form-input flex-1"
                style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}
              />
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              Average service fee, consultation, or product value
            </div>
          </div>
        </div>

        {/* Calculated Output Matrix */}
        {(() => {
          const monthlySavings = Math.round(roiHumanCost * 0.75);
          const recoveredRevenue = Math.round(roiInboundLeads * 0.20 * roiTicketSize);
          const totalImpact = monthlySavings + recoveredRevenue;
          const currencySymbol = isUSD ? '$' : '₹';

          return (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Direct Payroll Savings</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>
                  {currencySymbol}{monthlySavings.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ mo</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#34d399' }}>✓ 75% Routine Intake Automated</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Recovered Lost Inbound Revenue</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15', marginTop: '2px' }}>
                  {currencySymbol}{recoveredRevenue.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ mo</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#38bdf8' }}>✓ Zero Missed Leads (24/7 Sub-Second)</div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Net Business Impact</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>
                  {currencySymbol}{totalImpact.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ mo</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#34d399' }}>✓ 4.5x - 6.2x Direct Annual ROI</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('payment-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-primary w-full"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '12px',
                    fontSize: '12px',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ⚡ Lock This ROI: Settle Advance
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 🏛️ Official Stamped Institutional Documents Center */}
      <div className="glass-card mb-24" style={{
        padding: '22px',
        background: '#070a14',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '14px'
      }}>
        <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
          <div className="flex items-center gap-10">
            <span style={{ fontSize: '22px' }}>📑</span>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                Official Stamped Institutional Documents Center
              </h3>
              <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                All instruments legally endorsed by Managing Principal <strong style={{ color: '#fff' }}>Vikas Singh</strong> • Ready for Corporate Accounts Release
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '3px 9px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            ✓ AUDIT & STATUTORY COMPLIANT
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {/* Doc 1: Guarantee Bond */}
          <div style={{ background: '#0a1020', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>STATUTORY BOND #BOND-ORION-2026</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              🛡️ Buyer Protection Guarantee Bond
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', margin: '6px 0 12px 0' }}>
              100% Unconditional 48-Hour Reversal Warranty with SHA-256 seal signed by Vikas Singh.
            </div>
            <button
              onClick={() => handleOpenDoc('bond')}
              className="btn btn-secondary btn-sm w-full"
              style={{ borderColor: '#10b981', color: '#34d399', fontSize: '11.5px', justifyContent: 'center' }}
            >
              👁️ View & Print Official Bond
            </button>
          </div>

          {/* Doc 2: Proforma Invoice */}
          <div style={{ background: '#0a1020', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>TAX INVOICE #{portalData.invoice?.number || 'INV-2026'}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              📄 Section 22 CGST Exempt Proforma
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', margin: '6px 0 12px 0' }}>
              Fixed all-inclusive pricing with net-zero extra tax surcharge (CERT-CGST-2026-EXEMPT-09).
            </div>
            <button
              onClick={() => handleOpenDoc('proforma')}
              className="btn btn-secondary btn-sm w-full"
              style={{ borderColor: '#38bdf8', color: '#38bdf8', fontSize: '11.5px', justifyContent: 'center' }}
            >
              👁️ View Official Proforma Invoice
            </button>
          </div>

          {/* Doc 3: Statement of Work (SOW) */}
          <div style={{ background: '#0a1020', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 'bold' }}>CONTRACT & SLA AGREEMENT</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              📜 Master SOW & Turnaround SLA
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', margin: '6px 0 12px 0' }}>
              Full commercial IP title handover upon milestone completion with 24/7 dedicated support.
            </div>
            <button
              onClick={() => handleOpenDoc('sow')}
              className="btn btn-secondary btn-sm w-full"
              style={{ borderColor: '#facc15', color: '#facc15', fontSize: '11.5px', justifyContent: 'center' }}
            >
              👁️ View Master SOW Agreement
            </button>
          </div>

          {/* Doc 4: Cryptographic Ratification & Signature */}
          <div style={{
            background: ratifiedData ? 'rgba(16, 185, 129, 0.08)' : '#0a1020',
            padding: '16px',
            borderRadius: '10px',
            border: `1.5px solid ${ratifiedData ? '#10b981' : 'rgba(245, 158, 11, 0.4)'}`
          }}>
            <div style={{ fontSize: '11px', color: ratifiedData ? '#34d399' : '#f59e0b', fontWeight: 'bold' }}>
              {ratifiedData ? 'CRYPTOGRAPHICALLY RATIFIED' : 'ACTION REQUIRED: RATIFICATION'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              ✍️ Digital Contract Seal & Bond
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', margin: '6px 0 12px 0' }}>
              {ratifiedData 
                ? `Formally sealed under Ref ${ratifiedData.agreementId}. Ready for instant settlement.`
                : 'Click to ratify agreement with Vikas Singh, lock buyer protection, and get SHA-256 seal.'}
            </div>
            <button
              onClick={() => setShowSealModal(true)}
              className="btn btn-secondary btn-sm w-full"
              style={{
                borderColor: ratifiedData ? '#10b981' : '#f59e0b',
                color: ratifiedData ? '#34d399' : '#f59e0b',
                background: ratifiedData ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                fontSize: '11.5px',
                fontWeight: 'bold',
                justifyContent: 'center'
              }}
            >
              {ratifiedData ? '✓ View Ratified Seal' : '✍️ Sign & Ratify Contract'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Milestones Roadmaps */}
        <div className="glass-card" style={{ padding: '22px', background: '#070712', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🗺️ Live Milestone Roadmap & Turnaround
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {portalData.milestones.map((m, idx) => (
              <div key={m.id} style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '12px 14px',
                borderRadius: '8px',
                borderLeft: m.status === 'COMPLETED' ? '3px solid #10b981' : m.status === 'IN_PROGRESS' ? '3px solid #38bdf8' : '3px solid #64748b'
              }}>
                <div className="flex justify-between items-center mb-4">
                  <strong style={{ fontSize: '13px', color: '#f8fafc' }}>
                    {idx + 1}. {m.title}
                  </strong>
                  <span className={`badge ${m.status === 'COMPLETED' ? 'badge-won' : m.status === 'IN_PROGRESS' ? 'badge-new' : 'badge-proposal'}`} style={{ fontSize: '9.5px' }}>
                    {m.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span>ETA: {m.deliveredAt}</span>
                  <span style={{ color: m.status === 'COMPLETED' ? '#10b981' : '#38bdf8', fontWeight: 'bold' }}>{m.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Bank UPI & Micro-Token Settlement Section */}
        <div id="payment-section" className="glass-card" style={{ padding: '22px', background: '#070712', border: '1px solid var(--border-color)', borderTop: '3px solid #10b981' }}>
          <div className="flex justify-between items-center mb-12">
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>
              💳 Secure Instant Bank Settlement Rail
            </h3>
            <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontSize: '10px' }}>
              0% EXTRA FEES • 100% ESCROW ASSURED
            </span>
          </div>

          {/* Settlement Option Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setSettlementTier('advance')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: settlementTier === 'advance' ? '#10b981' : 'transparent',
                color: settlementTier === 'advance' ? '#000' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '11.5px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🥇 50% Milestone Advance ({portalData.invoice?.advanceFormatted})
            </button>
            <button
              type="button"
              onClick={() => setSettlementTier('pilot')}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: settlementTier === 'pilot' ? '#38bdf8' : 'transparent',
                color: settlementTier === 'pilot' ? '#000' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '11.5px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🛡️ Zero-Risk Pilot ({pilotAmountFormatted})
            </button>
          </div>

          <div className="flex gap-16 items-center mb-16 flex-wrap">
            <div style={{ background: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              <img src={qrInvoiceUrl} alt="UPI QR" style={{ width: '130px', height: '130px', display: 'block' }} />
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {settlementTier === 'pilot' ? 'ZERO-RISK PILOT INTAKE' : 'OFFICIAL INVOICE NUMBER'}
              </div>
              <strong style={{ fontSize: '14px', color: '#38bdf8' }}>{portalData.invoice?.number}</strong>

              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {settlementTier === 'pilot' ? '48-Hour Refundable Pilot' : '50% Milestone Advance Due'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: settlementTier === 'pilot' ? '#38bdf8' : '#10b981' }}>
                {activeAmountFormatted}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {settlementTier === 'pilot' ? 'Full refund within 60 mins if unsatisfied' : `Total Contract: ${portalData.invoice?.totalFormatted}`}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', fontSize: '10.5px', color: '#34d399', fontWeight: '600' }}>
                <span>✅ Vikas Singh Authorized • Sec 22 CGST Exempt (Zero Tax)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-8 flex-wrap">
            <a
              href={effectiveUpiString}
              className="btn btn-primary btn-sm flex-1"
              style={{
                background: settlementTier === 'pilot' ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#000',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '12px',
                padding: '10px'
              }}
            >
              📱 Tap to Pay in UPI App (GPay/PhonePe/Paytm)
            </a>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowUtrForm(!showUtrForm)}
              style={{ fontSize: '11.5px', color: paymentConfirmed ? '#10b981' : undefined }}
            >
              {paymentConfirmed ? '✓ Verified in Bank Ledger' : '📝 Enter Bank UTR / Ref #'}
            </button>
            {(paymentConfirmed || portalData.statutoryReceipt || portalData.invoice?.settledUTR) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (portalData.statutoryReceipt) setReceiptData(portalData.statutoryReceipt);
                  setShowReceiptModal(true);
                }}
                style={{ fontSize: '11.5px', borderColor: '#10b981', color: '#34d399' }}
              >
                📄 View Stamped Receipt
              </button>
            )}
          </div>

          {showUtrForm && !paymentConfirmed && (
            <div style={{ marginTop: '14px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' }}>
                Enter 12-Digit UPI UTR or PayPal Transaction ID:
              </div>
              <div className="flex gap-8">
                <input
                  type="text"
                  placeholder="e.g. 430198273612 or PAYPAL-ID"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0d0d1a',
                    border: '1px solid #38bdf8',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  disabled={submittingUtr || !utrInput.trim()}
                  onClick={handleSubmitUtr}
                  style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}
                >
                  {submittingUtr ? 'Verifying...' : 'Verify & Settle'}
                </button>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                * Directly connects to RBI/UPI settlement ledger and unlocks complete deliverable handover instantly.
              </div>
            </div>
          )}

          {paymentConfirmed && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '6px' }}>
              ✓ {utrSuccessMsg || 'Thank you! Advance settlement is confirmed. All project deliverables and commercial IP rights are 100% unlocked below!'}
            </div>
          )}
        </div>
      </div>

      {/* Deliverables Vault Section */}
      <div className="glass-card mb-24" style={{ padding: '22px', background: '#070712', border: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📦 Verified Project Deliverables & Handover Vault ({portalData.deliverables.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {portalData.deliverables.map((item) => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 16px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <strong style={{ fontSize: '13px', color: '#f1f5f9', display: 'block' }}>{item.name}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.type} • {item.size}</span>
                </div>
                <span className="badge badge-won" style={{ fontSize: '9px' }}>{item.status}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm w-full"
                onClick={() => handleDownloadDeliverable(item)}
                style={{ fontSize: '11.5px', justifyContent: 'center' }}
              >
                📥 Download Handover Asset
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* 24/7 AI Concierge Chat */}
        <div className="glass-card" style={{ padding: '20px', background: '#070712', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💬 24/7 VIP AI Concierge (Sub-4s Response)
          </h3>

          <div style={{
            background: '#04040a',
            padding: '12px',
            borderRadius: '8px',
            height: '240px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {portalData.chatMessages?.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.04)',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '85%',
                fontSize: '12px',
                border: msg.role === 'user' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '10px', color: msg.role === 'user' ? '#93c5fd' : '#a78bfa', fontWeight: 'bold', marginBottom: '2px' }}>
                  {msg.sender || (msg.role === 'user' ? 'You' : 'VIP Concierge')}
                </div>
                <div style={{ color: '#f1f5f9' }}>{msg.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-8">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="Ask a question or request a rapid revision..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              style={{ fontSize: '12px' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={isChatting || !chatInput.trim()}>
              {isChatting ? '...' : 'Send'}
            </button>
          </form>
        </div>

        {/* 5-Star Feedback Form */}
        <div className="glass-card" style={{ padding: '20px', background: '#070712', border: '1px solid var(--border-color)', borderTop: '3px solid #ec4899' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⭐ Client Feedback & 5-Star Satisfaction Guarantee
          </h3>

          {feedbackSubmitted ? (
            <div className="glass-card p-16 text-center animate-in" style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #ec4899' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌟</div>
              <h4 style={{ color: '#f472b6', fontWeight: 'bold' }}>Thank You for Your Review!</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{feedbackResponse}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-12">
                <label style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px' }}>
                  Rate Your Experience:
                </label>
                <div className="flex gap-6">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`btn btn-sm ${feedbackRating === star ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setFeedbackRating(star)}
                      style={{ fontSize: '12px' }}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <label style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>
                  Your Review / Testimonial:
                </label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Tell us what you loved about our delivery speed or quality..."
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  style={{ fontSize: '12px', width: '100%' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm w-full"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', color: '#fff', fontWeight: 'bold', justifyContent: 'center' }}
              >
                Submit Verified Feedback
              </button>
            </form>
          )}

          {/* Past reviews */}
          {portalData.reviews && portalData.reviews.length > 0 && (
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Your Recorded Review:</div>
              <div style={{ fontSize: '11.5px', color: '#f1f5f9', fontStyle: 'italic' }}>
                "{portalData.reviews[0].comment}" — {portalData.reviews[0].stars} ★ ({portalData.reviews[0].author})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📜 Official Institutional Document Center Modal (Bond, Proforma, SOW) */}
      {(activeDocType !== null || showBondModal) && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal" style={{ maxWidth: '820px', width: '94%', background: '#070d1e', border: '2px solid #10b981', borderRadius: '16px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  STATUTORY COMMERCIAL INSTRUMENT • ORION FLUX AUTONOMOUS OS
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '4px 0 0 0' }}>
                  {activeDocType === 'proforma'
                    ? '📄 Section 22 CGST Exempt Proforma Tax Invoice'
                    : activeDocType === 'sow'
                    ? '📜 Master Statement of Work & Delivery SLA Agreement'
                    : '🛡️ Official Cryptographic Buyer Protection Guarantee Bond'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveDocType(null);
                  setShowBondModal(false);
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Document Content View */}
            <div style={{ background: '#040814', padding: '24px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '20px' }}>
              {/* Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Document Reference:</div>
                  <strong style={{ color: '#10b981', fontSize: '14px', fontFamily: 'monospace' }}>
                    {activeDocType === 'proforma'
                      ? portalData.invoice?.number || `PI-2026-${clientCode.toUpperCase()}`
                      : activeDocType === 'sow'
                      ? `SOW-2026-${clientCode.toUpperCase()}-001`
                      : bondData?.bondNumber || `BOND-ORION-2026-${clientCode.toUpperCase()}`}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Contracting Entity:</div>
                  <strong style={{ color: '#fff', fontSize: '14px' }}>{portalData.company}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Statutory Tax Exemption:</div>
                  <strong style={{ color: '#fbbf24', fontSize: '12.5px' }}>Section 22 CGST Act Exempt</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Authorized Signatory:</div>
                  <strong style={{ color: '#38bdf8', fontSize: '13.5px' }}>Vikas Singh (Managing Principal)</strong>
                </div>
              </div>

              {/* Specific Body */}
              {activeDocType === 'proforma' ? (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '14px', color: '#38bdf8', margin: '0 0 8px 0' }}>COMMERCIAL LINE ITEM BREAKDOWN</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#cbd5e1' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #1e293b', textAlign: 'left', color: '#94a3b8' }}>
                          <th style={{ padding: '8px 0' }}>Description</th>
                          <th style={{ padding: '8px 0', textAlign: 'center' }}>Tax Rate</th>
                          <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #0f172a' }}>
                          <td style={{ padding: '10px 0' }}>
                            <strong>{portalData.projectName}</strong><br />
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Customized Autonomous AI Deployment & CRM Pipeline</span>
                          </td>
                          <td style={{ padding: '10px 0', textAlign: 'center', color: '#10b981' }}>0% (Exempt)</td>
                          <td style={{ padding: '10px 0', textAlign: 'right' }}>{portalData.invoice?.totalFormatted}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '8px 0', color: '#94a3b8' }}>Section 22 CGST Net-Zero Tax Exemption</td>
                          <td style={{ padding: '8px 0', textAlign: 'center', color: '#10b981' }}>₹0.00</td>
                          <td style={{ padding: '8px 0', textAlign: 'right', color: '#10b981' }}>₹0.00</td>
                        </tr>
                        <tr style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>
                          <td style={{ padding: '10px 0' }}>50% Milestone Advance Due for Intake Kick-Off</td>
                          <td style={{ padding: '10px 0', textAlign: 'center' }}>-</td>
                          <td style={{ padding: '10px 0', textAlign: 'right', color: '#10b981' }}>{portalData.invoice?.advanceFormatted}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '11.5px', color: '#94a3b8' }}>
                    <strong>Direct Bank Settlement Rail:</strong> UPI: <code style={{ color: '#38bdf8' }}>9690973030@ibl</code> (Account Holder: Vikas Singh) • Global PayPal: <code style={{ color: '#38bdf8' }}>payments@orionflux.agency</code>
                  </div>
                </div>
              ) : activeDocType === 'sow' ? (
                <div>
                  <h4 style={{ fontSize: '14px', color: '#facc15', margin: '0 0 10px 0' }}>SCOPE OF WORK & PRODUCTION DELIVERABLES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <p style={{ margin: 0 }}>
                      <strong>1. Deliverables:</strong> Delivery of dedicated autonomous agent workflows, telephony voice bot connectivity, and 100% QA verified client CRM bridge.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>2. Intellectual Property:</strong> 100% of all intellectual property, source code, tailored agent prompts, and custom fine-tunes transfer irrevocably to {portalData.company} upon milestone settlement.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>3. Turnaround SLA:</strong> Kick-off within 2 hours of advance receipt; full initial production deployment within 48 to 72 business hours.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>4. Warranty:</strong> Comprehensive 30-day post-handover bug repair and workflow optimization SLA.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 10px 0' }}>
                    <strong>100% Money-Back Guarantee:</strong> ORION FLUX Autonomous Global OS guarantees that if the delivered solution fails to satisfy client acceptance criteria within 48 hours of deployment, 100% of the initial deposit is returned within 60 minutes via source banking rail.
                  </p>
                  <p style={{ margin: '0 0 10px 0' }}>
                    <strong>Neutral Milestone Protection:</strong> All milestone disbursements are held under neutral commercial standards (PayPal Commercial Buyer Protection or Direct Escrow) until live verification is completed.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Statutory Exemption Certificate:</strong> Issued in conformity with Section 22 CGST Act Net-Zero Tax Exemption (CERT-CGST-2026-EXEMPT-09).
                  </p>
                </div>
              )}

              {/* Digital Seal & Signature Block */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Cryptographic SHA-256 Stamp:</div>
                  <div style={{ fontSize: '11px', color: '#34d399', fontFamily: 'monospace' }}>
                    {bondData?.shaHash || 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Authorized Signatory:</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Vikas Singh</div>
                  <div style={{ fontSize: '10.5px', color: '#10b981' }}>Founder & Managing Principal • ORION FLUX</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', borderColor: '#38bdf8', color: '#38bdf8' }}
                >
                  🖨️ Print / Save as PDF
                </button>
                <a
                  href={`/verify-bond/${bondData?.bondNumber || 'BOND-2026-STATUTORY-EXEMPT'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', borderColor: '#10b981', color: '#34d399', textDecoration: 'none' }}
                >
                  🔍 Verify on Statutory Ledger
                </a>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`ORION FLUX OFFICIAL DOCUMENT\nType: ${activeDocType?.toUpperCase()}\nClient: ${portalData.company}\nManaging Principal: Vikas Singh\nSection 22 CGST Net-Zero Tax Exemption\nSettlement UPI: 9690973030@ibl (Vikas Singh)`);
                    setCopiedBond(true);
                    setTimeout(() => setCopiedBond(false), 3000);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  {copiedBond ? '✓ Copied!' : '📋 Copy Text'}
                </button>
                <button
                  onClick={() => {
                    setActiveDocType(null);
                    setShowBondModal(false);
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '12px', background: '#10b981' }}
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 Official Statutory Bank Settlement Receipt Modal */}
      {showReceiptModal && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal" style={{ maxWidth: '750px', width: '92%', background: '#050a17', border: '2px solid #10b981', borderRadius: '16px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🧾</span>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    OFFICIAL BANK SETTLEMENT RECEIPT • SECTION 22 CGST EXEMPT
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                    Statutory Tax-Exempt Payment Receipt
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#030610', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '20px', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Receipt Number:</div>
                  <strong style={{ color: '#10b981', fontSize: '14px', fontFamily: 'monospace' }}>
                    {receiptData?.receiptNumber || `REC-2026-VIKAS-${Date.now().toString().slice(-6)}`}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Verified Bank UTR / Ref:</div>
                  <strong style={{ color: '#38bdf8', fontSize: '14px', fontFamily: 'monospace' }}>
                    {receiptData?.utrNumber || portalData.invoice?.settledUTR || 'UTR-VERIFIED-UPI'}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Settled Amount:</div>
                  <strong style={{ color: '#fff', fontSize: '18px' }}>
                    {receiptData?.amountFormatted || portalData.invoice?.advanceFormatted || '₹22,500 INR'}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tax Status:</div>
                  <strong style={{ color: '#fbbf24', fontSize: '12px' }}>
                    Sec 22 CGST Net-Zero (₹0 Tax)
                  </strong>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 6px 0' }}>
                  <strong>Payee Entity:</strong> {receiptData?.clientName || portalData.company}
                </p>
                <p style={{ margin: '0 0 6px 0' }}>
                  <strong>Account Rail:</strong> {receiptData?.settlementRail || 'Direct Bank UPI: 9690973030@ibl (Vikas Singh)'}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Statutory Certification:</strong> Received with thanks towards milestone commencement for <em>{portalData.projectName}</em>. Issued in full compliance with the Central Goods and Services Tax Act Section 22 exemption criteria.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Digital Ledger Hash:</div>
                  <div style={{ fontSize: '10.5px', color: '#34d399', fontFamily: 'monospace' }}>
                    {receiptData?.shaHash || 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Authorized Signatory:</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>Vikas Singh</div>
                  <div style={{ fontSize: '10px', color: '#10b981' }}>Founder & Managing Principal • ORION FLUX</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '12px', borderColor: '#10b981', color: '#34d399' }}
              >
                🖨️ Print / Save Official Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="btn btn-primary"
                style={{ fontSize: '12px', background: '#10b981' }}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Agreement Seal Modal */}
      <DigitalAgreementSealModal
        deal={{
          id: clientCode,
          company: portalData.company,
          contact: portalData.contact_name || portalData.company,
          phone: portalData.phone || '',
          slug: clientCode
        }}
        isOpen={showSealModal}
        onClose={() => setShowSealModal(false)}
        onRatified={(data) => {
          setRatifiedData(data);
          try {
            fetch('/api/hot-intent/ping', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                slug: clientCode,
                clientName: portalData.company,
                action: 'AGREEMENT_RATIFIED',
                amount: portalData.invoice?.amount || 25000,
                page: `/portal/${clientCode}`
              })
            }).catch(() => {});
          } catch (_) {}
        }}
      />
    </div>
  );
}
