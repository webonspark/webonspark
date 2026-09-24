import { getAllContent } from '../models/content.js';

export async function getContent(_req, res) {
  try {
    const content = await getAllContent();
    res.json({ ok: true, ...content });
  } catch (err) {
    console.error('Failed to load site content:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load site content' });
  }
}
