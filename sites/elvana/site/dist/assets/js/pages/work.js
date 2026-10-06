/* =========================================================================
   Elvana Media: pages/work.js. "This space is available" (INTERACTIONS.md).
   The visitor types a brand name; a roller whitewashes the advertise-here
   board, then a sign painter's brush paints the name on, letter by letter,
   in short vertical strokes, the way a painter fills hand-lettering. The
   paint goes on wet (a gloss that dries off) with a hand-painted ink shade.

   Any script: the name is set with the site's sign-painter face (Yatra One
   covers Latin and Devanagari); letters are found by grapheme, so conjuncts
   and matras paint as one letter. Long names wrap to up to four lines.

   Keyboard and touch: the form (Enter or "Paint it on"). Tapping the
   hoarding while it paints finishes it at once; a new name interrupts and
   repaints over the old one. Reduced motion: the finished lettering appears
   at once. No JS: the form takes the name to /contact/. The result is
   announced politely, and the canvas sleeps when the hoarding is off screen.
   ========================================================================= */
(() => {
'use strict';
const root = document.documentElement;
const form = document.getElementById('paint-form');
const panel = document.querySelector('.hoarding__panel');
if (!form || !panel) return;
const canvas = panel.querySelector('.painter');
const ctx = canvas.getContext('2d');
if (!ctx) return;
const input = document.getElementById('brand');
const err = document.getElementById('brand-err');
const said = document.getElementById('painted');
const offerLine = document.getElementById('offer-line');
const cta = document.getElementById('offer-cta');
const again = document.getElementById('paint-again');
const E = window.Elvana || { timeScale: 1, announce() {}, feedback() {} };
const ctaBase = cta.getAttribute('href').split('?')[0];
const ctaText = cta.textContent, offerText = offerLine.textContent;

/* ---- Motion, named in one place --------------------------------------------
   roll   the whitewash roller crosses the board, eased with paste (.2,.7,.1,1)
   brush  painting speed, px per ms; scaled so a name takes 1.4 to 3.6 s
   travel the lifted brush moving between strokes
   dry    the wet gloss fades with this time constant                         */
const M = { roll: 560, brush: 1.9, travel: 3.6, minMs: 1400, maxMs: 3600, dry: 650 };
const paste = window.Elvana && Elvana.MOTION ? Elvana.MOTION.paste : (t => 1 - Math.pow(1 - t, 3));
const css = n => getComputedStyle(root).getPropertyValue(n).trim();
const INK = { red: css('--red') || '#C8201A', ink: css('--ink') || '#1A1814', paper: css('--paper') || '#F2F3EF', back: css('--back') || '#E2E1DB', wall: css('--wall') || '#A39F96' };
const FRESH = '#FBFBF6';                     // a fresh coat of white, a touch brighter than the poster stock
const FONT = '"Yatra One", "Mukta", sans-serif';
const TAU = Math.PI * 2;

let W = 0, H = 0, dpr = 1;
const mk = () => document.createElement('canvas');
const textC = mk(), maskC = mk(), wetC = mk(), paintC = mk(), sheenC = mk(), baseC = mk();
const tctx = textC.getContext('2d'), mctx = maskC.getContext('2d'), wctx = wetC.getContext('2d'), pctx = paintC.getContext('2d'), sctx = sheenC.getContext('2d'), bctx = baseC.getContext('2d');

function size() {
  const r = panel.getBoundingClientRect(), cs = getComputedStyle(panel);
  const bx = parseFloat(cs.borderLeftWidth) * 2, by = parseFloat(cs.borderTopWidth) * 2;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.round((r.width - bx) * dpr), h = Math.round((r.height - by) * dpr);
  if (w === W && h === H) return false;                // same size: keep the canvases (and what is on them)
  W = w; H = h;
  [canvas, textC, maskC, wetC, paintC, sheenC].forEach(c => { c.width = W; c.height = H; });
  return true;
}

/* ---- Lettering layout ------------------------------------------------------ */
const seg = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const graphemes = s => seg ? [...seg.segment(s)].map(x => x.segment) : Array.from(s);
const isDeva = s => /[ऀ-ॿ]/.test(s);
function partitions(words, L) {               // every way to break words into L lines (names are short)
  const out = [];
  const rec = (start, left, acc) => {
    if (left === 1) { out.push([...acc, words.slice(start).join(' ')]); return; }
    for (let i = start + 1; i <= words.length - left + 1; i++) rec(i, left - 1, [...acc, words.slice(start, i).join(' ')]);
  };
  rec(0, L, []);
  return out;
}
function layout(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const lh = isDeva(name) ? 1.42 : 1.16;
  const bw = W * .86, bh = H * (W / H > 1.6 ? .7 : .78);
  ctx.font = `400 100px ${FONT}`;
  let best = null;
  for (let L = 1; L <= Math.min(4, words.length); L++) {
    const parts = words.length > 9 ? [greedy(words, L)] : partitions(words, L);
    for (const lines of parts) {
      const wmax = Math.max(...lines.map(l => ctx.measureText(l).width)) / 100;
      const fs = Math.min(bw / wmax, bh / (L * lh), H * (L === 1 ? .6 : .42));
      if (!best || fs > best.fs * (1 + .12 * (L - best.lines.length))) best = { fs, lines };
    }
  }
  // a word too long for the board: break it across lines the way a sign painter would (hyphen in Latin)
  words.forEach(word => {
    const g = graphemes(word);
    if (g.length < 9) return;
    for (let k = 2; k <= 3; k++) {
      const per = Math.ceil(g.length / k), chunks = [];
      for (let i = 0; i < g.length; i += per) chunks.push(g.slice(i, i + per).join(''));
      const lines = words.length === 1
        ? chunks.map((c, i) => i < chunks.length - 1 && /[A-Za-z]$/.test(c) ? c + '-' : c)
        : null;
      if (!lines) continue;
      const wmax = Math.max(...lines.map(l => ctx.measureText(l).width)) / 100;
      const fs = Math.min(bw / wmax, bh / (lines.length * lh), H * .42);
      if (fs > best.fs * 1.25) best = { fs, lines };
    }
  });
  const fs = best.fs, gap = fs * lh;
  ctx.font = `400 ${fs}px ${FONT}`;
  const rows = best.lines.map((text, i) => {
    const m = ctx.measureText(text);
    return { text, w: m.width, asc: m.actualBoundingBoxAscent || fs * .8, desc: m.actualBoundingBoxDescent || fs * .2, base: i * gap };
  });
  const top = Math.min(...rows.map(r => r.base - r.asc)), bot = Math.max(...rows.map(r => r.base + r.desc));
  const shift = (H - (bot - top)) / 2 - top;
  rows.forEach(r => { r.base += shift; r.x = (W - r.w) / 2; });
  return { fs, rows };
}
function greedy(words, L) {
  const per = Math.ceil(words.length / L), out = [];
  for (let i = 0; i < words.length; i += per) out.push(words.slice(i, i + per).join(' '));
  return out;
}

/* ---- The lettering itself (red, with a hand-painted ink shade) and the strokes that reveal it ---- */
function letter(lay) {
  tctx.clearRect(0, 0, W, H);
  tctx.font = `400 ${lay.fs}px ${FONT}`; tctx.textBaseline = 'alphabetic';
  const off = Math.max(1.5 * dpr, lay.fs * .04);
  tctx.fillStyle = INK.ink; lay.rows.forEach(r => tctx.fillText(r.text, r.x + off, r.base + off));
  tctx.fillStyle = INK.red; lay.rows.forEach(r => tctx.fillText(r.text, r.x, r.base));
}
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function strokes(lay, name) {
  let seed = 7; for (const ch of name) seed = (seed * 31 + ch.codePointAt(0)) >>> 0;
  const rnd = rng(seed), out = [];
  const bw = Math.max(5 * dpr, Math.min(64 * dpr, lay.fs * .3));
  ctx.font = `400 ${lay.fs}px ${FONT}`;
  let dir = 1;
  lay.rows.forEach(r => {
    const g = graphemes(r.text); let acc = '', a = 0;
    const off = lay.fs * .04;
    const y0 = r.base - r.asc - bw * .25, y1 = r.base + r.desc + off + bw * .25;
    g.forEach(ch => {
      acc += ch;
      const b = ctx.measureText(acc).width;
      if (ch.trim()) {
        const x0 = r.x + a, x1 = r.x + b + off, span = Math.max(1, x1 - x0);
        const m = Math.max(1, Math.ceil(span / (bw * .7)));
        for (let k = 0; k < m; k++) {
          const x = m === 1 ? (x0 + x1) / 2 : x0 + bw * .34 + (span - bw * .68) * k / (m - 1);
          const lean = bw * .22, bow = (rnd() - .5) * bw * .3;
          const top = { x: x + lean / 2, y: y0 }, bottom = { x: x - lean / 2, y: y1 };
          const [p0, p1] = dir > 0 ? [top, bottom] : [bottom, top];
          out.push({ p0, c: { x: (p0.x + p1.x) / 2 + bow, y: (p0.y + p1.y) / 2 }, p1, w: bw * (.92 + rnd() * .16) });
          dir = -dir;
        }
      }
      a = b;
    });
  });
  return { list: out, bw };
}
const qpt = (s, t) => { const u = 1 - t; return { x: u * u * s.p0.x + 2 * u * t * s.c.x + t * t * s.p1.x, y: u * u * s.p0.y + 2 * u * t * s.c.y + t * t * s.p1.y }; };
const qlen = s => { let L = 0, p = s.p0; for (let i = 1; i <= 12; i++) { const q = qpt(s, i / 12); L += Math.hypot(q.x - p.x, q.y - p.y); p = q; } return L; };

/* a timeline of lifted moves and painted strokes */
function plan(list) {
  const segs = []; let t = 0, at = null, paintLen = 0, moveLen = 0;
  list.forEach(s => { s.len = qlen(s); paintLen += s.len; if (at) moveLen += Math.hypot(s.p0.x - at.x, s.p0.y - at.y); at = s.p1; });
  const raw = paintLen / (M.brush * dpr) + moveLen / (M.travel * dpr);
  const k = raw > M.maxMs ? raw / M.maxMs : raw < M.minMs ? raw / M.minMs : 1;
  at = null;
  list.forEach(s => {
    if (at) { const d = Math.hypot(s.p0.x - at.x, s.p0.y - at.y), dur = d / (M.travel * dpr) / k; segs.push({ kind: 'move', a: at, b: s.p0, t0: t, t1: t + dur }); t += dur; }
    const dur = s.len / (M.brush * dpr) / k; segs.push({ kind: 'paint', s, t0: t, t1: t + dur, done: 0 }); t += dur; at = s.p1;
  });
  return { segs, total: t };
}

/* ---- Brush marks ----------------------------------------------------------
   A flat brush pulled down the letter: its bristles lie across the stroke,
   each laying a dab; the brush runs a little dry toward the end of a stroke. */
let rr = rng(1);
function dabs(s, from, to) {
  const step = Math.max(1, s.w * .1);
  const n = Math.max(1, Math.ceil(((to - from) * s.len) / step));
  mctx.beginPath(); wctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = from + (to - from) * i / n, p = qpt(s, t), load = 1 - .28 * t * t;
    for (let j = 0; j < 13; j++) {
      if (rr() > load + .1) continue;
      const u = (j / 12 - .5) * s.w, r = s.w * (.075 + rr() * .05), y = p.y + (rr() - .5) * s.w * .1;
      mctx.moveTo(p.x + u + r, y); mctx.arc(p.x + u, y, r, 0, TAU);
      if (j % 2 === 0) { wctx.moveTo(p.x + u + r * 1.4, y); wctx.arc(p.x + u, y, r * 1.4, 0, TAU); }
    }
  }
  mctx.fill(); wctx.fill();
}

/* ---- Pictures drawn on the canvas: the gloss, the brush, the roller ---------- */
function sheenPattern() {
  sctx.clearRect(0, 0, W, H);
  const g = sctx.createLinearGradient(0, 0, W * .35, H);
  [[0, 0], [.12, .7], [.17, 0], [.33, 0], [.4, .45], [.44, 0], [.62, 0], [.7, .65], [.74, 0], [.9, 0], [.95, .4], [1, 0]]
    .forEach(([o, a]) => g.addColorStop(o, `rgba(255,255,255,${a})`));
  sctx.fillStyle = g; sctx.fillRect(0, 0, W, H);
}
function brush(c, x, y, s, lifted) {
  c.save(); c.translate(x + (lifted ? s * .2 : 0), y - (lifted ? s * .35 : 0)); c.rotate(-.5);
  const bw = s * .95;
  if (lifted) { c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(s * .3, s * .5, bw * .5, bw * .2, 0, 0, TAU); c.fill(); }
  c.fillStyle = INK.red;                                   // bristles, loaded with paint
  c.beginPath(); c.moveTo(-bw / 2, -s * .95); c.lineTo(bw / 2, -s * .95);
  c.quadraticCurveTo(bw * .56, -s * .3, bw * .14, 0); c.lineTo(-bw * .14, 0); c.quadraticCurveTo(-bw * .56, -s * .3, -bw / 2, -s * .95); c.fill();
  c.strokeStyle = 'rgba(26,24,20,.35)'; c.lineWidth = Math.max(1, s * .03);
  c.beginPath(); for (let i = -2; i <= 2; i++) { c.moveTo(i * bw * .14, -s * .9); c.lineTo(i * bw * .05, -s * .08); } c.stroke();
  c.fillStyle = INK.wall; c.fillRect(-bw * .54, -s * 1.55, bw * 1.08, s * .64);   // ferrule
  c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-bw * .4, -s * 1.5, bw * .14, s * .54);
  c.fillStyle = INK.ink;                                    // handle
  c.beginPath(); c.moveTo(-bw * .34, -s * 1.55); c.lineTo(bw * .34, -s * 1.55); c.lineTo(bw * .2, -s * 5.6); c.lineTo(-bw * .2, -s * 5.6); c.fill();
  c.restore();
}
function roller(c, x) {
  const rw = Math.max(16 * dpr, W * .035);
  c.save();
  const g = c.createLinearGradient(x - rw, 0, x, 0);
  g.addColorStop(0, '#E6E5DF'); g.addColorStop(.45, '#FFFFFF'); g.addColorStop(1, '#C9C7C0');
  c.fillStyle = g; c.fillRect(x - rw, -2, rw, H + 4);
  c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(x, 0, Math.max(2, rw * .12), H);
  c.fillStyle = INK.ink; c.fillRect(x - rw / 2 - 2 * dpr, H * .5, 4 * dpr, H * .6);   // the pole, running off the board
  c.restore();
}

