import { pool } from '../config/db.js';

export async function findAdminByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}
