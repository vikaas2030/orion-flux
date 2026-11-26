import React, { useState } from 'react';

export default function BespokeInvoiceGeneratorWidget({ onDealCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [scope, setScope] = useState('');
  const [phone, setPhone] = useState('');
  const [totalValue, setTotalValue] = useState('30000');
  const [advanceValue, setAdvanceValue] = useState('15000');
  const [pilotValue, setPilotValue] = useState('2500');
  const [loading, setLoading] = useState(false);
  const [createdDeal, setCreatedDeal] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTotalChange = (val) => {
    setTotalValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAdvanceValue(Math.round(num * 0.5).toString());
    }
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    setLoading(true);
    fetch('/api/domestic-closer/custom-deal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: company.trim(),
        scope: scope.trim() || 'Autonomous AI Business Systems & 24x7 Operations Deployment',
        phone: phone.trim() || '919690973030',
        totalValueINR: totalValue,
        advance50INR: advanceValue,
        pilotTokenINR: pilotValue
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.deal) {
          setCreatedDeal(data.deal);
          if (onDealCreated) onDealCreated(data.deal);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #070d1e 0%, #030712 100%)',
      border: '2px solid rgba(56, 189, 248, 0.4)',
      borderRadius: '18px',
      padding: '20px 24px',
      marginBottom: '26px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.12)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOpen ? '16px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#000',
            fontWeight: '900'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '10.5px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                RAPID DEAL DISPATCHER
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Sec 22 CGST Exempt • Signed by <strong style={{ color: '#fff' }}>Vikas Singh</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: '3px 0 0 0' }}>
              Instant Pro-Forma Invoice & Express Pay Link Generator
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: isOpen ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: isOpen ? '#fff' : '#000',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '12.5px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isOpen ? '▲ Close Generator' : '➕ Generate New Deal Link'}
        </button>
      </div>

      {/* Generator Drawer */}
      {isOpen && (
        <form onSubmit={handleCreateDeal} style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Client / Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Royal Gems & Jewelry"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Scope of Work / Deliverables
              </label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="e.g. 24/7 AI Lead Qualifier & Appointment Bot"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                WhatsApp Number (for 1-Tap Send)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9820199881"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '14px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Total Project Fee (INR)
              </label>
              <input
                type="number"
                value={totalValue}
                onChange={(e) => handleTotalChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#10b981', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                50% Milestone Advance (INR)
              </label>
              <input
                type="number"
                value={advanceValue}
                onChange={(e) => setAdvanceValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  color: '#34d399',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#38bdf8', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Pilot Token Option (INR)
              </label>
              <input
                type="number"
                value={pilotValue}
                onChange={(e) => setPilotValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '8px',
                  color: '#38bdf8',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !company.trim()}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#000',
                fontWeight: '900',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
              }}
            >
              {loading ? 'Generating...' : '⚡ Generate Links'}
            </button>
          </div>
        </form>
      )}

      {/* Generated Result Card */}
      {createdDeal && (
        <div style={{
          marginTop: '18px',
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1.5px solid #38bdf8',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                DEAL ACTIVE • LIVE ON CLOUD
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '2px 0 0 0' }}>
                {createdDeal.company} — Advance Due: ₹{createdDeal.advance50INR?.toLocaleString('en-IN')} (Pilot: ₹{createdDeal.pilotTokenINR?.toLocaleString('en-IN')})
              </h3>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Settlement UPI: 9690973030@ibl
            </div>
          </div>

          {/* Quick Action Links */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={`/invoice/${createdDeal.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📄 View & Print Pro-Forma Invoice
            </a>

            <a
              href={`/pay/${createdDeal.slug}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📱 Open Express Checkout Page
            </a>

            <a
              href={`https://wa.me/${createdDeal.phone}?text=${encodeURIComponent(`Namaste!\n\nVikas Singh here (Founder & Managing Principal, ORION FLUX).\n\n${createdDeal.company} ke liye custom AI deployment invoice & payment portal ready hai:\n\n📄 Pro-Forma Invoice: ${window.location.origin}/invoice/${createdDeal.slug}\n⚡ Express Pay: ${window.location.origin}/pay/${createdDeal.slug}\n\n• 50% Advance: ₹${createdDeal.advance50INR?.toLocaleString('en-IN')}\n• Pilot Token: ₹${createdDeal.pilotTokenINR?.toLocaleString('en-IN')} (100% Refundable)\n• Official Settlement UPI: 9690973030@ibl (Vikas Singh)\n• Certified Sec 22 CGST Net-Zero Tax Exemption\n\nDhanyawad,\nVikas Singh | ORION FLUX`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#000',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              💬 1-Click WhatsApp Dispatch to Client
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/pay/${createdDeal.slug}`);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: '#cbd5e1',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {copiedLink ? '✓ Copied!' : '📋 Copy Pay Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
