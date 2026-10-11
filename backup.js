'use strict';
// Saves a safety copy of every table (except login sessions) as JSON files in the "backups" folder.
// WARNING: the backup contains personal data and password hashes. Store it securely and never upload it to GitHub.
const fs = require('fs'); const path = require('path');
require('../src/config/env');
const { pool } = require('../src/config/db');
(async () => {
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = path.join(__dirname, '..', 'backups', stamp); fs.mkdirSync(dir, { recursive: true });
    const tables = (await pool.query("select tablename from pg_tables where schemaname = 'public' and tablename <> 'session' order by 1")).rows;
    for (const t of tables) {
      const rows = (await pool.query(`select * from public."${t.tablename}"`)).rows;
      fs.writeFileSync(path.join(dir, t.tablename + '.json'), JSON.stringify(rows, null, 1));
      console.log(`${t.tablename}: ${rows.length} rows`);
    }
    console.log('\nBackup saved in: ' + dir + '\nKeep it private. For a full database backup you can restore, also use pg_dump (see docs/DEPLOYMENT.md).');
  } catch (e) { console.error('Backup failed: ' + e.message); process.exitCode = 1; } finally { await pool.end(); }
})();
