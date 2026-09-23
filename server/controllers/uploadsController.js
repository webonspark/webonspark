export function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }
  // Stored as a data URI so the image bytes live in the database (the services
  // table's JSON column), not as a separate file on the server's disk.
  const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  res.status(201).json({ ok: true, url: dataUrl });
}
