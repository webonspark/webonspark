const KEY = 'wos_admin';

export function getAdmin() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAdmin({ token, email }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ token, email }));
  } catch { /* storage blocked */ }
}

export function adminLogout() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
