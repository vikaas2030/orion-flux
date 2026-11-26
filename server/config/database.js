import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'orion_flux_data.json');

let memoryDb = null;

function ensureDbFile() {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      leads: [],
      deals: [],
      activities: [],
      revenue: [],
      real_collections: [],
      social_posts: [],
      settings: {
        app_name: 'ORION FLUX',
        app_tagline: 'Your Super Agent for Business Automation',
        currency: 'INR',
        tax_rate: '0',
        pricing_policy: 'ALL_INCLUSIVE_NET',
        gst_exemption_clause: 'Exempt under Section 22 of CGST Act (Turnover < ₹20 Lakhs). Zero Extra Tax.',
        upi_id: '9690973030@ibl',
        paypal_email: 'payments@orionflux.agency'
      }
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export function getDB() {
  if (!memoryDb) {
    ensureDbFile();
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      memoryDb = JSON.parse(raw);
    } catch {
      memoryDb = { leads: [], deals: [], activities: [], revenue: [], settings: {} };
    }
  }

  return {
    data: memoryDb,
    save() {
      try {
        const tempPath = `${DB_PATH}.tmp`;
        const backupPath = `${DB_PATH}.bak`;
        const jsonContent = JSON.stringify(memoryDb, null, 2);
        
        // 1. Atomic write to temporary file
        fs.writeFileSync(tempPath, jsonContent, 'utf8');
        
        // 2. Backup existing database if exists
        if (fs.existsSync(DB_PATH)) {
          try {
            fs.copyFileSync(DB_PATH, backupPath);
          } catch {}
        }
        
        // 3. Rename atomic file to final target
        fs.renameSync(tempPath, DB_PATH);
      } catch (saveErr) {
        // Fallback direct write
        fs.writeFileSync(DB_PATH, JSON.stringify(memoryDb, null, 2), 'utf8');
      }
    },
    reload() {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        memoryDb = JSON.parse(raw);
      } catch (e) {
        console.error('DB Reload error:', e);
      }
      return memoryDb;
    }
  };
}

export default getDB;
