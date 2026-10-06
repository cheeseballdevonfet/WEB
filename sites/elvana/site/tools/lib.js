// Shared Playwright helpers for the QA tools. Node 18+, playwright on NODE_PATH.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const SITE = path.resolve(__dirname, '..');
const SIZES = {
  390: { width: 390, height: 844, dsf: 2, touch: true },
  768: { width: 768, height: 1024, dsf: 1, touch: true },
  1440: { width: 1440, height: 900, dsf: 1, touch: false },
};

function pages() {
  const r = JSON.parse(fs.readFileSync(path.join(SITE, 'build-report.json'), 'utf8'));
  return r.pages;
}
function fileUrl(tree, out) { return 'file://' + path.join(SITE, tree, out); }

// Tiny static server (for dist/ over http: font preloads, throttled network)
function serve(root, port = 0) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(root, p);
    if (!f.startsWith(root) || !fs.existsSync(f)) {
      res.writeHead(404, { 'content-type': types['.html'] });
      return res.end(fs.readFileSync(path.join(root, '404.html')));
    }
    res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(ok => srv.listen(port, '127.0.0.1', () => ok({ srv, origin: `http://127.0.0.1:${srv.address().port}` })));
}

// Open a page and log errors and any request that leaves file:/data:/the local server.
async function open(browser, url, w, opts = {}) {
  const s = SIZES[w];
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height }, deviceScaleFactor: opts.dsf || s.dsf, hasTouch: s.touch,
    reducedMotion: opts.reducedMotion || 'no-preference', javaScriptEnabled: opts.js !== false,
  });
  const log = { errors: [], blocked: [], handoffs: [] };
  const local = u => u.startsWith('file:') || u.startsWith('data:') || u.startsWith('http://127.0.0.1');
  await ctx.route('**/*', route => { const u = route.request().url(); if (local(u)) return route.continue(); log.blocked.push(u); return route.abort(); });
  if (opts.init) await ctx.addInitScript(opts.init);
  const page = await ctx.newPage();
  page.on('pageerror', e => log.errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') log.errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => {
    const u = r.url();
    if (/^(mailto|tel):/.test(u)) { log.handoffs.push(u.slice(0, 60)); return; }
    if (!log.blocked.includes(u)) log.errors.push('requestfailed: ' + u + ' ' + (r.failure() || {}).errorText);
  });
  page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/404-probe/')) log.errors.push(`http ${r.status()}: ${r.url()}`); });
  if (opts.before) await opts.before(ctx, page);
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(opts.settle == null ? 400 : opts.settle);
  return { ctx, page, log };
}

// Real scrolling with the wheel, so scroll-driven states fire
async function wheelTo(page, y) {
  for (let i = 0; i < 120; i++) {
    const [cur, max] = await page.evaluate(() => [scrollY, document.documentElement.scrollHeight - innerHeight]);
    const target = Math.min(Math.max(0, y), max), d = target - cur;
    if (Math.abs(d) < 2) break;
    await page.mouse.wheel(0, Math.sign(d) * Math.min(Math.abs(d), 420));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(350);
}
async function wheelToEl(page, sel, offset = 0) {
  const y = await page.evaluate(([s, o]) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY - o : null; }, [sel, offset]);
  if (y != null) await wheelTo(page, y);
  return y != null;
}

// In-page audit: overflow, h1, landmarks, AA contrast of every visible text run.
const AUDIT = () => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const blend = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  function bgOf(el) {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; }
      if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage) && stack.length === 0) return null;
    }
    let col = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) col = blend(stack[i], col);
    return col;
  }
  const fails = []; let checked = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.trim() ? 1 : 2 });
  const seen = new Set();
  while (walker.nextNode()) {
    const el = walker.currentNode.parentElement;
    if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (el.closest('.sr,[aria-hidden="true"],.skip,.tear-canvas')) continue;
    if (el.closest('.sheet-under')) continue;   // only visible through the tear; measured on its own ground below
    const fg = parse(cs.color); const bg = bgOf(el); if (!fg || !bg) continue;
    const c = ratio(blend(fg, bg), bg); checked++;
    const px = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = (px >= 24 || (px >= 18.66 && bold)) ? 3 : 4.5;
    if (c < need) fails.push(`${el.tagName.toLowerCase()}.${(el.className + '').split(' ')[0]} "${el.textContent.trim().slice(0, 30)}" ${c.toFixed(2)} < ${need} (${px}px)`);
  }
  const vw = document.documentElement.clientWidth;
  const over = [];
  document.querySelectorAll('body *').forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.width && (r.right > vw + 1 || r.left < -1)) {
      for (let p = e; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (p !== e && (o === 'hidden' || o === 'clip' || o === 'auto')) return; }
      if (e.closest('.tear-canvas,svg,[aria-hidden="true"]')) return;
      over.push((e.className + '' || e.tagName).slice(0, 40) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
    }
  });
  // text clipped by its own box (words wider than their container)
  const clipped = [];
  document.querySelectorAll('h1,h2,h3,h4,.tag,.num,.en,.foot-map a,.page-hero__line').forEach(e => {
    if (getComputedStyle(e).position === 'absolute') return;
    const p = e.parentElement.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(e); const rr = rg.getBoundingClientRect();
    if (rr.width && rr.right > p.right + 2) clipped.push(e.textContent.trim().slice(0, 30) + ' +' + Math.round(rr.right - p.right));
  });
  return {
    h1: document.querySelectorAll('h1').length, header: document.querySelectorAll('header.hdr').length, main: document.querySelectorAll('main#main').length,
    footer: document.querySelectorAll('footer.foot').length, hscroll: document.documentElement.scrollWidth - innerWidth,
    contrastChecked: checked, contrastFails: fails, overflow: over.slice(0, 12), clipped: clipped.slice(0, 12),
    current: [...document.querySelectorAll('[aria-current]')].map(a => a.getAttribute('aria-current') + ':' + a.textContent.trim().slice(0, 20)),
  };
};

// Contact sheet: an HTML grid of images rendered to one PNG
async function sheet(browser, out, title, items, cols = 3, cellW = 460) {
  const htmlPath = out.replace(/\.png$/, '.html');
  const cells = items.map(it => `<figure><img src="file://${it.img}"><figcaption>${it.label}</figcaption></figure>`).join('');
  fs.writeFileSync(htmlPath, `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#1A1814;color:#F2F3EF;font:600 15px/1.3 sans-serif}h1{font-size:24px;margin:0 0 16px;color:#FFD000}
  main{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:18px 16px;align-items:start}figure{margin:0}img{width:100%;display:block;border:1px solid #444}figcaption{padding-top:6px}</style><h1>${title}</h1><main>${cells}</main>`);
  const p = await browser.newPage({ viewport: { width: cols * (cellW + 16) + 48, height: 800 } });
  await p.goto('file://' + htmlPath); await p.waitForTimeout(300);
  await p.screenshot({ path: out, fullPage: true }); await p.close();
  return out;
}

module.exports = { chromium, SITE, SIZES, pages, fileUrl, serve, open, wheelTo, wheelToEl, AUDIT, sheet };
