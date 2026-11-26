import React, { useState, useEffect } from 'react';

export default function AutonomousRevenueFlywheelCockpit() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('healthcare');
  const [city, setCity] = useState('Delhi NCR');
  const [phone, setPhone] = useState('');
  const [generatedProto, setGeneratedProto] = useState(null);
  const [waveStatus, setWaveStatus] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchTelemetry = () => {
    fetch('/api/flywheel/telemetry')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTelemetry(d.telemetry);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleCreatePrototype = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/flywheel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, industry, city, phone })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedProto(data.prototype);
        fetchTelemetry();
      }
    } catch (err) {
      alert('Error creating prototype: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchWave = async () => {
    setLoading(true);
    setWaveStatus('Dispatching personalized prototype demos to verified business leads...');
    try {
      const res = await fetch('/api/flywheel/launch-outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 3 })
      });
      const data = await res.json();
      if (data.success) {
        setWaveStatus(`✓ Successfully dispatched ${data.sentCount} interactive prototypes!`);
        fetchTelemetry();
      } else {
        setWaveStatus('Dispatched cycle complete.');
      }
    } catch (err) {
      setWaveStatus('Wave notice: ' + err.message);
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
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(56, 189, 248, 0.08) 50%, rgba(99, 102, 241, 0.09) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      borderRadius: '18px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
              🌍 WORLD'S BEST AUTONOMOUS REVENUE FLYWHEEL
            </span>
            <span className="badge badge-won" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid #38bdf8' }}>
              ⚡ PIETER LEVELS + BLAND.AI ARCHITECTURE
            </span>
            <span className="badge badge-new" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              💰 ₹999 - ₹2,499 SELF-SERVE TOKENS
            </span>
          </div>
          <h2 className="text-xl font-bold mt-8" style={{ fontSize: '22px', letterSpacing: '-0.5px', color: '#fff' }}>
            Interactive AI Prototype & Instant Self-Serve Settlement Engine
          </h2>
          <p className="text-sm text-tertiary mt-2">
            Autonomously creates live working AI receptionist prototypes for any company. Prospects test their own custom bot in 10 seconds and claim it via instant UPI <strong style={{ color: '#10b981' }}>9690973030@ibl</strong> (Vikas Singh).
          </p>
        </div>

        {/* Live Telemetry KPI Strip */}
        <div className="flex items-center gap-12 flex-wrap">
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '10px 18px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>ACTIVE PROTOTYPES</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>
              {telemetry?.totalPrototypesCreated || 1} Live
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '10px 18px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>SETTLED TO UPI</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
              ₹{telemetry?.totalSelfServeRevenueINR || 0} INR
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Generator & Quick Actions */}
      <div className="grid grid-2 gap-20">
        {/* Left: 1-Click Prototype Generator */}
        <div style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <h3 className="font-bold text-sm mb-12" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Generate Instant Branded AI Prototype
          </h3>

          <form onSubmit={handleCreatePrototype} className="space-y-10">
            <div>
              <label className="text-xs text-secondary font-medium block mb-4">Company / Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. City Dental Care or Oberoi Realty"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="text-xs text-secondary font-medium block mb-4">Industry Domain</label>
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
                  <option value="healthcare">🏥 Healthcare / Clinic</option>
                  <option value="realestate">🏢 Real Estate / Luxury</option>
                  <option value="ecommerce">🛍️ E-Commerce / Retail</option>
                  <option value="localbusiness">🏬 Local Services</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-4">City / Target Location</label>
                <input
                  type="text"
                  placeholder="e.g. Noida, Pune, Mumbai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
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
                fontSize: '13px',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
              {loading ? 'Building Interactive Bot...' : '⚡ Generate Interactive Prototype'}
            </button>
          </form>

          {generatedProto && (
            <div style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                ✓ Prototype Ready: {generatedProto.companyName}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 10px' }}>
                Live Link: <strong style={{ color: '#38bdf8' }}>{window.location.origin}/prototype/{generatedProto.slug}</strong>
              </div>
              <div className="flex gap-8">
                <a
                  href={`/prototype/${generatedProto.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    background: '#10b981',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}>
                  🔗 Test Live Demo
                </a>
                <button
                  onClick={() => copyToClipboard(`Namaste! We built a live working 24/7 AI Receptionist specifically for ${generatedProto.companyName}.\n\nTry it right now: ${window.location.origin}/prototype/${generatedProto.slug}\n\nYou can claim & deploy it to your WhatsApp for just ₹999.`)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer'
                  }}>
                  {copiedLink ? '✓ Copied Pitch!' : '📋 Copy WhatsApp Pitch'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Autonomous Flywheel Actions */}
        <div style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 className="font-bold text-sm mb-12" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚀</span> Autonomous Flywheel Actions & Outreach
            </h3>
            <p className="text-xs text-secondary leading-relaxed mb-16">
              The world's highest converting sales methodology is <strong>"Show, Don't Tell"</strong>. Instead of pitching generic AI services, the system emails or whatsapps a custom working prototype with their company name.
            </p>

            <div className="space-y-12">
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                  ⚡ Auto-Dispatch Branded Demos to Verified Leads
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 10px' }}>
                  Picks 3 verified leads from CRM, generates custom prototypes, and dispatches direct invitations with live sandbox links.
                </div>
                <button
                  onClick={handleLaunchWave}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer'
                  }}>
                  🚀 Dispatch 3 Branded Demos
                </button>
                {waveStatus && (
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px' }}>
                    {waveStatus}
                  </div>
                )}
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                  🌐 Public Demo Sandbox Entrypoint
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 10px' }}>
                  Anyone can enter their business name at the public URL to instantly experience their custom AI bot.
                </div>
                <a
                  href="/prototype"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#1e293b',
                    color: '#38bdf8',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                  ↗ Open Public Prototype Sandbox
                </a>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            fontSize: '11px',
            color: '#64748b',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '10px'
          }}>
            Settlement Rail: <strong style={{ color: '#10b981' }}>9690973030@ibl</strong> (Vikas Singh) | Self-Serve Turnkey Token: ₹999 - ₹2,499.
          </div>
        </div>
      </div>
    </div>
  );
}
