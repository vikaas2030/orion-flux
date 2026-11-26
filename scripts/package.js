import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const version = pkg.version || '1.0.0';
const zipName = `orion-flux-v${version}`;
const outDir = path.join(ROOT, zipName);
const tarFile = path.join(ROOT, `${zipName}.tar`);

// Files & dirs to include in the package
const INCLUDE = [
  'client/dist',
  'client/public',
  'client/index.html',
  'client/package.json',
  'client/package-lock.json',
  'client/vite.config.js',
  'server',
  'database',
  'package.json',
  'start.bat',
  'start.sh',
  'render.yaml',
  'Dockerfile',
  '.dockerignore',
  '.env.example',
  'README.md',
  '.gitignore',
];

// Dirs/files to EXCLUDE
const EXCLUDE = [
  'node_modules',
  '.env',
  '*.log',
  'database/*.json',
];

console.log(`\n📦 Packaging ORION FLUX v${version}...\n`);

// Step 1: Check frontend
console.log('[1/3] Checking frontend build...');
const distPath = path.join(ROOT, 'client', 'dist');
if (fs.existsSync(distPath)) {
  console.log('      ✅ Production frontend build found at client/dist\n');
} else {
  try {
    execSync('npm run build', { cwd: path.join(ROOT, 'client'), stdio: 'inherit' });
    console.log('      ✅ Frontend built successfully\n');
  } catch (err) {
    console.error('❌ Frontend build not found!');
    process.exit(1);
  }
}

// Step 2: Create clean package directory
console.log('[2/3] Assembling package...');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir, { recursive: true });

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  const basename = path.basename(src);

  // Skip excluded items
  for (const ex of EXCLUDE) {
    if (basename === ex || (ex.includes('*') && basename.match(new RegExp(ex.replace('*', '.*'))))) {
      return;
    }
  }

  if (stat.isDirectory()) {
    if (basename === 'node_modules') return;
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const item of INCLUDE) {
  const src = path.join(ROOT, item);
  const dest = path.join(outDir, item);
  copyRecursive(src, dest);
}

// Count files
let fileCount = 0;
function countFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) countFiles(full);
    else fileCount++;
  }
}
countFiles(outDir);

console.log(`      ✅ ${fileCount} files assembled in ${zipName}/\n`);

// Create ZIP file automatically
const zipFilePath = path.join(ROOT, `${zipName}.zip`);
console.log(`[3/4] Creating ZIP archive: ${zipName}.zip ...`);
try {
  if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
  execSync(`powershell -Command "Compress-Archive -Path '${outDir}\\*' -DestinationPath '${zipFilePath}' -Force"`, { stdio: 'inherit' });
  console.log(`      ✅ ZIP Archive created successfully: ${zipFilePath}\n`);
} catch (e) {
  console.log('      ⚠️ Automatic ZIP creation skipped, folder is ready.');
}

// Step 4: Show summary
console.log('[4/4] Package ready!\n');
console.log('  ╔═══════════════════════════════════════════════╗');
console.log(`  ║  📦 Package: ${zipName}.zip`);
console.log('  ║                                               ║');
console.log('  ║  📁 Folder:  ' + outDir);
console.log('  ║  🗜️  Archive: ' + zipFilePath);
console.log('  ║                                               ║');
console.log('  ║  To run on any computer:                      ║');
console.log('  ║  1. Install Node.js from nodejs.org           ║');
console.log('  ║  2. Double-click start.bat                    ║');
console.log('  ║  3. Open http://localhost:5000                ║');
console.log('  ╚═══════════════════════════════════════════════╝');
console.log('');
