import getDB from '../config/database.js';

export const HIGH_TICKET_MARKETS = [
  {
    key: 'dubai_luxury',
    title: '🇦🇪 Dubai & UAE Luxury Hub',
    city: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    countryCode: '+971',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$1,800 – $3,200 USD',
    avgAdvance: '$1,200 USD',
    niches: [
      {
        id: 'dubai_real_estate',
        name: 'Luxury Real Estate & Villa Developers',
        query: 'luxury real estate in Dubai United Arab Emirates',
        price: 2800,
        advance: 1400,
        deliverables: '3D Virtual Tour Integration, 4K Drone Showcase Reel, 24/7 VIP WhatsApp Investor Intake'
      },
      {
        id: 'dubai_cosmetic',
        name: 'Aesthetic & Cosmetic Surgery Clinics',
        query: 'cosmetic clinic in Dubai United Arab Emirates',
        price: 2400,
        advance: 1200,
        deliverables: 'High-Retention Patient Intake Assistant, HIPAA/GDPR Compliant Booking Portal, 4K Motion Ads'
      },
      {
        id: 'dubai_architecture',
        name: 'High-End Architectural & Interior Design',
        query: 'interior design in Dubai United Arab Emirates',
        price: 2000,
        advance: 1000,
        deliverables: 'Interactive 3D Portfolio Staging, Automated Commercial RFP Closer, Ultra-HD Client Video'
      }
    ]
  },
  {
    key: 'uk_enterprise',
    title: '🇬🇧 London & UK Enterprise Hub',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    countryCode: '+44',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,000 – $3,500 USD (£1,600 – £2,800)',
    avgAdvance: '$1,250 USD',
    niches: [
      {
        id: 'london_healthcare',
        name: 'Private Healthcare & Dental Clinics (Harley St)',
        query: 'private clinic in London United Kingdom',
        price: 2600,
        advance: 1300,
        deliverables: 'Private Patient Onboarding Assistant, Milestone SLA Guarantee, 4K Retina Campaign'
      },
      {
        id: 'london_saas',
        name: 'FinTech & B2B SaaS Platforms',
        query: 'software agency in London United Kingdom',
        price: 3200,
        advance: 1600,
        deliverables: 'Turnkey React/Node Web App Engine, Automated Stripe Billing, Full Source Code Ownership'
      },
      {
        id: 'london_wealth',
        name: 'Executive Wealth & Legal Advisory',
        query: 'wealth management in London United Kingdom',
        price: 2500,
        advance: 1250,
        deliverables: 'Executive Client Portal, Confidential Document Vault, Automated Retainer Billing'
      }
    ]
  },
  {
    key: 'us_tech_medical',
    title: '🇺🇸 US Tech & Medical Centers',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    countryCode: '+1',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,500 – $4,500 USD',
    avgAdvance: '$1,500 USD',
    niches: [
      {
        id: 'us_medical_centers',
        name: 'Specialty Hospitals & Surgery Centers',
        query: 'specialty hospital in New York United States',
        price: 3500,
        advance: 1750,
        deliverables: '24/7 Patient Emergency Intake Bot, Medical Compliance Suite, Motion Video Reels'
      },
      {
        id: 'us_b2b_saas',
        name: 'Enterprise Cloud & SaaS Companies',
        query: 'cloud software in San Francisco United States',
        price: 4200,
        advance: 2100,
        deliverables: 'Full-Stack Agentic Automation Platform, RESTful Microservices, SLA Warranty'
      },
      {
        id: 'us_commercial_re',
        name: 'Commercial Real Estate Brokers',
        query: 'commercial real estate in Chicago United States',
        price: 2800,
        advance: 1400,
        deliverables: 'Tenant Acquisition Funnel, 4K High-Retention Video Assets, Automated Staging Portal'
      }
    ]
  },
  {
    key: 'singapore_apac',
    title: '🇸🇬 Singapore APAC Hub',
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    countryCode: '+65',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,200 – $3,800 USD',
    avgAdvance: '$1,300 USD',
    niches: [
      {
        id: 'sg_wealthtech',
        name: 'WealthTech & Family Offices',
        query: 'wealth management in Singapore',
        price: 3200,
        advance: 1600,
        deliverables: 'Executive Investor Portal, Multi-Asset Telemetry Dashboard, 24/7 VIP Intake Bot'
      },
      {
        id: 'sg_logistics',
        name: 'Maritime & Supply Chain Logistics',
        query: 'shipping logistics in Singapore',
        price: 2600,
        advance: 1300,
        deliverables: 'Autonomous Cargo Tracking Bot, Automated Customs Document Pipeline, 4K Corporate Showcase'
      }
    ]
  },
  {
    key: 'canada_tech',
    title: '🇨🇦 Canada Enterprise Hub',
    city: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    countryCode: '+1',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,000 – $3,600 USD',
    avgAdvance: '$1,200 USD',
    niches: [
      {
        id: 'can_healthtech',
        name: 'Private Medical & Surgical Clinics',
        query: 'private clinic in Toronto Canada',
        price: 2500,
        advance: 1250,
        deliverables: 'Automated Patient Booking Concierge, HIPAA/PIPEDA Audit Suite, 4K Video Reels'
      },
      {
        id: 'can_enterprise_saas',
        name: 'Enterprise Software & Cloud Labs',
        query: 'software company in Toronto Canada',
        price: 3400,
        advance: 1700,
        deliverables: 'Full-Stack React/Node Microservices Architecture, Turnkey Automated Billing, SLA Guarantee'
      }
    ]
  },
  {
    key: 'australia_oceania',
    title: '🇦🇺 Australia High-Yield Hub',
    city: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    countryCode: '+61',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,400 – $4,000 USD',
    avgAdvance: '$1,400 USD',
    niches: [
      {
        id: 'aus_commercial_prop',
        name: 'Commercial Property & Estate Developers',
        query: 'commercial property in Sydney Australia',
        price: 3000,
        advance: 1500,
        deliverables: '3D Virtual Tour Integration, High-Net-Worth Investor WhatsApp Bot, 4K Cinema Ads'
      },
      {
        id: 'aus_fintech',
        name: 'FinTech & Payment Platforms',
        query: 'fintech company in Sydney Australia',
        price: 3800,
        advance: 1900,
        deliverables: 'High-Concurrency Transaction Pipeline, Automated Compliance Vault, Zero-Downtime Guarantee'
      }
    ]
  },
  {
    key: 'switzerland_wealth',
    title: '🇨🇭 Switzerland Sovereign Wealth Hub',
    city: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    countryCode: '+41',
    currency: 'USD',
    currencySymbol: '$',
    ticketRange: '$2,800 – $4,800 USD',
    avgAdvance: '$1,600 USD',
    niches: [
      {
        id: 'ch_private_wealth',
        name: 'Private Wealth & Asset Managers',
        query: 'asset management in Zurich Switzerland',
        price: 4500,
        advance: 2250,
        deliverables: 'Confidential Client Vault, Swiss Banking Compliant Data Architecture, Ultra-HD Motion Reel'
      },
      {
        id: 'ch_medtech',
        name: 'Precision MedTech & Bio Labs',
        query: 'medical technology in Zurich Switzerland',
        price: 3600,
        advance: 1800,
        deliverables: 'Regulatory Documentation Portal, Automated Research Triage Bot, 4K Scientific Showcase'
      }
    ]
  }
];

