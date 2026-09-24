import { API_URL } from '../config';

// ---------- Validation & sanitising (client-side safety layer) ----------
const MAX_LEN = 1500;

export const clean = (value) =>
  String(value ?? '')
    .replace(/[<>]/g, '') // strip angle brackets → no HTML/script injection in email or sheet
    .replace(/^[=+\-@\t\r]+/, '') // block spreadsheet formula injection (=, +, -, @ at start)
    .trim()
    .slice(0, MAX_LEN);

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const isPhone = (v) => /^(\+?\d{1,3}[\s-]?)?\d{10}$/.test(String(v).replace(/[\s-]/g, ''));
export const isUrl = (v) => !v || /^https?:\/\/[^\s]+$/i.test(String(v).trim());

/**
 * Validate a form object against simple rules.
 * rules: { field: ['required', 'email', 'phone', 'url', 'min:10'] }
 */
export function validate(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, list]) => {
    const raw = values[field];
    const v = raw === false ? '' : String(raw ?? '').trim();
    for (const rule of list) {
      if (rule === 'required' && !v) { errors[field] = 'This field is required'; break; }
      if (rule === 'email' && v && !isEmail(v)) { errors[field] = 'Enter a valid email address'; break; }
      if (rule === 'phone' && v && !isPhone(v)) { errors[field] = 'Enter a valid 10-digit mobile number'; break; }
      if (rule === 'url' && v && !isUrl(v)) { errors[field] = 'Enter a valid link starting with https://'; break; }
      if (rule.startsWith('min:') && v && v.length < Number(rule.split(':')[1])) {
        errors[field] = `Please write at least ${rule.split(':')[1]} characters`; break;
      }
    }
  });
  return errors;
}

// ---------- Anti-spam: simple per-form cooldown ----------
const COOLDOWN_MS = 30 * 1000;
const lastKey = (type) => `wos_last_${type}`;

function inCooldown(type) {
  try {
    const last = Number(localStorage.getItem(lastKey(type)) || 0);
    return Date.now() - last < COOLDOWN_MS;
  } catch { return false; }
}
function markSent(type) {
  try { localStorage.setItem(lastKey(type), String(Date.now())); } catch { /* ignore */ }
}

/**
 * Send any form to the WebOnspark backend API → saves it in the MySQL database.
 * @param {string} formType  Login | Enquiry | Contact | Career | Question
 * @param {object} data      field → value
 */
export async function submitForm(formType, data) {
  // Honeypot: real users never fill the hidden "website" field
  if (data.website) return { ok: true };

  if (inCooldown(formType)) {
    throw new Error('You just sent this form. Please wait 30 seconds before trying again.');
  }
  if (!API_URL) {
    throw new Error(
      'Form service is not connected yet. Please reach us on WhatsApp (+91 96865 95916) or email webonspark@gmail.com.'
    );
  }

  const payload = { formType, page: typeof window !== 'undefined' ? window.location.pathname : '' };
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'website') return;
    // resume is a data: URI from our own upload endpoint, not raw user text —
    // clean()'s 1500-char truncation would corrupt it, so it passes through as-is.
    payload[k] = k === 'resume' ? v : clean(v);
  });

  const res = await fetch(`${API_URL}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Something went wrong sending your details. Please try WhatsApp.');
  }

  markSent(formType);
  return { ok: true };
}
