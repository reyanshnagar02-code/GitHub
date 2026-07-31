import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { distanceMeters } from '../utils/geo.js';

const router = Router();

const REPORT_POINTS = 5;
const UPVOTE_POINTS = 2;
const COMMENT_POINTS = 1;

function issueWithReporter(issue) {
  if (!issue) return issue;
  const reporter = db.prepare('SELECT id, name FROM users WHERE id = ?').get(issue.reporter_id);
  return { ...issue, reporter_name: reporter?.name || 'Unknown' };
}

// GET /api/issues?category=&status=&urgency=&near=lat,lng,radius&from=&to=
router.get('/', optionalAuth, (req, res) => {
  const { category, status, urgency, near, from, to } = req.query;

  let sql = 'SELECT * FROM issues WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (urgency) {
    sql += ' AND urgency = ?';
    params.push(urgency);
  }
  if (from) {
    sql += ' AND created_at >= ?';
    params.push(from);
  }
  if (to) {
    sql += ' AND created_at <= ?';
    params.push(to);
  }

  sql += ' ORDER BY created_at DESC';

  let issues = db.prepare(sql).all(...params);

  if (near) {
    const [latStr, lngStr, radiusStr] = String(near).split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = parseFloat(radiusStr) || 50;
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      issues = issues.filter((i) => distanceMeters(lat, lng, i.lat, i.lng) <= radius);
    }
  }

  issues = issues.map(issueWithReporter);

  if (req.user) {
    const upvoted = new Set(
      db
        .prepare('SELECT issue_id FROM upvotes WHERE user_id = ?')
        .all(req.user.id)
        .map((r) => r.issue_id)
    );
    issues = issues.map((i) => ({ ...i, upvoted_by_me: upvoted.has(i.id) }));
  }

  res.json({ issues });
});

router.get('/:id', optionalAuth, (req, res) => {
  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const comments = db
    .prepare(
      `SELECT comments.*, users.name AS user_name
       FROM comments JOIN users ON users.id = comments.user_id
       WHERE issue_id = ? ORDER BY comments.created_at ASC`
    )
    .all(req.params.id);

  let upvoted_by_me = false;
  if (req.user) {
    upvoted_by_me = !!db
      .prepare('SELECT 1 FROM upvotes WHERE issue_id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
  }

  res.json({ issue: { ...issueWithReporter(issue), upvoted_by_me }, comments });
});

router.post('/', requireAuth, upload.single('photo'), (req, res) => {
  const { title, description, category, urgency, lat, lng } = req.body;

  if (!title || !description || !category || !lat || !lng) {
    return res.status(400).json({ error: 'title, description, category, lat and lng are required' });
  }
  const validUrgency = ['Low', 'Medium', 'High'].includes(urgency) ? urgency : 'Medium';
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  const info = db
    .prepare(
      `INSERT INTO issues (reporter_id, title, description, category, urgency, photo_url, lat, lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, title.trim(), description.trim(), category, validUrgency, photo_url, parseFloat(lat), parseFloat(lng));

  db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(REPORT_POINTS, req.user.id);

  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ issue: issueWithReporter(issue) });
});

router.post('/:id/upvote', requireAuth, (req, res) => {
  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const existing = db
    .prepare('SELECT 1 FROM upvotes WHERE issue_id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (existing) return res.status(409).json({ error: 'You already upvoted this issue' });

  const tx = db.transaction(() => {
    db.prepare('INSERT INTO upvotes (issue_id, user_id) VALUES (?, ?)').run(req.params.id, req.user.id);
    db.prepare('UPDATE issues SET upvote_count = upvote_count + 1 WHERE id = ?').run(req.params.id);
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(UPVOTE_POINTS, issue.reporter_id);
  });
  tx();

  const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  res.json({ issue: issueWithReporter(updated) });
});

router.post('/:id/comment', requireAuth, (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text is required' });

  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const tx = db.transaction(() => {
    const info = db
      .prepare('INSERT INTO comments (issue_id, user_id, text) VALUES (?, ?, ?)')
      .run(req.params.id, req.user.id, text.trim());
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(COMMENT_POINTS, req.user.id);
    return info.lastInsertRowid;
  });
  const commentId = tx();

  const comment = db
    .prepare(
      `SELECT comments.*, users.name AS user_name FROM comments
       JOIN users ON users.id = comments.user_id WHERE comments.id = ?`
    )
    .get(commentId);

  res.status(201).json({ comment });
});

router.patch('/:id/status', requireAuth, requireAdmin, upload.single('resolvedPhoto'), (req, res) => {
  const { status, assigned_team } = req.body;
  const validStatuses = ['Reported', 'Acknowledged', 'In Progress', 'Resolved'];

  const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (status === 'Resolved' && !req.file && !issue.resolved_photo_url) {
    return res.status(400).json({ error: 'A resolution photo is required to mark an issue as Resolved' });
  }

  const fields = [];
  const params = [];

  if (status) {
    fields.push('status = ?');
    params.push(status);
    if (status === 'Resolved') {
      fields.push('resolved_at = ?');
      params.push(new Date().toISOString());
    }
  }
  if (assigned_team !== undefined) {
    fields.push('assigned_team = ?');
    params.push(assigned_team);
  }
  if (req.file) {
    fields.push('resolved_photo_url = ?');
    params.push(`/uploads/${req.file.filename}`);
  }

  if (fields.length === 0) return res.status(400).json({ error: 'Nothing to update' });

  params.push(req.params.id);
  db.prepare(`UPDATE issues SET ${fields.join(', ')} WHERE id = ?`).run(...params);

  const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
  res.json({ issue: issueWithReporter(updated) });
});

export default router;
