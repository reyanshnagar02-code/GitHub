# UrbanFix

Report it. Track it. Fix your campus/city.

UrbanFix is a full-stack platform for reporting and tracking urban/campus infrastructure issues — broken furniture, leaks, poor lighting, overflowing bins, safety hazards, and more.

## Tech stack

- **Frontend:** React (Vite) + Tailwind CSS, Zustand for state, React Router, Leaflet/OpenStreetMap for maps, Recharts for analytics, Lucide icons
- **Backend:** Node.js + Express, JWT auth, Multer for photo uploads
- **Database:** SQLite via `better-sqlite3` (plain SQL schema — easy to port to Postgres later)

## Project structure

```
UrbanFix/
├── client/          # React + Vite + Tailwind frontend
├── server/          # Express API + SQLite database + uploads
└── package.json     # root scripts that run client + server together
```

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

Install dependencies for the root, client, and server:

```bash
npm install
npm run install:all
```

Copy the server environment example and adjust if needed:

```bash
cp server/.env.example server/.env
```

Seed the database with demo users and ~15 sample issues:

```bash
npm run seed
```

This creates `server/data/urbanfix.db` and prints demo login credentials, e.g.:

- `admin@urbanfix.dev` / `password123` (admin)
- `priya@urbanfix.dev` / `password123` (resident)

## Run the app

From the project root, start both the API and the frontend together:

```bash
npm run dev
```

- API: http://localhost:5000
- Frontend: http://localhost:5173 (proxies `/api` and `/uploads` to the API)

## Individually

```bash
# server only
npm run dev --prefix server

# client only
npm run dev --prefix client
```

## Data model

- **User**: id, name, email, password_hash, role (`resident`/`admin`), points, created_at
- **Issue**: id, reporter_id, title, description, category, urgency, photo_url, lat, lng, status, upvote_count, assigned_team, resolved_photo_url, resolved_at, created_at
- **Upvote**: id, issue_id, user_id (unique per issue/user)
- **Comment**: id, issue_id, user_id, text, created_at

## API

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
GET    /api/issues              ?category=&status=&urgency=&near=lat,lng,radius&from=&to=
POST   /api/issues              (auth required, multipart photo upload)
GET    /api/issues/:id
POST   /api/issues/:id/upvote   (auth required, prevents duplicates)
POST   /api/issues/:id/comment  (auth required)
PATCH  /api/issues/:id/status   (admin only; requires resolvedPhoto file to set status=Resolved)
GET    /api/stats
GET    /api/leaderboard
GET    /api/analytics/categories
GET    /api/analytics/resolution-time
GET    /api/analytics/hotspots
```

## Points & badges

- +5 for a valid report
- +2 per upvote received on a user's report
- +1 for commenting
- Badges: Bronze (0–50), Silver (51–150), Gold (151+)

## Notes

- Uploaded photos are stored in `server/uploads/` and served statically at `/uploads/*`.
- The map defaults to a sample campus location; drop a pin manually if geolocation is denied.
- To switch to Postgres later, swap `server/db.js` for a Postgres client — the schema and queries use standard SQL.
