import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { uploadImage, uploadResume } from '../controllers/uploadsController.js';

// Kept only so files uploaded before this switch (e.g. the disk-stored "Brightline"
// image from earlier testing) still resolve — new uploads go to the database instead.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const RESUME_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// In-memory buffer, not disk — the controller turns it into a base64 data URI
// stored directly in the database (services JSON column, or the form_submissions payload).
const makeUploader = (allowedMime, label) => multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — inflates to ~6.7MB as base64 text in the DB
  fileFilter: (req, file, cb) => {
    if (allowedMime.has(file.mimetype)) cb(null, true);
    else cb(new Error(`Only ${label} files are allowed`));
  },
});

const imageUpload = makeUploader(IMAGE_MIME, 'image (jpg, png, webp, gif, svg)');
const resumeUpload = makeUploader(RESUME_MIME, 'resume (pdf, doc, docx)');

// Wraps a multer instance so its errors (bad type, too large) come back as JSON
// instead of falling through to Express's default HTML error page.
const handle = (uploader, field) => (req, res, next) => {
  uploader.single(field)(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message || 'Upload failed' });
    next();
  });
};

const router = Router();

// Admin-only: template images added from /admin/services.
router.post('/', verifyAdmin, handle(imageUpload, 'image'), uploadImage);

// Public: resume uploads from the Careers application form. No admin auth — job
// applicants aren't logged in — but strictly limited to document file types.
router.post('/resume', handle(resumeUpload, 'resume'), uploadResume);

export default router;
