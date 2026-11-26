import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propensityFilter, setPropensityFilter] = useState('ALL');
  const [isRescoring, setIsRescoring] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pitchLead, setPitchLead] = useState(null);
  const [dealLead, setDealLead] = useState(null);
  const [dealForm, setDealForm] = useState({ title: '', value: 125000, stage: 'negotiation' });
  const [copiedPitch, setCopiedPitch] = useState(false);

  const [newLead, setNewLead] = useState({
    name: '', email: '', phone: '', company: '', website: '', source: 'manual', industry: '', budget: ''
  });

  const fetchLeads = () => {
    setLoading(true);
    let url = `/api/leads?search=${encodeURIComponent(search)}&limit=500`;
    if (statusFilter) url += `&status=${statusFilter}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.leads) setLeads(data.leads);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleRescoreAll = () => {
    setIsRescoring(true);
    fetch('/api/leads/rescore', { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setIsRescoring(false);
        fetchLeads();
      })
      .catch(() => setIsRescoring(false));
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter]);

  const handleAddLead = (e) => {
    e.preventDefault();
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setShowAddModal(false);
          setNewLead({ name: '', email: '', phone: '', company: '', website: '', source: 'manual', industry: '', budget: '' });
          fetchLeads();
        }
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      fetch(`/api/leads/${id}`, { method: 'DELETE' })
        .then(() => fetchLeads());
    }
  };

  const handleCreateDealFromLead = (e) => {
    e.preventDefault();
    if (!dealLead) return;

    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: dealForm.title || `${dealLead.company || dealLead.name} Automation Project`,
        value: parseFloat(dealForm.value) || 100000,
        stage: dealForm.stage || 'negotiation',
        probability: 80,
        lead_id: dealLead.id,
        lead_name: dealLead.name,
        lead_company: dealLead.company,
        email: dealLead.email,
        phone: dealLead.phone
      })
    })
      .then(res => res.json())
      .then(() => {
        setDealLead(null);
        alert(`✅ Deal created successfully! Redirecting to CRM Closer...`);
        navigate('/crm');
      });
  };

  const exportCSV = () => {
    if (leads.length === 0) return alert('No leads to export');
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Score', 'Industry'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name || ''}"`,
      `"${l.company || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.source || ''}"`,
      `"${l.status || ''}"`,
      l.score || 50,
      `"${l.industry || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orion_flux_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePitchText = (lead) => {
    if (!lead) return '';
    return `Namaste ${lead.name || 'Decision Maker'} ji,\n\nI noticed ${lead.company || 'your business'} is expanding rapidly in ${lead.industry || 'the market'}. Our autonomous AI agent team builds custom workflow automation & client acquisition engines that generate 40%+ higher conversions with 0% manual effort.\n\nWould you be open for a quick 5-minute live demo this Thursday?\n\nWarm regards,\nORION FLUX Executive Agency`;
  };

  return (
    <div className="leads-page animate-in">
      <div className="table-header-bar flex justify-between items-center mb-20 flex-wrap gap-12">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-8">
            <span>👥</span> Real World Leads Directory
          </h2>
          <p className="text-sm text-tertiary">Scraped and captured prospects ready for professional pitch and conversion</p>
        </div>
        <div className="flex gap-12">
          <button className="btn btn-secondary" onClick={exportCSV}>
            📥 Export CSV ({leads.length})
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <span>+</span> Add Lead Manually
          </button>
        </div>
      </div>

      {/* AI Propensity Lead Scoring Matrix Strip */}
      <div className="glass-card mb-20 p-16" style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="flex justify-between items-center mb-12 flex-wrap gap-12">
          <div className="flex items-center gap-10">
            <span style={{ fontSize: '20px' }}>🧠</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc' }}>
                AI Propensity Lead Scoring Matrix (0–100%)
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Cognitive firmographic evaluation based on City GDP, Enterprise Niche, Contact Complete Ratio & Deal Anchor
              </div>
            </div>
          </div>

          <button
            onClick={handleRescoreAll}
            disabled={isRescoring}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
          >
            {isRescoring ? '⚡ AI Scoring Matrix Running...' : '⚡ Re-Rank All Leads'}
          </button>
        </div>

        {/* Propensity Filter Tabs */}
        <div className="flex gap-10 flex-wrap">
          <button
            onClick={() => setPropensityFilter('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: propensityFilter === 'ALL' ? '1px solid #6366f1' : '1px solid #1e293b',
              background: propensityFilter === 'ALL' ? 'rgba(99, 102, 241, 0.2)' : '#0f172a',
              color: propensityFilter === 'ALL' ? '#818cf8' : '#94a3b8'
            }}
          >
            All Prospects ({leads.length})
          </button>

          <button
            onClick={() => setPropensityFilter('HOT')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: propensityFilter === 'HOT' ? '1px solid #ef4444' : '1px solid #1e293b',
              background: propensityFilter === 'HOT' ? 'rgba(239, 68, 68, 0.2)' : '#0f172a',
              color: propensityFilter === 'HOT' ? '#f87171' : '#94a3b8'
            }}
          >
            🔥 HOT Tier (85%+) ({leads.filter(l => l.propensityTier === 'HOT').length})
          </button>

          <button
            onClick={() => setPropensityFilter('WARM')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: propensityFilter === 'WARM' ? '1px solid #f59e0b' : '1px solid #1e293b',
              background: propensityFilter === 'WARM' ? 'rgba(245, 158, 11, 0.2)' : '#0f172a',
              color: propensityFilter === 'WARM' ? '#fbbf24' : '#94a3b8'
            }}
          >
            ⚡ WARM Tier (68-84%) ({leads.filter(l => l.propensityTier === 'WARM').length})
          </button>

          <button
            onClick={() => setPropensityFilter('COLD')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: propensityFilter === 'COLD' ? '1px solid #64748b' : '1px solid #1e293b',
              background: propensityFilter === 'COLD' ? 'rgba(100, 116, 139, 0.2)' : '#0f172a',
              color: propensityFilter === 'COLD' ? '#cbd5e1' : '#94a3b8'
            }}
          >
            ❄️ COLD Tier (&lt;68%) ({leads.filter(l => l.propensityTier === 'COLD').length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-16 mb-20 flex gap-16 items-center flex-wrap" style={{ padding: '16px 20px' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="form-input w-full"
            placeholder="🔍 Search by name, company, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="new">New Prospect</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified Lead</option>
          <option value="proposal_sent">Proposal Sent</option>
          <option value="negotiation">In Negotiation</option>
          <option value="won">Client (Won)</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead Name & Company</th>
              <th>Contact Info</th>
              <th>Source</th>
              <th>Industry / Location</th>
              <th>Status</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading leads...</td></tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <h3>No Leads Found</h3>
                    <p>Use the Lead Scraper to auto-find clients or add leads manually.</p>
                  </div>
                </td>
              </tr>
            ) : (leads.filter(l => propensityFilter === 'ALL' ? true : l.propensityTier === propensityFilter)).map(lead => (
              <tr key={lead.id}>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{lead.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{lead.company || 'Individual Prospect'}</div>
                </td>
                <td>
                  <div style={{ fontSize: '13px' }}>{lead.email || 'No Email'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lead.phone || 'No Phone'}</div>
                </td>
                <td>
                  <span className="badge badge-new" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                    {lead.source}
                  </span>
                </td>
                <td>
                  <div>{lead.industry || 'General'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lead.city ? `${lead.city}, ${lead.country}` : 'Remote'}</div>
                </td>
                <td>
                  <span className={`badge badge-${lead.status}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <div
                    title={lead.scoreReasons ? lead.scoreReasons.join(' • ') : 'AI Propensity Score'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'help',
                      background: lead.propensityTier === 'HOT' ? 'rgba(239, 68, 68, 0.15)' : lead.propensityTier === 'WARM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: lead.propensityTier === 'HOT' ? '#f87171' : lead.propensityTier === 'WARM' ? '#fbbf24' : '#94a3b8',
                      border: `1px solid ${lead.propensityTier === 'HOT' ? 'rgba(239, 68, 68, 0.4)' : lead.propensityTier === 'WARM' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(100, 116, 139, 0.4)'}`
                    }}
                  >
                    <span>{lead.propensityTier === 'HOT' ? '🔥' : lead.propensityTier === 'WARM' ? '⚡' : '❄️'}</span>
                    <span>{lead.propensityTier || 'COLD'} ({lead.aiScore || lead.score || 50}%)</span>
                  </div>
                </td>
                <td>
                  <div className="flex gap-8">
                    <button
                      className="btn-icon"
                      title="Direct Email & WhatsApp Pitch"
                      onClick={() => setPitchLead(lead)}
                    >
                      📧
                    </button>
                    <button
                      className="btn-icon"
                      title="Convert to Deal & Close"
                      onClick={() => {
                        setDealLead(lead);
                        setDealForm({
                          title: `${lead.company || lead.name} AI & Workflow Implementation`,
                          value: 125000,
                          stage: 'negotiation'
                        });
                      }}
                    >
                      💼
                    </button>
                    <button
                      className="btn-icon"
                      title="Delete"
                      onClick={() => handleDelete(lead.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Direct Pitch Modal */}
      {pitchLead && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2>Pitch: {pitchLead.company || pitchLead.name}</h2>
              <button className="btn-icon" onClick={() => setPitchLead(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="mb-14" style={{ fontSize: '12px', color: '#94a3b8' }}>
                Contact: <strong style={{ color: '#fff' }}>{pitchLead.name}</strong> • Phone: <strong style={{ color: '#38bdf8' }}>{pitchLead.phone || 'N/A'}</strong> • Email: <strong style={{ color: '#a78bfa' }}>{pitchLead.email || 'N/A'}</strong>
              </div>

              <div className="form-group mb-16">
                <label className="form-label">High-Converting Executive Pitch Message</label>
                <textarea
                  className="form-textarea"
                  style={{ height: '140px', fontSize: '12.5px', lineHeight: '1.5' }}
                  defaultValue={generatePitchText(pitchLead)}
                  id="pitchTextarea"
                />
              </div>

              <div className="flex gap-10 flex-wrap">
                {pitchLead.phone && (
                  <a
                    href={`https://wa.me/${pitchLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatePitchText(pitchLead))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', flex: 1, justifyContent: 'center' }}
                  >
                    💬 WhatsApp Client Directly
                  </a>
                )}

                {pitchLead.email && (
                  <a
                    href={`mailto:${pitchLead.email}?subject=${encodeURIComponent(`Quick question for ${pitchLead.company || pitchLead.name}`)}&body=${encodeURIComponent(generatePitchText(pitchLead))}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    📧 Send Official Email
                  </a>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const el = document.getElementById('pitchTextarea');
                    if (el) navigator.clipboard.writeText(el.value);
                    setCopiedPitch(true);
                    setTimeout(() => setCopiedPitch(false), 2000);
                  }}
                >
                  {copiedPitch ? '✓ Copied' : '📋 Copy Pitch'}
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPitchLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Deal Modal */}
      {dealLead && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Convert Lead to High-Value Deal</h2>
              <button className="btn-icon" onClick={() => setDealLead(null)}>✕</button>
            </div>
            <form onSubmit={handleCreateDealFromLead}>
              <div className="modal-body">
                <div className="mb-14" style={{ fontSize: '12px', color: '#38bdf8' }}>
                  Target Client: <strong>{dealLead.company || dealLead.name}</strong> ({dealLead.name})
                </div>

                <div className="form-group mb-12">
                  <label className="form-label">Deal Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={dealForm.title}
                    onChange={e => setDealForm({ ...dealForm, title: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Deal Value (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={dealForm.value}
                      onChange={e => setDealForm({ ...dealForm, value: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Pipeline Stage</label>
                    <select
                      className="form-select"
                      value={dealForm.stage}
                      onChange={e => setDealForm({ ...dealForm, stage: e.target.value })}
                    >
                      <option value="qualified">Qualified Lead</option>
                      <option value="proposal">Proposal Sent</option>
                      <option value="negotiation">Negotiation (Hot)</option>
                      <option value="won">Won (Ready to Finalize)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDealLead(null)}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}
                >
                  Create Deal & Open Closer ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Prospect Lead</h2>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddLead}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newLead.name}
                      onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newLead.company}
                      onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={newLead.email}
                      onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newLead.phone}
                      onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. clientdomain.com"
                      value={newLead.website}
                      onChange={e => setNewLead({ ...newLead, website: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. IT, E-commerce, Real Estate"
                      value={newLead.industry}
                      onChange={e => setNewLead({ ...newLead, industry: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Prospect Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
