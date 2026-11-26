import express from 'express';
import {
  getMobileCockpitState,
  handleMobileCommand,
  sendMobileAlert
} from '../services/telegramMobileCockpit.js';
import getDB from '../config/database.js';

const router = express.Router();

// GET /api/telegram/status — Returns mobile alerts buffer & connection status
router.get('/status', (req, res) => {
  try {
    res.json({
      success: true,
      cockpit: getMobileCockpitState()
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telegram/command — Execute remote cockpit command (from web simulator or phone)
router.post('/command', async (req, res) => {
  try {
    const { command = '' } = req.body;
    const result = await handleMobileCommand(command);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telegram/config — Save Telegram Bot Token and Chat ID
router.post('/config', (req, res) => {
  try {
    const { botToken = '', chatId = '' } = req.body;
    const db = getDB();
    if (!db.data.settings) db.data.settings = {};
    db.data.settings.telegram_bot_token = botToken.trim();
    db.data.settings.telegram_chat_id = chatId.trim();
    db.save();

    res.json({
      success: true,
      message: 'Telegram Mobile Cockpit credentials saved successfully!',
      isConfigured: Boolean(botToken && chatId)
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telegram/test-alert — Dispatch test alert to mobile phone
router.post('/test-alert', async (req, res) => {
  try {
    const alert = await sendMobileAlert(
      '🚀 TEST COCKPIT ALERT',
      'Your ORION FLUX 3.0 Mobile Cockpit is 100% operational and connected to the autonomous empire.',
      'HIGH'
    );
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/telegram/webhook — Incoming webhook from Telegram Cloud Servers
router.post('/webhook', async (req, res) => {
  try {
    const msg = req.body?.message?.text;
    const fromId = req.body?.message?.chat?.id;

    if (msg) {
      console.log(`📱 [TELEGRAM WEBHOOK] Received: "${msg}" from chat: ${fromId}`);
      const cmdRes = await handleMobileCommand(msg);
      // Reply back to Telegram
      const db = getDB();
      const botToken = db.data.settings?.telegram_bot_token;
      if (botToken && fromId) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: fromId,
            text: cmdRes.reply,
            parse_mode: 'Markdown'
          })
        }).catch(() => {});
      }
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(200).json({ ok: false, error: err.message });
  }
});

export default router;
