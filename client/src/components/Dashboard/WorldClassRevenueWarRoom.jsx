import React, { useState, useEffect } from 'react';

export default function WorldClassRevenueWarRoom({ onDealSettled }) {
  const [activeTab, setActiveTab] = useState('targets'); // 'targets' | 'quote' | 'certificate' | 'voice'
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  // Quote State
  const [quoteModules, setQuoteModules] = useState({
    aiBot: true,
    cineFlowVideo: true,
    whatsappApi: true,
    monthlyRetainer: false,
    prioritySla: true
  });
  const [quoteData, setQuoteData] = useState(null);

  // Certificate State
  const [selectedClientForCert, setSelectedClientForCert] = useState('');
  const [generatedCert, setGeneratedCert] = useState(null);

  // UTR Quick Settle Modal State
  const [settlingTarget, setSettlingTarget] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [settleAmount, setSettleAmount] = useState('999');
  const [isSettling, setIsSettling] = useState(false);
  const [settleMsg, setSettleMsg] = useState('');

  const fetchTargets = () => {
    fetch('/api/world-class/top-targets')
      .then(res => res.json())
      .then(data => {
        if (data.targets) setTargets(data.targets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateQuote = () => {
    fetch('/api/world-class/quote-calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteModules)
    })
      .then(res => res.json())
      .then(data => {
        if (data.breakdown) setQuoteData(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTargets();
    updateQuote();
  }, []);

  useEffect(() => {
    updateQuote();
  }, [quoteModules]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerateCert = (target) => {
    fetch('/api/world-class/generate-certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientCompany: target ? target.company : (selectedClientForCert || 'Enterprise Client'),
        clientName: target ? target.contactPerson : 'Business Leader',
        dealValue: target ? target.dealValue : 25000,
        dealId: target ? target.dealId : null
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.certificate) {
          setGeneratedCert(data.certificate);
          setActiveTab('certificate');
        }
      })
      .catch(() => {});
  };

  const handleQuickSettleWon = async () => {
    if (!utrInput.trim() || utrInput.trim().length < 6) {
      alert('Please enter a valid Bank UTR / Transaction Reference number (minimum 6 digits from PhonePe/GPay/Paytm).');
      return;
    }
    setIsSettling(true);
    try {
      const res = await fetch('/api/hyper-closer/settle-won', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: settlingTarget.dealId || settlingTarget.leadId,
          utrNumber: utrInput.trim(),
          amount: parseFloat(settleAmount) || 999,
          paymentMethod: 'UPI Instant Bank Settlement (PhonePe / GPay)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettleMsg(`🎉 Verified bank settlement recorded! Deal marked WON.`);
        setTimeout(() => {
          setSettlingTarget(null);
          setUtrInput('');
          setSettleMsg('');
          fetchTargets();
          if (onDealSettled) onDealSettled();
        }, 2000);
      } else {
        alert(data.message || 'Settlement failed.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="glass-card mb-24" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Executive War Room Header */}
      <div className="flex justify-between items-center flex-wrap gap-16 mb-20 pb-16" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div>
          <div className="flex items-center gap-10">
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: 900,
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px'
            }}>
              ⚡ WORLD-CLASS REVENUE WAR ROOM
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
              ● 100% REAL SETTLEMENT (ZERO-FAKE RAIL)
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '6px' }}>
            Apex Conversion Engine & High-Velocity Closer
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            Authorized Settlement: <strong style={{ color: '#10b981' }}>UPI 9690973030@ibl</strong> (Vikas Singh) • Section 22 MSME Exemption • 14-Day 100% Escrow
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-8 flex-wrap">
          {[
            { id: 'targets', label: '🎯 Top 10 Closers Today', icon: '⚡' },
            { id: 'quote', label: '📊 Interactive Quote Calc', icon: '💳' },
            { id: 'certificate', label: '🛡️ Escrow Guarantee Cert', icon: '📜' },
            { id: 'voice', label: '🎙️ WhatsApp Voice Script', icon: '📢' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#1e293b',
                color: activeTab === tab.id ? '#000' : '#cbd5e1',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Top 10 High-Velocity Targets */}
      {activeTab === 'targets' && (
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Ranked by Contact Readiness, High-Margin Industry, and ₹999 Advance Token Conversion:</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{targets.length} Priority Leads Loaded</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Calculating AI Propensity & Velocity Radar...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', height: '36px' }}>
                    <th style={{ padding: '8px 10px' }}>Rank & Company</th>
                    <th style={{ padding: '8px 10px' }}>City & Industry</th>
                    <th style={{ padding: '8px 10px' }}>Velocity Score</th>
                    <th style={{ padding: '8px 10px' }}>Advance Token</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>1-Click Rapid Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map((target, idx) => (
                    <tr key={target.leadId || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', height: '54px' }}>
                      <td style={{ padding: '10px' }}>
                        <div className="flex items-center gap-8">
                          <span style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: idx < 3 ? '#10b981' : '#334155',
                            color: idx < 3 ? '#000' : '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}>
                            {idx + 1}
                          </span>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#fff' }}>{target.company}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Contact: {target.contactPerson}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '10px' }}>
                        <div style={{ color: '#38bdf8' }}>📍 {target.city}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{target.industry}</div>
                      </td>

                      <td style={{ padding: '10px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: target.velocityScore >= 85 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: target.velocityScore >= 85 ? '#f87171' : '#fbbf24',
                          fontWeight: 'bold',
                          fontSize: '11px'
                        }}>
                          🔥 {target.velocityScore}% Velocity
                        </span>
                      </td>

                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 'bold', color: '#10b981' }}>₹{target.advanceToken}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>100% Refundable</div>
                      </td>

                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <div className="flex gap-6 justify-end flex-wrap">
                          {target.cleanPhone && (
                            <a
                              href={`https://wa.me/${target.cleanPhone}?text=${encodeURIComponent(target.waPitch)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                background: '#25D366',
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '11px',
                                textDecoration: 'none'
                              }}>
                              💬 WhatsApp
                            </a>
                          )}

                          <a
                            href={target.prototypeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              border: '1px solid rgba(56, 189, 248, 0.3)'
                            }}>
                            ⚡ Demo
                          </a>

                          <button
                            onClick={() => handleGenerateCert(target)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: '#a5b4fc',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                              cursor: 'pointer'
                            }}>
                            🛡️ Cert
                          </button>

                          <button
                            onClick={() => {
                              setSettlingTarget(target);
                              setSettleAmount('999');
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#000',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              border: 'none',
                              cursor: 'pointer'
                            }}>
                            🏦 Settle WON
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive Dynamic Quote & Scope Calculator */}
      {activeTab === 'quote' && quoteData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Module Selector */}
          <div style={{ background: '#0b1120', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>
              🎛️ Select Deliverable Modules for Prospect:
            </h4>
            {[
              { key: 'aiBot', name: '24/7 AI Customer Booking Assistant Bot', price: '₹7,000' },
              { key: 'cineFlowVideo', name: '4K CineFlow Cinematic Brand Video Commercial', price: '₹5,000' },
              { key: 'whatsappApi', name: 'Official WhatsApp Cloud API & Template Messaging', price: '₹4,000' },
              { key: 'monthlyRetainer', name: 'Monthly Dedicated Uptime & AI Token Retainer', price: '₹2,500/mo' },
              { key: 'prioritySla', name: 'Priority 2-Hour Rapid Revision SLA Warranty', price: '₹1,500' }
            ].map(mod => (
              <label key={mod.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={quoteModules[mod.key]}
                    onChange={e => setQuoteModules({ ...quoteModules, [mod.key]: e.target.checked })}
                  />
                  <span style={{ fontSize: '12.5px', color: '#e2e8f0' }}>{mod.name}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{mod.price}</span>
              </label>
            ))}
          </div>

          {/* Real-Time Price & Instant UPI PayLink */}
          <div style={{ background: '#0b1120', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
              ⚡ Real-Time Commercial Quote
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '8px 0' }}>
              ₹{quoteData.breakdown.totalNet.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
              Includes 10% Section 22 MSME Net-Zero Tax Exemption (-₹{quoteData.breakdown.msmeExemptionDiscount})
            </div>

            <div style={{ display: 'inline-block', background: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
              <img src={quoteData.settlementRail.tokenQr} alt="UPI QR" style={{ width: '160px', height: '160px', display: 'block' }} />
            </div>

            <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>
              100% Refundable Kickstart Token: <strong style={{ color: '#10b981' }}>₹{quoteData.breakdown.kickstartToken}</strong>
            </div>

            <div className="flex justify-center gap-8">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => copyToClipboard(quoteData.settlementRail.upiId, 'quoteUpi')}
                style={{ fontSize: '11px' }}>
                {copiedKey === 'quoteUpi' ? '✓ Copied' : '📋 Copy UPI ID'}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => copyToClipboard(quoteData.settlementRail.upiIntentToken, 'quoteIntent')}
                style={{ fontSize: '11px', background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                {copiedKey === 'quoteIntent' ? '✓ Intent Copied' : '⚡ Copy UPI Intent Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Verifiable Cryptographic Assurance Certificate */}
      {activeTab === 'certificate' && (
        <div style={{ background: '#0b1120', padding: '24px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          {generatedCert ? (
            <div>
              <div className="flex justify-between items-center mb-16 flex-wrap gap-12" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    INSTITUTIONAL ZERO-RISK ASSURANCE CERTIFICATE
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                    {generatedCert.certificateId}
                  </h3>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => copyToClipboard(JSON.stringify(generatedCert, null, 2), 'certJson')}
                  style={{ background: '#6366f1', color: '#fff', fontSize: '11px' }}>
                  {copiedKey === 'certJson' ? '✓ Certificate Copied' : '📋 Copy Certificate'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16" style={{ fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Issued To:</span>
                  <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>{generatedCert.issuedTo}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Managing Principal:</span>
                  <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '13px' }}>{generatedCert.signatory}</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Settlement Rail:</span>
                  <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '13px' }}>UPI: {generatedCert.settlementRail}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: '8px', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
                <strong>🛡️ 14-Day 100% Escrow Guarantee Clause:</strong><br />
                {generatedCert.guaranteePledge}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '14px' }}>
                Generate an official verifiable Guarantee Certificate for any client to eliminate fear and accelerate conversion:
              </p>
              <div className="flex justify-center gap-10">
                <input
                  type="text"
                  placeholder="Enter Business / Company Name..."
                  value={selectedClientForCert}
                  onChange={e => setSelectedClientForCert(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#131b2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    minWidth: '260px'
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleGenerateCert(null)}
                  style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                  Issue Official Certificate ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WhatsApp 30-Sec Voice Script */}
      {activeTab === 'voice' && (
        <div style={{ background: '#0b1120', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
            🎙️ High-Converting 30-Second WhatsApp Voice Note Script
          </h4>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
            When prospective business owners receive an authentic personalized voice note from Founder Vikas Singh, closing rates increase by 350%:
          </p>

          <div style={{ background: '#131b2e', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981', color: '#f1f5f9', fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '16px' }}>
            "Namaste ji, main Vikas Singh baat kar raha hoon ORION FLUX se. Humne aapke brand ke liye ek custom 24/7 client booking bot banaya hai jo humne aapke WhatsApp par share kiya hai. Agar aap chahein to sirf ₹999 ke 100% refundable token par ise 14 din live chala kar dekh sakte hain. Check kijiye aur batayein!"
          </div>

          <div className="flex gap-10">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copyToClipboard(`"Namaste ji, main Vikas Singh baat kar raha hoon ORION FLUX se. Humne aapke brand ke liye ek custom 24/7 client booking bot banaya hai jo humne aapke WhatsApp par share kiya hai. Agar aap chahein to sirf ₹999 ke 100% refundable token par ise 14 din live chala kar dekh sakte hain. Check kijiye aur batayein!"`, 'voiceText')}>
              {copiedKey === 'voiceText' ? '✓ Script Copied' : '📋 Copy Voice Script'}
            </button>
          </div>
        </div>
      )}

      {/* UTR Settlement Modal */}
      {settlingTarget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #10b981',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
              🏦 Instant Bank UTR Settlement
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Confirm verified bank receipt for <strong>{settlingTarget.company}</strong> onto settlement rail UPI <strong style={{ color: '#10b981' }}>9690973030@ibl</strong>:
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Received Amount (INR):
              </label>
              <input
                type="number"
                value={settleAmount}
                onChange={e => setSettleAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Bank UTR / Transaction Reference (Min 6 chars from PhonePe/GPay/Paytm):
              </label>
              <input
                type="text"
                placeholder="e.g. 432109876543 or UPI-REF-12345"
                value={utrInput}
                onChange={e => setUtrInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}
              />
            </div>

            {settleMsg && (
              <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', fontWeight: 'bold' }}>
                {settleMsg}
              </div>
            )}

            <div className="flex justify-end gap-10">
              <button
                type="button"
                onClick={() => setSettlingTarget(null)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: '#334155',
                  color: '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickSettleWon}
                disabled={isSettling}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                {isSettling ? 'Verifying...' : '✓ Confirm & Mark WON'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
