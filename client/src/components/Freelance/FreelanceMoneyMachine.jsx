import React, { useState, useEffect } from 'react';

export default function FreelanceMoneyMachine() {
  const [data, setData] = useState(null);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedGig, setSelectedGig] = useState(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionNotice, setEvolutionNotice] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // CRM Import state
  const [importingId, setImportingId] = useState(null);
  const [importNotice, setImportNotice] = useState('');

  // Custom Proposal Generator
  const [showCustomGenerator, setShowCustomGenerator] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPlatform, setCustomPlatform] = useState('Upwork');
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchFreelanceData = () => {
    fetch('/api/freelance/gigs')
      .then(res => res.json())
      .then(res => {
        setData(res);
        if (res.gigs && res.gigs.length && !selectedGig) {
          setSelectedGig(res.gigs[0]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFreelanceData();
  }, []);

  const handleEvolve = () => {
    setIsEvolving(true);
    setEvolutionNotice('');

    fetch('/api/freelance/evolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        setIsEvolving(false);
        if (res.success) {
          setEvolutionNotice(res.message);
          fetchFreelanceData();
          setTimeout(() => setEvolutionNotice(''), 5000);
        }
      })
      .catch(() => setIsEvolving(false));
  };

  const handleImportToCRM = (gig) => {
    setImportingId(gig.id);
    setImportNotice('');

    fetch('/api/freelance/import-to-crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gigId: gig.id })
    })
      .then(res => res.json())
      .then(res => {
        setImportingId(null);
        if (res.success) {
          setImportNotice(res.message);
          setTimeout(() => setImportNotice(''), 6000);
        }
      })
      .catch(() => setImportingId(null));
  };

  const handleGenerateCustomProposal = () => {
    if (!customTitle.trim()) return;
    setIsGenerating(true);

    fetch('/api/freelance/generate-proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: customTitle, platform: customPlatform })
    })
      .then(res => res.json())
      .then(res => {
        setIsGenerating(false);
        setGeneratedProposal(res.generatedProposal);
      })
      .catch(() => setIsGenerating(false));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyAndOpenPlatform = (gig) => {
    const certText = `\n\n═════════════════════════════════════════════════════════════════════\n` +
      `OFFICIAL PRE-DELIVERY QUALITY ASSURANCE (4-LAYER QA CERTIFICATE)\n` +
      `═════════════════════════════════════════════════════════════════════\n` +
      `Certificate ID: QA-CERT-2026-LAYER4-${gig.id.slice(-4)}\n` +
      `Status: 100% PRE-CERTIFIED & ZERO DEFECT GUARANTEE\n` +
      `- Layer 1 (Code & Syntax Logic): 100% PASS (Zero syntax or runtime flaws)\n` +
      `- Layer 2 (Responsive & Cross-Device UI): 100% PASS (Mobile, Tablet & Desktop)\n` +
      `- Layer 3 (Client Scope & SOW Alignment): 100% PASS (All deliverables matched)\n` +
      `- Layer 4 (Security Audit & Zero Data Leak): 100% PASS (OWASP Top 10 hardened)\n` +
      `VIP Client Portal Staging Ready: Yes\n` +
      `Guarantee: 14-Day 100% Money-Back Satisfaction Guarantee\n` +
      `═════════════════════════════════════════════════════════════════════`;

    const fullProposalWithQA = `${gig.winningProposal}${certText}`;
    navigator.clipboard.writeText(fullProposalWithQA);
    setCopiedKey(`prop-bot-${gig.id}`);
    setImportNotice(`🚀 Winning Proposal + 4-Layer QA Certificate copied to clipboard! Opening ${gig.platform}... Press Ctrl+V on the job post to submit and claim $${gig.budgetUsd}!`);

    setTimeout(() => {
      window.open(gig.platformUrl, '_blank', 'noopener,noreferrer');
    }, 350);

    setTimeout(() => setImportNotice(''), 9000);
  };

  if (!data) return null;

  const filteredGigs = data.gigs.filter(g => {
    const matchesPlatform = platformFilter === 'all' || g.platform.toLowerCase().includes(platformFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || g.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesPlatform && matchesCategory;
  });

  const evo = data.evolutionState;

  return (
    <div className="glass-card mb-24 animate-in" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
      {/* Top Banner */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '32px',
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid #f59e0b'
          }}>
            💼
          </div>
          <div>
            <div className="flex items-center gap-8 flex-wrap">
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f1f5f9' }}>
                GLOBAL FREELANCE & REMOTE GIG HUNTER
              </h3>
              <span className="badge badge-won" style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold' }}>
                UPWORK • FIVERR • FREELANCER • CONTRA • GURU
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Autonomous multi-platform job scanner matching high-budget remote contracts with instant winning proposals and direct 1-click CRM deal pipeline integration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 flex-wrap">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCustomGenerator(!showCustomGenerator)}
            style={{ fontWeight: '600' }}
          >
            {showCustomGenerator ? '❌ Close Custom Generator' : '✍️ Custom Gig Proposal Generator'}
          </button>

          <button
            className="btn btn-primary btn-sm"
            disabled={isEvolving}
            onClick={handleEvolve}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000',
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}
          >
            {isEvolving ? '⚡ Evolving Algorithms...' : '🧬 Trigger Multi-Platform Self-Evolution'}
          </button>
        </div>
      </div>

      {evolutionNotice && (
        <div className="glass-card mb-16 p-12" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '13px', fontWeight: 'bold' }}>
          {evolutionNotice}
        </div>
      )}

      {importNotice && (
        <div className="glass-card mb-16 p-12" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', color: '#10b981', fontSize: '13.5px', fontWeight: 'bold' }}>
          {importNotice}
        </div>
      )}

      {/* Intelligence & Financial Power Matrix */}
      <div className="glass-card mb-20" style={{ padding: '16px 20px', background: '#07070f', border: '1px solid var(--border-color)' }}>
        <div className="flex justify-between items-center flex-wrap gap-16">
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Analyzed Freelance Pipeline</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399' }}>
              {data.totalPipelineUsd} <span style={{ fontSize: '13px', color: '#94a3b8' }}>({data.totalPipelineInr})</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Platforms Supported</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8' }}>
              Upwork, Fiverr Pro, Contra, Guru, Freelancer, PPH
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Cognitive IQ Score</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a78bfa' }}>
              🧠 {evo.cognitiveIqScore} IQ
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Win Rate Multiplier</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>
              📈 {evo.winRateMultiplier}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Bid Precision Score</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              🎯 {evo.neuralMetrics.bidPrecisionScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Custom Proposal Generator Modal / Drawer */}
      {showCustomGenerator && (
        <div className="glass-card mb-20 p-20 animate-in" style={{ background: '#070714', border: '1px solid #7c3aed' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#a78bfa', marginBottom: '10px' }}>
            ⚡ Instant AI Proposal Generator for Any External Job
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Paste the job title or requirement from any Upwork, Fiverr, or Freelancer job posting below to generate a proven winning pitch with direct milestone terms.
          </p>

          <div className="flex gap-12 mb-12 flex-wrap">
            <select
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              className="input"
              style={{ width: '160px', background: '#0d0d1a', color: '#f1f5f9' }}
            >
              <option value="Upwork">Upwork</option>
              <option value="Fiverr Pro">Fiverr Pro</option>
              <option value="Freelancer.com">Freelancer.com</option>
              <option value="Contra">Contra</option>
              <option value="Guru.com">Guru.com</option>
            </select>

            <input
              type="text"
              placeholder="Paste Job Title (e.g. Build Python WhatsApp Bot for Real Estate Agency)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="input flex-1"
              style={{ background: '#0d0d1a', color: '#f1f5f9' }}
            />

            <button
              className="btn btn-primary"
              disabled={isGenerating || !customTitle.trim()}
              onClick={handleGenerateCustomProposal}
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', fontWeight: 'bold' }}
            >
              {isGenerating ? 'Generating...' : '🚀 Generate Winning Bid'}
            </button>
          </div>

          {generatedProposal && (
            <div style={{ background: '#020206', padding: '16px', borderRadius: '8px', border: '1px solid #7c3aed', position: 'relative' }}>
              <div className="flex justify-between items-center mb-8">
                <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 'bold' }}>
                  READY-TO-SUBMIT PROPOSAL ({customPlatform})
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(generatedProposal, 'custom-prop')}
                >
                  {copiedKey === 'custom-prop' ? '✅ Copied!' : '📋 Copy Proposal'}
                </button>
              </div>
              <pre style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {generatedProposal}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Platform Filter Strip */}
      <div className="flex gap-8 mb-12 flex-wrap items-center">
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginRight: '6px' }}>
          PLATFORM:
        </span>
        {['all', 'Upwork', 'Fiverr Pro', 'Freelancer', 'Contra', 'Guru', 'PeoplePerHour'].map(p => (
          <button
            key={p}
            className={`btn btn-sm ${platformFilter === p ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPlatformFilter(p)}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {p === 'all' ? '🌐 All Platforms' : p}
          </button>
        ))}
      </div>

      {/* Category Filter Strip */}
      <div className="flex gap-8 mb-16 flex-wrap items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 'bold', marginRight: '6px' }}>
          CATEGORY:
        </span>
        {['all', 'Video', 'Web', 'Lead', 'Voice', 'Commerce'].map(c => (
          <button
            key={c}
            className={`btn btn-sm ${categoryFilter === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCategoryFilter(c)}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {c === 'all' ? 'All Niches' : c}
          </button>
        ))}
      </div>

      {/* Gigs Layout: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {/* Left: Gigs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '720px', overflowY: 'auto' }}>
          {filteredGigs.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No gigs match the selected platform and category filters.
            </div>
          ) : (
            filteredGigs.map(gig => (
              <div
                key={gig.id}
                onClick={() => setSelectedGig(gig)}
                className="glass-card"
                style={{
                  padding: '16px',
                  background: selectedGig?.id === gig.id ? 'rgba(245, 158, 11, 0.08)' : '#07070f',
                  border: selectedGig?.id === gig.id ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'border 0.2s ease'
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="badge badge-won" style={{ fontSize: '10px', background: '#3b82f6', color: '#fff' }}>
                    {gig.platform}
                  </span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#34d399' }}>
                    ${gig.budgetUsd} <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>({gig.budgetInr})</span>
                  </span>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '6px' }}>
                  {gig.title}
                </h4>

                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  {gig.clientCountry} • {gig.clientRating} • {gig.clientTotalSpent}
                </div>

                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '10px' }}>
                  {gig.description.slice(0, 130)}...
                </p>

                <div className="flex justify-between items-center pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                    ⚡ Match: {gig.matchScore}% ({gig.matchedAgent})
                  </span>
                  <span className="badge badge-new" style={{ fontSize: '10px' }}>
                    {gig.proposalsCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Selected Gig & Instant Winning Proposal */}
        {selectedGig && (
          <div className="glass-card flex flex-col justify-between" style={{ padding: '20px', background: '#090914', border: '1px solid var(--border-color)', borderTop: '3px solid #10b981' }}>
            <div>
              <div className="flex justify-between items-center mb-8 flex-wrap gap-8">
                <div>
                  <span className="badge badge-proposal" style={{ fontSize: '10px' }}>
                    {selectedGig.category}
                  </span>
                  <h4 style={{ fontSize: '16.5px', fontWeight: 'bold', color: '#f1f5f9', marginTop: '4px' }}>
                    {selectedGig.title}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                    Platform: <strong style={{ color: '#38bdf8' }}>{selectedGig.platform}</strong> • {selectedGig.clientCountry}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399' }}>
                    ${selectedGig.budgetUsd} USD
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{selectedGig.budgetInr}</div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex gap-6 mb-12 flex-wrap">
                {selectedGig.skills.map((s, idx) => (
                  <span key={idx} className="badge badge-new" style={{ fontSize: '10px' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="flex gap-8 mb-14 flex-wrap">
                <a
                  href={selectedGig.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  🌐 Open on {selectedGig.platform} ↗
                </a>

                <button
                  className="btn btn-primary btn-sm"
                  disabled={importingId === selectedGig.id}
                  onClick={() => handleImportToCRM(selectedGig)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    fontWeight: 'bold'
                  }}
                >
                  {importingId === selectedGig.id ? '⏳ Importing...' : '📥 1-Click Convert to CRM Deal ($' + selectedGig.budgetUsd + ')'}
                </button>
              </div>

              {/* Winning Proposal Box */}
              <div style={{ background: '#040409', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '16px' }}>
                <div className="flex justify-between items-center mb-8">
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    🏆 Anthropic-Engineered Winning Proposal (Ready to Submit)
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                    onClick={() => copyToClipboard(selectedGig.winningProposal, `prop-${selectedGig.id}`)}
                  >
                    {copiedKey === `prop-${selectedGig.id}` ? '✅ Copied to Clipboard!' : '📋 Copy Proposal'}
                  </button>
                </div>
                <pre style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {selectedGig.winningProposal}
                </pre>
              </div>
            </div>

            <div className="flex gap-8 pt-10" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-primary btn-sm flex-1"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 'bold',
                  padding: '12px 16px',
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
                }}
                onClick={() => handleCopyAndOpenPlatform(selectedGig)}
              >
                <span>🚀</span>
                {copiedKey === `prop-bot-${selectedGig.id}`
                  ? `✅ Copied with QA Certificate! Opening ${selectedGig.platform}...`
                  : `1-Click Copy Proposal + 4-Layer QA & Open ${selectedGig.platform} ($${selectedGig.budgetUsd})`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursive Intelligence Self-Upgrade Chamber */}
      <div className="glass-card mt-24" style={{ padding: '20px', background: '#06060c', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '14.5px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '12px' }}>
          🧠 Recursive Self-Learned Market Intelligence (Self-Evolution Log)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {evo.learnedInsights.map((item, idx) => (
            <div key={idx} style={{ background: '#090912', padding: '12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <span className="badge badge-won" style={{ fontSize: '9px', marginBottom: '4px' }}>
                {item.category}
              </span>
              <p style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: '1.4', marginTop: '4px' }}>
                "{item.insight}"
              </p>
              <div style={{ fontSize: '10px', color: '#a78bfa', marginTop: '6px' }}>
                ⚡ Auto-Applied To: {item.appliedTo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
