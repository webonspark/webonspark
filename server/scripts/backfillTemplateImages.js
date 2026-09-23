// One-off: gives every template that has no image/url a default one, so the whole
// site consistently shows real <img> template cards instead of the old CSS mockup.
// Run with: node scripts/backfillTemplateImages.js
import 'dotenv/config';
import { pool } from '../config/db.js';

const DEFAULT_IMAGE = 'https://placehold.co/600x400/2f2065/ffffff?text=Template+Preview';
const DEFAULT_URL = 'https://www.webonspark.com';

const [rows] = await pool.query('SELECT slug, data FROM services');
let updatedServices = 0;
let updatedTemplates = 0;

for (const row of rows) {
  const { data } = row;
  if (!Array.isArray(data.templates)) continue;

  let changed = false;
  data.templates = data.templates.map((t) => {
    if (t.image && t.url) return t;
    changed = true;
    updatedTemplates += 1;
    return { ...t, image: t.image || DEFAULT_IMAGE, url: t.url || DEFAULT_URL };
  });

  if (changed) {
    await pool.query('UPDATE services SET data = ? WHERE slug = ?', [JSON.stringify(data), row.slug]);
    updatedServices += 1;
    console.log(`updated: ${row.slug}`);
  }
}

console.log(`\nDone — ${updatedTemplates} templates backfilled across ${updatedServices} services.`);
process.exit(0);
