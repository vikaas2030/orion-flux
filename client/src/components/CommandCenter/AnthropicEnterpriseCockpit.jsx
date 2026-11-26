import React, { useState, useEffect } from 'react';

export default function AnthropicEnterpriseCockpit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('swarm');
  const [actionMsg, setActionMsg] = useState('');

  // Swarm Form State
  const [swarmGoal, setSwarmGoal] = useState('Launch automated 24/7 clinic WhatsApp booking system with 14-day money-back guarantee');
  const [swarmExecuting, setSwarmExecuting] = useState(false);
  const [swarmResults, setSwarmResults] = useState(null);

  // Single Agent Form State
  const [singleMessage, setSingleMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('finance');
  const [executingSingle, setExecutingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState(null);

  // API Key Form State
  const [keyClientName, setKeyClientName] = useState('');
  const [keyPlan, setKeyPlan] = useState('pro');
  const [generatedKey, setGeneratedKey] = useState(null);

  // White-label Form State
  const [wlClientName, setWlClientName] = useState('');
  const [wlAppName, setWlAppName] = useState('');
  const [createdWl, setCreatedWl] = useState(null);

  // Affiliate Form State
  const [affName, setAffName] = useState('');
  const [affEmail, setAffEmail] = useState('');
  const [createdAff, setCreatedAff] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/anthropic/overview');
      const d = await res.json();
      if (d.success) setData(d);
    } catch (err) {
      console.error('Failed to load Anthropic overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecuteSwarm = async (e) => {
    e.preventDefault();
    if (!swarmGoal) return;
    setSwarmExecuting(true);
    setActionMsg('⚡ Executing Anthropic Claude 3.5 Multi-Agent Swarm (Legal ➔ Finance ➔ Dev ➔ Sales)...');

    try {
      const res = await fetch('/api/anthropic/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: swarmGoal, agents: ['legal', 'finance', 'dev', 'sales'] })
      });
      const d = await res.json();
      if (d.success) {
        setSwarmResults(d);
        setActionMsg(`✅ Multi-Agent Swarm complete across ${d.totalSteps} specialized agents!`);
      } else {
        setActionMsg(`❌ Swarm Error: ${d.message}`);
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    } finally {
      setSwarmExecuting(false);
    }
  };

  const handleExecuteSingleAgent = async (e) => {
    e.preventDefault();
    if (!singleMessage) return;
    setExecutingSingle(true);
    setActionMsg(`Executing ${selectedRole.toUpperCase()} AI task via Claude 3.5...`);

    try {
      const res = await fetch('/api/anthropic/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: singleMessage, agentRole: selectedRole })
      });
      const d = await res.json();
      if (d.success) {
        setSingleResult(d);
        setActionMsg(`✅ ${selectedRole.toUpperCase()} task completed successfully!`);
      } else {
        setActionMsg(`❌ Task Error: ${d.message}`);
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    } finally {
      setExecutingSingle(false);
    }
  };

  const handleGenerateApiKey = async (e) => {
    e.preventDefault();
    if (!keyClientName) return;
    try {
      const res = await fetch('/api/anthropic/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: keyClientName, plan: keyPlan })
      });
      const d = await res.json();
      if (d.success) {
        setGeneratedKey(d);
        setActionMsg(`✅ API Key generated for ${keyClientName}!`);
        setKeyClientName('');
        fetchData();
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleCreateWhiteLabel = async (e) => {
    e.preventDefault();
    if (!wlClientName) return;
    try {
      const res = await fetch('/api/anthropic/whitelabel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: wlClientName, appName: wlAppName })
      });
      const d = await res.json();
      if (d.success) {
        setCreatedWl(d.instance);
        setActionMsg(`👑 Enterprise White-Label client created! Monthly billing: ₹24,999`);
        setWlClientName('');
        setWlAppName('');
        fetchData();
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleCreateAffiliate = async (e) => {
    e.preventDefault();
    if (!affName) return;
    try {
      const res = await fetch('/api/anthropic/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerName: affName, partnerEmail: affEmail })
      });
      const d = await res.json();
      if (d.success) {
        setCreatedAff(d.affiliate);
        setActionMsg(`🤝 Partner affiliate created! 20% commission on referrals.`);
        setAffName('');
        setAffEmail('');
        fetchData();
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-2"></div>
        <p>Loading Anthropic Claude Enterprise Architecture...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl relative space-y-6">
      {/* Decorative Aura */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black">
              Anthropic Claude Enterprise
            </span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              6 Monetization Rails Active
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
            ⚡ Anthropic Claude Enterprise & Multi-Income Engine
          </h2>
          <p className="text-xs text-slate-400">
            Synthesized from Anthropic PBC codebase: Multi-Agent Swarms, Recurring SaaS Subscriptions, Metered API Key Billing, and Enterprise White-Labeling.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Authorized UPI Rail</div>
          <div className="text-sm font-mono font-bold text-amber-400">{data?.upiSettlementRail || '9690973030@ibl'}</div>
          <div className="text-[10px] text-slate-500">Vikas Singh</div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMsg && (
        <div className="p-3 bg-amber-950/70 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Anthropic Model Family</div>
          <div className="text-lg font-black text-white mt-0.5">Claude 3.5</div>
          <div className="text-[10px] text-slate-500">Sonnet, Haiku, Opus</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Active Developer API Keys</div>
          <div className="text-lg font-black text-emerald-400 mt-0.5">
            {data?.stats?.activeApiKeys || 0} Keys
          </div>
          <div className="text-[10px] text-slate-500">Metered Pay-Per-Call</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">White-Label Instances</div>
          <div className="text-lg font-black text-indigo-400 mt-0.5">
            {data?.stats?.whiteLabelInstances || 0}
          </div>
          <div className="text-[10px] text-slate-500">₹24,999/mo per client</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">SaaS Pipeline Potential</div>
          <div className="text-lg font-black text-amber-400 mt-0.5">
            ₹34.4L+
          </div>
          <div className="text-[10px] text-slate-500">Multi-Stream Recurring</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-2 pb-3">
        <button
          onClick={() => setActiveTab('swarm')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'swarm'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🤖 Multi-Agent Swarm (Claude 3.5)
        </button>

        <button
          onClick={() => setActiveTab('saas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'saas'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          📦 SaaS Subscription Tiers
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'api'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔑 Developer API Keys
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          📑 One-Time Reports (₹999)
        </button>

        <button
          onClick={() => setActiveTab('whitelabel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'whitelabel'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          👑 Enterprise White-Label
        </button>

        <button
          onClick={() => setActiveTab('affiliate')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'affiliate'
              ? 'bg-amber-500 text-black shadow'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🤝 20% Partner Affiliates
        </button>
      </div>

      {/* Tab 1: Multi-Agent Swarm */}
      {activeTab === 'swarm' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              ⚡ Multi-Agent Swarm Sequential Chain (Legal ➔ Finance ➔ Dev ➔ Sales)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Passes context sequentially across 4 specialized agents to formulate a complete enterprise contract, financial model, and closer pitch.
            </p>

            <form onSubmit={handleExecuteSwarm} className="space-y-3">
              <input
                type="text"
                required
                value={swarmGoal}
                onChange={(e) => setSwarmGoal(e.target.value)}
                placeholder="Enterprise Goal (e.g. Turnkey WhatsApp clinic bot with ₹999 refundable token)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={swarmExecuting}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-lg text-xs shadow-lg hover:brightness-110 disabled:opacity-50"
              >
                {swarmExecuting ? 'Executing Swarm...' : '🚀 Launch Multi-Agent Swarm Execution'}
              </button>
            </form>

            {swarmResults && (
              <div className="mt-4 space-y-3 border-t border-slate-700/60 pt-3">
                <div className="text-xs font-bold text-emerald-400">
                  {swarmResults.summary}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {swarmResults.steps?.map((st) => (
                    <div key={st.step} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                      <div className="text-[11px] font-bold text-amber-400">
                        Step {st.step}: {st.name}
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono whitespace-pre-line line-clamp-5">
                        {st.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Single Agent Quick Task */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              🤖 Single-Agent Targeted Execution
            </h3>

            <form onSubmit={handleExecuteSingleAgent} className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
              <input
                type="text"
                required
                placeholder="Enter prompt (e.g. Calculate Section 44ADA tax savings for ₹45L revenue)"
                value={singleMessage}
                onChange={(e) => setSingleMessage(e.target.value)}
                className="md:col-span-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="finance">Finance & Valuation AI (Claude 3.5)</option>
                <option value="legal">Corporate Legal Counsel AI (Claude 3.5)</option>
                <option value="dev">Software Architect AI (Claude 3.5)</option>
                <option value="sales">High-Ticket Deal Closer AI (Claude 3.5)</option>
                <option value="health">Clinic Workflow AI (Haiku 3.5)</option>
                <option value="creative">4K Creative Director AI (Haiku 3.5)</option>
              </select>

              <button
                type="submit"
                disabled={executingSingle}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow"
              >
                {executingSingle ? 'Running...' : 'Execute Task'}
              </button>
            </form>

            {singleResult && (
              <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono whitespace-pre-line">
                {singleResult.response}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: SaaS Subscriptions */}
      {activeTab === 'saas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          {data?.plans?.filter(p => p.id !== 'explorer').map((plan) => (
            <div key={plan.id} className="bg-slate-800/50 border border-slate-700/70 hover:border-amber-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase">{plan.badge || 'Plan'}</span>
                  <span className="text-xs text-slate-400 font-mono">Monthly</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{plan.name}</h3>
                <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                  ₹{plan.monthlyInr.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo (${plan.monthlyUsd})</span>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  {plan.features?.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-700/40">
                <a
                  href={`upi://pay?pa=9690973030@ibl&pn=ORION%20FLUX%20${plan.name}&am=${plan.monthlyInr}&cu=INR`}
                  className="w-full block text-center py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-lg text-xs shadow hover:brightness-110"
                >
                  ⚡ Subscribe via UPI (₹{plan.monthlyInr})
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Developer API Keys */}
      {activeTab === 'api' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              🔑 Generate Metered Developer API Key (Pay-Per-Call)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Third-party apps and developers can consume your Claude Multi-Agent Swarms via REST API with automated token metering.
            </p>

            <form onSubmit={handleGenerateApiKey} className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                placeholder="Client / Developer Name (e.g. Apex HealthTech)"
                value={keyClientName}
                onChange={(e) => setKeyClientName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <select
                value={keyPlan}
                onChange={(e) => setKeyPlan(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="pro">Pro Key (1,000 calls/mo)</option>
                <option value="team">Team Key (5,000 calls/mo)</option>
                <option value="whitelabel">Enterprise Key (50,000 calls/mo)</option>
              </select>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow"
              >
                + Issue Live API Key
              </button>
            </form>

            {generatedKey && (
              <div className="mt-4 p-3 bg-slate-950 border border-emerald-500/40 rounded-lg space-y-1 font-mono text-xs">
                <div className="text-emerald-400 font-bold">🎉 Key Generated: {generatedKey.clientName}</div>
                <div className="text-white select-all bg-slate-900 p-2 rounded border border-slate-800">
                  {generatedKey.apiKey}
                </div>
                <div className="text-slate-400 text-[11px]">Monthly Limit: {generatedKey.rateLimit} calls</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: One-Time Reports */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-fadeIn">
          {data?.reports?.map((rep) => (
            <div key={rep.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase">{rep.category}</span>
                <h4 className="text-xs font-bold text-white mt-1">{rep.name}</h4>
                <p className="text-[11px] text-slate-300 mt-2">{rep.description}</p>
                <div className="text-base font-black text-emerald-400 mt-3 font-mono">
                  ₹{rep.priceInr} <span className="text-xs text-slate-400 font-normal">(${rep.priceUsd})</span>
                </div>
              </div>

              <a
                href={`upi://pay?pa=9690973030@ibl&pn=ORION%20FLUX%20${rep.name}&am=${rep.priceInr}&cu=INR`}
                className="text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow"
              >
                Instant Buy via UPI (₹{rep.priceInr})
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Enterprise White-Label */}
      {activeTab === 'whitelabel' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              👑 Launch Enterprise White-Label Agency Instance (₹24,999 / $299 mo)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Allows external agencies to sell your AI services under their own custom domain and branding.
            </p>

            <form onSubmit={handleCreateWhiteLabel} className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                placeholder="Client Agency Name (e.g. Dubai Growth Labs)"
                value={wlClientName}
                onChange={(e) => setWlClientName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <input
                type="text"
                placeholder="App Name (e.g. GrowthLabs AI OS)"
                value={wlAppName}
                onChange={(e) => setWlAppName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow"
              >
                👑 Deploy White-Label Portal
              </button>
            </form>

            {createdWl && (
              <div className="mt-4 p-3 bg-slate-950 border border-purple-500/40 rounded-lg space-y-1 font-mono text-xs">
                <div className="text-purple-400 font-bold">👑 Deployed: {createdWl.appName}</div>
                <div className="text-slate-300">Client: {createdWl.clientName}</div>
                <div className="text-slate-400">Portal: <a href={createdWl.portalUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{createdWl.portalUrl}</a></div>
                <div className="text-emerald-400">Monthly Contract: ₹24,999 ($299)</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: 20% Partner Affiliates */}
      {activeTab === 'affiliate' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              🤝 Create 20% Partner Affiliate Referral Link
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Give creators, influencers, and B2B brokers a 20% commission on any client who buys a subscription or digital product.
            </p>

            <form onSubmit={handleCreateAffiliate} className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                placeholder="Partner Name (e.g. Rahul Sharma)"
                value={affName}
                onChange={(e) => setAffName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <input
                type="email"
                placeholder="Partner Email (e.g. rahul@creators.in)"
                value={affEmail}
                onChange={(e) => setAffEmail(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow"
              >
                + Create Affiliate Code
              </button>
            </form>

            {createdAff && (
              <div className="mt-4 p-3 bg-slate-950 border border-teal-500/40 rounded-lg space-y-1 font-mono text-xs">
                <div className="text-teal-400 font-bold">🤝 Partner Code: {createdAff.code}</div>
                <div className="text-slate-300">Partner: {createdAff.partnerName}</div>
                <div className="text-slate-400">Referral Link: <span className="text-teal-300 select-all">{createdAff.referralUrl}</span></div>
                <div className="text-emerald-400">Commission: 20% on all settlements</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