let highTicketHuntingState = {
  isRunning: false,
  currentMarket: '',
  currentNiche: '',
  totalHunted: 0,
  dealsCreated: 0,
  logs: []
};

export async function runHighTicketBatch(selectedMarketKeys = [], limitPerNiche = 2) {
  highTicketHuntingState.isRunning = true;
  highTicketHuntingState.logs = [];

  const db = getDB();
  const paypalEmail = db.data.settings?.paypal_email || 'payments@orionflux.agency';

  const marketsToScan = selectedMarketKeys.length > 0
    ? HIGH_TICKET_MARKETS.filter(m => selectedMarketKeys.includes(m.key))
    : HIGH_TICKET_MARKETS;

  let addedLeads = [];
  let addedDeals = [];

  for (const market of marketsToScan) {
    highTicketHuntingState.currentMarket = market.title;
    highTicketHuntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🚀 Initiating High-Ticket Search in ${market.title}...`);

    for (const niche of market.niches) {
      highTicketHuntingState.currentNiche = niche.name;
      highTicketHuntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🔍 Probing ${niche.name} (${market.flag} ${market.city})...`);

      const candidateQueries = [
        niche.query,
        `${niche.name.split('&')[0].trim()} in ${market.city}`,
        `clinic in ${market.city}`,
        `hospital in ${market.city}`,
        `company in ${market.city}`
      ];

      let places = [];
      for (const q of candidateQueries) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=${limitPerNiche}&addressdetails=1&extratags=1`;
        try {
          const res = await fetch(url, {
            headers: { 'User-Agent': 'OrionFluxEnterpriseHunter/3.0 (high-ticket@orionflux.agency)' },
            signal: AbortSignal.timeout(4000)
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              places = data;
              break;
            }
          }
        } catch (_) {}
      }

      // STRICTLY ZERO SYNTHETIC LEADS: If Nominatim returns no real places, skip without fabricating data
      if (!Array.isArray(places) || places.length === 0) {
        continue;
      }

      for (const item of places) {
        const rawName = item.display_name?.split(',')[0]?.trim() || item.name;
        if (!rawName) continue;

        const alreadyExists = (db.data.leads || []).some(l => 
          l.name?.toLowerCase() === rawName.toLowerCase() || 
          l.company?.toLowerCase() === rawName.toLowerCase()
        );

        if (!alreadyExists) {
          const address = item.display_name?.split(',').slice(1, 4).join(',').trim() || `${market.city}, ${market.country}`;
          const phone = item.extratags?.phone || item.extratags?.['contact:phone'] || null;
          const website = item.extratags?.website || item.extratags?.['contact:website'] || null;
          const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
          const clientSlug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const stagingUrl = `https://orionflux.agency/portal/${clientSlug}`;

          // High-Ticket Pitch Formulation
          const emailSubject = `Confidential: Autonomous Digital & Video Infrastructure for ${rawName}`;
          const pitchText = `Hello Leadership Team at ${rawName},

We conducted a technical evaluation of your market presence in ${market.city}, ${market.country}.

In the premium ${niche.name} sector, top-tier firms routinely capture 35% higher client lifetime value by eliminating manual response bottlenecks and deploying high-retention 4K motion assets.

ORION FLUX has architected a bespoke production suite tailored specifically for ${rawName}:
1. 24/7 Autonomous Client Intake & VIP Qualification Bot
2. 4K Cinema-Grade Showcase Video Reels for Acquisition
3. Executive Portal with Real-Time Milestone Delivery

Commercial Terms:
• Total Investment: $${niche.price.toLocaleString()} USD (100% All-Inclusive Net • Zero Tax / Reverse Charge B2B)
• 50% Milestone Advance Token: $${niche.advance.toLocaleString()} USD (Secured via PayPal Escrow / Stripe Wire)
• Turnkey Sprint Delivery: 10 Business Days with Full Source & IP Ownership

Your private portal is ready for review:
${stagingUrl}

Best regards,
Vikas | Managing Principal
ORION FLUX Autonomous Global OS
Escrow Rail: ${paypalEmail}`;

          let resolvedEmail = null;
          if (website) {
            const cleanDomain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
            if (cleanDomain && cleanDomain.includes('.')) {
              resolvedEmail = `contact@${cleanDomain}`;
            }
          }

          const leadRecord = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            name: rawName,
            company: rawName,
            email: resolvedEmail,
            phone: phone || null,
            rawPhone: cleanPhone,
            countryCode: market.countryCode,
            website: website || 'N/A',
            industry: niche.name,
            city: market.city,
            country: market.country,
            countryFlag: market.flag,
            currency: 'USD',
            currencySymbol: '$',
            address: address,
            source: 'high_ticket_dollar_hunter',
            status: 'qualified',
            score: 98,
            suggestedPitch: pitchText,
            emailSubject: emailSubject,
            pricingAdvance: niche.advance,
            pricingTotal: niche.price,
            paymentRail: `PayPal Escrow: ${paypalEmail} / Stripe USD`,
            created_at: new Date().toISOString()
          };

          if (!db.data.leads) db.data.leads = [];
          db.data.leads.unshift(leadRecord);
          addedLeads.push(leadRecord);

          // Automatically Create High-Ticket Deal in Pipeline
          const newDeal = {
            id: Date.now() + Math.floor(Math.random() * 5000),
            title: `${rawName} — Enterprise AI Automation & 4K Suite`,
            lead_id: leadRecord.id,
            lead_name: rawName,
            lead_company: rawName,
            value: niche.price,
            advance: niche.advance,
            currency: 'USD',
            stage: 'proposal',
            probability: 90,
            phone: leadRecord.phone,
            email: leadRecord.email,
            deliverables: niche.deliverables,
            clientPortalUrl: `/portal/${clientSlug}`,
            created_at: new Date().toISOString()
          };

          if (!db.data.deals) db.data.deals = [];
          db.data.deals.unshift(newDeal);
          addedDeals.push(newDeal);

          // Record High-Ticket Activity
          if (!db.data.activities) db.data.activities = [];
          db.data.activities.unshift({
            id: `act-${Date.now()}`,
            type: 'high_ticket_deal_created',
            title: `💎 HIGH-TICKET DEAL ARMED: $${niche.price.toLocaleString()} USD`,
            description: `Hunted ${rawName} (${market.city}, ${market.flag} ${market.country}). Staging portal generated and proposal deal created.`,
            timestamp: new Date().toISOString()
          });

          highTicketHuntingState.totalHunted++;
          highTicketHuntingState.dealsCreated++;
          highTicketHuntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 💎 Staged $${niche.price.toLocaleString()} USD Deal for ${rawName} (${market.city})`);
        }
      }

      await new Promise(r => setTimeout(r, 1200));
    }
  }

  db.save();
  highTicketHuntingState.isRunning = false;
  highTicketHuntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🏁 High-Ticket Expansion Complete! Added ${addedLeads.length} enterprise leads and ${addedDeals.length} deals to CRM.`);

  return {
    success: true,
    totalLeadsAdded: addedLeads.length,
    totalDealsAdded: addedDeals.length,
    newLeads: addedLeads,
    newDeals: addedDeals,
    huntingState: highTicketHuntingState
  };
}

export function getHighTicketStatus() {
  return highTicketHuntingState;
}
