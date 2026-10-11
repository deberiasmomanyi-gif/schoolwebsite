'use strict';
// Static checks (no database needed): required files exist, HTML links/scripts/styles resolve,
// every JavaScript file has valid syntax, and every /api/... URL used by the browser code has a matching server route.
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const root = path.join(__dirname, '..'); let problems = 0;
const bad = (m) => { problems += 1; console.error('PROBLEM: ' + m); };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (['node_modules', '.git'].includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const all = walk(root);

for (const f of ['package.json', 'server.js', '.env.example', '.gitignore', 'README.md', 'LICENSE', 'database/schema.sql', 'database/seed-demo.sql', 'docs/INSTALLATION.md']) if (!fs.existsSync(path.join(root, f))) bad('missing file ' + f);
for (const f of all) if (/\.(js|html|css|sql|md|json)$/.test(f) && fs.statSync(f).size < 20) bad('file is empty: ' + path.relative(root, f));

for (const f of all.filter((x) => x.endsWith('.js'))) { const r = spawnSync(process.execPath, ['--check', f]); if (r.status !== 0) bad('syntax error in ' + path.relative(root, f) + '\n' + r.stderr); }

const pages = all.filter((f) => f.startsWith(path.join(root, 'public')) && f.endsWith('.html'));
const pageSet = new Set(pages.map((p) => '/' + path.relative(path.join(root, 'public'), p).replace(/\\/g, '/')));
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const u = m[1]; if (/^(https?:|mailto:|tel:)/.test(u)) continue;
    if (u.startsWith('/vendor/')) continue; // served from node_modules at run time
    const target = u === '/' ? '/index.html' : u;
    if (!target.startsWith('/')) { bad(path.basename(p) + ': relative link ' + u); continue; }
    if (!fs.existsSync(path.join(root, 'public', target))) bad(path.basename(p) + ' references missing ' + u);
  }
  for (const m of html.matchAll(/\son\w+=/g)) bad(path.basename(p) + ' has an inline event handler (blocked by CSP): ' + m[0]);
}
// links created by the browser scripts
for (const f of all.filter((x) => x.startsWith(path.join(root, 'public', 'js')))) {
  const js = fs.readFileSync(f, 'utf8');
  for (const m of js.matchAll(/['"`](\/[a-z-]+\.html)/g)) if (!pageSet.has(m[1])) bad(path.basename(f) + ' links to missing page ' + m[1]);
}

// API cross-check
const mounts = {}; for (const m of fs.readFileSync(path.join(root, 'server.js'), 'utf8').matchAll(/app\.use\('(\/api\/[a-z]+)',\s*require\('\.\/src\/routes\/([a-z]+)'\)\)/g)) mounts[m[1]] = m[2];
const routes = [];
for (const [base, file] of Object.entries(mounts)) {
  const src = fs.readFileSync(path.join(root, 'src', 'routes', file + '.js'), 'utf8');
  for (const m of src.matchAll(/router\.(get|post|put|delete)\('([^']*)'/g)) routes.push({ method: m[1].toUpperCase(), re: new RegExp('^' + (base + (m[2] === '/' ? '' : m[2])).replace(/:[A-Za-z]+/g, '[^/]+').replace(/\./g, '\\.') + '$') });
}
const calls = [];
for (const f of all.filter((x) => x.startsWith(path.join(root, 'public', 'js')))) {
  const js = fs.readFileSync(f, 'utf8');
  for (const m of js.matchAll(/App\.(get|post|put|del)\(\s*(['"`])(\/api\/[^'"`]*)\2|App\.api\(\s*'(GET|POST|PUT|DELETE)',\s*(['"`])(\/api\/[^'"`]*)\5/g)) {
    const method = m[1] ? { get: 'GET', post: 'POST', put: 'PUT', del: 'DELETE' }[m[1]] : m[4]; const url = (m[3] || m[6]).split('?')[0].replace(/\$\{[^}]*\}/g, 'X').replace(/\/$/, '/X');
    calls.push({ method, url, file: path.basename(f) });
  }
}
for (const c of calls) if (!routes.some((r) => r.method === c.method && r.re.test(c.url))) bad(`${c.file}: ${c.method} ${c.url} has no matching server route`);
console.log(`Checked ${all.length} files, ${pages.length} pages, ${routes.length} server routes, ${calls.length} browser API calls.`);
console.log(problems ? `${problems} problem(s) found.` : 'All static checks passed.');
process.exit(problems ? 1 : 0);
