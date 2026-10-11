# Security checklist

Tick every item and write the date and the person who verified it. Items marked (code) are implemented in this project but **were not verified against a running system by the author** - verify them.

## Authentication and sessions
- [ ] (code) Passwords hashed with bcrypt (cost 12); minimum policy enforced; temporary passwords force a change.
- [ ] (code) Login rate limit (20 per 15 minutes per address) and account lockout (5 failures, 15 minutes). Verify both.
- [ ] (code) Session id regenerated on login; other sessions revoked on password change/reset/deactivation.
- [ ] (code) Cookie `uejs.sid` is HttpOnly, SameSite=Lax, Secure when `NODE_ENV=production`. Verify in the browser (F12 > Application > Cookies) on the live HTTPS site.
- [ ] No default administrator password exists anywhere in the code (`create-admin` prompts).

## Authorization
- [ ] (code) Every API route uses `can('<permission>')` or `requireAuth`; permission table in `src/config/permissions.js` is covered by `npm test`.
- [ ] (code) Teachers are limited to assigned classes/subjects in attendance, assessments, results and student lists.
- [ ] (code) Parents/students are limited to linked learners (`router.param('id')` in `src/routes/portal.js`); receipts must belong to that learner.
- [ ] (code) Nobody can assign a role above their own or change their own role.
- [ ] Run the "Authorization attacks" tests in `tests/README.md`.

## Input and output
- [ ] (code) Server-side validation with Zod on every write; unknown fields are dropped.
- [ ] (code) All user-supplied values reach SQL only as parameters ($1, $2...); the few dynamically assembled SQL fragments (filters, ordering) are built from fixed strings in the code. Re-read any new query that uses `${...}` before each release.
- [ ] (code) Browser code uses `textContent`/DOM APIs, never `innerHTML` with data. Search: `grep -rn innerHTML public/js` returns nothing.
- [ ] (code) CSV export neutralises spreadsheet formulas.

## Web protections
- [ ] (code) Helmet headers and a strict Content-Security-Policy (scripts/styles only from this site). Verify there are no CSP errors in the browser console.
- [ ] (code) CSRF token required on every POST/PUT/DELETE.
- [ ] HTTPS enforced on the live site; HSTS active in production.
- [ ] Error responses show no stack traces or secrets (trigger an error and read the response).

## Data and infrastructure
- [ ] (code) RLS enabled on all tables, no policies; anon/authenticated privileges revoked. In Supabase confirm each table shows "RLS enabled" and that the anon key cannot read tables.
- [ ] `.env` is not in Git (check the repository on github.com). `.env.example` has no real secrets.
- [ ] Production uses its own database and its own `SESSION_SECRET`.
- [ ] Backups configured and a restore has been tested.
- [ ] `npm audit` reviewed; dependencies updated before go-live and regularly afterwards.
- [ ] Audit log is reviewed periodically (Dashboard > Recent activity).

## Process
- [ ] Privacy checklist completed (`docs/PRIVACY_CHECKLIST.md`).
- [ ] Staff trained: no password sharing, sign out on shared computers.
- [ ] Independent security review performed before real learner data is loaded.
