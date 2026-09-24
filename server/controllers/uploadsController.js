const toDataUrl = (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }
  // Stored as a data URI so the image bytes live in the database (the services
  // table's JSON column), not as a separate file on the server's disk.
  res.status(201).json({ ok: true, url: toDataUrl(req.file) });
}

export function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }
  // Same data-URI approach, plus the original filename since a data URI alone
  // doesn't carry one — the admin Careers page needs it to label the download.
  res.status(201).json({ ok: true, url: toDataUrl(req.file), filename: req.file.originalname });
}
