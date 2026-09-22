import { createLead, bulkCreateLeads, listLeads, updateLeadStatus } from '../models/lead.js';

const STATUSES = ['On Hold', 'Accepted', 'Rejected', 'Completed'];
const MAX_IMPORT_ROWS = 2000;

export async function addLead(req, res) {
  const { name, phone, email, websiteType, leadOwner, project, status } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Name is required' });
  }
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }

  try {
    const id = await createLead({ name: String(name).trim(), phone, email, websiteType, leadOwner, project, status });
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error('Failed to add lead:', err.message);
    res.status(500).json({ ok: false, error: 'Could not add lead' });
  }
}

export async function getLeads(_req, res) {
  try {
    const rows = await listLeads();
    res.json({ ok: true, leads: rows });
  } catch (err) {
    console.error('Failed to list leads:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load leads' });
  }
}

export async function patchLeadStatus(req, res) {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }

  try {
    await updateLeadStatus(req.params.id, status);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to update lead:', err.message);
    res.status(500).json({ ok: false, error: 'Could not update lead' });
  }
}

/**
 * Bulk import from a parsed CSV: { leads: [{ name, phone, email, websiteType, leadOwner, project, status }] }
 * Rows without a name are skipped; an unrecognised status falls back to "On Hold" rather than failing the row.
 */
export async function importLeads(req, res) {
  const { leads } = req.body || {};
  if (!Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({ ok: false, error: 'No leads to import' });
  }
  if (leads.length > MAX_IMPORT_ROWS) {
    return res.status(400).json({ ok: false, error: `Import is limited to ${MAX_IMPORT_ROWS} rows at a time` });
  }

  let skipped = 0;
  const clean = [];
  for (const row of leads) {
    const name = String(row.name ?? '').trim();
    if (!name) { skipped += 1; continue; }
    const status = STATUSES.includes(row.status) ? row.status : 'On Hold';
    clean.push({
      name,
      phone: row.phone ? String(row.phone).trim() : null,
      email: row.email ? String(row.email).trim() : null,
      websiteType: row.websiteType ? String(row.websiteType).trim() : null,
      leadOwner: row.leadOwner ? String(row.leadOwner).trim() : null,
      project: row.project ? String(row.project).trim() : null,
      status,
    });
  }

  try {
    const inserted = await bulkCreateLeads(clean);
    res.status(201).json({ ok: true, inserted, skipped });
  } catch (err) {
    console.error('Failed to import leads:', err.message);
    res.status(500).json({ ok: false, error: 'Could not import leads' });
  }
}
