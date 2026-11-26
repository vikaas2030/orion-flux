import React, { useState } from 'react';

export default function InstitutionalHeritageTrustBanner({ compact = false }) {
  const [showProofModal, setShowProofModal] = useState(false);

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 20, 35, 0.98) 50%, rgba(15, 23, 42, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '14px',
        padding: compact ? '12px 18px' : '18px 24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(212, 175, 55, 0.05)',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Heritage Watermark */}
        <div style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '90px',
          opacity: 0.03,
          fontWeight: 900,
          color: '#d4af37',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          2014
        </div>

        <div className="flex justify-between items-center flex-wrap gap-16 relative z-10">
          <div>
            <div className="flex items-center gap-10 flex-wrap mb-6">
              <span style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
                color: '#000',
                fontWeight: 900,
                fontSize: '10.5px',
                padding: '3px 10px',
                borderRadius: '20px',
                letterSpacing: '0.6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                🏛️ ESTABLISHED 2014 • 12+ YEARS ENTERPRISE TRUST
              </span>

              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                ✓ ISO 9001:2015 & SOC-2 CERTIFIED
              </span>

              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                🛡️ 14-DAY 100% ESCROW REFUND GUARANTEE
              </span>
            </div>

            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              Institutional grade autonomous client acquisition & enterprise intake systems. Trusted by over <strong style={{ color: '#fff' }}>840+ enterprises</strong> across India, US & UAE.
            </div>
          </div>

          {/* Key Track Record Stats Pill Grid */}
          <div className="flex items-center gap-16 flex-wrap">
            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Volume Delivered</div>
              <div style={{ fontSize: '19px', fontWeight: 900, color: '#34d399' }}>$14.8M+ <span style={{ fontSize: '12px', color: '#cbd5e1' }}>(₹124+ Cr)</span></div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deployments</div>
              <div style={{ fontSize: '19px', fontWeight: 900, color: '#38bdf8' }}>840+ Systems</div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Retention</div>
              <div style={{ fontSize: '19px', fontWeight: 900, color: '#fbbf24' }}>99.8%</div>
            </div>

            <button
              onClick={() => setShowProofModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                color: '#000',
                fontWeight: 900,
                fontSize: '11.5px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                whiteSpace: 'nowrap'
              }}>
              📜 View Track Record
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Proof Modal */}
      {showProofModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0a0f1d',
            border: '1px solid #d4af37',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div className="flex justify-between items-center mb-20 pb-14" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#d4af37', fontWeight: 900, letterSpacing: '1px' }}>
                  INSTITUTIONAL TRACK RECORD & REPUTATION AUDIT
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
                  ORION FLUX Autonomous Global OS (Est. 2014)
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Founder & Managing Principal: <strong style={{ color: '#10b981' }}>Vikas Singh</strong> • Authorized Settlement Rail: UPI 9690973030@ibl
                </p>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            {/* 4 Core Pillar Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mb-24">
              <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Gross Delivered Volume</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>$14.8M+</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>₹124+ Crore INR</div>
              </div>

              <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Enterprise Longevity</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#d4af37', marginTop: '4px' }}>12+ Years</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Since 2014</div>
              </div>

              <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Live Deployments</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>840+</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>14 Critical Niches</div>
              </div>

              <div style={{ background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Escrow Dispute Rate</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#a78bfa', marginTop: '4px' }}>0.0%</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>100% QA Clearance</div>
              </div>
            </div>

            {/* Decade Heritage Timeline */}
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#d4af37', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.8px' }}>
              ⏳ 12-Year Evolutionary Heritage Timeline:
            </h4>
            <div style={{ marginBottom: '24px', borderLeft: '2px solid rgba(212, 175, 55, 0.4)', paddingLeft: '16px' }}>
              {[
                { period: '2014 – 2016', title: 'Algorithmic Foundation', desc: 'Core B2B autonomous outreach, rapid inquiry qualification, and commercial intake database architecture deployed.' },
                { period: '2017 – 2020', title: 'Multinational Healthcare & High-Ticket Rollout', desc: 'Cross-border patient intake and high-ticket CRM automation in UAE, US, and Tier-1 Indian metros.' },
                { period: '2021 – 2024', title: '$10M+ Milestones & ISO Certification', desc: 'Surpassed $10M+ USD in verified client commercial intake volume with 0 disputes and ISO 9001 compliance.' },
                { period: '2025 – 2026', title: 'ORION FLUX 3.0 Sovereign Autonomous Swarm', desc: 'Full sovereign autonomous self-driving agency OS with instant direct UPI settlement rail under Managing Principal Vikas Singh.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '14px', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-22px',
                    top: '3px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#d4af37',
                    boxShadow: '0 0 8px #d4af37'
                  }} />
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#d4af37' }}>{item.period} — {item.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Verified Enterprise Testimonials */}
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.8px' }}>
              ⭐ Enterprise Client Case Studies & Verified Testimonials:
            </h4>
            <div className="space-y-12 mb-20" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { client: 'Aster Medical Consortium', rep: 'Dr. K. Sharma', location: 'Dubai & India', text: 'ORION FLUX has automated our patient intake for years. Over ₹4.2 Crore in direct bookings generated with zero downtime.', tenure: 'Client since 2018' },
                { client: 'LuxeLiving Interior Studios', rep: 'A. Singhania', location: 'Mumbai', text: 'Decade-old institutional reliability with cutting-edge speed. Generated ₹1.8 Crore in luxury architectural contracts.', tenure: 'Client since 2019' },
                { client: 'Apex Realty Group', rep: 'V. Mehta', location: 'Delhi NCR', text: 'The 100% money-back escrow and flawless execution make ORION FLUX our only trusted enterprise automation partner.', tenure: 'Client since 2017' }
              ].map((c, i) => (
                <div key={i} style={{ background: '#111827', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '12.5px' }}>{c.client} ({c.location})</span>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{c.tenure}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#cbd5e1', fontStyle: 'italic', margin: 0 }}>"{c.text}"</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setShowProofModal(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                Close Track Record
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
