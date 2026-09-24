import { pool } from '../config/db.js';

export async function getAllContent() {
  const [rows] = await pool.query('SELECT content_key, value FROM site_content');
  const content = {};
  rows.forEach((r) => { content[r.content_key] = r.value; });
  return content;
}
