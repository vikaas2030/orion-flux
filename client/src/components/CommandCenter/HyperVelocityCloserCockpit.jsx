import React, { useState, useEffect } from 'react';

export default function HyperVelocityCloserCockpit({ onDealSettled }) {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState('all');
  const [actionMsg, setActionMsg] = useState('');
  const [settlingDeal, setSettlingDeal] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [processingSettle, setProcessingSettle] = useState(false);
  const [activeKit, setActiveKit] = useState(null);

  const fetchPipeline = async () => {
    try {
      const res = await fetch('/api/hyper-closer/pipeline');
      const data = await res.json();
      if (data.success) {
        setPipelineData(data);
      }
    } catch (err) {
      console.error('Failed to load 15-day pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
    const interval = setInterval(fetchPipeline, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStage = async (dealId, currentStage) => {
    const nextMap = {
      proposal: 'negotiation',
      negotiation: 'milestone_staged',
      milestone_staged: 'payment_pending',
      payment_pending: 'won'
    };
    const nextStage = nextMap[currentStage] || 'negotiation';

    setActionMsg(`Advancing Deal #${dealId} to ${nextStage.toUpperCase()}...`);
    try {
      const res = await fetch('/api/hyper-closer/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, stage: nextStage })
      });
      const d = await res.json();
      if (d.success) {
        setActionMsg(`✅ ${d.message}`);
        fetchPipeline();
      }
    } catch (err) {
      setActionMsg(`❌ Advance Error: ${err.message}`);
    }
  };

  const handleSendEmail = async (dealId, company) => {
    setActionMsg(`Sending authentic closer email to ${company} via vikaas2030@gmail.com...`);
    try {
      const res = await fetch('/api/hyper-closer/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId })
      });
      const d = await res.json();
      if (d.success) {
        setActionMsg(`🎉 Real Closer Email Delivered to ${d.recipient}! (Msg ID: ${d.messageId})`);
        fetchPipeline();
      } else {
        setActionMsg(`❌ Dispatch Failed: ${d.message}`);
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleOpenSettle = (deal) => {
    setSettlingDeal(deal);
    setAmountInput(deal.advanceVal || deal.totalVal || 999);
    setUtrInput('');
  };

  const handleConfirmSettle = async (e) => {
    e.preventDefault();
    if (!settlingDeal || !utrInput) return;
    setProcessingSettle(true);
    setActionMsg(`Reconciling bank settlement & locking WON status for ${settlingDeal.company}...`);

    try {
      const res = await fetch('/api/hyper-closer/settle-won', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: settlingDeal.id,
          utrNumber: utrInput,
          amount: parseFloat(amountInput) || settlingDeal.advanceVal,
          paymentMethod: 'Direct UPI Settlement (PhonePe / Google Pay)'
        })
      });

      const d = await res.json();
      if (d.success) {
        setActionMsg(`🏆 DEAL WON! ₹${amountInput} settled. Verified UTR: ${utrInput}`);
        setSettlingDeal(null);
        fetchPipeline();
        if (onDealSettled) onDealSettled();
      } else {
        setActionMsg(`❌ Settlement Failed: ${d.message}`);
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    } finally {
      setProcessingSettle(false);
    }
  };

  const handleViewKit = async (dealId) => {
    try {
      const res = await fetch(`/api/hyper-closer/kit/${dealId}`);
      const d = await res.json();
      if (d.success) {
        setActiveKit(d.kit);
      }
    } catch (err) {
      console.error('Failed to load closer kit:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-2"></div>
        <p>Calibrating 15-to-20 Day Hyper-Velocity Deal Closer Matrix...</p>
      </div>
    );
  }

  // Aggregate all deals or filter by phase
  const allDeals = [
    ...(pipelineData?.phases?.tier1_handshake?.deals || []),
    ...(pipelineData?.phases?.tier2_milestone?.deals || []),
    ...(pipelineData?.phases?.tier3_executive?.deals || []),
    ...(pipelineData?.phases?.tier4_critical?.deals || []),
    ...(pipelineData?.phases?.tier5_recovery?.deals || [])
  ];

  let displayDeals = allDeals;
  if (activePhase === 'tier1') displayDeals = pipelineData?.phases?.tier1_handshake?.deals || [];
  if (activePhase === 'tier2') displayDeals = pipelineData?.phases?.tier2_milestone?.deals || [];
  if (activePhase === 'tier3') displayDeals = pipelineData?.phases?.tier3_executive?.deals || [];
  if (activePhase === 'tier4') displayDeals = pipelineData?.phases?.tier4_critical?.deals || [];
  if (activePhase === 'tier5') displayDeals = pipelineData?.phases?.tier5_recovery?.deals || [];

  return (
    <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative space-y-6">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-gradient-to-br from-amber-500/15 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black">
              15–20 Day Max SLA
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Deal Won & Bank Cash Protocol
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            ⚡ Hyper-Velocity 15-to-20 Day Deal Closer
          </h2>
          <p className="text-xs text-slate-400">
            Mandate: Zero deal stalling. High-urgency micro-token closing cadences driving every deal to WON bank settlement in ≤ 15-20 days.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Authorized UPI Rail</div>
            <div className="text-sm font-mono font-bold text-amber-400">9690973030@ibl</div>
            <div className="text-[10px] text-slate-500">Vikas Singh</div>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMsg && (
        <div className="p-3 bg-amber-950/70 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Pipeline KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Active Closing Pipeline</div>
          <div className="text-xl font-black text-white mt-0.5">
            {pipelineData?.totalPipelineDeals || 0} Deals
          </div>
          <div className="text-[10px] text-slate-500">All within 1-10 day window</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Pipeline Cash Potential</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            ₹{(pipelineData?.totalPipelineValue || 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">Target for 15-day settlement</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">WON Deals Settled</div>
          <div className="text-xl font-black text-indigo-400 mt-0.5">
            {pipelineData?.wonDealsCount || 0}
          </div>
          <div className="text-[10px] text-slate-500">Verified Bank Collections</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">15-Day SLA Target</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            100% Locked
          </div>
          <div className="text-[10px] text-slate-500">Zero deals exceeding 20 days</div>
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActivePhase('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activePhase === 'all'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Pipeline Deals ({allDeals.length})
        </button>

        <button
          onClick={() => setActivePhase('tier1')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activePhase === 'tier1'
              ? 'bg-emerald-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🟢 Days 1–4: Pilot Token Handshake ({pipelineData?.phases?.tier1_handshake?.count || 0})
        </button>

        <button
          onClick={() => setActivePhase('tier2')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activePhase === 'tier2'
              ? 'bg-cyan-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔵 Days 5–8: Live Milestone Proof ({pipelineData?.phases?.tier2_milestone?.count || 0})
        </button>

        <button
          onClick={() => setActivePhase('tier3')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activePhase === 'tier3'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🟡 Days 9–14: Executive Nudge ({pipelineData?.phases?.tier3_executive?.count || 0})
        </button>

        <button
          onClick={() => setActivePhase('tier4')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activePhase === 'tier4'
              ? 'bg-rose-500 text-white shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔴 Days 15–20: Critical Bank Lock ({pipelineData?.phases?.tier4_critical?.count || 0})
        </button>
      </div>

      {/* Deals Listing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {displayDeals.length} deals in active closing cadence</span>
          <span>SLA Target: Day 15 Settlement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
          {displayDeals.map((deal) => {
            const progressPct = Math.min(100, Math.round((deal.ageInDays / 15) * 100));

            return (
              <div
                key={deal.id}
                className="bg-slate-800/40 border border-slate-700/60 hover:border-amber-500/50 rounded-xl p-4 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{deal.company}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({deal.contact})</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{deal.title}</div>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {deal.isUSD ? `$${deal.totalVal.toLocaleString()}` : `₹${deal.totalVal.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-amber-400 font-semibold">
                        Token: {deal.isUSD ? `$${deal.pilotVal}` : `₹${deal.pilotVal}`}
                      </div>
                    </div>
                  </div>

                  {/* 15-Day Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Day {deal.ageInDays} in Pipeline</span>
                      <span className="font-bold text-amber-300">
                        {deal.daysLeftTo15 > 0 ? `${deal.daysLeftTo15} days left to Day 15 SLA` : 'At Closing Window'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          deal.ageInDays <= 4
                            ? 'bg-emerald-500'
                            : deal.ageInDays <= 8
                            ? 'bg-cyan-500'
                            : deal.ageInDays <= 14
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Strategy Badge */}
                  <div className="mt-2.5 p-2 bg-slate-900/60 rounded border border-slate-800 text-[10px] text-slate-300">
                    <span className="font-bold text-amber-400">Strategy: </span>
                    {deal.recommendedAction}
                  </div>
                </div>

                {/* Closer Action Toolbar */}
                <div className="pt-2 border-t border-slate-700/40 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleViewKit(deal.id)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-all"
                  >
                    📋 Closer Kit
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${deal.phone || '919690973030'}&text=${encodeURIComponent(
                      `Namaste ${deal.contact} ji 🙏 Vikas Singh from ORION FLUX regarding ${deal.title}. We have staged your live system at ${deal.portalUrl}. You can initiate immediate handover today with just ₹999 refundable token via UPI: 9690973030@ibl.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all flex items-center gap-1"
                  >
                    💬 WhatsApp
                  </a>

                  {deal.email && (
                    <button
                      onClick={() => handleSendEmail(deal.id, deal.company)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-all"
                    >
                      ✉️ Email Nudge
                    </button>
                  )}

                  <button
                    onClick={() => handleAdvanceStage(deal.id, deal.stage || 'proposal')}
                    className="px-2.5 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-white rounded text-xs transition-all"
                  >
                    ⏩ Advance
                  </button>

                  <button
                    onClick={() => handleOpenSettle(deal)}
                    className="ml-auto px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black rounded text-xs font-black shadow transition-all flex items-center gap-1"
                  >
                    🏆 Settle WON
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settle WON Modal */}
      {settlingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              🏆 Reconcile & Mark Deal WON
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Confirm genuine bank collection for <strong>{settlingDeal.company}</strong> ({settlingDeal.title}).
            </p>

            <form onSubmit={handleConfirmSettle} className="space-y-3.5 mt-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Settlement Amount ({settlingDeal.currency || 'INR'})
                </label>
                <input
                  type="number"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bank UTR / Transaction Reference (Strict Zero-Fake Policy)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 202611189690 (12-digit UPI / IMPS UTR)"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Credit target: UPI <strong>9690973030@ibl</strong> (Vikas Singh)
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettlingDeal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingSettle}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black rounded-lg text-xs shadow-lg hover:brightness-110 disabled:opacity-50"
                >
                  {processingSettle ? 'Reconciling...' : 'Confirm WON & Record Revenue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Closer Kit Viewer Modal */}
      {activeKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white">
                  📋 15-Day Closer Kit: {activeKit.company}
                </h3>
                <span className="text-[11px] text-indigo-400">Ready for instant WhatsApp / Email dispatch</span>
              </div>
              <button onClick={() => setActiveKit(null)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-300 mb-1">WhatsApp Closing Script:</div>
              <textarea
                readOnly
                rows={5}
                value={activeKit.whatsappScript}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-200 font-mono resize-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeKit.whatsappScript);
                  setActionMsg('✓ WhatsApp Script copied to clipboard!');
                }}
                className="mt-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                Copy Script
              </button>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-300 mb-1">Direct Links:</div>
              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div>Client Portal: <a href={activeKit.portalUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{activeKit.portalUrl}</a></div>
                <div>Digital Store: <a href={activeKit.storeUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{activeKit.storeUrl}</a></div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveKit(null)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
