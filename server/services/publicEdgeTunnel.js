// ═════════════════════════════════════════════════════════════════════
//  PUBLIC HTTPS EDGE TUNNEL SERVICE FOR ORION FLUX
//  Exposes localhost:5000 worldwide using native OpenSSH HTTPS termination.
//  Zero external software needed. Auto-reconnects and keeps client portals
//  accessible 24x7 from any mobile device, laptop, or country.
// ═════════════════════════════════════════════════════════════════════

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updatePublicTunnel } from './publicAccess.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLOUDFLARED_BIN = path.resolve(__dirname, '../bin/cloudflared.exe');

let tunnelProcess = null;
let activeTunnelUrl = null;
let activeProvider = 'Cloudflare Edge Tunnel';
let isStarting = false;
let lastHeartbeat = Date.now();
let cloudflaredFailedCount = 0;

export function getTunnelState() {
  return {
    isOnline: !!activeTunnelUrl,
    publicUrl: activeTunnelUrl,
    provider: activeProvider,
    port: process.env.PORT || 5000,
    lastHeartbeat: new Date(lastHeartbeat).toISOString()
  };
}

export function startPublicEdgeTunnel(port = 5000) {
  if (tunnelProcess || isStarting) {
    return activeTunnelUrl ? { success: true, url: activeTunnelUrl } : { starting: true };
  }

  isStarting = true;

  const hasCloudflared = cloudflaredFailedCount < 1 && fs.existsSync(CLOUDFLARED_BIN) && fs.statSync(CLOUDFLARED_BIN).size > 15000000;
  const cmd = hasCloudflared ? CLOUDFLARED_BIN : 'ssh.exe';
  activeProvider = hasCloudflared
    ? 'Cloudflare Global Edge Tunnel (trycloudflare.com)'
    : 'Secure OpenSSH HTTPS Edge (localhost.run)';

  const args = hasCloudflared
    ? ['tunnel', '--url', `http://127.0.0.1:${port}`, '--no-autoupdate']
    : [
        '-T',
        '-n',
        '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'UserKnownHostsFile=NUL',
        '-o', 'ConnectTimeout=10',
        '-o', 'ServerAliveInterval=25',
        '-o', 'ServerAliveCountMax=3',
        '-R', `80:127.0.0.1:${port}`,
        'nokey@localhost.run'
      ];

  console.log(`🌐 [PUBLIC EDGE TUNNEL] Launching ${activeProvider} on port ${port}...`);

  const handleTunnelOutput = (chunk) => {
    const text = chunk.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9_.-]+\.(trycloudflare\.com|lhr\.life)/);
    if (match && match[0] && match[0] !== activeTunnelUrl) {
      activeTunnelUrl = match[0];
      isStarting = false;
      lastHeartbeat = Date.now();
      console.log(`\n🎉 ═══════════════════════════════════════════════════════════════════`);
      console.log(`🌐 [PUBLIC EDGE TUNNEL ONLINE] ${activeTunnelUrl}`);
      console.log(`🛡️ Provider: ${activeProvider}`);
      console.log(`📱 Client Portal URL: ${activeTunnelUrl}/portal`);
      console.log(`🛒 Digital Store URL: ${activeTunnelUrl}/store`);
      console.log(`═══════════════════════════════════════════════════════════════════\n`);

      updatePublicTunnel(activeTunnelUrl, activeProvider);
    }
  };

  try {
    tunnelProcess = spawn(cmd, args, {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    tunnelProcess.stdout.on('data', handleTunnelOutput);
    tunnelProcess.stderr.on('data', handleTunnelOutput);

    tunnelProcess.on('close', (code) => {
      if (hasCloudflared && !activeTunnelUrl) {
        cloudflaredFailedCount++;
        console.log(`⚠️ [PUBLIC EDGE TUNNEL] Cloudflare exited (${code}) — switching to OpenSSH Edge fallback...`);
      } else {
        console.log(`⚠️ [PUBLIC EDGE TUNNEL] Closed with code ${code}. Auto-reconnecting in 5s...`);
      }
      tunnelProcess = null;
      activeTunnelUrl = null;
      isStarting = false;
      setTimeout(() => startPublicEdgeTunnel(port), hasCloudflared ? 1500 : 5000);
    });

    tunnelProcess.on('error', (err) => {
      console.error(`⚠️ [PUBLIC EDGE TUNNEL] Spawn Error:`, err.message);
      tunnelProcess = null;
      isStarting = false;
    });

    return { starting: true };
  } catch (err) {
    isStarting = false;
    console.error('⚠️ [PUBLIC EDGE TUNNEL] Failed to launch SSH tunnel:', err.message);
    return { error: true, message: err.message };
  }
}

// Auto-start edge tunnel on load
if (process.env.AUTO_TUNNEL !== 'false') {
  startPublicEdgeTunnel(process.env.PORT || 5000);
}
