import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { uploadImage } from '../controllers/uploadsController.js';

// Kept only so files uploaded before this switch (e.g. the disk-stored "Brightline"
// image from earlier testing) still resolve — new uploads go to the database instead.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

// In-memory buffer, not disk — the controller turns it into a base64 data URI
// that gets stored directly in the services table's JSON column.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — inflates to ~6.7MB as base64 text in the DB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (jpg, png, webp, gif, svg) are allowed'));
  },
});

const router = Router();

// multer errors (bad type, too large) are caught here and returned as JSON,
// instead of falling through to Express's default HTML error page.
router.post('/', verifyAdmin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message || 'Upload failed' });
    next();
  });
}, uploadImage);

export default router;
