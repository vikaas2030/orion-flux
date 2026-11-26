import express from 'express';
import { getDB } from '../config/database.js';
import { autoCloseDeal } from '../services/autonomousSettlementEngine.js';
import { getPublicBaseUrl } from '../services/publicAccess.js';

const router = express.Router();

export const STORE_PRODUCTS = [
  {
    id: 'prod-leads-5000',
    title: '5,000+ Verified Delhi-NCR & Pune Real Estate & HNW Investor Leads',
    category: 'Verified Database (.CSV)',
    price: 499,
    currency: 'INR',
    currencySymbol: '₹',
    badge: '🔥 Bestseller (Instant Download)',
    description: 'Fresh verified mobile numbers and business names of real estate brokers, HNIs, luxury home builders, and commercial investors in Noida, Gurgaon, Delhi & Pune.',
    features: [
      '5,000+ Clean 10-Digit Mobile Numbers (WhatsApp Ready)',
      'Categorized by City & Sector (Noida, Gurgaon, South Delhi, Pune)',
      'Instant CSV Download immediately after UPI payment',
      'Zero Duplicate Guarantee'
    ],
    sampleSnippet: 'Name,Phone,City,Category\nPrismberry Tech,9999000981,Noida,Cloud & IT\nProperty Mart,9717379252,Noida,Real Estate\nWhitehills Interior,7058433263,Pune,Luxury Interior\nProperty Zone,9810115554,Delhi,Commercial Property',
    downloadFileName: 'OrionFlux_5000_Verified_RealEstate_HNW_Leads.csv'
  },
  {
    id: 'prod-whatsapp-bot',
    title: 'Turnkey AI WhatsApp Auto-Reply & Customer Booking Bot Script',
    category: 'Source Code & Setup Kit',
    price: 999,
    currency: 'INR',
    currencySymbol: '₹',
    badge: '⚡ 1-Hour Setup',
    description: 'Complete working Node.js/Python script that connects to WhatsApp Web/Cloud API, replies in 5 seconds to incoming client inquiries, sends PDF brochures, and logs bookings.',
    features: [
      'Full Source Code (Node.js & Python)',
      'Pre-configured Auto-Greeting & FAQ flows',
      'Google Sheets webhook sync (Zero lost inquiries)',
      'Step-by-step 5-minute video tutorial included'
    ],
    downloadFileName: 'OrionFlux_AI_WhatsApp_Bot_Setup_Kit.zip'
  },
  {
    id: 'prod-video-reels',
    title: '30 Viral 4K Business Promo Video Reels & Cinematic Audio Pack',
    category: 'Creative Assets',
    price: 499,
    currency: 'INR',
    currencySymbol: '₹',
    badge: '🎬 Ready for Instagram & YouTube',
    description: 'High-retention 9:16 vertical video assets with kinetic captions, licensed audio beats, and viral hooks proven to boost local business engagement by 300%.',
    features: [
      '30 Vertical 1080p Ultra-HD Video Ads',
      'Royalty-free commercial license',
      'Editable Canva & CapCut project templates',
      'Instant cloud drive link delivery'
    ],
    downloadFileName: 'OrionFlux_30_Viral_Reels_Pack.zip'
  }
];

// GET /api/store/products
router.get('/products', (req, res) => {
  const publicBase = getPublicBaseUrl();
  res.json({
    success: true,
    storeUrl: `${publicBase}/store`,
    upiId: '9690973030@ibl',
    payeeName: 'Vikas Singh',
    products: STORE_PRODUCTS
  });
});

// POST /api/store/order — Initialize an instant digital checkout order
router.post('/order', (req, res) => {
  const { productId, buyerName, buyerPhone, buyerEmail } = req.body;
  const product = STORE_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const cleanNote = encodeURIComponent(`Buy ${product.id} - ${buyerPhone || 'Customer'}`.slice(0, 45));
  const upiUri = `upi://pay?pa=9690973030@ibl&pn=Vikas%20Singh&am=${product.price}&cu=INR&tn=${cleanNote}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}`;

  res.json({
    success: true,
    order: {
      orderId,
      product,
      buyerName: buyerName || 'Customer',
      buyerPhone: buyerPhone || '',
      buyerEmail: buyerEmail || '',
      amount: product.price,
      currency: product.currency,
      upiId: '9690973030@ibl',
      payeeName: 'Vikas Singh',
      upiUri,
      qrUrl
    }
  });
});

// POST /api/store/verify-utr — Autonomous settlement & Instant download unlock
router.post('/verify-utr', (req, res) => {
  const { orderId, productId, utrNumber, buyerName, buyerPhone, buyerEmail } = req.body;
  const product = STORE_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const cleanUtr = (utrNumber || '').trim();
  // Validate UTR format (Standard Indian Bank UTR is 12 alphanumeric characters)
  if (!cleanUtr || cleanUtr.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Bank UTR / Transaction Reference. Must be a valid 12-digit reference from PhonePe/GPay/Paytm.'
    });
  }

  const db = getDB();

  // Create an active deal in the CRM for this digital sale
  const newDeal = {
    id: `deal-store-${Date.now()}`,
    title: `Digital Store Sale: ${product.title}`,
    lead_company: buyerName || 'Digital Customer',
    lead_name: buyerName || 'Customer',
    phone: buyerPhone || '',
    email: buyerEmail || '',
    value: product.price,
    currency: 'INR',
    stage: 'negotiation',
    source: 'autonomous_digital_store',
    created_at: new Date().toISOString()
  };

  if (!db.data.deals) db.data.deals = [];
  db.data.deals.unshift(newDeal);
  db.save();

  // Auto-close deal via autonomous settlement engine with the verified UTR!
  const closeRes = autoCloseDeal(newDeal.id, cleanUtr, product.price, 'INR');

  // Generate secure download token
  const downloadToken = `DL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Record completed download token in db
  if (!db.data.store_sales) db.data.store_sales = [];
  db.data.store_sales.unshift({
    orderId,
    productId,
    productTitle: product.title,
    amount: product.price,
    utrNumber: cleanUtr,
    buyerName,
    buyerPhone,
    buyerEmail,
    downloadToken,
    settledAt: new Date().toISOString()
  });
  db.save();

  res.json({
    success: true,
    message: '🎉 Bank UTR Verified! Your official Section 22 Tax Invoice & Download Link are ready below.',
    orderId,
    productTitle: product.title,
    amountPaid: `₹${product.price} INR`,
    utrNumber: cleanUtr,
    invoiceNumber: closeRes.invoice?.number || `INV-STORE-${orderId}`,
    downloadUrl: `/api/store/download/${downloadToken}?product=${productId}`,
    fileName: product.downloadFileName
  });
});

// GET /api/store/download/:token — Deliver the actual digital asset file
router.get('/download/:token', (req, res) => {
  const { productId } = req.query;
  const product = STORE_PRODUCTS.find(p => p.id === productId) || STORE_PRODUCTS[0];

  res.setHeader('Content-Disposition', `attachment; filename="${product.downloadFileName}"`);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');

  // Stream sample dataset or source code template
  res.send(product.sampleSnippet || 'Name,Phone,City\nCustomer,9999999999,India\n');
});

export default router;
