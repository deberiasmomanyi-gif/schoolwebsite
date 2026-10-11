# Troubleshooting

| Message or problem | What it means and what to do |
|---|---|
| `'node' is not recognized` | Node.js is not installed or the terminal was opened before installing. Install Node.js (LTS), then close and reopen VS Code. |
| `npm.ps1 cannot be loaded because running scripts is disabled` | PowerShell blocks npm. Either switch the terminal to **Command Prompt** (arrow next to the + button), or run once in PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` and answer `Y`. |
| `Cannot find module 'express'` (or any module) | Dependencies are not installed. Run `npm install` in the project folder (the one containing `package.json`). |
| `npm ERR! ENOENT ... package.json` | You are in the wrong folder. In VS Code open the folder that directly contains `package.json`. |
| `[CONFIGURATION ERROR] DATABASE_URL is missing or still has placeholder text` | Edit `.env`: paste your connection string and remove `[YOUR-PASSWORD]` including the brackets. Save with Ctrl+S. |
| `DATABASE_URL is not a valid connection string` | The password probably contains symbols like `@ # / ? :`. In Supabase reset the database password to letters and numbers only and update `.env`. |
| `ENOTFOUND` / `ETIMEDOUT` / `ECONNREFUSED` when connecting | Wrong host or no internet, or you used the *Direct connection* string. Use the **Session pooler** string. Check your internet connection. |
| `password authentication failed` | Wrong database password in `DATABASE_URL`. Reset it in Supabase (Database settings) and paste it again. |
| `Tenant or user not found` | The pooler string is incomplete or the project reference is wrong. Copy it again from Supabase > Connect. |
| Supabase project is "paused" | Free projects pause after about a week of inactivity. Open the Supabase dashboard and click **Restore project**. |
| `relation "users" does not exist` | The tables were not created. Run `npm run setup-db`. |
| `already exists` during setup | The schema was already applied (for example pasted manually into the SQL Editor). Do not run it twice. |
| `EADDRINUSE: address already in use :::3000` | Another program (or an earlier run of this one) is using the port. Close the other terminal (Ctrl+C) or change `PORT=3001` in `.env` and browse to port 3001. |
| Login says "Security check failed. Please refresh" | Your page was open a long time or cookies are blocked. Refresh the page and try again. Make sure cookies are allowed for the site. |
| Login works locally but you are signed out again on the live site | `NODE_ENV=production` needs HTTPS. Use the `https://` address. Make sure `DATABASE_URL` works so sessions can be stored. |
| "Too many sign-in attempts" | The limiter allows 20 attempts per 15 minutes per address. Wait 15 minutes. A locked account unlocks after 15 minutes or when an administrator resets the password. |
| Charts do not appear | Run `npm install` again (Chart.js is served from `node_modules`). Hard-refresh the page (Ctrl+F5). |
| Demo seed says "Demo data can only be loaded when no academic year exists" | The database already has data. Seeding is only for empty databases. |
| `create-admin` says a Super Administrator already exists | Sign in with that account and create other administrators from **Teachers and staff**. If the password is lost, a developer must reset it directly in the database. |
| Page is blank / "Loading..." forever | Open the browser's developer tools (F12) > Console and look for the error; check the terminal running `npm start` for `[ERROR]` lines. |
| Pages look unstyled | The server is not running, or you opened the HTML file directly from the folder. Always use http://localhost:3000. |

Still stuck? Copy the **exact** error text from the terminal (remove any passwords or connection strings first) when asking for help.
