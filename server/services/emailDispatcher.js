// ═════════════════════════════════════════════════════════════════════
//  AUTONOMOUS EMAIL DISPATCHER & VIP CLIENT RELAY ENGINE (HARDENED)
//  Zero-friction email delivery:
//  1. Real-time Gmail SMTP Connection Pooling (vikaas2030@gmail.com)
//  2. Aggressive email domain sanitization (strips @www. and invalid characters)
//  3. Automated Fallback Logging with diagnostic classification
// ═════════════════════════════════════════════════════════════════════

import 'dotenv/config';
import nodemailer from 'nodemailer';
import { getDB } from '../config/database.js';

let cachedTransporter = null;
let lastTransporterKey = null;

/**
 * Aggressively sanitizes cold-scraped or user-entered emails:
 * e.g., 'contact@www.techcorp.in' -> 'contact@techcorp.in'
 * removes spaces, brackets, trailing commas, etc.
 */
export function sanitizeEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') return '';
  let email = rawEmail.trim().toLowerCase();
  
  // Extract email inside angle brackets if formatted as "Name <email@domain.com>"
  const bracketMatch = email.match(/<([^>]+)>/);
  if (bracketMatch) {
    email = bracketMatch[1].trim();
  }

  // Strip trailing punctuation
  email = email.replace(/[,;:]+$/, '');

  // Strip common scraping artifact: "@www." -> "@"
  email = email.replace(/@www\./g, '@');

  // Validate standard email format
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return validRegex.test(email) ? email : '';
}

export function getTransporter() {
  const db = getDB();
  const settings = db.data.settings || {};
  let gmailUser = process.env.GMAIL_USER || settings.gmail_user;
  let gmailPass = process.env.GMAIL_APP_PASSWORD || settings.gmail_app_password || settings.gmail_pass;

  if (gmailPass && gmailPass.includes('your-')) {
    gmailPass = settings.gmail_app_password || settings.gmail_pass;
  }
  if (gmailUser && gmailUser.includes('your-')) {
    gmailUser = settings.gmail_user;
  }

  if (gmailUser && gmailPass && !gmailUser.includes('your-email') && !gmailPass.includes('your-app-password') && !gmailPass.includes('your-16-letter')) {
    const key = `${gmailUser}:${gmailPass}`;
    if (cachedTransporter && lastTransporterKey === key) {
      return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      socketTimeout: 30000,
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
    lastTransporterKey = key;
    return cachedTransporter;
  }

  return null;
}

export async function sendRealEmail({ to, subject, html, text }) {
  const db = getDB();
  const transporter = getTransporter();

  const cleanRecipient = sanitizeEmail(to);
  if (!cleanRecipient) {
    throw new Error(`Invalid or malformed recipient email address: "${to}"`);
  }
  if (!subject) {
    throw new Error('Subject is required for outbound dispatch!');
  }

  // 1. If live Gmail SMTP credentials exist, send via SMTP
  if (transporter) {
    try {
      const senderEmail = process.env.GMAIL_USER || db.data.settings?.gmail_user || 'vikaas2030@gmail.com';
      const info = await transporter.sendMail({
        from: `"Vikas Singh | ORION FLUX" <${senderEmail}>`,
        to: cleanRecipient,
        replyTo: senderEmail,
        subject,
        text: text || (html ? html.replace(/<[^>]*>?/gm, '') : ''),
        html: html || `<p>${text}</p>`
      });

      if (!db.data.activities) db.data.activities = [];
      db.data.activities.unshift({
        id: `act-email-${Date.now()}`,
        type: 'email_dispatched',
        title: `Live Email Delivered to: ${cleanRecipient}`,
        description: `Subject: ${subject} (Message ID: ${info.messageId}) via vikaas2030@gmail.com`,
        timestamp: new Date().toISOString()
      });
      db.save();

      return {
        success: true,
        delivered: true,
        mode: 'live_gmail_smtp',
        messageId: info.messageId,
        recipient: cleanRecipient,
        message: `✅ Real email successfully dispatched to ${cleanRecipient} via Google SMTP (vikaas2030@gmail.com)!`
      };
    } catch (smtpErr) {
      console.warn(`[SMTP Delivery Failed] Live SMTP failed for ${cleanRecipient}:`, smtpErr.message);

      if (!db.data.activities) db.data.activities = [];
      db.data.activities.unshift({
        id: `act-email-fail-${Date.now()}`,
        type: 'email_delivery_failed',
        title: `❌ Email Delivery FAILED: ${cleanRecipient}`,
        description: `SMTP Error: ${smtpErr.message}. Recipient domain is invalid or unreachable.`,
        timestamp: new Date().toISOString()
      });
      db.save();

      return {
        success: false,
        delivered: false,
        error: smtpErr.message,
        recipient: cleanRecipient,
        message: `❌ Real email to ${cleanRecipient} could NOT be delivered: ${smtpErr.message}`
      };
    }
  }

  // 2. If no SMTP credentials configured
  return {
    success: false,
    delivered: false,
    error: 'NO_SMTP_CREDENTIALS',
    recipient: cleanRecipient,
    message: `❌ Outbound SMTP not configured. Configure GMAIL_USER and GMAIL_APP_PASSWORD in .env.`
  };
}
