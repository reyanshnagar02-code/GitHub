import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, MessageSquare, Send, TrendingUp } from 'lucide-react';
import api from '../api/client.js';

export function About() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  const resolutionRate = stats && stats.totalIssues > 0
    ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold text-white">About UrbanFix</h1>
      <p className="mt-3 text-lg text-white/60">
        Small infrastructure problems — a broken bench, a dark walkway, a clogged drain — rarely get reported
        through official channels, and even when they do, no one outside a maintenance office can see whether
        anything happened. UrbanFix closes that loop by making reporting, tracking, and resolving public and
        collaborative.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { icon: Send, title: 'Report', text: 'Anyone can flag an issue in under a minute with a photo and pinned location.' },
          { icon: TrendingUp, title: 'Track', text: 'Every report moves through a public status timeline, visible to the whole community.' },
          { icon: CheckCircle2, title: 'Resolve', text: 'Facilities teams close issues with proof — a resolution photo and timestamp.' },
        ].map((s) => (
          <div key={s.title} className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
              <s.icon size={20} />
            </span>
            <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm text-white/60">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8">
        <h2 className="text-xl font-bold text-white">Why it matters</h2>
        <p className="mt-3 text-white/60">
          Crowdsourced, transparent tracking means duplicate reports get merged into upvotes instead of noise,
          urgent safety hazards rise to the top, and everyone — reporters, facilities teams, and administrators —
          can see progress in real time. Points and leaderboards turn civic maintenance into something people
          actually want to participate in.
        </p>
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-teal-300">{stats.totalIssues}</p>
              <p className="text-xs text-white/40">Total reports</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-300">{stats.resolvedIssues}</p>
              <p className="text-xs text-white/40">Resolved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-300">{resolutionRate ?? '—'}%</p>
              <p className="text-xs text-white/40">Resolution rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-300">{stats.activeUsers}</p>
              <p className="text-xs text-white/40">Active users</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-teal-400/20 bg-teal-400/5 p-8 text-center">
        <MapPin className="text-teal-300" size={28} />
        <h2 className="text-xl font-bold text-white">Ready to make your first report?</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/report" className="btn-primary">
            <Send size={16} /> Report an issue
          </Link>
          <Link to="/leaderboard" className="btn-secondary">
            <MessageSquare size={16} /> See top contributors
          </Link>
        </div>
      </div>
    </div>
  );
}
