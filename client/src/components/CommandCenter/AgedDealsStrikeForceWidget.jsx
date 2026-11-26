import React, { useState, useEffect } from 'react';

export default function AgedDealsStrikeForceWidget({ onSettlementSuccess }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlay, setSelectedPlay] = useState('archiveUltimatum'); // 'archiveUltimatum' | 'pilotFlashBridge'
  const [activeCallDeal, setActiveCallDeal] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filterThreshold, setFilterThreshold] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autopilotState, setAutopilotState] = useState(null);
  const [triggeringPulse, setTriggeringPulse] = useState(false);

  const fetchAutopilot = () => {
    fetch('/api/aged-deals/autopilot/status')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setAutopilotState(res.data);
        }
      })
      .catch(() => {});
  };

  const handleTriggerAutoPulse = () => {
    setTriggeringPulse(true);
    fetch('/api/aged-deals/autopilot/trigger', { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setTriggeringPulse(false);
        fetchAutopilot();
        fetchMetrics();
      })
      .catch(() => {
        setTriggeringPulse(false);
      });
  };

  const handleToggleAutoPilot = () => {
    fetch('/api/aged-deals/autopilot/toggle', { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setAutopilotState(res.data);
        }
      })
      .catch(() => {});
  };

  const handleCopyAllDispatches = () => {
    const activeDeals = data?.deals || [];
    if (activeDeals.length === 0) return;
    const summary = activeDeals.map((d, i) => {
      const play = d.plays[selectedPlay] || d.plays.archiveUltimatum;
      return `[#${i + 1}] ${d.company} (${d.contact}) - Phone: ${d.phone}\n${play.message}\n════════════════════════════════════════`;
    }).join('\n\n');
    navigator.clipboard.writeText(summary);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const fetchMetrics = () => {
    setIsRefreshing(true);
    fetch(`/api/aged-deals/metrics?days=${filterThreshold}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setData(res);
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
    fetchMetrics();
    fetchAutopilot();
    const interval = setInterval(fetchAutopilot, 10000);
    return () => clearInterval(interval);
  }, [filterThreshold]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading && !data) {
    return (
      <div style={{
        background: '#070d1e',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        color: '#94a3b8',
        marginBottom: '24px'
      }}>
        Scanning Pipeline for 10+ Days Aged Stalled Deals...
      </div>
    );
  }

  const deals = data?.deals || [];

  return (
    <div style={{
      background: 'linear-gradient(180deg, #090e1f 0%, #030712 100%)',
      border: '2px solid rgba(245, 158, 11, 0.45)',
      borderRadius: '18px',
      padding: '22px 24px',
      marginBottom: '28px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.15)',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: '#000',
            fontWeight: '900'
          }}>
            🎯
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                10+ DAYS STALLED DEALS • STRIKE FORCE
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Managing Principal: <strong style={{ color: '#fff' }}>Vikas Singh</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '19px', fontWeight: 'bold', color: '#fff', margin: '3px 0 0 0' }}>
              Aged Deal Immediate Cash Settlement Protocol
            </h2>
          </div>
        </div>

        {/* Days Filter Pills & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              type="button"
              onClick={() => setFilterThreshold(7)}
              style={{
                background: filterThreshold === 7 ? '#f59e0b' : 'transparent',
                color: filterThreshold === 7 ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              7+ Days
            </button>
            <button
              type="button"
              onClick={() => setFilterThreshold(10)}
              style={{
                background: filterThreshold === 10 ? '#f59e0b' : 'transparent',
                color: filterThreshold === 10 ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              10+ Days
            </button>
            <button
              type="button"
              onClick={() => setFilterThreshold(14)}
              style={{
                background: filterThreshold === 14 ? '#f59e0b' : 'transparent',
                color: filterThreshold === 14 ? '#000' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              14+ Days
            </button>
          </div>

          <button
            type="button"
            onClick={fetchMetrics}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔄 {isRefreshing ? 'Scanning...' : 'Rescan'}
          </button>

          <button
            type="button"
            onClick={handleCopyAllDispatches}
            style={{
              background: copiedAll ? '#22c55e' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              fontWeight: '900',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(245, 158, 11, 0.35)'
            }}
          >
            {copiedAll ? '✓ All 24 Dispatches Copied!' : '⚡ Copy All 24 WhatsApp Dispatches'}
          </button>
        </div>
      </div>

      {/* 🤖 24x7 Autonomous Closer Engine Status Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '14px',
        padding: '14px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: autopilotState?.isAutoPilotActive ? '#22c55e' : '#eab308',
            boxShadow: autopilotState?.isAutoPilotActive ? '0 0 10px #22c55e' : 'none',
            display: 'inline-block'
          }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                {autopilotState?.systemMode || '24x7 AUTONOMOUS AUTO-PILOT 🟢'}
              </span>
              <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                ({autopilotState?.totalAutoPulsesRun || 0} Auto-Pulses Complete)
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Self-operating: Telemetry Radar + 10+ Days Cadence Rotator + Bank Reconciler active continuously
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleTriggerAutoPulse}
            disabled={triggeringPulse}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {triggeringPulse ? '⏳ Pulsing Engine...' : '⚡ Force Auto-Pulse Now'}
          </button>

          <button
            type="button"
            onClick={handleToggleAutoPilot}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              cursor: 'pointer'
            }}
          >
            {autopilotState?.isAutoPilotActive ? '⏸️ Pause Auto-Pilot' : '▶️ Resume Auto-Pilot'}
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Stalled Pipeline Deals</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#fbbf24', marginTop: '4px' }}>
            {data?.totalAgedDeals} Deals
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Avg. {data?.avgStagnantDays} days pending without payment
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Stuck Pipeline Capital</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
            {data?.totalPipelineFormatted}
          </div>
          <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
            Ready for immediate conversion
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#34d399', textTransform: 'uppercase', fontWeight: 'bold' }}>50% Advance Cash Pool</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#34d399', marginTop: '4px' }}>
            {data?.totalAdvancePotentialFormatted}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Settlement: 9690973030@ibl
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>Zero-Risk Pilot Token Bridge</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8', marginTop: '4px' }}>
            ₹2,500 / $199
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Instant inertia-breaking token
          </div>
        </div>
      </div>

      {/* Strategic Play Switcher Bar */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '8px 12px',
        borderRadius: '12px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Select Closer Play:</span>
          <button
            type="button"
            onClick={() => setSelectedPlay('archiveUltimatum')}
            style={{
              background: selectedPlay === 'archiveUltimatum' ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              color: selectedPlay === 'archiveUltimatum' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🔥 Play A: 48h File Archive Warning (Reverse Psychology)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlay('pilotFlashBridge')}
            style={{
              background: selectedPlay === 'pilotFlashBridge' ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
              color: selectedPlay === 'pilotFlashBridge' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⚡ Play B: Flash ₹2,500 / $199 Pilot Token Bridge
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlay('videoTeaserProof')}
            style={{
              background: selectedPlay === 'videoTeaserProof' ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
              color: selectedPlay === 'videoTeaserProof' ? '#000' : '#94a3b8',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🎥 Play C: 45s Interactive Video Proof
          </button>
        </div>

        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
          {selectedPlay === 'archiveUltimatum'
            ? 'Triggers loss-aversion fear: client responds immediately to keep their reserved slot.'
            : selectedPlay === 'pilotFlashBridge'
            ? 'Eliminates financial risk: client pays small commitment token within 10 minutes.'
            : 'Visual proof shock: sends pre-built private staging walkthrough link to eliminate all doubt.'}
        </div>
      </div>

      {/* Aged Deals Action Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {deals.map((deal, idx) => {
          const activePlay = deal.plays[selectedPlay] || deal.plays.archiveUltimatum;

          return (
            <div
              key={deal.id}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.8fr auto',
                gap: '18px',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Client & Age Telemetry */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    fontSize: '10.5px',
                    fontWeight: '900',
                    padding: '2px 7px',
                    borderRadius: '4px'
                  }}>
                    {deal.daysOld} DAYS STAGNANT
                  </span>
                  <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                    Win Prob: {deal.probability}%
                  </span>
                </div>

                <h3 style={{ fontSize: '15.5px', fontWeight: 'bold', color: '#fff', margin: '6px 0 2px 0' }}>
                  {deal.company}
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Contact: <strong style={{ color: '#cbd5e1' }}>{deal.contact}</strong> • {deal.phone}
                </div>
                <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '4px' }}>
                  Advance Due: <strong>{deal.advanceFormatted}</strong> (or {deal.pilotFormatted} Pilot)
                </div>
              </div>

              {/* Middle Column: Tailored Play Preview Box */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '11.5px',
                color: '#e2e8f0',
                maxHeight: '90px',
                overflowY: 'auto',
                lineHeight: '1.45',
                fontFamily: 'monospace'
              }}>
                <div style={{ color: selectedPlay === 'archiveUltimatum' ? '#f87171' : '#34d399', fontWeight: 'bold', marginBottom: '4px' }}>
                  {activePlay.title}
                </div>
                {activePlay.message.slice(0, 220)}...
              </div>

              {/* Right Column: 1-Click Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '170px' }}>
                <a
                  href={activePlay.waUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 12px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  💬 1-Click WhatsApp Close
                </a>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveCallDeal(deal)}
                    style={{
                      flex: 1,
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📞 90s Call Script
                  </button>

                  <a
                    href={deal.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    📄 Invoice
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(activePlay.message, idx)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '11px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedIndex === idx ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 90-Second Call Script Modal */}
      {activeCallDeal && (
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
            border: '2px solid #f59e0b',
            borderRadius: '18px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '26px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  REVIVAL VOICE SCRIPT • {activeCallDeal.daysOld} DAYS STAGNANT
                </span>
                <h2 style={{ fontSize: '18px', color: '#fff', margin: '4px 0 0 0' }}>
                  Calling {activeCallDeal.contact} ({activeCallDeal.company})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveCallDeal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeCallDeal.phoneScript?.steps?.map((step, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px' }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.45', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', marginBottom: '6px' }}>
                    <span style={{ color: '#34d399', fontWeight: 'bold' }}>[Hindi]: </span>
                    {step.hindi}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>[English]: </span>
                    {step.english}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Beneficiary: <strong style={{ color: '#34d399' }}>Vikas Singh</strong> (9690973030@ibl)
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:${activeCallDeal.phone}`}
                  style={{
                    background: '#f59e0b',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '12.5px'
                  }}
                >
                  📞 Dial Client ({activeCallDeal.phone})
                </a>
                <button
                  type="button"
                  onClick={() => setActiveCallDeal(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#fff',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
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
