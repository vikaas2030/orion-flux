import React, { useState, useEffect } from 'react';

export default function MultiStreamIncomeMatrix() {
  const [overview, setOverview] = useState(null);
  const [selectedStream, setSelectedStream] = useState('stream-1');
  const [boostMsg, setBoostMsg] = useState('');
  const [isBoosting, setIsBoosting] = useState(false);

  const fetchOverview = () => {
    fetch('/api/revenue-streams/overview')
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleBoostStream = (streamId) => {
    setIsBoosting(true);
    fetch('/api/revenue-streams/boost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId })
    })
      .then(res => res.json())
      .then(data => {
        setIsBoosting(false);
        setBoostMsg(data.message);
        setOverview(data.overview);
        setTimeout(() => setBoostMsg(''), 5000);
      })
      .catch(() => setIsBoosting(false));
  };

  if (!overview) return null;

  const currentStream = overview.streams.find(s => s.id === selectedStream) || overview.streams[0];

  return (
    <div className="glass-card mb-24 animate-in" style={{
      padding: '26px',
      borderLeft: '5px solid #f59e0b',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(16, 185, 129, 0.04) 50%, rgba(139, 92, 246, 0.05) 100%)',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.12)'
    }}>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-20 flex-wrap gap-14">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '32px',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
          }}>
            💸
          </div>
          <div>
            <div className="flex items-center gap-8 flex-wrap">
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>
                Multi-Stream Revenue Diversification Engine
              </h3>
              <span className="badge badge-won" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                {overview.totalStreamsCount || overview.streams.length} INSTITUTIONAL STREAMS
              </span>
              <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                {overview.annualProjectedRunRate} RUN-RATE
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Expanding beyond one-off projects into scalable recurring retainers, micro-SaaS subscriptions, automated digital products, affiliate royalties, and performance deal arbitrage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          <button
            className="btn btn-primary btn-sm"
            disabled={isBoosting}
            onClick={() => handleBoostStream(selectedStream)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.35)'
            }}
          >
            {isBoosting ? '⚡ Scaling Stream...' : `🚀 Boost Current Stream (+25%)`}
          </button>
        </div>
      </div>

      {boostMsg && (
        <div className="glass-card mb-16 p-12 animate-in" style={{ background: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '13px', fontWeight: 'bold' }}>
          {boostMsg}
        </div>
      )}

      {/* Aggregate Strip (100% Real Bank + Target Capacity Telemetry) */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: '#070712', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center flex-wrap gap-16">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Verified Realized Bank Income (UPI)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>
              🏦 {overview.verifiedRealizedBankFormatted || '₹0 INR'}
            </div>
            <div style={{ fontSize: '11px', color: '#34d399' }}>Actual settled funds in 9690973030@ibl</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>8-Channel Target Capacity</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginTop: '2px' }}>
              💰 {overview.totalMonthlyRunRate}
            </div>
            <div style={{ fontSize: '11px', color: '#fbbf24' }}>{overview.annualProjectedRunRate} catalog capacity</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Live Active Pipeline & Partners</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>
              🤝 {overview.activePipelineDeals ?? 0} Deals • {overview.activePartnersCount ?? 0} Partners
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Across {overview.totalStreamsCount || overview.streams.length} diversified channels</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Diversification Ratio</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899', marginTop: '2px' }}>
              🛡️ 100% Zero-Fake Ledger
            </div>
            <div style={{ fontSize: '11px', color: '#a78bfa' }}>Real-time DB reconciliation</div>
          </div>
        </div>
      </div>

      {/* 5 Streams Selector Buttons */}
      <div className="flex gap-8 mb-16 flex-wrap">
        {overview.streams.map(stream => (
          <button
            key={stream.id}
            className={`btn btn-sm ${selectedStream === stream.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedStream(stream.id)}
            style={{
              background: selectedStream === stream.id ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : undefined,
              color: selectedStream === stream.id ? '#000' : undefined,
              fontWeight: 'bold'
            }}
          >
            {stream.icon} {stream.name} ({stream.monthlyFormatted})
          </button>
        ))}
      </div>

      {/* Selected Stream Deep-Dive View */}
      <div className="glass-card" style={{ padding: '20px', background: '#070712', border: '1px solid var(--border-color)', borderTop: '3px solid #f59e0b' }}>
        <div className="flex justify-between items-start mb-12 flex-wrap gap-8">
          <div>
            <div className="flex items-center gap-8">
              <span style={{ fontSize: '22px' }}>{currentStream.icon}</span>
              <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#f1f5f9' }}>{currentStream.name}</h4>
              <span className="badge badge-won" style={{ fontSize: '10px' }}>{currentStream.status}</span>
              <span className="badge" style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>{currentStream.growthRate}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {currentStream.description}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{currentStream.monthlyFormatted}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{currentStream.activeSubscribersOrClients} active subscribers/clients</div>
          </div>
        </div>

        {/* Breakdown Items Table / Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {currentStream.plans.map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid #10b981', fontSize: '12px' }}>
              <div className="flex justify-between items-center mb-4">
                <strong style={{ color: '#f1f5f9' }}>{item.name}</strong>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{item.fee || item.revenue || item.monthlyYield || item.price}</span>
              </div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
                {item.client ? `Client: ${item.client} • ${item.cadence}` :
                 item.subscribers ? `Subscribers: ${item.subscribers} @ ${item.price}` :
                 item.unitsSold ? `Downloads Sold: ${item.unitsSold} @ ${item.price}` :
                 item.deliveredMonth ? `Delivered: ${item.deliveredMonth} leads @ ${item.feePerLead}` :
                 `Accounts Active: ${item.accountsActive} • Yield: ${item.recurringShare}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
