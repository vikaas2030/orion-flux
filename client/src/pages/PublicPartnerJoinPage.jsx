import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function PublicPartnerJoinPage() {
  const [searchParams] = useSearchParams();
  const preCode = searchParams.get('code') || '';
  const preName = searchParams.get('name') || '';
  const preCountry = searchParams.get('country') || 'India';
  const preCity = searchParams.get('city') || (preCountry === 'India' ? 'New Delhi' : '');

  const [formData, setFormData] = useState({
    agencyName: preName,
    name: '',
    email: '',
    phone: '',
    city: preCity || 'New Delhi',
    country: preCountry || 'India',
    paymentRail: '',
    tier: 'silver',
    partnerCode: preCode
  });

  const [loading, setLoading] = useState(false);
  const [registeredPartner, setRegisteredPartner] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (preName && !formData.agencyName) {
      setFormData(prev => ({ ...prev, agencyName: preName }));
    }
    if (preCode && !formData.partnerCode) {
      setFormData(prev => ({ ...prev, partnerCode: preCode }));
    }
    if (preCountry && formData.country === 'India' && preCountry !== 'India') {
      setFormData(prev => ({ ...prev, country: preCountry, city: preCity || prev.city }));
    }
  }, [preCode, preName, preCountry, preCity]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectTier = (tier) => {
    setFormData({ ...formData, tier });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agencyName && !formData.name) {
      setErrorMsg('Please enter your Agency or Full Name');
      return;
    }
    if (!formData.phone) {
      setErrorMsg('Please provide a WhatsApp contact phone number');
      return;
    }
    if (!formData.paymentRail) {
      setErrorMsg('Please specify your UPI ID or Bank Account for commission payouts');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/partner/public-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.partner) {
        setRegisteredPartner(data.partner);
      } else {
        setErrorMsg(data.message || 'Registration encountered an error. Please retry.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error: ' + err.message);
    }
  };

  const copyRefLink = () => {
    if (!registeredPartner) return;
    const url = registeredPartner.refUrl || `${window.location.origin}/ref/${registeredPartner.partnerCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getWhatsAppShareUrl = () => {
    if (!registeredPartner) return '#';
    const url = registeredPartner.refUrl || `${window.location.origin}/ref/${registeredPartner.partnerCode}`;
    const text = encodeURIComponent(
      `Hey! Check out ORION FLUX Autonomous Global OS for high-impact AI WhatsApp bots, custom software & 4K cinematic ads. Get full details and instant quote here:\n${url}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Top Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            padding: '6px 14px',
            borderRadius: '24px',
            fontSize: '12px',
            color: '#60a5fa',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            <span>🌐</span> ORION FLUX GLOBAL AFFILIATE & DISTRIBUTION NETWORK
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Partner Onboarding & Revenue Share Portal
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8', lineHeight: '1.5' }}>
            Earn <strong>15% – 25% recurring rev-share</strong> on enterprise AI software, 4K production, & automated intake systems.
            <br />
            100% genuine payouts settled directly to your UPI / Bank account.
          </p>
        </div>

        {/* Success View */}
        {registeredPartner ? (
          <div style={{
            background: 'linear-gradient(180deg, #090e1a 0%, #04070d 100%)',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(34, 197, 94, 0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                lineHeight: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                fontSize: '28px',
                margin: '0 auto 16px auto'
              }}>
                ✓
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', color: '#f8fafc' }}>
                Welcome Aboard, {registeredPartner.agencyName || registeredPartner.name}!
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#86efac' }}>
                Your Partner Account is Active & Verified • Rev-Share Tier: <strong>{registeredPartner.commissionPct}%</strong>
              </p>
            </div>

            {/* Referral Link Box */}
            <div style={{
              background: '#0a101d',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
                Your Official Tracking & Referral Link:
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#030712',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                flexWrap: 'wrap'
              }}>
                <code style={{ fontSize: '14px', color: '#38bdf8', flex: 1, wordBreak: 'break-all' }}>
                  {registeredPartner.refUrl || `${window.location.origin}/ref/${registeredPartner.partnerCode}`}
                </code>
                <button
                  type="button"
                  onClick={copyRefLink}
                  style={{
                    background: copiedLink ? '#22c55e' : '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedLink ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
                Every client who clicks this link and closes a deal automatically credits <strong>{registeredPartner.commissionPct}%</strong> of the contract to your payout balance.
              </div>
            </div>

            {/* Partner Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginBottom: '24px'
            }}>
              <div style={{ background: '#0a101d', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Partner Code</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{registeredPartner.partnerCode}</div>
              </div>
              <div style={{ background: '#0a101d', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Settlement Rail</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8', wordBreak: 'break-all' }}>
                  {registeredPartner.paymentRail}
                </div>
              </div>
              <div style={{ background: '#0a101d', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Commission Rate</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#4ade80' }}>
                  {registeredPartner.commissionPct}% of Contract Value
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  background: '#25D366',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
                }}
              >
                📱 Share Referral on WhatsApp
              </a>
              <Link
                to={`/ref/${registeredPartner.partnerCode}`}
                style={{
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: '1px solid #334155'
                }}
              >
                Test My Tracking Link →
              </Link>
            </div>

            {/* Compliance Guarantee */}
            <div style={{
              marginTop: '28px',
              borderTop: '1px solid #1e293b',
              paddingTop: '18px',
              fontSize: '12px',
              color: '#64748b',
              lineHeight: '1.6'
            }}>
              ⚖️ <strong>Legal & Tax Compliance</strong>: Administered under Section 22 CGST Act Net-Zero compliance. Authorized Signatory: <strong>Vikas Singh (Founder & Managing Principal)</strong>. Direct settlements managed via UPI <code>9690973030@ibl</code> or PayPal.
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div style={{
            background: 'linear-gradient(180deg, #090e1a 0%, #04070d 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Rev-Share Tier Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '10px', fontWeight: '600' }}>
                  Select Partnership Structure:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  
                  {/* Bronze */}
                  <div
                    onClick={() => handleSelectTier('bronze')}
                    style={{
                      background: formData.tier === 'bronze' ? 'rgba(59, 130, 246, 0.15)' : '#070b14',
                      border: formData.tier === 'bronze' ? '2px solid #3b82f6' : '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#cbd5e1' }}>Bronze Affiliate</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8' }}>15%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      For individual creators & tech referrers.
                    </div>
                  </div>

                  {/* Silver */}
                  <div
                    onClick={() => handleSelectTier('silver')}
                    style={{
                      background: formData.tier === 'silver' ? 'rgba(59, 130, 246, 0.2)' : '#070b14',
                      border: formData.tier === 'silver' ? '2px solid #60a5fa' : '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '14px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '10px',
                      background: '#2563eb',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '8px'
                    }}>
                      MOST POPULAR
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Silver Agency</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#60a5fa' }}>20%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      For digital agencies, dev shops & consultants.
                    </div>
                  </div>

                  {/* Gold */}
                  <div
                    onClick={() => handleSelectTier('gold')}
                    style={{
                      background: formData.tier === 'gold' ? 'rgba(234, 179, 8, 0.15)' : '#070b14',
                      border: formData.tier === 'gold' ? '2px solid #eab308' : '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#fef08a' }}>Gold Sovereign</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#eab308' }}>25%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      For high-volume distribution networks.
                    </div>
                  </div>

                </div>
              </div>

              {/* Input Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Agency / Brand Name *
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Growth Labs"
                    required
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Primary Contact Person *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    required
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. partner@agency.com"
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    City & Country
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                    Preferred Payout Rail (UPI ID / PayPal) *
                  </label>
                  <input
                    type="text"
                    name="paymentRail"
                    value={formData.paymentRail}
                    onChange={handleChange}
                    placeholder="e.g. yourname@okhdfcbank or paypal.me/..."
                    required
                    style={{
                      width: '100%',
                      background: '#04070d',
                      border: '1px solid #1e293b',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Commission Simulation Callout */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px dashed #334155',
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '24px',
                fontSize: '12px',
                color: '#94a3b8',
                lineHeight: '1.5'
              }}>
                💡 <strong>Earnings Example</strong>: If you refer a client closing a ₹50,000 standard AI Intake Bot contract, your <strong>{formData.tier === 'bronze' ? '15%' : formData.tier === 'gold' ? '25%' : '20%'} rev-share</strong> delivers an instant payout of <strong>₹{formData.tier === 'bronze' ? '7,500' : formData.tier === 'gold' ? '12,500' : '10,000'}</strong> straight to your UPI ID upon milestone clearance.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
                  transition: 'opacity 0.2s'
                }}
              >
                {loading ? 'Activating Partner Link...' : '🚀 Activate My Partner Tracking Link & Rev-Share'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
