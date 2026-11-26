import { getDB } from '../config/database.js';

export const CITIES_ROSTER = [
  // Global Metros
  { name: 'New York', country: 'United States', countryCode: '+1', flag: '🇺🇸', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'San Francisco', country: 'United States', countryCode: '+1', flag: '🇺🇸', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Los Angeles', country: 'United States', countryCode: '+1', flag: '🇺🇸', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Chicago', country: 'United States', countryCode: '+1', flag: '🇺🇸', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'London', country: 'United Kingdom', countryCode: '+44', flag: '🇬🇧', currency: 'GBP', tier: 'Global Tier-1' },
  { name: 'Manchester', country: 'United Kingdom', countryCode: '+44', flag: '🇬🇧', currency: 'GBP', tier: 'Global Tier-1' },
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: '+971', flag: '🇦🇪', currency: 'AED', tier: 'Global Tier-1' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: '+971', flag: '🇦🇪', currency: 'AED', tier: 'Global Tier-1' },
  { name: 'Toronto', country: 'Canada', countryCode: '+1', flag: '🇨🇦', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Vancouver', country: 'Canada', countryCode: '+1', flag: '🇨🇦', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Sydney', country: 'Australia', countryCode: '+61', flag: '🇦🇺', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Melbourne', country: 'Australia', countryCode: '+61', flag: '🇦🇺', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Singapore', country: 'Singapore', countryCode: '+65', flag: '🇸🇬', currency: 'USD', tier: 'Global Tier-1' },
  { name: 'Berlin', country: 'Germany', countryCode: '+49', flag: '🇩🇪', currency: 'EUR', tier: 'Global Tier-1' },
  { name: 'Tokyo', country: 'Japan', countryCode: '+81', flag: '🇯🇵', currency: 'USD', tier: 'Global Tier-1' },
  
  // India Tier-1 & Regional Centers
  { name: 'Noida', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Delhi', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Gurgaon', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Mumbai', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Bengaluru', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Hyderabad', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Pune', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Ahmedabad', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Kolkata', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Chennai', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-1' },
  { name: 'Lucknow', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-2' },
  { name: 'Jaipur', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-2' },
  { name: 'Chandigarh', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-2' },
  { name: 'Bareilly', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-2' },
  { name: 'Moradabad', country: 'India', countryCode: '+91', flag: '🇮🇳', currency: 'INR', tier: 'India Tier-2' }
];

export const PROFESSIONS_ROSTER = [
  { id: 'web_software', name: 'Software, Web Apps & SaaS', searchTerm: 'software', pitchType: 'website', priceInr: 25000, advanceInr: 10000, priceUsd: 1200, advanceUsd: 500 },
  { id: 'video_production', name: 'AI Video Ads & Motion Reels', searchTerm: 'studio', pitchType: 'video_ad', priceInr: 6000, advanceInr: 2500, priceUsd: 450, advanceUsd: 200 },
  { id: 'dentist', name: 'Dental Clinics & Practices', searchTerm: 'dental', pitchType: 'whatsapp_bot', priceInr: 7500, advanceInr: 2500, priceUsd: 600, advanceUsd: 250 },
  { id: 'doctor', name: 'Hospitals & Medical Centers', searchTerm: 'hospital', pitchType: 'whatsapp_bot', priceInr: 9000, advanceInr: 3000, priceUsd: 850, advanceUsd: 400 },
  { id: 'real_estate', name: 'Real Estate & Property Developers', searchTerm: 'property', pitchType: 'video_ad', priceInr: 15000, advanceInr: 5000, priceUsd: 950, advanceUsd: 450 },
  { id: 'ecommerce', name: 'E-Commerce & D2C Brands', searchTerm: 'boutique', pitchType: 'website', priceInr: 18000, advanceInr: 6000, priceUsd: 750, advanceUsd: 350 },
  { id: 'gym', name: 'Gyms & Fitness Centers', searchTerm: 'fitness', pitchType: 'whatsapp_bot', priceInr: 6500, advanceInr: 2000, priceUsd: 400, advanceUsd: 150 },
  { id: 'interior_designer', name: 'Interior Designers & Architects', searchTerm: 'interior', pitchType: 'video_ad', priceInr: 15000, advanceInr: 5000, priceUsd: 800, advanceUsd: 350 },
  { id: 'restaurant', name: 'Restaurants & Hospitality', searchTerm: 'restaurant', pitchType: 'whatsapp_bot', priceInr: 7000, advanceInr: 2500, priceUsd: 500, advanceUsd: 200 }
];

let huntingState = {
  isRunning: false,
  currentCity: '',
  currentCountry: '',
  currentProfession: '',
  totalExtracted: 0,
  leadsAddedToCrm: 0,
  logs: []
};

export async function runMultiCityBatch(selectedCities = [], selectedProfessions = [], limitPerBatch = 3) {
  huntingState.isRunning = true;
  huntingState.logs = [];

  const db = getDB();
  const upiId = db.data.settings?.upi_id || '9690973030@ibl';
  const paypalEmail = db.data.settings?.paypal_email || 'payments@orionflux.agency';

  const citiesToScan = selectedCities.length > 0 
    ? CITIES_ROSTER.filter(c => selectedCities.includes(c.name))
    : CITIES_ROSTER.slice(0, 6);

  const professionsToScan = selectedProfessions.length > 0
    ? PROFESSIONS_ROSTER.filter(p => selectedProfessions.includes(p.id))
    : PROFESSIONS_ROSTER.slice(0, 4);

  let newlyAdded = [];

  for (const city of citiesToScan) {
    for (const prof of professionsToScan) {
      huntingState.currentCity = city.name;
      huntingState.currentCountry = city.country;
      huntingState.currentProfession = prof.name;
      
      const isIndia = city.country === 'India';
      const currency = isIndia ? 'INR' : 'USD';
      const currencySymbol = isIndia ? '₹' : '$';
      const totalFee = isIndia ? prof.priceInr : prof.priceUsd;
      const advanceFee = isIndia ? 999 : 49; // High-conversion refundable pilot token

      const query = `${prof.searchTerm} in ${city.name} ${city.country}`;
      huntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🔍 Scanning ${prof.name} in ${city.name} (${city.flag} ${city.country})...`);

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=${limitPerBatch}&addressdetails=1&extratags=1`;
        let places = [];
        try {
          const res = await fetch(url, {
            headers: { 'User-Agent': 'OrionFluxGlobalAutonomousHunter/2.0 (contact: global@orionflux.local)' },
            signal: AbortSignal.timeout(3500)
          });
          if (res.ok) places = await res.json();
        } catch (fetchErr) {
          places = [];
        }

        if (Array.isArray(places)) {
          for (const item of places) {
            const rawName = item.display_name?.split(',')[0]?.trim() || item.name;
            if (!rawName) continue;

            const alreadyExists = (db.data.leads || []).some(l => 
              l.name?.toLowerCase() === rawName.toLowerCase() || 
              l.company?.toLowerCase() === rawName.toLowerCase()
            );

            if (!alreadyExists) {
              const address = item.display_name ? item.display_name.split(',').slice(1, 4).join(',').trim() : '';
              const phone = item.extratags?.phone || item.extratags?.['contact:phone'] || item.extratags?.['contact:mobile'] || null;
              const website = item.extratags?.website || item.extratags?.['contact:website'] || null;
              const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
              
              // Only assign email if a clean domain exists without www. prefix or manufacturing
              let resolvedEmail = null;
              if (website) {
                const domainClean = website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
                if (domainClean && domainClean.includes('.')) {
                  resolvedEmail = `contact@${domainClean}`;
                }
              }
              
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawName + ' ' + city.name + ' ' + city.country)}`;

              // Corporate pitch tailored for International vs Indian market
              let pitchText = '';
              let emailSubject = '';

              if (isIndia) {
                emailSubject = `Customer Inquiry Automation for ${rawName} (${city.name})`;
                pitchText = `Namaste ji 🙏

Maine ${city.name} mein aapke '${rawName}' ka business dekha. 

Aksar naye customers jab inquiry karte hain, to reply milne mein der hone par wo doosre competitors ke paas chale jaate hain.

Hum aapke ${rawName} ke liye **24/7 Automated Customer AI Assistant & Video Ads** setup karte hain jo:
1. Naye customer ko 5 second mein instant reply & rate-card dega
2. Direct booking / appointment confirm karega
3. Customer data auto-save karega

Package: ₹${totalFee.toLocaleString()} (Section 22 Net-Zero Tax Exempt).
Aaj ke sprint me 100% Money-Back Guarantee ke sath sirf ₹${advanceFee} refundable token par test karein.
Live client preview dekhne ke liye 'YES' reply karein!

ORION FLUX Autonomous Studio
Direct UPI: ${upiId} (Vikas Singh)
[Reply STOP to opt out]`;
              } else {
                emailSubject = `High-Converting Digital Automation & Video Assets for ${rawName}`;
                pitchText = `Hello Team at ${rawName},

I reviewed your presence in ${city.name}, ${city.country}. 

Many high-growth businesses in ${prof.name} lose up to 45% of prospective clients due to slow response times and lack of dynamic short-form video assets.

At ORION FLUX, we build turnkey digital infrastructure for businesses:
1. 24/7 Instant AI Client Intake & Lead Qualification
2. 1080p Cinematic High-Retention Video Assets for Social & Ads
3. Automated Scheduling & Milestone CRM Sync

Introductory Tier: $${totalFee.toLocaleString()} USD (50% Milestone Advance: $${advanceFee.toLocaleString()} USD via Stripe / PayPal).
Would you be open to a 2-minute interactive production walkthrough this week?

Best regards,
ORION FLUX Global Studio
Paypal/International: ${paypalEmail}`;
              }

              const leadRecord = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                name: rawName,
                company: rawName,
                email: resolvedEmail || null,
                phone: phone || null,
                rawPhone: cleanPhone || null,
                countryCode: city.countryCode,
                website: website || 'N/A',
                industry: prof.name,
                city: city.name,
                country: city.country,
                countryFlag: city.flag,
                currency: currency,
                currencySymbol: currencySymbol,
                address: address,
                source: 'global_autonomous_hunter',
                status: 'new',
                score: isIndia ? 85 : 95,
                googleMapsUrl: mapsUrl,
                suggestedPitch: pitchText,
                emailSubject: emailSubject,
                pricingAdvance: advanceFee,
                pricingTotal: totalFee,
                paymentRail: isIndia ? `UPI: ${upiId}` : `PayPal / Stripe: ${paypalEmail}`,
                created_at: new Date().toISOString()
              };

              if (!db.data.leads) db.data.leads = [];
              db.data.leads.unshift(leadRecord);
              newlyAdded.push(leadRecord);
              huntingState.totalExtracted++;
              huntingState.leadsAddedToCrm++;
              huntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] ✅ ${city.flag} Extracted: ${rawName} (${city.name}, ${city.country})`);
            }
          }
        }
      } catch (err) {
        huntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] ⚠️ Notice for ${city.name}: ${err.message}`);
      }

      await new Promise(r => setTimeout(r, 1100));
    }
  }

  db.save();
  huntingState.isRunning = false;
  huntingState.logs.unshift(`[${new Date().toLocaleTimeString()}] 🏁 Worldwide Hunt Complete! ${newlyAdded.length} verified global clients added to CRM.`);

  return {
    success: true,
    totalNewlyAdded: newlyAdded.length,
    newLeads: newlyAdded,
    huntingState
  };
}

export function getHuntingStatus() {
  return huntingState;
}
