import React, { useState, useEffect } from 'react';

export default function AutonomousBestDealsHunterWidget({ onDealActivated }) {
  const [hunterData, setHunterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scouting, setScouting] = useState(false);
  const [filterCurrency, setFilterCurrency] = useState('ALL'); // 'ALL' | 'INR' | 'USD'
  const [copiedSlug, setCopiedSlug] = useState(null);

  const fetchHunterMetrics = () => {
    fetch('/api/aged-deals/hunter/metrics')
      .then(r => r.json())
      .then(d => {
        if (d.success) setHunterData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHunterMetrics();
    const interval = setInterval(fetchHunterMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleScoutNow = () => {
    setScouting(true);
    fetch('/api/aged-deals/hunter/scout-now', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchSize: 4 })
    })
      .then(r => r.json())
      .then(() => {
        setScouting(false);
        fetchHunterMetrics();
      })
      .catch(() => setScouting(false));
  };

  const handleCopy = (text, slug) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading && !hunterData) {
    return (
      <div style={{
        background: '#070d1e',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#94a3b8',
        marginBottom: '26px'
      }}>
        Initializing Autonomous Best Deals Radar...
      </div>
    );
  }

  const allDiscoveries = hunterData?.recentDiscoveries || [];
  const filteredDeals = filterCurrency === 'ALL'
    ? allDiscoveries
    : allDiscoveries.filter(d => d.currency === filterCurrency);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #090e1f 0%, #030712 100%)',
      border: '2px solid rgba(56, 189, 248, 0.45)',
      borderRadius: '18px',
      padding: '22px 24px',
      marginBottom: '28px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: '#000',
            fontWeight: '900'
          }}>
            💎
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                CONTINUOUS BEST DEALS RADAR
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Managing Principal: <strong style={{ color: '#fff' }}>Vikas Singh</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '19px', fontWeight: 'bold', color: '#fff', margin: '3px 0 0 0' }}>
              Autonomous High-Yield Deal Hunter & Instant Closer
            </h2>
          </div>
        </div>

        {/* Currency Switcher & Scout Now Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              type="button"
              onClick={() => setFilterCurrency('ALL')}
              style={{
                background: filterCurrency === 'ALL' ? '#38bdf8' : 'transparent',
                color: filterCurrency === 'ALL' ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              All Hubs
            </button>
            <button
              type="button"
              onClick={() => setFilterCurrency('INR')}
              style={{
                background: filterCurrency === 'INR' ? '#10b981' : 'transparent',
                color: filterCurrency === 'INR' ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🇮🇳 Indian UPI (₹)
            </button>
            <button
              type="button"
              onClick={() => setFilterCurrency('USD')}
              style={{
                background: filterCurrency === 'USD' ? '#38bdf8' : 'transparent',
                color: filterCurrency === 'USD' ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🌐 Global Escrow ($)
            </button>
          </div>

          <button
            type="button"
            onClick={handleScoutNow}
            disabled={scouting}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: '900',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 12px rgba(16, 185, 129, 0.35)'
            }}
          >
            {scouting ? '🔍 Scouting Metros...' : '⚡ Scout Fresh Deals Now'}
          </button>
        </div>
      </div>

      {/* Real-Time Scouting Metric Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>High-Yield Pipeline Discovered</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
            {hunterData?.totalPipelineFormatted}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {hunterData?.totalDiscovered} qualified enterprise targets
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#34d399', textTransform: 'uppercase', fontWeight: 'bold' }}>50% Milestone Advance Pool</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>
            {hunterData?.totalAdvanceFormatted}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Settlement: 9690973030@ibl (Vikas Singh)
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Active High-Net-Worth Hubs</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginTop: '6px', lineHeight: '1.4' }}>
            Mumbai • Delhi-NCR • Bangalore • Dubai • London
          </div>
        </div>
      </div>

      {/* Fresh High-Yield Deals Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.6fr auto',
              gap: '20px',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Client Identity & Location */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  fontSize: '10.5px',
                  fontWeight: '900',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  {deal.category}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  fontSize: '10.5px',
                  fontWeight: 'bold',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  🔥 {deal.winProbability}% Win Prob
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '6px 0 2px 0' }}>
                {deal.company}
              </h3>
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                {deal.contact} • <span style={{ color: '#94a3b8' }}>{deal.location}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px', fontWeight: 'bold' }}>
                Total: {deal.totalFormatted} • <span style={{ color: '#34d399' }}>50% Advance: {deal.advanceFormatted}</span> (Pilot: {deal.pilotFormatted})
              </div>
            </div>

            {/* Middle Column: Scope & Staging Links */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                Pre-Configured Staging Architecture:
              </div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.4', marginBottom: '8px' }}>
                {deal.scope}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={deal.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#38bdf8',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    textDecoration: 'none'
                  }}
                >
                  🔗 Live Staging Portal
                </a>
                <a
                  href={deal.invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    textDecoration: 'none'
                  }}
                >
                  📄 Pro-Forma Invoice
                </a>
                <a
                  href={deal.payUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    textDecoration: 'none'
                  }}
                >
                  ⚡ Express Pay
                </a>
              </div>
            </div>

            {/* Right Column: 1-Click Action Dispatch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
              <a
                href={deal.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#000',
                  fontWeight: '900',
                  fontSize: '12px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 12px rgba(34, 197, 94, 0.3)'
                }}
              >
                💬 1-Click WhatsApp Dispatch
              </a>

              <button
                type="button"
                onClick={() => handleCopy(deal.pitchMessage, deal.slug)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  cursor: 'pointer'
                }}
              >
                {copiedSlug === deal.slug ? '✓ Pitch Copied!' : '📋 Copy Pitch Text'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
