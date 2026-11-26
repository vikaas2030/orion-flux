// ═════════════════════════════════════════════════════════════════════
//  INSTANT OWNER MOBILE ALERT ENGINE (TELEGRAM & WEBHOOK DISPATCHER)
//  Sends instantaneous high-priority alerts directly to the owner's
//  mobile phone whenever a client views a portal, clicks a payment link,
//  submits revision feedback, or when a deal advances.
// ═════════════════════════════════════════════════════════════════════

import http from 'http';
import https from 'https';
import { getDB } from '../config/database.js';

let alertQueue = [];
const MAX_QUEUE_SIZE = 50;

/**
 * Dispatch an instant owner alert to Mobile via Telegram & Webhook
 */
export async function dispatchOwnerAlert({ type, title, message, client, dealValue, priority = 'HIGH' }) {
  const timestamp = new Date().toISOString();
  const alertId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const alertPayload = {
    id: alertId,
    type, // 'PORTAL_VIEW' | 'PAYMENT_CLICK' | 'REVISION_REQUEST' | 'DEAL_ADVANCE'
    title,
    message,
    client: client || 'VIP Client',
    dealValue: dealValue || 'N/A',
    priority,
    timestamp,
    read: false
  };

  // 1. Log to In-Memory & Database Queue
  alertQueue.unshift(alertPayload);
  if (alertQueue.length > MAX_QUEUE_SIZE) alertQueue.pop();

  const db = getDB();
  if (!db.data.ownerAlerts) db.data.ownerAlerts = [];
  db.data.ownerAlerts.unshift(alertPayload);
  if (db.data.ownerAlerts.length > 100) db.data.ownerAlerts = db.data.ownerAlerts.slice(0, 100);

  // Also log into activities
  if (!db.data.activities) db.data.activities = [];
  db.data.activities.unshift({
    id: `act-${alertId}`,
    type: 'mobile_alert',
    title: `📱 Mobile Alert: ${title}`,
    description: message,
    timestamp
  });

  db.save();

  console.log(`\n🚨 [MOBILE ALERT TO OWNER] [${priority}] ${title}`);
  console.log(`   Message: ${message}`);
  console.log(`   Client : ${client} | Time: ${new Date().toLocaleTimeString()}\n`);

  // 2. Dispatch to Telegram Bot (if configured)
  const settings = db.data.settings || {};
  const tgToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegram_bot_token;
  const tgChatId = process.env.TELEGRAM_CHAT_ID || settings.telegram_chat_id;

  if (tgToken && tgChatId) {
    try {
      const tgText = `🚨 *ORION FLUX OWNER ALERT*\n\n*${title}*\n${message}\n\n👤 *Client:* ${client}\n💰 *Value:* ${dealValue}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`;
      await sendTelegramMessage(tgToken, tgChatId, tgText);
      console.log('   ✅ Dispatched to Telegram Mobile Chat ID:', tgChatId);
    } catch (tgErr) {
      console.error('   ⚠️ Telegram Dispatch Error:', tgErr.message);
    }
  }

  // 3. Dispatch to Custom Webhook (Discord / Slack / Make / Zapier)
  const webhookUrl = process.env.OWNER_WEBHOOK_URL || settings.owner_webhook_url;
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      await sendWebhook(webhookUrl, alertPayload);
      console.log('   ✅ Dispatched to Webhook endpoint');
    } catch (whErr) {
      console.error('   ⚠️ Webhook Dispatch Error:', whErr.message);
    }
  }

  return { success: true, alert: alertPayload };
}

/**
 * Send message via Telegram Bot API
 */
function sendTelegramMessage(botToken, chatId, text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });

    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Telegram request timeout')); });
    req.write(postData);
    req.end();
  });
}

/**
 * Send payload to Generic Webhook (Discord/Slack/Make)
 */
function sendWebhook(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const clientLib = url.protocol === 'https:' ? https : http;
    const postData = JSON.stringify(payload);

    const req = clientLib.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Webhook request timeout')); });
    req.write(postData);
    req.end();
  });
}

/**
 * Get recent owner alerts
 */
export function getOwnerAlerts() {
  const db = getDB();
  return {
    success: true,
    count: (db.data.ownerAlerts || []).length,
    unreadCount: (db.data.ownerAlerts || []).filter(a => !a.read).length,
    alerts: db.data.ownerAlerts || []
  };
}

/**
 * Mark alerts as read
 */
export function markAlertsAsRead() {
  const db = getDB();
  if (db.data.ownerAlerts) {
    db.data.ownerAlerts.forEach(a => a.read = true);
    db.save();
  }
  return { success: true };
}
