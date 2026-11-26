import React, { useState, useEffect } from 'react';

export default function RevenueHungerEngine({ onPitchSent }) {
  const [hunterState, setHunterState] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [customTarget, setCustomTarget] = useState('150000');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchHunterStatus = () => {
    fetch('/api/autonomous/status')
      .then(res => res.json())
      .then(data => {
        if (data.hungerMode) {
          setHunterState(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchHunterStatus();
    const interval = setInterval(fetchHunterStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTarget = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    fetch('/api/autonomous/set-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: customTarget })
    })
      .then(res => res.json())
      .then(data => {
        setIsUpdating(false);
        setHunterState(data);
        setShowTargetModal(false);
      })
      .catch(() => setIsUpdating(false));
  };

  const handleDispatchOpportunity = (id) => {
    fetch('/api/autonomous/dispatch-opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        setHunterState(data);
        if (onPitchSent) onPitchSent();
      })
      .catch(() => {});
  };

  if (!hunterState) return null;

  return (
    <div className="glass-card mb-24 animate-in" style={{
      padding: '24px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.06) 100%)',
      borderLeft: '5px solid #f59e0b',
      boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)'
    }}>
      {/* Top Header & Hunger Status */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '32px',
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #f59e0b'
          }}>
            🔥
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                SOLENE REVENUE HUNTER — HUNGER MODE: ACTIVE
              </h3>
              <span className="badge badge-won" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                100% AGGRESSIVE
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Relentless AI Business Partner actively hunting deals to hit your financial targets. Zero excuses, 100% revenue drive.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTargetModal(true)}
            style={{ borderColor: '#f59e0b', color: '#fbbf24' }}
          >
            🎯 Set Monthly Goal
          </button>
        </div>
      </div>

      {/* Target & Financial Quota Bar */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: '#07070c', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center flex-wrap gap-16 mb-12">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Monthly Revenue Goal
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f1f5f9' }}>
              ₹{hunterState.monthlyTarget.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Current Pipeline Potential
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#34d399' }}>
              {hunterState.metrics.totalPipelinePotential}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Daily Quota to Crush
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fbbf24' }}>
              ₹{hunterState.dailyQuota.toLocaleString()} / Day
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#ec4899', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Target Revenue Gap
            </div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#f87171' }}>
              ₹{hunterState.revenueGap.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.max(5, hunterState.progressPercent)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
            borderRadius: '4px',
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      {/* Solene's Relentless Executive Directives (Bhookh / Motivation) */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
          📢 Solene's Executive Revenue Directive:
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', lineHeight: '1.5' }}>
          "{hunterState.directives[0]?.headline}"
        </p>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {hunterState.directives[0]?.body}
        </p>
      </div>

      {/* Live Opportunity Radar: 4 High-Ticket Deals Ready to Pitch */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-12">
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            📡 Opportunity Radar: {hunterState.opportunities.length} High-Value Deals Waiting for Your WhatsApp Pitch
          </h4>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>
            ⚡ 1-Tap Direct Dispatch Ready
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {hunterState.opportunities.map(opp => (
            <div
              key={opp.id}
              className="glass-card flex flex-col justify-between"
              style={{
                padding: '18px',
                background: '#090910',
                border: opp.status === 'pitched' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                borderTop: '3px solid #f59e0b'
              }}
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="badge badge-proposal" style={{ fontSize: '10px' }}>
                    {opp.niche}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>
                    💰 {opp.feeFormatted}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '2px' }}>
                  {opp.company}
                </h4>
                <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                  👤 {opp.contact} • {opp.city}
                </div>

                <div style={{ background: '#040408', padding: '10px', borderRadius: '6px', fontSize: '11.5px', color: '#fbbf24', marginBottom: '12px' }}>
                  ⚠️ <strong>Why They Will Pay:</strong> {opp.reasonToBuy}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-8 pt-10" style={{ borderTop: '1px solid var(--border-color)' }}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${opp.phone}&text=${encodeURIComponent(opp.pitchMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm flex-1"
                  style={{ background: '#25D366', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}
                  onClick={() => handleDispatchOpportunity(opp.id)}
                >
                  <span>💬</span> Pitch on WhatsApp
                </a>

                <a
                  href={`mailto:${opp.email}?subject=${encodeURIComponent(`Quick question regarding ${opp.company}`)}&body=${encodeURIComponent(opp.pitchMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '12px' }}
                  onClick={() => handleDispatchOpportunity(opp.id)}
                >
                  📧 Gmail
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Setting Modal */}
      {showTargetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="glass-card animate-in" style={{
            maxWidth: '460px',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid #f59e0b',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div className="flex justify-between items-center mb-16 pb-12" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>🎯 Set Monthly Revenue Target</h3>
              <button className="header-btn" onClick={() => setShowTargetModal(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateTarget}>
              <div className="form-group mb-16">
                <label className="form-label">Monthly Target Amount (₹ INR)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  step="10000"
                  value={customTarget}
                  onChange={e => setCustomTarget(e.target.value)}
                />
              </div>

              <div className="flex gap-8 mb-20 flex-wrap">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCustomTarget('100000')}>₹1,00,000</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCustomTarget('150000')}>₹1,50,000</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCustomTarget('300000')}>₹3,00,000</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCustomTarget('500000')}>₹5,00,000</button>
              </div>

              <div className="flex justify-end gap-10">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTargetModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                  {isUpdating ? 'Saving...' : '🔥 Lock Target & Unleash Hunger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
