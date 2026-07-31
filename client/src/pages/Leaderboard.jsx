import { useEffect, useState } from 'react';
import { Award, Crown, Medal, Trophy } from 'lucide-react';
import { Spinner } from '../components/Spinner.jsx';
import { BADGE_COLORS } from '../constants.js';
import api from '../api/client.js';

const BADGE_ICON = { Gold: Crown, Silver: Medal, Bronze: Award };

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getLeaderboard()
      .then((data) => setLeaderboard(data.leaderboard))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <Trophy className="mx-auto mb-3 text-teal-400" size={36} />
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-1 text-white/60">
          Top contributors, ranked by points. +5 for a valid report, +2 per upvote received, +1 for commenting.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Spinner size={28} className="text-teal-400" /></div>
      ) : error ? (
        <p className="mt-6 text-center text-red-300">{error}</p>
      ) : (
        <div className="card mt-8 divide-y divide-white/5">
          {leaderboard.map((entry) => {
            const Icon = BADGE_ICON[entry.badge];
            return (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-400 text-navy-950'
                      : entry.rank === 2
                      ? 'bg-slate-300 text-navy-950'
                      : entry.rank === 3
                      ? 'bg-orange-400 text-navy-950'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {entry.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{entry.name}</p>
                  <p className="text-xs text-white/40">{entry.points} points</p>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE_COLORS[entry.badge]}`}
                >
                  <Icon size={13} /> {entry.badge}
                </span>
              </div>
            );
          })}
          {leaderboard.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-white/40">No contributors yet — be the first!</p>
          )}
        </div>
      )}
    </div>
  );
}
