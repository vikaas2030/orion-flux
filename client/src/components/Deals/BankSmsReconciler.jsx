import React, { useState, useEffect } from 'react';

const SAMPLE_TEMPLATES = [
  {
    label: 'SBI UPI (₹2,500)',
    text: 'Dear SBI User, A/C 9030 credited by Rs 2,500.00 on 01Nov26 by UPI/430128491823/Ref Dr Mukul Gupta'
  },
  {
    label: 'HDFC UPI (₹3,000)',
    text: 'HDFC Bank: Rs. 3,000.00 deposited to A/c ... via UPI Ref No 430198124567 from Raj Dental'
  },
  {
    label: 'Paytm (₹2,500)',
    text: 'Received Rs.2,500 in your Paytm Bank from Parul Makeover Studio. UPI Ref: 430182736192'
  },
  {
    label: 'Bare UTR Only',
    text: '430192847192'
  }
];

export default function BankSmsReconciler({ isOpen, onClose, onSettlementComplete }) {
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customUtr, setCustomUtr] = useState('');
  const [customBank, setCustomBank] = useState('UPI Instant Bank Transfer');
  const [isSettling, setIsSettling] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-parse whenever input text changes (with debounce)
  useEffect(() => {
    if (!inputText.trim()) {
      setParsedData(null);
      return;
    }

    const timer = setTimeout(() => {
      setParsing(true);
      setErrorMsg('');
      fetch('/api/settlement/parse-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
        .then(res => res.json())
        .then(data => {
          setParsing(false);
          if (data.success) {
            setParsedData(data);
            if (data.parsed.amount) setCustomAmount(data.parsed.amount.toString());
            if (data.parsed.utrNumber) setCustomUtr(data.parsed.utrNumber);
            if (data.parsed.bankName) setCustomBank(data.parsed.bankName);

            // Auto-select top matching deal if available
            if (data.topMatch) {
              setSelectedDealId(data.topMatch.dealId);
            } else if (data.suggestedDeals && data.suggestedDeals.length > 0) {
              setSelectedDealId(data.suggestedDeals[0].dealId);
            }
          }
        })
        .catch(err => {
          setParsing(false);
          console.error('Parsing error:', err);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleExecuteSettlement = async () => {
    if (!selectedDealId) {
      setErrorMsg('Please select a deal to reconcile with.');
      return;
    }
    if (!customAmount || parseFloat(customAmount) <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (!customUtr || customUtr.length < 6) {
      setErrorMsg('Please provide a valid UTR / Transaction reference (at least 6 characters).');
      return;
    }

    setIsSettling(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/settlement/reconcile-and-close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: selectedDealId,
          amount: parseFloat(customAmount),
          utrNumber: customUtr,
          bankName: customBank,
          notes: `Reconciled via Bank SMS: ${inputText.slice(0, 100)}`
        })
      });

      const data = await res.json();
      setIsSettling(false);

      if (data.success) {
        setSettlementResult(data.receipt);
        if (onSettlementComplete) onSettlementComplete(data);
      } else {
        setErrorMsg(data.message || 'Settlement failed. Please verify deal ID.');
      }
    } catch (err) {
      setIsSettling(false);
      setErrorMsg(err.message || 'Network error during settlement.');
    }
  };

  const handleCopyReceipt = () => {
    if (!settlementResult) return;
    navigator.clipboard.writeText(settlementResult.whatsappReceiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⚡
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                Instant Bank SMS & UTR Auto-Reconciler
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Paste bank SMS or 12-digit UTR to auto-match deal, transition to WON, and generate verified receipt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {!settlementResult ? (
            <div>
              {/* Quick Template Chips */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>
                  💡 Quick Test Samples (or paste real SMS from your phone):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputText(tmpl.text)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        borderRadius: '20px',
                        border: '1px solid #334155',
                        backgroundColor: '#1e293b',
                        color: '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw Text Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>
                  Paste Bank SMS Text, UPI Notification, or 12-Digit UTR:
                </label>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="e.g. Dear SBI User, A/C 9030 credited by Rs 2,500.00 on 01Nov26 by UPI/430128491823/Ref Dr Mukul Gupta"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#020617',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Parsing Indicator */}
              {parsing && (
                <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⏳</span> Parsing bank text and matching against active deals...
                </div>
              )}

              {/* Parsed Extracted Entities Card */}
              {parsedData && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #1e293b',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✨</span> Cognitive Extraction Breakdown
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Detected Amount</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
                        {parsedData.parsed.amountFormatted || '—'}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>12-Digit UTR</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {parsedData.parsed.utrNumber || 'Not found'}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Payment Rail</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>
                        {parsedData.parsed.bankName || 'UPI Transfer'}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#020617', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Detected Payer</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b' }}>
                        {parsedData.parsed.payerName || 'Direct Reference'}
                      </div>
                    </div>
                  </div>

                  {/* Top Match Callout */}
                  {parsedData.topMatch && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                          🎯 Recommended Match:
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                          {parsedData.topMatch.company} — {parsedData.topMatch.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Reason: {parsedData.topMatch.matchReason}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#10b981',
                        color: '#020617',
                        fontWeight: '700',
                        fontSize: '11px'
                      }}>
                        {parsedData.topMatch.score}% MATCH
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settlement Form Controls */}
              <div style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: '#020617',
                border: '1px solid #1e293b',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '14px' }}>
                  Reconciliation & Settlement Parameters
                </div>

                {/* Deal Selection Dropdown */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                    Select Pipeline Deal to Close as WON:
                  </label>
                  <select
                    value={selectedDealId}
                    onChange={e => setSelectedDealId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="">-- Choose Deal to Settle --</option>
                    {parsedData?.suggestedDeals?.map(deal => (
                      <option key={deal.dealId} value={deal.dealId}>
                        {deal.company} — {deal.title} (Value: {deal.currency === 'USD' ? '$' : '₹'}{deal.value.toLocaleString()} | 50% Adv: {deal.currency === 'USD' ? '$' : '₹'}{deal.expectedAdvance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                      Verified Amount (₹):
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder="e.g. 2500"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '700',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                      12-Digit UTR Number:
                    </label>
                    <input
                      type="text"
                      value={customUtr}
                      onChange={e => setCustomUtr(e.target.value)}
                      placeholder="e.g. 430128491823"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: '#38bdf8',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                      Bank / Payment Rail:
                    </label>
                    <input
                      type="text"
                      value={customBank}
                      onChange={e => setCustomBank(e.target.value)}
                      placeholder="e.g. SBI UPI Transfer"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSettlement}
                  disabled={isSettling}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: isSettling ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSettling ? '⏳ Reconciling...' : '🚀 Reconcile Deposit & Mark Deal WON'}
                </button>
              </div>
            </div>
          ) : (
            /* Settlement Success State */
            <div>
              <div style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', margin: '0 0 6px' }}>
                  Deal Successfully Reconciled & Marked WON!
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 16px' }}>
                  The 50% milestone advance has been verified and permanently credited in the Bank Collections Ledger.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  textAlign: 'left',
                  backgroundColor: '#020617',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #1e293b'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Receipt No</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>{settlementResult.receiptNo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Client</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{settlementResult.clientCompany}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Amount Collected</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{settlementResult.amountFormatted}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Transaction UTR</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', fontFamily: 'monospace' }}>{settlementResult.utrNumber}</div>
                  </div>
                </div>
              </div>

              {/* Receipt Delivery Options */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px' }}>
                  Deliver Official Settlement Receipt to Client:
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#020617',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  marginBottom: '12px'
                }}>
                  {settlementResult.whatsappReceiptText}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <a
                    href={settlementResult.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#25d366',
                      color: '#020617',
                      fontWeight: '700',
                      fontSize: '13px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>💬</span> Send Receipt on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyReceipt}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#1e293b',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedReceipt ? '✅ Copied to Clipboard!' : '📋 Copy Receipt Text'}
                  </button>

                  <a
                    href={settlementResult.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      fontSize: '13px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🌐</span> Open Client Staging Portal
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSettlementResult(null);
                    setInputText('');
                    onClose();
                  }}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Done & Back to Pipeline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
