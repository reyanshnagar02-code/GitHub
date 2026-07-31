import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const users = db
    .prepare('SELECT id, name, points, created_at FROM users ORDER BY points DESC, created_at ASC')
    .all();

  const ranked = users.map((u, idx) => {
    let badge = 'Bronze';
    if (u.points > 150) badge = 'Gold';
    else if (u.points > 50) badge = 'Silver';
    return { ...u, rank: idx + 1, badge };
  });

  res.json({ leaderboard: ranked });
});

export default router;
