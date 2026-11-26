import React, { useState, useEffect } from 'react';

export default function ClientPersuasionEngine() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [isPersuading, setIsPersuading] = useState(false);
  const [customObjection, setCustomObjection] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  const fetchConversations = () => {
    fetch('/api/persuasion/conversations')
      .then(res => res.json())
      .then(data => {
        if (data.conversations && Array.isArray(data.conversations)) {
          setConversations(data.conversations);
          if (!selectedConvId && data.conversations.length > 0) {
            setSelectedConvId(data.conversations[0].id);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleAutoPersuade = (e, explicitObjection = null, touchIdx = null) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeConv) return;
    setIsPersuading(true);

    const objectionText = explicitObjection || customObjection || null;

    fetch('/api/persuasion/auto-respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        convId: activeConv.id,
        objection: objectionText,
        touchIndex: touchIdx
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsPersuading(false);
        setCustomObjection('');
        fetchConversations();
        setActionNotice('⚡ 5x Persuasion Pulse Dispatched! Deal probability updated.');
        setTimeout(() => setActionNotice(''), 4000);
      })
      .catch(() => setIsPersuading(false));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid_won':
        return <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>💰 DEAL CLOSED & SETTLED</span>;
      case 'persuaded_closing':
        return <span className="badge badge-won" style={{ background: '#38bdf8', color: '#000', fontWeight: 'bold' }}>⚡ ADVANCE / TOKEN DISPATCHED</span>;
      case 'objection_handling':
        return <span className="badge badge-new" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>🛡️ 5X PERSUASION IN PROGRESS</span>;
      default:
        return <span className="badge badge-proposal">INITIAL PITCH SENT</span>;
    }
  };

  if (!conversations.length) return null;

  const strategy = activeConv?.strategy;

  return (
    <div className="glass-card mb-24 animate-in" style={{
      padding: '26px',
      borderLeft: '5px solid #10b981',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.03) 50%, rgba(139, 92, 246, 0.04) 100%)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div>
          <div className="flex items-center gap-8 flex-wrap">
            <h3 className="text-xl font-bold flex items-center gap-8">
              <span>🧠</span> Autonomous 5x Client Persuasion & Deal Closer
            </h3>
            <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
              5-PILLAR CONVERSION ENGINE
            </span>
          </div>
          <p className="text-sm text-tertiary mt-4">
            Destroys client hesitation using Reverse-Risk Micro-Tokens (₹999 / $49), Quantified Loss-Aversion ROI, 4-Touch Automated Follow-ups, and 4-Layer QA Pre-Certification.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <span className="badge badge-new" style={{ fontSize: '11px', padding: '6px 12px' }}>
            ⚡ {conversations.length} Real Clients in Active Pipeline
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="mb-16 p-12 rounded" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>
          {actionNotice}
        </div>
      )}

      {/* Client Tab Selector */}
      <div className="flex gap-8 mb-20 flex-wrap" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {conversations.map(conv => (
          <button
            key={conv.id}
            className={`btn btn-sm ${selectedConvId === conv.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedConvId(conv.id)}
            style={{
              background: selectedConvId === conv.id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{conv.status === 'paid_won' ? '✅' : '💬'}</span>
            <strong>{conv.company}</strong> ({conv.dealSize})
          </button>
        ))}
      </div>

      {/* Main Negotiation Console */}
      {activeConv && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {/* Header of Active Deal */}
          <div className="glass-card" style={{ padding: '16px 20px', background: '#07070f', border: '1px solid var(--border-color)' }}>
            <div className="flex justify-between items-center flex-wrap gap-12">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Target Business Profile</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>
                  {activeConv.company} — {activeConv.contact}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  📍 {activeConv.city} • {activeConv.niche}
                </div>
              </div>

              <div className="flex items-center gap-12 flex-wrap">
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Contract Value / 50% Advance</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>
                    {activeConv.dealSize} <span style={{ fontSize: '12px', color: '#94a3b8' }}>({activeConv.advanceFee} Milestone)</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Reverse-Risk Token</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
                    {activeConv.microToken} Deposit
                  </div>
                </div>
                {getStatusBadge(activeConv.status)}
              </div>
            </div>

            {/* 5-Pillar Strategy Blueprint Banner */}
            {strategy && (
              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                fontSize: '11.5px'
              }}>
                <div>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>📊 Quantified ROI:</span>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{strategy.roiCalculation}</p>
                </div>
                <div>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>🛡️ Pre-Delivery Proof:</span>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{strategy.liveProofDeliverable}</p>
                </div>
                <div>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>💳 Instant Pay Rail:</span>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>{strategy.paymentRail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick 4-Touch Cadence Dispatche Strip */}
          <div className="flex gap-8 flex-wrap items-center p-12 rounded" style={{ background: '#0a0a14', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-secondary)', marginRight: '6px' }}>
              ⏱️ 4-Touch Cadence Dispatches:
            </span>
            {[
              { label: 'Hour 0: Tailored Pitch', idx: 0 },
              { label: 'Hour 24: Proof & ROI', idx: 1 },
              { label: 'Hour 48: VIP Scarcity Slot', idx: 2 },
              { label: 'Hour 72: Breakup Nudge', idx: 3 }
            ].map(t => (
              <button
                key={t.idx}
                className="btn btn-secondary btn-sm"
                disabled={isPersuading}
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => handleAutoPersuade(null, null, t.idx)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Chat Stream: Realistic Multi-Turn Persuasion */}
          <div className="glass-card" style={{
            padding: '20px',
            background: '#04040a',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {activeConv.thread.map((msg, idx) => {
              const isClient = msg.sender === 'client';
              const isPersuasion = msg.sender === 'ai_persuasion';
              const isClosing = msg.sender === 'ai_closing';

              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isClient ? 'flex-start' : 'flex-end',
                    maxWidth: '84%',
                    background: isClient
                      ? 'rgba(245, 158, 11, 0.12)'
                      : isClosing
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isPersuasion
                          ? 'rgba(139, 92, 246, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                    border: isClient
                      ? '1px solid rgba(245, 158, 11, 0.35)'
                      : isClosing
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : isPersuasion
                          ? '1px solid rgba(139, 92, 246, 0.35)'
                          : '1px solid var(--border-color)',
                    padding: '12px 16px',
                    borderRadius: '10px'
                  }}
                >
                  <div className="flex justify-between items-center mb-4 gap-8">
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: isClient ? '#fbbf24' : isClosing ? '#34d399' : isPersuasion ? '#a78bfa' : '#38bdf8'
                    }}>
                      {isClient
                        ? `👤 ${activeConv.contact} (Client)`
                        : isClosing
                          ? '🏆 AI Closer (Payment Rail & Token)'
                          : isPersuasion
                            ? '🧠 5x Psychological Persuader'
                            : '⚡ Strategic SOW Pitch'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#f1f5f9', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {msg.message}
                  </p>

                  {!isClient && (
                    <div className="flex justify-end gap-6 mt-8">
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '10.5px' }}
                        onClick={() => copyToClipboard(msg.message, `msg-${idx}`)}
                      >
                        {copiedKey === `msg-${idx}` ? '✅ Copied' : '📋 Copy Text'}
                      </button>
                      {activeConv.currency !== 'USD' && activeConv.phone && (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${activeConv.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(msg.message)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '10.5px', background: '#25D366', color: '#000', fontWeight: 'bold' }}
                        >
                          💬 Send in WhatsApp
                        </a>
                      )}
                      {activeConv.currency === 'USD' && activeConv.email && (
                        <a
                          href={`mailto:${activeConv.email}?subject=${encodeURIComponent(`Project SOW & Milestone for ${activeConv.company}`)}&body=${encodeURIComponent(msg.message)}`}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '10.5px', background: '#3b82f6', color: '#fff', fontWeight: 'bold' }}
                        >
                          ✉️ Open in Email Client
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Console: Instant Objection Rebuttal Chips */}
          <div className="glass-card" style={{ padding: '16px 20px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
            <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
              <div>
                <strong style={{ fontSize: '13px', color: '#f1f5f9' }}>
                  ⚡ 1-Click Objection Annihilators for {activeConv.company}
                </strong>
                <p style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                  Click below to immediately dispatch psychological rebuttals that resolve client hesitations and trigger advance settlement.
                </p>
              </div>

              <div className="flex gap-6 flex-wrap">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={isPersuading}
                  style={{ fontSize: '11px' }}
                  onClick={() => handleAutoPersuade(null, 'Price is too high / Can you offer a discount?')}
                >
                  💰 Price Too High
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={isPersuading}
                  style={{ fontSize: '11px' }}
                  onClick={() => handleAutoPersuade(null, 'We already have an in-house team handling this.')}
                >
                  👥 Already Have Team
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={isPersuading}
                  style={{ fontSize: '11px' }}
                  onClick={() => handleAutoPersuade(null, 'How do I know the quality will be good? Show me proof.')}
                >
                  🔬 Prove Quality
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={isPersuading}
                  style={{ fontSize: '11px' }}
                  onClick={() => handleAutoPersuade(null, 'I need time to think and discuss with my partners.')}
                >
                  ⏳ Need Time
                </button>
              </div>
            </div>

            {/* Custom Objection Form */}
            {activeConv.status !== 'paid_won' && (
              <form onSubmit={e => handleAutoPersuade(e)} className="flex gap-8">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Or type any specific client doubt (e.g. 'Can we do 3 revisions before paying?')"
                  value={customObjection}
                  onChange={e => setCustomObjection(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isPersuading}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}
                >
                  {isPersuading ? '⚡ Formulating Persuasion Move...' : '🧠 Persuade & Advance Deal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
