import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Spinner } from './Spinner.jsx';

export function ResolvePhotoModal({ issue, onCancel, onConfirm, submitting }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Mark as Resolved</h2>
            <p className="mt-1 text-sm text-white/60">Upload a resolution photo for &ldquo;{issue.title}&rdquo;.</p>
          </div>
          <button onClick={onCancel} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <label className="mt-4 flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 bg-navy-900 hover:border-teal-400/50">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-white/40">
              <Upload size={20} />
              <span className="text-xs">Click to upload resolution photo</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        <div className="mt-5 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={() => onConfirm(file)}
            disabled={!file || submitting}
            className="btn-primary flex-1"
          >
            {submitting ? <Spinner size={16} /> : 'Confirm resolved'}
          </button>
        </div>
      </div>
    </div>
  );
}
