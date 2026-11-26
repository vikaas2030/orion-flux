import getDB from '../config/database.js';
import { autoCloseDeal } from './autonomousSettlementEngine.js';
import { getPublicBaseUrl } from './publicAccess.js';

/**
 * ORION FLUX Bank SMS & UTR Auto-Reconciler Engine
 * Automatically extracts amount, 12-digit UTR, and banking rails from raw SMS/UPI notifications.
 * Auto-matches against pending pipeline deals for 1-click settlement and WhatsApp receipt delivery.
 */

const BANK_PATTERNS = [
  { name: 'State Bank of India (SBI)', regex: /\b(sbi|state bank)\b/i },
  { name: 'HDFC Bank', regex: /\b(hdfc|hdfcbank)\b/i },
  { name: 'ICICI Bank', regex: /\b(icici)\b/i },
  { name: 'Axis Bank', regex: /\b(axis|axisbank)\b/i },
  { name: 'Punjab National Bank (PNB)', regex: /\b(pnb|punjab national)\b/i },
  { name: 'Bank of Baroda (BOB)', regex: /\b(bob|baroda)\b/i },
  { name: 'Kotak Mahindra Bank', regex: /\b(kotak)\b/i },
  { name: 'Paytm Payments Bank', regex: /\b(paytm)\b/i },
  { name: 'PhonePe UPI', regex: /\b(phonepe)\b/i },
  { name: 'Google Pay (GPay)', regex: /\b(google pay|gpay|tez)\b/i },
  { name: 'CRED UPI', regex: /\b(cred)\b/i },
  { name: 'BHIM UPI Rail', regex: /\b(bhim|upi)\b/i },
  { name: 'PayPal International Escrow', regex: /\b(paypal)\b/i },
  { name: 'Stripe Escrow Rail', regex: /\b(stripe)\b/i }
];

