import React, { useState, useEffect } from 'react';

export default function SpecialistCashCloserSquadWidget({ onLeadInjected }) {
  const [agents, setAgents] = useState([]);
  const [actionableLeads, setActionableLeads] = useState([]);
  const [objections, setObjections] = useState([]);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'objections' | 'inject'
  const [loading, setLoading] = useState(true);

  // Inject Real Lead Form State
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [niche, setNiche] = useState('');
  const [injecting, setInjecting] = useState(false);
  const [injectSuccess, setInjectSuccess] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/specialist-agents/status').then(r => r.json()),
      fetch('/api/specialist-agents/actionable-leads').then(r => r.json()),
      fetch('/api/specialist-agents/objections').then(r => r.json())
    ])
      .then(([statusRes, leadsRes, objRes]) => {
        if (statusRes.agents) setAgents(statusRes.agents);
        if (leadsRes.leads) setActionableLeads(leadsRes.leads);
        if (objRes.objections) setObjections(objRes.objections);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInjectLead = (e) => {
    e.preventDefault();
    if (!company.trim() || !phone.trim()) return;

    setInjecting(true);
    fetch('/api/specialist-agents/inject-real-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: company.trim(),
        contact: contact.trim() || 'Business Owner',
        phone: phone.trim(),
        city: city.trim() || 'Local City',
        niche: niche.trim() || 'Local Clinic / Business',
        totalValueINR: 25000,
        pilotTokenINR: 2500
      })
    })
      .then(r => r.json())
      .then(d => {
        setInjecting(false);
        if (d.success && d.deal) {
          setInjectSuccess(d.deal);
          setCompany('');
          setContact('');
          setPhone('');
          if (onLeadInjected) onLeadInjected(d.deal);
        }
      })
      .catch(() => setInjecting(false));
  };

  if (loading && agents.length === 0) {
    return (
      <div style={{
        background: '#070d1e',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#94a3b8',
        marginBottom: '26px'
      }}>
        Assembling Specialist Cash-Closer Agent Taskforce...
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(180deg, #091024 0%, #030712 100%)',
      border: '2px solid #10b981',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '30px',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(16, 185, 129, 0.2)',
      position: 'relative'
    }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#000',
            fontWeight: '900'
          }}>
            ⚔️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                SPECIALIST CASH-SETTLEMENT TASKFORCE
              </span>
              <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Settlement UPI: <strong style={{ color: '#fff' }}>9690973030@ibl</strong> (Vikas Singh)
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '4px 0 0 0' }}>
              Real-World Delivery & Instant Bank Cash Solution
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            style={{
              background: activeTab === 'queue' ? '#10b981' : 'transparent',
              color: activeTab === 'queue' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            💬 Real WhatsApp Queue ({actionableLeads.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('objections')}
            style={{
              background: activeTab === 'objections' ? '#38bdf8' : 'transparent',
              color: activeTab === 'objections' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📞 Objection Destroyer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inject')}
            style={{
              background: activeTab === 'inject' ? '#f59e0b' : 'transparent',
              color: activeTab === 'inject' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ➕ Inject Known Local Lead
          </button>
        </div>
      </div>

      {/* 4 Specialist Agent Cards Roster */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '22px'
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: '24px' }}>{agent.avatar}</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                {agent.name}
              </div>
              <div style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 'bold' }}>
                {agent.status}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.3' }}>
                {agent.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TAB 1: REAL WHATSAPP DIRECT QUEUE */}
      {activeTab === 'queue' && (
        <div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '12.5px',
            color: '#fca5a5'
          }}>
            <strong>⚡ The Solution to "Zero Payment in Bank":</strong> Instead of waiting for automated internal server logs, tap each client below to open WhatsApp Web/App directly from <strong>Vikas Singh's real phone</strong>. When a client receives a personal message from Vikas Singh with their live demo link, they reply and transfer the pilot token!
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {actionableLeads.map((lead, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.6fr auto',
                  gap: '18px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#10b981', color: '#000', fontSize: '10px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px' }}>
                      VERIFIED MOBILE
                    </span>
                    <span style={{ fontSize: '11px', color: '#38bdf8' }}>{lead.city}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '4px 0 2px 0' }}>
                    {lead.company}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                    {lead.contact} • <strong style={{ color: '#34d399' }}>{lead.displayPhone}</strong>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#fbbf24', marginTop: '3px' }}>
                    Fast-Cash Pilot: <strong>₹{lead.recommendedToken?.toLocaleString('en-IN')}</strong> (100% Refundable)
                  </div>
                </div>

                {/* Staging Links */}
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Client's Pre-Configured Assets:
                  </div>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '8px' }}>
                    {lead.scope}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={lead.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none' }}
                    >
                      🔗 Live Demo
                    </a>
                    <a
                      href={lead.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none' }}
                    >
                      📄 Pro-Forma Invoice
                    </a>
                    <a
                      href={lead.payUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none' }}
                    >
                      ⚡ Pay ₹{lead.recommendedToken}
                    </a>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div>
                  <a
                    href={lead.whatsAppDirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: '#000',
                      fontWeight: '900',
                      fontSize: '12.5px',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    💬 Send from Vikas Singh WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LETHAL OBJECTION DESTROYER */}
      {activeTab === 'objections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Jab aap client ko call karein ya WhatsApp par baat karein, unke kisi bhi objection par exact ye bolna hai:
          </div>
          {objections.map((obj, oIdx) => (
            <div
              key={oIdx}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f87171', marginBottom: '4px' }}>
                ❌ Objection: "{obj.objection}"
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
                🧠 Underlying Fear: {obj.psychology}
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                color: '#e2e8f0',
                lineHeight: '1.5'
              }}>
                <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓ Vikas Singh's Lethal Response (Hindi): </span>
                {obj.lethalResponseHindi}
              </div>
              <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '8px', fontWeight: 'bold' }}>
                🎯 Immediate Closing Ask: {obj.closingAsk}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INJECT KNOWN LOCAL LEAD */}
      {activeTab === 'inject' && (
        <form onSubmit={handleInjectLead} style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '8px' }}>
            Aapke As-Paas Ka Real Business Inject Kijiye (Doctor, Gym, Real Estate, Builder):
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '16px' }}>
            Agar aapke paas kisi local doctor, clinic, ya business owner ka asli WhatsApp number hai, yahan daliye. System 3 second me unke naam ka live portal aur ₹2,500 pilot invoice generate kar dega!
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Business / Clinic Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. Verma Dental Care"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', background: '#030712', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Doctor / Owner Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Verma"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#030712', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#10b981', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Real 10-Digit Mobile Number *</label>
              <input
                type="text"
                placeholder="e.g. 9811002233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', background: '#030712', border: '1.5px solid #10b981', borderRadius: '6px', color: '#34d399', fontWeight: 'bold', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>City</label>
              <input
                type="text"
                placeholder="e.g. Bareilly / Noida / Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#030712', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Category / Industry</label>
              <input
                type="text"
                placeholder="e.g. Dental Clinic"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#030712', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={injecting}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000',
                fontWeight: '900',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {injecting ? 'Arming System...' : '⚡ Arm Lead with Live Demo & Invoice'}
            </button>
          </div>

          {injectSuccess && (
            <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontSize: '12.5px' }}>
                🎉 <strong>{injectSuccess.company}</strong> Armed! Mobile: {injectSuccess.phone} | Advance: ₹{injectSuccess.advance50INR} (Pilot: ₹{injectSuccess.pilotTokenINR})
              </div>
              <a
                href={injectSuccess.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                style={{ background: '#22c55e', color: '#000', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}
              >
                💬 Open WhatsApp Now
              </a>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
