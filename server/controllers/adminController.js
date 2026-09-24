import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail, listAdmins, countAdmins, createAdmin, updateAdminPassword, deleteAdmin } from '../models/admin.js';
import { getDashboardStats } from '../models/stats.js';

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required' });
  }

  const admin = await findAdminByEmail(String(email).trim().toLowerCase());
  if (!admin) {
    return res.status(401).json({ ok: false, error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ ok: false, error: 'Invalid email or password' });
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, token, email: admin.email });
}

export async function stats(_req, res) {
  try {
    const data = await getDashboardStats();
    res.json({ ok: true, ...data });
  } catch (err) {
    console.error('Failed to load dashboard stats:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load dashboard stats' });
  }
}

export async function getAdmins(_req, res) {
  try {
    const admins = await listAdmins();
    res.json({ ok: true, admins });
  } catch (err) {
    console.error('Failed to list admins:', err.message);
    res.status(500).json({ ok: false, error: 'Could not load admins' });
  }
}

export async function addAdmin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !String(email).trim()) {
    return res.status(400).json({ ok: false, error: 'Email is required' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = await createAdmin(String(email).trim().toLowerCase(), passwordHash);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: 'An admin with this email already exists' });
    }
    console.error('Failed to add admin:', err.message);
    res.status(500).json({ ok: false, error: 'Could not add admin' });
  }
}

export async function changeAdminPassword(req, res) {
  const { password } = req.body || {};
  if (!password || String(password).length < 6) {
    return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const updated = await updateAdminPassword(req.params.id, passwordHash);
    if (!updated) return res.status(404).json({ ok: false, error: 'Admin not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to update admin password:', err.message);
    res.status(500).json({ ok: false, error: 'Could not update password' });
  }
}

export async function removeAdmin(req, res) {
  try {
    const total = await countAdmins();
    if (total <= 1) {
      return res.status(400).json({ ok: false, error: 'Cannot delete the only remaining admin' });
    }
    const deleted = await deleteAdmin(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Admin not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete admin:', err.message);
    res.status(500).json({ ok: false, error: 'Could not delete admin' });
  }
}
