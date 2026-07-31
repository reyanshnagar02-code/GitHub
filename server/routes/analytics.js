import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/categories', (_req, res) => {
  const rows = db
    .prepare('SELECT category, COUNT(*) AS count FROM issues GROUP BY category ORDER BY count DESC')
    .all();
  res.json({ categories: rows });
});

router.get('/resolution-time', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT date(created_at) AS created_day, created_at, resolved_at
       FROM issues
       WHERE status = 'Resolved' AND resolved_at IS NOT NULL
         AND resolved_at >= datetime('now', '-30 days')`
    )
    .all();

  const byDay = {};
  for (const row of rows) {
    const day = row.resolved_at.slice(0, 10);
    const hours = (new Date(row.resolved_at) - new Date(row.created_at)) / 3600000;
    if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
    byDay[day].total += hours;
    byDay[day].count += 1;
  }

  const trend = Object.entries(byDay)
    .map(([date, { total, count }]) => ({
      date,
      avgResolutionHours: Math.round((total / count) * 10) / 10,
      resolvedCount: count,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const overall = db
    .prepare(
      `SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 24) AS avgHours
       FROM issues WHERE status = 'Resolved' AND resolved_at IS NOT NULL`
    )
    .get();

  res.json({
    trend,
    averageResolutionHours: overall.avgHours ? Math.round(overall.avgHours * 10) / 10 : 0,
  });
});

router.get('/hotspots', (_req, res) => {
  const rows = db.prepare('SELECT lat, lng, status FROM issues').all();

  const zones = {};
  for (const row of rows) {
    // Round to ~110m precision to cluster nearby reports into a zone
    const key = `${row.lat.toFixed(3)},${row.lng.toFixed(3)}`;
    if (!zones[key]) {
      const [lat, lng] = key.split(',').map(Number);
      zones[key] = { lat, lng, count: 0, unresolved: 0 };
    }
    zones[key].count += 1;
    if (row.status !== 'Resolved') zones[key].unresolved += 1;
  }

  const hotspots = Object.values(zones).sort((a, b) => b.count - a.count);
  res.json({ hotspots });
});

export default router;
