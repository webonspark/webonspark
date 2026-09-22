// Upserts the admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// Run with: node scripts/seedAdmin.js
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await pool.query(
  'INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
  [email, hash]
);
console.log(`Admin upserted: ${email}`);
process.exit(0);
