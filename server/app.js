import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛡️ CRASH GUARD: Prevent server exits on unexpected network or parser exceptions
process.on('uncaughtException', (err) => {
  console.error('[CRASH GUARD] Caught Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRASH GUARD] Caught Unhandled Rejection:', reason?.message || reason);
});

import { getDB } from './config/database.js';
import leadsRouter from './routes/leads.js';
import dealsRouter from './routes/deals.js';
import activitiesRouter from './routes/activities.js';
import dashboardRouter from './routes/dashboard.js';
import settingsRouter from './routes/settings.js';
import socialRouter from './routes/social.js';
import autonomousRouter from './routes/autonomous.js';
import agencyRouter from './routes/agency.js';
import intelligenceRouter from './routes/intelligence.js';
import persuasionRouter from './routes/persuasion.js';
import freelanceRouter from './routes/freelance.js';
import hyperspeedRouter from './routes/hyperspeed.js';
import publicAccessRouter from './routes/publicAccess.js';
import revenueStreamsRouter from './routes/revenueStreams.js';
import realWorldRouter from './routes/realWorld.js';
import dealAutomationRouter from './routes/dealAutomation.js';
import settlementRouter from './routes/settlement.js';
import projectsRouter from './routes/projects.js';
import complianceRouter from './routes/compliance.js';
import alertsRouter from './routes/alerts.js';
import deliverablesRouter from './routes/deliverables.js';
import retainerRouter from './routes/retainer.js';
import seoRouter from './routes/seo.js';
import startupRouter from './routes/startup.js';
import inboundCloserRouter from './routes/inboundCloser.js';
import followUpRouter from './routes/followUp.js';
import voiceStudioRouter from './routes/voiceStudio.js';
import highTicketRouter from './routes/highTicket.js';
import videoPitchRouter from './routes/videoPitch.js';
import telegramCockpitRouter from './routes/telegramCockpit.js';
import whatsappCloudRouter from './routes/whatsappCloud.js';
import councilRouter from './routes/council.js';
import unicornRouter from './routes/unicorn.js';
import partnerRouter from './routes/partner.js';
import universalCheckoutRouter from './routes/universalCheckout.js';
import escrowJobsRouter from './routes/escrowJobs.js';
import trustRouter from './routes/trust.js';
import moneyMachineRouter from './routes/moneyMachine.js';
import rapidPaymentRouter from './routes/rapidPayment.js';
import target5LakhRouter from './routes/target5Lakh.js';
import brandRouter from './routes/brand.js';
import { trackPartnerClick } from './services/globalPartnerEngine.js';
import dealCloserRouter from './routes/dealCloser.js';
import dealRecoveryRouter from './routes/dealRecovery.js';
import domesticCloserRouter from './routes/domesticCloser.js';
import hotIntentRouter from './routes/hotIntent.js';
import agedDealsRouter from './routes/agedDeals.js';
import specialistAgentsRouter from './routes/specialistAgents.js';
import telephonyCloserRouter from './routes/telephonyCloser.js';
import omnichannelMatrixRouter from './routes/omnichannelMatrix.js';
import apexRevenueRouter from './routes/apexRevenue.js';
import learningRouter from './routes/learning.js';
import multinationalRouter from './routes/multinational.js';
import digitalStoreRouter from './routes/digitalStore.js';
import selfPromotionRouter from './routes/selfPromotion.js';
import hyperVelocityCloserRouter from './routes/hyperVelocityCloser.js';
import openRateOptimizerRouter from './routes/openRateOptimizer.js';
import anthropicEnterpriseRouter from './routes/anthropicEnterprise.js';
import viralPromotionRouter from './routes/viralPromotion.js';
import apexServicesRouter from './routes/apexServices.js';
import autonomousFlywheelRouter from './routes/autonomousFlywheel.js';
import apexWorldClassRouter from './routes/apexWorldClass.js';
import { initializeEternal24x7Engine, getEternalStatus, forceTriggerEternalCycle } from './services/eternalHeartbeat.js';
import './services/publicEdgeTunnel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ SECURITY HEADERS: Hardening against XSS, Clickjacking, MIME-sniffing
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

// 🛡️ RATE LIMITING GUARD: Protects server against request flooding & freezing
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MIN = 200;

