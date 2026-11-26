import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DigitalAgreementSealModal from '../components/Portal/DigitalAgreementSealModal';

export default function QuickCheckoutPage() {
  const { slug } = useParams();
  const [dealData, setDealData] = useState(null);
  const [selectedTier, setSelectedTier] = useState('advance'); // 'advance' | 'pilot'
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrResult, setUtrResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 42, seconds: 18 });
  const [showSealModal, setShowSealModal] = useState(false);
  const [ratifiedData, setRatifiedData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sendRadarBeacon = (actionName, currentAmount) => {
    try {
      fetch('/api/hot-intent/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug || 'direct-checkout',
          clientName: dealData?.company || 'Enterprise Prospect',
          action: actionName,
          amount: currentAmount || (selectedTier === 'pilot' ? 2500 : 12500),
          page: window.location.pathname
        })
      }).catch(() => {});
    } catch (_) {}
  };

  useEffect(() => {
    const targetSlug = slug || 'apex';
    // First try domestic closer deals
    fetch('/api/domestic-closer/deals')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.deals) {
          const match = res.deals.find(d => d.slug === targetSlug || d.id === targetSlug) || res.deals[0];
          setDealData(match);
          sendRadarBeacon('PAGE_VIEW', match.advance50INR);
        }
      })
      .catch(() => {});
  }, [slug]);

  const fallbackDeal = {
    company: 'Enterprise Partner',
    scope: 'Autonomous AI Business Systems Deployment',
    totalValueINR: 25000,
    advance50INR: 12500,
    pilotTokenINR: 2500,
    slug: 'partner'
  };

  const deal = dealData || fallbackDeal;
  const isPilot = selectedTier === 'pilot';
  const activeAmount = isPilot ? deal.pilotTokenINR : deal.advance50INR;
  const activeAmountFormatted = `₹${activeAmount?.toLocaleString('en-IN')} INR`;

  const cleanNote = encodeURIComponent(`${isPilot ? 'Pilot Token' : '50% Advance'} - ${deal.company}`.slice(0, 45));
  const payeeName = encodeURIComponent('Vikas Singh');
  const upiUri = `upi://pay?pa=9690973030@ibl&pn=${payeeName}&am=${activeAmount}&cu=INR&tn=${cleanNote}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}`;

  const handleSubmitUtr = (e) => {
    e.preventDefault();
    if (!utrInput.trim()) return;

    sendRadarBeacon('SUBMIT_UTR_ATTEMPT', activeAmount);
    setSubmittingUtr(true);
    fetch(`/api/public-access/client-portal/${deal.slug || 'apex'}/submit-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utrNumber: utrInput.trim(),
        amount: activeAmount,
        paymentMethod: 'Instant UPI Rail (GPay / PhonePe / Paytm)'
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmittingUtr(false);
        setUtrResult(data);
      })
      .catch(err => {
        setSubmittingUtr(false);
        setUtrResult({ success: false, message: err.message });
      });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #020617 0%, #080f1e 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '30px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#070d1e',
        border: '2px solid rgba(16, 185, 129, 0.45)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.15)',
        position: 'relative'
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#000',
              fontWeight: 'bold'
            }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                EXPRESS CHECKOUT • 1-CLICK SETTLEMENT
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '2px 0 0 0', color: '#fff' }}>
                ORION FLUX Autonomous OS
              </h1>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '14px'
          }}>
            🔒 256-Bit Encrypted
          </div>
        </div>

        {/* Priority Deployment Slot Expiry Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⏳</span>
            <div>
              <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                PRIORITY ALLOCATION WINDOW EXPIRES IN:
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                Price freeze & Sec 22 CGST exemption reserved
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '15px',
            fontWeight: '900',
            color: '#f87171',
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '1px'
          }}>
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Billed Entity & Scope Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '14px'
        }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Billed Entity:</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
            {deal.company}
          </div>
          <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
            Scope: {deal.scope}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            Authorized Payee: <strong style={{ color: '#fff' }}>Vikas Singh</strong> (Founder & Managing Principal)
          </div>
        </div>

        {/* Digital Contract Ratification Banner */}
        <div style={{
          background: ratifiedData 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(120, 53, 15, 0.2) 100%)',
          border: `1.5px solid ${ratifiedData ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.4)'}`,
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{ratifiedData ? '🛡️' : '📜'}</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: ratifiedData ? '#34d399' : '#fbbf24' }}>
                {ratifiedData ? 'Agreement Cryptographically Ratified & Sealed' : 'Digital Services Agreement & Buyer Protection'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>
                {ratifiedData 
                  ? `Seal: ${ratifiedData.agreementId} | Signatory: ${ratifiedData.clientName}`
                  : 'Sec 22 CGST Net-Zero Guarantee & 60-Min Refund SLA'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSealModal(true)}
            style={{
              background: ratifiedData ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: ratifiedData ? '#34d399' : '#000',
              border: ratifiedData ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {ratifiedData ? '✓ View Seal' : '✍️ Sign & Seal'}
          </button>
        </div>

        {/* Tier Selector Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '22px'
        }}>
          <button
            type="button"
            onClick={() => {
              setSelectedTier('advance');
              sendRadarBeacon('SELECT_ADVANCE_50', deal.advance50INR);
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: !isPilot ? '#10b981' : 'transparent',
              color: !isPilot ? '#000' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🥇 50% Milestone Advance (₹{deal.advance50INR?.toLocaleString('en-IN')})
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTier('pilot');
              sendRadarBeacon('SELECT_PILOT', deal.pilotTokenINR);
            }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: isPilot ? '#38bdf8' : 'transparent',
              color: isPilot ? '#000' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🛡️ Zero-Risk Pilot (₹{deal.pilotTokenINR?.toLocaleString('en-IN')})
          </button>
        </div>

        {/* Centerpiece Amount & QR Code */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(3, 7, 18, 0.4) 100%)',
          border: '1.5px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>
            {isPilot ? '48-Hour Refundable Pilot Token' : 'Official 50% Milestone Advance'}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: isPilot ? '#38bdf8' : '#10b981', margin: '4px 0 16px 0' }}>
            {activeAmountFormatted}
          </div>

          {/* QR Code Container */}
          <div style={{
            background: '#fff',
            padding: '14px',
            borderRadius: '16px',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            marginBottom: '16px'
          }}>
            <img
              src={qrCodeUrl}
              alt="Scan to Pay via UPI"
              style={{ width: '200px', height: '200px', display: 'block' }}
            />
          </div>

          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '14px' }}>
            Scan with any UPI App: GPay • PhonePe • Paytm • BHIM • CRED
          </div>

          {/* 1-Tap Mobile Payment Button */}
          <a
            href={upiUri}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: isPilot ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000',
              fontWeight: '900',
              fontSize: '13.5px',
              padding: '14px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              transition: 'transform 0.15s'
            }}
          >
            <span>📱</span> Tap to Pay in UPI App (GPay / PhonePe)
          </a>

          {/* Copy UPI ID Pill */}
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>UPI ID:</span>
            <code style={{ fontSize: '12px', color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: '4px' }}>
              9690973030@ibl
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('9690973030@ibl');
                setCopiedVpa(true);
                sendRadarBeacon('COPY_UPI', activeAmount);
                setTimeout(() => setCopiedVpa(false), 2500);
              }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '10.5px',
                padding: '3px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copiedVpa ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Statutory Trust & Guarantee Badges */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '11.5px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛡️</span> 100% Unconditional 48-Hour Money-Back Guarantee (Reversed in 60 mins)
          </div>
          <div style={{ fontSize: '11.5px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📄</span> Section 22 CGST Act Net-Zero Tax Exemption (CERT-CGST-2026-EXEMPT-09)
          </div>
          <div style={{ fontSize: '11.5px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✍️</span> Officially Authorized & Signed by Vikas Singh (Managing Principal)
          </div>

          <Link
            to={`/verify-bond/BOND-2026-${(deal.slug || 'apex').toUpperCase()}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginTop: '4px'
            }}
          >
            📜 View Official Statutory Guarantee Bond Certificate →
          </Link>
        </div>

        {/* Enter Bank UTR Box */}
        <div style={{
          background: '#040712',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '6px' }}>
            Already Paid? Enter 12-Digit Bank UTR / Ref Number:
          </div>
          <form onSubmit={handleSubmitUtr} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. 430198273612"
              value={utrInput}
              onChange={(e) => setUtrInput(e.target.value)}
              className="form-input flex-1"
              style={{ fontSize: '13px', background: '#0a1020', border: '1px solid #1e293b', color: '#fff', padding: '10px 12px', borderRadius: '6px' }}
            />
            <button
              type="submit"
              disabled={submittingUtr || !utrInput.trim()}
              className="btn btn-primary"
              style={{ background: '#10b981', color: '#000', fontWeight: 'bold', fontSize: '12px', padding: '10px 16px' }}
            >
              {submittingUtr ? 'Verifying...' : 'Submit UTR'}
            </button>
          </form>

          {utrResult && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              background: utrResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: utrResult.success ? '#34d399' : '#f87171',
              border: `1px solid ${utrResult.success ? '#10b981' : '#ef4444'}`
            }}>
              {utrResult.message}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to={`/portal/${deal.slug || 'apex'}`} style={{ fontSize: '11.5px', color: '#94a3b8', textDecoration: 'none' }}>
            ← View Full Enterprise VIP Workspace
          </Link>
        </div>

        {/* Digital Agreement Seal Modal */}
        <DigitalAgreementSealModal
          deal={deal}
          isOpen={showSealModal}
          onClose={() => setShowSealModal(false)}
          onRatified={(data) => {
            setRatifiedData(data);
            sendRadarBeacon('AGREEMENT_RATIFIED', activeAmount);
          }}
        />
      </div>
    </div>
  );
}
