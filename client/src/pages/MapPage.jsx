import { useEffect, useMemo, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { IssueMap } from '../components/IssueMap.jsx';
import { IssuePanel } from '../components/IssuePanel.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { CATEGORIES, URGENCY_LEVELS, STATUSES } from '../constants.js';
import { useAuthStore } from '../store/authStore.js';
import api from '../api/client.js';

export function MapPage() {
  const { token } = useAuthStore();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [categories, setCategories] = useState(new Set());
  const [urgencies, setUrgencies] = useState(new Set());
  const [statuses, setStatuses] = useState(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  async function load() {
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(setFn, value) {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      if (categories.size && !categories.has(issue.category)) return false;
      if (urgencies.size && !urgencies.has(issue.urgency)) return false;
      if (statuses.size && !statuses.has(issue.status)) return false;
      if (dateFrom && issue.created_at < dateFrom) return false;
      if (dateTo && issue.created_at > `${dateTo}T23:59:59`) return false;
      return true;
    });
  }, [issues, categories, urgencies, statuses, dateFrom, dateTo]);

  function clearFilters() {
    setCategories(new Set());
    setUrgencies(new Set());
    setStatuses(new Set());
    setDateFrom('');
    setDateTo('');
  }

  const activeFilterCount = categories.size + urgencies.size + statuses.size + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full">
      {/* Filter sidebar */}
      <aside
        className={`absolute z-30 h-full w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-navy-950/95 p-5 backdrop-blur transition-transform md:static md:translate-x-0 ${
          filtersOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Filter size={16} /> Filters
          </h2>
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-teal-300 hover:text-teal-200">
                Clear
              </button>
            )}
            <button className="text-white/50 md:hidden" onClick={() => setFiltersOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Category</p>
          <div className="space-y-1.5">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={categories.has(c)}
                  onChange={() => toggle(setCategories, c)}
                  className="h-3.5 w-3.5 rounded border-white/30 bg-navy-900 text-teal-400 focus:ring-teal-400"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Urgency</p>
          <div className="space-y-1.5">
            {URGENCY_LEVELS.map((u) => (
              <label key={u} className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={urgencies.has(u)}
                  onChange={() => toggle(setUrgencies, u)}
                  className="h-3.5 w-3.5 rounded border-white/30 bg-navy-900 text-teal-400 focus:ring-teal-400"
                />
                {u}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Status</p>
          <div className="space-y-1.5">
            {STATUSES.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={statuses.has(s)}
                  onChange={() => toggle(setStatuses, s)}
                  className="h-3.5 w-3.5 rounded border-white/30 bg-navy-900 text-teal-400 focus:ring-teal-400"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Date range</p>
          <div className="space-y-2">
            <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>

        <p className="mt-4 text-xs text-white/40">{filtered.length} of {issues.length} issues shown</p>
      </aside>

      <button
        onClick={() => setFiltersOpen(true)}
        className="btn-secondary absolute left-4 top-4 z-20 !px-3 !py-2 text-xs md:hidden"
      >
        <Filter size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {/* Map */}
      <div className="relative flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size={32} className="text-teal-400" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-300">{error}</div>
        ) : (
          <IssueMap issues={filtered} onSelect={(issue) => setSelectedId(issue.id)} />
        )}

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-3 rounded-full border border-white/10 bg-navy-950/90 px-4 py-2 text-xs text-white/70 backdrop-blur">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Reported/Acknowledged</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-400" /> In Progress</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400" /> Resolved</span>
        </div>
      </div>

      {/* Side panel */}
      {selectedId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSelectedId(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/10 bg-navy-950 shadow-2xl md:absolute">
            <IssuePanel issueId={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        </>
      )}
    </div>
  );
}
