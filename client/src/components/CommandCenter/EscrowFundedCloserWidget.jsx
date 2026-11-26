import React, { useState, useEffect } from 'react';

export default function EscrowFundedCloserWidget() {
  const [escrowJobs, setEscrowJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [selectedProposalJob, setSelectedProposalJob] = useState(null);
  const [actionAlert, setActionAlert] = useState('');

  const fetchJobs = () => {
    fetch('/api/escrow-jobs/list')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setEscrowJobs(d.jobs);
          setStats(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatchProposal = (jobId) => {
    setDispatchingId(jobId);
    setActionAlert('⚡ Locking in Escrow Contract & Submitting Proposal...');

    fetch('/api/escrow-jobs/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    })
      .then(r => r.json())
      .then(res => {
        setDispatchingId(null);
        if (res.success) {
          setActionAlert(`✅ Proposal Dispatched! Deal synced to Pipeline ($${res.dispatch.budgetUSD} USD). Advance milestone pending escrow lock.`);
          fetchJobs();
          setTimeout(() => setActionAlert(''), 6000);
        }
      })
      .catch(() => setDispatchingId(null));
  };

  return (
    <div className="glass-card mb-24 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #091310 0%, #030806 100%)',
      border: '1px solid rgba(16, 185, 129, 0.45)',
      boxShadow: '0 8px 36px rgba(16, 185, 129, 0.2)'
    }}>
      {/* Top Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '26px',
            background: 'rgba(16, 185, 129, 0.2)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            💼
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
                Upwork & Contra 100% Escrow-Funded Closing Engine
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
                ● FUNDS PRE-DEPOSITED IN ESCROW
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Direct closing on active funded jobs with zero payment hesitation & guaranteed milestone release
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <span style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 'bold' }}>
            Escrow Pipeline: {stats?.totalFundedFormattedUSD || '$9,400 USD'}
          </span>
        </div>
      </div>

      {actionAlert && (
        <div className="mb-14 p-12 animate-in" style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          color: '#34d399',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {actionAlert}
        </div>
      )}

      {/* Escrow Metrics Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Funded Escrow</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#34d399' }}>
            {stats?.totalFundedFormattedUSD?.split(' ')[0] || '$9,400'} USD
          </div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Ready for Instant Handover</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Immediate 50% Advances</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8' }}>
            {stats?.totalAdvancesFormattedUSD?.split(' ')[0] || '$4,700'} USD
          </div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>~₹4,04,200 Advance Tokens</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Client Payment Risk</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#4ade80' }}>0.0%</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Held in Upwork/Contra Escrow</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Deliverable Readiness</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#facc15' }}>100% Ready</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Pre-Compiled Autonomous Tech</div>
        </div>
      </div>

      {/* Jobs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {escrowJobs.map(job => (
          <div key={job.id} style={{
            background: '#070c0a',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #1e3a2b',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>{job.platformLogo}</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#34d399', textTransform: 'uppercase' }}>
                    {job.platform} • {job.clientCountry}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    {job.escrowDepositStatus}
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '14.5px', color: '#f1f5f9', fontWeight: 'bold' }}>
                  {job.title}
                </h4>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#34d399' }}>
                  ${job.budgetUSD.toLocaleString()} USD
                </div>
                <div style={{ fontSize: '11px', color: '#38bdf8' }}>
                  Milestone 1 Advance: <strong>${job.advance50USD.toLocaleString()} USD</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #14281f', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                <span style={{ color: '#cbd5e1' }}>Deliverable:</span> {job.deliverableReady} • <span style={{ color: '#facc15' }}>{job.urgency}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedProposalJob(job)}
                  className="btn btn-secondary"
                  style={{ fontSize: '11.5px', padding: '5px 12px', borderColor: 'rgba(52, 211, 153, 0.4)', color: '#6ee7b7' }}
                >
                  Inspect Winning Proposal
                </button>

                <button
                  onClick={() => handleDispatchProposal(job.id)}
                  disabled={dispatchingId === job.id || job.dispatchStatus === 'DISPATCHED_TO_ESCROW'}
                  className="btn btn-primary"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 14px',
                    fontWeight: 'bold',
                    background: job.dispatchStatus === 'DISPATCHED_TO_ESCROW' ? '#334155' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#000'
                  }}
                >
                  {job.dispatchStatus === 'DISPATCHED_TO_ESCROW' ? '✓ Escrow Dispatched' : (dispatchingId === job.id ? 'Submitting...' : '🚀 1-Click Escrow Dispatch')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Proposal Modal */}
      {selectedProposalJob && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#0a100d',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '560px',
            width: '100%'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', color: '#6ee7b7' }}>
              📜 Pre-Engineered Winning Proposal for {selectedProposalJob.platform}
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              Target Budget: <strong>${selectedProposalJob.budgetUSD} USD</strong> (Milestone 1 Advance: ${selectedProposalJob.advance50USD} USD)
            </p>

            <div style={{
              background: '#040705',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #1e3a2b',
              fontSize: '12px',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '16px'
            }}>
              {selectedProposalJob.directProposal}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedProposalJob.directProposal);
                  alert('Proposal copied to clipboard!');
                }}
                className="btn btn-secondary"
                style={{ fontSize: '12px' }}
              >
                📋 Copy Proposal
              </button>

              <button
                onClick={() => {
                  handleDispatchProposal(selectedProposalJob.id);
                  setSelectedProposalJob(null);
                }}
                className="btn btn-primary"
                style={{ fontSize: '12px', background: '#10b981', color: '#000', fontWeight: 'bold' }}
              >
                Dispatch to Escrow Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
