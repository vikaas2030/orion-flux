import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnalyzingId, setIsAnalyzingId] = useState(null);
  const [isDeliveringId, setIsDeliveringId] = useState(null);
  const [noticeMsg, setNoticeMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          if (selectedProject) {
            const updated = data.projects.find(p => p.id === selectedProject.id);
            if (updated) setSelectedProject(updated);
          } else if (data.projects.length > 0) {
            setSelectedProject(data.projects[0]);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  }, []);

  // Run 4-Layer Testing Protocol
  const handleRun4LayerQA = (projectId) => {
    setIsAnalyzingId(projectId);
    setNoticeMsg(`🔬 Initiating 4-Layer QA Protocol (Code, UI, Scope, Security)...`);

    fetch(`/api/projects/${projectId}/run-4layer-qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setIsAnalyzingId(null);
        if (data.success) {
          setNoticeMsg(`🏆 4-Layer QA Certified! Certificate ID: ${data.certificateId}. Zero defects found.`);
          fetchProjects();
          setTimeout(() => setNoticeMsg(''), 6000);
        }
      })
      .catch(() => setIsAnalyzingId(null));
  };

  // Deliver Project to Client
  const handleDeliverToClient = (projectId) => {
    setIsDeliveringId(projectId);
    setNoticeMsg(`🚀 Verifying QA Certificate & generating VIP Client Portal delivery...`);

    fetch(`/api/projects/${projectId}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setIsDeliveringId(null);
        if (data.success) {
          setNoticeMsg(`🎉 Project Delivered! Work handed off to client with 4-Layer QA Certificate.`);
          fetchProjects();
          setTimeout(() => setNoticeMsg(''), 8000);
        }
      })
      .catch(() => setIsDeliveringId(null));
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="projects-page animate-in">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-20 flex-wrap gap-12">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-8">
            <span>🔬</span> Client Projects & 4-Layer QA Delivery Engine
          </h2>
          <p className="text-sm text-tertiary">
            Zero-defect automated 4-layer inspection ensuring client deliverables match 100% of expectations before delivery
          </p>
        </div>
        <div className="flex gap-10 items-center flex-wrap">
          <Link to="/showcase" className="btn btn-secondary" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', fontWeight: 'bold' }}>
            <span>▶️</span> Run Live Projects Runner
          </Link>
          <Link to="/crm" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}>
            <span>🎯</span> Sales & CRM Pipeline
          </Link>
        </div>
      </div>

      {noticeMsg && (
        <div className="glass-card mb-20 p-14 animate-in" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', fontSize: '13.5px', fontWeight: 'bold' }}>
          {noticeMsg}
        </div>
      )}

      {/* 4-Layer Quality Assurance Standards Protocol Banner */}
      <div className="glass-card mb-24" style={{
        padding: '22px 26px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
        borderLeft: '5px solid #10b981'
      }}>
        <div className="flex items-start gap-16 flex-wrap">
          <div style={{ fontSize: '32px' }}>🛡️</div>
          <div className="flex-1">
            <div className="flex items-center gap-8 flex-wrap">
              <h4 style={{ fontWeight: 'bold', fontSize: '16px', color: '#f1f5f9' }}>
                Zero-Defect 4-Layer Quality Assurance Protocol
              </h4>
              <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                CLIENT SATISFACTION GUARANTEED
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
              No deliverable is handed off without passing all 4 verification layers: <strong>Layer 1 (Code Syntax & Architecture)</strong>, <strong>Layer 2 (Responsive Mobile & Cross-Browser UI)</strong>, <strong>Layer 3 (Client Scope & Custom SOW Compliance)</strong>, and <strong>Layer 4 (Security & Penetration Audit)</strong>.
            </p>

            <div className="grid grid-4 gap-10 mt-14">
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <strong style={{ fontSize: '11px', color: '#10b981', display: 'block' }}>LAYER 1: SYNTAX</strong>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>0 runtime errors & 100% logic check</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <strong style={{ fontSize: '11px', color: '#38bdf8', display: 'block' }}>LAYER 2: RESPONSIVE</strong>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>iOS, Android, Chrome 100% tested</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <strong style={{ fontSize: '11px', color: '#f59e0b', display: 'block' }}>LAYER 3: SCOPE MATCH</strong>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Rate card, branding & terms verified</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                <strong style={{ fontSize: '11px', color: '#a78bfa', display: 'block' }}>LAYER 4: SECURITY</strong>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Zero leak, rate limits & SSL active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="data-table-wrapper mb-24">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project & Client</th>
              <th>Category</th>
              <th>Value</th>
              <th>4-Layer QA Score</th>
              <th>QA Status</th>
              <th>Inspection</th>
              <th>Deliverable Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
                  No active client projects yet. Projects sync automatically from won deals and active client contracts.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Client: {p.client}</div>
                  </td>
                  <td>
                    <span className="badge badge-new" style={{ fontSize: '11px' }}>{p.category}</span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    {p.currency === 'USD' ? '$' : '₹'}{(p.value || 0).toLocaleString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-6">
                      <span className={`score-dot ${p.qaScore === 100 ? 'hot' : 'warm'}`}></span>
                      <strong style={{ color: p.qaScore === 100 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                        {p.qaScore}%
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      p.status === 'delivered' ? 'badge-won' :
                      p.status === 'verified' ? 'badge-qualified' :
                      p.status === 'analyzing' ? 'badge-proposal' : 'badge-new'
                    }`} style={{ fontSize: '10.5px' }}>
                      {p.status === 'delivered' ? '🚀 DELIVERED' :
                       p.status === 'verified' ? '✓ 4-LAYER CERTIFIED' :
                       p.status === 'analyzing' ? '🔬 IN QA AUDIT' : '🛠️ IN DEV'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedProject(p)}
                      style={{ fontSize: '11px' }}
                    >
                      🔬 Inspect 4 Layers
                    </button>
                  </td>
                  <td>
                    {p.status === 'delivered' ? (
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold', display: 'block' }}>
                          ✓ Delivered
                        </span>
                        <a
                          href={p.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '10.5px', color: '#38bdf8' }}
                        >
                          Open Portal ↗
                        </a>
                      </div>
                    ) : p.status === 'verified' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isDeliveringId === p.id}
                        onClick={() => handleDeliverToClient(p.id)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: '11px'
                        }}
                      >
                        {isDeliveringId === p.id ? 'Delivering...' : '🚀 Deliver to Client'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={isAnalyzingId === p.id}
                        onClick={() => handleRun4LayerQA(p.id)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '11px'
                        }}
                      >
                        {isAnalyzingId === p.id ? 'Auditing...' : '🔬 Run 4-Layer QA'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Project Detailed 4-Layer Inspection Panel */}
      {selectedProject && (
        <div className="glass-card p-24 animate-in" style={{ background: '#070712', border: '1px solid var(--border-color)', borderTop: '4px solid #10b981' }}>
          <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
            <div>
              <div className="flex items-center gap-8">
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                  {selectedProject.title}
                </h3>
                {selectedProject.qaCertificate && (
                  <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                    CERTIFICATE: {selectedProject.qaCertificate}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Client: <strong>{selectedProject.client}</strong> • Value: {selectedProject.currency === 'USD' ? '$' : '₹'}{(selectedProject.value || 0).toLocaleString()} • Deliverable: {selectedProject.category}
              </p>
            </div>

            <div className="flex gap-8">
              <button
                className="btn btn-secondary btn-sm"
                disabled={isAnalyzingId === selectedProject.id}
                onClick={() => handleRun4LayerQA(selectedProject.id)}
                style={{ background: '#1e1b4b', border: '1px solid #6366f1', color: '#a5b4fc', fontWeight: 'bold' }}
              >
                {isAnalyzingId === selectedProject.id ? 'Testing 4 Layers...' : '🔬 Force Re-Run 4-Layer Testing'}
              </button>

              {selectedProject.status !== 'delivered' && (
                <button
                  className="btn btn-primary btn-sm"
                  disabled={isDeliveringId === selectedProject.id}
                  onClick={() => handleDeliverToClient(selectedProject.id)}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#000', fontWeight: 'bold' }}
                >
                  {isDeliveringId === selectedProject.id ? 'Delivering...' : '🚀 Approve & Deliver to Client'}
                </button>
              )}
            </div>
          </div>

          {/* 4 Layers Inspection Breakdown */}
          <div className="grid grid-2 gap-16 mb-20">
            {selectedProject.layers && Object.keys(selectedProject.layers).map((key) => {
              const layer = selectedProject.layers[key];
              return (
                <div key={key} style={{
                  background: '#040409',
                  padding: '16px',
                  borderRadius: '8px',
                  border: layer.passed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
                }}>
                  <div className="flex justify-between items-center mb-6">
                    <strong style={{ fontSize: '13px', color: layer.passed ? '#34d399' : '#f87171' }}>
                      {layer.passed ? '✓' : '⚠️'} {layer.name}
                    </strong>
                    <span className="badge" style={{
                      background: layer.passed ? '#059669' : '#b91c1c',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      Score: {layer.score}%
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {layer.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* QA Certification Report Box */}
          <div style={{ background: '#030308', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div className="flex justify-between items-center mb-6">
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                📋 Cryptographic Quality Assurance Audit Summary
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Zero-Defect Delivery SLA Guarantee
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#f1f5f9', lineHeight: '1.5', margin: 0 }}>
              {selectedProject.qaReport}
            </p>
          </div>

          {/* Client Notification Ready Dispatch */}
          {selectedProject.clientNotificationMessage && (
            <div style={{ background: '#050510', padding: '16px', borderRadius: '8px', border: '1px solid #6366f1' }}>
              <div className="flex justify-between items-center mb-8">
                <span style={{ fontSize: '11.5px', color: '#a5b4fc', fontWeight: 'bold' }}>
                  📨 Client Delivery Notification & QA Certificate (Ready to Send via WhatsApp / Email)
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyText(selectedProject.clientNotificationMessage, 'notify-msg')}
                >
                  {copiedKey === 'notify-msg' ? '✅ Copied!' : '📋 Copy Notification'}
                </button>
              </div>
              <pre style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.5', whiteSpace: 'pre-wrap', margin: 0 }}>
                {selectedProject.clientNotificationMessage}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
