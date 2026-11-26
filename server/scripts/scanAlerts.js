import fs from 'fs';
import path from 'path';

function scanFiles(dir, pattern, matches = []) {
  if (!fs.existsSync(dir)) return matches;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanFiles(full, pattern, matches);
    } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (pattern.test(line)) {
          matches.push(`${full.replace(/\\/g, '/')}:${idx + 1}: ${line.trim().slice(0, 110)}`);
        }
      });
    }
  }
  return matches;
}

const clientAlerts = scanFiles('d:/ANTIGRAVITY VK/orion-flux/client/src', /alert\s*\(/);
console.log('=== CLIENT ALERTS (' + clientAlerts.length + ') ===');
clientAlerts.forEach(a => console.log(a));
