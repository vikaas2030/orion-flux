import express from 'express';
import {
  autoCloseDeal,
  autoCloseAllReadyDeals,
  reconcilePaymentWebhook,
  getSettlementStatus
} from '../services/autonomousSettlementEngine.js';
import {
  parseBankSms,
  executeBankReconciliation
} from '../services/bankReconciliationEngine.js';
import getDB from '../config/database.js';

const router = express.Router();

// GET /api/settlement/status — Real-time bank settlement & collection ledger metrics
router.get('/status', (req, res) => {
  try {
    res.json(getSettlementStatus());
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/parse-sms — High-tech parsing of raw bank SMS or UTR
router.post('/parse-sms', (req, res) => {
  try {
    const { text = '' } = req.body;
    const result = parseBankSms(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/reconcile-and-close — Execute verified settlement, mark WON, generate official receipt
router.post('/reconcile-and-close', (req, res) => {
  try {
    const { dealId, amount, utrNumber, bankName, notes } = req.body;
    const result = executeBankReconciliation({ dealId, amount, utrNumber, bankName, notes });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/settlement/receipts — Retrieve verified settlement receipts
router.get('/receipts', (req, res) => {
  try {
    const db = getDB();
    res.json({
      success: true,
      receipts: db.data.receipts || []
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/sms-webhook — 100% Autonomous Bank SMS / UPI Forwarder Webhook
// Listens for incoming bank SMS from Android SMS forwarder or UPI gateway, parses amount & UTR,
// and automatically reconciles, marks deal WON, and issues official tax receipt without human clicks!
router.post('/sms-webhook', (req, res) => {
  try {
    const rawText = req.body?.text || req.body?.message || req.body?.sms || req.body?.body || '';
    if (!rawText.trim()) {
      return res.status(400).json({ error: true, message: 'Empty SMS text received' });
    }

    console.log(`🏦 [AUTONOMOUS SMS WEBHOOK] Received bank notification: "${rawText.slice(0, 100)}..."`);
    const parsedResult = parseBankSms(rawText);

    if (!parsedResult.success || !parsedResult.parsed?.amount || !parsedResult.parsed?.utrNumber) {
      return res.json({
        success: false,
        message: 'Could not extract complete amount or 12-digit UTR from SMS',
        parsed: parsedResult.parsed
      });
    }

    const { amount, utrNumber, bankName } = parsedResult.parsed;
    const targetDeal = parsedResult.topMatch || parsedResult.suggestedDeals?.[0];

    if (!targetDeal) {
      return res.json({
        success: false,
        message: 'Valid amount & UTR parsed, but no matching pending pipeline deal found to close',
        parsed: parsedResult.parsed
      });
    }

    // Fully Autonomous Reconciliation
    const reconciliation = executeBankReconciliation({
      dealId: targetDeal.dealId,
      amount,
      utrNumber,
      bankName: bankName || 'UPI Instant Bank Transfer (9690973030@ibl)',
      notes: `100% Autonomous Bank SMS Webhook Settlement for ${targetDeal.company}`
    });

    console.log(`🎉 [AUTONOMOUS SETTLEMENT WON] Deal ${targetDeal.title} settled for ₹${amount} with UTR ${utrNumber}!`);

    res.json({
      success: true,
      autonomousSettled: true,
      dealTitle: targetDeal.title,
      company: targetDeal.company,
      amountSettled: amount,
      utrNumber,
      receipt: reconciliation.receipt
    });
  } catch (err) {
    console.error('Autonomous SMS webhook error:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/auto-close/:id — 1-Click Auto-Close specific deal and verify advance
router.post('/auto-close/:id', (req, res) => {
  try {
    const result = autoCloseDeal(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/auto-close-all — Autonomous Batch Closing of all ready pipeline deals
router.post('/auto-close-all', (req, res) => {
  try {
    const result = autoCloseAllReadyDeals();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/settlement/webhook — Universal Bank Settlement & UTR Webhook Listener
router.post('/webhook', (req, res) => {
  try {
    const result = reconcilePaymentWebhook(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
