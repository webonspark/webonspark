import { pool } from '../config/db.js';

export async function createLead({ name, phone, email, websiteType, leadOwner, project, status }) {
  const [result] = await pool.query(
    'INSERT INTO leads (name, phone, email, website_type, lead_owner, project, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, phone || null, email || null, websiteType || null, leadOwner || null, project || null, status || 'On Hold']
  );
  return result.insertId;
}

export async function bulkCreateLeads(leads) {
  if (!leads.length) return 0;
  const values = leads.map((l) => [
    l.name,
    l.phone || null,
    l.email || null,
    l.websiteType || null,
    l.leadOwner || null,
    l.project || null,
    l.status || 'On Hold',
  ]);
  const [result] = await pool.query(
    'INSERT INTO leads (name, phone, email, website_type, lead_owner, project, status) VALUES ?',
    [values]
  );
  return result.affectedRows;
}

export async function listLeads() {
  const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
  return rows;
}

export async function updateLeadStatus(id, status) {
  await pool.query('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
}
