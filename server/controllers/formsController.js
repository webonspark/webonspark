import { insertFormSubmission, listFormSubmissions } from '../models/formSubmission.js';

const ALLOWED_FORM_TYPES = ['Login', 'Enquiry', 'Contact', 'Career', 'Question'];

export async function submitForm(req, res) {
  const { formType, page, ...fields } = req.body || {};

  if (!ALLOWED_FORM_TYPES.includes(formType)) {
    return res.status(400).json({ ok: false, error: 'Invalid form type' });
  }

  delete fields.website; // honeypot field never gets stored

  try {
    const id = await insertFormSubmission({ formType, page, payload: fields });
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error('Failed to save form submission:', err.message);
    res.status(500).json({ ok: false, error: 'Could not save submission' });
  }
}

export async function listSubmissions(req, res) {
  const { formType } = req.query;
  if (formType && !ALLOWED_FORM_TYPES.includes(formType)) {
    return res.status(400).json({ ok: false, error: 'Invalid form type' });
  }

  try {
    const rows = await listFormSubmissions(formType);
    res.json({ ok: true, submissions: rows });
  } catch (err) {
    console.error('Failed to list submissions:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load submissions' });
  }
}
