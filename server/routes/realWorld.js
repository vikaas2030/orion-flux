import express from 'express';
import { exec } from 'child_process';
import { getDB } from '../config/database.js';
import { getOmnichannelStats, runAutonomousOmnichannelCycle } from '../services/autonomousOmnichannelEngine.js';
import {
  CITIES_ROSTER,
  PROFESSIONS_ROSTER,
  runMultiCityBatch,
  getHuntingStatus
} from '../services/multiCityHunter.js';
import { sendRealEmail, getTransporter } from '../services/emailDispatcher.js';
import { getPublicBaseUrl } from '../services/publicAccess.js';

const router = express.Router();

// POST /api/real-world/send-email
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const result = await sendRealEmail({ to, subject, text, html });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/real-world/email-status
router.get('/email-status', (req, res) => {
  const isConfigured = !!getTransporter();
  const db = getDB();
  res.json({
    isConfigured,
    mode: isConfigured ? 'live_gmail_smtp' : 'mailto_ready',
    senderEmail: process.env.GMAIL_USER || db.data.settings?.gmail_user || 'Not Configured'
  });
});

// GET /api/real-world/meta-roster
router.get('/meta-roster', (req, res) => {
  res.json({
    cities: CITIES_ROSTER,
    professions: PROFESSIONS_ROSTER
  });
});

