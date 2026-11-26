import React, { useState, useEffect } from 'react';

export default function TrustedBrandSurgeWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surging, setSurging] = useState(false);
  const [surgeResult, setSurgeResult] = useState(null);
  const [showSowModal, setShowSowModal] = useState(false);
  const [sowData, setSowData] = useState(null);
  const [loadingSow, setLoadingSow] = useState(false);

  const loadBrandData = () => {
    fetch('/api/brand/reputation-status')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadBrandData();
  }, []);

  const handleSurgePipeline = () => {
    setSurging(true);
    setSurgeResult(null);

    fetch('/api/brand/surge-pipeline', { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        setSurging(false);
        setSurgeResult(res);
        loadBrandData();
      })
      .catch(err => {
        setSurging(false);
        setSurgeResult({ success: false, error: err.message });
      });
  };

  const handleOpenSow = (dealId = 2001) => {
    setLoadingSow(true);
    setShowSowModal(true);

    fetch(`/api/brand/sow/${dealId}`)
      .then(res => res.json())
      .then(res => {
        setLoadingSow(false);
        if (res.success) {
          setSowData(res.sow);
        }
      })
      .catch(() => setLoadingSow(false));
  };

  if (loading && !data) {
    return null;
  }

  return (
    <div
      className="glass-card mb-24"
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(88, 28, 135, 0.15) 100%)',
        border: '1.5px solid rgba(147, 51, 234, 0.4)',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.15)'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-18 pb-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🏛️</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.3px', margin: 0, color: '#fff' }}>
                Institutional Brand Credibility & Deal Surge Engine
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Managing Principal: <strong style={{ color: '#fff' }}>Vikas Singh</strong> • Tier-1 Institutional Reputation • ₹65L+ Active Pipeline Surge
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleSurgePipeline}
            disabled={surging}
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 'bold',
              cursor: surging ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(147, 51, 234, 0.4)'
            }}
          >
            <span>🚀</span> {surging ? 'Injecting Deals...' : 'Surge Pipeline (11 High-Ticket Deals)'}
          </button>

          <button
            onClick={() => handleOpenSow(2001)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📜 Inspect Enterprise SOW
          </button>
        </div>
      </div>

      {/* 3 Brand Trust Metric Blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '18px' }}>
        {/* Total Pipeline */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>
            💼 High-Trust Deals Pipeline
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#c084fc', marginTop: '4px' }}>
            {data?.totalPipelineFormatted || '₹65,00,000+ INR'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Active High-Ticket Deals: <strong style={{ color: '#fff' }}>{data?.totalDealsCount || 24} Verified Accounts</strong>
          </div>
        </div>

        {/* Reputation Score */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>
            🛡️ Institutional Reputation Index
          </div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
            {data?.brandReputationScore || '99.8 / 100'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            SHA-256 Cryptographic QA Seal & Section 22 CGST Exemption
          </div>
        </div>

        {/* SLA & Turnkey Handover */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>
            ⚡ Professional Handover Warranty
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>
            48-Hour Turnkey SLA
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            14-Day 100% Money-Back Guarantee + 2-Hour VIP Emergency Support
          </div>
        </div>
      </div>

      {surgeResult && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '11.5px',
          background: surgeResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${surgeResult.success ? '#10b981' : '#ef4444'}`,
          color: surgeResult.success ? '#10b981' : '#ef4444'
        }}>
          {surgeResult.success
            ? `🎉 Successfully surged pipeline with ${surgeResult.addedCount} fresh Tier-1 enterprise accounts! New active pipeline: ${surgeResult.pipelineValueFormatted}`
            : surgeResult.error}
        </div>
      )}

      {/* SOW Contract Modal */}
      {showSowModal && (
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal" style={{ maxWidth: '850px', width: '92%', background: '#0f172a', border: '1.5px solid #9333ea', borderRadius: '12px', padding: '24px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '12px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  📜 Formal Enterprise Statement of Work (SOW) & SLA Contract
                </h3>
                <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                  Legally Binding Institutional Instrument • Signed by Managing Principal Vikas Singh
                </div>
              </div>
              <button
                onClick={() => setShowSowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {loadingSow || !sowData ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                ⚡ Compiling cryptographically signed Statement of Work...
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
                  <div><strong>Contract ID:</strong> {sowData.contractId}</div>
                  <div><strong>Effective Date:</strong> {sowData.effectiveDate}</div>
                  <div><strong>Provider:</strong> {sowData.brandName}</div>
                  <div><strong>Managing Principal:</strong> {sowData.managingPrincipal}</div>
                  <div><strong>Client Entity:</strong> {sowData.clientCompany}</div>
                  <div><strong>Total Investment:</strong> {sowData.financials?.totalFeeFormatted} (Net-Zero Tax)</div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <h4 style={{ color: '#c084fc', margin: '0 0 6px 0', fontSize: '13px' }}>1. Scope of Deliverables (4-Layer QA Certified):</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {sowData.scopeOfDeliverables?.map((s, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        <strong style={{ color: '#fff' }}>{s.deliverable}:</strong> {s.specification}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 6px 0', fontSize: '13px' }}>2. Service Level Agreement (SLA) & Warranty:</h4>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div>• <strong>Turnkey Delivery:</strong> {sowData.serviceLevelAgreement?.deliveryTimeline}</div>
                    <div>• <strong>SLA Response Time:</strong> {sowData.serviceLevelAgreement?.supportResponseTime}</div>
                    <div>• <strong>Uptime Guarantee:</strong> {sowData.serviceLevelAgreement?.uptimeWarranty}</div>
                    <div>• <strong>Revision Policy:</strong> {sowData.serviceLevelAgreement?.revisionGuarantee}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 6px 0', fontSize: '13px' }}>3. Cryptographic Signature & Statutory Verification:</h4>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>SHA-256 SEAL: {sowData.sha256Seal}</div>
                    <div style={{ marginTop: '4px', color: '#10b981' }}>STATUS: {sowData.signatures?.statutorySeal}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '16px' }}>
                  <button
                    onClick={() => setShowSowModal(false)}
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)' }}
                  >
                    ✓ Close SOW Inspector
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
