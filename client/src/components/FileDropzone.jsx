import { useRef, useState } from 'react';
import Icon from './Icons';
import { API_URL } from '../config';

/** Drag-and-drop (or click-to-browse) file upload for non-image files (resumes, etc). */
export default function FileDropzone({ value, filename, onChange, accept = '.pdf,.doc,.docx', label = 'Drop your resume here, or click to browse' }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('resume', file);
      const res = await fetch(`${API_URL}/uploads/resume`, { method: 'POST', body });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url, data.filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={`image-dropzone ${dragOver ? 'is-over' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files?.[0]);
        }}
      >
        {uploading ? 'Uploading…' : value ? (
          <span><Icon name="check" size={16} className="me-1" />{filename || 'Resume uploaded'} — click to replace</span>
        ) : label}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {error && <div className="form-error mt-2" role="alert">{error}</div>}
    </div>
  );
}
