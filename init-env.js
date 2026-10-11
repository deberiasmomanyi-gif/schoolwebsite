'use strict';
// Creates the .env file for you and generates a strong SESSION_SECRET automatically.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const root = path.join(__dirname, '..');
const target = path.join(root, '.env');
if (fs.existsSync(target)) { console.log('.env already exists - leaving it unchanged.'); process.exit(0); }
let text = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
text = text.replace('PASTE_A_LONG_RANDOM_TEXT_HERE', crypto.randomBytes(48).toString('hex'));
fs.writeFileSync(target, text);
console.log('\nCreated the .env file with a new SESSION_SECRET.');
console.log('NEXT: open .env in Visual Studio Code and replace the DATABASE_URL line with your Supabase connection string.\n');
