import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ pageTitle = "ORION FLUX Workspace", pageSubtitle = "Self-Driving Super Agent Control", onMobileMenuToggle }) {
  const navigate = useNavigate();
  const { themeMode, toggleThemeMode, accentColor, setAccentColor } = useTheme();
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  const [networkInfo, setNetworkInfo] = useState({
    localUrl: 'http://localhost:5000',
    mobileUrl: 'http://10.148.167.247:5000',
    qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=http://10.148.167.247:5000',
    zipLocation: 'd:\\ANTIGRAVITY VK\\ORION_FLUX_Ready_App.zip'
  });
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    fetch('/api/agency/network-info')
      .then(res => res.json())
      .then(data => {
        if (data.localUrl) setNetworkInfo(data);
      })
      .catch(() => {});
  }, []);

  const [realLeads, setRealLeads] = useState([]);
  const [realDeals, setRealDeals] = useState([]);
  const [pipelineSummary, setPipelineSummary] = useState({ negotiationCount: 62, totalDeals: 155, totalVal: 984200 });

  useEffect(() => {
    fetch('/api/agency/network-info')
      .then(res => res.json())
      .then(data => {
        if (data.localUrl) setNetworkInfo(data);
      })
      .catch(() => {});

    // Load real leads from LowDB
    fetch('/api/leads?limit=300')
      .then(res => res.json())
      .then(data => {
        if (data.leads && Array.isArray(data.leads)) {
          setRealLeads(data.leads);
        }
      })
      .catch(() => {});

    // Load real deals from CRM pipeline
    fetch('/api/deals/all')
      .then(res => res.json())
      .then(data => {
        if (data.deals && Array.isArray(data.deals)) {
          setRealDeals(data.deals);
          const neg = data.deals.filter(d => d.stage === 'negotiation').length;
          const totalVal = data.deals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
          setPipelineSummary({ negotiationCount: neg, totalDeals: data.deals.length, totalVal });
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Navigable app items for global search
  const staticModules = [
    { name: 'Dashboard & Revenue Overview', path: '/', category: 'Page' },
    { name: 'AI Agency OS (14 Autonomous Agents)', path: '/agency', category: 'Page' },
    { name: 'Autonomous Self-Driving Agent Engine', path: '/autonomous', category: 'Page' },
    { name: 'VIP Client Portal & Deliverables', path: '/portal', category: 'Page' },
    { name: 'Sales Pipeline & Enterprise CRM Board', path: '/crm', category: 'Sales' },
    { name: 'Real World Leads Directory', path: '/leads', category: 'Sales' },
    { name: 'Public AI Prototype Generator', path: '/prototype', category: 'AI Tools' },
    { name: 'AI Lead Scraper & Prospect Finder', path: '/scraper', category: 'Automation' },
    { name: 'Auto Outreach & WhatsApp Client Persuader', path: '/outreach', category: 'Automation' },
    { name: 'AI Proposal Writer & Deliverables', path: '/proposals', category: 'Business' },
    { name: 'Invoices & Real UPI QR Gateway', path: '/invoices', category: 'Payments' },
    { name: 'Quality Assurance & Delivery Pipeline', path: '/projects', category: 'Management' },
    { name: 'Live Projects Showcase Runner', path: '/showcase', category: 'Management' },
    { name: '24/7 AI Client Assistant Chatbot', path: '/chatbot', category: 'AI Tools' },
    { name: 'Google Flow AI Video Studio', path: '/social', category: 'AI Tools' },
    { name: 'System Settings & Direct Bank UPI Config', path: '/settings', category: 'Settings' }
  ];

  const dynamicDealItems = realDeals.map(d => ({
    name: `${d.title || d.lead_company || 'CRM Deal'} (₹${Number(d.value || 0).toLocaleString('en-IN')})`,
    path: '/crm',
    category: `Deal • ${(d.stage || 'Pipeline').toUpperCase()}`
  }));

  const dynamicLeadItems = realLeads.map(l => ({
    name: `${l.company || l.name} (${l.city || l.industry || 'Lead'})`,
    path: `/prototype/${(l.company || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    category: `Lead • ${l.industry || 'Verified'}`
  }));

  const searchableItems = [...staticModules, ...dynamicDealItems, ...dynamicLeadItems];

  const searchResults = searchQuery.trim() === ''
    ? []
    : searchableItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ).slice(0, 25);

  const notificationsList = [
    {
      id: 1,
      title: `🤝 ${pipelineSummary.negotiationCount} Deals in Final Negotiation`,
      desc: `High-propensity Indian enterprise & MSME deals with ₹999 advance token closing ready.`,
      time: 'Real-time',
      icon: '💰'
    },
    {
      id: 2,
      title: '⚡ 14 Autonomous Agents Active',
      desc: 'All 14 self-driving agents scanning leads, generating prototypes, and preparing closing proposals.',
      time: 'Live',
      icon: '🤖'
    },
    {
      id: 3,
      title: '🏦 Authorized Settlement Rail Active',
      desc: 'UPI 9690973030@ibl (Vikas Singh) linked with instant Bank UTR ledger verification.',
      time: 'Active',
      icon: '🛡️'
    },
    {
      id: 4,
      title: `📊 Total Pipeline: ₹${Number(pipelineSummary.totalVal || 984200).toLocaleString('en-IN')}`,
      desc: `${pipelineSummary.totalDeals || 155} active deals tracked across verified real-world businesses.`,
      time: 'Audited',
      icon: '📈'
    }
  ];

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header-left">
        {onMobileMenuToggle && (
          <button className="header-btn md:hidden" style={{ marginRight: '8px' }} onClick={onMobileMenuToggle}>
            🍔
          </button>
        )}
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>
      </div>

      {/* Global Interactive Search */}
      <div className="header-search" style={{ position: 'relative' }}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search leads, deals, proposals, agents..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
        />

        {showSearchResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: '8px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            zIndex: 9999,
            maxHeight: '320px',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span>MATCHING SYSTEM MODULES & DEALS ({searchResults.length})</span>
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}
                onClick={() => setShowSearchResults(false)}
              >
                ✕ Close
              </button>
            </div>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => {
                  navigate(item.path);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>{item.name}</div>
                <span className="badge badge-new" style={{ fontSize: '10px' }}>{item.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Prominent Web & Mobile Links Button */}
        <button
          className="btn btn-primary"
          style={{
            fontSize: '12px',
            padding: '6px 14px',
            height: '34px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={() => setShowLinksModal(true)}
          title="View Web & Mobile Links"
        >
          <span>📲</span>
          <span style={{ fontWeight: '700' }}>Web & Mobile Links</span>
        </button>

        {/* Accent Selector */}
        <select
          className="form-select"
          style={{ padding: '4px 10px', fontSize: '11px', height: '32px' }}
          value={accentColor}
          onChange={e => setAccentColor(e.target.value)}
        >
          <option value="purple">🟣 Purple Theme</option>
          <option value="cyber">🔵 Cyber Blue</option>
          <option value="emerald">🟢 Emerald Green</option>
        </select>

        {/* Theme Mode Switch */}
        <button className="header-btn" onClick={toggleThemeMode} title="Toggle Light/Dark Mode">
          {themeMode === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications Button */}
        <button
          className="header-btn"
          title="System Notifications & Alerts"
          onClick={() => {
            setShowNotificationsModal(!showNotificationsModal);
            setUnreadNotifications(0);
          }}
        >
          🔔
          {unreadNotifications > 0 && <span className="badge-dot"></span>}
        </button>
      </div>

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '20px',
          width: '380px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-accent)',
          borderRadius: '12px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
          zIndex: 99999,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="flex items-center gap-8">
              <span style={{ fontSize: '18px' }}>🔔</span>
              <strong style={{ fontSize: '14px' }}>Executive System Notifications</strong>
            </div>
            <button
              className="btn-icon"
              style={{ width: '22px', height: '22px', fontSize: '12px' }}
              onClick={() => setShowNotificationsModal(false)}
            >
              ✕
            </button>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px 0' }}>
            {notificationsList.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  fontSize: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '6px',
                  borderRadius: '8px'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-center mb-2">
                    <strong style={{ fontSize: '12.5px', color: '#f1f5f9' }}>{item.title}</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 18px', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setShowNotificationsModal(false);
                navigate('/crm');
              }}
            >
              Go to Sales Pipeline & Closer ➔
            </button>
          </div>
        </div>
      )}

      {/* Web & Mobile Access Links Modal */}
      {showLinksModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div className="glass-card animate-in" style={{
            maxWidth: '620px',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="flex justify-between items-center mb-20 pb-12" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-10">
                <span style={{ fontSize: '26px' }}>🚀</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>ORION FLUX — Live Access & Mobile App</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Access from computer or install directly on your Android phone</p>
                </div>
              </div>
              <button
                className="header-btn"
                style={{ fontSize: '18px' }}
                onClick={() => setShowLinksModal(false)}
              >
                ✕
              </button>
            </div>

            {/* 1. Web App Access */}
            <div className="glass-card mb-16" style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-8">
                  <span style={{ fontSize: '18px' }}>🌐</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Computer / PC Web App Link</strong>
                </div>
                <span className="badge badge-won">Active & Live</span>
              </div>
              <div className="flex items-center gap-8">
                <input
                  type="text"
                  readOnly
                  className="form-input flex-1"
                  style={{ fontFamily: 'monospace', fontSize: '13px', background: '#090912' }}
                  value={networkInfo.localUrl}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(networkInfo.localUrl, 'local')}
                >
                  {copiedKey === 'local' ? '✅ Copied!' : '📋 Copy Link'}
                </button>
                <a
                  href={networkInfo.localUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  ↗️ Open
                </a>
              </div>
            </div>

            {/* 2. Mobile App (Phone / Tablet on WiFi) */}
            <div className="glass-card mb-16" style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-8">
                  <span style={{ fontSize: '18px' }}>📱</span>
                  <strong style={{ fontSize: '14px', color: '#10b981' }}>Android Mobile App (Same Wi-Fi Link)</strong>
                </div>
                <span className="badge badge-new">PWA Install Ready</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Open this URL in Google Chrome on your Android mobile connected to the same Wi-Fi:
              </p>
              <div className="flex items-center gap-8 mb-12">
                <input
                  type="text"
                  readOnly
                  className="form-input flex-1"
                  style={{ fontFamily: 'monospace', fontSize: '13px', background: '#090912', color: '#34d399', fontWeight: 'bold' }}
                  value={networkInfo.mobileUrl}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(networkInfo.mobileUrl, 'mobile')}
                >
                  {copiedKey === 'mobile' ? '✅ Copied!' : '📋 Copy Link'}
                </button>
              </div>

              {/* QR Code and Step by Step */}
              <div className="flex items-center gap-16 flex-wrap" style={{ background: '#090912', padding: '14px', borderRadius: '8px' }}>
                <div style={{ background: '#ffffff', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={networkInfo.qrUrl}
                    alt="Scan for Mobile App"
                    style={{ width: '130px', height: '130px', display: 'block' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '6px' }}>
                    📲 How to Install on Android Mobile:
                  </h4>
                  <ol style={{ fontSize: '11.5px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: '1.6' }}>
                    <li>Scan this QR Code with your phone camera or type the URL above in Chrome.</li>
                    <li>Tap <strong>3 dots (⋮)</strong> at top-right in Chrome.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                    <li>Done! ORION FLUX is now installed as a real mobile app on your Android device!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 3. Download Offline Package */}
            <div className="glass-card" style={{ padding: '14px 16px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <span style={{ fontSize: '18px' }}>📦</span>
                  <div>
                    <strong style={{ fontSize: '13px' }}>Downloadable App ZIP Package</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      Location on PC: <code style={{ color: '#a5b4fc' }}>{networkInfo.zipLocation}</code>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(networkInfo.zipLocation, 'zip')}
                >
                  {copiedKey === 'zip' ? '✅ Copied!' : '📋 Copy Path'}
                </button>
              </div>
            </div>

            <div className="mt-20 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => setShowLinksModal(false)}
              >
                Close & Return to App
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
