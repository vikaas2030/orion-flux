import React, { useState, useEffect } from 'react';

export default function AutoSendProposalsConsole() {
  const [statusData, setStatusData] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMsg, setDispatchMsg] = useState('');

  const fetchStatus = () => {
    fetch('/api/autonomous/status')
      .then(res => res.json())
      .then(data => {
        setStatusData(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerAutoSend = () => {
    setIsDispatching(true);
    setDispatchMsg('');

    fetch('/api/autonomous/trigger-auto-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setIsDispatching(false);
        setStatusData(data);
        setDispatchMsg('🚀 AUTONOMOUS DISPATCH EXECUTED: New client proposal + UPI invoice auto-sent!');
        setTimeout(() => setDispatchMsg(''), 5000);
      })
      .catch(() => setIsDispatching(false));
  };

  if (!statusData) return null;

  return (
    <div className="glass-card mb-24 animate-in" style={{ padding: '24px', borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.04)' }}>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '30px',
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #10b981'
          }}>
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                ALL 14 SPECIALIZED AGENTS IN AUTONOMOUS MODE — AUTO-SEND PROPOSALS ACTIVE
              </h3>
              <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                100% SELF-DRIVING
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Atlas AI scrapes, Solene renders videos, Orion audits SEO, ShopVanguard optimizes stores, Apex drafts proposals, and Ledger attaches UPI QR invoices — all proposals are auto-sent without manual intervention.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            className="btn btn-primary btn-sm"
            disabled={isDispatching}
            onClick={handleTriggerAutoSend}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            {isDispatching ? '⚡ Auto-Dispatching Proposal...' : '🚀 Force Auto-Send Proposal Pulse'}
          </button>
        </div>
      </div>

      {dispatchMsg && (
        <div className="glass-card mb-16 p-12" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>
          {dispatchMsg}
        </div>
      )}

      {/* Metrics Strip */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: '#07070f', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center flex-wrap gap-16">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Auto-Sent Proposals</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              📨 {statusData.metrics.autoProposalsDispatched} Dispatched
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Auto-Dispatched Pipeline</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399' }}>
              {statusData.metrics.totalPipelinePotential}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>50% Advance Targeted</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>
              💰 {statusData.metrics.advanceRevenueTargeted}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Agent Operating Status</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>
              🟢 14/14 Autonomous
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Dispatched Proposals Feed */}
      <div>
        <h4 style={{ fontSize: '14.5px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '12px' }}>
          📋 Live Autonomous Auto-Sent Proposals Stream ({statusData.autoSentProposals.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statusData.autoSentProposals.map(prop => (
            <div
              key={prop.id}
              className="glass-card"
              style={{
                padding: '16px 20px',
                background: '#090912',
                border: '1px solid var(--border-color)',
                borderLeft: '3px solid #10b981'
              }}
            >
              <div className="flex justify-between items-center mb-8 flex-wrap gap-8">
                <div>
                  <div className="flex items-center gap-8">
                    <strong style={{ fontSize: '15px', color: '#f1f5f9' }}>{prop.company}</strong>
                    <span className="badge badge-won" style={{ fontSize: '10px' }}>{prop.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    👤 {prop.contact} • Channel: <span style={{ color: '#38bdf8' }}>{prop.channel}</span> • Dispatched: {new Date(prop.sentAt).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>
                    {prop.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#fbbf24' }}>50% Advance: {prop.advanceExpected}</div>
                </div>
              </div>

              <div style={{ background: '#05050a', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>📄 Scope:</span> {prop.proposalTitle}
              </div>

              <div className="flex justify-between items-center flex-wrap gap-8" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>📦 <strong>Attached Vault Sample:</strong> {prop.attachedDeliverable}</span>
                <span style={{ color: '#10b981' }}>💳 <strong>Invoice:</strong> {prop.invoiceAttached}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