/* ---- One painting job ---------------------------------------------------- */
let job = null, raf = 0, last = 0, onScreen = true, hasBase = false;
function compose(withTools) {
  ctx.clearRect(0, 0, W, H);
  if (!job) return;
  const rollX = job.roll >= 1 ? W + 40 : (W + 40) * paste(Math.max(0, job.roll));
  if (hasBase) ctx.drawImage(baseC, 0, 0);
  ctx.fillStyle = FRESH; ctx.fillRect(0, 0, Math.min(W, rollX), H);
  if (job.roll >= 1) {
    pctx.globalCompositeOperation = 'copy'; pctx.drawImage(textC, 0, 0);
    pctx.globalCompositeOperation = 'destination-in'; pctx.drawImage(maskC, 0, 0);
    pctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(paintC, 0, 0);
    if (job.wet > .01) {
      sctx.globalCompositeOperation = 'source-over'; sheenPattern();
      sctx.globalCompositeOperation = 'destination-in'; sctx.drawImage(wetC, 0, 0); sctx.drawImage(paintC, 0, 0);
      ctx.globalAlpha = Math.min(1, job.wet); ctx.drawImage(sheenC, 0, 0); ctx.globalAlpha = 1;
    }
  }
  if (withTools) {
    if (job.roll < 1) roller(ctx, rollX);
    else if (job.head) brush(ctx, job.head.x, job.head.y, job.bw * 1.05, job.lifted);
  }
}
function finishNow() {
  if (!job) return;
  job.roll = 1; job.t = job.plan.total; job.head = null;
  mctx.globalCompositeOperation = 'source-over'; mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, W, H);
  job.wet = 0; wctx.clearRect(0, 0, W, H);
  compose(false); done();
}
function done() {
  panel.classList.remove('is-busy');
  const name = job.name;
  job.state = 'done';
  said.textContent = `The hoarding now reads: ${name}.`;
  E.announce(`Painted ${name} on the hoarding.`);
  again.hidden = false;
}
function tick(now) {
  raf = 0;
  if (!job || !onScreen) { last = 0; return; }
  const dt = last ? Math.min(50, now - last) * E.timeScale : 0; last = now;
  if (job.roll < 1) {
    job.roll = Math.min(1, job.roll + dt / M.roll);
    compose(true);
    if (job.roll >= 1) E.feedback('paste');
  } else if (job.state === 'painting') {
    job.t += dt;
    let head = null, lifted = false;
    for (const sg of job.plan.segs) {
      if (sg.t0 > job.t) break;
      const f = Math.min(1, (job.t - sg.t0) / (sg.t1 - sg.t0 || 1));
      if (sg.kind === 'paint') {
        if (f > sg.done) { dabs(sg.s, sg.done, f); sg.done = f; }
        head = qpt(sg.s, f); lifted = false;
      } else { head = { x: sg.a.x + (sg.b.x - sg.a.x) * f, y: sg.a.y + (sg.b.y - sg.a.y) * f }; lifted = true; }
    }
    job.head = head; job.lifted = lifted;
    job.wet = 1;
    if (job.t >= job.plan.total) {
      mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, W, H);   // the last pass: every letter whole
      job.state = 'drying'; job.head = null; done();
    }
    wctx.globalCompositeOperation = 'destination-out';
    wctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / M.dry)})`; wctx.fillRect(0, 0, W, H);
    wctx.globalCompositeOperation = 'source-over'; wctx.fillStyle = '#fff';
    compose(true);
  } else if (job.state === 'drying' || job.state === 'done') {
    job.wet *= Math.exp(-dt / M.dry);
    wctx.globalCompositeOperation = 'destination-out';
    wctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / M.dry)})`; wctx.fillRect(0, 0, W, H);
    wctx.globalCompositeOperation = 'source-over'; wctx.fillStyle = '#fff';
    compose(false);
    if (job.wet < .01) { job.wet = 0; compose(false); last = 0; return; }
  }
  raf = requestAnimationFrame(tick);
}
function wake() { if (!raf && job && job.wet + (job.roll < 1 ? 1 : 0) + (job.state === 'painting' ? 1 : 0) > 0) { last = 0; raf = requestAnimationFrame(tick); } }

