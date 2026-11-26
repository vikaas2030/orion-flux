import React, { useState, useEffect } from 'react';

export default function SopDirectives() {
  const [sops, setSops] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProtocol, setNewProtocol] = useState('');
  const [targetAgent, setTargetAgent] = useState('solene_super');
  const [strictness, setStrictness] = useState('Mandatory / Non-Negotiable');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchSops = () => {
    fetch('/api/agency/sops')
      .then(res => res.json())
      .then(data => {
        if (data.sops) setSops(data.sops);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSops();
  }, []);

  const handleIssueSop = (e) => {
    e.preventDefault();
    if (!newTitle || !newProtocol) return;

    fetch('/api/agency/issue-sop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: targetAgent,
        title: newTitle,
        protocol: newProtocol,
        strictness
      })
    })
      .then(res => res.json())
      .then(() => {
        setShowNewModal(false);
        setNewTitle('');
        setNewProtocol('');
        setStatusMessage('✅ Executive Directive successfully broadcasted to agents!');
        fetchSops();
        setTimeout(() => setStatusMessage(''), 4000);
      })
      .catch(() => {});
  };

  return (
    <div className="glass-card mb-24 animate-in" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-8">
            <span>⚖️</span> Executive Directives & Professional SOPs
            <span className="badge badge-won">100% QUALITY GOVERNANCE</span>
          </h3>
          <p className="text-sm text-tertiary mt-4">
            Standard Operating Procedures issued by Solene Super Agent. Every agent is legally and technically bound to these rules to guarantee error-free, executive-grade execution.
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          onClick={() => setShowNewModal(true)}
        >
          📢 Issue Executive Directive
        </button>
      </div>

      {statusMessage && (
        <div className="p-12 mb-16 rounded" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '13px' }}>
          {statusMessage}
        </div>
      )}

      {/* Directives Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {sops.map((sop) => (
          <div
            key={sop.id}
            className="glass-card"
            style={{
              padding: '20px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-color)',
              borderTop: '3px solid #f59e0b'
            }}
          >
            <div className="flex justify-between items-center mb-10">
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                DIRECTIVE • {sop.agentName}
              </span>
              <span className="badge badge-won" style={{ fontSize: '10px' }}>
                {sop.status}
              </span>
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {sop.title}
            </h4>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
              "{sop.protocol}"
            </p>

            <div className="flex justify-between items-center pt-10" style={{ borderTop: '1px solid var(--border-color)', fontSize: '11px' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Governance Level:</span>
              <strong style={{ color: '#fbbf24' }}>{sop.strictness}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Issue Directive */}
      {showNewModal && (
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
            maxWidth: '560px',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid #f59e0b',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            padding: '28px',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div className="flex justify-between items-center mb-16 pb-12" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold' }}>📢 Issue Professional SOP Directive</h3>
              <button className="header-btn" onClick={() => setShowNewModal(false)}>✕</button>
            </div>

            <form onSubmit={handleIssueSop}>
              <div className="form-group mb-14">
                <label className="form-label">Assign To Agent *</label>
                <select className="form-select" value={targetAgent} onChange={e => setTargetAgent(e.target.value)}>
                  <option value="solene_super">⚡ All Specialized Agents (Global SOP)</option>
                  <option value="solene_video">🎬 Solene CineFlow AI (Video Production)</option>
                  <option value="atlas_lead">🔍 Atlas AI (Lead Generation & Scraper)</option>
                  <option value="apex_sales">📝 Apex AI (Proposals & Deals)</option>
                  <option value="ledger_finance">💰 Ledger AI (Finance & Invoicing)</option>
                  <option value="nova_content">✍️ Nova AI (Content & Marketing)</option>
                  <option value="cyber_dev">💻 Cyber AI (Full-Stack Dev)</option>
                </select>
              </div>

              <div className="form-group mb-14">
                <label className="form-label">Directive Title *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Strict 4-Stage Verification Before Client Handover"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-group mb-14">
                <label className="form-label">Enforcement Strictness</label>
                <select className="form-select" value={strictness} onChange={e => setStrictness(e.target.value)}>
                  <option value="Mandatory / Non-Negotiable">Mandatory / Non-Negotiable</option>
                  <option value="Executive Standard">Executive Standard</option>
                  <option value="Strict Compliance">Strict Compliance</option>
                </select>
              </div>

              <div className="form-group mb-20">
                <label className="form-label">Standard Operating Protocol Text *</label>
                <textarea
                  className="form-textarea"
                  style={{ height: '110px' }}
                  required
                  placeholder="Describe the exact rules, quality standards, and execution guidelines the agent must obey..."
                  value={newProtocol}
                  onChange={e => setNewProtocol(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-10">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                  ⚡ Enforce Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
