// Front-end only "client session". There is no backend, so this is a lightweight
// sign-in that records who logged in (sent to email + Google Sheet) and remembers
// the visitor in this browser. It is NOT a password-protected account system.
const KEY = 'wos_user';

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    // session expires after 7 days
    if (!u.at || Date.now() - u.at > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(KEY);
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

export function saveUser({ name, email, phone }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ name, email, phone, at: Date.now() }));
  } catch { /* storage blocked */ }
  window.dispatchEvent(new Event('wos-auth'));
}

export function logout() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  window.dispatchEvent(new Event('wos-auth'));
}
