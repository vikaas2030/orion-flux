import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../database/orion_flux_data.json');

const raw = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(raw);

if (Array.isArray(data.projects)) {
  const seenTitles = new Set();
  const uniqueProjects = [];

  for (const p of data.projects) {
    const key = (p.title || '').trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueProjects.push(p);
    }
  }

  console.log(`Original projects: ${data.projects.length}, Deduplicated projects: ${uniqueProjects.length}`);
  data.projects = uniqueProjects;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved deduplicated projects to orion_flux_data.json');
}
