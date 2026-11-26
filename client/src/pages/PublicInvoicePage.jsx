import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PublicInvoicePage() {
  const { slug } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetSlug = slug || 'anuja-clinic';
    fetch('/api/domestic-closer/deals')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.deals) {
          const match = res.deals.find(d => d.slug === targetSlug || d.id === targetSlug) || res.deals[0];
          setDeal(match);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const fallbackDeal = {
    company: 'Enterprise Partner Client',
    scope: 'Autonomous AI Business Systems & High-Velocity Deployment',
    totalValueINR: 25000,
    advance50INR: 12500,
    pilotTokenINR: 2500,
    slug: 'partner'
  };

  const activeDeal = deal || fallbackDeal;
  const invoiceNo = `ORION-PRO-${(activeDeal.slug || 'INV').toUpperCase()}-2026`;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const validUntil = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const cleanNote = encodeURIComponent(`50% Advance - ${activeDeal.company}`.slice(0, 45));
  const payeeName = encodeURIComponent('Vikas Singh');
  const upiUri = `upi://pay?pa=9690973030@ibl&pn=${payeeName}&am=${activeDeal.advance50INR}&cu=INR&tn=${cleanNote}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090e1a',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '40px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <style>{`
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .invoice-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            background: #fff !important;
            color: #000 !important;
          }
          .invoice-table th, .invoice-table td {
            color: #000 !important;
            border-bottom: 1px solid #ddd !important;
          }
          .highlight-box {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Top Floating Control Bar (Hidden in Print) */}
      <div className="no-print" style={{
        maxWidth: '820px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            📄 OFFICIAL PRO-FORMA INVOICE
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Authorized Payee: <strong style={{ color: '#fff' }}>Vikas Singh</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '12.5px',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🖨️ Print / Save as PDF
          </button>

          <Link
            to={`/pay/${activeDeal.slug || 'apex'}`}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontSize: '12.5px',
              fontWeight: '900',
              padding: '8px 18px',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}
          >
            ⚡ Pay 50% Advance Online
          </Link>
        </div>
      </div>

      {/* Main Corporate Invoice Paper Document */}
      <div className="invoice-card" style={{
        maxWidth: '820px',
        width: '100%',
        background: '#0d1527',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '900',
                color: '#000'
              }}>
                OF
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, letterSpacing: '0.5px', color: '#fff' }}>
                ORION FLUX AUTONOMOUS SYSTEMS
              </h1>
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.4' }}>
              Autonomous Business AI Engineering & High-Ticket Deployment OS<br />
              New Delhi / Mumbai Financial Hub • Global Operations<br />
              Managing Principal: <strong style={{ color: '#fff' }}>Vikas Singh</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              PRO-FORMA INVOICE
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginTop: '3px' }}>
              #{invoiceNo}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Date: <strong style={{ color: '#cbd5e1' }}>{today}</strong><br />
              Valid Until: <strong style={{ color: '#cbd5e1' }}>{validUntil}</strong>
            </div>
          </div>
        </div>

        {/* Client & Statutory Compliance Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
          <div className="highlight-box" style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              BILLED TO (CLIENT ENTITY)
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              {activeDeal.company}
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
              Scope: {activeDeal.scope}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
              Account Verification: Enterprise Qualified Domestic Rail
            </div>
          </div>

          <div className="highlight-box" style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '10.5px', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
              STATUTORY COMPLIANCE & TAX STATUS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              Section 22 CGST Act 2017 Net-Zero Exemption
            </div>
            <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '4px' }}>
              Certificate ID: <code>CERT-CGST-2026-EXEMPT-09</code>
            </div>
            <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
              ✓ 100% All-Inclusive Net Pricing (₹0 Hidden Surcharge)
            </div>
          </div>
        </div>

        {/* Deliverables & Pricing Line Items */}
        <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'left' }}>
              <th style={{ padding: '12px 8px', fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Item / Milestone Description</th>
              <th style={{ padding: '12px 8px', fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Timeline</th>
              <th style={{ padding: '12px 8px', fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <td style={{ padding: '14px 8px' }}>
                <strong style={{ color: '#fff', fontSize: '13.5px' }}>Milestone 1: Autonomous AI Engine Setup & Core Configuration</strong>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                  Complete production deployment of client pipeline automation, WhatsApp cloud synchronization, and 24x7 telemetry.
                </div>
              </td>
              <td style={{ padding: '14px 8px', textAlign: 'center', fontSize: '12px', color: '#38bdf8' }}>Day 1–3</td>
              <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: 'bold', color: '#fff', fontSize: '13.5px' }}>
                ₹{activeDeal.advance50INR?.toLocaleString('en-IN')}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <td style={{ padding: '14px 8px' }}>
                <strong style={{ color: '#fff', fontSize: '13.5px' }}>Milestone 2: Final Handover, Staff Training & SLA Activation</strong>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                  Full production verification, executive credentials handover, and 12-month autonomous uptime SLA.
                </div>
              </td>
              <td style={{ padding: '14px 8px', textAlign: 'center', fontSize: '12px', color: '#38bdf8' }}>On Handover</td>
              <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: 'bold', color: '#fff', fontSize: '13.5px' }}>
                ₹{(activeDeal.totalValueINR - activeDeal.advance50INR)?.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Financial Summary & Bank Settlement Box */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
          {/* Bank Settlement Details with QR */}
          <div className="highlight-box" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <img
              src={qrCodeUrl}
              alt="UPI QR Code"
              style={{ width: '110px', height: '110px', borderRadius: '8px', background: '#fff', padding: '4px', display: 'block' }}
            />
            <div>
              <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                OFFICIAL SETTLEMENT UPI RAIL
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                Vikas Singh
              </div>
              <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>
                VPA: <code>9690973030@ibl</code>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Apps: GPay • PhonePe • Paytm • BHIM
              </div>
            </div>
          </div>

          {/* Amount Calculation Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#94a3b8' }}>
              <span>Total Project Value:</span>
              <strong style={{ color: '#fff' }}>₹{activeDeal.totalValueINR?.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#94a3b8' }}>
              <span>Applicable Taxes (Sec 22 CGST):</span>
              <strong style={{ color: '#34d399' }}>₹0.00 (Exempt)</strong>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>50% Advance Due Now:</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#34d399' }}>
                ₹{activeDeal.advance50INR?.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#38bdf8', textAlign: 'right' }}>
              (Or Optional Zero-Risk Pilot: ₹{activeDeal.pilotTokenINR?.toLocaleString('en-IN')})
            </div>
          </div>
        </div>

        {/* Digital Signature & Statutory Stamp */}
        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Statutory Protection:</div>
            <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '2px' }}>
              🛡️ 100% Unconditional 48-Hour Money-Back Guarantee
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-block',
              border: '1.5px dashed rgba(16, 185, 129, 0.5)',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.05)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '900', color: '#34d399', letterSpacing: '0.5px' }}>
                ✓ DIGITALLY AUTHORIZED
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                Vikas Singh
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Founder & Managing Principal, Orion Flux
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
