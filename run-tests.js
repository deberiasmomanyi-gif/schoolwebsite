'use strict';
// Runs every tests/*.test.js with Node's built-in test runner (works on Windows, macOS and Linux).
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const dir = path.join(__dirname, '..', 'tests');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.test.js')).map((f) => path.join(dir, f));
const r = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
