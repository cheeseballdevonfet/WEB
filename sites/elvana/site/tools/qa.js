// Site QA: every page, at 390 / 768 / 1440, in dist/ and preview/ (both over file://).
//   node tools/qa.js [--out DIR] [--trees dist,preview] [--shots dist] [--widths 390,768,1440] [--only /,/contact/]
// Per page and width: console/page errors, blocked (non-local) requests, horizontal overflow,
// clipped words, one h1, header/main/footer, AA contrast of every visible text run, aria-current.
// Screenshots (for the --shots tree): viewport shots at top, middle and bottom, reached by real
// wheel scrolling so the paste-on-scroll posters are in their scrolled state. Contact sheets per width.
// Exit code 1 when any check fails.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { chromium, pages, fileUrl, open, wheelTo, AUDIT, sheet } = require('./lib');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'elvana-qa')));
const TREES = arg('trees', 'dist,preview').split(',');
const SHOTS = arg('shots', 'dist');
const WIDTHS = arg('widths', '390,768,1440').split(',').map(Number);
const ONLY = arg('only', '') ? arg('only').split(',') : null;

(async () => {
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  const browser = await chromium.launch();
  const list = pages().filter(p => !ONLY || ONLY.includes(p.path));
  const results = []; let failures = 0;
  for (const tree of TREES) {
    for (const p of list) {
      for (const w of WIDTHS) {
        const { ctx, page, log } = await open(browser, fileUrl(tree, p.out), w);
        const a = await page.evaluate(AUDIT);
        // the phone/tablet menu must open, show every link, and close with Escape
        if (w < 980) {
          await page.click('.menu-btn');
          await page.waitForTimeout(450);
          a.menu = await page.evaluate(() => { const m = document.getElementById('menu'); const r = m.getBoundingClientRect(); return { open: m.matches(':popover-open'), h: Math.round(r.height), links: [...m.querySelectorAll('a')].filter(x => x.getBoundingClientRect().height > 0).length }; });
          await page.keyboard.press('Escape'); await page.waitForTimeout(300);
          a.menu.closes = await page.evaluate(() => !document.getElementById('menu').matches(':popover-open'));
        }
        const shots = [];
        if (tree === SHOTS) {
          const slug = (p.out.replace(/\/?index\.html$/, '').replace(/[\/.]/g, '-') || 'home');
          const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
          await page.waitForTimeout(600);
          for (const [k, y] of [['top', 0], ['mid', H * .5], ['bottom', H]]) {
            await wheelTo(page, y);
            const f = path.join(OUT, 'shots', `${slug}-${w}-${k}.png`);
            await page.screenshot({ path: f }); shots.push(f);
          }
          // overflow can appear after scroll-driven states settle: check again at the bottom
          a.hscrollBottom = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        }
        const fail = [];
        if (log.errors.length) fail.push('errors');
        if (log.blocked.length) fail.push('blocked');
        if (a.hscroll > 0 || (a.hscrollBottom || 0) > 0 || a.overflow.length) fail.push('overflow');
        if (a.clipped.length) fail.push('clipped');
        if (a.h1 !== 1) fail.push('h1');
        if (a.header !== 1 || a.main !== 1 || a.footer !== 1) fail.push('landmarks');
        if (a.contrastFails.length) fail.push('contrast');
        if (a.menu && !(a.menu.open && a.menu.h > 200 && a.menu.links >= 8 && a.menu.closes)) fail.push('menu');
        if (fail.length) failures++;
        results.push({ tree, path: p.path, w, fail, errors: log.errors, blocked: log.blocked, ...a, shots });
        console.log(`${fail.length ? 'FAIL' : 'ok  '} ${tree.padEnd(7)} ${String(w).padEnd(4)} ${p.path}${fail.length ? '  ' + fail.join(',') : ''}`);
        await ctx.close();
      }
    }
  }
  // contact sheets: top / mid / bottom for every page, one sheet per width
  if (TREES.includes(SHOTS)) {
    for (const w of WIDTHS) {
      const items = [];
      for (const r of results.filter(r => r.tree === SHOTS && r.w === w)) r.shots.forEach((img, i) => items.push({ img, label: `${r.path} ${['top', 'middle', 'bottom'][i]}` }));
      const cols = 3, cellW = w === 1440 ? 520 : w === 768 ? 300 : 220;
      await sheet(browser, path.join(OUT, `sheet-${w}.png`), `Elvana site, ${SHOTS}/, ${w}px: top, middle, bottom of every page`, items, cols * (w === 1440 ? 1 : 2), cellW);
    }
  }
  fs.writeFileSync(path.join(OUT, 'qa.json'), JSON.stringify(results, null, 1));
  const n = results.length;
  console.log(`\n${n - failures}/${n} page-width runs clean. Report: ${path.join(OUT, 'qa.json')}`);
  await browser.close();
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
