import { pool } from '../config/db.js';

const shape = (row) => ({ slug: row.slug, category: row.category, ...row.data });

export async function listServices(category) {
  const [rows] = category
    ? await pool.query('SELECT * FROM services WHERE category = ? ORDER BY id', [category])
    : await pool.query('SELECT * FROM services ORDER BY id');
  return rows.map(shape);
}

export async function findServiceBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? shape(rows[0]) : null;
}

export async function createService({ slug, category, ...rest }) {
  await pool.query('INSERT INTO services (slug, category, data) VALUES (?, ?, ?)', [slug, category, JSON.stringify(rest)]);
  return slug;
}

export async function addTemplateToService(slug, template) {
  const [rows] = await pool.query('SELECT data FROM services WHERE slug = ? LIMIT 1', [slug]);
  if (!rows[0]) return null;
  const data = rows[0].data;
  data.templates = [...(data.templates || []), template];
  await pool.query('UPDATE services SET data = ? WHERE slug = ?', [JSON.stringify(data), slug]);
  return data.templates;
}

export async function updateServiceTemplate(slug, index, template) {
  const [rows] = await pool.query('SELECT data FROM services WHERE slug = ? LIMIT 1', [slug]);
  if (!rows[0]) return null;
  const data = rows[0].data;
  if (!data.templates || !data.templates[index]) return null;
  data.templates[index] = { ...data.templates[index], ...template };
  await pool.query('UPDATE services SET data = ? WHERE slug = ?', [JSON.stringify(data), slug]);
  return data.templates;
}

export async function deleteServiceTemplate(slug, index) {
  const [rows] = await pool.query('SELECT data FROM services WHERE slug = ? LIMIT 1', [slug]);
  if (!rows[0]) return null;
  const data = rows[0].data;
  if (!data.templates || !data.templates[index]) return null;
  data.templates.splice(index, 1);
  await pool.query('UPDATE services SET data = ? WHERE slug = ?', [JSON.stringify(data), slug]);
  return data.templates;
}