export function parseBankSms(rawText = '') {
  const text = String(rawText).trim();
  if (!text) {
    return {
      success: false,
      error: 'Empty input text'
    };
  }

  // 1. Amount Extraction
  // Matches: "Rs. 2,500.00", "Rs 2500", "INR 2,500", "₹2,500", "credited by 2500", "credited with 2,500.00", "$350"
  let extractedAmount = null;
  let currency = 'INR';

  const usdMatch = text.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  if (usdMatch) {
    currency = 'USD';
    extractedAmount = parseFloat(usdMatch[1].replace(/,/g, ''));
  } else {
    const inrPatterns = [
      /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
      /(?:credited\s+(?:by|with)|received|deposited)\s+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
      /\b([\d,]+(?:\.\d{1,2})?)\s*(?:rs|inr|rupees)\b/i,
      /upi\/[0-9]{12}\/([\d,]+(?:\.\d{1,2})?)/i
    ];

    for (const pat of inrPatterns) {
      const m = text.match(pat);
      if (m && m[1]) {
        const val = parseFloat(m[1].replace(/,/g, ''));
        if (val > 0 && val < 50000000) { // sanity check
          extractedAmount = val;
          break;
        }
      }
    }
  }

  // 2. 12-digit UTR Extraction
  // Standard Indian Banking UTR / RRN is 12 digits numeric
  let extractedUtr = null;
  const utrPatterns = [
    /(?:upi\/|utr[:\s#]*|rrn[:\s#]*|ref[:\s#]*|ref\s*no[:\s#]*|txn[:\s#]*|txn\s*id[:\s#]*)([0-9]{12})/i,
    /\b([0-9]{12})\b/
  ];

  for (const pat of utrPatterns) {
    const m = text.match(pat);
    if (m && m[1]) {
      extractedUtr = m[1];
      break;
    }
  }

  // If international Paypal/Stripe ID
  if (!extractedUtr) {
    const intlTxnMatch = text.match(/\b(PAYID-[A-Z0-9]+|ch_[a-zA-Z0-9]{20,}|pi_[a-zA-Z0-9]{20,})\b/i);
    if (intlTxnMatch) {
      extractedUtr = intlTxnMatch[1];
    }
  }

  // 3. Bank / Payment Rail Extraction
  let extractedBank = 'UPI Instant Bank Rail';
  for (const bank of BANK_PATTERNS) {
    if (bank.regex.test(text)) {
      extractedBank = bank.name;
      break;
    }
  }

  // 4. Payer / Reference Note
  let extractedPayer = '';
  const refMatch = text.match(/(?:\/ref|\/desc|ref[:\s]+|from\s+)([A-Za-z0-9\s&.-]{3,30})(?:\s+on|\s+at|\s+via|\.|\,|$)/i);
  if (refMatch && refMatch[1] && !/^(rs|inr|₹|\d)/i.test(refMatch[1].trim())) {
    extractedPayer = refMatch[1].trim();
  } else {
    const fromMatch = text.match(/\bfrom\s+([A-Za-z0-9\s&.-]{3,30})(?:\s+on|\s+at|\s+via|\s+ref|\.|\,|$)/i);
    if (fromMatch && fromMatch[1] && !/^(rs|inr|₹|\d)/i.test(fromMatch[1].trim())) {
      extractedPayer = fromMatch[1].trim();
    }
  }

  // 5. Intelligent Match Against Active Deals
  const db = getDB();
  const deals = db.data.deals || [];
  const pendingDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');

  const matches = pendingDeals.map(deal => {
    const dealValue = parseFloat(deal.value) || 0;
    const expectedAdvance = Math.round(dealValue * 0.5);
    const company = deal.lead_company || deal.lead_name || '';

    let score = 0;
    let matchReason = [];

    // Exact advance match
    if (extractedAmount && Math.abs(expectedAdvance - extractedAmount) === 0) {
      score += 60;
      matchReason.push(`Exact 50% advance match (₹${expectedAdvance.toLocaleString()})`);
    } else if (extractedAmount && Math.abs(dealValue - extractedAmount) === 0) {
      score += 50;
      matchReason.push(`Exact 100% full deal match (₹${dealValue.toLocaleString()})`);
    } else if (extractedAmount && Math.abs(expectedAdvance - extractedAmount) <= 500) {
      score += 30;
      matchReason.push(`Near advance match (diff: ₹${Math.abs(expectedAdvance - extractedAmount)})`);
    }

    // Payer / Company name match
    if (extractedPayer && company) {
      const pClean = extractedPayer.toLowerCase();
      const cClean = company.toLowerCase();
      if (cClean.includes(pClean) || pClean.includes(cClean)) {
        score += 40;
        matchReason.push(`Client name matched "${company}"`);
      }
    }

    // High probability boost
    if (deal.probability >= 80) {
      score += 10;
    }

    return {
      dealId: deal.id,
      title: deal.title,
      company: company,
      value: dealValue,
      expectedAdvance: expectedAdvance,
      currency: deal.currency || 'INR',
      stage: deal.stage,
      probability: deal.probability,
      score: score,
      matchReason: matchReason.join(' + ') || 'General pipeline deal'
    };
  }).sort((a, b) => b.score - a.score);

  return {
    success: true,
    parsed: {
      amount: extractedAmount,
      currency: currency,
      amountFormatted: extractedAmount 
        ? (currency === 'USD' ? `$${extractedAmount.toLocaleString()}` : `₹${extractedAmount.toLocaleString()}`)
        : null,
      utrNumber: extractedUtr,
      bankName: extractedBank,
      payerName: extractedPayer,
      isComplete: Boolean(extractedAmount && extractedUtr)
    },
    topMatch: matches.length > 0 && matches[0].score >= 50 ? matches[0] : null,
    suggestedDeals: matches.slice(0, 5)
  };
}

export function executeBankReconciliation({ dealId, amount, utrNumber, bankName, notes }) {
  if (!dealId) {
    throw new Error('dealId is required for deal settlement');
  }
  if (!utrNumber) {
    throw new Error('Valid 12-digit UTR / Transaction Reference is required');
  }

  const parsedAmount = parseFloat(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    throw new Error('Valid payment amount is required');
  }

  // Execute official autoCloseDeal
  const closeResult = autoCloseDeal(dealId, {
    advanceAmount: parsedAmount,
    utrNumber: utrNumber.trim(),
    paymentMethod: bankName || 'UPI Instant Bank Transfer (Google Pay / PhonePe)',
    customTerms: notes || 'Verified via Instant Bank SMS & UTR Auto-Reconciler'
  });

  const deal = closeResult.deal;
  const company = deal.lead_company || deal.lead_name || 'Valued Client';
  const currencySymbol = deal.currency === 'USD' ? '$' : '₹';

  // Generate Official Payment Receipt Record
  const receiptNo = `ORION-REC-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const clientSlug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const portalUrl = `${getPublicBaseUrl()}/portal/${clientSlug}`;

  // Pre-formatted WhatsApp Receipt Delivery Text
  const whatsappReceiptText = `*OFFICIAL PAYMENT SETTLEMENT RECEIPT*\n` +
    `*Receipt No:* ${receiptNo}\n` +
    `*Client:* ${company}\n` +
    `*Project:* ${deal.title}\n` +
    `*Managing Principal:* Vikas Singh\n` +
    `*Amount Settled:* ${currencySymbol}${parsedAmount.toLocaleString()}\n` +
    `*Pricing Policy:* 100% All-Inclusive Net (₹0 Extra GST Surcharge • Sec 22 CGST Exempt)\n` +
    `*Statutory Exemption:* CERT-CGST-2026-EXEMPT-09\n` +
    `*Transaction UTR:* ${utrNumber}\n` +
    `*Settled Rail:* ${bankName || 'UPI Instant Bank Transfer'}\n` +
    `*Date & Time:* ${dateFormatted} at ${timeFormatted}\n` +
    `*Milestone Status:* 50% Advance Token VERIFIED & SECURED\n\n` +
    `🚀 *Live Client Portal & Deliverables Unlocked:*\n${portalUrl}\n\n` +
    `Thank you for partnering with ORION FLUX Autonomous Global OS!\n— Signed by Vikas Singh (Managing Principal)`;

  // Check phone number from lead or deal
  const db = getDB();
  const lead = (db.data.leads || []).find(l => 
    (deal.lead_id && l.id === deal.lead_id) ||
    (l.company && l.company.toLowerCase() === company.toLowerCase())
  );

  let cleanPhone = '';
  if (lead && lead.phone) {
    cleanPhone = lead.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
  }

  const whatsappUrl = cleanPhone 
    ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappReceiptText)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappReceiptText)}`;

  const receipt = {
    receiptNo,
    dealId: deal.id,
    title: deal.title,
    clientCompany: company,
    clientPhone: lead ? lead.phone : '',
    amount: parsedAmount,
    currency: deal.currency || 'INR',
    amountFormatted: `${currencySymbol}${parsedAmount.toLocaleString()}`,
    utrNumber: utrNumber.trim(),
    bankName: bankName || 'UPI Instant Bank Transfer',
    settledAt: now.toISOString(),
    settledAtFormatted: `${dateFormatted} at ${timeFormatted}`,
    pricingPolicy: '100% All-Inclusive Net • ₹0 Extra GST Surcharge',
    portalUrl,
    whatsappReceiptText,
    whatsappUrl
  };

  // Persist receipt in DB
  if (!db.data.receipts) db.data.receipts = [];
  db.data.receipts.unshift(receipt);
  db.save();

  return {
    success: true,
    message: `🎉 Settlement Complete! Deal "${deal.title}" settled for ${currencySymbol}${parsedAmount.toLocaleString()} [UTR: ${utrNumber}].`,
    receipt,
    deal,
    verifiedPayment: closeResult.verifiedPayment
  };
}
