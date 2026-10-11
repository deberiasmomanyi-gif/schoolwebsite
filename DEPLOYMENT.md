# Deployment (free-tier first)

## Recommended architecture

```
Browser  ->  Render Web Service (Node.js app, free)  ->  Supabase PostgreSQL (free)
```

Keep **local development** and **production** separate: use a **different Supabase project** (and different `.env` values) for the live school, so test and demo data never mixes with real records.

## Free-tier limits - read before relying on them

Prices and limits change. Figures below were checked in 2026 from public sources while preparing this project; **confirm on the providers' pricing pages before you commit.**

| Service | Free-tier behaviour that matters |
|---|---|
| Supabase (database) | 2 free projects, 500 MB database each. **A free project is paused after one week of inactivity** and must be restored manually from the dashboard. Backups may not be included - check your plan. |
| Render (web app) | A free web service **spins down after 15 minutes without traffic**; the next visit takes about a minute to wake. Free services share about 750 instance hours per month. Free instances can restart at any time. Do not use Render's own free Postgres for this project (it expires after 30 days). |

What this means for a school: the free setup is good for **trial and pilot use**. For daily real use during term, plan to pay for (a) always-on hosting (Render's lowest paid instance removes the sleeping) and (b) Supabase Pro, which removes the one-week pause and adds managed backups. If a paid feature is essential to you, treat the free tier as a trial only.

## Step 1 - Put the code on GitHub (privately)

1. Create a free account at https://github.com and click **New repository**. Choose **Private**.
2. **Never upload `.env`.** The included `.gitignore` already excludes `.env`, `node_modules` and `backups`.
3. In VS Code use **Source Control (the branch icon) > Initialize Repository**, type a message, **Commit**, then **Publish Branch** and choose the private repository.
4. Open the repository on github.com and confirm there is **no `.env` file** in the file list. If you ever commit a secret by mistake, change that secret immediately (reset the Supabase database password, generate a new `SESSION_SECRET`) - deleting the file is not enough.

## Step 2 - Create the production database

1. Create a **new** Supabase project for production (see `INSTALLATION.md` Step 6).
2. On your computer, temporarily point `.env` at the production connection string, run `npm run setup-db` and `npm run create-admin`, then put your development string back. **Do not run `seed-demo` on production.**

## Step 3 - Create the Render web service

1. Sign up at https://render.com (GitHub login is easiest).
2. **New > Web Service**, connect your private GitHub repository.
3. Settings: Runtime **Node**, Build command `npm install`, Start command `npm start`, Instance type **Free** (for a trial).
4. Add **Environment Variables** (Render dashboard > Environment):

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | your **production** Supabase Session pooler string |
| `DATABASE_SSL` | `true` |
| `SESSION_SECRET` | a long random value (run `npm run init` locally and copy the generated value from `.env`, but use a different one for production) |
| `SCHOOL_TIMEZONE` | `Africa/Nairobi` |
| `STUDENT_CAN_VIEW_FEES` | `false` (or `true` if the school decides) |

5. Click **Create Web Service**. When the build finishes open the address Render gives you (`https://....onrender.com`) and sign in.

`NODE_ENV=production` turns on Secure cookies (HTTPS only) and HSTS. The app trusts Render's HTTPS proxy automatically in production.

## Database permissions on the hosting platform

The hosting platform only needs the connection string as an environment variable. Nothing else grants access. Do not give Render any Supabase "service role" or "anon" key - the app does not use them. Row Level Security stays enabled with no public policies (see `DATABASE_SETUP.md`).

## Custom domain and HTTPS

Render provides HTTPS on its own address. For a school domain, add it under Render > Settings > Custom Domains and follow the DNS instructions from your domain provider.

## Updating the live site

Commit and push to GitHub; Render rebuilds automatically. If a release contains a new file in `database/migrations/`, run `npm run setup-db` against the production database (set `DATABASE_URL` temporarily on your computer) **before or right after** deploying, and take a backup first.

## Keeping credentials private

* Secrets live only in `.env` (local) and Render's environment settings (live).
* Use a private repository. Do not paste connection strings in chats, e-mails or screenshots.
* Rotate secrets when staff who knew them leave: Supabase **Database > Settings > Reset database password**, then update `DATABASE_URL` on Render.

## Backups and monitoring

* See `DATABASE_SETUP.md` for backup and restore. Test a restore before the school depends on it.
* `https://YOUR-APP/api/health` returns `{"ok":true}` when the app can reach the database; you can watch it with a free uptime monitor. Note that pinging a free Render service to keep it awake uses your monthly free hours.

## Before real learner data goes in

Complete `PRIVACY_CHECKLIST.md` and `tests/security-checklist.md`, run the manual tests in `tests/README.md` on the production site, and have someone independent review the setup. This project is **not** certified as production-ready or legally compliant.
