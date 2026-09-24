import { pool } from '../config/db.js';

const shape = (row) => ({ slug: row.slug, ...row.data });

export async function listBlogs() {
  const [rows] = await pool.query('SELECT * FROM blogs ORDER BY id DESC');
  return rows.map(shape);
}

export async function findBlogBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? shape(rows[0]) : null;
}

export async function createBlog({ slug, ...rest }) {
  await pool.query('INSERT INTO blogs (slug, data) VALUES (?, ?)', [slug, JSON.stringify(rest)]);
  return slug;
}

export async function updateBlog(slug, { slug: _ignored, ...rest }) {
  const [result] = await pool.query('UPDATE blogs SET data = ? WHERE slug = ?', [JSON.stringify(rest), slug]);
  return result.affectedRows > 0;
}

export async function deleteBlog(slug) {
  const [result] = await pool.query('DELETE FROM blogs WHERE slug = ?', [slug]);
  return result.affectedRows > 0;
}
