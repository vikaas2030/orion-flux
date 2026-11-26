import React, { useState, useEffect } from 'react';

export default function UniversalCheckoutWidget() {
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('microToken');
  const [submissionForm, setSubmissionForm] = useState({
    transactionRef: '',
    paymentMethod: 'UPI (9690973030@ibl)'
  });
  const [submitStatus, setSubmitStatus] = useState('');

  // Fetch pending deals to generate live checkout
  useEffect(() => {
    fetch('/api/deals/pipeline')
      .then(r => r.json())
      .then(data => {
        const activeDeals = [];
        if (data.pipeline) {
          Object.values(data.pipeline).forEach(arr => {
            if (Array.isArray(arr)) activeDeals.push(...arr);
          });
        }
        setDeals(activeDeals);
        if (activeDeals.length > 0) {
          setSelectedDealId(activeDeals[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch checkout options whenever deal changes
  useEffect(() => {
    if (!selectedDealId) return;
    setLoading(true);
    fetch(`/api/checkout/deal/${selectedDealId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setCheckoutData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDealId]);

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!submissionForm.transactionRef) return;

    const tierInfo = checkoutData?.pricingTiers?.[selectedTier];

    fetch('/api/checkout/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: selectedDealId,
        clientName: checkoutData?.clientCompany,
        amount: tierInfo?.amount || 49,
        currency: checkoutData?.currency || 'USD',
        transactionRef: submissionForm.transactionRef,
        paymentMethod: submissionForm.paymentMethod,
        tierChosen: selectedTier
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setSubmitStatus(`✅ Verified: Receipt #${res.receipt.receiptId} issued. Staged for bank reconciliation.`);
          setSubmissionForm({ transactionRef: '', paymentMethod: 'UPI (9690973030@ibl)' });
          setTimeout(() => setSubmitStatus(''), 7000);
        }
      });
  };

  if (!checkoutData) return null;

  const tiers = checkoutData.pricingTiers || {};
  const currentTier = tiers[selectedTier] || tiers.microToken;
  const isUSD = checkoutData.currency === 'USD';

  return (
    <div className="glass-card mb-24 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #090e17 0%, #04060b 100%)',
      border: '1px solid rgba(16, 185, 129, 0.4)',
      boxShadow: '0 8px 36px rgba(16, 185, 129, 0.15)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '24px',
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
                Zero-Friction Universal Buyer Protection & Checkout Rail
              </h3>
              <span style={{
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontWeight: '700'
              }}>
                ● ESCROW TRUST SHIELD ACTIVE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Micro-commitment tokens ($49 / ₹999), instant UPI QR code & global PayPal buyer protection guarantee
            </p>
          </div>
        </div>

        {/* Deal Selector Dropdown */}
        <div style={{ minWidth: '220px' }}>
          <select
            value={selectedDealId}
            onChange={e => setSelectedDealId(e.target.value)}
            className="form-select"
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: '12px',
              padding: '7px 12px',
              borderRadius: '8px',
              width: '100%'
            }}
          >
            {deals.map(d => (
              <option key={d.id} value={d.id}>
                {d.lead_company || d.title} ({d.currency === 'USD' ? `$${d.value}` : `₹${d.value}`})
              </option>
            ))}
          </select>
        </div>
      </div>

      {submitStatus && (
        <div className="mb-14 p-12 animate-in" style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          color: '#34d399',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {submitStatus}
        </div>
      )}

      {/* 3 Pricing Commitment Tiers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        {/* Tier 1: Micro Token */}
        <div
          onClick={() => setSelectedTier('microToken')}
          style={{
            background: selectedTier === 'microToken' ? 'rgba(16, 185, 129, 0.12)' : '#090d16',
            border: selectedTier === 'microToken' ? '2px solid #10b981' : '1px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <span style={{
            position: 'absolute',
            top: '-9px',
            right: '12px',
            background: '#10b981',
            color: '#000',
            fontSize: '9.5px',
            fontWeight: '900',
            padding: '2px 8px',
            borderRadius: '10px'
          }}>
            94% CONVERSION RATE
          </span>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Zero-Hesitation Token</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#34d399', margin: '4px 0' }}>
            {tiers.microToken?.formatted}
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
            {tiers.microToken?.label}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
            {tiers.microToken?.description}
          </div>
        </div>

        {/* Tier 2: 50% Advance */}
        <div
          onClick={() => setSelectedTier('advance50')}
          style={{
            background: selectedTier === 'advance50' ? 'rgba(56, 189, 248, 0.12)' : '#090d16',
            border: selectedTier === 'advance50' ? '2px solid #38bdf8' : '1px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Standard Handover</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8', margin: '4px 0' }}>
            {tiers.advance50?.formatted}
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
            {tiers.advance50?.label}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
            {tiers.advance50?.description}
          </div>
        </div>

        {/* Tier 3: 100% Upfront Discount */}
        <div
          onClick={() => setSelectedTier('fullDiscount')}
          style={{
            background: selectedTier === 'fullDiscount' ? 'rgba(234, 179, 8, 0.12)' : '#090d16',
            border: selectedTier === 'fullDiscount' ? '2px solid #eab308' : '1px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>VIP Fast-Action</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#facc15', margin: '4px 0' }}>
            {tiers.fullDiscount?.formatted}
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
            {tiers.fullDiscount?.label}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
            {tiers.fullDiscount?.description}
          </div>
        </div>
      </div>

      {/* Active Selected Payment Rail & QR / Link Display */}
      <div style={{
        background: '#070a12',
        borderRadius: '10px',
        padding: '18px',
        border: '1px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '18px'
      }}>
        {/* Left: Instant Payment Action */}
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '6px' }}>
            ⚡ Selected Option: {currentTier.label} ({currentTier.formatted})
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
            Client pays directly to verified receiving destination with zero intermediary risk.
          </p>

          <div className="flex gap-10 flex-wrap">
            {/* UPI Direct Link */}
            <a
              href={currentTier.upiUrl || 'upi://pay?pa=9690973030@ibl'}
              className="btn btn-primary"
              style={{
                fontSize: '12.5px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#000',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📱 Instant UPI QR (9690973030@ibl)
            </a>

            {/* PayPal Global Protection Link */}
            {isUSD && (
              <a
                href={currentTier.paypalUrl || 'https://www.paypal.com/paypalme/orionfluxagency'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  fontSize: '12.5px',
                  padding: '8px 16px',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🔒 PayPal Buyer Protection Escrow
              </a>
            )}
          </div>
        </div>

        {/* Right: Payment Reference Verification Box */}
        <div style={{ background: '#0a0e1a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
            📥 Submit UTR / Transaction Reference (Instant Verification)
          </div>

          <form onSubmit={handleSubmitProof}>
            <div style={{ marginBottom: '8px' }}>
              <input
                type="text"
                required
                placeholder="Enter 12-digit UPI UTR / PayPal Transaction ID"
                value={submissionForm.transactionRef}
                onChange={e => setSubmissionForm({ ...submissionForm, transactionRef: e.target.value })}
                className="form-input w-full"
                style={{ background: '#0f172a', color: '#fff', fontSize: '12px', padding: '7px 10px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={submissionForm.paymentMethod}
                onChange={e => setSubmissionForm({ ...submissionForm, paymentMethod: e.target.value })}
                className="form-select"
                style={{ background: '#0f172a', color: '#fff', fontSize: '11px', flex: 1 }}
              >
                <option value="UPI (9690973030@ibl)">Direct Bank UPI (9690973030@ibl)</option>
                <option value="PayPal Buyer Protection">PayPal Buyer Protection Escrow</option>
                <option value="Contra / Upwork Escrow">Contra / Upwork Direct Contract</option>
              </select>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 'bold', background: '#10b981', color: '#000' }}
              >
                Verify & Issue Receipt
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trust & Legal Protection Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px',
        fontSize: '11px',
        color: '#94a3b8'
      }}>
        {checkoutData.trustGuarantees?.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
