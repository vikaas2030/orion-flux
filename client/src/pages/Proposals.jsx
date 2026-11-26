import React, { useState } from 'react';

export default function Proposals() {
  const [clientName, setClientName] = useState('Fiction jam room and recording studio');
  const [projectType, setProjectType] = useState('24/7 Studio Booking Bot & Video Reels Automation');
  const [budget, setBudget] = useState('6000');
  const [requirements, setRequirements] = useState('Build automated 24/7 customer inquiry WhatsApp bot with rate-card delivery, instant booking confirmation, and promotional reels for recording studio.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState(null);

  const handleGenerateAIProposal = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setProposal({
        title: `Project Proposal: ${projectType}`,
        client: clientName,
        date: new Date().toLocaleDateString(),
        budget: `₹${parseFloat(budget).toLocaleString()}`,
        summary: `ORION FLUX Super Agent team is pleased to present this comprehensive proposal for ${clientName}. We will design and launch a high-performance ${projectType} designed to maximize conversions and streamline operations.`,
        scope: [
          'Custom Web Interface with Glassmorphism UI',
          'AI-Powered Customer Response Chatbot',
          'Automated Lead Generation & CRM Pipeline Integration',
          'Payment Gateway & Automated PDF Invoicing System',
          'Search Engine Optimization (SEO) & Fast Page Loads'
        ],
        timeline: '3-4 Weeks Turnaround',
        terms: '50% Upfront Advance, 50% Upon Final Deployment & Verification.'
      });
    }, 1800);
  };

  return (
    <div className="proposals-page animate-in">
      <div className="mb-20">
        <h2 className="text-xl font-bold">AI Proposal Generator & Deliverables</h2>
        <p className="text-sm text-tertiary">Generate winning professional proposals in seconds using Gemini AI</p>
      </div>

      <div className="charts-grid">
        {/* Proposal Form */}
        <div className="glass-card p-24" style={{ padding: '24px' }}>
          <h3 className="font-bold mb-16">Proposal Parameters</h3>
          <form onSubmit={handleGenerateAIProposal}>
            <div className="form-group">
              <label className="form-label">Client / Prospect Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project Type / Service *</label>
              <input
                type="text"
                className="form-input"
                required
                value={projectType}
                onChange={e => setProjectType(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Investment (₹)</label>
              <input
                type="number"
                className="form-input"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>
            <div className="form-group mb-20">
              <label className="form-label">Project Requirements & Scope Details</label>
              <textarea
                className="form-textarea"
                style={{ height: '100px' }}
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center' }}
              disabled={isGenerating}
            >
              {isGenerating ? '✨ AI Generating Proposal...' : '✨ Generate AI Proposal'}
            </button>
          </form>
        </div>

        {/* Live Proposal Preview */}
        <div className="glass-card p-24" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
          {proposal ? (
            <div className="animate-in">
              <div className="flex justify-between items-center mb-16 pb-12" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--accent-purple)' }}>{proposal.title}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Prepared for: {proposal.client} | Date: {proposal.date}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  📄 Print / PDF
                </button>
              </div>

              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>1. Executive Summary</h4>
                <p style={{ color: 'var(--text-secondary)' }}>{proposal.summary}</p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '14px' }}>2. Scope of Deliverables</h4>
                <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)' }}>
                  {proposal.scope.map((item, i) => <li key={i}>{item}</li>)}
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '14px' }}>3. Project Timeline & Budget</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Estimated Timeline: <strong>{proposal.timeline}</strong></p>
                <p style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '16px' }}>Total Investment: {proposal.budget}</p>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '14px' }}>4. Terms</h4>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{proposal.terms}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No Proposal Generated Yet</h3>
              <p>Fill out the parameters on the left and click "Generate AI Proposal".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
