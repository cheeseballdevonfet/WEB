// Ship-ready checks (WEB.md) for one page, default the home page.
//   node tools/ship.js [--page /] [--out DIR] [--widths 390,768,1440]
// Runs the page from preview/ (file://) and from dist/ over a local http server, both under
// 4x CPU slowdown and slow 4G, and reports each check as pass/fail with its number:
//   LCP (time, element, must be text), CLS (load, then a full wheel scroll, a pointer tear and the
//   keyboard tear), tear fps and input-to-frame latency, worst event duration, AA contrast of every
//   visible text run, overflow, one h1 + landmarks, keyboard (every stop has a visible focus style),
//   reduced motion (still poster, demos at their final state, no running animations),
//   no JS (every section readable, form posts to mailto:), errors and blocked requests.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { chromium, SITE, OUTROOT, SIZES, pages, fileUrl, serve, open, wheelTo, AUDIT } = require('./lib');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PAGE = arg('page', '/');
const OUT = path.resolve(arg('out', path.join(os.tmpdir(), 'elvana-ship')));
const WIDTHS = arg('widths', '390,768,1440').split(',').map(Number);

const VITALS = () => {
  window.__cls = 0; window.__lcp = null; window.__evt = 0; window.__shifts = [];
  new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push([+e.value.toFixed(5), (e.sources || []).map(x => x.node && (x.node.className || x.node.nodeName)).join('|')]); } })).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => l.getEntries().forEach(e => { window.__lcp = { t: Math.round(e.startTime), tag: e.element ? e.element.tagName : null, text: e.element ? (e.element.textContent || '').trim().slice(0, 40) : '', url: e.url || '' }; })).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.interactionId && e.duration > window.__evt) { window.__evt = e.duration; window.__evtName = e.name; } })).observe({ type: 'event', buffered: true, durationThreshold: 16 });
};

async function throttle(ctx, page, net) {
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  if (net) {
    await cdp.send('Network.enable');
    // "Slow 4G" (Lighthouse mobile): 150 ms RTT, 1.6 Mbps down, 750 kbps up
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  }
  return cdp;
}