let ticket = 0;
async function paint(name) {
  const mine = ++ticket;                               // a newer name typed meanwhile wins
  // what is on the board now becomes the base the roller paints over
  if (job) { compose(false); bctx.canvas.width = W; bctx.canvas.height = H; bctx.clearRect(0, 0, W, H); bctx.drawImage(canvas, 0, 0); hasBase = true; }
  offerLine.textContent = `${name}, up on our hoarding. This could be one of Elvana's first case studies.`;
  cta.textContent = `Talk to us about ${name}`;
  cta.setAttribute('href', ctaBase + '?brand=' + encodeURIComponent(name));
  try { if (document.fonts && document.fonts.load) await document.fonts.load(`400 100px ${FONT}`, name); } catch (_) {}
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));   // let the click's frame paint first
  if (mine !== ticket) return;
  if (size()) hasBase = false;
  const lay = layout(name);
  letter(lay);
  const st = strokes(lay, name);
  rr = rng(st.list.length * 977 + name.length);
  mctx.clearRect(0, 0, W, H); mctx.fillStyle = '#fff';
  wctx.clearRect(0, 0, W, H); wctx.fillStyle = '#fff';
  job = { name, lay, bw: st.bw, plan: plan(st.list), t: 0, roll: 0, wet: 0, state: 'painting', head: null };
  panel.classList.add('is-busy');
  again.hidden = true;
  if (!root.classList.contains('motion')) { finishNow(); return; }
  wake();
}

/* ---- Form ------------------------------------------------------------------ */
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = input.value.replace(/\s+/g, ' ').trim();
  if (!name) {
    input.setAttribute('aria-invalid', 'true');
    err.textContent = 'type a brand name first. Any length, any script.';
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid'); err.textContent = '';
  paint(name);
});
input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); err.textContent = ''; } });
again.addEventListener('click', () => { input.focus(); input.select(); });
panel.addEventListener('click', () => { if (job && job.state === 'painting') finishNow(); });

/* ---- Resize: keep the finished lettering, redrawn for the new size ---------- */
let rz = 0;
const redraw = () => {
  if (!job) { size(); return; }
  const name = job.name;
  size(); hasBase = false;
  const lay = layout(name); letter(lay);
  mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, W, H);
  wctx.clearRect(0, 0, W, H);
  job.lay = lay; job.roll = 1; job.wet = 0; job.head = null;
  if (job.state === 'painting') { job.state = 'done'; done(); }
  compose(false);
};
if ('ResizeObserver' in window) {
  let first = true;
  new ResizeObserver(() => { if (first) { first = false; return; } clearTimeout(rz); rz = setTimeout(redraw, 80); }).observe(panel);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; if (onScreen) wake(); }).observe(panel);
}
size();
})();
