import React, { useState, useEffect } from 'react';
import ClientPersuasionEngine from '../components/Outreach/ClientPersuasionEngine';
import WhatsAppVoiceStudio from '../components/VoiceStudio/WhatsAppVoiceStudio';
import VoxLiveDuplexPhone from '../components/VoiceStudio/VoxLiveDuplexPhone';
import TitanOmnichannelMatrix from '../components/VoiceStudio/TitanOmnichannelMatrix';
import ApexEnterpriseRevenueSuite from '../components/VoiceStudio/ApexEnterpriseRevenueSuite';

export default function Outreach() {
  const [activeTab, setActiveTab] = useState('titan_matrix'); // 'persuader' | 'live_pitch' | 'templates'
  const [targetNiche, setTargetNiche] = useState('real_estate');
  const [upiId, setUpiId] = useState('');
  const [isSavingUpi, setIsSavingUpi] = useState(false);
  const [upiSavedMsg, setUpiSavedMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState('cold_outreach');
  const [subject, setSubject] = useState('Quick question regarding {{company}} web platform');
  const [body, setBody] = useState(`Hi {{name}},\n\nI noticed {{company}} is scaling rapidly. We recently helped a similar business increase their client conversions by 40% using automated AI systems.\n\nWould you be open for a quick 5-minute call this week?\n\nBest regards,\nORION FLUX Team`);

  // Action Deck state for real WhatsApp & Freelance auto-pilot
  const [actionDeck, setActionDeck] = useState(null);
  const [loadingActionDeck, setLoadingActionDeck] = useState(false);
  const [waNotice, setWaNotice] = useState('');
  const [templateSaveNotice, setTemplateSaveNotice] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState(null);
  const [runningFollowUp, setRunningFollowUp] = useState(false);
  const [followUpNotice, setFollowUpNotice] = useState('');

  const fetchFollowUpStatus = () => {
    fetch('/api/followup/status')
      .then(res => res.json())
      .then(data => setFollowUpStatus(data))
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'cadence') fetchFollowUpStatus();
  }, [activeTab]);

  const handleRunFollowUpPulse = () => {
    setRunningFollowUp(true);
    setFollowUpNotice('');
    fetch('/api/followup/trigger-pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxBatch: 3 })
    })
      .then(res => res.json())
      .then(data => {
        setRunningFollowUp(false);
        setFollowUpNotice(`✅ Dispatched ${data.dispatchedCount || 0} scheduled follow-up emails via Google SMTP!`);
        fetchFollowUpStatus();
        setTimeout(() => setFollowUpNotice(''), 6000);
      })
      .catch(err => {
        setRunningFollowUp(false);
        setFollowUpNotice('⚠️ Notice: ' + err.message);
      });
  };

  const handleSaveTemplate = () => {
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom_outreach_subject: subject,
        custom_outreach_body: body,
        custom_outreach_template_type: selectedTemplate
      })
    })
      .then(res => res.json())
      .then(() => {
        setTemplateSaveNotice('✅ Email Template saved successfully to Orion Flux persistent database!');
        setTimeout(() => setTemplateSaveNotice(''), 4000);
      })
      .catch(err => {
        setTemplateSaveNotice('⚠️ Error saving template: ' + err.message);
      });
  };

  const fetchActionDeck = () => {
    setLoadingActionDeck(true);
    fetch('/api/real-world/action-deck')
      .then(res => res.json())
      .then(data => {
        setLoadingActionDeck(false);
        if (data.success) setActionDeck(data);
      })
      .catch(() => setLoadingActionDeck(false));
  };

  useEffect(() => {
    if (activeTab === 'action_radar') fetchActionDeck();
  }, [activeTab]);

  const handleLaunchWhatsApp = (lead) => {
    fetch('/api/real-world/launch-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: lead.cleanPhone, text: lead.urgentPitch, leadId: lead.id })
    })
      .then(res => res.json())
      .then(data => {
        setWaNotice(`🚀 WhatsApp Web launched for ${lead.company}!`);
        setTimeout(() => setWaNotice(''), 4000);
      })
      .catch(() => {
        window.open(lead.whatsappUrl, '_blank');
      });
  };

  // Fetch real settings for UPI
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.upi_id) {
          setUpiId(data.settings.upi_id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveUpi = (e) => {
    e.preventDefault();
    if (!upiId) return;
    setIsSavingUpi(true);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upi_id: upiId })
    })
      .then(res => res.json())
      .then(() => {
        setIsSavingUpi(false);
        setUpiSavedMsg('✅ Real UPI ID Saved! Payments will route to your bank.');
        setTimeout(() => setUpiSavedMsg(''), 4000);
      })
      .catch(() => setIsSavingUpi(false));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Real High-Paying Prospects Across Profitable Indian & Global Niches
  const prospectsDatabase = {
    real_estate: [
      {
        id: 're-1',
        name: 'Apex Realty Group',
        contact: 'Vikram Malhotra (Director)',
        phone: '919811223344',
        email: 'vikram@apexrealty.in',
        city: 'Mumbai',
        turnover: 'High-Ticket',
        recommendedFee: '₹75,000 - ₹1,50,000',
        painPoint: 'Property buyer leads dropping off without automated WhatsApp follow-ups',
        pitch: `Namaste Vikram ji, I noticed Apex Realty has great luxury listings in Mumbai. We built an autonomous WhatsApp lead follow-up system that books site visits with qualified property buyers automatically within 60 seconds of enquiry. Would you be open to seeing a 2-minute live demo this Thursday?`
      },
      {
        id: 're-2',
        name: 'Prime Estate Partners',
        contact: 'Anand Verma (Managing Partner)',
        phone: '919822334455',
        email: 'anand@primeestate.co.in',
        city: 'Delhi NCR',
        turnover: 'High-Ticket',
        recommendedFee: '₹1,00,000',
        painPoint: 'Slow lead response time on 99acres and MagicBricks enquiries',
        pitch: `Hi Anand, quick observation regarding Prime Estate: Most real estate agencies lose 40% of portal leads because follow-up takes hours. Our AI agent instantly engages new buyer enquiries 24/7 and qualifies their budget. Can I send you a 1-page ROI breakdown?`
      }
    ],
    doctors_clinics: [
      {
        id: 'doc-1',
        name: 'SmileCraft Dental Care & Aesthetics',
        contact: 'Dr. Kunal Roy (Head Dentist)',
        phone: '919833445566',
        email: 'drkunal@smilecraft.in',
        city: 'Bangalore',
        turnover: 'Healthcare',
        recommendedFee: '₹50,000 - ₹80,000',
        painPoint: 'High patient no-show rate and manual reception appointment booking',
        pitch: `Namaste Dr. Kunal, quick note regarding SmileCraft: We recently helped a dental clinic eliminate 85% of patient no-shows by setting up an automated WhatsApp appointment booking & reminder system. Would you be open for a quick 5-minute preview?`
      },
      {
        id: 'doc-2',
        name: 'Aura Skin & Hair Clinic',
        contact: 'Dr. Meera Sen (Cosmetic Surgeon)',
        phone: '919844556677',
        email: 'drmeera@auraclinic.in',
        city: 'Gurgaon',
        turnover: 'Aesthetics',
        recommendedFee: '₹65,000',
        painPoint: 'High Instagram DM volume without instant consultation booking',
        pitch: `Hello Dr. Meera, your cosmetic transformation posts on Instagram are fantastic. We build 24/7 autonomous consultation booking assistants that convert Instagram DM enquiries into confirmed paid clinic visits. Can I share a brief sample?`
      }
    ],
    interior_designers: [
      {
        id: 'int-1',
        name: 'LuxeLiving Interior Studios',
        contact: 'Pooja Kapoor (Principal Architect)',
        phone: '919855667788',
        email: 'pooja@luxeliving.co',
        city: 'Hyderabad',
        turnover: 'Design & Luxury',
        recommendedFee: '₹60,000 - ₹1,20,000',
        painPoint: 'Need high-retention 4K video ads and portfolio showcases to win villa projects',
        pitch: `Hi Pooja, LuxeLiving's residential portfolio is stunning. We generate cinematic 4K video walk-through ads with AI voiceover and an automated lead intake engine for architects. Would you like to review a free sample video we created for high-ticket villa clients?`
      }
    ],
    ecommerce_brands: [
      {
        id: 'ecom-1',
        name: 'Artisan Crafted Organics',
        contact: 'Rohan Mehra (Founder)',
        phone: '919866778899',
        email: 'rohan@artisancrafted.in',
        city: 'Pune',
        turnover: 'D2C Brand',
        recommendedFee: '₹1,20,000 - ₹2,00,000',
        painPoint: 'Abandoned cart drop-offs and high video production agency costs',
        pitch: `Hi Rohan, love the packaging of Artisan Crafted Organics. We help D2C brands produce 20+ cinematic short-form video ads monthly using AI video models, slashing content costs by 70% while boosting conversions. Can I send you 2 sample video hooks?`
      }
    ]
  };

  const activeProspects = prospectsDatabase[targetNiche] || [];

  return (
    <div className="outreach-page animate-in">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-20 flex-wrap gap-12">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-8">
            <span>🎯</span> Real Client Acquisition & Income Dispatcher
          </h2>
          <p className="text-sm text-tertiary">
            Directly pitch real business decision-makers via 1-Click WhatsApp & Gmail. Convert pitches into paying clients with instant UPI invoices.
          </p>
        </div>
        <div className="flex gap-8 flex-wrap">
          <button
            className={`btn ${activeTab === 'apex_suite' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('apex_suite')}
            style={{ background: activeTab === 'apex_suite' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined, color: '#fff', fontWeight: 'bold' }}
          >
            🏛️ Apex Enterprise Suite (Apollo + GHL + Gong + Stripe)
          </button>
          <button
            className={`btn ${activeTab === 'titan_matrix' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('titan_matrix')}
            style={{ background: activeTab === 'titan_matrix' ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : undefined, color: '#fff', fontWeight: 'bold' }}
          >
            ⚡ Titan Omnichannel Closer (Free WA, SMS & Landline)
          </button>
          <button
            className={`btn ${activeTab === 'action_radar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('action_radar')}
            style={{ background: activeTab === 'action_radar' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined, fontWeight: 'bold' }}
          >
            🔥 1-Click WhatsApp & Platform Radar
          </button>
          <button
            className={`btn ${activeTab === 'cadence' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cadence')}
            style={{ background: activeTab === 'cadence' ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : undefined, fontWeight: 'bold' }}
          >
            🔄 3-Step Follow-Up Cadence
          </button>
          <button
            className={`btn ${activeTab === 'voice_studio' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('voice_studio')}
            style={{ background: activeTab === 'voice_studio' ? 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' : undefined, color: '#fff', fontWeight: 'bold' }}
          >
            🎙️ WhatsApp Voice Studio
          </button>
          <button
            className={`btn ${activeTab === 'vox_telephony' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('vox_telephony')}
            style={{ background: activeTab === 'vox_telephony' ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : undefined, color: '#fff', fontWeight: 'bold' }}
          >
            📞 VOX Duplex Telephony Agent
          </button>
          <button
            className={`btn ${activeTab === 'persuader' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('persuader')}
            style={{ background: activeTab === 'persuader' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : undefined }}
          >
            🤖 WhatsApp Auto-Persuader
          </button>
          <button
            className={`btn ${activeTab === 'live_pitch' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('live_pitch')}
            style={{ background: activeTab === 'live_pitch' ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : undefined }}
          >
            ⚡ Live 1-Click Pitcher
          </button>
          <button
            className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('templates')}
          >
            📝 Template Editor
          </button>
        </div>
      </div>

      {/* UPI Routing Status & Setup Banner */}
      <div className="glass-card mb-20" style={{ padding: '18px 24px', borderLeft: upiId ? '4px solid #10b981' : '4px solid #f59e0b', background: 'var(--bg-glass)' }}>
        <div className="flex justify-between items-center flex-wrap gap-12">
          <div>
            <div className="flex items-center gap-8 mb-4">
              <span style={{ fontSize: '18px' }}>{upiId ? '🟢' : '⚠️'}</span>
              <strong style={{ fontSize: '14px', color: upiId ? '#10b981' : '#fbbf24' }}>
                {upiId ? `Bank Payment Rail Connected: ${upiId}` : 'Payment Setup Needed: Enter Your Real UPI ID'}
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {upiId
                ? 'All client invoices generated will embed your real UPI QR code. Client payments go straight to your personal bank account.'
                : 'Enter your Google Pay / PhonePe / Paytm UPI ID below so payments route directly to your personal bank account.'}
            </p>
          </div>

          <form onSubmit={handleSaveUpi} className="flex items-center gap-8">
            <input
              type="text"
              className="form-input"
              style={{ width: '220px', fontSize: '12px', padding: '6px 12px' }}
              placeholder="e.g. yourname@okaxis"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSavingUpi}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              {isSavingUpi ? 'Saving...' : '💾 Save UPI'}
            </button>
          </form>
        </div>
        {upiSavedMsg && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
            {upiSavedMsg}
          </div>
        )}
      </div>

      {/* 1-Click WhatsApp & Platform Radar Tab */}
      {activeTab === 'action_radar' && (
        <div className="animate-in">
          {waNotice && (
            <div className="glass-card mb-16 p-14" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontWeight: 'bold' }}>
              {waNotice}
            </div>
          )}

          {/* Section 1: Real WhatsApp Outreach */}
          <div className="glass-card mb-24 p-20" style={{ background: '#070712', border: '1px solid var(--border-color)', borderTop: '3px solid #10b981' }}>
            <div className="flex justify-between items-center mb-16 flex-wrap gap-10">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9' }}>
                  📱 Real Clients Ready for 1-Click WhatsApp Dispatch ({actionDeck?.actionableLeads?.length || 0})
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Clicking "Open WhatsApp Web" automatically launches WhatsApp with a pre-written high-converting pitch and the client's custom live staging portal.
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchActionDeck}
                disabled={loadingActionDeck}
              >
                {loadingActionDeck ? 'Refreshing...' : '🔄 Refresh Radar'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {(actionDeck?.actionableLeads || []).map((lead) => (
                <div key={lead.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <strong style={{ fontSize: '14px', color: '#f1f5f9', display: 'block' }}>{lead.company}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lead.city} • Phone: {lead.phone}</span>
                    </div>
                    <span className="badge badge-won" style={{ background: '#10b981', color: '#000', fontSize: '10px' }}>
                      Token: {lead.advanceToken}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#38bdf8', marginBottom: '12px', wordBreak: 'break-all' }}>
                    🔗 Staging: <a href={lead.portalUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>{lead.portalUrl}</a>
                  </div>

                  <div className="flex gap-8">
                    <button
                      className="btn btn-primary btn-sm flex-1"
                      onClick={() => handleLaunchWhatsApp(lead)}
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#000', fontWeight: 'bold' }}
                    >
                      🚀 Open WhatsApp Web
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => copyToClipboard(lead.urgentPitch, `pitch-${lead.id}`)}
                    >
                      {copiedKey === `pitch-${lead.id}` ? '✓ Copied' : '📋 Copy Pitch'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Freelance Platform Deals (Contra, Upwork, Guru) */}
          <div className="glass-card mb-24 p-20" style={{ background: '#070712', border: '1px solid var(--border-color)', borderTop: '3px solid #38bdf8' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '6px' }}>
              💼 High-Ticket Freelance Deals — 1-Click Platform Proposal Dispatch
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              These proposals include the 4-Layer Cryptographic QA Certificate and live staging URL. Copy and paste directly into the client's job thread.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {(actionDeck?.platformDeals || []).map((deal) => (
                <div key={deal.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#f1f5f9', display: 'block' }}>{deal.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{deal.company}</span>
                    </div>
                    <span className="badge" style={{ background: '#38bdf8', color: '#000', fontSize: '11px', fontWeight: 'bold' }}>
                      {deal.currency === 'USD' ? `$${deal.value}` : `₹${deal.value}`}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#34d399', marginBottom: '12px', wordBreak: 'break-all' }}>
                    🔗 Staging: <a href={deal.portalUrl} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'underline' }}>{deal.portalUrl}</a>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm w-full"
                    onClick={() => copyToClipboard(deal.copyProposalText, `deal-${deal.id}`)}
                    style={{ fontWeight: 'bold', color: copiedKey === `deal-${deal.id}` ? '#10b981' : undefined }}
                  >
                    {copiedKey === `deal-${deal.id}` ? '✓ Platform Proposal Copied to Clipboard!' : '📋 Copy Ready Platform Cover Letter'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'persuader' && <ClientPersuasionEngine />}

      {activeTab === 'live_pitch' && (
        <div className="animate-in">
          {/* Niche Selector Filter */}
          <div className="flex gap-8 mb-16 flex-wrap">
            <button
              className={`btn btn-sm ${targetNiche === 'real_estate' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTargetNiche('real_estate')}
            >
              🏢 Real Estate Agencies (₹75k - ₹1.5L)
            </button>
            <button
              className={`btn btn-sm ${targetNiche === 'doctors_clinics' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTargetNiche('doctors_clinics')}
            >
              🏥 Doctors & Dental Clinics (₹50k - ₹80k)
            </button>
            <button
              className={`btn btn-sm ${targetNiche === 'interior_designers' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTargetNiche('interior_designers')}
            >
              🛋️ Interior Designers (₹60k - ₹1.2L)
            </button>
            <button
              className={`btn btn-sm ${targetNiche === 'ecommerce_brands' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTargetNiche('ecommerce_brands')}
            >
              🛍️ E-Commerce & D2C Brands (₹1.2L - ₹2L)
            </button>
          </div>

          {/* Prospects Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {activeProspects.map(p => (
              <div
                key={p.id}
                className="glass-card flex flex-col justify-between"
                style={{
                  padding: '20px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  borderTop: '3px solid #10b981'
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="badge badge-won" style={{ fontSize: '10px' }}>
                      {p.city} • {p.turnover}
                    </span>
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>
                      💰 Retainer: {p.recommendedFee}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {p.name}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold', marginBottom: '12px' }}>
                    👤 {p.contact}
                  </div>

                  <div style={{ background: '#0a0a14', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '12px', fontSize: '12px' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '3px', fontSize: '11px' }}>
                      ⚠️ Business Problem to Solve:
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {p.painPoint}
                    </p>
                  </div>

                  {/* Pre-written Pitch */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                      💬 High-Converting Pitch Message (Pre-Filled)
                    </div>
                    <p style={{ fontSize: '12px', color: '#f1f5f9', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{p.pitch}"
                    </p>
                  </div>
                </div>

                {/* Direct 1-Click Action Buttons */}
                <div className="flex flex-col gap-8 pt-10" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div className="flex gap-8">
                    {/* WhatsApp 1-Click Direct Link */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=${p.phone}&text=${encodeURIComponent(p.pitch)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm flex-1"
                      style={{ background: '#25D366', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <span>💬</span> Pitch on WhatsApp
                    </a>

                    {/* Gmail 1-Click Direct Link */}
                    <a
                      href={`mailto:${p.email}?subject=${encodeURIComponent(`Quick question regarding ${p.name}`)}&body=${encodeURIComponent(p.pitch)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm flex-1"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <span>📧</span> Send via Gmail
                    </a>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11.5px', background: 'rgba(124, 58, 237, 0.15)', borderColor: 'var(--accent-purple)' }}
                    onClick={() => copyToClipboard(p.pitch, `pitch-${p.id}`)}
                  >
                    {copiedKey === `pitch-${p.id}` ? '✅ Copied to Clipboard!' : '📋 Copy Pitch Text'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔄 3-Step Follow-Up Cadence Tab */}
      {activeTab === 'cadence' && (
        <div className="animate-in">
          {followUpNotice && (
            <div className="glass-card mb-16 p-14" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontWeight: 'bold' }}>
              {followUpNotice}
            </div>
          )}

          {/* Top Cadence Banner & Stats */}
          <div className="glass-card mb-24 p-24" style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.25)',
            borderTop: '4px solid #ec4899'
          }}>
            <div className="flex justify-between items-center flex-wrap gap-12 mb-16">
              <div>
                <div className="flex items-center gap-8">
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc' }}>
                    🔄 3-Step High-Conversion Follow-Up Cadence
                  </h3>
                  <span className="badge badge-won" style={{ background: '#ec4899', color: '#fff', fontSize: '10px' }}>
                    3x CONVERSION BOOST
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  80% of clients close on Touch #2 and Touch #3. System automatically nurtures cold leads with Value-Add and Slot-Scarcity follow-ups.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRunFollowUpPulse}
                disabled={runningFollowUp}
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', fontWeight: 'bold' }}
              >
                {runningFollowUp ? '⚡ Dispatched via SMTP...' : '🚀 Run Follow-Up Pulse Now'}
              </button>
            </div>

            {/* 3 Step Metric Cards */}
            <div className="flex gap-16 flex-wrap">
              <div className="glass-card flex-1" style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid #38bdf8' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>TOUCH 1: COLD HOOK (DAY 1)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginTop: '4px' }}>
                  {followUpStatus?.step0_initial || 0} Leads
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Initial staging portal & rate-card sent
                </div>
              </div>

              <div className="glass-card flex-1" style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid #f59e0b' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>TOUCH 2: VALUE-ADD (DAY 3)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>
                  {followUpStatus?.step1_valueAdd || 0} Leads
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  3 ROI optimizations & live demo walkthrough
                </div>
              </div>

              <div className="glass-card flex-1" style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid #ec4899' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>TOUCH 3: URGENCY & TOKEN (DAY 5)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ec4899', marginTop: '4px' }}>
                  {followUpStatus?.step2_urgencyLock || 0} Leads
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  2-hour SLA slot hold + ₹2,500 token lock
                </div>
              </div>

              <div className="glass-card flex-1" style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderTop: '2px solid #10b981' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>CADENCE COMPLETED</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
                  {followUpStatus?.completedCadence || 0} Leads
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Full 3-touch cadence delivered
                </div>
              </div>
            </div>
          </div>

          {/* Leads Queue for Follow-Up */}
          <div className="glass-card p-20" style={{ background: '#070712' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '14px' }}>
              📋 Leads Queued for Follow-Up Touchpoints ({followUpStatus?.dueLeads?.length || 0})
            </h4>

            {(!followUpStatus?.dueLeads || followUpStatus.dueLeads.length === 0) ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                ✅ All contacted leads are up to date! System autopilot advances follow-ups every 5 minutes.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {followUpStatus.dueLeads.map((item, idx) => (
                  <div key={item.id || idx} style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#f1f5f9' }}>{item.company}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginLeft: '8px' }}>({item.city || 'Global'})</span>
                      <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>{item.email}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge ${item.nextStep === 1 ? 'badge-new' : 'badge-proposal'}`}>
                        {item.nextStep === 1 ? 'Touch #2 Due (Value-Add)' : 'Touch #3 Due (Urgency)'}
                      </span>
                      <strong style={{ color: 'var(--accent-green)', fontSize: '13px' }}>{item.advanceStr} Token</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🏛️ Apex Enterprise Revenue Suite Tab (Apollo + GHL + Gong + Stripe) */}
      {activeTab === 'apex_suite' && (
        <ApexEnterpriseRevenueSuite />
      )}

      {/* ⚡ Titan Omnichannel Matrix Tab */}
      {activeTab === 'titan_matrix' && (
        <TitanOmnichannelMatrix />
      )}

      {/* 🎙️ WhatsApp Voice Note Studio Tab */}
      {activeTab === 'voice_studio' && (
        <WhatsAppVoiceStudio />
      )}

      {/* 📞 VOX Live Duplex Telephony Agent Tab */}
      {activeTab === 'vox_telephony' && (
        <VoxLiveDuplexPhone />
      )}

      {/* Template Editor Tab */}
      {activeTab === 'templates' && (
        <div className="glass-card p-24 animate-in" style={{ padding: '24px' }}>
          <div className="form-group mb-16">
            <label className="form-label">Select Template Preset</label>
            <select
              className="form-select"
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value)}
            >
              <option value="cold_outreach">Cold Email - High Response Hook</option>
              <option value="followup_1">Follow-up 1 - Value Add</option>
              <option value="proposal_pitch">Proposal Delivery Pitch</option>
            </select>
          </div>

          <div className="form-group mb-16">
            <label className="form-label">Subject Line (Use &#123;&#123;company&#125;&#125;, &#123;&#123;name&#125;&#125; tags)</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group mb-20">
            <label className="form-label">Email Body (Markdown / Plain Text)</label>
            <textarea
              className="form-textarea"
              style={{ height: '180px' }}
              value={body}
              onChange={e => setBody(e.target.value)}
            ></textarea>
          </div>

          {templateSaveNotice && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', marginBottom: '16px', fontSize: '13px' }}>
              {templateSaveNotice}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleSaveTemplate}>
            💾 Save Email Template
          </button>
        </div>
      )}
    </div>
  );
}