async function keyboard(page) {
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); });
  const stops = [];
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const e = document.activeElement; if (!e || e === document.body) return null;
      if (e.dataset.kbi) return 'wrap'; e.dataset.kbi = '1';
      const cs = getComputedStyle(e), r = e.getBoundingClientRect();
      const within = e.closest('.flyer'); const wcs = within && getComputedStyle(within);
      const vis = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || cs.boxShadow !== 'none' || (wcs && wcs.outlineStyle !== 'none' && parseFloat(wcs.outlineWidth) >= 2);
      return { k: e.tagName + ':' + (e.textContent || e.name || '').trim().slice(0, 22), vis, onscreen: r.bottom > 0 && r.top < innerHeight && r.width > 0 };
    });
    if (!f || f === 'wrap') break; stops.push(f);
  }
  return { stops: stops.length, noVisibleFocus: stops.filter(s => !s.vis).map(s => s.k), offscreen: stops.filter(s => !s.onscreen).map(s => s.k) };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const meta = pages().find(p => p.path === PAGE);
  if (!meta) throw new Error('no page ' + PAGE);
  const { srv, origin } = await serve(path.join(OUTROOT, 'dist'));
  const browser = await chromium.launch();
  const report = { page: PAGE, runs: {} };
  const targets = [['preview', fileUrl('preview', meta.out), false], ['dist-http', origin + PAGE.replace(/index\.html$/, ''), true]];
  for (const [label, url, net] of targets) {
    for (const w of WIDTHS) {
      const r = {};
      // ---- throttled load, vitals, interaction ----
      const { ctx, page, log } = await open(browser, url, w, { init: VITALS, settle: 2500, before: async (c, p) => { r._cdp = await throttle(c, p, net); } });
      r.lcp = await page.evaluate(() => window.__lcp);
      r.clsLoad = +(await page.evaluate(() => window.__cls)).toFixed(4);
      const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      for (let y = 0; y <= H; y += 700) { await page.mouse.wheel(0, 700); await page.waitForTimeout(50); }
      await wheelTo(page, 0); await page.waitForTimeout(800);
      const hasHero = await page.evaluate(() => !!document.querySelector('.hero [class*="tear"]') && document.documentElement.classList.contains('motion'));
      if (hasHero) {
        const b = await page.evaluate(() => { const e = document.querySelector('.hero').getBoundingClientRect(); return { x: e.left, y: e.top, w: e.width, h: e.height }; });
        if (SIZES[w].touch) {
          // a horizontal swipe from the right edge, as a finger would
          const cdp = r._cdp, y0 = b.y + b.h * .55;
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.w - 20, y: y0 }] });
          for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: b.x + b.w - 20 - b.w * .06 * i, y: y0 + i }] });
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        } else {
          await page.mouse.move(b.x + b.w * .5, b.y + b.h - 16); await page.mouse.down();
          for (let i = 1; i <= 14; i++) await page.mouse.move(b.x + b.w * .5, b.y + b.h - 16 - b.h * .05 * i);
          await page.mouse.up();
        }
        await page.waitForTimeout(700);
        r.tornByPointer = await page.evaluate(() => document.querySelectorAll('#tear-clip path').length);
        r.tearFps = await page.evaluate(async () => { let n = 0; const t = performance.now(); await new Promise(res => { const f = () => { n++; performance.now() - t < 1000 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); document.getElementById('tear-btn').click(); }); return n; });
        r.btnToFrameMs = +(await page.evaluate(async () => { const b = document.getElementById('tear-btn'); const t = performance.now(); b.click(); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); return performance.now() - t; })).toFixed(1);
        await page.waitForTimeout(1500);
      }
      r.clsTotal = +(await page.evaluate(() => window.__cls)).toFixed(4);
      r.shifts = await page.evaluate(() => window.__shifts.slice(0, 5));
      r.maxEventMs = await page.evaluate(() => Math.round(window.__evt) + ' ' + (window.__evtName || ''));
      await r._cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); delete r._cdp;
      await wheelTo(page, 0);
      r.audit = await page.evaluate(AUDIT);
      r.keyboard = await keyboard(page);
      r.errors = log.errors; r.blocked = log.blocked;
      await page.screenshot({ path: path.join(OUT, `${label}-${w}-after.png`) });
      await ctx.close();

      // ---- reduced motion ----
      {
        const { ctx, page, log } = await open(browser, url, w, { reducedMotion: 'reduce', settle: 600 });
        await wheelTo(page, 99999); await wheelTo(page, 0);
        r.reduced = await page.evaluate(() => {
          const cls = document.documentElement.className;
          const under = document.querySelector('.sheet-under');
          const running = document.getAnimations().filter(a => a.playState === 'running').map(a => (a.animationName || a.constructor.name) + ':' + (a.effect && a.effect.target && a.effect.target.className));
          const hidden = [...document.querySelectorAll('.ln,.cells i,.bars i')].filter(e => { const cs = getComputedStyle(e); return +cs.opacity < 1 || cs.clipPath !== 'none' && cs.clipPath.includes('100%'); }).length;
          return { htmlClass: cls, stillClip: under ? getComputedStyle(under).clipPath : null, running, demoPartsHidden: hidden, slowmoVisible: !!document.querySelector('#slowmo') && getComputedStyle(document.querySelector('#slowmo')).display !== 'none' };
        });
        r.reduced.errors = log.errors;
        await page.screenshot({ path: path.join(OUT, `${label}-${w}-reduced.png`) });
        await ctx.close();
      }
      // ---- no JS ----
      {
        const { ctx, page, log } = await open(browser, url, w, { js: false, settle: 400 });
        r.noJs = await page.evaluate(() => {
          const secs = [...document.querySelectorAll('main section, footer')];
          const invisible = secs.filter(s => { const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); return !r.height || cs.visibility === 'hidden' || +cs.opacity === 0; }).map(s => s.id || s.className);
          const h1 = document.querySelector('h1'); const hr = h1.getBoundingClientRect();
          const form = document.querySelector('form[data-mailto-form]');
          const hiddenText = [...document.querySelectorAll('.ln')].filter(e => +getComputedStyle(e).opacity < 1).length;
          return { htmlClass: document.documentElement.className, sections: secs.length, invisible, h1Visible: hr.height > 0 && hr.top < innerHeight, form: form ? form.getAttribute('action') : null, hiddenText, textChars: document.body.innerText.length };
        });
        r.noJs.errors = log.errors;
        await page.screenshot({ path: path.join(OUT, `${label}-${w}-nojs.png`) });
        await ctx.close();
      }
      // ---- verdicts ----
      const a = r.audit, k = r.keyboard;
      const lcpText = r.lcp && r.lcp.tag && !/^(IMG|IMAGE|VIDEO|CANVAS|svg)$/i.test(r.lcp.tag) && !r.lcp.url;
      r.verdict = {
        'LCP is text, < 2.5 s': [lcpText && r.lcp.t < 2500, r.lcp ? `${r.lcp.t} ms ${r.lcp.tag} "${r.lcp.text}"` : 'none'],
        'CLS < 0.01': [r.clsTotal < 0.01, `load ${r.clsLoad}, after scroll + tear ${r.clsTotal}`],
        'interaction < 200 ms': [!hasHero || (r.btnToFrameMs < 200 && parseInt(r.maxEventMs) < 200), hasHero ? `button to frame ${r.btnToFrameMs} ms, worst event ${r.maxEventMs}, tear ${r.tearFps} fps, pointer strips ${r.tornByPointer}` : 'no hero'],
        'AA contrast (computed)': [a.contrastFails.length === 0, `${a.contrastChecked} text runs, ${a.contrastFails.length} below AA`],
        'no horizontal scroll / overflow': [a.hscroll <= 0 && !a.overflow.length && !a.clipped.length, `hscroll ${a.hscroll}, overflow ${a.overflow.length}, clipped ${a.clipped.length}`],
        'one h1 + landmarks': [a.h1 === 1 && a.header === 1 && a.main === 1 && a.footer === 1, `h1 ${a.h1}`],
        'keyboard: visible focus on every stop': [k.noVisibleFocus.length === 0 && k.stops > 5, `${k.stops} stops, ${k.noVisibleFocus.length} without visible focus`],
        'reduced motion: still, finished': [!/\bmotion\b/.test(r.reduced.htmlClass) && r.reduced.running.length === 0 && r.reduced.demoPartsHidden === 0 && !r.reduced.slowmoVisible && !r.reduced.errors.length, `class "${r.reduced.htmlClass}", running ${r.reduced.running.length}, hidden demo parts ${r.reduced.demoPartsHidden}`],
        'no JS: content readable': [r.noJs.htmlClass === 'no-js' && r.noJs.invisible.length === 0 && r.noJs.h1Visible && r.noJs.hiddenText === 0 && !r.noJs.errors.length, `${r.noJs.sections} sections visible, form action ${r.noJs.form}, ${r.noJs.textChars} chars`],
        'no errors, no external requests': [!r.errors.length && !r.blocked.length, `${r.errors.length} errors, ${r.blocked.length} blocked`],
      };
      report.runs[`${label} ${w}`] = r;
      console.log(`\n${label} @ ${w}`);
      for (const [name, [ok, detail]] of Object.entries(r.verdict)) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(38)} ${detail}`);
    }
  }
  // ---- site-wide pieces over http (cross-document View Transitions need a real origin) ----
  {
    const { ctx, page, log } = await open(browser, origin + '/', 1440, {
      init: () => { addEventListener('pagereveal', e => { const v = e.viewTransition; window.__vt = v ? { t0: performance.now(), types: v.types ? [...v.types] : [] } : null;
        if (v) v.finished.then(() => { window.__vt.ms = Math.round(performance.now() - window.__vt.t0); window.__vt.types = v.types ? [...v.types] : []; }); }); },
    });
    const sw = {};
    // rubber stamp: a primary tag gets the ink ring
    sw.stamp = await page.evaluate(() => { const t = document.querySelector('.snipe .tag:not(.tag-line)'); t.addEventListener('click', e => e.preventDefault(), { once: true }); t.click(); return t.classList.contains('is-stamped'); });
    // sound toggle: off by default, toggles, synthesises without errors
    sw.soundDefault = await page.getAttribute('#sound', 'aria-pressed');
    await page.click('#sound'); await page.waitForTimeout(200);
    sw.soundOn = await page.getAttribute('#sound', 'aria-pressed');
    await page.evaluate(() => { Elvana.feedback('rip'); Elvana.feedback('paste'); Elvana.feedback('stamp'); }); await page.waitForTimeout(400);
    await page.click('#sound');
    // paste-over forward, then peel-off on Back
    await page.click('.nav-main a[href*="services"]'); await page.waitForURL('**/services/**'); await page.waitForTimeout(900);
    sw.forward = await page.evaluate(() => window.__vt);
    await page.goBack(); await page.waitForTimeout(900);
    sw.back = await page.evaluate(() => window.__vt);
    sw.errors = log.errors;
    await ctx.close();
    report.siteWide = sw;
    const ok = sw.stamp && sw.soundDefault === 'false' && sw.soundOn === 'true' && sw.forward && sw.forward.ms < 600 && sw.forward.types.includes('paste') && sw.back && sw.back.ms < 600 && sw.back.types.includes('peel') && !sw.errors.length;
    console.log(`\nsite-wide pieces (dist over http)\n  ${ok ? 'PASS' : 'FAIL'}  stamp ring ${sw.stamp}, sound default ${sw.soundDefault} -> ${sw.soundOn}, paste-over ${JSON.stringify(sw.forward)}, back ${JSON.stringify(sw.back)}, errors ${sw.errors.length}`);
    report.runs['site-wide'] = { verdict: { 'stamp, sound toggle, page transitions < 600 ms': [ok, ''] } };
  }
  fs.writeFileSync(path.join(OUT, 'ship.json'), JSON.stringify(report, null, 1));
  const fails = Object.values(report.runs).flatMap(r => Object.values(r.verdict)).filter(v => !v[0]).length;
  console.log(`\n${fails ? fails + ' FAILED checks' : 'all checks pass'}. Report: ${path.join(OUT, 'ship.json')}`);
  await browser.close(); srv.close();
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
