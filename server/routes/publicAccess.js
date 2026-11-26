import express from 'express';
import {
  getPublicAccessInfo,
  updatePublicTunnel,
  getClientPortalData,
  submitClientFeedback,
  handleClientPortalChat,
  submitClientPaymentUTR,
  simulateClientSandbox
} from '../services/publicAccess.js';
import { dispatchOwnerAlert } from '../services/ownerAlertEngine.js';
import { recordPortalVisit } from '../services/goldenWindowCloser.js';
import hotIntentRadarEngine from '../services/hotIntentRadarEngine.js';

const router = express.Router();

// GET /api/public-access/info
router.get('/info', (req, res) => {
  try {
    const info = getPublicAccessInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/set-tunnel
router.post('/set-tunnel', (req, res) => {
  try {
    const { url, provider } = req.body;
    const info = updatePublicTunnel(url, provider);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/public-access/client-portal/:code
router.get('/client-portal/:code', (req, res) => {
  try {
    const { code } = req.params;
    const data = getClientPortalData(code);

    if (data.success && data.portal) {
      // ⚡ Track Golden Window 90-Second Closer Session & Hot Intent Radar
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Browser';
      try {
        recordPortalVisit(code, { ip, userAgent });
        hotIntentRadarEngine.recordPing({
          slug: code,
          portalCode: code,
          clientName: data.portal.company,
          clientPhone: data.portal.phone || '',
          action: 'PORTAL_VIEW',
          amount: data.portal.invoice?.testToken || 999,
          page: `/portal/${code}`,
          ip,
          userAgent
        });
      } catch (gwErr) {
        // non-blocking
      }

      // 🚨 Trigger instant mobile alert to owner
      dispatchOwnerAlert({
        type: 'PORTAL_VIEW',
        title: `👀 VIP Portal Viewed: ${data.portal.company}`,
        message: `Client opened their staging portal to review deliverables & invoice token (${data.portal.invoice?.testTokenFormatted || data.portal.invoice?.advanceFormatted || 'Pending'}).`,
        client: data.portal.company,
        dealValue: data.portal.invoice?.totalFormatted || 'N/A',
        priority: 'HIGH'
      }).catch(() => {});
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/client-portal/:code/payment-click
router.post('/client-portal/:code/payment-click', (req, res) => {
  try {
    const { code } = req.params;
    const { paymentMethod, amount } = req.body;
    const data = getClientPortalData(code);
    const company = data.portal?.company || code.toUpperCase();

    // 🚨 Trigger urgent payment alert to owner
    dispatchOwnerAlert({
      type: 'PAYMENT_CLICK',
      title: `💰 Payment Link Clicked: ${company}`,
      message: `Client clicked to settle payment via ${paymentMethod || 'UPI QR (9690973030@ibl)'} for amount: ${amount || '₹999 / $49 Token'}. Expect incoming bank settlement!`,
      client: company,
      dealValue: amount || 'Token Deposit',
      priority: 'URGENT'
    }).catch(() => {});

    res.json({ success: true, message: 'Payment click recorded & owner alerted' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/client-portal/:code/submit-utr — Direct Real-World Settlement from Portal
router.post('/client-portal/:code/submit-utr', (req, res) => {
  try {
    const { code } = req.params;
    const { utrNumber, amount, paymentMethod } = req.body;
    const result = submitClientPaymentUTR(code, { utrNumber, amount, paymentMethod });
    const company = result.portal?.company || code.toUpperCase();

    // 🚨 Dispatch URGENT Bank Credit Alert to Owner
    dispatchOwnerAlert({
      type: 'PAYMENT_RECEIVED',
      title: `💰 BANK SETTLEMENT VERIFIED: ${company}`,
      message: `Client submitted verified UTR: ${utrNumber || 'N/A'}. Amount: ${result.portal?.invoice?.advanceFormatted || amount || 'Advance Paid'}. Status: Deal Won & Credited!`,
      client: company,
      dealValue: result.portal?.invoice?.advanceFormatted || 'Settled',
      priority: 'URGENT'
    }).catch(() => {});

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/submit-feedback
router.post('/submit-feedback', (req, res) => {
  try {
    const { clientCode, rating, comment, author } = req.body;
    const result = submitClientFeedback(clientCode, { rating, comment, author });

    // 🚨 Trigger feedback alert
    dispatchOwnerAlert({
      type: 'REVISION_FEEDBACK',
      title: `⭐ Client Feedback Received: ${clientCode.toUpperCase()}`,
      message: `${author || 'Client'} left a ${rating || 5}-star review/note: "${comment}"`,
      client: clientCode.toUpperCase(),
      dealValue: 'N/A',
      priority: 'MEDIUM'
    }).catch(() => {});

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/client-chat
router.post('/client-chat', (req, res) => {
  try {
    const { clientCode, message } = req.body;
    if (!message) return res.status(400).json({ error: true, message: 'Message required' });
    const result = handleClientPortalChat(clientCode, message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/public-access/client-sandbox-simulate — Live Interactive Sandbox Simulation
router.post('/client-sandbox-simulate', (req, res) => {
  try {
    const { clientCode, message, scenario } = req.body;
    const result = simulateClientSandbox(clientCode, { message, scenario });

    // 🚨 Alert owner that client is actively playing with the live sandbox!
    dispatchOwnerAlert({
      type: 'SANDBOX_INTERACTION',
      title: `⚡ Client Sandbox Tested: ${result.company || clientCode}`,
      message: `Client executed live test scenario: "${result.userInput}". Response generated in ${result.latencyMs}ms with 100% QA Pass. Prime time to close!`,
      client: result.company,
      dealValue: 'Hot Intent',
      priority: 'HIGH'
    }).catch(() => {});

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
