import React, { useState, useEffect } from 'react';

export default function DomesticFastCashCloserWidget() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDealForQR, setSelectedDealForQR] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  const loadData = () => {
    fetch('/api/domestic-closer/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetrics(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  if (loading && !metrics) return null;

  const deals = metrics?.deals || [];

  return (
    <div
      className="glass-card mb-24 animate-in"
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(56, 189, 248, 0.1) 100%)',
        border: '2px solid #10b981',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(16, 185, 129, 0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner Ribbon */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '-42px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#000',
        fontWeight: '900',
        fontSize: '9.5px',
        padding: '4px 45px',
        transform: 'rotate(45deg)',
        letterSpacing: '1px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
      }}>
        INSTANT UPI CASH
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-16 pb-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '30px' }}>⚡</span>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h2 style={{ fontSize: '19px', fontWeight: 'bold', letterSpacing: '-0.3px', margin: 0, color: '#fff' }}>
                  Domestic Fast-Cash Indian UPI Closer Engine
                </h2>
                <span style={{
                  fontSize: '10.5px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontWeight: 'bold'
                }}>
                  ● 10-MINUTE BANK SETTLEMENTS
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                Zero Wire Delays • Primary UPI Rail: <strong style={{ color: '#38bdf8' }}>9690973030@ibl (Vikas Singh)</strong> • Section 22 CGST Net-Zero Exemption
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginRight: '30px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '600' }}>
            Immediate Advance Pool
          </div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>
            {metrics?.totalAdvancePotentialFormatted}
          </div>
          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
            Pipeline: {metrics?.totalPipelineFormatted}
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ background: '#070f20', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Target B2B Domestic Deals</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
            {metrics?.totalDeals} High-Intent Clients
          </div>
          <div style={{ fontSize: '10.5px', color: '#38bdf8' }}>Mumbai, Bangalore, Delhi-NCR</div>
        </div>

        <div style={{ background: '#070f20', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Average Settlement Speed</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>
            &lt; 10 Minutes
          </div>
          <div style={{ fontSize: '10.5px', color: '#34d399' }}>Instant PhonePe / GPay / Paytm</div>
        </div>

        <div style={{ background: '#070f20', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Zero-Risk Pilot Pool</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#facc15', marginTop: '2px' }}>
            {metrics?.totalPilotPotentialFormatted}
          </div>
          <div style={{ fontSize: '10.5px', color: '#facc15' }}>₹1,999 / ₹2,500 Refundable Tokens</div>
        </div>

        <div style={{ background: '#070f20', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Authorized Signatory</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', marginTop: '3px' }}>
            Vikas Singh
          </div>
          <div style={{ fontSize: '10.5px', color: '#a78bfa' }}>Managing Principal</div>
        </div>
      </div>

      {/* Domestic Deals Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {deals.map(deal => (
          <div
            key={deal.id}
            style={{
              background: '#040916',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{deal.company}</strong>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                    {deal.contact} • <span style={{ color: '#38bdf8' }}>{deal.city}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  {deal.winProbability} WIN RATE
                </span>
              </div>

              {/* Scope & SLA */}
              <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginBottom: '10px', lineHeight: '1.4' }}>
                {deal.scope}
              </div>

              {/* Pricing Breakdown */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Total Contract</div>
                  <strong style={{ fontSize: '14px', color: '#f1f5f9' }}>₹{deal.totalValueINR.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>50% Advance</div>
                  <strong style={{ fontSize: '15px', color: '#10b981' }}>₹{deal.advance50INR.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#facc15' }}>Pilot Token</div>
                  <strong style={{ fontSize: '13px', color: '#facc15' }}>₹{deal.pilotTokenINR.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <a
                  href={deal.whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    background: '#25D366',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '11.5px',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📲</span> WhatsApp Pitch
                </a>

                <a
                  href={deal.settlementRail.upiAdvanceUri}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '11.5px',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📱</span> UPI Pay Link
                </a>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDealForQR(deal)}
                  style={{
                    flex: 1,
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '11px',
                    padding: '6px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📷 Scan UPI QR
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(deal.voiceScriptHindi, `voice-${deal.id}`)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '6px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedKey === `voice-${deal.id}` ? '✓ Copied Script!' : '🎙️ 60s Voice Script'}
                </button>

                <a
                  href={deal.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#94a3b8',
                    fontSize: '11px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  🔗 Portal
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedDealForQR && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal" style={{ maxWidth: '420px', width: '90%', background: '#060a14', border: '2px solid #10b981', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>INSTANT NPCI UPI SETTLEMENT</div>
              <button onClick={() => setSelectedDealForQR(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>
              {selectedDealForQR.company}
            </h3>
            <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '14px' }}>
              50% Advance Settlement: <strong style={{ color: '#10b981' }}>₹{selectedDealForQR.advance50INR.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', display: 'inline-block', marginBottom: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
              <img src={selectedDealForQR.settlementRail.qrAdvanceUrl} alt="UPI QR" style={{ width: '180px', height: '180px', display: 'block' }} />
            </div>

            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '14px', lineHeight: '1.4' }}>
              UPI ID: <strong style={{ color: '#10b981' }}>9690973030@ibl</strong><br />
              Account Holder: <strong style={{ color: '#fff' }}>Vikas Singh</strong><br />
              <span style={{ fontSize: '10.5px', color: '#fbbf24' }}>Section 22 CGST Net-Zero Tax Exemption</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={selectedDealForQR.settlementRail.upiAdvanceUri}
                className="btn btn-primary w-full"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#000', fontWeight: 'bold', fontSize: '12px', justifyContent: 'center' }}
              >
                📱 Open GPay / PhonePe / Paytm
              </a>
              <button
                type="button"
                onClick={() => setSelectedDealForQR(null)}
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
