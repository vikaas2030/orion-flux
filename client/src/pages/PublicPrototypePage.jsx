import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InstitutionalHeritageTrustBanner from '../components/Trust/InstitutionalHeritageTrustBanner';

export default function PublicPrototypePage() {
  const { id } = useParams();
  const [prototype, setPrototype] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chat simulator state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Claim modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  useEffect(() => {
    const targetId = id || 'client-demo';
    fetch(`/api/flywheel/prototype/${targetId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.prototype) {
          setPrototype(d.prototype);
          setSelectedPkg(d.prototype.packages?.[0] || null);
          setMessages([
            { sender: 'bot', text: d.prototype.welcomeMessage, time: 'Just now' }
          ]);
        } else {
          // If no specific prototype, create a default high-value preview
          fetch('/api/flywheel/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName: targetId.replace(/-/g, ' ') || 'Your Business', industry: 'localbusiness' })
          })
            .then(r => r.json())
            .then(genData => {
              if (genData.success) {
                setPrototype(genData.prototype);
                setSelectedPkg(genData.prototype.packages?.[0] || null);
                setMessages([
                  { sender: 'bot', text: genData.prototype.welcomeMessage, time: 'Just now' }
                ]);
              } else {
                setError('Prototype not found.');
              }
            })
            .catch(() => setError('Error loading demo.'));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/flywheel/chat-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prototypeId: prototype?.prototypeId,
          message: userMsg
        })
      });
      const data = await res.json();
      setIsTyping(false);
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply, time: 'Just now' }]);
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Thank you! We have received your query.', time: 'Just now' }]);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!utrInput.trim()) return;

    setIsClaiming(true);
    try {
      const res = await fetch('/api/flywheel/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prototypeId: prototype?.prototypeId,
          packageId: selectedPkg?.id,
          utrNumber: utrInput.trim(),
          buyerName: buyerName || prototype?.clientName,
          buyerPhone: buyerPhone || prototype?.phone
        })
      });
      const data = await res.json();
      if (data.success) {
        setClaimResult(data);
      } else {
        alert(data.message || 'Payment verification failed.');
      }
    } catch (err) {
      alert('Error verifying payment: ' + err.message);
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading Interactive AI Prototype...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 100%)',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 16px'
    }}>
      {/* Top Bar */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="flex items-center gap-10">
          <span style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#000',
            fontWeight: 900,
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            ⚡ LIVE INTERACTIVE PROTOTYPE
          </span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Built specifically for <strong style={{ color: '#fff' }}>{prototype?.companyName}</strong>
          </span>
        </div>

        <button
          onClick={() => setShowClaimModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '13px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}>
          ⚡ Claim & Connect to WhatsApp (₹999)
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* 🏛️ Decades of Excellence (Est. 2014) Institutional Heritage & $14.8M+ Track Record Trust Banner */}
        <InstitutionalHeritageTrustBanner compact={true} />
        {/* Banner with Audit Score */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px', color: '#fff' }}>
              {prototype?.companyName} — 24/7 AI Receptionist
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Role: <strong style={{ color: '#10b981' }}>{prototype?.systemRole}</strong> | Target City: <span style={{ color: '#cbd5e1' }}>{prototype?.city}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>ESTIMATED MISSED REVENUE</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
                ₹{prototype?.auditMetrics?.estimatedMonthlyLostRevenueINR?.toLocaleString()} / mo
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>AI RESPONSE SPEED</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                3.2 Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Chat Sandbox and Package Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Chat Simulator */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '520px',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '14px 18px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{prototype?.companyName} Assistant</div>
                  <div style={{ fontSize: '11px', color: '#10b981' }}>Online & Ready for Inquiries</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Interactive Simulator</span>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: m.sender === 'user' ? '#2563eb' : 'rgba(30, 41, 59, 0.8)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)'
                  }}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.8)', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#94a3b8' }}>
                  AI is typing...
                </div>
              )}
            </div>

            {/* Quick Test Questions */}
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {prototype?.faqs?.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(faq.q);
                  }}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                  💬 {faq.q}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask your custom bot anything..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: '#10b981',
                  color: '#000',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                Send
              </button>
            </form>
          </div>

          {/* Pricing & Claim Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
              Claim & Deploy This System to Your WhatsApp
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              Zero coding required. Once you complete the self-serve UPI payment, our system instantly issues your Commercial License Key and deploys the bot to your phone number.
            </p>

            {(prototype?.packages || []).map(pkg => (
              <div
                key={pkg.id}
                onClick={() => {
                  setSelectedPkg(pkg);
                  setShowClaimModal(true);
                }}
                style={{
                  background: pkg.isPopular ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)' : 'rgba(15, 23, 42, 0.7)',
                  border: pkg.isPopular ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{pkg.name}</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>₹{pkg.priceINR.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>{pkg.description}</div>
                <button
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    background: pkg.isPopular ? '#10b981' : '#1e293b',
                    color: pkg.isPopular ? '#000' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer'
                  }}>
                  ⚡ Instant UPI Checkout (₹{pkg.priceINR})
                </button>
              </div>
            ))}

            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              🏛️ Official Settlement Rail: <strong style={{ color: '#10b981' }}>9690973030@ibl</strong> (Vikas Singh) | 100% Money-Back Satisfaction Guarantee.
            </div>
          </div>
        </div>
      </div>

      {/* Claim & Settlement Modal */}
      {showClaimModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '20px',
            maxWidth: '540px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            <button
              onClick={() => { setShowClaimModal(false); setClaimResult(null); }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer'
              }}>
              ✕
            </button>

            {!claimResult ? (
              <div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 900, textTransform: 'uppercase' }}>
                  ⚡ SECURE INSTANT SETTLEMENT
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '6px 0 16px', color: '#fff' }}>
                  Deploy to WhatsApp: {selectedPkg?.name}
                </h3>

                {/* QR Code and UPI rail */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                    Pay ₹{selectedPkg?.priceINR?.toLocaleString()} INR
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh&am=${selectedPkg?.priceINR}&cu=INR&tn=License_${prototype?.prototypeId}`)}`}
                    alt="UPI QR Code"
                    style={{ width: '160px', height: '160px', borderRadius: '10px', background: '#fff', padding: '6px' }}
                  />
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                    Scan with PhonePe, Google Pay, Paytm, or BHIM UPI
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                    UPI ID: <span style={{ color: '#10b981' }}>9690973030@ibl</span> (Vikas Singh)
                  </div>
                </div>

                {/* UTR Submission Form */}
                <form onSubmit={handleClaimSubmit} className="space-y-10">
                  <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Your 12-Digit Bank UTR / Transaction Reference Number:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 432198765432"
                      value={utrInput}
                      onChange={e => setUtrInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp Mobile (+91)"
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isClaiming}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      border: 'none',
                      cursor: isClaiming ? 'wait' : 'pointer'
                    }}>
                    {isClaiming ? 'Verifying Bank Transaction...' : '✓ Verify UTR & Generate Commercial License'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', margin: '0 0 8px' }}>
                  Settlement Verified & Active!
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
                  {claimResult.message}
                </p>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>OFFICIAL LICENSE KEY</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace', margin: '4px 0' }}>
                    {claimResult.licenseKey}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                    Amount Settled: ₹{claimResult.amountSettledINR} INR | Payee: {claimResult.managingPrincipal}
                  </div>
                </div>

                <a
                  href={`https://wa.me/919690973030?text=${encodeURIComponent(`Hi Vikas, I just settled ₹${claimResult.amountSettledINR} for my license key: ${claimResult.licenseKey}. Please connect my WhatsApp bot.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#10b981',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}>
                  💬 Open WhatsApp Setup with Vikas (+91 9690973030)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
