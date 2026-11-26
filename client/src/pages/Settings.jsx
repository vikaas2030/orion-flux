import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [appName, setAppName] = useState('ORION FLUX');
  const [currency, setCurrency] = useState('INR');
  const [gmailUser, setGmailUser] = useState('');
  const [gmailPass, setGmailPass] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [upiId, setUpiId] = useState('9690973030@ibl');
  const [upiName, setUpiName] = useState('Orion Flux Super Agent');
  const [paypalEmail, setPaypalEmail] = useState('payments@orionflux.agency');
  const [savedMsg, setSavedMsg] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          const s = data.settings;
          if (s.app_name) setAppName(s.app_name);
          if (s.currency) setCurrency(s.currency);
          if (s.gmail_user) setGmailUser(s.gmail_user);
          if (s.gmail_pass || s.gmail_app_password) setGmailPass(s.gmail_pass || s.gmail_app_password);
          if (s.gemini_key) setGeminiKey(s.gemini_key);
          if (s.upi_id) setUpiId(s.upi_id);
          if (s.upi_name) setUpiName(s.upi_name);
          if (s.paypal_email) setPaypalEmail(s.paypal_email);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const payload = {
      app_name: appName,
      currency: currency,
      gmail_user: gmailUser,
      gmail_pass: gmailPass,
      gmail_app_password: gmailPass,
      gemini_key: geminiKey,
      upi_id: upiId,
      upi_name: upiName,
      paypal_email: paypalEmail
    };

    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        setSavedMsg('✅ All settings, Gmail credentials & UPI IDs saved successfully!');
        setTimeout(() => setSavedMsg(''), 4000);
      })
      .catch(() => {
        setSavedMsg('❌ Error saving settings');
      });
  };

  const handleTestEmail = () => {
    setTestingEmail(true);
    setTestEmailResult('');

    // First auto-save the current credentials
    const payload = {
      gmail_user: gmailUser,
      gmail_pass: gmailPass,
      gmail_app_password: gmailPass
    };

    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        return fetch('/api/settings/test-email', { method: 'POST' });
      })
      .then(res => res.json())
      .then(data => {
        setTestingEmail(false);
        setTestEmailResult(data.message);
      })
      .catch(err => {
        setTestingEmail(false);
        setTestEmailResult('❌ Connection error: ' + err.message);
      });
  };

  return (
    <div className="settings-page animate-in">
      <div className="mb-20">
        <h2 className="text-xl font-bold">System Configuration & Integrations Center</h2>
        <p className="text-sm text-tertiary">Configure agency details, automated Gmail SMTP outreach, and instant client UPI / PayPal rails.</p>
      </div>

      {savedMsg && (
        <div style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-sm)',
          background: savedMsg.includes('✅') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: savedMsg.includes('✅') ? '#34d399' : '#f87171',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          {savedMsg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* 1. Branding */}
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-16">1. General Agency Branding</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Platform Name</label>
              <input type="text" className="form-input" value={appName} onChange={e => setAppName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Default Currency</label>
              <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Client Payment Gateway (UPI & PayPal) */}
        <div className="glass-card mb-24" style={{ padding: '24px', borderLeft: '4px solid var(--accent-green)' }}>
          <h3 className="font-bold mb-16 flex items-center gap-8">
            💳 2. Real Client Payment Gateway (Direct Bank UPI & PayPal)
          </h3>
          <p className="text-sm text-tertiary mb-16">
            Invoices and proposals will embed this exact UPI ID and QR code. All client advance payments and tokens arrive directly in your bank account with 0% gateway commission.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">UPI ID (VPA) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 9690973030@ibl"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Linked to your Google Pay / PhonePe / BHIM Bank Account</span>
            </div>
            <div className="form-group">
              <label className="form-label">Payee / Account Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Orion Flux Agency"
                value={upiName}
                onChange={e => setUpiName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">PayPal Email or Username (for International Clients)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. payments@orionflux.agency"
              value={paypalEmail}
              onChange={e => setPaypalEmail(e.target.value)}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>For international clients in USA, UK, UAE to pay in USD/EUR</span>
          </div>
        </div>

        {/* 3. Gmail SMTP Setup (with direct Google App Password link) */}
        <div className="glass-card mb-24" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
          <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
            <div>
              <h3 className="font-bold flex items-center gap-8">
                ✉️ 3. Automated Email Outreach (Gmail SMTP)
              </h3>
              <p className="text-sm text-tertiary mt-4">
                Enables ORION FLUX to autonomously send proposals and 4-touch follow-ups directly from your Gmail.
              </p>
            </div>
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.25) 100%)',
                borderColor: '#3b82f6',
                color: '#60a5fa',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔑 Open Google App Passwords ↗
            </a>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '16px',
            fontSize: '12px',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: '#93c5fd' }}>📌 How to get your 16-character Google App Password in 60 seconds:</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '6px', color: 'var(--text-secondary)' }}>
              <li>Click the blue <strong>"Open Google App Passwords ↗"</strong> button above (or visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>myaccount.google.com/apppasswords</a>).</li>
              <li>Sign in to your Google Account (ensure 2-Step Verification is turned ON).</li>
              <li>Under "App name", type <strong>ORION FLUX</strong> and click <strong>Create</strong>.</li>
              <li>Google will display a <strong>16-letter password</strong> (e.g., <code>abcd efgh ijkl mnop</code>). Copy and paste it below!</li>
            </ol>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Your Gmail Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="yourbusiness@gmail.com"
                value={gmailUser}
                onChange={e => setGmailUser(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gmail App Password (16 Letters) *</label>
              <input
                type="password"
                className="form-input"
                placeholder="xxxx xxxx xxxx xxxx"
                value={gmailPass}
                onChange={e => setGmailPass(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-8 items-center mt-12 flex-wrap">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={testingEmail || !gmailUser || !gmailPass}
              onClick={handleTestEmail}
              style={{ fontWeight: 'bold' }}
            >
              {testingEmail ? '⏳ Testing Connection...' : '🧪 Test Gmail Connection Now'}
            </button>

            {testEmailResult && (
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: testEmailResult.includes('✅') ? '#34d399' : '#f87171'
              }}>
                {testEmailResult}
              </span>
            )}
          </div>
        </div>

        {/* 4. Gemini AI Key */}
        <div className="glass-card mb-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-16">4. Free AI Cognitive Engine (Google Gemini API)</h3>
          <div className="form-group">
            <label className="form-label">Gemini API Key</label>
            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
            />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            💡 Get 100% Free Gemini API key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>aistudio.google.com</a>.
          </p>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', fontSize: '15px' }}>
          💾 Save All Configurations & Payment Rails
        </button>
      </form>
    </div>
  );
}
