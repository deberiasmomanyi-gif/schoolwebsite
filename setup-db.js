'use strict';
// Applies every file in database/migrations (in order) that has not been applied yet.
const fs = require('fs'); const path = require('path');
const env = require('../src/config/env');
const { pool } = require('../src/config/db');
(async () => {
  const client = await pool.connect();
  try {
    await client.query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())');
    await client.query('alter table schema_migrations enable row level security');
    const dir = path.join(__dirname, '..', 'database', 'migrations');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    const done = new Set((await client.query('select name from schema_migrations')).rows.map((r) => r.name));
    let applied = 0;
    for (const f of files) {
      if (done.has(f)) { console.log('Already applied: ' + f); continue; }
      console.log('Applying: ' + f);
      try {
        await client.query('BEGIN');
        await client.query(fs.readFileSync(path.join(dir, f), 'utf8'));
        await client.query('insert into schema_migrations (name) values ($1)', [f]);
        await client.query('COMMIT'); applied += 1;
      } catch (e) { await client.query('ROLLBACK'); throw e; }
    }
    console.log(applied ? '\nDatabase is ready.' : '\nDatabase was already up to date.');
    console.log('NEXT: run  npm run create-admin  to create the first administrator.');
  } catch (e) {
    console.error('\n[DATABASE SETUP FAILED] ' + e.message);
    if (/ENOTFOUND|ETIMEDOUT|ECONNREFUSED|password authentication|SASL|tenant|Tenant/i.test(e.message)) console.error('Check DATABASE_URL in .env (see docs/TROUBLESHOOTING.md).');
    process.exitCode = 1;
  } finally { client.release(); await pool.end(); }
})();
void env;
