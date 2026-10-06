// Home vs variation A, side by side, section by section.
//   node tools/compare.js [--out DIR] [--widths 1440,390] [--tree preview]
// Scrolls both pages with the wheel to the same section, screenshots the viewport, and lays
// the pairs out in one sheet per width: A on the left, the site's home on the right.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { chromium, fileUrl, open, wheelTo, wheelToEl, sheet } = require('./lib');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'elvana-compare')));
const WIDTHS = arg('widths', '1440,390').split(',').map(Number);
const TREE = arg('tree', 'preview');
const A_URL = 'file://' + path.resolve(__dirname, '../../a-hoarding/index.html');

// [label, selector in A, selector in the site, offset]
const STOPS = [
  ['First screen at rest', null, null, 0],
  ['Who we are', '#about', '#about', 0],
  ['Create. Connect. Grow.', '#services', '#services', 0],
  ['Core services wall', '.svc-wall', '.flyer-wall', 60],
  ['Beyond digital', '.bill', '.bill', 60],
  ['Our edge (demos playing)', '#edge', '#edge', 0],
  ['Our edge demos', '.edge-grid', '.demo-grid', 70],
  ['How we work', '#process', '#process', 0],
  ['Who we serve', '#sectors', '#sectors', 0],
  ['Work', '#work', '#work', 0],
  ['Engagement models', '#models', '#models', 0],
  ['People', '#people', '#people', 0],
  ['Backing', '.backing', '.backing', 60],
  ['Cities', '#cities', '#cities', 0],
  ['Contact', '#contact', '#contact', 0],
  ['Footer', 'footer', 'footer', 0],
];

(async () => {
  fs.mkdirSync(path.join(OUT, 'pairs'), { recursive: true });
  const browser = await chromium.launch();
  for (const w of WIDTHS) {
    const items = [];
    const runs = [['A', A_URL, 1], ['site', fileUrl(TREE, 'index.html'), 2]];
    const shots = { A: [], site: [] };
    for (const [who, url, col] of runs) {
      const { ctx, page } = await open(browser, url, w, { settle: 1500 });
      for (const [label, selA, selS, off] of STOPS) {
        const sel = who === 'A' ? selA : selS;
        if (sel) { await wheelToEl(page, sel, off); await page.waitForTimeout(label.includes('demo') ? 2600 : 250); }
        else await wheelTo(page, 0);
        const f = path.join(OUT, 'pairs', `${w}-${label.replace(/\W+/g, '-').toLowerCase()}-${who}.png`);
        await page.screenshot({ path: f }); shots[who].push(f);
      }
      await ctx.close();
    }
    STOPS.forEach(([label], i) => {
      items.push({ img: shots.A[i], label: `A: ${label}` });
      items.push({ img: shots.site[i], label: `Site home: ${label}` });
    });
    const out = await sheet(browser, path.join(OUT, `home-vs-A-${w}.png`), `Home vs variation A at ${w}px (A left, site right)`, items, 2, w === 1440 ? 720 : 300);
    console.log('sheet ->', out);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(2); });
