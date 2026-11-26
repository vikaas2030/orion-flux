import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectShowcase() {
  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      title: 'StudioBot — 24/7 Booking Assistant & Reels Engine',
      client: 'SonicWave Jam Room & Recording Studio',
      category: 'AI Video Ads & Studio Automation',
      techStack: ['Node.js', 'WhatsApp Web API', '1080p CineFlow', 'UPI Gateway'],
      deliveryDate: '2026-10-24',
      qaScore: 100,
      description: 'Autonomous customer intake bot providing instant rate-card delivery, slot booking, and promotional video reels.',
      demoType: 'ecommerce',
      appState: {
        products: [
          { id: 1, name: 'Rehearsal Jam Session (2 Hours)', price: 1500, tag: 'Popular', rating: '4.9 ★', img: '🎸' },
          { id: 2, name: 'Multitrack Recording Package', price: 6000, tag: 'Studio Special', rating: '5.0 ★', img: '🎙️' },
          { id: 3, name: 'AI Motion Video Reel Production', price: 2500, tag: 'New', rating: '4.8 ★', img: '🎬' }
        ],
        cart: []
      }
    },
    {
      id: 'proj-2',
      title: 'HealthCare Intake — Patient Appointment Assistant',
      client: 'Dr Anuja Singh Healthcare Clinic',
      category: 'Healthcare Booking & Telephony',
      techStack: ['React 18', 'Conversational AI', 'Calendar Sync', 'SMS Gateway'],
      deliveryDate: '2026-10-24',
      qaScore: 100,
      description: 'Medical appointment scheduler cutting patient no-shows by 85% with automated intake questions and reminders.',
      demoType: 'fintech',
      appState: {
        balance: 9000,
        transfers: [
          { name: 'Patient Intake Consultation', amount: +1000, date: 'Today' },
          { name: 'Specialist Clinic Slot Booking', amount: +2000, date: 'Yesterday' }
        ]
      }
    },
    {
      id: 'proj-3',
      title: 'Dubai Web Studio — High-Retention SaaS Reels',
      client: 'Dubai Software',
      category: 'SaaS Software & Video Ads',
      techStack: ['React 18', 'Google Veo Prompts', 'CSS Grid', 'PayPal Rail'],
      deliveryDate: '2026-10-24',
      qaScore: 100,
      description: 'High-converting interactive landing page with cinematic video background and automated quote calculator.',
      demoType: 'video',
      appState: {
        views: 14250,
        conversions: 890
      }
    }
  ]);

  const [activeProject, setActiveProject] = useState(projects[0]);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [cartItems, setCartItems] = useState([]);
  const [bankingBalance, setBankingBalance] = useState(245800);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [runnerLogs, setRunnerLogs] = useState([
    '[Runtime] Sandbox initialized successfully.',
    '[Vite HMR] Active in sandbox environment.',
    '[Network] Ready to receive user interactions.'
  ]);

  const addLog = (msg) => {
    setRunnerLogs(prev => [msg, ...prev.slice(0, 8)]);
  };

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    addLog(`[CyberCart] Added "${product.name}" to cart (₹${product.price}). Cart total: ₹${cartItems.reduce((s, i) => s + i.price, 0) + product.price}`);
  };

  const clearCart = () => {
    setCartItems([]);
    addLog('[CyberCart] Cart cleared by user.');
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || !transferRecipient) return;
    if (amt > bankingBalance) return alert('Insufficient balance in sandbox wallet!');

    setBankingBalance(prev => prev - amt);
    addLog(`[FinPulse] Transferred ₹${amt} to ${transferRecipient}. Remaining balance: ₹${bankingBalance - amt}`);
    setTransferAmount('');
    setTransferRecipient('');
  };

  return (
    <div className="project-showcase-page animate-in">
      {/* Top Banner */}
      <div className="glass-card mb-24" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
        borderLeft: '6px solid var(--accent-green)'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-16">
          <div>
            <div className="flex items-center gap-8 flex-wrap">
              <h2 className="text-xl font-bold" style={{ fontSize: '24px' }}>
                🚀 Completed Projects Showcase & Live Runner
              </h2>
              <span className="badge badge-won">100% QA VERIFIED DELIVERIES</span>
              <span className="badge badge-new">INTERACTIVE SANDBOX</span>
            </div>
            <p className="text-sm text-tertiary mt-4">
              Inspect and RUN delivered client projects in an interactive sandbox with real-time UI controls & responsive viewports
            </p>
          </div>

          <div className="flex gap-8">
            <Link to="/projects" className="btn btn-secondary">
              📋 Back to QA Pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* Main Layout: Project Selector Sidebar + Live Runner Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Delivered Projects Roster */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 className="font-bold mb-16 flex items-center justify-between">
            <span>Delivered Projects ({projects.length})</span>
            <span className="badge badge-won">LIVE</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  addLog(`[Sandbox] Switched active runner to "${proj.title}"`);
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: activeProject.id === proj.id ? 'rgba(124, 58, 237, 0.15)' : 'var(--bg-glass)',
                  border: activeProject.id === proj.id ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '13.5px', color: activeProject.id === proj.id ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
                  {proj.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Client: {proj.client}
                </div>
                <div className="flex justify-between items-center mt-8">
                  <span className="badge badge-new" style={{ fontSize: '10px' }}>{proj.category}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                    100% QA Pass ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Interactive Runner & Sandbox */}
        <div>
          {/* Runner Control Bar */}
          <div className="glass-card mb-16 flex justify-between items-center flex-wrap gap-12" style={{ padding: '14px 20px' }}>
            <div className="flex items-center gap-12">
              <span className="badge badge-won">RUNNING LIVE</span>
              <strong style={{ fontSize: '14px' }}>{activeProject.title}</strong>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center gap-8">
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Viewport:</span>
              <button
                className={`btn btn-sm ${deviceMode === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDeviceMode('desktop'); addLog('[Viewport] Switched to Desktop 100%'); }}
              >
                💻 Desktop
              </button>
              <button
                className={`btn btn-sm ${deviceMode === 'tablet' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDeviceMode('tablet'); addLog('[Viewport] Switched to Tablet (768px)'); }}
              >
                📟 Tablet
              </button>
              <button
                className={`btn btn-sm ${deviceMode === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDeviceMode('mobile'); addLog('[Viewport] Switched to Mobile (375px)'); }}
              >
                📱 Mobile
              </button>
            </div>
          </div>

          {/* Interactive Sandbox Canvas */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            background: '#040407',
            padding: '24px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            minHeight: '520px'
          }}>
            <div style={{
              width: deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%',
              transition: 'width 0.3s ease',
              background: '#0d0d16',
              borderRadius: deviceMode === 'mobile' ? '28px' : '12px',
              border: deviceMode === 'mobile' ? '8px solid #222232' : '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
            }}>
              {/* Browser/Device Top Bar */}
              <div style={{
                background: '#161622',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.4)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'monospace',
                  textAlign: 'center'
                }}>
                  https://{activeProject.client.toLowerCase().replace(/\s+/g, '')}.orionflux.app/live
                </div>
              </div>

              {/* LIVE DEMO 1: CyberCart E-Commerce App */}
              {activeProject.demoType === 'ecommerce' && (
                <div style={{ padding: '20px' }}>
                  <div className="flex justify-between items-center mb-20 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ⚡ CyberCart Store
                      </h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Verified Client Deliverable for {activeProject.client}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="badge badge-won">🛒 Cart: {cartItems.length} items</span>
                      {cartItems.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={clearCart}>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: deviceMode === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                    {activeProject.appState.products.map(prod => (
                      <div key={prod.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '38px', marginBottom: '8px' }}>{prod.img}</div>
                        <div className="badge badge-new" style={{ fontSize: '9px', marginBottom: '6px' }}>{prod.tag}</div>
                        <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{prod.name}</h4>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{prod.rating}</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '12px' }}>
                          ₹{prod.price.toLocaleString()}
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => addToCart(prod)}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Live Cart Preview Bar */}
                  {cartItems.length > 0 && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--accent-green)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>Order Total:</strong> ₹{cartItems.reduce((s, i) => s + i.price, 0).toLocaleString()} ({cartItems.length} items)
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        const total = cartItems.reduce((s, i) => s + i.price, 0);
                        const confirmed = window.confirm(`Initiate real UPI Payment of ₹${total.toLocaleString()} to 9690973030@ibl?\n\nClick OK to open UPI app or copy payment instructions.`);
                        if (confirmed) {
                          window.location.href = `upi://pay?pa=9690973030@ibl&pn=OrionFluxAgency&am=${total}&cu=INR&tn=OrionFluxDeliverables`;
                        }
                      }}>
                        🚀 Complete Direct Payment (UPI: 9690973030@ibl)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* LIVE DEMO 2: FinPulse Banking App */}
              {activeProject.demoType === 'fintech' && (
                <div style={{ padding: '20px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    marginBottom: '20px',
                    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
                  }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
                      FinPulse Platinum Card • {activeProject.client}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 6px' }}>
                      ₹{bankingBalance.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.85 }}>
                      Active Business Account • Status: Verified 100%
                    </div>
                  </div>

                  {/* Transfer Simulation Form */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>💸 Instant Sandbox Transfer Test</h4>
                    <form onSubmit={handleTransfer} className="flex gap-8 flex-wrap">
                      <input
                        type="text"
                        className="form-input flex-1"
                        placeholder="Recipient (e.g. Acme Vendor)"
                        required
                        value={transferRecipient}
                        onChange={e => setTransferRecipient(e.target.value)}
                      />
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '120px' }}
                        placeholder="Amount (₹)"
                        required
                        value={transferAmount}
                        onChange={e => setTransferAmount(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        Send Transfer
                      </button>
                    </form>
                  </div>

                  {/* Transactions List */}
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Recent Ledger Events:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeProject.appState.transfers.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '12px' }}>
                        <span>{t.name}</span>
                        <strong style={{ color: t.amount > 0 ? 'var(--accent-green)' : '#f87171' }}>
                          {t.amount > 0 ? `+₹${t.amount.toLocaleString()}` : `-₹${Math.abs(t.amount).toLocaleString()}`}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIVE DEMO 3: CineFlow Video Landing Page */}
              {activeProject.demoType === 'video' && (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{
                    background: 'linear-gradient(180deg, #111827 0%, #030712 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '32px 20px',
                    marginBottom: '20px'
                  }}>
                    <span className="badge badge-proposal mb-12">4K VEO CINEMATIC LAUNCH</span>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '12px 0' }}>
                      Next-Gen AI Automation for Dubai E-Commerce
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px' }}>
                      Experience the verified video ad production campaign delivered for {activeProject.client}.
                    </p>

                    <div style={{
                      width: '100%',
                      maxWidth: '440px',
                      height: '200px',
                      margin: '0 auto 20px',
                      background: '#07070b',
                      borderRadius: '12px',
                      border: '2px dashed var(--accent-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => addLog('[Video Player] User clicked video play. 4K Veo stream buffer: OK.')}
                    >
                      <div>
                        <div style={{ fontSize: '42px', color: 'var(--accent-purple)' }}>▶️</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Click to Play Orion Studio 4K Veo Campaign Preview</div>
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={() => addLog('[Lead Event] Client landing page CTA clicked!')}>
                      🚀 Claim Exclusive Launch Offer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sandbox Live Runtime Console */}
          <div className="glass-card mt-16" style={{ padding: '16px', background: '#07070b' }}>
            <div className="flex justify-between items-center mb-8">
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                🟢 SANDBOX RUNTIME TERMINAL & EVENT STREAM
              </span>
              <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '10px' }} onClick={() => setRunnerLogs([])}>
                Clear Console
              </button>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {runnerLogs.map((log, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '2px' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
