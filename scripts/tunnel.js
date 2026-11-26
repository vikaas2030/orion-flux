// ═════════════════════════════════════════════════════════════════════
//  PUBLIC INTERNET TUNNEL LAUNCHER FOR ORION FLUX
//  Exposes localhost:5000 to the world via secure public HTTPS tunnel
//  so clients, partners, and mobile devices worldwide can access live.
// ═════════════════════════════════════════════════════════════════════

import { spawn } from 'child_process';
import http from 'http';

const PORT = process.env.PORT || 5000;
const SUBDOMAIN = `orion-flux-${Math.random().toString(36).substring(2, 7)}`;

console.log(`
  ╔═════════════════════════════════════════════════════════════╗
  ║       🌐 ORION FLUX — PUBLIC INTERNET ONLINE LAUNCHER       ║
  ║       Connecting your Super Agent to the Global Web...      ║
  ╚═════════════════════════════════════════════════════════════╝
`);

console.log(`[1/3] Verifying local server on port ${PORT}...`);

const checkServer = http.get(`http://localhost:${PORT}/api/health`, (res) => {
  if (res.statusCode === 200) {
    console.log(`      ✅ Local server is healthy on port ${PORT}.`);
    startTunnel();
  } else {
    console.log(`      ⚠️ Server responded with status ${res.statusCode}. Starting tunnel anyway...`);
    startTunnel();
  }
});

checkServer.on('error', () => {
  console.log(`      ⚠️ Local server not running on port ${PORT}. Please ensure start.bat or Open_ORION_FLUX.bat is running!`);
  startTunnel();
});

function startTunnel() {
  console.log(`[2/3] Establishing secure public HTTPS tunnel (Subdomain: ${SUBDOMAIN})...`);

  // Try launching localtunnel via npx
  const tunnelProcess = spawn('cmd.exe', ['/c', `npx --yes localtunnel --port ${PORT} --subdomain ${SUBDOMAIN}`], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  tunnelProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);

    const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
    if (match) {
      const publicUrl = match[0];
      const portalUrl = `${publicUrl}/portal`;

      console.log(`
  ╔══════════════════════════════════════════════════════════════════════╗
  ║  🎉 SUCCESS! YOUR ORION FLUX SYSTEM IS NOW LIVE ON THE INTERNET!     ║
  ║                                                                      ║
  ║  🌐 Public Web App URL:                                              ║
  ║     ${publicUrl}                                                     ║
  ║                                                                      ║
  ║  🌟 Public Client VIP Portal:                                        ║
  ║     ${portalUrl}                                              ║
  ║                                                                      ║
  ║  📱 Mobile & International Access:                                   ║
  ║     Any client in the world can now open, review, and pay online!    ║
  ╚══════════════════════════════════════════════════════════════════════╝
      `);

      // Notify server of active public URL
      const postData = JSON.stringify({ url: publicUrl, provider: 'LocalTunnel Edge' });
      const req = http.request(`http://localhost:${PORT}/api/public-access/set-tunnel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      });
      req.write(postData);
      req.end();
    }
  });

  tunnelProcess.stderr.on('data', (data) => {
    // console.error(data.toString());
  });

  tunnelProcess.on('close', (code) => {
    console.log(`Tunnel closed with exit code ${code}`);
  });
}
