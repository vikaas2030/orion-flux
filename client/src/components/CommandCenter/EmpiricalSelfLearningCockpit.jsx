import React, { useState, useEffect } from 'react';

export default function EmpiricalSelfLearningCockpit() {
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [customRule, setCustomRule] = useState({ title: '', condition: '', correction: '' });
  const [showAddRule, setShowAddRule] = useState(false);

  const fetchLearningData = async () => {
    try {
      const res = await fetch('/api/learning/dashboard');
      const data = await res.json();
      if (data.success) {
        setLearningData(data.data);
      }
    } catch (err) {
      console.error('Failed to load learning data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
    const interval = setInterval(fetchLearningData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCleanseLeads = async () => {
    setActionMsg('Scrubbing database & quarantining unverified leads...');
    try {
      const res = await fetch('/api/learning/cleanse-leads', { method: 'POST' });
      const d = await res.json();
      if (d.success) {
        setActionMsg(`✅ Lead Scrub Complete! Quarantined: ${d.result.quarantinedCount}, Verified Active: ${d.result.verifiedCount}`);
        fetchLearningData();
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleTriggerPulse = async () => {
    setActionMsg('Running full empirical error audit & domain verification...');
    try {
      const res = await fetch('/api/learning/pulse', { method: 'POST' });
      const d = await res.json();
      if (d.success) {
        setActionMsg('✅ Empirical Learning Pulse finished! Rules updated.');
        fetchLearningData();
      }
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleAddCustomRule = async (e) => {
    e.preventDefault();
    if (!customRule.title || !customRule.correction) return;
    try {
      await fetch('/api/learning/record-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'USER_INSTRUCTION_RULE',
          details: customRule.title,
          rootCause: customRule.condition || 'User feedback correction',
          autoCorrectionApplied: customRule.correction
        })
      });
      setCustomRule({ title: '', condition: '', correction: '' });
      setShowAddRule(false);
      setActionMsg('✅ New learning directive permanently saved into System Vault!');
      fetchLearningData();
    } catch (err) {
      setActionMsg(`❌ Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 text-slate-300">
        <div className="animate-pulse flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <span>Loading Empirical Self-Learning Engine...</span>
        </div>
      </div>
    );
  }

  const vault = learningData || {};
  const metrics = vault.empiricalMetrics || {};

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden my-6">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Empirical Self-Learning & Mistake-Correction Engine
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  v4.0 Zero-Fake Mandate
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-world feedback loop: Auto-detects failures, blacklists dead domains, enforces rules, and adapts to user instructions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCleanseLeads}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
          >
            <span>🧹</span> Scrub Fake Leads
          </button>
          <button
            onClick={handleTriggerPulse}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5"
          >
            <span>⚡</span> Run Error Audit
          </button>
          <button
            onClick={() => setShowAddRule(!showAddRule)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
          >
            <span>➕</span> Teach System
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Teach System Form */}
      {showAddRule && (
        <form onSubmit={handleAddCustomRule} className="mb-6 p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-3">
          <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <span>✍️</span> Teach System a New Rule / Correction (Permanently Persisted)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Rule Title (e.g., Reject info@ emails)"
              value={customRule.title}
              onChange={e => setCustomRule({ ...customRule, title: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Mistake / Condition (e.g., Email starts with info@)"
              value={customRule.condition}
              onChange={e => setCustomRule({ ...customRule, condition: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Correction Action (e.g., Skip and mark low priority)"
              value={customRule.correction}
              onChange={e => setCustomRule({ ...customRule, correction: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddRule(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Save Directive to Memory Vault
            </button>
          </div>
        </form>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Total Mistakes Analyzed</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{vault.totalMistakesRecorded || 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SMTP Bounces & Dead Links</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Self-Corrections Applied</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{vault.totalSelfCorrectionsApplied || 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Auto-fixes & Domain Blocks</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Quarantined Fake Leads</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{metrics.deadLeadsQuarantined || 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Scraped @www or Dead MX</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Verified Indian Buyers</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.verifiedIndianCellularLeads || 0}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active 10-Digit WhatsApp</div>
        </div>
      </div>

      {/* Two Column Layout: Active Learned Rules & Blacklisted Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Active Rules */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
            <span>🛡️</span> Active Empirical Directives ({vault.learnedRules?.length || 0})
          </h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {(vault.learnedRules || []).map((rule, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-200 font-medium">
                  <span>{rule.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Enforced {rule.enforcedCount || 1}x
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <span className="text-amber-400/90 font-semibold">Trigger:</span> {rule.condition}
                </div>
                <div className="text-[11px] text-emerald-300/90 mt-0.5">
                  <span className="text-emerald-400 font-semibold">Correction:</span> {rule.correction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blacklisted Domains & Real Mistake Feed */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <span>🚫</span> Blacklisted Unreachable Domains ({vault.domainBlacklist?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-4 max-h-24 overflow-y-auto">
            {(vault.domainBlacklist || []).map((dom, i) => (
              <span key={i} className="px-2 py-1 rounded-md text-[11px] font-mono bg-rose-950/50 text-rose-300 border border-rose-800/50">
                {dom}
              </span>
            ))}
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
            <span>📝</span> Recent Mistake Audit Log
          </h3>
          <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
            {(vault.mistakeLog || []).slice(0, 3).map((m, i) => (
              <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
                <div className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>[{m.category}] {m.details}</span>
                  <span className="text-[10px] text-slate-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5">Cause: {m.rootCause}</div>
                <div className="text-emerald-400 text-[10px] mt-0.5">Fix: {m.autoCorrectionApplied}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-2 border-t border-slate-800/60 text-slate-500 text-[11px]">
        Permanent Vault Path: <code className="text-slate-400">server/data/self_learning_vault.json</code> • State updates automatically upon every bounce, click, or manual instruction.
      </div>
    </div>
  );
}
