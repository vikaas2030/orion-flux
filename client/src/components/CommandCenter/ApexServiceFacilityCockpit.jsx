import React, { useState, useEffect } from 'react';

export default function ApexServiceFacilityCockpit() {
  const [activeTab, setActiveTab] = useState('mvp_generator'); // 'mvp_generator' | 'vip_facilities' | 'turnkey_kits'
  const [catalog, setCatalog] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // MVP Generator State
  const [industry, setIndustry] = useState('healthcare');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customReq, setCustomReq] = useState('');
  const [generatedSolution, setGeneratedSolution] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch('/api/apex-services/catalog')
      .then(r => r.json())
      .then(d => { if (d.success) setCatalog(d); })
      .catch(() => {});

    fetch('/api/apex-services/metrics')
      .then(r => r.json())
      .then(d => { if (d.success) setMetrics(d.metrics); })
      .catch(() => {});
  }, []);

  const handleGenerateSolution = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/apex-services/generate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          clientName: clientName || 'Enterprise Partner',
          clientPhone,
          customRequirement: customReq
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedSolution(data.solution);
      }
    } catch (err) {
      alert('Error generating solution: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="glass-card mb-24" style={{
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      borderRadius: '18px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-16 mb-20">
        <div>
          <div className="flex items-center gap-10 flex-wrap">
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: 900,
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px'
            }}>
              💎 BEST SERVICES & ENTERPRISE FACILITIES
            </span>
            <span className="badge badge-won" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid #6366f1' }}>
              ⚡ 60-SEC AI MVP ENGINE
            </span>
            <span className="badge badge-won" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981' }}>
              🛡️ 100% CLIENT SATISFACTION BOND
            </span>
          </div>
          <h2 className="text-xl font-bold mt-8" style={{ fontSize: '22px', letterSpacing: '-0.5px', color: '#fff' }}>
            Apex High-Income Services & VIP Facilities Hub
          </h2>
          <p className="text-sm text-tertiary mt-2">
            Deliver bespoke enterprise AI MVPs in 60 seconds, offer ₹79,999/mo VIP retainers, and collect instant 10% token settlements via UPI <strong style={{ color: '#10b981' }}>9690973030@ibl</strong>.
          </p>
        </div>

        {/* Live Metrics Quick Strip */}
        <div className="flex items-center gap-12 flex-wrap">
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>SLA UPTIME & QUALITY</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
              {metrics?.overallServiceUptimeSLA || '99.98%'}
            </div>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>ACTIVE SUBSCRIBERS</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#818cf8' }}>
              {metrics?.activeConciergeSubscribers || 4} VIP Clients
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Mode Switcher Tabs */}
      <div className="flex gap-8 mb-20 p-4" style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'inline-flex',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('mvp_generator')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'mvp_generator' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
            color: activeTab === 'mvp_generator' ? '#000' : '#94a3b8',
            transition: 'all 0.2s ease'
          }}>
          ⚡ 60-Sec AI Solution Generator
        </button>
        <button
          onClick={() => setActiveTab('vip_facilities')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'vip_facilities' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
            color: activeTab === 'vip_facilities' ? '#fff' : '#94a3b8',
            transition: 'all 0.2s ease'
          }}>
          🛡️ VIP Retainers & 24/7 SLA Concierge
        </button>
        <button
          onClick={() => setActiveTab('turnkey_kits')}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'turnkey_kits' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
            color: activeTab === 'turnkey_kits' ? '#000' : '#94a3b8',
            transition: 'all 0.2s ease'
          }}>
          📦 Ready Turnkey Kits (Instant Cash)
        </button>
      </div>

      {/* TAB 1: 60-SEC AI MVP GENERATOR */}
      {activeTab === 'mvp_generator' && (
        <div className="grid grid-2 gap-20">
          {/* Input Form */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 className="font-bold text-sm mb-12" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span> Configure Client Solution & Instant Quotation
            </h3>
            <form onSubmit={handleGenerateSolution} className="space-y-12">
              <div>
                <label className="text-xs text-secondary font-medium block mb-4">Target Industry / Domain</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}>
                  <option value="healthcare">🏥 Healthcare (OPD, Clinic, Patient WhatsApp Booking)</option>
                  <option value="realestate">🏢 Real Estate (Lead Qualifier, Virtual Tour Portal)</option>
                  <option value="ecommerce">🛍️ E-Commerce (Cart Recovery, WhatsApp COD Agent)</option>
                  <option value="legal">⚖️ Legal & Corporate (Contract SOW & NDA Generator)</option>
                  <option value="localbusiness">🏬 Local Services (Gyms, Salons, Hyper-Booking OS)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-4">Client / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Hospital or Skyline Properties"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-4">Client WhatsApp Phone / Email</label>
                <input
                  type="text"
                  placeholder="+91 98XXXXXXXX or director@company.com"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-4">Custom Specific Needs (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Needs Hindi voice integration, 2-day delivery, direct CRM sync..."
                  value={customReq}
                  onChange={e => setCustomReq(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#12121a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}>
                {loading ? '⚡ Generating Solution Architecture...' : '⚡ Generate 60-Sec MVP & Token Invoice'}
              </button>
            </form>
          </div>

          {/* Generated Solution Preview & Quotation */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <h3 className="font-bold text-sm mb-12" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#10b981' }}>📜 Official Solution Blueprint & SOW</span>
              {generatedSolution && (
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                  REF: {generatedSolution.quoteId}
                </span>
              )}
            </h3>

            {generatedSolution ? (
              <div className="space-y-12">
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderLeft: '4px solid #10b981'
                }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>
                    {generatedSolution.solutionTitle}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Client: <strong style={{ color: '#fff' }}>{generatedSolution.clientName}</strong> | Delivery: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{generatedSolution.deliveryTimeline}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Core Architecture & Deliverables:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1' }} className="space-y-4">
                    {generatedSolution.features.map((f, i) => (
                      <li key={i}>✅ {f}</li>
                    ))}
                  </ul>
                </div>

                {/* Commercials & Token Settlement */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '14px',
                  borderRadius: '10px'
                }}>
                  <div className="flex justify-between items-center mb-8">
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Project Scope:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                      ₹{generatedSolution.commercialTerms.totalProjectCostINR.toLocaleString()} INR
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-12">
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold' }}>Fast-Track Token Deposit (10%):</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                      ₹{generatedSolution.commercialTerms.tokenDepositRequiredINR.toLocaleString()} INR
                    </span>
                  </div>

                  <div className="flex gap-8 flex-wrap">
                    <a
                      href={generatedSolution.commercialTerms.settlementRail.payLink}
                      className="btn"
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textAlign: 'center',
                        textDecoration: 'none'
                      }}>
                      ⚡ Instant UPI Token Pay
                    </a>
                    <button
                      onClick={() => copyToClipboard(`*Fast-Track Project Scope for ${generatedSolution.clientName}*\n\nSolution: ${generatedSolution.solutionTitle}\nDelivery Timeline: ${generatedSolution.deliveryTimeline}\nScope Total: ₹${generatedSolution.commercialTerms.totalProjectCostINR.toLocaleString()} INR\nToken to Kickstart: ₹${generatedSolution.commercialTerms.tokenDepositRequiredINR.toLocaleString()} INR\n\nOfficial Settlement Rail (Vikas Singh):\nUPI ID: 9690973030@ibl\nPayment Link: ${generatedSolution.commercialTerms.settlementRail.payLink}`)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '12px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer'
                      }}>
                      {copiedLink ? '✓ Copied SOW!' : '📋 Copy SOW for WhatsApp'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💡</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#94a3b8' }}>No Solution Generated Yet</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Select an industry on the left and click "Generate 60-Sec MVP" to produce a complete architecture blueprint, delivery timeline, and instant token deposit link.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VIP RETAINER CONCIERGE & 24/7 SLA FACILITIES */}
      {activeTab === 'vip_facilities' && (
        <div>
          <div className="grid grid-3 gap-16 mb-20">
            {(catalog?.vipFacilities || []).map(fac => (
              <div key={fac.id} style={{
                background: fac.isPopular ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'rgba(0, 0, 0, 0.35)',
                border: fac.isPopular ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                {fac.isPopular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ★ MOST POPULAR GROWTH
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{fac.tierName}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 14px' }}>{fac.description}</div>
                  
                  <div style={{ margin: '14px 0' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      ₹{fac.priceMonthlyINR.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}> / month</span>
                  </div>

                  <div style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '14px'
                  }}>
                    ⏱️ Guaranteed SLA: &lt; {fac.slaResponseHours >= 1 ? `${fac.slaResponseHours} Hours` : '15 Minutes'}
                  </div>

                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#cbd5e1' }} className="space-y-4">
                    {fac.servicesIncluded.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-20">
                  <a
                    href={`https://wa.me/919690973030?text=${encodeURIComponent(`Hi Vikas, I would like to activate the ${fac.tierName} (₹${fac.priceMonthlyINR.toLocaleString()}/mo) for my company. Please provide onboarding details.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: fac.isPopular ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#1e293b',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                    ⚡ Activate VIP Retainer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TURNKEY READY KITS */}
      {activeTab === 'turnkey_kits' && (
        <div>
          <div className="grid grid-2 gap-16">
            {(catalog?.turnkeyKits || []).map(kit => (
              <div key={kit.id} style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {kit.category}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      📦 {kit.deliveryTime}
                    </span>
                  </div>

                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
                    {kit.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                    {kit.description}
                  </div>

                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '12px'
                  }}>
                    ₹{kit.priceINR.toLocaleString()} INR <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>(One-time Commercial License)</span>
                  </div>

                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#cbd5e1' }} className="space-y-4">
                    {kit.features.map((f, i) => (
                      <li key={i}>⚡ {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-16 flex gap-8">
                  <a
                    href={`upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh&am=${kit.priceINR}&cu=INR&tn=${encodeURIComponent(`License ${kit.id}`)}`}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textAlign: 'center',
                      textDecoration: 'none'
                    }}>
                    ⚡ Buy with UPI (₹{kit.priceINR})
                  </a>
                  <a
                    href={`https://wa.me/919690973030?text=${encodeURIComponent(`Hi Vikas, I want to purchase the "${kit.title}" for ₹${kit.priceINR}. Please share the code repository access.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      color: '#fff',
                      fontSize: '12px',
                      textAlign: 'center',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                    💬 WhatsApp Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div style={{
        marginTop: '20px',
        padding: '12px 18px',
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div className="flex items-center gap-10">
          <span style={{ fontSize: '18px' }}>🏛️</span>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            All facilities & services guaranteed by Founder <strong style={{ color: '#fff' }}>Vikas Singh</strong> | Real Settlement Rail: <strong style={{ color: '#10b981' }}>9690973030@ibl</strong> (PhonePe / GPay / Paytm)
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
          🔒 100% MONEY-BACK SATISFACTION BOND
        </div>
      </div>
    </div>
  );
}
