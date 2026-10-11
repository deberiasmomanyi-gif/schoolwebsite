'use strict';
// Creates the first Super Administrator. The password is typed by you and hidden; nothing is stored in the code.
const readline = require('readline');
require('../src/config/env');
const { pool } = require('../src/config/db');
const { hash } = require('../src/services/password');
const { passwordProblems } = require('../src/services/passwordPolicy');

function ask(question, hidden) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) { rl._writeToOutput = (s) => { if (s.includes(question)) process.stdout.write(s); else if (/\r|\n/.test(s)) process.stdout.write(s); else process.stdout.write('*'); }; }
    rl.question(question, (a) => { rl.close(); resolve(a.trim()); });
  });
}
(async () => {
  try {
    const existing = (await pool.query("select count(*)::int as n from users where role = 'super_admin'")).rows[0].n;
    if (existing > 0) { console.log('A Super Administrator already exists. Use that account to create other administrators.'); return; }
    console.log('\nCreate the first Super Administrator\n');
    const fullName = await ask('Full name: ');
    const username = (await ask('Username (letters/numbers, e.g. admin.name): ')).toLowerCase();
    if (!/^[a-z0-9._@-]{3,64}$/.test(username) || !fullName) throw new Error('Enter a full name and a username of 3-64 letters/numbers.');
    const pw = await ask('Password (min 10 chars, upper+lower case + number): ', true);
    const problems = passwordProblems(pw, username);
    if (problems.length) throw new Error('Password too weak: ' + problems.join(' '));
    const pw2 = await ask('Type the password again: ', true);
    if (pw !== pw2) throw new Error('The two passwords do not match.');
    await pool.query("insert into users (username, full_name, role, password_hash, must_change_password) values ($1,$2,'super_admin',$3,false)", [username, fullName, await hash(pw)]);
    console.log('\nDone. You can now start the server (npm start) and sign in at http://localhost:3000/login.html');
  } catch (e) { console.error('\n' + e.message); process.exitCode = 1; } finally { await pool.end(); }
})();
