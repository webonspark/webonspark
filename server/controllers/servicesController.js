import {
  listServices, findServiceBySlug, createService,
  addTemplateToService, updateServiceTemplate, deleteServiceTemplate,
} from '../models/service.js';

const CATEGORIES = ['app', 'web'];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function getServices(req, res) {
  const { category } = req.query;
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ ok: false, error: 'Invalid category' });
  }
  try {
    const services = await listServices(category);
    res.json({ ok: true, services });
  } catch (err) {
    console.error('Failed to list services:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load services' });
  }
}

export async function getServiceBySlug(req, res) {
  try {
    const service = await findServiceBySlug(req.params.slug);
    if (!service) return res.status(404).json({ ok: false, error: 'Service not found' });
    res.json({ ok: true, service });
  } catch (err) {
    console.error('Failed to load service:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load service' });
  }
}

export async function addService(req, res) {
  const { slug, category, name } = req.body || {};
  if (!slug || !SLUG_RE.test(slug)) {
    return res.status(400).json({ ok: false, error: 'Slug is required and must be lowercase-with-hyphens' });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ ok: false, error: 'Category must be "app" or "web"' });
  }
  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Name is required' });
  }

  try {
    await createService(req.body);
    res.status(201).json({ ok: true, slug });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: 'A service with this slug already exists' });
    }
    console.error('Failed to add service:', err.message);
    res.status(500).json({ ok: false, error: 'Could not add service' });
  }
}

export async function addTemplate(req, res) {
  const { name, image, url } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Template name is required' });
  }

  try {
    const templates = await addTemplateToService(req.params.slug, { name: name.trim(), image, url });
    if (!templates) return res.status(404).json({ ok: false, error: 'Service not found' });
    res.status(201).json({ ok: true, templates });
  } catch (err) {
    console.error('Failed to add template:', err.message);
    res.status(500).json({ ok: false, error: 'Could not add template' });
  }
}

export async function editTemplate(req, res) {
  const { name, image, url } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Template name is required' });
  }
  const index = Number(req.params.index);

  try {
    const templates = await updateServiceTemplate(req.params.slug, index, { name: name.trim(), image, url });
    if (!templates) return res.status(404).json({ ok: false, error: 'Service or template not found' });
    res.json({ ok: true, templates });
  } catch (err) {
    console.error('Failed to update template:', err.message);
    res.status(500).json({ ok: false, error: 'Could not update template' });
  }
}

export async function removeTemplate(req, res) {
  const index = Number(req.params.index);

  try {
    const templates = await deleteServiceTemplate(req.params.slug, index);
    if (!templates) return res.status(404).json({ ok: false, error: 'Service or template not found' });
    res.json({ ok: true, templates });
  } catch (err) {
    console.error('Failed to delete template:', err.message);
    res.status(500).json({ ok: false, error: 'Could not delete template' });
  }
}
