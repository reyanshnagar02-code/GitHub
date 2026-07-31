import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { ArrowUpDown, Clock, Flame, ListChecks, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge.jsx';
import { ResolvePhotoModal } from '../components/ResolvePhotoModal.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { STATUSES } from '../constants.js';
import api from '../api/client.js';

const URGENCY_RANK = { Low: 0, Medium: 1, High: 2 };

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-white/50">
        <Icon size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

export function AdminDashboard() {
  const { token } = useAuthStore();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [teamDrafts, setTeamDrafts] = useState({});
  const [resolveTarget, setResolveTarget] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const [categoryData, setCategoryData] = useState([]);
  const [resolutionTrend, setResolutionTrend] = useState([]);
  const [avgResolutionHours, setAvgResolutionHours] = useState(0);
  const [hotspots, setHotspots] = useState([]);

  async function loadIssues() {
    setLoading(true);
    setError('');
    try {
      const { issues } = await api.getIssues({}, token);
      setIssues(issues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAnalytics() {
    try {
      const [cat, res, hot] = await Promise.all([
        api.getCategoryAnalytics(token),
        api.getResolutionAnalytics(token),
        api.getHotspots(token),
      ]);
      setCategoryData(cat.categories);
      setResolutionTrend(res.trend);
      setAvgResolutionHours(res.averageResolutionHours);
      setHotspots(hot.hotspots.slice(0, 8));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadIssues();
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = useMemo(() => {
    const arr = [...issues];
    arr.sort((a, b) => {
      let av, bv;
      if (sortKey === 'urgency') {
        av = URGENCY_RANK[a.urgency];
        bv = URGENCY_RANK[b.urgency];
      } else if (sortKey === 'upvote_count') {
        av = a.upvote_count;
        bv = b.upvote_count;
      } else {
        av = a.created_at;
        bv = b.created_at;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [issues, sortKey, sortDir]);

  async function updateStatus(issue, newStatus) {
    if (newStatus === issue.status) return;
    if (newStatus === 'Resolved' && !issue.resolved_photo_url) {
      setResolveTarget(issue);
      return;
    }
    setSavingId(issue.id);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      const { issue: updated } = await api.updateStatus(issue.id, formData, token);
      setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function confirmResolve(file) {
    if (!file || !resolveTarget) return;
    setSavingId(resolveTarget.id);
    try {
      const formData = new FormData();
      formData.append('status', 'Resolved');
      formData.append('resolvedPhoto', file);
      const { issue: updated } = await api.updateStatus(resolveTarget.id, formData, token);
      setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setResolveTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function saveTeam(issue) {
    const value = teamDrafts[issue.id] ?? issue.assigned_team ?? '';
    setSavingId(issue.id);
    try {
      const formData = new FormData();
      formData.append('assigned_team', value);
      const { issue: updated } = await api.updateStatus(issue.id, formData, token);
      setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  const SortHeader = ({ label, sortKeyName }) => (
    <button
      onClick={() => toggleSort(sortKeyName)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-teal-300"
    >
      {label} <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      <p className="mt-1 text-white/60">Manage issue statuses and monitor city/campus-wide trends.</p>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="Total issues" value={issues.length} />
        <StatCard
          icon={Flame}
          label="Unresolved"
          value={issues.filter((i) => i.status !== 'Resolved').length}
        />
        <StatCard
          icon={Clock}
          label="Avg. resolution time"
          value={avgResolutionHours ? `${avgResolutionHours}h` : '—'}
          sub="Across resolved issues"
        />
        <StatCard
          icon={ArrowUpDown}
          label="High urgency open"
          value={issues.filter((i) => i.urgency === 'High' && i.status !== 'Resolved').length}
        />
      </div>

      {/* Table */}
      <div className="card mt-8 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center p-10"><Spinner size={28} className="text-teal-400" /></div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3"><SortHeader label="Urgency" sortKeyName="urgency" /></th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"><SortHeader label="Upvotes" sortKeyName="upvote_count" /></th>
                <th className="px-4 py-3"><SortHeader label="Date" sortKeyName="created_at" /></th>
                <th className="px-4 py-3">Assigned team</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((issue) => (
                <tr key={issue.id} className="border-b border-white/5 align-top hover:bg-white/[0.02]">
                  <td className="max-w-[220px] px-4 py-3">
                    <p className="truncate font-medium text-white">{issue.title}</p>
                    <p className="text-xs text-white/40">#{String(issue.id).padStart(5, '0')} &middot; {issue.reporter_name}</p>
                  </td>
                  <td className="px-4 py-3 text-white/70">{issue.category}</td>
                  <td className="px-4 py-3"><UrgencyBadge urgency={issue.urgency} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={issue.status} />
                      {savingId === issue.id && <Spinner size={13} className="text-teal-400" />}
                    </div>
                    <select
                      value={issue.status}
                      onChange={(e) => updateStatus(issue, e.target.value)}
                      disabled={savingId === issue.id}
                      className="input mt-2 !py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-white/70">{issue.upvote_count}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-white/50">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        className="input !py-1.5 text-xs"
                        placeholder="e.g. Facilities Team A"
                        value={teamDrafts[issue.id] ?? issue.assigned_team ?? ''}
                        onChange={(e) => setTeamDrafts((prev) => ({ ...prev, [issue.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => saveTeam(issue)}
                        disabled={savingId === issue.id}
                        className="btn-secondary !px-2 !py-1.5"
                        title="Save assignment"
                      >
                        <Save size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Analytics */}
      <h2 className="mt-10 text-xl font-bold text-white">Analytics</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold text-white/80">Issues by category</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0f1e2e', border: '1px solid #ffffff22', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="mb-4 text-sm font-semibold text-white/80">Resolution time trend (last 30 days)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} label={{ value: 'hrs', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#0f1e2e', border: '1px solid #ffffff22', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="avgResolutionHours" name="Avg hours to resolve" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          {resolutionTrend.length === 0 && (
            <p className="mt-2 text-center text-xs text-white/40">No issues resolved in the last 30 days yet.</p>
          )}
        </div>
      </div>

      <div className="card mt-6 p-5">
        <p className="mb-4 text-sm font-semibold text-white/80">Hotspot zones</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {hotspots.map((zone, idx) => (
            <div key={`${zone.lat}-${zone.lng}`} className="rounded-lg border border-white/10 bg-navy-900/60 p-3">
              <p className="text-xs text-white/40">Zone #{idx + 1}</p>
              <p className="mt-1 text-lg font-bold text-white">{zone.count} reports</p>
              <p className="text-xs text-white/40">{zone.unresolved} unresolved</p>
              <p className="mt-1 text-[11px] text-white/30">{zone.lat.toFixed(3)}, {zone.lng.toFixed(3)}</p>
            </div>
          ))}
          {hotspots.length === 0 && <p className="text-xs text-white/40">Not enough data yet.</p>}
        </div>
      </div>

      {resolveTarget && (
        <ResolvePhotoModal
          issue={resolveTarget}
          onCancel={() => setResolveTarget(null)}
          onConfirm={confirmResolve}
          submitting={savingId === resolveTarget.id}
        />
      )}
    </div>
  );
}
