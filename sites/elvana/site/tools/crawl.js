// Link crawl of dist/ and preview/ in a real browser (JS off, so only real links count).
//   node tools/crawl.js [--trees dist,preview]
// Starts at index.html and follows every <a href> that stays on the site; also visits every page
// in build-report.json (so 404.html and noindex pages are checked too). Each link must resolve to
// an existing file and, when it has a #fragment, to an element with that id. Reports pages the
// crawl could not reach from the home page. Exit code 1 on any broken link.
const fs = require('fs');
const path = require('path');
const { chromium, SITE, OUTROOT, pages } = require('./lib');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TREES = arg('trees', 'dist,preview').split(',');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  await ctx.route('**/*', r => (r.request().url().startsWith('file:') && r.request().resourceType() === 'document') ? r.continue() : r.abort());
  const page = await ctx.newPage();
  let broken = 0;
  for (const tree of TREES) {
    const root = path.join(OUTROOT, tree);
    const info = new Map();                  // file -> { ids, links }
    const load = async f => {
      if (info.has(f)) return info.get(f);
      if (!fs.existsSync(f)) { info.set(f, null); return null; }
      await page.goto('file://' + f);
      const d = await page.evaluate(() => ({ ids: [...document.querySelectorAll('[id]')].map(e => e.id), links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')) }));
      d.ids = new Set(d.ids); info.set(f, d); return d;
    };
    const resolve = (from, href) => {
      const [p, frag] = href.split('#');
      let f;
      if (!p) f = from;
      else if (p.startsWith('/')) f = path.join(root, p.endsWith('/') ? p + 'index.html' : p);   // 404.html in dist is root-absolute
      else { f = path.resolve(path.dirname(from), p); if (p.endsWith('/') || p === '.' || p === './') f = path.join(f, 'index.html'); }
      return { f, frag: href.includes('#') ? frag : null };
    };
    const queue = [path.join(root, 'index.html')], reached = new Set(queue);
    const all = pages().map(p => path.join(root, p.out));
    let n = 0, linksChecked = 0;
    const visit = async f => {
      const d = await load(f); if (!d) return; n++;
      for (const href of d.links) {
        if (/^(mailto:|tel:|https?:)/.test(href)) continue;
        const { f: t, frag } = resolve(f, href); linksChecked++;
        const td = await load(t);
        if (!td) { broken++; console.log(`BROKEN ${tree}: ${path.relative(root, f)} -> ${href} (no ${path.relative(root, t)})`); continue; }
        if (frag && frag !== 'top' && !td.ids.has(frag)) { broken++; console.log(`BROKEN ${tree}: ${path.relative(root, f)} -> ${href} (no #${frag})`); }
        if (frag === 'top' && !td.ids.has('top')) { broken++; console.log(`BROKEN ${tree}: ${path.relative(root, f)} -> ${href} (no #top)`); }
        if (!reached.has(t)) { reached.add(t); queue.push(t); }
      }
    };
    while (queue.length) await visit(queue.shift());
    const unreached = all.filter(f => !reached.has(f));
    for (const f of unreached) await visit(f);         // still check their links
    console.log(`${tree}: ${n} pages, ${linksChecked} links checked, broken so far ${broken}; not reachable from home: ${unreached.map(f => path.relative(root, f)).join(', ') || 'none'}`);
  }
  await browser.close();
  process.exit(broken ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
