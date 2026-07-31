import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, X, ExternalLink, MapPin } from 'lucide-react';
import { StatusBadge, UrgencyBadge } from './StatusBadge.jsx';
import { StatusStepper } from './StatusStepper.jsx';
import { Spinner } from './Spinner.jsx';
import { useAuthStore } from '../store/authStore.js';
import api from '../api/client.js';

export function IssuePanel({ issueId, onClose, showOpenLink = true }) {
  const { token, user } = useAuthStore();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const { issue, comments } = await api.getIssue(issueId, token);
      setIssue(issue);
      setComments(comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueId]);

  async function handleUpvote() {
    if (!token) {
      setError('Log in to upvote this issue.');
      return;
    }
    setUpvoting(true);
    try {
      const { issue: updated } = await api.upvoteIssue(issueId, token);
      setIssue((prev) => ({ ...prev, upvote_count: updated.upvote_count, upvoted_by_me: true }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpvoting(false);
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!token) {
      setError('Log in to add a comment.');
      return;
    }
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const { comment } = await api.addComment(issueId, commentText.trim(), token);
      setComments((prev) => [...prev, comment]);
      setCommentText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <Spinner size={28} className="text-teal-400" />
      </div>
    );
  }

  if (!issue) {
    return <div className="p-6 text-sm text-red-300">{error || 'Issue not found.'}</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={issue.status} />
            <UrgencyBadge urgency={issue.urgency} />
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
              {issue.category}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{issue.title}</h2>
          <p className="mt-0.5 text-xs text-white/40">
            #{String(issue.id).padStart(5, '0')} &middot; reported by {issue.reporter_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showOpenLink && (
            <Link to={`/issue/${issue.id}`} className="text-white/40 hover:text-teal-300" title="Open full page">
              <ExternalLink size={18} />
            </Link>
          )}
          {onClose && (
            <button onClick={onClose} className="text-white/40 hover:text-white" title="Close">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

        {issue.photo_url && (
          <img src={issue.photo_url} alt={issue.title} className="mb-4 h-48 w-full rounded-lg object-cover" />
        )}

        <p className="text-sm leading-relaxed text-white/70">{issue.description}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-white/40">
          <MapPin size={13} /> {issue.lat.toFixed(5)}, {issue.lng.toFixed(5)}
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-navy-900/60 p-4">
          <StatusStepper status={issue.status} />
        </div>

        {issue.status === 'Resolved' && issue.resolved_photo_url && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-white">Before / after</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <img src={issue.photo_url} alt="Before" className="h-32 w-full rounded-lg object-cover" />
                <p className="mt-1 text-center text-[11px] text-white/40">Before</p>
              </div>
              <div>
                <img src={issue.resolved_photo_url} alt="After" className="h-32 w-full rounded-lg object-cover" />
                <p className="mt-1 text-center text-[11px] text-white/40">After</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpvote}
          disabled={upvoting || issue.upvoted_by_me}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            issue.upvoted_by_me
              ? 'border-teal-400 bg-teal-400/15 text-teal-300'
              : 'border-white/10 bg-navy-900 text-white/70 hover:border-teal-400/40 hover:text-teal-300'
          }`}
        >
          <ThumbsUp size={15} />
          {issue.upvoted_by_me ? 'Upvoted' : 'Upvote'} &middot; {issue.upvote_count}
        </button>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-white">
            <MessageSquare size={15} /> Comments ({comments.length})
          </p>
          <div className="space-y-3">
            {comments.length === 0 && <p className="text-xs text-white/40">No comments yet — be the first to add one.</p>}
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-white/10 bg-navy-900/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300">{c.user_name}</span>
                  <span className="text-[11px] text-white/30">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-sm text-white/70">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="mt-3 flex gap-2">
            <input
              className="input"
              placeholder={user ? 'Add a comment...' : 'Log in to comment'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user}
            />
            <button type="submit" disabled={!user || posting || !commentText.trim()} className="btn-primary !px-4">
              {posting ? <Spinner size={15} /> : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
