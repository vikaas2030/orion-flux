import React, { useState, useEffect } from 'react';

export default function RapidPaymentCommandWidget() {
  const [candidates, setCandidates] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [copiedLink, setCopiedLink] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [settling, setSettling] = useState(false);
  const [settleResult, setSettleResult] = useState(null);

  const loadCandidates = () => {
    fetch('/api/rapid-payment/candidates')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.candidates) {
          setCandidates(data.candidates);
          if (!selectedDeal && data.candidates.length > 0) {
            setSelectedDeal(data.candidates[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleDispatchUrgency = (dealId) => {
    setDispatching(true);
    setDispatchStatus(null);

    fetch(`/api/rapid-payment/dispatch-urgency/${dealId}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        setDispatching(false);
        setDispatchStatus(data);
        loadCandidates();
      })
      .catch(err => {
        setDispatching(false);
        setDispatchStatus({ success: false, error: err.message });
      });
  };

  const handleFastSettle = (e) => {
    e.preventDefault();
    if (!utrInput.trim()) {
      alert('Kripya 12-digit UTR enter karein.');
      return;
    }

    setSettling(true);
    setSettleResult(null);

    fetch('/api/rapid-payment/instant-settle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSlug: selectedDeal.slug,
        utrNumber: utrInput,
        amount: selectedDeal.advanceAmount,
        paymentMethod: 'UPI Instant (GPay / PhonePe)'
      })
    })
      .then(res => res.json())
      .then(data => {
        setSettling(false);
        setSettleResult(data);
        setUtrInput('');
      })
      .catch(err => {
        setSettling(false);
        setSettleResult({ success: false, error: err.message });
      });
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  if (loading && candidates.length === 0) {
    return null;
  }

  return (
    <div
      className="glass-card mb-24"
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.12)'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-20 pb-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.3px', margin: 0, color: '#fff' }}>
                Rapid Client Payment Accelerator (Zero-Hesitation Closing)
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                24-Hour Price Lock • Pre-Configured Asset Unlock • 100% Refundable Token (₹999 / $49)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            24H SCARCITY ENGINE ARMED
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
        {/* Left Column: Top Closing Candidates */}
        <div>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>
            🎯 Select High-Intent Target Deal
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {candidates.map((deal) => {
              const isSelected = selectedDeal && selectedDeal.dealId === deal.dealId;
              return (
                <div
                  key={deal.dealId}
                  onClick={() => setSelectedDeal(deal)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                    border: isSelected ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13.5px', color: isSelected ? '#f59e0b' : '#fff' }}>
                      {deal.company}
                    </strong>
                    <span style={{
                      fontSize: '11px',
                      background: deal.currency === 'USD' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: deal.currency === 'USD' ? '#818cf8' : '#10b981',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {deal.currencySymbol}{deal.advanceAmount} Adv
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    Total: {deal.currencySymbol}{deal.totalAmount} • Token: <strong style={{ color: '#fff' }}>{deal.currencySymbol}{deal.tokenAmount}</strong>
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', gap: '8px' }}>
                    <span>Phone: {deal.phone || 'Email Contact'}</span>
                    <span>•</span>
                    <span style={{ color: '#10b981' }}>Staged in Portal</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Deal Acceleration Console */}
        {selectedDeal && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
                    {selectedDeal.company} — Rapid Closer
                  </h3>
                  <a
                    href={selectedDeal.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: '#6366f1', textDecoration: 'underline' }}
                  >
                    View Private Client Workspace ↗
                  </a>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>1-Click Token Lock</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
                    {selectedDeal.currencySymbol}{selectedDeal.tokenAmount}
                  </div>
                </div>
              </div>

              {/* Tri-Fold Guarantees */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {selectedDeal.guarantees.map((g, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '8px 10px',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b' }}>✓ {g.title}</div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{g.desc}</div>
                  </div>
                ))}
              </div>

              {/* Pitch Preview Box */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  PRE-CONFIGURED HIGH-CONVERSION PITCH (HINGLISH / ENGLISH):
                </div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  color: 'var(--text-secondary)',
                  maxHeight: '110px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-line'
                }}>
                  {selectedDeal.currency === 'USD' ? selectedDeal.escrowUrgencyPitchEnglish : selectedDeal.whatsappUrgencyPitchHinglish}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedDeal.directWhatsAppUrl && (
                  <a
                    href={selectedDeal.directWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      padding: '9px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span>💬</span> Send WhatsApp VIP Lock
                  </a>
                )}

                <button
                  onClick={() => handleDispatchUrgency(selectedDeal.dealId)}
                  disabled={dispatching}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: dispatching ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>⚡</span> {dispatching ? 'Dispatching...' : 'Dispatch 24h Price Lock'}
                </button>

                <button
                  onClick={() => copyToClipboard(selectedDeal.upiTokenLink, 'token')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '9px 14px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedLink === 'token' ? '✓ Copied!' : `📋 Copy ${selectedDeal.currencySymbol}${selectedDeal.tokenAmount} Link`}
                </button>
              </div>

              {dispatchStatus && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  background: dispatchStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: dispatchStatus.success ? '#10b981' : '#ef4444',
                  border: `1px solid ${dispatchStatus.success ? '#10b981' : '#ef4444'}`
                }}>
                  {dispatchStatus.success ? '✓ 24-Hour VIP Price Lock Dispatched & Logged to CRM!' : dispatchStatus.error}
                </div>
              )}
            </div>

            {/* Instant UTR Settlement Input */}
            <form onSubmit={handleFastSettle} style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                🏦 Received Cash from this Client? Verify UTR & Hand Over:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="Paste 12-digit UTR (e.g. 430219884512)"
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '7px 10px',
                    color: '#fff',
                    fontSize: '11.5px'
                  }}
                />
                <button
                  type="submit"
                  disabled={settling}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 'bold',
                    cursor: settling ? 'wait' : 'pointer'
                  }}
                >
                  {settling ? 'Verifying...' : 'Settle Now'}
                </button>
              </div>

              {settleResult && (
                <div style={{
                  marginTop: '8px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  background: settleResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: settleResult.success ? '#10b981' : '#ef4444'
                }}>
                  {settleResult.success ? settleResult.message : settleResult.error}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
