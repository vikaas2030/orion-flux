import React, { useState, useEffect } from 'react';

export default function HighTicketHunter({ onDealsUpdated }) {
  const [markets, setMarkets] = useState([]);
  const [selectedMarketKeys, setSelectedMarketKeys] = useState(['dubai_luxury', 'uk_enterprise', 'us_tech_medical']);
  const [limitPerNiche, setLimitPerNiche] = useState(2);
  const [isHunting, setIsHunting] = useState(false);
  const [huntLogs, setHuntLogs] = useState([]);
  const [huntResult, setHuntResult] = useState(null);
  const [stats, setStats] = useState({ totalCount: 0, totalUsdPipelineFormatted: '$0 USD', totalUsdAdvanceFormatted: '$0 USD', deals: [] });
  const [copiedKey, setCopiedKey] = useState(null);
  const [emailModal, setEmailModal] = useState({ show: false, to: '', subject: '', text: '', isSending: false, successMsg: '' });

  const loadData = () => {
    fetch('/api/high-ticket/markets')
      .then(res => res.json())
      .then(data => {
        if (data.markets) setMarkets(data.markets);
      })
      .catch(() => {});

    fetch('/api/high-ticket/deals')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleMarket = (key) => {
    setSelectedMarketKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleStartHunt = async () => {
    if (selectedMarketKeys.length === 0) {
      alert('Please select at least one high-ticket market!');
      return;
    }

    setIsHunting(true);
    setHuntLogs(['[SYSTEM] Initializing High-Ticket Cross-Border Pipeline Engine...']);
    setHuntResult(null);

    const logPoller = setInterval(() => {
      fetch('/api/high-ticket/status')
        .then(res => res.json())
        .then(st => {
          if (st.logs && st.logs.length > 0) setHuntLogs(st.logs);
        })
        .catch(() => {});
    }, 1200);

    try {
      const res = await fetch('/api/high-ticket/hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markets: selectedMarketKeys,
          limitPerNiche: parseInt(limitPerNiche) || 2
        })
      });
      const data = await res.json();
      clearInterval(logPoller);
      setIsHunting(false);
      setHuntResult(data);
      loadData();
      if (onDealsUpdated) onDealsUpdated();
    } catch (err) {
      clearInterval(logPoller);
      setIsHunting(false);
      setHuntLogs(prev => [`[ERROR] ${err.message}`, ...prev]);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const openEmailModal = (deal) => {
    const cleanCompany = deal.lead_company || deal.lead_name || 'Enterprise Client';
    const slug = cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const stagingUrl = `http://localhost:5000/portal/${slug}`;

    setEmailModal({
      show: true,
      to: deal.email || `contact@${slug}.com`,
      subject: `Confidential: Autonomous Digital & Video Infrastructure for ${cleanCompany}`,
      text: `Hello Leadership Team at ${cleanCompany},\n\n` +
        `We evaluated your market presence and architected a turnkey autonomous infrastructure tailored for ${cleanCompany}:\n\n` +
        `1. 24/7 Autonomous Client Intake & VIP Qualification Bot\n` +
        `2. 4K Cinema-Grade Video Asset Suite for Acquisition\n` +
        `3. Executive Staging Portal with Real-Time Milestone Delivery\n\n` +
        `Commercial Terms:\n` +
        `• Total Investment: $${deal.value.toLocaleString()} USD (100% All-Inclusive Net • Zero Extra Tax)\n` +
        `• 50% Milestone Advance Token: $${(deal.advance || Math.round(deal.value * 0.5)).toLocaleString()} USD\n` +
        `• Deliverables: ${deal.deliverables || 'Full Turnkey Suite with 100% IP Assignment'}\n\n` +
        `Your private staging demonstration is ready for review:\n${stagingUrl}\n\n` +
        `Best regards,\nVikas | Managing Principal\nORION FLUX Autonomous Global OS\nEscrow: payments@orionflux.agency`,
      isSending: false,
      successMsg: ''
    });
  };

  const handleSendEmail = async () => {
    if (!emailModal.to || !emailModal.subject) {
      alert('Recipient email and subject are required!');
      return;
    }

    setEmailModal(prev => ({ ...prev, isSending: true, successMsg: '' }));
    try {
      const res = await fetch('/api/real-world/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailModal.to,
          subject: emailModal.subject,
          text: emailModal.text
        })
      });
      const data = await res.json();
      setEmailModal(prev => ({
        ...prev,
        isSending: false,
        successMsg: data.success ? '✅ Email successfully dispatched via Google SMTP!' : `Notice: ${data.message || 'Queued'}`
      }));
    } catch (err) {
      setEmailModal(prev => ({
        ...prev,
        isSending: false,
        successMsg: `⚠️ Error: ${err.message}`
      }));
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Metrics Banner */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>💎</span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fbbf24' }}>
                High-Ticket Global Dollar Pipeline Expansion
              </h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#cbd5e1' }}>
              Target Dubai ($1,800 – $3,200), London (£1,600 – £2,800), & US Tech ($2,500 – $4,500). Auto-generates enterprise deals & live demo portals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>High-Ticket Pipeline</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24' }}>{stats.totalUsdPipelineFormatted}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>50% Advance Target</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399' }}>{stats.totalUsdAdvanceFormatted}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Deals in Staging</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>{stats.totalCount} Enterprise Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Selector Cards */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '12px' }}>
          Select High-Ticket Target Metros & Enterprise Sectors:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {markets.map(market => {
            const isSelected = selectedMarketKeys.includes(market.key);
            return (
              <div
                key={market.key}
                onClick={() => toggleMarket(market.key)}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.08)' : '#0f172a',
                  border: isSelected ? '2px solid #f59e0b' : '1px solid #1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                    {market.title}
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '600' }}>
                    💵 Deal Size: {market.ticketRange}
                  </span>
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
                    ⚡ Adv: {market.avgAdvance}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong>Target Sectors:</strong>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                    {market.niches.map(n => (
                      <li key={n.id} style={{ marginBottom: '2px' }}>
                        {n.name} <span style={{ color: '#fbbf24' }}>(${n.price.toLocaleString()})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Row */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#020617',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>
            Entities per Niche:
          </label>
          <select
            value={limitPerNiche}
            onChange={e => setLimitPerNiche(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '13px'
            }}
          >
            <option value="1">1 Enterprise per Niche</option>
            <option value="2">2 Enterprises per Niche (Recommended)</option>
            <option value="3">3 Enterprises per Niche</option>
          </select>
        </div>

        <button
          onClick={handleStartHunt}
          disabled={isHunting}
          style={{
            padding: '12px 28px',
            borderRadius: '10px',
            background: isHunting 
              ? '#334155' 
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#020617',
            fontWeight: '800',
            fontSize: '14px',
            border: 'none',
            cursor: isHunting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isHunting ? '⏳ Hunting High-Ticket Leads...' : '🚀 Launch High-Ticket Hunt & Arm Deals'}
        </button>
      </div>

      {/* Live Hunt Console Logs */}
      {huntLogs.length > 0 && (
        <div style={{
          backgroundColor: '#020617',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid #1e293b',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#38bdf8',
          maxHeight: '140px',
          overflowY: 'auto',
          marginBottom: '24px'
        }}>
          {huntLogs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '3px' }}>{log}</div>
          ))}
        </div>
      )}

      {/* High-Ticket Deals Table */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#fff' }}>
            Active High-Ticket Deals in Pipeline ({stats.deals?.length || 0})
          </h4>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Escrow Rail: PayPal (payments@orionflux.agency) & Stripe USD
          </span>
        </div>

        {stats.deals && stats.deals.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Client Enterprise</th>
                  <th style={{ padding: '10px 12px' }}>Project Scope</th>
                  <th style={{ padding: '10px 12px' }}>Deal Value</th>
                  <th style={{ padding: '10px 12px' }}>50% Advance</th>
                  <th style={{ padding: '10px 12px' }}>Staging Portal</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.deals.map(deal => {
                  const company = deal.lead_company || deal.lead_name || 'Client';
                  const slug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  return (
                    <tr key={deal.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#fff' }}>
                        <div>{company}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{deal.phone || deal.email || 'Direct'}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#cbd5e1' }}>
                        <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {deal.title}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#fbbf24' }}>
                        ${deal.value.toLocaleString()} USD
                      </td>
                      <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>
                        ${(deal.advance || Math.round(deal.value * 0.5)).toLocaleString()} USD
                      </td>
                      <td style={{ padding: '12px' }}>
                        <a
                          href={`http://localhost:5000/portal/${slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>🌐</span> View Demo
                        </a>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => openEmailModal(deal)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              color: '#34d399',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            ✉️ Send Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
            No high-ticket deals armed yet. Select markets above and click <strong>"Launch High-Ticket Hunt & Arm Deals"</strong>!
          </div>
        )}
      </div>

      {/* Send Email Modal */}
      {emailModal.show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '640px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                Dispatch Enterprise Proposal Email
              </h3>
              <button
                onClick={() => setEmailModal(prev => ({ ...prev, show: false }))}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>To:</label>
              <input
                type="email"
                value={emailModal.to}
                onChange={e => setEmailModal({ ...emailModal, to: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Subject:</label>
              <input
                type="text"
                value={emailModal.subject}
                onChange={e => setEmailModal({ ...emailModal, subject: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Proposal Body:</label>
              <textarea
                value={emailModal.text}
                onChange={e => setEmailModal({ ...emailModal, text: e.target.value })}
                rows={8}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: '#cbd5e1', fontSize: '12px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {emailModal.successMsg && (
              <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', fontSize: '12px', marginBottom: '16px' }}>
                {emailModal.successMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEmailModal(prev => ({ ...prev, show: false }))}
                style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={handleSendEmail}
                disabled={emailModal.isSending}
                style={{ padding: '8px 20px', borderRadius: '6px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: emailModal.isSending ? 'not-allowed' : 'pointer' }}
              >
                {emailModal.isSending ? 'Sending...' : '🚀 Send via Google SMTP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
