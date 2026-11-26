import React, { useState, useEffect } from 'react';

export default function InstitutionalTrustWidget() {
  const [credentials, setCredentials] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    fetch('/api/trust/credentials')
      .then(r => r.json())
      .then(d => {
        if (d.success) setCredentials(d.credentials);
      })
      .catch(() => {});
  }, []);

  if (!credentials) return null;

  return (
    <div className="glass-card mb-24 p-20 animate-in" style={{
      background: 'linear-gradient(180deg, #090e1a 0%, #05070d 100%)',
      border: '1px solid rgba(99, 102, 241, 0.4)',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)'
    }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
        <div className="flex items-center gap-12">
          <div style={{
            fontSize: '26px',
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(99, 102, 241, 0.4)'
          }}>
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-8">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
                Institutional Reputation, Legal Compliance & Escrow Trust Dossier
              </h3>
              <span style={{
                fontSize: '11px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                fontWeight: '700'
              }}>
                ● STATUTORY COMPLIANCE VERIFIED
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Eliminates international payment hesitation with legal certificates, SHA-256 cryptographic seals & escrow protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`ORION FLUX Autonomous Global OS\nManaging Principal: ${credentials.managingPrincipal}\nTax Exemption: Section 22 CGST Act (Net ₹0 Extra Surcharge)\nSecurity Standard: ${credentials.securityStandard}\nPayment Rails: UPI 9690973030@ibl & PayPal Buyer Protection\nTurnaround SLA: 24-48 Hours`);
              setCopiedText(true);
              setTimeout(() => setCopiedText(false), 3000);
            }}
            className="btn btn-secondary"
            style={{ fontSize: '12px', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#a5b4fc' }}
          >
            {copiedText ? '✓ Copied Trust Dossier!' : '📋 Copy Legal Verification Dossier'}
          </button>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Managing Principal</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f8fafc', marginTop: '2px' }}>
            {credentials.managingPrincipal}
          </div>
          <div style={{ fontSize: '11px', color: '#34d399', marginTop: '2px' }}>● Verified Commercial Identity</div>
        </div>

        <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Statutory Tax Exemption</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#facc15', marginTop: '2px' }}>
            Section 22 CGST Act
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Net ₹0 Extra Surcharge to Clients</div>
        </div>

        <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Security & Delivery Standard</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>
            4-Layer SHA-256 QA
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Cryptographic Proof of Delivery</div>
        </div>

        <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>SLA & Guarantee</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#4ade80', marginTop: '2px' }}>
            24-48h Turnaround
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>100% Unconditional Refund if QA Fails</div>
        </div>
      </div>

      {/* Escrow Rails Roster */}
      <div style={{
        background: '#070a12',
        padding: '14px 18px',
        borderRadius: '8px',
        border: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          <strong style={{ color: '#818cf8' }}>🔒 Certified Buyer Protection Rails:</strong> Clients can settle through verified escrow destinations:
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {credentials.escrowRails?.map((rail, i) => (
            <div key={i} style={{
              background: '#0f172a',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #334155',
              fontSize: '11.5px'
            }}>
              <span style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{rail.name}:</span> <span style={{ color: '#38bdf8' }}>{rail.identifier}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
