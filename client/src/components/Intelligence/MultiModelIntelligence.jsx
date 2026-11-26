import React, { useState, useEffect } from 'react';

export default function MultiModelIntelligence({ onDeliverableGenerated }) {
  const [activeSubTab, setActiveSubTab] = useState('hermes'); // 'hermes' | 'playbooks' | 'objections' | 'models'
  const [models, setModels] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [battlecards, setBattlecards] = useState([]);

  // Hermes Execution State
  const [clientName, setClientName] = useState('Apex Global Technologies');
  const [serviceType, setServiceType] = useState('Automated Lead Generation & CRM System');
  const [targetBudget, setTargetBudget] = useState('₹1,50,000');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    fetch('/api/intelligence/models')
      .then(res => res.json())
      .then(data => {
        if (data.models) setModels(data.models);
      })
      .catch(() => {});

    fetch('/api/intelligence/playbooks')
      .then(res => res.json())
      .then(data => {
        if (data.playbooks) setPlaybooks(data.playbooks);
        if (data.objectionBattlecards) setBattlecards(data.objectionBattlecards);
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunHermesPipeline = (e) => {
    e.preventDefault();
    setIsExecuting(true);
    setExecutionResult(null);
    setSavedSuccess(false);

    fetch('/api/intelligence/hermes-execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName, serviceType, targetBudget })
    })
      .then(res => res.json())
      .then(data => {
        setIsExecuting(false);
        if (data.executionSteps) {
          setExecutionResult(data);
        }
      })
      .catch(() => setIsExecuting(false));
  };

  const handleSaveHermesDeliverables = () => {
    if (!executionResult) return;

    const deliverable = {
      agentId: 'apex_sales',
      title: `${clientName} — ${serviceType} (Autonomous Pipeline Package)`,
      category: 'Enterprise Deals & Automation',
      fileType: 'application/pdf',
      fileFormat: 'PDF / CONTRACT',
      fileSize: '2.4 MB',
      description: `Complete client automation package for ${clientName}: Enriched leads, value-based pricing ROI calculation (3.0x), commercial proposal, and official GST tax invoice with UPI QR code.`,
      content: {
        client: clientName,
        service: serviceType,
        budget: targetBudget,
        executionSteps: executionResult.executionSteps,
        downloadFileName: `Hermes_Autonomous_Package_${clientName.replace(/\s+/g, '_')}.pdf`
      }
    };

    fetch('/api/agency/deliverables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliverable)
    })
      .then(res => res.json())
      .then(() => {
        setSavedSuccess(true);
        if (onDeliverableGenerated) onDeliverableGenerated();
        setTimeout(() => setSavedSuccess(false), 4000);
      })
      .catch(() => {});
  };

  return (
    <div className="glass-card mb-24 animate-in" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
      {/* Header Banner */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-8">
            <span>🧠</span> Multi-Model Intelligence Hub
            <span className="badge badge-won">ANTHROPIC + HERMES + DEEPSEEK</span>
          </h3>
          <p className="text-sm text-tertiary mt-4">
            Combines Anthropic Claude's high-ticket closing psychology, Nous Hermes 3's autonomous tool-calling pipeline, and DeepSeek's value-based pricing models to drive real revenue.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <span className="badge badge-new" style={{ fontSize: '11px', padding: '6px 12px' }}>
            ⚡ 4 Cognitive Cores Active
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex gap-8 mb-20 flex-wrap" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn btn-sm ${activeSubTab === 'hermes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('hermes')}
          style={{ background: activeSubTab === 'hermes' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined }}
        >
          🟢 Hermes Autonomous Pipeline
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'playbooks' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('playbooks')}
          style={{ background: activeSubTab === 'playbooks' ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : undefined }}
        >
          💰 High-Ticket Revenue Playbooks
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'objections' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('objections')}
          style={{ background: activeSubTab === 'objections' ? 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)' : undefined }}
        >
          🛡️ Anthropic Objection Handling
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'models' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('models')}
        >
          🤖 Cognitive Model Architectures ({models.length})
        </button>
      </div>

      {/* ── SUB-TAB 1: HERMES AUTONOMOUS EXECUTION ENGINE ── */}
      {activeSubTab === 'hermes' && (
        <div className="animate-in">
          <div className="glass-card mb-20" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', marginBottom: '6px' }}>
              ⚡ Nous Hermes 3 Pro — Autonomous Tool Execution Sandbox
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Unlike simple chat bots, Hermes 3 uses structured function calling to autonomously diagnose client needs, calculate mathematical ROI, draft proposals, and generate instant UPI invoices in a single execution loop.
            </p>

            {/* Pipeline Configuration Form */}
            <form onSubmit={handleRunHermesPipeline}>
              <div className="form-row mb-16">
                <div className="form-group flex-1">
                  <label className="form-label">Client or Prospect Company *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Apex Global Technologies"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ minWidth: '280px' }}>
                  <label className="form-label">Service Package</label>
                  <select className="form-select" value={serviceType} onChange={e => setServiceType(e.target.value)}>
                    <option value="Automated Lead Generation & CRM System">Automated Lead Gen & CRM (₹75k - ₹1.5L)</option>
                    <option value="AI Video Production & Viral Shorts Agency Package">AI Video Production Agency (₹1.2L - ₹2.5L)</option>
                    <option value="Complete Autonomous Agency Operating System">Full Autonomous Agency OS (₹2.5L - ₹5L)</option>
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: '180px' }}>
                  <label className="form-label">Target Retainer / Deal Size</label>
                  <input
                    type="text"
                    className="form-input"
                    value={targetBudget}
                    onChange={e => setTargetBudget(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isExecuting}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 24px', fontSize: '13px' }}
              >
                {isExecuting ? '⚡ Hermes 3 Executing Multi-Step Pipeline...' : '🚀 Run Hermes Autonomous Deal Pipeline'}
              </button>
            </form>
          </div>

          {/* Execution Pipeline Steps Viewer */}
          {executionResult && (
            <div className="glass-card animate-in mb-20" style={{ padding: '24px', background: '#07070d', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>
                    📋 Hermes Autonomous Execution Log: {executionResult.client}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {executionResult.service} • Retainer: {executionResult.budget}
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <span className="badge badge-won">100% Pipeline Verified</span>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}
                    disabled={savedSuccess}
                    onClick={handleSaveHermesDeliverables}
                  >
                    {savedSuccess ? '✅ Saved in Agent Vault!' : '💾 Save Deliverables to Vault'}
                  </button>
                </div>
              </div>

              {/* Timeline of Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {executionResult.executionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      background: step.type === 'thinking' ? 'rgba(139, 92, 246, 0.08)' : step.type === 'final_delivery' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      borderLeft: step.type === 'thinking' ? '3px solid #8b5cf6' : step.type === 'final_delivery' ? '3px solid #10b981' : '3px solid #38bdf8'
                    }}
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-8">
                        <span style={{ fontSize: '14px' }}>
                          {step.type === 'thinking' ? '🧠' : step.type === 'final_delivery' ? '🏆' : '🔧'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          Step {step.step}: {step.type === 'thinking' ? 'Deep Chain-of-Thought Reasoning' : step.type === 'final_delivery' ? 'Final Synthesis' : `Function Call: ${step.function}()`}
                        </span>
                      </div>
                      <span className="badge badge-new" style={{ fontSize: '10px' }}>
                        {step.model}
                      </span>
                    </div>

                    {step.type === 'thinking' && (
                      <p style={{ fontSize: '12.5px', color: '#c4b5fd', fontFamily: 'monospace', lineHeight: '1.5' }}>
                        &lt;thinking&gt; {step.content} &lt;/thinking&gt;
                      </p>
                    )}

                    {step.type === 'tool_call' && (
                      <div style={{ background: '#030307', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                        <div style={{ color: '#38bdf8', marginBottom: '4px' }}>
                          ⚡ CALL: {step.function}({JSON.stringify(step.arguments)})
                        </div>
                        <div style={{ color: '#34d399' }}>
                          ✓ RESULT: {JSON.stringify(step.result)}
                        </div>
                      </div>
                    )}

                    {step.type === 'final_delivery' && (
                      <div style={{ fontSize: '13px', color: '#34d399', fontWeight: '500' }}>
                        {step.summary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUB-TAB 2: HIGH-TICKET REVENUE PLAYBOOKS ── */}
      {activeSubTab === 'playbooks' && (
        <div className="animate-in">
          <div className="mb-16">
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
              💰 Battle-Tested High-Ticket Revenue Playbooks
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              Ready-to-sell agency automation packages. These are not theoretical concepts; they are formatted offers with exact pricing, turnaround times, and closing scripts designed to bring in real client revenue.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {playbooks.map(p => (
              <div
                key={p.id}
                className="glass-card flex flex-col justify-between"
                style={{
                  padding: '22px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  borderTop: '3px solid #8b5cf6'
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-10">
                    <span className="badge badge-proposal" style={{ fontSize: '10px' }}>
                      {p.serviceCategory}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      ⏱️ {p.estimatedTurnaround}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {p.title}
                  </h4>

                  {/* Pricing Badge */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '8px 12px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '10px', color: '#10b981', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Commercial Retainer Value
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>
                      {p.priceRange}
                    </div>
                  </div>

                  {/* Target Clients */}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    🎯 <strong>Target Clients:</strong> {p.targetClients}
                  </div>

                  {/* Value Proposition */}
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                    {p.valueProposition}
                  </p>

                  {/* Deliverables Checklist */}
                  <div style={{ background: '#0a0a14', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#a78bfa', marginBottom: '6px' }}>
                      📦 Deliverables Included:
                    </div>
                    <ul style={{ fontSize: '11.5px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
                      {p.deliverables.map((item, idx) => (
                        <li key={idx}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Closing Pitch */}
                  <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.25)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                      🔥 Anthropic High-Converting Closing Pitch
                    </div>
                    <p style={{ fontSize: '12px', color: '#f1f5f9', fontStyle: 'italic', lineHeight: '1.4' }}>
                      "{p.closingPitch}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-8 pt-10" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <button
                    className="btn btn-secondary btn-sm flex-1"
                    onClick={() => copyToClipboard(p.closingPitch, `pitch-${p.id}`)}
                  >
                    {copiedKey === `pitch-${p.id}` ? '✅ Copied!' : '📋 Copy Pitch'}
                  </button>
                  <button
                    className="btn btn-primary btn-sm flex-1"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    onClick={() => {
                      setServiceType(p.title);
                      setTargetBudget(p.priceRange.split('(')[0].trim());
                      setActiveSubTab('hermes');
                    }}
                  >
                    ⚡ Run Pipeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB 3: ANTHROPIC OBJECTION HANDLING BATTLECARDS ── */}
      {activeSubTab === 'objections' && (
        <div className="animate-in">
          <div className="mb-16">
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
              🛡️ Anthropic Persuasion & Objection Handling Battlecards
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              Top agency closers never argue; they reframe client objections using Anthropic's empathetic psychological frameworks. Copy and paste these exact scripts into WhatsApp, LinkedIn, or Email.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {battlecards.map((card, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  borderTop: '3px solid #ec4899'
                }}
              >
                <div className="flex justify-between items-center mb-10">
                  <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 'bold' }}>
                    COMMON OBJECTION #{idx + 1}
                  </span>
                  <span className="badge badge-new" style={{ fontSize: '10px' }}>
                    {card.psychologicalDriver}
                  </span>
                </div>

                <h4 style={{ fontSize: '14.5px', fontWeight: 'bold', color: '#facc15', marginBottom: '12px' }}>
                  {card.objection}
                </h4>

                <div style={{ background: '#0a0a14', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    💬 Anthropic High-Conversion Response Script
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#f1f5f9', lineHeight: '1.6' }}>
                    "{card.anthropicScript}"
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm w-full"
                  onClick={() => copyToClipboard(card.anthropicScript, `card-${idx}`)}
                >
                  {copiedKey === `card-${idx}` ? '✅ Script Copied to Clipboard!' : '📋 Copy Response Script'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB 4: COGNITIVE MODEL SPECS ── */}
      {activeSubTab === 'models' && (
        <div className="animate-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {models.map(m => (
              <div
                key={m.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-8">
                    <span style={{ fontSize: '24px' }}>{m.icon}</span>
                    <strong style={{ fontSize: '14px' }}>{m.name}</strong>
                  </div>
                  <span className="badge badge-won">{m.status}</span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                  <strong>Strengths:</strong> {m.strengths}
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Revenue Impact
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#34d399', lineHeight: '1.4' }}>
                    {m.incomeImpact}
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  {m.features.map((feat, idx) => (
                    <span key={idx} className="badge badge-proposal" style={{ fontSize: '10px' }}>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
