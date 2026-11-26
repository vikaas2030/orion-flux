import React, { useState, useEffect } from 'react';

export default function TelegramCockpitWidget() {
  const [cockpitState, setCockpitState] = useState(null);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [commandInput, setCommandInput] = useState('/status');
  const [commandOutput, setCommandOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testAlertMsg, setTestAlertMsg] = useState('');

  const fetchStatus = () => {
    fetch('/api/telegram/status')
      .then(res => res.json())
      .then(data => {
        if (data.cockpit) {
          setCockpitState(data.cockpit);
          if (data.cockpit.chatId && data.cockpit.chatId !== 'Not Set') {
            setChatId(data.cockpit.chatId);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    fetch('/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botToken, chatId })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setShowConfig(false);
        fetchStatus();
      })
      .catch(err => alert('Error saving: ' + err.message));
  };

  const handleSendTestAlert = () => {
    setTestAlertMsg('Dispatching test alert...');
    fetch('/api/telegram/test-alert', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTestAlertMsg('✅ Test alert dispatched! Check your phone/buffer below.');
          fetchStatus();
          setTimeout(() => setTestAlertMsg(''), 4000);
        }
      })
      .catch(err => setTestAlertMsg(`⚠️ Error: ${err.message}`));
  };

  const handleExecuteCommand = (cmdToRun) => {
    const cmd = cmdToRun || commandInput;
    if (!cmd.trim()) return;

    setIsExecuting(true);
    fetch('/api/telegram/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    })
      .then(res => res.json())
      .then(data => {
        setIsExecuting(false);
        setCommandOutput(data.reply);
        fetchStatus();
      })
      .catch(err => {
        setIsExecuting(false);
        setCommandOutput(`⚠️ Command error: ${err.message}`);
      });
  };

  return (
    <div style={{
      backgroundColor: '#0a0f1d',
      border: '1px solid #1e293b',
      borderLeft: '4px solid #38bdf8',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📱
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#fff' }}>
              Executive Mobile Cockpit & Telegram Remote Control
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Control ORION FLUX from your smartphone: Real-time deal alerts, 1-tap hunt, & instant mobile UTR settlements
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: cockpitState?.isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: cockpitState?.isConfigured ? '1px solid #10b981' : '1px solid #f59e0b',
            color: cockpitState?.isConfigured ? '#34d399' : '#fbbf24',
            fontWeight: '700'
          }}>
            {cockpitState?.isConfigured ? '🟢 Telegram Connected' : '📱 Mobile Cockpit Relay Ready'}
          </span>

          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⚙️ {showConfig ? 'Hide Settings' : 'Telegram Bot Setup'}
          </button>
        </div>
      </div>

      {/* Config Form Modal/Collapsible */}
      {showConfig && (
        <form onSubmit={handleSaveConfig} style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#020617',
          border: '1px solid #334155',
          marginBottom: '16px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginBottom: '10px' }}>
            Connect Your Personal Telegram Bot for 24/7 Mobile Push Alerts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                Telegram Bot Token (from @BotFather):
              </label>
              <input
                type="password"
                value={botToken}
                onChange={e => setBotToken(e.target.value)}
                placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                Your Personal Chat ID (from @userinfobot):
              </label>
              <input
                type="text"
                value={chatId}
                onChange={e => setChatId(e.target.value)}
                placeholder="e.g. 987654321"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                backgroundColor: '#10b981',
                color: '#020617',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={handleSendTestAlert}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🚀 Send Test Push Alert
            </button>
          </div>
          {testAlertMsg && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#34d399' }}>{testAlertMsg}</div>
          )}
        </form>
      )}

      {/* 2-Column Cockpit Layout: Command Console & Push Notifications Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Remote Command Terminal Simulator */}
        <div style={{
          backgroundColor: '#020617',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          padding: '16px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> Smartphone 1-Tap Command Cockpit
          </div>

          {/* Quick Command Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {[
              { label: '📊 /stats', cmd: '/stats' },
              { label: '🛡️ /bond 1', cmd: '/bond 1' },
              { label: '🤝 /close 1', cmd: '/close 1' },
              { label: '💎 /hunt dubai', cmd: '/hunt dubai' },
              { label: '🇬🇧 /hunt london', cmd: '/hunt london' },
              { label: '⚡ /pulse', cmd: '/pulse' }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCommandInput(p.cmd);
                  handleExecuteCommand(p.cmd);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              placeholder="e.g. /status or /hunt dubai"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            />
            <button
              type="button"
              onClick={() => handleExecuteCommand()}
              disabled={isExecuting}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#38bdf8',
                color: '#020617',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: isExecuting ? 'not-allowed' : 'pointer'
              }}
            >
              {isExecuting ? '...' : 'Send'}
            </button>
          </div>

          {commandOutput && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              fontSize: '11.5px',
              fontFamily: 'monospace',
              color: '#34d399',
              whiteSpace: 'pre-wrap',
              maxHeight: '140px',
              overflowY: 'auto'
            }}>
              {commandOutput}
            </div>
          )}
        </div>

        {/* Real-Time Push Alerts Stream */}
        <div style={{
          backgroundColor: '#020617',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔔</span> Live Smartphone Push Stream ({cockpitState?.recentAlerts?.length || 0})
            </div>
            <button
              type="button"
              onClick={handleSendTestAlert}
              style={{ fontSize: '10px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              + Trigger Test Alert
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {cockpitState?.recentAlerts && cockpitState.recentAlerts.length > 0 ? (
              cockpitState.recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    borderLeft: alert.priority === 'HIGH' ? '3px solid #ef4444' : '3px solid #10b981',
                    fontSize: '11.5px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ color: '#fff' }}>{alert.title}</strong>
                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>{alert.timeFormatted}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', lineHeight: '1.4' }}>
                    {alert.message}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px', fontSize: '12px' }}>
                Awaiting next autonomous push alert... All systems active.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
