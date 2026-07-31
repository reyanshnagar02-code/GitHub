import bcrypt from 'bcryptjs';
import { db } from './db.js';

console.log('Seeding UrbanFix database...');

db.exec(`
  DELETE FROM comments;
  DELETE FROM upvotes;
  DELETE FROM issues;
  DELETE FROM users;
  DELETE FROM sqlite_sequence WHERE name IN ('comments', 'upvotes', 'issues', 'users');
`);

const passwordHash = bcrypt.hashSync('password123', 10);

const insertUser = db.prepare(
  'INSERT INTO users (name, email, password_hash, role, points, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);

function daysAgoIso(days, hours = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

const users = [
  { name: 'Admin User', email: 'admin@urbanfix.dev', role: 'admin', points: 0 },
  { name: 'Priya Sharma', email: 'priya@urbanfix.dev', role: 'resident', points: 0 },
  { name: 'Jordan Lee', email: 'jordan@urbanfix.dev', role: 'resident', points: 0 },
  { name: 'Maria Gonzalez', email: 'maria@urbanfix.dev', role: 'resident', points: 0 },
  { name: 'Sam Okafor', email: 'sam@urbanfix.dev', role: 'resident', points: 0 },
  { name: 'Wei Chen', email: 'wei@urbanfix.dev', role: 'resident', points: 0 },
];

const userIds = {};
for (const u of users) {
  const info = insertUser.run(u.name, u.email, passwordHash, u.role, u.points, daysAgoIso(60));
  userIds[u.email] = info.lastInsertRowid;
}

// Base coordinates roughly centered on a campus/city block; issues jitter around it
const BASE_LAT = 42.2808;
const BASE_LNG = -83.743;
const jitter = () => (Math.random() - 0.5) * 0.01;

const insertIssue = db.prepare(`
  INSERT INTO issues
    (reporter_id, title, description, category, urgency, photo_url, lat, lng, status, upvote_count, assigned_team, resolved_photo_url, resolved_at, created_at)
  VALUES (@reporter_id, @title, @description, @category, @urgency, @photo_url, @lat, @lng, @status, @upvote_count, @assigned_team, @resolved_photo_url, @resolved_at, @created_at)
`);

const PLACEHOLDER_PHOTO = '/uploads/placeholder-issue.svg';
const PLACEHOLDER_RESOLVED = '/uploads/placeholder-resolved.svg';

const reporters = Object.values(userIds).filter((id) => id !== userIds['admin@urbanfix.dev']);
const randReporter = () => reporters[Math.floor(Math.random() * reporters.length)];

const issuesData = [
  {
    title: 'Broken bench outside library',
    description: 'Wooden bench near the north library entrance has a cracked plank and a loose leg — unsafe to sit on.',
    category: 'Furniture',
    urgency: 'Medium',
    status: 'Resolved',
    createdDaysAgo: 28,
    resolvedDaysAgo: 24,
  },
  {
    title: 'Flickering streetlight on Maple Ave',
    description: 'The streetlight at the corner of Maple Ave has been flickering for a week and goes fully dark after 11pm.',
    category: 'Lighting',
    urgency: 'High',
    status: 'In Progress',
    createdDaysAgo: 6,
  },
  {
    title: 'Overflowing trash bin near cafeteria',
    description: 'Bin outside the main cafeteria has been overflowing for two days, attracting pests.',
    category: 'Sanitation',
    urgency: 'High',
    status: 'Reported',
    createdDaysAgo: 1,
  },
  {
    title: 'Water leak in basement hallway',
    description: 'Steady drip from the ceiling in the engineering building basement, pooling near the electrical panel.',
    category: 'Infrastructure',
    urgency: 'High',
    status: 'Acknowledged',
    createdDaysAgo: 3,
  },
  {
    title: 'Cracked pavement tripping hazard',
    description: 'Large crack in the sidewalk in front of the science hall has grown and now catches wheelchairs and strollers.',
    category: 'Safety',
    urgency: 'High',
    status: 'In Progress',
    createdDaysAgo: 9,
  },
  {
    title: 'Broken swing at campus park',
    description: 'One swing chain has snapped and is lying on the ground, seat is missing.',
    category: 'Furniture',
    urgency: 'Low',
    status: 'Resolved',
    createdDaysAgo: 20,
    resolvedDaysAgo: 15,
  },
  {
    title: 'Dark parking lot B at night',
    description: 'Three of the eight lamp posts in lot B are completely out, making it unsafe to walk to cars after evening classes.',
    category: 'Lighting',
    urgency: 'Medium',
    status: 'Acknowledged',
    createdDaysAgo: 5,
  },
  {
    title: 'Clogged storm drain flooding walkway',
    description: 'After rain, the walkway between dorms C and D floods ankle-deep because the storm drain is clogged with leaves.',
    category: 'Infrastructure',
    urgency: 'Medium',
    status: 'Reported',
    createdDaysAgo: 2,
  },
  {
    title: 'Graffiti on gymnasium wall',
    description: 'Spray paint graffiti covering the south wall of the gymnasium, appeared over the weekend.',
    category: 'Other',
    urgency: 'Low',
    status: 'Reported',
    createdDaysAgo: 4,
  },
  {
    title: 'Overflowing recycling bins in quad',
    description: 'All three recycling bins in the central quad are overflowing after the weekend event.',
    category: 'Sanitation',
    urgency: 'Medium',
    status: 'Resolved',
    createdDaysAgo: 18,
    resolvedDaysAgo: 17,
  },
  {
    title: 'Loose handrail on stadium steps',
    description: 'The handrail on the east stadium staircase wobbles significantly and could give way.',
    category: 'Safety',
    urgency: 'High',
    status: 'In Progress',
    createdDaysAgo: 11,
  },
  {
    title: 'Broken vending machine light',
    description: 'The vending machine outside the student union has a flickering internal light and a jammed coin slot.',
    category: 'Furniture',
    urgency: 'Low',
    status: 'Reported',
    createdDaysAgo: 1,
  },
  {
    title: 'Pothole on service road',
    description: 'Deep pothole on the delivery service road behind the dining hall is damaging vehicle tires.',
    category: 'Infrastructure',
    urgency: 'Medium',
    status: 'Acknowledged',
    createdDaysAgo: 7,
  },
  {
    title: 'Icy patch near dorm entrance',
    description: 'Persistent ice patch by the west dorm entrance has not been salted, several students have slipped.',
    category: 'Safety',
    urgency: 'High',
    status: 'Resolved',
    createdDaysAgo: 26,
    resolvedDaysAgo: 25,
  },
  {
    title: 'Missing trash bin lid',
    description: 'The lid on the bin near the tennis courts is missing, letting rain and animals get in.',
    category: 'Sanitation',
    urgency: 'Low',
    status: 'Reported',
    createdDaysAgo: 0,
  },
];

const issueIds = [];
for (const item of issuesData) {
  const reporter_id = randReporter();
  const created_at = daysAgoIso(item.createdDaysAgo);
  const resolved_at = item.status === 'Resolved' ? daysAgoIso(item.resolvedDaysAgo) : null;

  const info = insertIssue.run({
    reporter_id,
    title: item.title,
    description: item.description,
    category: item.category,
    urgency: item.urgency,
    photo_url: PLACEHOLDER_PHOTO,
    lat: BASE_LAT + jitter(),
    lng: BASE_LNG + jitter(),
    status: item.status,
    upvote_count: 0,
    assigned_team: item.status === 'Reported' ? null : 'Facilities Team A',
    resolved_photo_url: item.status === 'Resolved' ? PLACEHOLDER_RESOLVED : null,
    resolved_at,
    created_at,
  });
  issueIds.push(info.lastInsertRowid);
  db.prepare('UPDATE users SET points = points + 5 WHERE id = ?').run(reporter_id);
}

// Sprinkle upvotes and comments
const insertUpvote = db.prepare('INSERT OR IGNORE INTO upvotes (issue_id, user_id) VALUES (?, ?)');
const insertComment = db.prepare('INSERT INTO comments (issue_id, user_id, text, created_at) VALUES (?, ?, ?, ?)');
const bumpUpvoteCount = db.prepare('UPDATE issues SET upvote_count = upvote_count + 1 WHERE id = ?');
const bumpPoints = db.prepare('UPDATE users SET points = points + ? WHERE id = ?');

const allUserIds = Object.values(userIds);
const sampleComments = [
  'Saw this too, still not fixed.',
  'Reported this to the front desk as well.',
  'Getting worse every day, please prioritize.',
  'Thanks for filing this — upvoted!',
  'This is right outside my building, +1 for urgency.',
  'Glad to see this got resolved quickly.',
];

for (const issueId of issueIds) {
  const issue = db.prepare('SELECT reporter_id FROM issues WHERE id = ?').get(issueId);
  const upvoterCount = Math.floor(Math.random() * 5);
  const potentialVoters = allUserIds.filter((id) => id !== issue.reporter_id);
  const shuffled = [...potentialVoters].sort(() => Math.random() - 0.5).slice(0, upvoterCount);

  for (const voterId of shuffled) {
    const result = insertUpvote.run(issueId, voterId);
    if (result.changes > 0) {
      bumpUpvoteCount.run(issueId);
      bumpPoints.run(2, issue.reporter_id);
    }
  }

  if (Math.random() > 0.4) {
    const commenterCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < commenterCount; i++) {
      const commenterId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
      const text = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      insertComment.run(issueId, commenterId, text, daysAgoIso(Math.floor(Math.random() * 5)));
      bumpPoints.run(1, commenterId);
    }
  }
}

console.log(`Seeded ${users.length} users and ${issuesData.length} issues.`);
console.log('Demo login: admin@urbanfix.dev / password123 (admin)');
console.log('Demo login: priya@urbanfix.dev / password123 (resident)');
