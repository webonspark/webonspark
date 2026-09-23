// One-off migration: copies the existing static services/blogs data into MySQL.
// Run with: node scripts/migrateContent.js
import 'dotenv/config';
import { pool } from '../config/db.js';
import { allServices } from '../../client/src/data/services.js';
import { blogs } from '../../client/src/data/blogs.js';

for (const { slug, category, ...rest } of allServices) {
  await pool.query(
    'INSERT INTO services (slug, category, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE category = VALUES(category), data = VALUES(data)',
    [slug, category, JSON.stringify(rest)]
  );
  console.log(`service: ${slug}`);
}

for (const { slug, ...rest } of blogs) {
  await pool.query(
    'INSERT INTO blogs (slug, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
    [slug, JSON.stringify(rest)]
  );
  console.log(`blog: ${slug}`);
}

console.log(`\nMigrated ${allServices.length} services and ${blogs.length} blogs.`);
process.exit(0);
