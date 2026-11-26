import React, { useState, useEffect } from 'react';

export default function CouncilBoardroomWidget() {
  const [councilData, setCouncilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [convening, setConvening] = useState(false);
  const [activeTab, setActiveTab] = useState('deliberation'); // 'deliberation' | 'resolutions' | 'board'
  const [actionAlert, setActionAlert] = useState('');

  const fetchCouncilData = () => {
    fetch('/api/council/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCouncilData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCouncilData();
    const interval = setInterval(fetchCouncilData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleConveneEmergency = () => {
    setConvening(true);
    setActionAlert('🏛️ Convening Apex Neural Council Emergency Session...');
    fetch('/api/council/convene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggerType: 'EMERGENCY_EXECUTIVE_CONVENE' })
    })
      .then(res => res.json())
      .then(data => {
        setConvening(false);
        if (data.success) {
          setActionAlert(`✅ Council Session #${data.session.sessionNumber} Ratified! 3 Executive Orders Issued.`);
          fetchCouncilData();
          setTimeout(() => setActionAlert(''), 6000);
        }
      })
      .catch(() => setConvening(false));
  };

  const members = councilData?.boardMembers || [];
  const latestSession = councilData?.latestSession;
  const resolutions = councilData?.activeResolutions || [];

  return (
    <div className="glass-card mb-24 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #0b0f19 0%, #05070d 100%)',
      border: '1px solid rgba(168, 85, 247, 0.35)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '24px',
            background: 'rgba(168, 85, 247, 0.2)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(168, 85, 247, 0.4)'
          }}>
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
                Apex Neural Council — Autonomous AI Board of Directors
              </h3>
              <span style={{
                fontSize: '11px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontWeight: '600'
              }}>
                ● 5/5 Quorum Online
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Autonomous C-Suite governance: Strategy, Treasury, Omnichannel Science, SLA Architecture & Statutory Law
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={handleConveneEmergency}
            disabled={convening}
            className="btn btn-secondary"
            style={{
              fontSize: '12px',
              padding: '7px 14px',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              fontWeight: '600'
            }}
          >
            {convening ? '⚡ Deliberating...' : '🏛️ Convene Emergency Board Meeting'}
          </button>
        </div>
      </div>

      {actionAlert && (
        <div className="mb-14 p-10 animate-in" style={{
          background: 'rgba(168, 85, 247, 0.15)',
          border: '1px solid #a855f7',
          borderRadius: '8px',
          color: '#d8b4fe',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {actionAlert}
        </div>
      )}

      {/* Board Members Roster Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '16px'
      }}>
        {members.map(m => (
          <div key={m.id} style={{
            background: '#090d16',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>{m.avatar}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#f1f5f9' }}>{m.name}</span>
                <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold' }}>IQ {m.iqScore}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '500' }}>{m.title}</div>
              <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {m.focus}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setActiveTab('deliberation')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            border: activeTab === 'deliberation' ? '1px solid #a855f7' : '1px solid transparent',
            background: activeTab === 'deliberation' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            color: activeTab === 'deliberation' ? '#d8b4fe' : '#94a3b8'
          }}
        >
          💬 Deliberation & Voting ({latestSession?.sessionId || 'Current'})
        </button>

        <button
          onClick={() => setActiveTab('resolutions')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            border: activeTab === 'resolutions' ? '1px solid #a855f7' : '1px solid transparent',
            background: activeTab === 'resolutions' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            color: activeTab === 'resolutions' ? '#d8b4fe' : '#94a3b8'
          }}
        >
          📜 Ratified Executive Resolutions ({resolutions.length})
        </button>
      </div>

      {/* TAB 1: Live Deliberation Transcript */}
      {activeTab === 'deliberation' && latestSession && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#94a3b8',
            marginBottom: '10px',
            background: '#090d16',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #1e293b'
          }}>
            <span><strong>Session ID:</strong> {latestSession.sessionId}</span>
            <span><strong>Trigger:</strong> {latestSession.triggerType}</span>
            <span><strong>Quorum:</strong> {latestSession.quorum}</span>
            <span style={{ color: '#4ade80' }}><strong>Status:</strong> {latestSession.boardroomStatus}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {latestSession.deliberation?.map((d, i) => (
              <div key={i} style={{
                background: '#0a0e18',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '20px', marginTop: '2px' }}>{d.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#e2e8f0' }}>{d.speaker}</span>
                    <span style={{
                      fontSize: '10px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      VOTE: {d.vote}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    "{d.statement}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Ratified Resolutions */}
      {activeTab === 'resolutions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {resolutions.map((res, i) => (
            <div key={res.id || i} style={{
              background: '#0a0e18',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              borderLeft: '4px solid #a855f7'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f1f5f9' }}>
                  {res.id}: {res.title}
                </span>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  {res.passedBy || 'Unanimous 5-0 Vote'}
                </span>
              </div>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#cbd5e1' }}>
                {res.mandate}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <span>Category: {res.category}</span>
                <span>Effective Immediately • Enforceable by System Heartbeat</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
