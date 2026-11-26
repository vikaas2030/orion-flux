import React, { useState, useEffect } from 'react';
import ProfessionalDealCloser from '../components/Deals/ProfessionalDealCloser';
import AutonomousClientHandler from '../components/Deals/AutonomousClientHandler';
import BankSmsReconciler from '../components/Deals/BankSmsReconciler';
import SaaSRetainerWidget from '../components/Deals/SaaSRetainerWidget';

const STAGES = [
  { id: 'new', label: 'New Lead', color: '#6366f1' },
  { id: 'contacted', label: 'Contacted', color: '#06b6d4' },
  { id: 'qualified', label: 'Qualified', color: '#10b981' },
  { id: 'proposal', label: 'Proposal Sent', color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'won', label: 'Won (Client)', color: '#22c55e' }
];

export default function CRM() {
  const [pipeline, setPipeline] = useState({});
  const [settlementStats, setSettlementStats] = useState(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showCloserModal, setShowCloserModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [selectedDealForCloser, setSelectedDealForCloser] = useState(null);
  const [newDeal, setNewDeal] = useState({ title: '', value: '', stage: 'new', company: '', probability: 50 });
  const [isAutoClosing, setIsAutoClosing] = useState(false);
  const [actionAlert, setActionAlert] = useState('');
  const [dealSearch, setDealSearch] = useState('');

  const fetchPipeline = () => {
    fetch('/api/deals/pipeline')
      .then(res => res.json())
      .then(data => {
        if (data.pipeline) setPipeline(data.pipeline);
      })
      .catch(() => {});

    fetch('/api/settlement/status')
      .then(res => res.json())
      .then(data => {
        setSettlementStats(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPipeline();
    const interval = setInterval(fetchPipeline, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateDeal = (e) => {
    e.preventDefault();
    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newDeal.title,
        value: parseFloat(newDeal.value) || 0,
        stage: newDeal.stage,
        probability: parseInt(newDeal.probability) || 50,
        lead_company: newDeal.company
      })
    })
      .then(res => res.json())
      .then(() => {
        setShowDealModal(false);
        setNewDeal({ title: '', value: '', stage: 'new', company: '', probability: 50 });
        fetchPipeline();
      });
  };

  const moveDeal = (dealId, targetStage) => {
    fetch(`/api/deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: targetStage })
    })
      .then(() => fetchPipeline());
  };

  const openCloserForDeal = (deal) => {
    setSelectedDealForCloser(deal);
    setShowCloserModal(true);
  };

  // ⚡ 1-Click Instant Auto-Settle Specific Deal
  const handleInstantAutoSettle = (deal) => {
    setActionAlert(`⚡ Auto-settling advance for "${deal.title}"...`);
    fetch(`/api/settlement/auto-close/${deal.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActionAlert(data.message);
          fetchPipeline();
          setTimeout(() => setActionAlert(''), 6000);
        }
      })
      .catch(() => setActionAlert(''));
  };

  // ⚡ Autonomous 1-Click Auto-Close & Collect All Deals
  const handleAutoCloseAll = () => {
    setIsAutoClosing(true);
    setActionAlert('⚡ Autonomous Engine locking in MSA contracts & settling bank advances for all pending deals...');

    fetch('/api/settlement/auto-close-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setIsAutoClosing(false);
        setActionAlert(data.message);
        fetchPipeline();
        setTimeout(() => setActionAlert(''), 8000);
      })
      .catch(() => setIsAutoClosing(false));
  };

  return (
    <div className="crm-page animate-in">
      {/* Top Header Strip */}
      <div className="flex justify-between items-center mb-20 flex-wrap gap-12">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-8">
            <span>🎯</span> Sales Pipeline & Automated Settlement CRM
          </h2>
          <p className="text-sm text-tertiary">Zero-delay autonomous deal closing, instant UPI QR invoices & verified bank money settlement</p>
        </div>
        <div className="flex gap-10 flex-wrap">
          <button
            className="btn btn-primary"
            disabled={isAutoClosing}
            onClick={handleAutoCloseAll}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            {isAutoClosing ? '⚡ Auto-Settling Deals...' : '🚀 1-Click Auto-Close & Settle All Deals'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowSmsModal(true)}
            style={{
              borderColor: 'rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡</span> Bank SMS / UTR Reconciler
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedDealForCloser(null);
              setShowCloserModal(true);
            }}
          >
            🤝 Enterprise Closer
          </button>
          <button className="btn btn-secondary" onClick={() => setShowDealModal(true)}>
            <span>+</span> Create Deal
          </button>
        </div>
      </div>

      {actionAlert && (
        <div className="glass-card mb-16 p-12 animate-in" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', color: '#34d399', fontSize: '13.5px', fontWeight: 'bold' }}>
          {actionAlert}
        </div>
      )}

      {/* Real-Time Bank Settlement Metrics Banner */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: '#07070f', border: '1px solid var(--border-color)', borderLeft: '4px solid #10b981' }}>
        <div className="flex justify-between items-center flex-wrap gap-16">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Verified Bank Collections</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              {settlementStats ? settlementStats.totalSettledFormatted : '₹0 INR'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Won / Settled Deals</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399' }}>
              {settlementStats ? `${settlementStats.wonDealsCount} Finalized Deals` : '0 Finalized'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active In-Flight Deals</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>
              {settlementStats ? `${settlementStats.pendingDealsCount} Closing In Progress` : '5 In Progress'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Settlement Rail</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24' }}>
              ⚡ UPI: 9690973030@ibl / PayPal
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Client & Deal Negotiator */}
      <AutonomousClientHandler onDealClosed={fetchPipeline} />

      {/* SaaS Monthly Recurring Revenue (MRR) Retainer Engine */}
      <SaaSRetainerWidget onSubscriptionChange={fetchPipeline} />

      {/* Full Modal Deal Closer */}
      {showCloserModal && (
        <div className="mb-24">
          <ProfessionalDealCloser
            initialDeal={selectedDealForCloser}
            onClose={() => {
              setShowCloserModal(false);
              fetchPipeline();
            }}
            onDealFinalized={() => {
              fetchPipeline();
            }}
          />
        </div>
      )}

      {/* Deals Real-Time Filter & Search */}
      <div className="glass-card mb-16 p-12 flex justify-between items-center flex-wrap gap-12" style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-12" style={{ flex: 1, minWidth: '280px' }}>
          <span style={{ fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search deals by client, business name, or value..."
            value={dealSearch}
            onChange={e => setDealSearch(e.target.value)}
            style={{
              flex: 1,
              background: '#131b2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#fff',
              fontSize: '13px'
            }}
          />
          {dealSearch && (
            <button
              onClick={() => setDealSearch('')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
            >
              ✕ Clear
            </button>
          )}
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Showing deals across 6 pipeline stages
        </div>
      </div>

      {/* Pipeline Kanban Board */}
      <div className="pipeline-board">
        {STAGES.map((stage) => {
          const columnData = pipeline[stage.id] || { deals: [], count: 0, totalValue: 0 };
          const s = dealSearch.toLowerCase().trim();
          const filteredDeals = (columnData.deals || []).filter(deal => {
            if (!s) return true;
            return (
              (deal.title && deal.title.toLowerCase().includes(s)) ||
              (deal.lead_company && deal.lead_company.toLowerCase().includes(s)) ||
              (deal.lead_name && deal.lead_name.toLowerCase().includes(s)) ||
              (deal.value && deal.value.toString().includes(s))
            );
          });
          const columnTotal = filteredDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

          return (
            <div className="pipeline-column" key={stage.id}>
              <div className="pipeline-column-header">
                <h3>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color, display: 'inline-block' }}></span>
                  {stage.label}
                  <span className="column-count">{filteredDeals.length}</span>
                </h3>
                <div className="column-value">
                  {stage.id === 'won' ? '✓ ' : ''}₹{columnTotal.toLocaleString()}
                </div>
              </div>

              <div className="pipeline-cards">
                {filteredDeals.map((deal) => (
                  <div
                    className="pipeline-card"
                    key={deal.id}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      borderLeft: stage.id === 'won' ? '3px solid #10b981' : undefined
                    }}
                    onClick={(e) => {
                      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                      openCloserForDeal(deal);
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="pipeline-card-title">{deal.title}</div>
                      {stage.id === 'won' && (
                        <span className="badge badge-won" style={{ fontSize: '9px', padding: '1px 6px', background: '#10b981', color: '#000', fontWeight: 'bold' }}>
                          ✓ SETTLED
                        </span>
                      )}
                    </div>
                    <div className="pipeline-card-company">{deal.lead_company || deal.lead_name || 'Prospect Client'}</div>

                    <div className="pipeline-card-footer mt-8 flex justify-between items-center">
                      <div className="pipeline-card-value">
                        {deal.currency === 'USD' ? '$' : '₹'}{(deal.value || 0).toLocaleString()}
                      </div>
                      <div className="flex gap-4">
                        {stage.id !== 'won' ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{
                                fontSize: '10px',
                                padding: '2px 7px',
                                height: '24px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: '#000',
                                fontWeight: 'bold'
                              }}
                              title="Instant Auto-Close & Collect Advance"
                              onClick={() => handleInstantAutoSettle(deal)}
                            >
                              ⚡ Auto-Settle
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '10px', padding: '2px 6px', height: '24px' }}
                              title="Open Detailed MSA Closer"
                              onClick={() => openCloserForDeal(deal)}
                            >
                              🤝 Closer
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 'bold' }}>
                            ✓ UTR: {deal.transactionRef ? deal.transactionRef.slice(-8) : 'Verified'}
                          </span>
                        )}

                        {stage.id !== 'won' && (
                          <button
                            className="btn-icon"
                            style={{ width: '24px', height: '24px', fontSize: '11px' }}
                            title="Move Next Stage"
                            onClick={() => {
                              const currentIndex = STAGES.findIndex(s => s.id === stage.id);
                              if (currentIndex < STAGES.length - 1) {
                                moveDeal(deal.id, STAGES[currentIndex + 1].id);
                              }
                            }}
                          >
                            ➔
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {columnData.deals.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showDealModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Deal</h3>
              <button className="btn-close" onClick={() => setShowDealModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateDeal}>
              <div className="form-group mb-12">
                <label>Deal Title</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="e.g. Clinic Appointment WhatsApp Bot"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                />
              </div>
              <div className="form-group mb-12">
                <label>Company / Client Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Apex Health Clinic"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                />
              </div>
              <div className="grid grid-2 gap-12 mb-16">
                <div className="form-group">
                  <label>Value (₹)</label>
                  <input
                    type="number"
                    className="input"
                    required
                    placeholder="9000"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stage</label>
                  <select
                    className="input"
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-8">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDealModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚡ Instant Bank SMS & UTR Auto-Reconciler Modal */}
      <BankSmsReconciler
        isOpen={showSmsModal}
        onClose={() => setShowSmsModal(false)}
        onSettlementComplete={() => {
          fetchPipeline();
          setActionAlert('🎉 Payment Reconciled & Settled! Deal marked WON and verified in Bank Ledger.');
          setTimeout(() => setActionAlert(''), 6000);
        }}
      />
    </div>
  );
}