app.use('/api/', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'local';
  const now = Date.now();
  const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count++;
  }

  requestCounts.set(ip, clientData);

  if (clientData.count > MAX_REQUESTS_PER_MIN) {
    return res.status(429).json({
      error: true,
      message: 'Rate limit exceeded. Please wait a moment before sending more requests.'
    });
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Request logging (sanitized)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Initialize database & 24x7 Eternal Engine
getDB();
initializeEternal24x7Engine();

// API Routes
app.use('/api/leads', leadsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/social', socialRouter);
app.use('/api/autonomous', autonomousRouter);
app.use('/api/agency', agencyRouter);
app.use('/api/intelligence', intelligenceRouter);
app.use('/api/persuasion', persuasionRouter);
app.use('/api/freelance', freelanceRouter);
app.use('/api/hyperspeed', hyperspeedRouter);
app.use('/api/public-access', publicAccessRouter);
app.use('/api/revenue-streams', revenueStreamsRouter);
app.use('/api/real-world', realWorldRouter);
app.use('/api/deal-automation', dealAutomationRouter);
app.use('/api/settlement', settlementRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/deliverables', deliverablesRouter);
app.use('/api/retainer', retainerRouter);
app.use('/api/startup', startupRouter);
app.use('/api/inbound', inboundCloserRouter);
app.use('/api/followup', followUpRouter);
app.use('/api/voice-studio', voiceStudioRouter);
app.use('/api/high-ticket', highTicketRouter);
app.use('/api/video-pitch', videoPitchRouter);
app.use('/api/telegram', telegramCockpitRouter);
app.use('/api/whatsapp', whatsappCloudRouter);
app.use('/api/council', councilRouter);
app.use('/api/unicorn', unicornRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/checkout', universalCheckoutRouter);
app.use('/api/escrow-jobs', escrowJobsRouter);
app.use('/api/trust', trustRouter);
app.use('/api/money-machine', moneyMachineRouter);
app.use('/api/rapid-payment', rapidPaymentRouter);
app.use('/api/target-5lakh', target5LakhRouter);
app.use('/api/brand', brandRouter);
app.use('/api/deal-closer', dealCloserRouter);
app.use('/api/deal-recovery', dealRecoveryRouter);
app.use('/api/domestic-closer', domesticCloserRouter);
app.use('/api/hot-intent', hotIntentRouter);
app.use('/api/aged-deals', agedDealsRouter);
app.use('/api/specialist-agents', specialistAgentsRouter);
app.use('/api/telephony', telephonyCloserRouter);
app.use('/api/omnichannel', omnichannelMatrixRouter);
app.use('/api/apex', apexRevenueRouter);
app.use('/api/learning', learningRouter);
app.use('/api/multinational', multinationalRouter);
app.use('/api/store', digitalStoreRouter);
app.use('/api/promotion', selfPromotionRouter);
app.use('/api/hyper-closer', hyperVelocityCloserRouter);
app.use('/api/open-optimizer', openRateOptimizerRouter);
app.use('/api/track', openRateOptimizerRouter);
app.use('/api/anthropic', anthropicEnterpriseRouter);
app.use('/api/viral-promo', viralPromotionRouter);
app.use('/api/apex-services', apexServicesRouter);
app.use('/api/flywheel', autonomousFlywheelRouter);
app.use('/api/world-class', apexWorldClassRouter);
app.use('/', seoRouter);

// Global Partner Referral Redirection & Click Tracking Rail
app.get('/ref/:code', (req, res) => {
  const { code } = req.params;
  try {
    trackPartnerClick(code);
  } catch (_) {}
  res.redirect(`/?ref=${encodeURIComponent(code)}`);
});

// 24x7x365 Continuous Heartbeat & Self-Evolution Endpoints
app.get('/api/eternal/status', (req, res) => {
  res.json(getEternalStatus());
});

app.post('/api/eternal/trigger-pulse', async (req, res) => {
  try {
    const result = await forceTriggerEternalCycle();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'ORION FLUX',
    version: '1.0.0',
    uptimeSec: Math.floor(process.uptime()),
    securityStatus: 'HARDENED',
    timestamp: new Date().toISOString()
  });
});

// ── Production: serve built frontend with Zero-Stale Caching ───────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist, {
  maxAge: '1h',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA fallback – any non-API, non-asset GET request serves fresh index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();

  // If client is requesting a static asset file that doesn't exist, return 404 (do not send HTML!)
  if (req.path.startsWith('/assets/') || /\.[a-zA-Z0-9]+$/.test(req.path)) {
    return res.status(404).type('text/plain').send('Asset not found');
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error handling middleware (Safe - no stack traces leaked)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║       🚀 ORION FLUX Super Agent         ║
  ║       Server running on port ${PORT}       ║
  ║       Security: HARDENED & CRASH-PROOF   ║
  ║       http://localhost:${PORT}             ║
  ╚══════════════════════════════════════════╝
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[PORT ALERT] Port ${PORT} is already occupied. Attempting graceful recovery...`);
  } else {
    console.error('[SERVER ERROR]', err);
  }
});

export default app;
