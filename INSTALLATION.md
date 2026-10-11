# Installation guide (Windows, no programming experience needed)

Follow every step in order. Type commands exactly as shown. Anything in `code style` is typed or clicked exactly as written.

**What you will do:** install two free programs, create a free online database, run three setup commands, and open the portal in your browser.

Time needed: about 45 minutes the first time.

---

## Step 1 - Download and unzip the project

1. Download `university-eldoret-junior-school-portal.zip`.
2. Open **File Explorer** and go to your **Downloads** folder.
3. Right-click the ZIP file and choose **Extract All...**.
4. Choose a simple location such as `C:\school-portal` and click **Extract**.
5. Open the extracted folder. Inside it you should see `package.json`, `server.js`, and folders named `public`, `src` and `docs`. (If you see only one more folder with the same name inside, open that one - it is the real project folder.)

## Step 2 - Install Node.js

1. Go to **https://nodejs.org**.
2. Click the button labelled **LTS** (the recommended version) and run the installer.
3. Keep clicking **Next** and accept the defaults. Finish the installer.
4. Restart your computer if the installer asks you to.

## Step 3 - Install Visual Studio Code

1. Go to **https://code.visualstudio.com** and click **Download for Windows**.
2. Run the installer. Tick **Add to PATH** if you see it. Click **Next** until it finishes.

## Step 4 - Open the project in VS Code

1. Open **Visual Studio Code**.
2. Click **File > Open Folder...**.
3. Select the project folder from Step 1 (the one that contains `package.json`) and click **Select Folder**.
4. If VS Code asks "Do you trust the authors?", click **Yes, I trust the authors**.

## Step 5 - Open the terminal inside VS Code

1. Click **Terminal > New Terminal** in the top menu. A panel opens at the bottom.
2. Check that the terminal path ends with your project folder name.
3. Type this and press **Enter** to check Node.js is installed:

```
node -v
```

You should see a version number such as `v22.x.x`. If you see "not recognized", close VS Code, reopen it and try again (or restart the computer).

**If you later see a red message saying "running scripts is disabled on this system":** in the terminal panel click the small arrow next to the **+** button, choose **Command Prompt**, and run the commands there instead. (See `TROUBLESHOOTING.md` for the permanent fix.)

## Step 6 - Create a free Supabase database

Supabase hosts the PostgreSQL database for free. (Free limits as published when this guide was prepared: 2 projects, 500 MB database each, and **a free project is paused after about one week without activity**. Check https://supabase.com/pricing for current terms.)

1. Go to **https://supabase.com** and click **Start your project**. Sign up (GitHub or e-mail).
2. Click **New project**.
3. Choose an organisation, give the project a name such as `uejs-portal`.
4. **Database password:** click **Generate a password**, then **copy it and save it somewhere safe** (you cannot see it again). Prefer a password that uses only letters and numbers - symbols such as `@ # / ?` can break the connection string.
5. Choose the **Region** closest to Kenya that is offered in the list.
6. Click **Create new project** and wait a few minutes until it finishes setting up.
7. At the top of the project page click **Connect**.
8. Choose the **Session pooler** connection string (type **URI**). Use the pooler string, not the "Direct connection": the direct one needs IPv6 and often fails on home networks.
9. Copy the string. It looks like `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-xxxx.pooler.supabase.com:5432/postgres`.
10. Replace `[YOUR-PASSWORD]` (including the square brackets) with the database password you saved.

> The Supabase screens change from time to time. If a button has moved, look for "Connect" or "Database settings > Connection string".

**Keep this string private.** It gives full access to all school data.

## Step 7 - Install the project's dependencies

In the VS Code terminal type:

```
npm install
```

Wait until it finishes (1-3 minutes). Warnings in yellow are normal; red errors are not (see `TROUBLESHOOTING.md`). This also creates `package-lock.json`.

## Step 8 - Create and fill in your `.env` file

1. In the terminal type:

```
npm run init
```

2. In VS Code's left panel click the file named `.env` (if you cannot see it, click the refresh icon above the file list).
3. Find the line `DATABASE_URL=PASTE_YOUR_SUPABASE_CONNECTION_STRING_HERE`.
4. Replace everything after the `=` with your connection string from Step 6.
5. Do not add spaces or quotes. Press **Ctrl + S** to save.

Leave the other lines as they are. `SESSION_SECRET` was generated for you automatically.

## Step 9 - Create the database tables

```
npm run setup-db
```

You should see `Applying: 001_initial_schema.sql` and `Database is ready.` If you see `[DATABASE SETUP FAILED]`, read the message and `TROUBLESHOOTING.md`.

## Step 10 - Create the first administrator

```
npm run create-admin
```

Type a full name, a username (for example `admin.eldoret`), then a strong password (at least 10 characters with an uppercase letter, a lowercase letter and a number). The password does not show while you type; that is normal. No default password exists anywhere in the project - this is the only way the first administrator is created.

## Step 11 - Start the server

```
npm start
```

You should see `Database connection: OK` and the address. Leave this terminal open while you use the portal. To stop it press **Ctrl + C**.

## Step 12 - Open the portal

Open your browser and go to:

**http://localhost:3000**

Click **Sign in** and use the administrator username and password from Step 10.

---

## First things to do after signing in

1. **Classes and subjects > Years and terms:** add the academic year and its terms with the school's real dates and make them current.
2. **Classes and subjects > Classes:** add the classes for Grades 7, 8 and 9.
3. **Classes and subjects > Subjects:** add the subjects taught.
4. **Teachers and staff:** add teachers and the finance officer. Copy each temporary password (shown once) and give it to the person securely. They must change it at first sign-in.
5. **Classes and subjects > Teacher assignments:** assign teachers to class subjects; set class teachers under Classes.
6. **Assessments > Grading scales:** replace the sample grading bands with the school's official ones.
7. **Students:** register learners, add guardians and create parent logins.
8. Edit `src/config/school.js` and replace every `[EDIT: ...]` with official school details, then restart the server.

## Optional: try it with fictional demo data

Only on a **brand-new, empty database** (before step 1 above):

```
npm run seed-demo
```

It prints four demo logins (teacher, finance, parent, student) with random passwords - copy them from the terminal. Demo learners are called "... Demo". Do not use demo data in a live system. To remove it, create a fresh Supabase project (or ask a developer to reset the tables).

## Testing each module

Use `tests/README.md` - a step-by-step checklist for every module and every role.

## Running it again another day

1. Open VS Code, **File > Open Recent**, choose the project.
2. **Terminal > New Terminal**, type `npm start`.
3. Browse to http://localhost:3000.

If Supabase says your project is paused, open the Supabase dashboard and click **Restore project**, wait a few minutes, then try again.

## Publishing online

See `DEPLOYMENT.md`.
