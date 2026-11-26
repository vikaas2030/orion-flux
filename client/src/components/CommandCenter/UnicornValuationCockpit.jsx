import React, { useState, useEffect } from 'react';

export default function UnicornValuationCockpit() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployForm, setDeployForm] = useState({
    productId: 'apex_vox',
    clientName: '',
    clientEmail: '',
    currency: 'USD'
  });
  const [deployAlert, setDeployAlert] = useState('');

  const fetchMetrics = () => {
    fetch('/api/unicorn/metrics')
      .then(r => r.json())
      .then(d => {
        if (d.success) setMetrics(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeployTenant = (e) => {
    e.preventDefault();
    if (!deployForm.clientName) return;

    fetch('/api/unicorn/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deployForm)
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setDeployAlert(`✅ Micro-SaaS Provisioned: ${res.tenant.clientName} (${res.tenant.apiAccessKey.slice(0, 16)}...)`);
          setShowDeployModal(false);
          setDeployForm({ productId: 'apex_vox', clientName: '', clientEmail: '', currency: 'USD' });
          fetchMetrics();
          setTimeout(() => setDeployAlert(''), 6000);
        }
      });
  };

  if (!metrics) return null;

  return (
    <div className="glass-card mb-24 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #070913 0%, #030408 100%)',
      border: '1px solid rgba(234, 179, 8, 0.4)',
      boxShadow: '0 8px 36px rgba(234, 179, 8, 0.15)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '26px',
            background: 'rgba(234, 179, 8, 0.15)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(234, 179, 8, 0.4)'
          }}>
            🦄
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#fef08a', letterSpacing: '-0.3px' }}>
                $1 Billion Sovereign Autonomous AI Unicorn Cockpit
              </h3>
              <span style={{
                fontSize: '11px',
                background: 'rgba(234, 179, 8, 0.2)',
                color: '#facc15',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                fontWeight: '700'
              }}>
                TARGET: $1,000,000,000 USD
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Real-time enterprise valuation, AI SaaS multiple expansion & multi-tenant micro-SaaS cashflow fleet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={() => setShowDeployModal(true)}
            className="btn btn-primary"
            style={{
              fontSize: '12px',
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
              color: '#000',
              fontWeight: '800',
              boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)'
            }}
          >
            ⚡ Deploy Micro-SaaS Tenant
          </button>
        </div>
      </div>

      {deployAlert && (
        <div className="mb-14 p-10 animate-in" style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          color: '#4ade80',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {deployAlert}
        </div>
      )}

      {/* Primary Valuation Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)',
        padding: '18px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(234, 179, 8, 0.3)',
        marginBottom: '18px'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-16 mb-12">
          <div>
            <div style={{ fontSize: '11px', color: '#facc15', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
              Current Sovereign Enterprise Valuation
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
              {metrics.currentValuationFormattedUSD}
              <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500', marginLeft: '10px' }}>
                ({metrics.currentValuationFormattedINR})
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>SaaS ARR Multiple</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>
              {metrics.saasMultiple}
            </div>
            <div style={{ fontSize: '11px', color: '#4ade80' }}>Rule of 40: {metrics.unitEconomics.ruleOf40Score}</div>
          </div>
        </div>

        {/* Progress Bar to $1 Billion */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
            <span style={{ color: '#cbd5e1' }}>
              Progress to <strong>$1,000,000,000 USD (Sovereign Unicorn)</strong>
            </span>
            <span style={{ color: '#facc15', fontWeight: 'bold' }}>
              {metrics.progressToUnicornPct}% Scaled
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.max(1, Math.min(100, metrics.progressToUnicornPct * 20))}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #eab308 0%, #facc15 50%, #38bdf8 100%)',
              borderRadius: '5px',
              transition: 'width 0.8s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Unit Economics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '10px',
        marginBottom: '18px'
      }}>
        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Combined ARR</div>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#4ade80' }}>{metrics.totalARR_Formatted.split(' /')[0]}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>{metrics.totalMRR_Formatted}</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Gross Margin</div>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8' }}>{metrics.unitEconomics.grossMargin}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Pure AI Software Infrastructure</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>LTV : CAC Efficiency</div>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#a855f7' }}>{metrics.unitEconomics.ltvCacRatio.split(' ')[0]}</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>World-Class Capital ROI</div>
        </div>

        <div style={{ background: '#090d16', padding: '12px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Micro-SaaS Fleet</div>
          <div style={{ fontSize: '17px', fontWeight: '800', color: '#f59e0b' }}>{metrics.activeMicroSaaSTenants} Active Tenants</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Across 4 Micro-Products</div>
        </div>
      </div>

      {/* Micro-SaaS Product Fleet Cards */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
          🚀 Multi-Tenant Micro-SaaS Product Fleet (Autonomous Global Self-Serve Engine)
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}>
          {metrics.fleetProducts?.map(p => (
            <div key={p.id} style={{
              background: '#090d16',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#f1f5f9' }}>{p.name}</span>
                  <span style={{
                    fontSize: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    {p.activeTenants} Tenants
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>{p.tagline}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#eab308', marginBottom: '6px' }}>
                  ${p.monthlyPriceUSD}/mo <span style={{ fontSize: '11px', color: '#64748b' }}>(₹{p.monthlyPriceINR.toLocaleString('en-IN')})</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px', marginTop: '6px' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  Target: {p.targetMarket}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Stage Roadmap Strip */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
          🗺️ Sovereign $1 Billion Roadmap Milestones
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {metrics.roadmapStages?.map(s => (
            <div key={s.stage} style={{
              background: '#0a0e18',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: s.status === 'ACHIEVED' ? '#22c55e' : s.status === 'ACTIVE_NOW' ? '#38bdf8' : '#334155',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  Stage {s.stage}
                </span>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '12.5px', color: '#f1f5f9' }}>{s.title}</span>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{s.milestones}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#facc15' }}>
                  Target: ${(s.targetValuationUSD / 1000000).toFixed(0)}M USD
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: s.status === 'ACHIEVED' ? '#4ade80' : s.status === 'ACTIVE_NOW' ? '#38bdf8' : '#94a3b8'
                }}>
                  ● {s.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy Tenant Modal */}
      {showDeployModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0b0f19',
            border: '1px solid #eab308',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '460px',
            width: '100%'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fef08a' }}>
              ⚡ Instant Micro-SaaS Tenant Provisioning
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Spawns an active multi-tenant subscription with immediate live API keys.
            </p>

            <form onSubmit={handleDeployTenant}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Product Fleet</label>
                <select
                  value={deployForm.productId}
                  onChange={e => setDeployForm({ ...deployForm, productId: e.target.value })}
                  className="form-select w-full"
                  style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                >
                  <option value="apex_vox">ApexVOX Duplex Voice AI ($149/mo)</option>
                  <option value="cineflow_4k">CineFlow 4K Ad Machine ($199/mo)</option>
                  <option value="intake_closer">IntakeBot Pro WhatsApp Closer ($99/mo)</option>
                  <option value="omni_qa">OmniQA Cryptographic Shield ($249/mo)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. London Healthcare Partners"
                  value={deployForm.clientName}
                  onChange={e => setDeployForm({ ...deployForm, clientName: e.target.value })}
                  className="form-input w-full"
                  style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Currency</label>
                <select
                  value={deployForm.currency}
                  onChange={e => setDeployForm({ ...deployForm, currency: e.target.value })}
                  className="form-select w-full"
                  style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                >
                  <option value="USD">USD ($) — PayPal Escrow / Stripe</option>
                  <option value="INR">INR (₹) — Direct UPI Autopay</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '12px', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', color: '#000', fontWeight: 'bold' }}
                >
                  Provision & Issue Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
