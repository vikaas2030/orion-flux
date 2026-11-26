import React, { useState, useEffect } from 'react';
import HighTicketHunter from '../components/HighTicket/HighTicketHunter';

export default function Scraper() {
  const [activeTab, setActiveTab] = useState('multicity'); // 'multicity' | 'single' | 'smtp_config'
  const [regionFilter, setRegionFilter] = useState('all'); // 'all' | 'global' | 'india'
  
  // Single Search State
  const [keyword, setKeyword] = useState('Software');
  const [location, setLocation] = useState('New York');
  const [isSearching, setIsSearching] = useState(false);
  const [realPlaces, setRealPlaces] = useState([]);
  const [directoryLinks, setDirectoryLinks] = useState(null);
  
  // Multi-City Hunter State
  const [metaCities, setMetaCities] = useState([]);
  const [metaProfessions, setMetaProfessions] = useState([]);
  const [selectedCities, setSelectedCities] = useState(['New York', 'London', 'Dubai', 'Mumbai', 'Noida', 'Bengaluru']);
  const [selectedProfessions, setSelectedProfessions] = useState(['web_software', 'video_production', 'real_estate', 'dentist']);
  const [isAutoHunting, setIsAutoHunting] = useState(false);
  const [huntLogs, setHuntLogs] = useState([]);
  const [huntResult, setHuntResult] = useState(null);

  // Email status state
  const [emailStatus, setEmailStatus] = useState({ isConfigured: false, mode: 'mailto_ready', senderEmail: '' });
  const [emailModal, setEmailModal] = useState({ show: false, to: '', subject: '', text: '', isSending: false, responseMsg: '' });

  // Custom manual lead entry
  const [customLead, setCustomLead] = useState({
    businessName: '',
    phone: '',
    email: '',
    category: 'Software Agency',
    city: 'New York',
    country: 'United States',
    service: 'web_software',
    pricingAdvance: 500,
    pricingTotal: 1200
  });

  // Pitch preview modal
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Real payment record modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    clientName: '',
    phone: '',
    amount: '999',
    utrNumber: '',
    service: 'Full-Stack Web App Development',
    currency: 'INR',
    notes: ''
  });
  const [realCollections, setRealCollections] = useState([]);
  const [totalRealReceived, setTotalRealReceived] = useState(0);

  const fetchCollections = () => {
    fetch('/api/real-world/real-collections')
      .then(res => res.json())
      .then(data => {
        if (data.collections) setRealCollections(data.collections);
        if (typeof data.totalRealReceived === 'number') setTotalRealReceived(data.totalRealReceived);
      })
      .catch(() => {});
  };

  const fetchEmailStatus = () => {
    fetch('/api/real-world/email-status')
      .then(res => res.json())
      .then(data => setEmailStatus(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCollections();
    fetchEmailStatus();
    fetch('/api/real-world/meta-roster')
      .then(res => res.json())
      .then(data => {
        if (data.cities) setMetaCities(data.cities);
        if (data.professions) setMetaProfessions(data.professions);
      })
      .catch(() => {});
  }, []);

  // Multi-City Autonomous Scrape
  const handleStartAutoHunt = () => {
    if (selectedCities.length === 0 || selectedProfessions.length === 0) {
      alert('Please select at least 1 City and 1 Profession!');
      return;
    }

    setIsAutoHunting(true);
    setHuntLogs(['[SYSTEM] Initializing Global Worldwide Client Extraction Core...']);
    setHuntResult(null);

    const interval = setInterval(() => {
      fetch('/api/real-world/auto-hunt-status')
        .then(res => res.json())
        .then(st => {
          if (st.logs && st.logs.length > 0) setHuntLogs(st.logs);
        })
        .catch(() => {});
    }, 1200);

    fetch('/api/real-world/auto-hunt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cities: selectedCities,
        professions: selectedProfessions,
        limit: 3
      })
    })
      .then(res => res.json())
      .then(data => {
        clearInterval(interval);
        setIsAutoHunting(false);
        setHuntResult(data);
        if (data.huntingState?.logs) setHuntLogs(data.huntingState.logs);
      })
      .catch(err => {
        clearInterval(interval);
        setIsAutoHunting(false);
        setHuntLogs(prev => [`[ERROR] ${err.message}`, ...prev]);
      });
  };

  // Real Email Sender Handler
  const handleSendRealEmail = (e) => {
    e?.preventDefault();
    if (!emailModal.to || !emailModal.subject) {
      alert('Recipient email and subject are required!');
      return;
    }

    setEmailModal(prev => ({ ...prev, isSending: true, responseMsg: '' }));

    fetch('/api/real-world/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailModal.to,
        subject: emailModal.subject,
        text: emailModal.text
      })
    })
      .then(res => res.json())
      .then(data => {
        setEmailModal(prev => ({ ...prev, isSending: false, responseMsg: data.message }));
        if (data.delivered) {
          setTimeout(() => {
            setEmailModal({ show: false, to: '', subject: '', text: '', isSending: false, responseMsg: '' });
          }, 3000);
        } else if (data.mailtoUrl) {
          // Open default email client
          window.open(data.mailtoUrl, '_blank');
        }
      })
      .catch(err => {
        setEmailModal(prev => ({ ...prev, isSending: false, responseMsg: 'Error: ' + err.message }));
      });
  };

  const toggleCity = (cityName) => {
    setSelectedCities(prev => 
      prev.includes(cityName) ? prev.filter(c => c !== cityName) : [...prev, cityName]
    );
  };

  const toggleProfession = (profId) => {
    setSelectedProfessions(prev => 
      prev.includes(profId) ? prev.filter(p => p !== profId) : [...prev, profId]
    );
  };

  const filteredCities = metaCities.filter(c => {
    if (regionFilter === 'global') return c.country !== 'India';
    if (regionFilter === 'india') return c.country === 'India';
    return true;
  });

  const selectAllFilteredCities = () => {
    const names = filteredCities.map(c => c.name);
    const allSelected = names.every(n => selectedCities.includes(n));
    if (allSelected) {
      setSelectedCities(prev => prev.filter(n => !names.includes(n)));
    } else {
      setSelectedCities(prev => Array.from(new Set([...prev, ...names])));
    }
  };

  const selectAllProfessions = () => {
    if (selectedProfessions.length === metaProfessions.length) {
      setSelectedProfessions([]);
    } else {
      setSelectedProfessions(metaProfessions.map(p => p.id));
    }
  };

  // Search Real Businesses (Single City)
  const handleSearch = (e) => {
    e?.preventDefault();
    if (!keyword) return;

    setIsSearching(true);
    setRealPlaces([]);

    fetch(`/api/real-world/search-businesses?city=${encodeURIComponent(location)}&category=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(data => {
        setIsSearching(false);
        if (data.realPlaces) setRealPlaces(data.realPlaces);
        if (data.directoryLinks) setDirectoryLinks(data.directoryLinks);
      })
      .catch(() => {
        setIsSearching(false);
      });
  };

  // Generate WhatsApp Pitch
  const handleGeneratePitch = (leadData) => {
    setIsGeneratingPitch(true);
    fetch('/api/real-world/generate-pitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
      .then(res => res.json())
      .then(data => {
        setIsGeneratingPitch(false);
        setSelectedPitch(data);
        setShowPitchModal(true);
      })
      .catch(() => {
        setIsGeneratingPitch(false);
      });
  };

  // Record Real Payment
  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!newPayment.clientName || !newPayment.amount || !newPayment.utrNumber) {
      alert('Please fill Client Name, Amount, and Bank/UPI UTR or PayPal Transaction ID!');
      return;
    }

    fetch('/api/real-world/record-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPayment)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          setShowPayModal(false);
          setNewPayment({ clientName: '', phone: '', amount: '999', utrNumber: '', service: 'Full-Stack Web App Development', currency: 'INR', notes: '' });
          fetchCollections();
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(err => alert('Failed: ' + err.message));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="scraper-page animate-in">
      {/* Top Banner */}
      <div className="glass-card p-24 mb-24" style={{
        padding: '24px 28px',
        borderLeft: '6px solid #10b981',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)'
      }}>
        <div className="flex justify-between items-center flex-wrap gap-16">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <span style={{ fontSize: '28px' }}>🌐</span>
              <h2 className="text-xl font-bold" style={{ margin: 0 }}>Worldwide Autonomous Client Hunter & Multi-Channel Outreach Studio</h2>
              <span className="badge" style={{ background: '#10b981', color: '#000', fontWeight: 'bold' }}>INDIA + ALL WORLD</span>
            </div>
            <p className="text-sm text-tertiary" style={{ margin: 0 }}>
              Scrape real businesses across India 🇮🇳, USA 🇺🇸, UK 🇬🇧, UAE 🇦🇪, Canada 🇨🇦, Australia 🇦🇺, Singapore 🇸🇬. Automate cold outreach via WhatsApp Closer & Gmail SMTP with your UPI: <strong>9690973030@ibl</strong> & PayPal!
            </p>
          </div>

          <div className="flex items-center gap-12">
            <button className="btn btn-primary" onClick={() => setShowPayModal(true)}>
              🏦 + Record Real Bank Payment
            </button>
          </div>
        </div>

        {/* Real Collections Status Strip */}
        <div className="mt-16 pt-16 flex items-center justify-between flex-wrap gap-12" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-24 flex-wrap">
            <div>
              <span className="text-xs text-tertiary uppercase">Verified Bank Collections:</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                ₹{totalRealReceived.toLocaleString()} INR
              </div>
            </div>
            <div>
              <span className="text-xs text-tertiary uppercase">Total Real Payments:</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {realCollections.length} Verified Receipts
              </div>
            </div>
            <div>
              <span className="text-xs text-tertiary uppercase">India UPI Settled:</span>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#38bdf8' }}>
                9690973030@ibl
              </div>
            </div>
            <div>
              <span className="text-xs text-tertiary uppercase">Global Email Sender:</span>
              <div style={{ fontSize: '13px', fontWeight: '600', color: emailStatus.isConfigured ? '#10b981' : '#f59e0b' }}>
                {emailStatus.isConfigured ? `🟢 Gmail SMTP Live (${emailStatus.senderEmail})` : '📧 Mailto Mode Ready'}
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex gap-8">
            <button
              className={`btn btn-sm ${activeTab === 'highticket' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('highticket')}
              style={activeTab === 'highticket' ? { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#000', fontWeight: 'bold' } : { borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
            >
              💎 High-Ticket Dollar Hunt ($1,200 – $4,500)
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'multicity' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('multicity')}
            >
              ⚡ Worldwide Auto Hunt
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'single' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('single')}
            >
              🔍 Single City & Quick Pitch
            </button>
          </div>
        </div>
      </div>

      {/* TAB 0: HIGH-TICKET DOLLAR PIPELINE EXPANSION */}
      {activeTab === 'highticket' && (
        <div className="glass-card p-24 mb-24 animate-in">
          <HighTicketHunter />
        </div>
      )}

      {/* TAB 1: ALL-WORLD MULTI-CITY AUTO HUNT */}
      {activeTab === 'multicity' && (
        <div className="glass-card p-24 mb-24 animate-in">
          <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-8">
                <span>⚡</span> Automated Global Client Extraction & Multi-Channel Pipeline
              </h3>
              <p className="text-xs text-tertiary" style={{ margin: 0 }}>
                Select target global cities and high-paying professions. The engine queries live registered business directories and automatically stages verified leads with ready-made WhatsApp & Email pitches into your CRM.
              </p>
            </div>

            <button
              className="btn btn-primary"
              style={{ minWidth: '220px', justifyContent: 'center' }}
              disabled={isAutoHunting}
              onClick={handleStartAutoHunt}
            >
              {isAutoHunting ? '⚡ Extracting Worldwide...' : '🚀 Launch Worldwide Auto Hunt'}
            </button>
          </div>

          {/* Region Filter Pills */}
          <div className="flex items-center gap-8 mb-16">
            <span className="text-xs uppercase text-tertiary font-bold">Region Filter:</span>
            <button
              type="button"
              className={`btn btn-sm ${regionFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '3px 10px' }}
              onClick={() => setRegionFilter('all')}
            >
              🌍 All Worldwide ({metaCities.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${regionFilter === 'global' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '3px 10px' }}
              onClick={() => setRegionFilter('global')}
            >
              🇺🇸🇬🇧 Global Metros Only (US, UK, UAE, AU, CA, SG)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${regionFilter === 'india' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '3px 10px' }}
              onClick={() => setRegionFilter('india')}
            >
              🇮🇳 India Metros & Towns Only
            </button>
          </div>

          {/* Cities Selector */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-semibold uppercase text-tertiary">
                Target Cities & Metros ({selectedCities.length} selected):
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={selectAllFilteredCities}
              >
                Select / Toggle Filtered Cities
              </button>
            </div>
            <div className="flex gap-8 flex-wrap">
              {filteredCities.map(city => {
                const isSelected = selectedCities.includes(city.name);
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => toggleCity(city.name)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: isSelected ? '600' : '400',
                      background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#10b981' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{city.flag} {city.name} ({city.country})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Professions Selector */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-semibold uppercase text-tertiary">
                Target Professions & Commercial Niches ({selectedProfessions.length}/{metaProfessions.length} selected):
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={selectAllProfessions}
              >
                {selectedProfessions.length === metaProfessions.length ? 'Deselect All' : 'Select All 9 Niches'}
              </button>
            </div>
            <div className="flex gap-8 flex-wrap">
              {metaProfessions.map(prof => {
                const isSelected = selectedProfessions.includes(prof.id);
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => toggleProfession(prof.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: isSelected ? '600' : '400',
                      background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{prof.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Extraction Logs Terminal */}
          {huntLogs.length > 0 && (
            <div className="mt-16 p-16" style={{
              background: '#090d16',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'monospace',
              fontSize: '12px',
              maxHeight: '220px',
              overflowY: 'auto'
            }}>
              <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>⚡ LIVE WORLDWIDE EXTRACTION TERMINAL</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{isAutoHunting ? '🟢 ACTIVE RUNNING' : '🏁 READY'}</span>
              </div>
              {huntLogs.map((log, i) => (
                <div key={i} style={{ color: log.includes('✅') ? '#10b981' : (log.includes('⚠️') ? '#f59e0b' : 'var(--text-secondary)'), marginBottom: '3px' }}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Hunt Result Summary */}
          {huntResult && (
            <div className="mt-16 p-16 flex items-center justify-between flex-wrap gap-12" style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: '8px'
            }}>
              <div>
                <span className="text-xs uppercase text-tertiary block">Extraction Results:</span>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  🎉 {huntResult.totalNewlyAdded} Real Businesses Added to CRM!
                </div>
              </div>
              <a href="/leads" className="btn btn-primary btn-sm">
                👥 View Extracted Leads in CRM ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SINGLE SEARCH & QUICK PITCH */}
      {activeTab === 'single' && (
        <div className="grid grid-2 gap-24 mb-24 animate-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* Box 1: Search Real Local Businesses */}
          <div className="glass-card p-24" style={{ padding: '24px' }}>
            <h3 className="font-bold text-lg mb-16 flex items-center gap-8">
              <span>🔍</span> Search Single City / Global Metro
            </h3>
            <p className="text-xs text-tertiary mb-16">
              Query specific city and category worldwide for instant verified directory listings.
            </p>

            <form onSubmit={handleSearch}>
              <div className="form-row mb-16">
                <div className="form-group">
                  <label className="form-label">Category / Business Type *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software, Dentist, Real Estate, Gym, Salon"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City / Country Target *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. New York, London, Dubai, Noida, Delhi"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSearching} style={{ justifyContent: 'center' }}>
                {isSearching ? '⚡ Scanning Real Registered Businesses...' : '🔎 Find Real Businesses in City'}
              </button>
            </form>

            {/* Direct Live Directories Launchers */}
            <div className="mt-20 pt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-xs font-semibold text-tertiary uppercase block mb-8">
                Or Open Direct Live Search (100% Real Phone Numbers):
              </span>
              <div className="flex gap-8 flex-wrap">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(keyword + ' in ' + location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  📍 Google Maps ({location}) ↗
                </a>
                <a
                  href={`https://www.justdial.com/${encodeURIComponent(location.toLowerCase())}/${encodeURIComponent(keyword.toLowerCase().replace(/\s+/g, '-'))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  📞 Justdial Verified ↗
                </a>
              </div>
            </div>
          </div>

          {/* Box 2: Quick Add & Multi-Channel Closer */}
          <div className="glass-card p-24" style={{ padding: '24px' }}>
            <h3 className="font-bold text-lg mb-16 flex items-center gap-8">
              <span>📲</span> Quick WhatsApp & Email Closer
            </h3>
            <p className="text-xs text-tertiary mb-16">
              Found a real phone number or email? Paste it below to generate a 1-click WhatsApp or Email pitch!
            </p>

            <div className="form-group mb-12">
              <label className="form-label">Business / Client Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme Software Labs, Apex Dental"
                value={customLead.businessName}
                onChange={e => setCustomLead({ ...customLead, businessName: e.target.value })}
              />
            </div>

            <div className="form-row mb-12">
              <div className="form-group">
                <label className="form-label">Client Phone (with country code)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +14155552671 or 9812345678"
                  value={customLead.phone}
                  onChange={e => setCustomLead({ ...customLead, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Client Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. contact@business.com"
                  value={customLead.email}
                  onChange={e => setCustomLead({ ...customLead, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row mb-16">
              <div className="form-group">
                <label className="form-label">Service to Pitch</label>
                <select
                  className="form-select"
                  value={customLead.service}
                  onChange={e => setCustomLead({ ...customLead, service: e.target.value })}
                >
                  <option value="web_software">🌐 Web App / SaaS Platform ($1,200 / ₹25,000)</option>
                  <option value="video_ad">🎬 1080p Video Reel Ad ($450 / ₹6,000)</option>
                  <option value="whatsapp_bot">🤖 24/7 AI Customer Bot ($600 / ₹7,500)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Token Advance</label>
                <input
                  type="number"
                  className="form-input"
                  value={customLead.pricingAdvance}
                  onChange={e => setCustomLead({ ...customLead, pricingAdvance: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-8">
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={!customLead.businessName || (!customLead.phone && !customLead.email) || isGeneratingPitch}
                onClick={() => handleGeneratePitch({
                  businessName: customLead.businessName,
                  phone: customLead.phone,
                  category: keyword,
                  city: location,
                  service: customLead.service,
                  pricingAdvance: customLead.pricingAdvance,
                  pricingTotal: customLead.pricingTotal
                })}
              >
                {isGeneratingPitch ? '⚡ Crafting...' : '📲 Generate WhatsApp Pitch'}
              </button>

              {customLead.email && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEmailModal({
                    show: true,
                    to: customLead.email,
                    subject: `Digital Infrastructure & Automation Proposal for ${customLead.businessName}`,
                    text: `Hello Team at ${customLead.businessName},\n\nWe provide turnkey business automation, modern web platforms, and AI video production.\n\nFee: $${customLead.pricingTotal} ($${customLead.pricingAdvance} token advance).\n\nDirect UPI / PayPal available. Let us know if you'd like a live demo.\n\nBest regards,\nORION FLUX Agency`,
                    isSending: false,
                    responseMsg: ''
                  })}
                >
                  📧 Email
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real Verified Bank Collections Ledger */}
      <div className="glass-card p-24">
        <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
          <div>
            <h3 className="font-bold text-lg" style={{ margin: 0 }}>
              🏦 Real Bank Verified Collections Ledger
            </h3>
            <p className="text-xs text-tertiary" style={{ margin: 0 }}>
              Every transaction here is verified with a real Bank/UPI UTR Number received at <strong>9690973030@ibl</strong> or international PayPal ID.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowPayModal(true)}>
            + Record New Payment
          </button>
        </div>

        {realCollections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏦</div>
            <p className="text-sm font-semibold">No real bank payments recorded yet.</p>
            <p className="text-xs" style={{ maxWidth: '480px', margin: '0 auto 16px auto' }}>
              Whenever a real client pays an advance token (e.g. ₹2,500 or $100 USD) to your UPI <strong>9690973030@ibl</strong> or PayPal, click below to record their UTR number.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowPayModal(true)}>
              Record Your First Payment
            </button>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client / Business</th>
                  <th>Amount Received</th>
                  <th>Bank / UPI UTR Number</th>
                  <th>Service Delivered</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {realCollections.map((col, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{col.clientName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{col.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '15px' }}>
                        ₹{parseFloat(col.amount).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <code style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {col.utrNumber}
                      </code>
                    </td>
                    <td>{col.service}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      {new Date(col.receivedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModal.show && (
        <div className="modal-backdrop" onClick={() => setEmailModal({ ...emailModal, show: false })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="font-bold flex items-center gap-8">
                <span>📧</span> Send Real Email via ORION FLUX
              </h3>
              <button className="btn-close" onClick={() => setEmailModal({ ...emailModal, show: false })}>×</button>
            </div>

            <form onSubmit={handleSendRealEmail}>
              <div className="modal-body">
                <div className="p-12 mb-16" style={{
                  background: emailStatus.isConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '6px',
                  border: emailStatus.isConfigured ? '1px solid #10b981' : '1px solid #f59e0b',
                  fontSize: '12px'
                }}>
                  {emailStatus.isConfigured ? (
                    <div>🟢 <strong>Live Gmail SMTP Active:</strong> Emails will be dispatched in background from <code>{emailStatus.senderEmail}</code>.</div>
                  ) : (
                    <div>⚡ <strong>1-Click Email Dispatch:</strong> Clicking Send will open your default email app with this message pre-filled. To enable silent background auto-sending, add your Gmail App Password to <code>server/.env</code>.</div>
                  )}
                </div>

                <div className="form-group mb-12">
                  <label className="form-label">To Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={emailModal.to}
                    onChange={e => setEmailModal({ ...emailModal, to: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-12">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={emailModal.subject}
                    onChange={e => setEmailModal({ ...emailModal, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-16">
                  <label className="form-label">Message Body *</label>
                  <textarea
                    className="form-textarea"
                    rows="8"
                    value={emailModal.text}
                    onChange={e => setEmailModal({ ...emailModal, text: e.target.value })}
                    required
                  ></textarea>
                </div>

                {emailModal.responseMsg && (
                  <div className="p-12 mb-16" style={{ background: 'rgba(56, 189, 248, 0.15)', borderRadius: '6px', color: '#38bdf8', fontSize: '13px' }}>
                    {emailModal.responseMsg}
                  </div>
                )}

                <div className="flex justify-end gap-12">
                  <button type="button" className="btn btn-secondary" onClick={() => setEmailModal({ ...emailModal, show: false })}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={emailModal.isSending}>
                    {emailModal.isSending ? '⚡ Dispatching Email...' : '🚀 Dispatch Real Email'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pitch Modal */}
      {showPitchModal && selectedPitch && (
        <div className="modal-backdrop" onClick={() => setShowPitchModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="font-bold flex items-center gap-8">
                <span>📲</span> Ready-to-Send Pitch for {selectedPitch.businessName}
              </h3>
              <button className="btn-close" onClick={() => setShowPitchModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="p-16 mb-16" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs text-tertiary uppercase block mb-4">Pitch Preview:</span>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedPitch.pitchText}
                </pre>
              </div>

              {/* Payment Advance Card */}
              <div className="p-16 mb-16 flex items-center justify-between gap-12" style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid #10b981',
                borderRadius: '8px'
              }}>
                <div>
                  <span className="text-xs font-semibold text-tertiary uppercase block">50% Advance Token:</span>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                    ₹{selectedPitch.pricingAdvance?.toLocaleString()} INR
                  </div>
                  <span className="text-xs text-tertiary">Direct UPI: <strong>{selectedPitch.upiId}</strong></span>
                </div>
                <div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(`upi://pay?pa=${selectedPitch.upiId}&pn=ORION_FLUX&am=${selectedPitch.pricingAdvance}&cu=INR`)}`}
                    alt="UPI QR"
                    style={{ borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-12 flex-wrap">
                {selectedPitch.whatsappUrl && (
                  <a
                    href={selectedPitch.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', background: '#25D366', color: '#fff' }}
                  >
                    🚀 Open in WhatsApp Web / App
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(selectedPitch.pitchText)}
                >
                  {copiedPitch ? '✅ Copied to Clipboard!' : '📋 Copy Pitch Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="font-bold flex items-center gap-8">
                <span>🏦</span> Record Real Verified Bank Payment
              </h3>
              <button className="btn-close" onClick={() => setShowPayModal(false)}>×</button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div className="modal-body">
                <p className="text-xs text-tertiary mb-16">
                  Only enter payments that have actually been credited to your bank account or UPI <strong>(9690973030@ibl)</strong> or PayPal.
                </p>

                <div className="form-group mb-12">
                  <label className="form-label">Client / Business Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. Verma Clinic, Acme Software USA"
                    value={newPayment.clientName}
                    onChange={e => setNewPayment({ ...newPayment, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group mb-12">
                  <label className="form-label">Client Phone / Email</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +14155552671 or client@email.com"
                    value={newPayment.phone}
                    onChange={e => setNewPayment({ ...newPayment, phone: e.target.value })}
                  />
                </div>

                <div className="form-row mb-12">
                  <div className="form-group">
                    <label className="form-label">Amount Received (₹ INR) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 999"
                      value={newPayment.amount}
                      onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bank UTR / PayPal TxID *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 428910284712"
                      value={newPayment.utrNumber}
                      onChange={e => setNewPayment({ ...newPayment, utrNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-16">
                  <label className="form-label">Service Delivered</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Full-Stack Web App, 1080p Video Reel"
                    value={newPayment.service}
                    onChange={e => setNewPayment({ ...newPayment, service: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-12">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPayModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    ✅ Verify & Record Real Money
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
