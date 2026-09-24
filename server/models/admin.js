import { pool } from '../config/db.js';

export async function findAdminByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function listAdmins() {
  const [rows] = await pool.query('SELECT id, email, created_at FROM admins ORDER BY id ASC');
  return rows;
}

export async function countAdmins() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM admins');
  return rows[0].count;
}

export async function createAdmin(email, passwordHash) {
  const [result] = await pool.query('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, passwordHash]);
  return result.insertId;
}

export async function updateAdminPassword(id, passwordHash) {
  const [result] = await pool.query('UPDATE admins SET password_hash = ? WHERE id = ?', [passwordHash, id]);
  return result.affectedRows > 0;
}

export async function deleteAdmin(id) {
  const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
