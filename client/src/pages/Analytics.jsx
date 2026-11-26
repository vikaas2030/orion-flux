import React from 'react';

export default function Analytics() {
  return (
    <div className="analytics-page animate-in">
      <div className="mb-20">
        <h2 className="text-xl font-bold">Full Business Intelligence & Revenue Analytics</h2>
        <p className="text-sm text-tertiary">Real-time performance metrics across all 7 automation modules</p>
      </div>

      <div className="stat-cards mb-24">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Yearly Income Projected</h3>
            <div className="stat-value">₹33,00,000</div>
            <div className="stat-change positive">Based on 6-month growth trend</div>
          </div>
          <div className="stat-icon green">📈</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Avg Deal Size</h3>
            <div className="stat-value">₹1,85,000</div>
          </div>
          <div className="stat-icon purple">🎯</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Outreach Conversion</h3>
            <div className="stat-value">18.4%</div>
          </div>
          <div className="stat-icon blue">⚡</div>
        </div>
      </div>

      <div className="glass-card p-24" style={{ padding: '24px' }}>
        <h3 className="font-bold mb-16">Monthly Revenue & Lead Acquisition Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { month: 'August 2026', rev: '₹2,75,000', leads: '18 Leads Scraped', deals: '3 Won' },
            { month: 'July 2026', rev: '₹2,15,000', leads: '14 Leads Scraped', deals: '2 Won' },
            { month: 'June 2026', rev: '₹2,00,000', leads: '12 Leads Scraped', deals: '2 Won' }
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center p-16" style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', padding: '16px 20px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ fontSize: '15px' }}>{row.month}</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{row.leads} | {row.deals}</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-green)' }}>{row.rev}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
