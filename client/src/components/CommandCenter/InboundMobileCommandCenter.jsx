import React, { useState, useEffect } from 'react';

export default function InboundMobileCommandCenter() {
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [autoReplyResult, setAutoReplyResult] = useState(null);

  const fetchStatus = () => {
    fetch('/api/inbound/status')
      .then(r => r.json())
      .then(d => setStatus(d))
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckNow = () => {
    setChecking(true);
    setCheckResult('');
    fetch('/api/inbound/check-now', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        setChecking(false);
        setCheckResult(d.message || 'Inbox synchronized successfully');
        setTimeout(() => setCheckResult(''), 5000);
      })
      .catch(err => {
        setChecking(false);
        setCheckResult('Notice: ' + err.message);
      });
  };

  const handleTestInboundCloser = (e) => {
    e.preventDefault();
    if (!testEmail || !testQuery) return;
    setProcessing(true);
    setAutoReplyResult(null);

    fetch('/api/inbound/handle-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromEmail: testEmail,
        prospectName: testEmail.split('@')[0],
        messageContent: testQuery,
        subject: 'Inquiry regarding Automated System Setup'
      })
    })
      .then(r => r.json())
      .then(d => {
        setProcessing(false);
        setAutoReplyResult(d);
      })
      .catch(err => {
        setProcessing(false);
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="glass-card mb-24 animate-in" style={{
      padding: '22px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderTop: '4px solid #6366f1'
    }}>
      <div className="flex justify-between items-center flex-wrap gap-12 mb-16">
        <div>
          <div className="flex items-center gap-8">
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
              ⚡ 2-Way Inbound Client Closer & Mobile Command Center
            </h3>
            <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontSize: '10px' }}>
              LIVE IMAP TLS (993)
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Listens for incoming client replies to <strong>vikaas2030@gmail.com</strong>, analyzes prospect intent, and auto-dispatches ₹0-GST closing replies
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleCheckNow}
            disabled={checking}
            style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{checking ? '🔄 Checking IMAP...' : '📬 Check Inbox Now'}</span>
          </button>
        </div>
      </div>

      {checkResult && (
        <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '12px', marginBottom: '14px' }}>
          ✓ {checkResult}
        </div>
      )}

      {/* Grid of Listener Metrics */}
      <div className="flex gap-16 flex-wrap mb-18">
        <div className="glass-card flex-1" style={{ padding: '12px 16px', minWidth: '180px', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Monitored Account</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>
            vikaas2030@gmail.com
          </div>
        </div>

        <div className="glass-card flex-1" style={{ padding: '12px 16px', minWidth: '180px', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>IMAP Protocol & Security</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginTop: '2px' }}>
            imap.gmail.com:993 (TLS Encrypted)
          </div>
        </div>

        <div className="glass-card flex-1" style={{ padding: '12px 16px', minWidth: '180px', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Auto-Closing Policy</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b', marginTop: '2px' }}>
            100% All-Inclusive Net (₹0 Extra GST)
          </div>
        </div>
      </div>

      {/* Interactive 2-Way Closer Test Bench */}
      <div style={{ background: '#070712', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '10px' }}>
          🧪 Test 2-Way AI Client Intent & Auto-Response Simulator:
        </div>
        <form onSubmit={handleTestInboundCloser} className="flex gap-12 flex-wrap items-center">
          <input
            type="email"
            className="form-input flex-1"
            placeholder="Client Email (e.g. contact@parulmakeoverstudio.com)"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            style={{ minWidth: '220px', fontSize: '12px' }}
            required
          />
          <input
            type="text"
            className="form-input flex-2"
            placeholder='Client Question (e.g. "What are the total charges?" or "Send me a live demo link")'
            value={testQuery}
            onChange={e => setTestQuery(e.target.value)}
            style={{ minWidth: '280px', fontSize: '12px' }}
            required
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={processing}
            style={{ fontSize: '12px', minWidth: '140px' }}
          >
            {processing ? '⚡ AI Formulating...' : '🚀 Test Auto-Reply'}
          </button>
        </form>

        {autoReplyResult && (
          <div style={{ marginTop: '14px', padding: '12px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <div className="flex justify-between items-center mb-8">
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#818cf8' }}>
                Detected Intent: {autoReplyResult.intent}
              </span>
              <span className="badge badge-won" style={{ fontSize: '10px' }}>
                {autoReplyResult.emailSent ? 'Delivered via Google SMTP' : 'Formulated & Ready'}
              </span>
            </div>
            <pre style={{ fontSize: '11.5px', color: '#cbd5e1', whiteSpace: 'pre-wrap', background: '#0a0a16', padding: '10px', borderRadius: '6px', margin: 0, fontFamily: 'monospace' }}>
              {autoReplyResult.responseText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
