import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail } from '../models/admin.js';
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
