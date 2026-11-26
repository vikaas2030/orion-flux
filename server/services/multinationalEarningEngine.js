// ═════════════════════════════════════════════════════════════════════
//  ORION FLUX MULTINATIONAL EARNING & GLOBAL ARBITRAGE ENGINE (v5.0)
//  Scales Orion Flux into a Multi-National AI Enterprise Operating System:
//  - 5 Sovereign Global Territories (USA, UK/EU, UAE/Middle East, APAC, India)
//  - Multi-Currency Settlement Rails (USD, GBP, EUR, AED, INR)
//  - Section 16 IGST Zero-Rated Export of Services (LUT Tax Exemption)
//  - 86x FX Currency Multiplier Arbitrage (Earn in $ / £, Settle in ₹)
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';

// Live Currency Multiplier Arbitrage Rates (Base: INR)
export const FX_RATES = {
  USD: 86.85,  // $1 USD = ₹86.85 INR
  GBP: 110.20, // £1 GBP = ₹110.20 INR
  EUR: 94.50,  // €1 EUR = ₹94.50 INR
  AED: 23.65,  // 1 AED = ₹23.65 INR
  SGD: 64.90,  // 1 SGD = ₹64.90 INR
  INR: 1.00
};

// 5 Sovereign Global Territories
export const GLOBAL_HUBS = [
  {
    id: 'hub_us',
    name: '🇺🇸 North American Tech & Healthcare Hub',
    territory: 'United States & Canada',
    cities: ['New York', 'San Francisco', 'Chicago', 'Toronto'],
    currency: 'USD',
    currencySymbol: '$',
    fxMultiplier: FX_RATES.USD,
    timezone: 'America/New_York (EST / PST)',
    avgDealSizeUsd: 2500,
    avgDealSizeInr: Math.round(2500 * FX_RATES.USD),
    paymentRails: ['Stripe Direct USD', 'PayPal Business (payments@orionflux.agency)', 'US ACH Wire'],
    statutoryTax: '0% US Withholding (W-8BEN-E B2B Net-Zero Export)',
    activeNiches: ['B2B SaaS Lead Bots', 'Aesthetic & Dental Surgery Intake', 'Commercial Real Estate CineFlow'],
    status: 'ACTIVE_GLOBAL'
  },
  {
    id: 'hub_uk',
    name: '🇬🇧 London & Western European Enterprise Hub',
    territory: 'United Kingdom & Germany',
    cities: ['London', 'Manchester', 'Frankfurt', 'Munich'],
    currency: 'GBP',
    currencySymbol: '£',
    fxMultiplier: FX_RATES.GBP,
    timezone: 'Europe/London (GMT / CET)',
    avgDealSizeUsd: 2200,
    avgDealSizeInr: Math.round(2200 * FX_RATES.GBP),
    paymentRails: ['Wise UK IBAN Transfer', 'PayPal Enterprise', 'Stripe Multi-Currency'],
    statutoryTax: '0% UK Reverse Charge (Section 16 IGST Export of Services)',
    activeNiches: ['Private Harley St Clinics', 'Executive Wealth Advisory', 'FinTech Automation Engine'],
    status: 'ACTIVE_GLOBAL'
  },
  {
    id: 'hub_uae',
    name: '🇦🇪 Dubai & GCC High-Ticket Luxury Hub',
    territory: 'United Arab Emirates & Saudi Arabia',
    cities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha'],
    currency: 'USD',
    currencySymbol: '$',
    fxMultiplier: FX_RATES.USD,
    timezone: 'Asia/Dubai (GST)',
    avgDealSizeUsd: 3200,
    avgDealSizeInr: Math.round(3200 * FX_RATES.USD),
    paymentRails: ['Dubai Commercial Escrow', 'Stripe Global Wire', 'PayPal Direct'],
    statutoryTax: '0% UAE Corporate Tax Exemption (Foreign Digital Export)',
    activeNiches: ['Luxury Villa & Penthouse 3D Tours', 'Cosmetic Clinics', 'Architectural Portfolios'],
    status: 'ACTIVE_GLOBAL'
  },
  {
    id: 'hub_apac',
    name: '🇸🇬 Singapore & Australia High-Yield Hub',
    territory: 'Singapore & Australia',
    cities: ['Singapore', 'Sydney', 'Melbourne'],
    currency: 'USD',
    currencySymbol: '$',
    fxMultiplier: FX_RATES.USD,
    timezone: 'Asia/Singapore (SGT / AEST)',
    avgDealSizeUsd: 2800,
    avgDealSizeInr: Math.round(2800 * FX_RATES.USD),
    paymentRails: ['Stripe APAC', 'Wise Multi-Currency', 'PayPal International'],
    statutoryTax: 'Zero GST Cross-Border Digital Services',
    activeNiches: ['WealthTech Family Offices', 'Maritime Logistics Tracking', 'E-Commerce AI Bots'],
    status: 'ACTIVE_GLOBAL'
  },
  {
    id: 'hub_in',
    name: '🇮🇳 India High-Velocity Domestic Base',
    territory: 'India (Domestic)',
    cities: ['Delhi-NCR', 'Noida', 'Mumbai', 'Pune', 'Bengaluru', 'Hyderabad'],
    currency: 'INR',
    currencySymbol: '₹',
    fxMultiplier: 1.0,
    timezone: 'Asia/Kolkata (IST)',
    avgDealSizeUsd: 12,
    avgDealSizeInr: 999, // High-velocity refundable pilot token
    paymentRails: ['Direct Bank UPI: 9690973030@ibl', 'IMPS / NEFT Net-Banking', 'Razorpay QR'],
    statutoryTax: 'Section 22 CGST Act Net-Zero Tax Exemption (Under ₹20L threshold)',
    activeNiches: ['Real Estate WhatsApp Brokering', 'Interior Decorators', 'Dental Clinics & Healthcare'],
    status: 'ACTIVE_DOMESTIC'
  }
];

