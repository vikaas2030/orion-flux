import React, { useState } from 'react';

export default function AutonomousClientHandler({ onDealClosed }) {
  const [clientName, setClientName] = useState('Dr. Anuja Singh');
  const [businessName, setBusinessName] = useState('Dr Anuja Singh Healthcare Clinic');
  const [clientPhone, setClientPhone] = useState('9811223344');
  const [clientMessage, setClientMessage] = useState('Aapka package thoda mehenga hai, kya discount mil sakta hai?');
  const [dealValue, setDealValue] = useState(9000);
  const [advanceFee, setAdvanceFee] = useState(3000);

  const [handlingResult, setHandlingResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: '💰 Price / Discount Objection', msg: 'Price thoda zyada lag raha hai, kya thoda discount mil sakta hai?' },
    { label: '🛡️ Advance / Trust Hesitation', msg: 'Pehle advance kyon dein? Kaam hone ke baad poora payment de denge.' },
    { label: '👁️ Proof / Sample Request', msg: 'Kya aap pehle koi live sample ya proof dikha sakte hain?' },
    { label: '⚡ Delivery Timeline', msg: 'Hamein ye urgently chahiye, kitne din me setup live hoga?' },
    { label: '💳 Ready to Pay', msg: 'All good, please send payment details and QR code for advance.' }
  ];

  const handleProcessInquiry = (overrideMsg = null, overrideIntent = null) => {
    const msgToSend = overrideMsg || clientMessage;
    setIsProcessing(true);

    fetch('/api/deal-automation/handle-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName,
        businessName,
        clientPhone,
        clientMessage: msgToSend,
        dealValue,
        advanceFee,
        overrideIntent
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsProcessing(false);
        setHandlingResult(data);
      })
      .catch(() => setIsProcessing(false));
  };

  const handleQuickClose = () => {
    if (!window.confirm(`Mark deal for "${businessName}" as WON and record ₹${advanceFee} advance?`)) return;

    fetch('/api/deal-automation/quick-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName,
        amount: advanceFee,
        utrNumber: `UPI-CLOSE-${Date.now().toString().slice(-6)}`
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if (onDealClosed) onDealClosed();
      });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-24 mb-24 animate-in" style={{
      padding: '24px',
      borderLeft: '6px solid #6366f1',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)'
    }}>
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div>
          <div className="flex items-center gap-8 mb-4">
            <span style={{ fontSize: '24px' }}>🤖</span>
            <h3 className="text-lg font-bold" style={{ margin: 0 }}>Autonomous Client Negotiator & Deal Closer</h3>
            <span className="badge" style={{ background: '#6366f1', color: '#fff', fontWeight: 'bold' }}>100% AUTO-HANDLING</span>
          </div>
          <p className="text-xs text-tertiary" style={{ margin: 0 }}>
            Type any client objection or select a preset battlecard. The AI disarms objections, enforces the 14-day refund guarantee, and injects your UPI ID (<strong>9690973030@ibl</strong>).
          </p>
        </div>
      </div>

      {/* Preset Objection Battlecards */}
      <div className="mb-16">
        <span className="text-xs font-semibold text-tertiary uppercase block mb-8">
          Quick 1-Click Objection Scenarios:
        </span>
        <div className="flex gap-8 flex-wrap">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '4px 10px' }}
              onClick={() => {
                setClientMessage(p.msg);
                handleProcessInquiry(p.msg);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Row */}
      <div className="grid grid-3 gap-12 mb-12" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label text-xs">Client Contact Person</label>
          <input
            type="text"
            className="form-input"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label text-xs">Business / Company Name</label>
          <input
            type="text"
            className="form-input"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label text-xs">Client Phone Number</label>
          <input
            type="tel"
            className="form-input"
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group mb-16">
        <label className="form-label text-xs">Client's Exact Message or Objection:</label>
        <div className="flex gap-8">
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="e.g. Price kam karo, advance kyon du, sample dikhao..."
            value={clientMessage}
            onChange={e => setClientMessage(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={isProcessing || !clientMessage}
            onClick={() => handleProcessInquiry()}
          >
            {isProcessing ? '⚡ Generating...' : '🚀 Auto-Handle & Close'}
          </button>
        </div>
      </div>

      {/* Handling Result Output */}
      {handlingResult && (
        <div className="p-16 animate-in" style={{
          background: '#090d16',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
            <div className="flex items-center gap-8">
              <span className="badge" style={{ background: '#6366f1', color: '#fff' }}>
                Intent: {handlingResult.intentName}
              </span>
              <span className="text-xs text-secondary">
                Strategy: <strong>{handlingResult.strategy}</strong>
              </span>
            </div>
            <div className="text-xs text-tertiary">
              Advance Token: <strong style={{ color: '#10b981' }}>₹{handlingResult.advanceExpected.toLocaleString()}</strong> (UPI: {handlingResult.upiId})
            </div>
          </div>

          <div className="p-12 mb-16" style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '13px',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
              margin: 0
            }}>
              {handlingResult.aiReply}
            </pre>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-12">
            <div className="flex gap-8">
              {handlingResult.whatsappUrl && (
                <a
                  href={handlingResult.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  📲 Send Reply via WhatsApp ↗
                </a>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => copyText(handlingResult.aiReply)}
              >
                {copied ? '✅ Copied!' : '📋 Copy Reply Text'}
              </button>
            </div>

            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}
              onClick={handleQuickClose}
            >
              🎉 Mark Deal Won (Advance Received)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
