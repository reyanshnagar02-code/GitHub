import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ImagePlus, Send, ThumbsUp, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { LocationPicker } from '../components/LocationPicker.jsx';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { CATEGORIES, URGENCY_LEVELS } from '../constants.js';
import api from '../api/client.js';

const NEARBY_RADIUS_METERS = 50;

export function Report() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [urgency, setUrgency] = useState('Medium');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [position, setPosition] = useState(null);

  const [checking, setChecking] = useState(false);
  const [nearby, setNearby] = useState(null); // array of similar issues, or null
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // created issue
  const [upvotedIds, setUpvotedIds] = useState(new Set());

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setUrgency('Medium');
    setPhoto(null);
    setPhotoPreview(null);
    setNearby(null);
  }

  async function submitIssue() {
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('urgency', urgency);
      formData.append('lat', position[0]);
      formData.append('lng', position[1]);
      if (photo) formData.append('photo', photo);

      const { issue } = await api.createIssue(formData, token);
      setSuccess(issue);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!position) {
      setError('Please set a location for this issue.');
      return;
    }

    setChecking(true);
    try {
      const { issues } = await api.getIssues(
        { category, near: `${position[0]},${position[1]},${NEARBY_RADIUS_METERS}` },
        token
      );
      if (issues.length > 0) {
        setNearby(issues);
      } else {
        await submitIssue();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }

  async function handleUpvote(issueId) {
    try {
      await api.upvoteIssue(issueId, token);
      setUpvotedIds((prev) => new Set(prev).add(issueId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16 text-center">
        <div className="card p-8">
          <CheckCircle2 className="mx-auto mb-4 text-teal-400" size={48} />
          <h1 className="text-2xl font-bold text-white">Issue reported!</h1>
          <p className="mt-2 text-white/60">Thanks for helping improve your campus/city.</p>
          <div className="mt-5 rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-teal-300/80">Tracking ID</p>
            <p className="text-xl font-mono font-bold text-teal-300">#{String(success.id).padStart(5, '0')}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate(`/issue/${success.id}`)} className="btn-primary flex-1">
              View issue
            </button>
            <button onClick={() => setSuccess(null)} className="btn-secondary flex-1">
              Report another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Report an issue</h1>
      <p className="mt-1 text-white/60">Give us the details — a photo and pinpoint location help crews resolve it faster.</p>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5 p-6">
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input
            id="title"
            required
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken bench outside library"
          />
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows={4}
            className="input resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's wrong and where exactly it is..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">Urgency</span>
            <div className="flex gap-2">
              {URGENCY_LEVELS.map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={`flex-1 rounded-lg border px-2 py-2.5 text-xs font-semibold transition ${
                    urgency === u
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                      : 'border-white/10 bg-navy-900 text-white/50 hover:border-white/20'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Photo</label>
          <label className="flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 bg-navy-900 transition hover:border-teal-400/50">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-white/40">
                <ImagePlus size={22} />
                <span className="text-xs">Click to upload a photo</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>

        <div>
          <label className="label">Location</label>
          <LocationPicker position={position} onChange={setPosition} />
        </div>

        <button type="submit" disabled={checking || submitting} className="btn-primary w-full">
          {checking || submitting ? <Spinner size={16} /> : <Send size={16} />}
          {checking ? 'Checking for nearby issues…' : submitting ? 'Submitting…' : 'Submit report'}
        </button>
      </form>

      {nearby && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog">
          <div className="card w-full max-w-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Similar issue nearby</h2>
                <p className="mt-1 text-sm text-white/60">
                  We found existing {category.toLowerCase()} reports within {NEARBY_RADIUS_METERS}m. Upvote one instead of duplicating?
                </p>
              </div>
              <button onClick={() => setNearby(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {nearby.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-navy-900 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{issue.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={issue.status} />
                      <UrgencyBadge urgency={issue.urgency} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpvote(issue.id)}
                    disabled={upvotedIds.has(issue.id) || issue.upvoted_by_me}
                    className="btn-secondary shrink-0 !px-3 !py-1.5 text-xs"
                  >
                    <ThumbsUp size={13} />
                    {upvotedIds.has(issue.id) || issue.upvoted_by_me ? 'Upvoted' : `Upvote (${issue.upvote_count})`}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setNearby(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={async () => {
                  setNearby(null);
                  await submitIssue();
                }}
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting ? <Spinner size={16} /> : 'Report anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
