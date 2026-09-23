import { useRef, useState } from 'react';
import SkeletonImage from '../SkeletonImage';
import { API_URL } from '../../config';
import { getAdmin } from '../../utils/adminAuth';

/** Drag-and-drop (or click-to-browse) image upload. Shows just the image preview below — no raw URL/data text (that gets huge for base64-stored images). */
export default function ImageDropzone({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const admin = getAdmin();
      const body = new FormData();
      body.append('image', file);
      const res = await fetch(`${API_URL}/uploads`, {
        method: 'POST',
        headers: admin ? { Authorization: `Bearer ${admin.token}` } : {},
        body,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
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
        {uploading ? 'Uploading…' : 'Drop an image here, or click to browse'}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {error && <div className="form-error mt-2" role="alert">{error}</div>}
      {value && (
        <div className="image-dropzone-preview">
          <SkeletonImage src={value} alt="Uploaded preview" className="dropzone-preview-thumb" />
        </div>
      )}
    </div>
  );
}
