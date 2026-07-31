import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPinned, Siren, Users } from 'lucide-react';
import { IssueMap } from '../components/IssueMap.jsx';
import { Spinner } from '../components/Spinner.jsx';
import api from '../api/client.js';

function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-800/60 px-5 py-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/50">{label}</p>
      </div>
    </div>
  );
}

export function Landing() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getIssues({})])
      .then(([statsData, issuesData]) => {
        setStats(statsData);
        setIssues(issuesData.issues.slice(0, 20));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(45,212,191,0.15),transparent_45%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-300">
              Community-powered infrastructure reporting
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Report it. Track it. <span className="text-teal-300">Fix your campus/city.</span>
            </h1>
            <p className="mt-5 text-lg text-white/60">
              UrbanFix lets residents flag broken furniture, leaks, poor lighting, overflowing bins, and safety
              hazards — then track every issue from report to resolution.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/report" className="btn-primary text-base">
                Report an Issue
              </Link>
              <Link to="/map" className="btn-secondary text-base">
                View live map
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {loading || !stats ? (
              <div className="col-span-3 flex justify-center py-6"><Spinner className="text-teal-400" /></div>
            ) : (
              <>
                <StatPill icon={Siren} value={stats.totalIssues} label="Issues reported" />
                <StatPill icon={CheckCircle2} value={stats.resolvedIssues} label="Issues resolved" />
                <StatPill icon={Users} value={stats.activeUsers} label="Active users" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Map preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
              <MapPinned className="text-teal-300" size={22} /> Recent reports near you
            </h2>
            <p className="mt-1 text-white/50">A live snapshot of what's being reported right now.</p>
          </div>
          <Link to="/map" className="btn-secondary hidden text-sm sm:inline-flex">
            Open full map
          </Link>
        </div>
        <div className="card h-80 overflow-hidden sm:h-96">
          {loading ? (
            <div className="flex h-full items-center justify-center"><Spinner size={28} className="text-teal-400" /></div>
          ) : (
            <IssueMap issues={issues} zoom={13} />
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 bg-navy-900/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-white">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: '1. Report', text: 'Snap a photo, pin the location, and describe the issue in under a minute.' },
              { title: '2. Track', text: 'Watch it move through Reported → Acknowledged → In Progress → Resolved.' },
              { title: '3. Resolve', text: 'Facilities teams close the loop with a before/after photo and resolution notes.' },
            ].map((step) => (
              <div key={step.title} className="card p-6">
                <h3 className="text-lg font-semibold text-teal-300">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
