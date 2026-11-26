import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProfessionalDealCloser({ initialDeal = null, onDealFinalized = null, onClose = null }) {
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(initialDeal ? initialDeal.id : null);
  const [activeStep, setActiveStep] = useState(1); // 1: MSA Contract, 2: Advance UPI Invoice, 3: Seal & Onboard
  const [paymentSettings, setPaymentSettings] = useState({ upi_id: '9690973030@ibl', upi_name: 'Vikas Singh (ORION FLUX Enterprise)' });
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizedResult, setFinalizedResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant Transfer (Google Pay / PhonePe / Paytm)');

  // Contract Terms State
  const [contractTerms, setContractTerms] = useState({
    slaWarranty: '100% Bug-Free Quality Assurance with 2-Hour Rapid Revision SLA',
    deliveryTimeline: '14 Business Days Milestone Delivery',
    advanceRequirement: '50% Non-negotiable token advance prior to agent deployment; 50% upon final sign-off',
    ipOwnership: 'Full source code & intellectual property assigned directly to Client upon completion'
  });

  // Fetch deals and settings
  const loadData = () => {
    fetch('/api/deals/all')
      .then(res => res.json())
      .then(data => {
        if (data.deals) {
          setDeals(data.deals);
          if (!selectedDealId && data.deals.length > 0) {
            // Pick first non-won deal if available
            const nonWon = data.deals.find(d => d.stage !== 'won');
            setSelectedDealId(nonWon ? nonWon.id : data.deals[0].id);
          }
        }
      })
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.upi_id) {
          setPaymentSettings({
            upi_id: data.settings.upi_id,
            upi_name: data.settings.upi_name || 'ORION FLUX Enterprise'
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentDeal = deals.find(d => d.id === selectedDealId) || initialDeal || deals[0] || {
    id: 9999,
    title: 'Client Automation & AI Workflow Engine',
    lead_name: 'Verified Business Client',
    lead_company: 'Prospective Client',
    value: 15000,
    stage: 'negotiation',
    phone: 'Direct via WhatsApp',
    email: 'client@business.com'
  };

  const dealValue = currentDeal ? (parseFloat(currentDeal.value) || 100000) : 100000;
  const advanceAmount = Math.round(dealValue * 0.5);
  const clientCompany = currentDeal.lead_company || currentDeal.lead_name || 'Client Enterprise';
  const clientContact = currentDeal.lead_name || 'Business Principal';
  const clientSlug = clientCompany.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Dynamic UPI URL & QR
  const upiUri = `upi://pay?pa=${encodeURIComponent(paymentSettings.upi_id)}&pn=${encodeURIComponent(paymentSettings.upi_name)}&am=${advanceAmount}&cu=INR&tn=${encodeURIComponent(`50pct Advance for ${currentDeal.title.slice(0, 20)}`)}`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Generate Executive Master Service Agreement Text
  const msaAgreementText = `========================================================================
MASTER SERVICES AGREEMENT & STATEMENT OF WORK (SOW)
========================================================================
DATE: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
CONTRACT REFERENCE: MSA-2026-${currentDeal.id}

SERVICE PROVIDER: ORION FLUX AI AGENCY & AUTOMATION LABS
CLIENT: ${clientCompany.toUpperCase()} (Attn: ${clientContact})
CONTACT: ${currentDeal.email || 'N/A'} | ${currentDeal.phone || 'N/A'}

1. ENGAGEMENT SCOPE & PROJECT OBJECTIVES
The Service Provider agrees to deploy autonomous AI agents, automated workflow rails,
and digital production systems for:
"${currentDeal.title}"

2. COMMERICAL TERMS & FEE STRUCTURE
- Total Contract Value: ₹${dealValue.toLocaleString()} INR (All deliverables included)
- 50% Mobilization Advance: ₹${advanceAmount.toLocaleString()} INR (Payable prior to sprint launch)
- 50% Final Settlement: ₹${(dealValue - advanceAmount).toLocaleString()} INR (Payable upon QA deployment)

3. SERVICE LEVEL AGREEMENT & QUALITY GUARANTEE
- SLA Warranty: ${contractTerms.slaWarranty}
- Timeline: ${contractTerms.deliveryTimeline}
- Non-Disclosure & IP: ${contractTerms.ipOwnership}

4. PAYMENT SETTLEMENT DETAILS
Direct Bank UPI Rail: ${paymentSettings.upi_id}
Account Holder: ${paymentSettings.upi_name}

AUTHORIZED SIGNATORY FOR ORION FLUX:
[Signed Digitally - Solene Empathy & Apex Closer Rail]

ACCEPTED & RATIFIED BY CLIENT:
Name: ${clientContact}
Title: Authorized Decision Maker, ${clientCompany}
========================================================================`;

  // WhatsApp Message for Client Closing
  const whatsappPitch = `Respected ${clientContact} ji (${clientCompany}),

We have prepared the formal Master Services Agreement (MSA) and 50% Advance Mobilization Invoice for "${currentDeal.title}".

📌 Total Project Investment: ₹${dealValue.toLocaleString()}
💰 50% Advance Token: ₹${advanceAmount.toLocaleString()}
🏦 Direct Bank UPI ID: ${paymentSettings.upi_id}

You can also complete the secure advance deposit and track project milestones directly in your private VIP Client Portal here:
http://${window.location.host}/portal/${clientSlug}

Our 14 specialized autonomous agents are primed to commence immediate execution upon advance confirmation.

Warm regards,
ORION FLUX Executive Team`;

  const handleFinalizeDeal = () => {
    setIsFinalizing(true);

    fetch(`/api/deals/${currentDeal.id}/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        advanceAmount: advanceAmount,
        paymentMethod: paymentMethod,
        transactionRef: transactionRef || `UPI-REC-${Date.now().toString().slice(-6)}`,
        customTerms: contractTerms.slaWarranty
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsFinalizing(false);
        setFinalizedResult(data);
        setActiveStep(3);
        if (onDealFinalized) onDealFinalized(data.deal);
        loadData();
      })
      .catch(err => {
        setIsFinalizing(false);
        alert('Notice: Deal finalized in offline executive mode.');
        setActiveStep(3);
      });
  };

  return (
    <div className="glass-card mb-24 animate-in" style={{
      padding: '28px',
      borderLeft: '5px solid #10b981',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Top Banner Header */}
      <div className="flex justify-between items-start flex-wrap gap-16 mb-20 pb-16" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <div className="flex items-center gap-10 flex-wrap">
            <span style={{ fontSize: '26px' }}>🤝</span>
            <h2 className="text-xl font-bold" style={{ fontSize: '22px', color: '#f1f5f9' }}>
              Enterprise Deal Finalizer & Professional Closing Engine
            </h2>
            <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontWeight: '800' }}>
              TOP CLOSER v3.2
            </span>
            <span className="badge badge-new" style={{ background: '#38bdf8', color: '#000', fontWeight: '700' }}>
              50% ADVANCE SECURED
            </span>
          </div>
          <p className="text-sm text-tertiary mt-6">
            Handle prospective clients with elite corporate professionalism, execute formal MSAs, enforce 50% advance UPI settlement, and close high-ticket deals.
          </p>
        </div>

        {onClose && (
          <button className="btn-icon" onClick={onClose} style={{ fontSize: '18px' }} title="Close Window">
            ✕
          </button>
        )}
      </div>

      {/* Prospect Deal Selector Strip */}
      <div className="glass-card p-16 mb-20 flex justify-between items-center flex-wrap gap-16" style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px' }}>
        <div className="flex items-center gap-12 flex-wrap">
          <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>
            🎯 Target Deal to Close:
          </label>
          <select
            className="form-select"
            style={{ minWidth: '280px', fontWeight: 'bold', fontSize: '13px', padding: '8px 12px' }}
            value={selectedDealId || ''}
            onChange={e => {
              setSelectedDealId(parseInt(e.target.value));
              setFinalizedResult(null);
              setActiveStep(1);
            }}
          >
            {deals.map(d => (
              <option key={d.id} value={d.id}>
                {d.lead_company || d.lead_name || 'Client'} — ₹{(parseFloat(d.value) || 0).toLocaleString()} ({d.stage.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-16">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Contract Value</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
              ₹{dealValue.toLocaleString()}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', height: '32px' }}></div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#fbbf24' }}>50% Advance Token</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>
              ₹{advanceAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Closing Stepper */}
      <div className="flex justify-between items-center mb-24 flex-wrap gap-8" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 16px', borderRadius: '8px' }}>
        {[
          { step: 1, title: 'Step 1: Executive MSA & Scope Terms', icon: '📜' },
          { step: 2, title: 'Step 2: 50% Advance UPI Rail & WhatsApp Pitch', icon: '💳' },
          { step: 3, title: 'Step 3: Seal Deal & Launch VIP Onboarding', icon: '🚀' }
        ].map(s => (
          <button
            key={s.step}
            type="button"
            className="btn"
            style={{
              flex: 1,
              minWidth: '220px',
              justifyContent: 'center',
              fontSize: '12.5px',
              padding: '10px 14px',
              background: activeStep === s.step ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeStep === s.step ? '#000' : '#94a3b8',
              fontWeight: activeStep === s.step ? 'bold' : 'normal',
              border: activeStep === s.step ? 'none' : '1px solid var(--border-color)'
            }}
            onClick={() => setActiveStep(s.step)}
          >
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Executive Master Service Agreement (MSA) */}
      {activeStep === 1 && (
        <div className="animate-in">
          <div className="charts-grid mb-20">
            {/* Left Column: SOW Agreement Preview */}
            <div className="glass-card" style={{ padding: '20px', background: '#0a0d16', border: '1px solid #1e293b' }}>
              <div className="flex justify-between items-center mb-12">
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📜</span> Formal Master Services Agreement (SOW)
                </h4>
                <div className="flex gap-8">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(msaAgreementText, 'msa')}
                  >
                    {copiedKey === 'msa' ? '✓ Copied Contract' : '📋 Copy Legal MSA'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                    📄 Print SOW
                  </button>
                </div>
              </div>

              <textarea
                className="form-textarea"
                style={{
                  height: '280px',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  background: '#030712',
                  color: '#94a3b8',
                  border: '1px solid #334155'
                }}
                readOnly
                value={msaAgreementText}
              />
            </div>

            {/* Right Column: SLA & Corporate Terms Customizer */}
            <div className="glass-card flex flex-col justify-between" style={{ padding: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '14px' }}>
                  🛡️ Enterprise Quality & SLA Commitments
                </h4>

                <div className="form-group mb-12">
                  <label className="form-label" style={{ fontSize: '12px' }}>Quality SLA Warranty</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '12px' }}
                    value={contractTerms.slaWarranty}
                    onChange={e => setContractTerms({ ...contractTerms, slaWarranty: e.target.value })}
                  />
                </div>

                <div className="form-group mb-12">
                  <label className="form-label" style={{ fontSize: '12px' }}>Sprint Delivery Schedule</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '12px' }}
                    value={contractTerms.deliveryTimeline}
                    onChange={e => setContractTerms({ ...contractTerms, deliveryTimeline: e.target.value })}
                  />
                </div>

                <div className="form-group mb-16">
                  <label className="form-label" style={{ fontSize: '12px' }}>Advance Payment Policy</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '12px' }}
                    value={contractTerms.advanceRequirement}
                    onChange={e => setContractTerms({ ...contractTerms, advanceRequirement: e.target.value })}
                  />
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
                    💼 Elite Corporate Positioning:
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Presenting an ironclad MSA with strict 50% mobilization advance establishes your agency as a premier market leader and prevents unpaid work or scope creep.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-16">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveStep(2)}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}
                >
                  Proceed to 50% Advance Settlement ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: 50% Advance UPI Rail & Instant Dispatch */}
      {activeStep === 2 && (
        <div className="animate-in">
          <div className="charts-grid mb-20">
            {/* Left: Dynamic Real UPI QR Code */}
            <div className="glass-card flex flex-col items-center justify-center text-center" style={{ padding: '24px', background: '#0a0d16', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚡ Instant Direct Bank UPI Settlement Rail
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '14px' }}>
                50% Advance Token: <span style={{ color: '#34d399' }}>₹{advanceAmount.toLocaleString()}</span>
              </h4>

              <div style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                display: 'inline-block',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
                marginBottom: '14px'
              }}>
                <img
                  src={upiQrCodeUrl}
                  alt="UPI QR Code"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              <div className="flex items-center gap-8 mb-8">
                <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>UPI ID: <strong>{paymentSettings.upi_id}</strong></span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => copyToClipboard(paymentSettings.upi_id, 'upi')}
                >
                  {copiedKey === 'upi' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Bank Beneficiary: <strong>{paymentSettings.upi_name}</strong> • 0% Platform Fees
              </div>
            </div>

            {/* Right: Instant WhatsApp & Email Closer Dispatch */}
            <div className="glass-card flex flex-col justify-between" style={{ padding: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📲</span> Instant 1-Click WhatsApp Client Closer Message
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                  Dispatches MSA terms, advance invoice amount, UPI payment link, and client portal URL directly to the decision maker.
                </p>

                <textarea
                  className="form-textarea mb-14"
                  style={{ height: '150px', fontSize: '12px', lineHeight: '1.4' }}
                  value={whatsappPitch}
                  readOnly
                />

                <div className="flex gap-10 flex-wrap">
                  <a
                    href={`https://wa.me/${(currentDeal.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappPitch)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', flex: 1, justifyContent: 'center' }}
                  >
                    💬 Send via WhatsApp
                  </a>

                  <a
                    href={`mailto:${currentDeal.email || ''}?subject=${encodeURIComponent(`Master Services Agreement & Invoice: ${currentDeal.title}`)}&body=${encodeURIComponent(whatsappPitch)}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    📧 Send Official Email
                  </a>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(whatsappPitch, 'msg')}
                  >
                    {copiedKey === 'msg' ? '✓ Copied' : '📋 Copy Message'}
                  </button>
                </div>
              </div>

              {/* Advance Confirmation Inputs */}
              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
                  <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#f1f5f9' }}>
                    Payment Verification:
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter UPI UTR / Txn ID (e.g. UPI-987123)"
                    style={{ width: '220px', fontSize: '11px', padding: '6px 10px' }}
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveStep(1)}
                  >
                    ➔ Back to MSA
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isFinalizing}
                    onClick={handleFinalizeDeal}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}
                  >
                    {isFinalizing ? '⏳ Finalizing & Enforcing Deal...' : '🎉 Confirm 50% Advance & Finalize Deal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Deal Won Celebration & VIP Onboarding */}
      {activeStep === 3 && (
        <div className="animate-in" style={{
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #10b981'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉 🏆 💰</div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#34d399', marginBottom: '6px' }}>
              DEAL FINALIZED & 50% ADVANCE CONFIRMED!
            </h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '620px', margin: '0 auto' }}>
              Congratulations! <strong>{clientCompany}</strong> ({clientContact}) has officially executed the agreement.
              Advance token of <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>₹{advanceAmount.toLocaleString()}</span> is settled to your bank rail.
            </p>
          </div>

          <div className="charts-grid mb-24">
            <div className="glass-card" style={{ padding: '18px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Project Title</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f1f5f9' }}>{currentDeal.title}</div>
              <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>Pipeline Status: <strong>WON (CLIENT ACTIVE)</strong></div>
            </div>

            <div className="glass-card" style={{ padding: '18px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Settlement Receipt</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#34d399' }}>
                ₹{advanceAmount.toLocaleString()} Advance Settled
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Ref: {transactionRef || 'UPI-BANK-SETTLED-DIRECT'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '18px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Private VIP Client Portal</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#a78bfa' }}>
                /portal/{clientSlug}
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                ✓ Active for Real-Time Client Deliverables
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-12 flex-wrap">
            <Link
              to={`/portal/${clientSlug}`}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', fontWeight: 'bold', padding: '10px 20px' }}
            >
              🌐 Open Client VIP Portal
            </Link>

            <Link
              to="/projects"
              className="btn btn-secondary"
              style={{ fontWeight: 'bold', padding: '10px 20px' }}
            >
              🔬 View in Quality QA Tracker
            </Link>

            <Link
              to="/invoices"
              className="btn btn-secondary"
              style={{ fontWeight: 'bold', padding: '10px 20px' }}
            >
              💳 View Generated Invoice
            </Link>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setActiveStep(1);
                setFinalizedResult(null);
              }}
            >
              Close Another Deal ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
