import React, { useState, useEffect } from 'react';

export default function HotIntentRadarWidget() {
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRadar = () => {
    setIsRefreshing(true);
    fetch('/api/hot-intent/radar')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setRadarData(res.data);
          if (!selectedSession && res.data.sessions?.length > 0) {
            setSelectedSession(res.data.sessions[0]);
          } else if (selectedSession && res.data.sessions) {
            const updated = res.data.sessions.find(s => s.id === selectedSession.id);
            if (updated) setSelectedSession(updated);
          }
        }
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchRadar();
    // Real-time polling every 6 seconds
    const interval = setInterval(fetchRadar, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (loading && !radarData) {
    return (
      <div style={{
        background: '#070d1e',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#94a3b8',
        marginBottom: '24px'
      }}>
        Initializing 60-Second Hot Intent Radar...
      </div>
    );
  }

  const sessions = radarData?.sessions || [];
  const activeCount = radarData?.activeCount || 0;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #070d1e 0%, #030712 100%)',
      border: '2px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '18px',
      padding: '22px',
      marginBottom: '28px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner & Radar Pulse */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🛰️
            {/* Live pulsating beacon */}
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              background: '#22c55e',
              borderRadius: '50%',
              border: '2px solid #000',
              boxShadow: '0 0 10px #22c55e'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                RADAR LIVE • 60-SEC TRIGGER
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Settlement Payee: <strong style={{ color: '#fff' }}>Vikas Singh</strong> (9690973030@ibl)
              </span>
            </div>
            <h2 style={{ fontSize: '19px', fontWeight: 'bold', color: '#fff', margin: '4px 0 0 0' }}>
              Hot Intent Telemetry & 1-Click Closer Desk
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={fetchRadar}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔄 {isRefreshing ? 'Scanning...' : 'Scan Radar'}
          </button>
          <div style={{
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#4ade80',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            🎯 {activeCount} High-Intent Deals Active
          </div>
        </div>
      </div>

      {/* Grid: Active Hot Sessions List & Deep-Dive Closer Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '20px'
      }}>
        {/* Left Column: Live Visitor List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 'bold' }}>
            Live Radar Detection Stream
          </div>

          {sessions.map((s) => {
            const isSelected = selectedSession?.id === s.id;
            const elapsed = s.elapsedSeconds < 60
              ? `${s.elapsedSeconds}s ago`
              : `${Math.floor(s.elapsedSeconds / 60)}m ago`;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSession(s)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: isSelected
                    ? '1.5px solid #ef4444'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: s.isHotNow ? '#22c55e' : '#f59e0b',
                        boxShadow: s.isHotNow ? '0 0 8px #22c55e' : 'none',
                        display: 'inline-block'
                      }} />
                      <strong style={{ color: '#fff', fontSize: '13.5px' }}>{s.clientName}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '3px' }}>
                      Target: ₹{s.amount?.toLocaleString('en-IN')} Advance • {s.clientPhone}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.25)',
                      color: '#fca5a5',
                      fontSize: '11px',
                      fontWeight: '900',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>
                      🔥 {s.intentScore}%
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '3px' }}>
                      {elapsed}
                    </div>
                  </div>
                </div>

                {/* Latest Micro Action */}
                <div style={{
                  marginTop: '10px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>⚡ Action:</span>
                  <code style={{ color: '#34d399' }}>
                    {s.actions[0]?.action || 'ACTIVE_ON_CHECKOUT'}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Instant Closer Controls & Scripts */}
        {selectedSession && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Prospect Engagement Command Desk
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>
                    {selectedSession.clientName}
                  </h3>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '11.5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  Instant UPI: 9690973030@ibl
                </div>
              </div>

              {/* Pre-Crafted WhatsApp Nudge Box */}
              <div style={{
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4ade80' }}>
                    💬 TAILORED WHATSAPP NUDGE (FROM VIKAS SINGH)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedSession.nudgeScript?.message, 1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#cbd5e1',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedIndex === 1 ? '✓ Copied' : 'Copy Text'}
                  </button>
                </div>
                <div style={{
                  fontSize: '12px',
                  lineHeight: '1.5',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  fontFamily: 'monospace'
                }}>
                  {selectedSession.nudgeScript?.message}
                </div>
              </div>
            </div>

            {/* Action Buttons: 1-Click WhatsApp & 90s Call Script Modal */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <a
                href={selectedSession.nudgeScript?.waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#000',
                  fontWeight: '900',
                  fontSize: '12.5px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.35)',
                  transition: 'transform 0.15s'
                }}
              >
                🚀 1-Click WhatsApp Send
              </a>

              <button
                type="button"
                onClick={() => setShowCallModal(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                📞 90s Voice Closer Script
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 90-Second Executive Phone Closer Script Modal */}
      {showCallModal && selectedSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#070d1e',
            border: '2px solid #38bdf8',
            borderRadius: '18px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  EXECUTIVE VOICE PROTOCOL • 90-SECOND CLOSE
                </div>
                <h2 style={{ fontSize: '18px', color: '#fff', margin: '4px 0 0 0' }}>
                  Calling {selectedSession.clientName} ({selectedSession.clientPhone})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '22px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedSession.phoneScript?.scriptSections?.map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '14px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px' }}>
                    {sec.step}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.5', marginBottom: '6px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>[Hindi]: </span>
                    {sec.hindi}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>[English]: </span>
                    {sec.english}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Bank UPI: <strong style={{ color: '#34d399' }}>9690973030@ibl</strong> (Vikas Singh)
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:${selectedSession.clientPhone?.replace(/[^0-9+]/g, '')}`}
                  style={{
                    background: '#38bdf8',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px'
                  }}
                >
                  📞 Dial Now ({selectedSession.clientPhone})
                </a>
                <button
                  type="button"
                  onClick={() => setShowCallModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