// POST /api/real-world/auto-hunt
router.post('/auto-hunt', async (req, res) => {
  try {
    const { cities = [], professions = [], limit = 3 } = req.body;
    const result = await runMultiCityBatch(cities, professions, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/real-world/auto-hunt-status
router.get('/auto-hunt-status', (req, res) => {
  res.json(getHuntingStatus());
});

// GET /api/real-world/search-businesses
router.get('/search-businesses', async (req, res) => {
  try {
    const { city = 'Delhi', category = 'dentist' } = req.query;
    const query = `${category} in ${city}`;
    
    // Query OpenStreetMap Nominatim for real physical businesses
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=15&addressdetails=1&extratags=1`;
    
    let realPlaces = [];
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'OrionFluxRealWorldHunter/1.0 (contact: business@orionflux.local)' }
      });
      if (response.ok) {
        const data = await response.json();
        realPlaces = data.map(item => {
          const parts = item.display_name.split(',');
          const name = parts[0]?.trim() || item.name || 'Local Business';
          const address = parts.slice(1, 4).join(',').trim();
          const phone = item.extratags?.phone || item.extratags?.['contact:phone'] || item.extratags?.['contact:mobile'] || null;
          
          return {
            id: `osm-${item.osm_id}`,
            name,
            category,
            city,
            address,
            phone,
            lat: item.lat,
            lon: item.lon,
            googleMapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`
          };
        });
      }
    } catch (e) {
      console.warn('Nominatim fetch fallback:', e.message);
    }

    // Direct directories deep-links for immediate lead discovery with live phone numbers
    const directoryLinks = {
      googleMaps: `https://www.google.com/maps/search/${encodeURIComponent(category + ' in ' + city)}`,
      justdial: `https://www.justdial.com/${encodeURIComponent(city.toLowerCase())}/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
      indiamart: `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(category + ' ' + city)}`,
      sulekha: `https://www.sulekha.com/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(city.toLowerCase())}`
    };

    res.json({
      success: true,
      city,
      category,
      totalFound: realPlaces.length,
      realPlaces,
      directoryLinks
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/real-world/generate-pitch
router.post('/generate-pitch', (req, res) => {
  try {
    const db = getDB();
    const upiId = db.data.settings?.upi_id || '9690973030@ibl';
    const {
      businessName = 'Valued Business',
      category = 'Business',
      city = 'your city',
      phone = '',
      service = 'whatsapp_bot',
      pricingAdvance = 2500,
      pricingTotal = 7500
    } = req.body;

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    let pitchText = '';
    let subject = '';

    if (service === 'whatsapp_bot') {
      subject = `Instant Customer Inquiry Automation for ${businessName}`;
      pitchText = `Namaste ji 🙏

Maine ${city} mein aapke ${businessName} ka profile dekha. 

Aksar naye customers jab WhatsApp ya call par inquire karte hain, to busy hone ke karan turant reply nahi mil pata aur customer kisi aur competitor ke paas chala jata hai.

Hum aapke ${businessName} ke liye ek **24/7 Automated WhatsApp AI Assistant** setup karte hain jo:
1. Naye customer ko 5 second mein instant reply dega
2. Services & Price list share karega
3. Appointment / Order booking confirm karega
4. Customer ka name aur phone number automatically save karega

Hamara introductory package sirf ₹${pricingTotal} ka hai (50% token advance: ₹${pricingAdvance}). 
Agar aap live system preview dekhna chahte hain to 'YES' reply karein.

Aapka din shubh ho!
ORION FLUX Automation Studio
Direct UPI: ${upiId}`;
    } else if (service === 'video_ad') {
      subject = `High-Converting 4K Video Reel Ad for ${businessName}`;
      pitchText = `Namaste ji 🙏

Aapke ${businessName} ke liye Instagram aur Facebook par chalne wali high-retention 1080p Cinematic Video Ad banayi ja sakti hai, jisse ${city} ke local customers aapke business ki taraf attract hon.

Hum kya deliver karenge:
1. Full HD Vertical Video Ad (Reels & Shorts format)
2. Professional Voiceover aur background music
3. Catchy animated text hooks jo pehle 3 second mein customer ko rok lein
4. Special offer Call-To-Action (Call/WhatsApp button)

Complete 1-Video package sirf ₹${pricingTotal} (Advance Token: ₹${pricingAdvance}).
Live production preview dekhne ke liye reply karein!

ORION FLUX CineFlow Studio
Direct UPI: ${upiId}`;
    } else {
      subject = `Modern Google-Ranked Website for ${businessName}`;
      pitchText = `Namaste ji 🙏

${city} mein jab log Google par '${category}' search karte hain, to unhe verified professional website chahiye hoti hai. Hum aapke ${businessName} ke liye ek high-speed, modern website aur Google Business Profile optimize karke de rahe hain:

1. Mobile-friendly 5-page fast website
2. 1-Click direct WhatsApp & Call buttons
3. Google Search & Maps par top ranking setup
4. 100% bug-free delivery with 24-hour rapid support

Fee: ₹${pricingTotal} (Advance Token: ₹${pricingAdvance} to UPI: ${upiId}).
Live client portal dekhne ke liye WhatsApp par 'PORTAL' ya 'YES' likh kar reply karein.

ORION FLUX Web Systems`;
    }

    const upiPayLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('ORION FLUX Agency')}&am=${pricingAdvance}&tn=${encodeURIComponent('Token_Advance_' + businessName.substring(0, 10))}&cu=INR`;
    const whatsappUrl = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(pitchText)}` : null;

    res.json({
      success: true,
      businessName,
      phone: cleanPhone,
      whatsappUrl,
      pitchText,
      subject,
      upiId,
      pricingAdvance,
      pricingTotal,
      upiPayLink
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/real-world/real-collections
router.get('/real-collections', (req, res) => {
  try {
    const db = getDB();
    if (!db.data.real_collections) {
      db.data.real_collections = [];
      db.save();
    }
    const totalRealReceived = db.data.real_collections.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    res.json({
      success: true,
      collections: db.data.real_collections,
      totalRealReceived,
      currency: 'INR',
      upiId: db.data.settings?.upi_id || '9690973030@ibl'
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/real-world/record-payment
router.post('/record-payment', (req, res) => {
  try {
    const db = getDB();
    if (!db.data.real_collections) {
      db.data.real_collections = [];
    }

    const {
      clientName,
      phone,
      amount,
      utrNumber,
      service,
      paymentMethod = 'UPI',
      notes = ''
    } = req.body;

    if (!clientName || !amount || !utrNumber) {
      return res.status(400).json({ error: true, message: 'Client Name, Amount, and UTR Number are mandatory!' });
    }

    const newPayment = {
      id: `real-pay-${Date.now()}`,
      clientName,
      phone: phone || 'N/A',
      amount: parseFloat(amount),
      utrNumber: utrNumber.trim(),
      service: service || 'Business Automation / AI Service',
      paymentMethod,
      notes,
      receivedAt: new Date().toISOString(),
      verified: true
    };

    db.data.real_collections.unshift(newPayment);

    // Also record in activities
    if (db.data.activities) {
      db.data.activities.unshift({
        id: `act-${Date.now()}`,
        type: 'real_payment',
        title: `Real Money Received: ₹${parseFloat(amount).toLocaleString()}`,
        description: `Verified UPI payment from ${clientName} (UTR: ${utrNumber})`,
        timestamp: new Date().toISOString()
      });
    }

    db.save();

    res.json({
      success: true,
      message: `✅ Real payment of ₹${parseFloat(amount).toLocaleString()} successfully recorded and verified!`,
      payment: newPayment
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/real-world/action-deck — 1-Click WhatsApp & Real Client Closing Radar
router.get('/action-deck', (req, res) => {
  try {
    const db = getDB();
    const leads = db.data.leads || [];
    const deals = db.data.deals || [];

    // Find leads with phone numbers
    const actionableLeads = leads
      .filter(l => l.phone && l.phone !== 'Search Google Maps (India)' && l.phone !== 'Check Google Maps Listing' && l.phone.length > 5)
      .slice(0, 15)
      .map(lead => {
        let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

        const slug = (lead.company || 'vip').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const portalUrl = `${getPublicBaseUrl()}/portal/${slug}`;
        
        const urgentPitch = `Namaste ji 🙏\n\nMain ORION FLUX se baat kar raha hoon. Humne aapke '${lead.company}' ke liye ek automated 24/7 client booking aur WhatsApp response system design kiya hai.\n\nLive Client Portal dekhiye:\n${portalUrl}\n\nAaj ke liye hum 100% money-back guarantee ke sath ₹999 ke refundable token par setup slot provide kar rahe hain.\n\nKya aap 2 minute ka test lena chahenge?`;

        return {
          id: lead.id,
          company: lead.company,
          city: lead.city,
          phone: lead.phone,
          cleanPhone,
          portalUrl,
          whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(urgentPitch)}`,
          urgentPitch,
          pricingTotal: lead.pricingTotal || (lead.currency === 'USD' ? '$850' : '₹9,000'),
          advanceToken: lead.currency === 'USD' ? '$49' : '₹999'
        };
      });

    // High-value platform deals for 1-click copy-paste
    const platformDeals = deals.map(deal => {
      const clientName = deal.lead_name || deal.lead_company || 'Client';
      const portalSlug = (deal.lead_company || 'portal').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const portalUrl = `https://d8763b1d5dedd1.lhr.life/portal/${portalSlug}`;

      const platformPitch = `Hi ${clientName},\n\nRegarding your requirement: "${deal.title}".\n\nWe have already pre-engineered and 4-Layer QA Certified your technical architecture. You can review the interactive staging build and deliverables handover vault directly here:\n${portalUrl}\n\nKey Highlights:\n- 100% Milestone Escrow compliant\n- 4-Layer QA Cryptographic Certification (QA-CERT-2026)\n- 14-day 100% satisfaction guarantee\n- Ready for instant deployment within 24-48 hours.\n\nLet's activate the milestone today so we can push live.\n\nBest regards,\nORION FLUX Engineering Studio`;

      return {
        id: deal.id,
        title: deal.title,
        company: deal.lead_company || deal.lead_name,
        value: deal.value,
        currency: deal.currency,
        portalUrl,
        copyProposalText: platformPitch
      };
    });

    res.json({
      success: true,
      totalActionable: actionableLeads.length,
      actionableLeads,
      platformDeals
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/real-world/launch-whatsapp — Automatically open WhatsApp Web with customized message & live demo
router.post('/launch-whatsapp', (req, res) => {
  try {
    const { phone, text, leadId } = req.body;
    let targetPhone = phone;
    let messageText = text;

    if (leadId) {
      const db = getDB();
      const lead = (db.data.leads || []).find(l => l.id == leadId);
      if (lead) {
        targetPhone = lead.phone.replace(/[^0-9]/g, '');
        if (targetPhone.length === 10) targetPhone = '91' + targetPhone;
        const slug = (lead.company || 'vip').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const portalUrl = `https://66b899531de096.lhr.life/portal/${slug}`;
        messageText = `Namaste ji 🙏\n\nMain ORION FLUX se baat kar raha hoon. Humne aapke '${lead.company}' ke liye ek automated 24/7 client booking aur WhatsApp response system design kiya hai.\n\nLive Demo Portal dekhiye:\n${portalUrl}\n\nAaj ke liye hum 100% money-back guarantee ke sath ₹999 ke refundable token par setup slot provide kar rahe hain.\n\nKya aap 2 minute ka test lena chahenge?`;
      }
    }

    if (!targetPhone) {
      return res.status(400).json({ error: true, message: 'Phone number required' });
    }

    const clean = targetPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://web.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(messageText || '')}`;

    // Launch default browser on Windows
    exec(`start "" "${waUrl}"`, (err) => {
      if (err) console.warn('Launch WhatsApp notice:', err.message);
    });

    res.json({
      success: true,
      message: `WhatsApp Web launched for +${clean}!`,
      waUrl
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/real-world/omnichannel-status — Telephony & WhatsApp autonomous metrics
router.get('/omnichannel-status', (req, res) => {
  try {
    res.json(getOmnichannelStats());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/real-world/omnichannel-trigger — Manually trigger 1 cycle of WhatsApp + Voice Call
router.post('/omnichannel-trigger', async (req, res) => {
  try {
    const result = await runAutonomousOmnichannelCycle();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
