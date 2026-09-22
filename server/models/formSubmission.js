import { pool } from '../config/db.js';

export async function insertFormSubmission({ formType, page, payload }) {
  const [result] = await pool.query(
    'INSERT INTO form_submissions (form_type, page, payload) VALUES (?, ?, ?)',
    [formType, page, JSON.stringify(payload)]
  );
  return result.insertId;
}

export async function listFormSubmissions(formType) {
  const [rows] = formType
    ? await pool.query('SELECT * FROM form_submissions WHERE form_type = ? ORDER BY created_at DESC', [formType])
    : await pool.query('SELECT * FROM form_submissions ORDER BY created_at DESC');
  return rows;
}
