import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const totalIssues = db.prepare('SELECT COUNT(*) AS c FROM issues').get().c;
  const resolvedIssues = db.prepare("SELECT COUNT(*) AS c FROM issues WHERE status = 'Resolved'").get().c;
  const activeUsers = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  const inProgress = db.prepare("SELECT COUNT(*) AS c FROM issues WHERE status = 'In Progress'").get().c;

  res.json({
    totalIssues,
    resolvedIssues,
    activeUsers,
    inProgress,
  });
});

export default router;
