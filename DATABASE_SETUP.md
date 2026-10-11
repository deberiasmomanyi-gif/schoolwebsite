# Database setup

## How the database is used

* Database: **PostgreSQL on Supabase**.
* The Node.js server connects with the private **connection string** (`DATABASE_URL`). The browser never talks to the database and never receives any key.
* Login accounts are stored in the application's own `users` table (bcrypt password hashes). Supabase Auth is **not** used, so there is no separate Supabase user table to keep in sync. Every person-related record (staff, student, guardian) references `users.id`.

## Creating the tables

Recommended (automatic): `npm run setup-db`. It runs every file in `database/migrations/` that has not run yet and records it in a `schema_migrations` table.

Manual alternative: open Supabase **SQL Editor > New query**, paste the whole of `database/schema.sql`, and click **Run**. (`schema.sql` is a copy of `migrations/001_initial_schema.sql`.) Do not run it twice.

## Tables

| Group | Tables |
|---|---|
| Accounts | `users`, `staff`, `guardians`, `guardian_students` (parent-student links) |
| Structure | `academic_years`, `terms`, `grades`, `classes`, `subjects`, `teaching_assignments` |
| Learners | `students`, `enrolments` (one per learner per academic year) |
| Attendance | `attendance_sessions` (unique per class and date), `attendance_records` (unique per session and learner) |
| Assessment | `grading_scales`, `grading_scale_bands`, `assessments`, `assessment_results` |
| Fees | `fee_charges`, `payments` (receipt numbers from a sequence) |
| Timetable | `timetable_slots` |
| Communication | `announcements`, `notifications` |
| Security | `audit_logs`, `session` (login sessions) |

## Rules enforced by the database itself

* Unique admission numbers, usernames, receipt numbers, one register per class per day, one result per learner per assessment.
* A score cannot exceed the assessment's maximum marks, and results of an **approved** assessment cannot be inserted or changed (trigger `enforce_result_rules`).
* An approved assessment's class, subject, term and maximum marks cannot be changed.
* A teacher or a room cannot be booked twice in the same period (unique indexes on `timetable_slots`).
* Only one current academic year, one current term and one active grading scale can exist.
* Amounts must be positive; statuses and roles must be from the allowed lists.
* Payments, charges and results are voided/locked rather than deleted; learners are archived rather than deleted.

## Row Level Security and least privilege (important)

RLS is enabled on **every** table with **no policies**, and all privileges are revoked from Supabase's `anon` and `authenticated` roles. Result: anyone holding your project's public (anon) key, or calling Supabase's auto-generated REST API, can read and write **nothing**.

Per-role rules (a teacher sees only assigned classes, a parent only linked children, finance only fee data, and so on) are enforced **in the Node.js server** for every request (see `src/services/access.js` and `src/config/permissions.js`). This is deliberate: the app connects as the database owner role, which bypasses RLS, so RLS policies written for individual roles would not be what actually protects the data in this architecture. The honest summary is:

* **Database layer:** blocks all public access and enforces data-integrity rules (above).
* **Server layer:** enforces who may see or change what.

If you later add direct browser-to-Supabase access, you must write proper per-role RLS policies first. Never expose the service-role key.

Optional hardening: create a dedicated PostgreSQL role for the app with only the privileges it needs (SELECT/INSERT/UPDATE/DELETE on these tables, USAGE on the sequences) and use its connection string. Have a developer review this before relying on it.

## Adding future changes

Create `database/migrations/002_<description>.sql`, add `alter table ... enable row level security;` for any new table, and run `npm run setup-db`.

## Backups and restoring

* Free Supabase projects may not include downloadable automatic backups - check your plan in the Supabase dashboard (Database > Backups) and https://supabase.com/pricing.
* **Quick safety copy:** `npm run backup` writes every table as JSON into `backups/` (excluded from Git). It contains personal data and password hashes: keep it on an encrypted drive.
* **Proper backup:** install the PostgreSQL client tools and run (replace the connection string):
  `pg_dump "YOUR_SESSION_POOLER_URL" --no-owner --format=custom --file=uejs-backup.dump`
* **Restore:** into a fresh Supabase project: `pg_restore --no-owner --dbname="NEW_URL" uejs-backup.dump`. Test a restore at least once **before** you rely on backups.
* Schedule: at least weekly during term, and before every term start, year end or bulk change.
