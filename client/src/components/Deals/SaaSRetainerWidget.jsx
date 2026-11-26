import React, { useState, useEffect } from 'react';

export default function SaaSRetainerWidget({ onSubscriptionChange }) {
  const [mrrData, setMrrData] = useState(null);
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState('');
  const [selectedPlanKey, setSelectedPlanKey] = useState('saas_software');
  const [bannerNotice, setBannerNotice] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/retainer/mrr').then(r => r.json()),
      fetch('/api/retainer/pipeline').then(r => r.json())
    ])
      .then(([mrr, pipe]) => {
        setMrrData(mrr);
        setPipelineData(pipe);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleActivate = (dealId, planKey) => {
    setActivating(true);
    fetch('/api/retainer/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: dealId || selectedDealId,
        planKey: planKey || selectedPlanKey
      })
    })
      .then(r => r.json())
      .then(res => {
        setActivating(false);
        if (res.success) {
          setBannerNotice(`✅ Retainer Activated: ${res.subscription.clientName} (${res.subscription.monthlyFormatted})`);
          loadData();
          if (onSubscriptionChange) onSubscriptionChange();
          setTimeout(() => setBannerNotice(''), 5000);
        }
      })
      .catch(() => setActivating(false));
  };

  const handleRunBilling = () => {
    fetch('/api/retainer/run-cycle', { method: 'POST' })
      .then(r => r.json())
      .then(res => {
        setBannerNotice(`⚡ Recurring Billing Evaluated: ${res.renewedCount} cycles renewed`);
        loadData();
        setTimeout(() => setBannerNotice(''), 5000);
      });
  };

  const activeSubs = mrrData?.subscriptions || [];
  const pipelineContracts = pipelineData?.contracts || [];

  return (
    <div className="glass-card mb-20 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #0a0e1a 0%, #060911 100%)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-10">
          <div style={{
            fontSize: '24px',
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(99, 102, 241, 0.4)'
          }}>
            🔁
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
              SaaS Monthly Recurring Revenue (MRR) Retainer Engine
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Autonomous 30-day recurring maintenance contracts & cashflow stabilization rail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={handleRunBilling}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
          >
            ⚡ Check Due Renewals
          </button>
          <span style={{
            fontSize: '11px',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ade80',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            ● Autopilot Active
          </span>
        </div>
      </div>

      {bannerNotice && (
        <div className="mb-14 p-10 animate-in" style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          color: '#34d399',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {bannerNotice}
        </div>
      )}

      {/* High-Level MRR Metrics Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Active MRR (Blended)</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
            {mrrData ? mrrData.blendedMRR_INR : '₹0'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Includes {mrrData?.mrrUSD || '$0'} USD</div>
        </div>

        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Projected ARR</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#a855f7' }}>
            {mrrData ? mrrData.blendedARR_INR : '₹0'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Annual Run Rate</div>
        </div>

        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Active Subscribers</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>
            {mrrData ? mrrData.activeSubscribers : 0} Clients
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Churn: 0.0%</div>
        </div>

        <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Available Upsells</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#f59e0b' }}>
            {pipelineData ? pipelineData.totalRetainerContracts : 0} Deals
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Ready for Retainer</div>
        </div>
      </div>

      {/* Active Subscriptions Table */}
      {activeSubs.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '8px' }}>
            🟢 Active Recurring Subscription Contracts ({activeSubs.length})
          </div>
          <div style={{
            background: '#090d16',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#0f172a', textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '8px 12px' }}>Client & Deal</th>
                  <th style={{ padding: '8px 12px' }}>Plan Tier</th>
                  <th style={{ padding: '8px 12px' }}>Monthly Rate</th>
                  <th style={{ padding: '8px 12px' }}>Billing Rail</th>
                  <th style={{ padding: '8px 12px' }}>Next Billing</th>
                  <th style={{ padding: '8px 12px' }}>Cycles</th>
                </tr>
              </thead>
              <tbody>
                {activeSubs.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '600', color: '#f1f5f9' }}>
                      {s.clientName}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#818cf8' }}>
                      {s.planName}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#38bdf8' }}>
                      {s.monthlyFormatted}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '11px' }}>
                      {s.paymentRail}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#34d399' }}>
                      {new Date(s.nextBillingDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                      {s.billingCyclesCompleted + 1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Retainer Upsell Accelerator - Quick Conversion */}
      <div style={{
        background: '#090d16',
        borderRadius: '8px',
        padding: '12px 16px',
        border: '1px dashed rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          <strong style={{ color: '#818cf8' }}>🚀 1-Click Retainer Conversion:</strong> Select any deal from your pipeline and attach a monthly maintenance retainer contract.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedDealId}
            onChange={e => setSelectedDealId(e.target.value)}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <option value="">Select Deal to Attach Retainer...</option>
            {pipelineContracts.map(c => (
              <option key={c.dealId} value={c.dealId}>
                {c.client} ({c.niche})
              </option>
            ))}
          </select>

          <select
            value={selectedPlanKey}
            onChange={e => setSelectedPlanKey(e.target.value)}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <option value="saas_software">Cloud SaaS Optimization (₹20k / $350)</option>
            <option value="healthcare">Healthcare AI Reception Shield (₹7.5k / $99)</option>
            <option value="video_agency">CineFlow 4K Video Ad Retainer (₹25k / $450)</option>
            <option value="telephony_voice">VOX Duplex Voice Retainer (₹22k / $400)</option>
          </select>

          <button
            onClick={() => handleActivate()}
            disabled={!selectedDealId || activating}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            }}
          >
            {activating ? 'Activating...' : '+ Activate Retainer'}
          </button>
        </div>
      </div>
    </div>
  );
}
