import React, { useState, useEffect } from 'react';

export default function AutonomousDealCloserWidget() {
  const [candidates, setCandidates] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [objectionType, setObjectionType] = useState('DISCOUNT_REQUEST');
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState(null);
  const [showProformaModal, setShowProformaModal] = useState(false);
  const [proformaData, setProformaData] = useState(null);
  const [loadingProforma, setLoadingProforma] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const [showCadence, setShowCadence] = useState(false);
  const [cadenceList, setCadenceList] = useState([]);
  const [copiedCadenceId, setCopiedCadenceId] = useState(null);

  const loadCadence = () => {
    fetch('/api/deal-recovery/pipeline')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.pipeline) {
          setCadenceList(res.pipeline);
        }
      })
      .catch(() => {});
  };

  const loadCandidates = () => {
    fetch('/api/rapid-payment/candidates')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.candidates) {
          setCandidates(res.candidates);
          if (!selectedDeal && res.candidates.length > 0) {
            setSelectedDeal(res.candidates[0]);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCandidates();
    loadCadence();
  }, []);

  const handleOpenProforma = (dealId) => {
    setLoadingProforma(true);
    setShowProformaModal(true);

    fetch(`/api/deal-closer/proforma/${dealId}`)
      .then(res => res.json())
      .then(res => {
        setLoadingProforma(false);
        if (res.success) {
          setProformaData(res.invoice);
        }
      })
      .catch(() => setLoadingProforma(false));
  };

  const handleExecutePush = () => {
    if (!selectedDeal) return;
    setPushing(true);
    setPushResult(null);

    fetch(`/api/deal-closer/push/${selectedDeal.dealId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objectionType })
    })
      .then(res => res.json())
      .then(res => {
        setPushing(false);
        setPushResult(res);
      })
      .catch(err => {
        setPushing(false);
        setPushResult({ success: false, error: err.message });
      });
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(''), 2500);
  };

  if (candidates.length === 0) return null;

  return (
    <div
      className="glass-card mb-24"
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.12)'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-18 pb-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🤝</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.3px', margin: 0, color: '#fff' }}>
                High-Conversion Deal Finalizer & Objection Annihilator
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Automated Proforma Invoices • 1-Click Executive Concessions • Win Rate Accelerator (65%+)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCadence(!showCadence)}
            style={{
              background: showCadence ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: showCadence ? '#000' : '#34d399',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {showCadence ? '✕ Close Recovery Cadence' : `⚡ Follow-Up Cadence (${cadenceList.length} Ready)`}
          </button>
          <button
            onClick={() => handleOpenProforma(selectedDeal ? selectedDeal.dealId : candidates[0].dealId)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📄 View Stamped Proforma Invoice
          </button>
        </div>
      </div>

      {/* 🚀 Autonomous Deal Recovery Cadence Panel */}
      {showCadence && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>
                ⚡ Automated Follow-Up & Revenue Recovery Pipeline
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Pre-calculated 24h/48h/72h cadences with 1-click WhatsApp dispatch signed by Vikas Singh
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
              {cadenceList.length} Actionable Deals
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
            {cadenceList.slice(0, 6).map((item) => (
              <div
                key={item.dealId}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#fff' }}>{item.company}</strong>
                    <div style={{ fontSize: '11px', color: '#38bdf8' }}>{item.totalValue} (Advance: {item.advanceValue})</div>
                  </div>
                  <span style={{
                    fontSize: '9.5px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.cadenceStage === 'STAGE_1_SANDBOX_PILOT' ? 'rgba(56, 189, 248, 0.2)' : item.cadenceStage === 'STAGE_2_EXECUTIVE_ASSURANCE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    color: item.cadenceStage === 'STAGE_1_SANDBOX_PILOT' ? '#38bdf8' : item.cadenceStage === 'STAGE_2_EXECUTIVE_ASSURANCE' ? '#34d399' : '#facc15',
                    fontWeight: 'bold'
                  }}>
                    {item.stageTitle}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '10px', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                  "{item.scripts.hindi.slice(0, 110)}..."
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <a
                    href={item.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      background: '#25D366',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    📲 WhatsApp Pitch
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.scripts.hindi);
                      setCopiedCadenceId(item.dealId);
                      setTimeout(() => setCopiedCadenceId(null), 2500);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedCadenceId === item.dealId ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid #38bdf8',
                      color: '#38bdf8',
                      fontSize: '11px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    🔗 Portal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '18px' }}>
        {/* Left Column: Select Deal */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
            1. Select High-Probability Deal to Finalize
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {candidates.slice(0, 4).map((deal) => {
              const isSelected = selectedDeal && selectedDeal.dealId === deal.dealId;
              return (
                <div
                  key={deal.dealId}
                  onClick={() => setSelectedDeal(deal)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                    border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: isSelected ? '#10b981' : '#fff' }}>
                      {deal.company}
                    </strong>
                    <span style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 'bold' }}>
                      Token: {deal.currencySymbol}{deal.tokenAmount}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Total: {deal.currencySymbol}{deal.totalAmount} • Phone: {deal.phone || 'Email Pipeline'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Objection Annihilator & 1-Click Action */}
        {selectedDeal && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              2. Select Client Objection to Annihilate:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setObjectionType('DISCOUNT_REQUEST')}
                style={{
                  background: objectionType === 'DISCOUNT_REQUEST' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: objectionType === 'DISCOUNT_REQUEST' ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: objectionType === 'DISCOUNT_REQUEST' ? '#60a5fa' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💎 Discount Ask
              </button>

              <button
                type="button"
                onClick={() => setObjectionType('TRUST_DEFENSE')}
                style={{
                  background: objectionType === 'TRUST_DEFENSE' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: objectionType === 'TRUST_DEFENSE' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: objectionType === 'TRUST_DEFENSE' ? '#34d399' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🛡️ Trust / Proof
              </button>

              <button
                type="button"
                onClick={() => setObjectionType('SCARCITY_URGENCY')}
                style={{
                  background: objectionType === 'SCARCITY_URGENCY' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: objectionType === 'SCARCITY_URGENCY' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: objectionType === 'SCARCITY_URGENCY' ? '#fbbf24' : 'var(--text-secondary)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ⏳ Timing Delay
              </button>
            </div>

            {/* Pitch Text Box */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '11px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
              maxHeight: '90px',
              overflowY: 'auto'
            }}>
              {objectionType === 'DISCOUNT_REQUEST' && (
                <span>
                  <strong>Concession Strategy:</strong> Free ₹3,500 4K Motion Reel Asset added at zero charge if client confirms ₹999 token today.
                </span>
              )}
              {objectionType === 'TRUST_DEFENSE' && (
                <span>
                  <strong>Risk Reversal Strategy:</strong> Zero-risk 100% full money-back guarantee if 48h live demo on phone line is not 100% satisfactory.
                </span>
              )}
              {objectionType === 'SCARCITY_URGENCY' && (
                <span>
                  <strong>Scarcity Lock Strategy:</strong> Strictly 2 clients per city monthly limit. Hold released to next business if not locked today.
                </span>
              )}
            </div>

            {/* Execution Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleExecutePush}
                disabled={pushing}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 'bold',
                  cursor: pushing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡</span> {pushing ? 'Dispatching...' : 'Dispatch Closing Push (Proforma + Pitch)'}
              </button>

              <button
                onClick={() => copyToClipboard(selectedDeal.upiTokenLink, 'token')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {copiedLink === 'token' ? '✓ Copied' : '📋 Copy UPI Link'}
              </button>

              {selectedDeal.directWhatsAppUrl && (
                <a
                  href={selectedDeal.directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#25D366',
                    color: '#000',
                    border: 'none',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📲 WhatsApp Deal
                </a>
              )}
            </div>

            {pushResult && (
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                background: pushResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: pushResult.success ? '#10b981' : '#ef4444',
                border: `1px solid ${pushResult.success ? '#10b981' : '#ef4444'}`
              }}>
                {pushResult.success ? `✓ Proforma Invoice & Closing Push successfully dispatched to ${pushResult.company}!` : pushResult.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proforma Invoice Modal */}
      {showProformaModal && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal" style={{ maxWidth: '800px', width: '92%', background: '#0b1329', border: '1.5px solid #10b981', borderRadius: '12px', padding: '24px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '12px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  📄 Official Stamped Proforma Invoice & Settlement Notice
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Section 22 CGST Exempt • Managing Principal Vikas Singh
                </div>
              </div>
              <button
                onClick={() => setShowProformaModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {loadingProforma || !proformaData ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                ⚡ Compiling official Proforma Invoice...
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
                  <div><strong>Invoice Number:</strong> {proformaData.invoiceNumber}</div>
                  <div><strong>Issue Date:</strong> {proformaData.date} (Due in 24h)</div>
                  <div><strong>Billed Entity:</strong> {proformaData.clientCompany}</div>
                  <div><strong>Tax Treatment:</strong> {proformaData.financials?.taxRate}</div>
                  <div><strong>50% Advance Milestone:</strong> {proformaData.financials?.advanceFormatted}</div>
                  <div><strong>1-Click Token Advance:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{proformaData.financials?.tokenFormatted}</span></div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 6px 0', fontSize: '13px' }}>Included SOW Deliverables:</h4>
                  {proformaData.lineItems?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: '500' }}>{item.item}</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>₹{item.amount?.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                    Direct Bank Settlement Rail:
                  </div>
                  <div>UPI ID: <strong style={{ color: '#fff' }}>{proformaData.financials?.upiId}</strong> (Vikas Singh)</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    Google Pay / PhonePe / Paytm / BHIM 1-Click QR Settlement Active
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setShowProformaModal(false)}
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    ✓ Close Invoice Inspector
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
