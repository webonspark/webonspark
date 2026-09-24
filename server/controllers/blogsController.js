import { listBlogs, findBlogBySlug, createBlog, updateBlog, deleteBlog } from '../models/blog.js';

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function getBlogs(_req, res) {
  try {
    const blogs = await listBlogs();
    res.json({ ok: true, blogs });
  } catch (err) {
    console.error('Failed to list blogs:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load blogs' });
  }
}

export async function getBlogBySlug(req, res) {
  try {
    const blog = await findBlogBySlug(req.params.slug);
    if (!blog) return res.status(404).json({ ok: false, error: 'Blog post not found' });
    res.json({ ok: true, blog });
  } catch (err) {
    console.error('Failed to load blog:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load blog post' });
  }
}

export async function addBlog(req, res) {
  const { slug, title } = req.body || {};
  if (!slug || !SLUG_RE.test(slug)) {
    return res.status(400).json({ ok: false, error: 'Slug is required and must be lowercase-with-hyphens' });
  }
  if (!title || !String(title).trim()) {
    return res.status(400).json({ ok: false, error: 'Title is required' });
  }

  try {
    await createBlog(req.body);
    res.status(201).json({ ok: true, slug });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: 'A blog post with this slug already exists' });
    }
    console.error('Failed to add blog:', err.message);
    res.status(500).json({ ok: false, error: 'Could not add blog post' });
  }
}

export async function editBlog(req, res) {
  const { title } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ ok: false, error: 'Title is required' });
  }

  try {
    const updated = await updateBlog(req.params.slug, req.body);
    if (!updated) return res.status(404).json({ ok: false, error: 'Blog post not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to update blog:', err.message);
    res.status(500).json({ ok: false, error: 'Could not update blog post' });
  }
}

export async function removeBlog(req, res) {
  try {
    const deleted = await deleteBlog(req.params.slug);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Blog post not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete blog:', err.message);
    res.status(500).json({ ok: false, error: 'Could not delete blog post' });
  }
}