/**
 * Return Multinational Overview:
 * Aggregates all 5 Global Hubs, Multi-Currency Liquidity, and FX Arbitrage Metrics
 */
export function getMultinationalOverview() {
  const db = getDB();
  const deals = db.data.deals || [];
  const leads = db.data.leads || [];

  // Compute Territory Distribution
  const territoryStats = GLOBAL_HUBS.map(hub => {
    const hubDeals = deals.filter(d => {
      if (hub.id === 'hub_in') return d.currency === 'INR';
      return d.currency === hub.currency || hub.cities.some(c => (d.city || '').toLowerCase().includes(c.toLowerCase()));
    });

    const pipelineUsd = hubDeals.reduce((sum, d) => {
      const val = Number(d.value) || 0;
      return sum + (d.currency === 'INR' ? val / FX_RATES.USD : val);
    }, 0);

    const pipelineInr = Math.round(pipelineUsd * FX_RATES.USD);

    return {
      ...hub,
      activeDealsCount: hubDeals.length,
      pipelineValueUsd: Math.round(pipelineUsd),
      pipelineValueInr: pipelineInr,
      pipelineFormattedUsd: `$${Math.round(pipelineUsd).toLocaleString()}`,
      pipelineFormattedInr: `₹${pipelineInr.toLocaleString()}`
    };
  });

  const totalGlobalPipelineInr = territoryStats.reduce((sum, h) => sum + h.pipelineValueInr, 0);
  const totalGlobalPipelineUsd = Math.round(totalGlobalPipelineInr / FX_RATES.USD);

  return {
    success: true,
    systemMode: 'AUTONOMOUS_MULTINATIONAL_ENTERPRISE_OS',
    managingPrincipal: 'Vikas Singh (Founder & Managing Principal)',
    totalGlobalHubs: GLOBAL_HUBS.length,
    totalGlobalPipelineInrFormatted: `₹${totalGlobalPipelineInr.toLocaleString()}`,
    totalGlobalPipelineUsdFormatted: `$${totalGlobalPipelineUsd.toLocaleString()}`,
    fxRates: FX_RATES,
    territories: territoryStats,
    internationalPaymentRails: {
      paypal: 'payments@orionflux.agency',
      stripe: 'Connected USD/GBP Multi-Currency Gateway',
      wise: 'Multi-Currency IBAN / SWIFT Wire',
      domesticUpi: '9690973030@ibl (Vikas Singh)'
    },
    statutoryExportFramework: {
      lutReference: 'LUT-EXPORT-2026-B2B-TECH',
      taxRate: '0% Net-Zero (Section 16 IGST Act Zero-Rated Export of Software)',
      b2bReverseChargeApplicable: true
    }
  };
}

/**
 * Generate Multi-Currency Global B2B Export Invoice
 */
export function generateGlobalInvoice({ clientName, country, currency = 'USD', amount = 1500, serviceDescription }) {
  const isINR = currency === 'INR';
  const symbol = isINR ? '₹' : (currency === 'GBP' ? '£' : (currency === 'EUR' ? '€' : '$'));
  const fxMultiplier = FX_RATES[currency] || FX_RATES.USD;
  const inrEquivalent = isINR ? amount : Math.round(amount * fxMultiplier);

  const invoiceNumber = `MNC-INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  return {
    success: true,
    invoice: {
      invoiceNumber,
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      signatory: 'Vikas Singh (Founder & Managing Principal)',
      exporter: 'ORION FLUX Autonomous Global Technologies',
      billTo: {
        clientName,
        country,
        currency
      },
      serviceDescription: serviceDescription || 'Turnkey AI WhatsApp Intake & Cloud Automation Infrastructure',
      billing: {
        currency,
        currencySymbol: symbol,
        grossAmount: amount,
        taxPercent: 0,
        taxAmount: 0,
        taxComplianceNote: isINR
          ? 'Section 22 CGST Act Statutory Net-Zero Exemption'
          : 'Zero-Rated B2B Export of Software Services under Section 16 IGST Act (LUT Filed)',
        netPayable: amount,
        formattedNet: `${symbol}${amount.toLocaleString()}`,
        inrEquivalentFormatted: `₹${inrEquivalent.toLocaleString()} INR (FX Rate: 1 ${currency} = ₹${fxMultiplier})`
      },
      paymentInstructions: isINR
        ? 'Direct Bank UPI: 9690973030@ibl (Vikas Singh)'
        : `International PayPal: payments@orionflux.agency | Wire via Stripe USD`
    }
  };
}
