/* =========================================================================
   Elvana Media: tear.js
   The home hero's signature interaction, "tear a strip off the hoarding",
   moved VERBATIM from variation A (src/app.js, initTear and its helpers).
   Do not refactor here: a replacement with the same DOM contract may drop in.

   API
     window.ElvanaTear.mountHero(heroEl, opts)   called once by core.js
       heroEl       <section class="hero"> (see the TEAR:BEGIN block in pages/index.html)
       opts.button  the "Tear a strip" button   (default #tear-btn)
       opts.live    polite live region          (default #tear-live)
       opts.clip    <clipPath id="tear-clip">   (default #tear-clip)
     Returns true when it mounted, false when there is nothing to do
     (no hero, no JS motion, or prefers-reduced-motion).

   Slow motion: core.js dispatches `elvana:timescale` on document with
   detail.timeScale (1 or 0.1); this file keeps its own copy of the value.

   DOM contract (A): .hero > .sheet.sheet-top (h1 lives here),
   .sheet.sheet-under (clip-path:url(#tear-clip) when html.js.motion),
   canvas.tear-canvas, .grip-b/.grip-l/.grip-r, #tear-live, #tear-btn,
   svg defs #tear-clip / #still-wide / #still-tall.
   ========================================================================= */
(() => {
'use strict';

/* Named curves and springs used by the tear (A's MOTION, verbatim).
   core.js holds the site-wide copy; CSS mirrors the curves. */
const MOTION = {
  paste: bezier(.2, .7, .1, 1),     // paste: cubic-bezier(.2,.7,.1,1). Squeegee settle; every entrance eases out.
  tug: bezier(.55, 0, .75, .2),     // tug: cubic-bezier(.55,0,.75,.2). Gravity: a sheet letting go of the wall.
  flap: { k: 260, c: 26 },          // flap: the torn strip's free end follows the hand (zeta .81, one tiny overshoot)
  roll: { k: 120, c: 19 },          // roll: a released strip curls up into a roll (zeta .87)
  peek: { k: 300, c: 30 },          // peek: the poster edge lifts toward a hovering pointer (zeta .87)
  ms: { letGo: 900, pasteBack: 1100, fallLife: 950, chatGap: 650, cellStagger: 40, barStagger: 120 }
};
let timeScale = 1;                  // 0.1 while slow-motion review is on (S key or footer switch)
document.addEventListener('elvana:timescale', e => { timeScale = (e.detail && e.detail.timeScale) || 1; });

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = t => ((ax * t + bx) * t + cx) * t;
  const sy = t => ((ay * t + by) * t + cy) * t;
  const dsx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dsx(t); if (Math.abs(e) < 1e-5 || !d) break; t -= e / d; }
    t = Math.min(1, Math.max(0, t));
    return sy(t);
  };
}
function spring(s, target, cfg, dt) {
  // semi-implicit Euler, sub-stepped for stability at low frame rates
  const n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n;
  for (let i = 0; i < n; i++) { s.v += (cfg.k * (target - s.x) - cfg.c * s.v) * h; s.x += s.v * h; }
  return Math.abs(s.v) > 0.004 || Math.abs(target - s.x) > 0.002;
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const SVGNS = 'http://www.w3.org/2000/svg';

function mountHero(heroEl, opts) {
  opts = opts || {};
  const hero = heroEl || document.querySelector('.hero');
  const motionOK = document.documentElement.classList.contains('motion');
  const canvas = hero && hero.querySelector('.tear-canvas');
  const tearBtn = opts.button || document.getElementById('tear-btn');
  const live = opts.live || document.getElementById('tear-live');
  const clipEl = opts.clip || document.getElementById('tear-clip');
  if (!(hero && canvas && clipEl && motionOK) || hero.dataset.tearMounted) return false;
  hero.dataset.tearMounted = '1';
  initTear();
  return true;

/* =======================================================================
   SIGNATURE: tear a strip off the hoarding.
   The top poster is real HTML (the h1). The poster underneath sits above it
   in z-order and is revealed through an SVG clipPath, one path per torn strip,
   so overlapping tears union naturally. A canvas draws the paper itself:
   white fibre along exposed tear edges, the inner shadow, and the torn flap,
   which follows the pointer, curls to show its back and rolls up on release.
   ======================================================================= */
function initTear() {
  const ctx = canvas.getContext('2d');
  const EXTRA = 140;                       // canvas reaches below the poster so flaps can hang over the snipe
  const STEP = 3;                          // px between path samples
  const MAX_DEV = 0.72;                    // a tear may veer at most ~41 degrees from where it started
  const TURN = 0.011;                      // and turns at most ~0.63 degrees per px torn
  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, visible = true;
  let strips = [], peek = null, drag = null, letgo = null, pasteAnim = null, revealed = false, planIdx = 0;
  let falling = [];
  let geomDirty = true, announcedReveal = false;
  const revealPath = document.createElementNS(SVGNS, 'path');
  const peekPath = document.createElementNS(SVGNS, 'path');

  /* ----- noise for torn edges ----- */
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
  const jag = (seed, s) => noise(seed + s / 24) * 3.4 + noise(seed * 1.73 + s / 6.5) * 1.5 + (hash(seed * 3.1 + s * 1.37) - .5) * 1.4;

  const wide = () => W / H >= 1.25;

  function measure() {
    const r = hero.getBoundingClientRect();
    const ow = W, oh = H;
    W = r.width; H = r.height;
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round((H + EXTRA) * dpr);
    if (ow && (Math.abs(ow - W) > .5 || Math.abs(oh - H) > .5)) rescale(W / ow, H / oh);
    geomDirty = true; render();
  }
  function rescale(sx, sy) {
    for (const st of strips) {
      for (const p of st.pts) { p.x *= sx; p.y *= sy; }
      st.G.x *= sx; st.G.y *= sy; st.free.x *= sx; st.free.y *= sy; st.dirty = true;
    }
  }

  /* ----- strips ----- */
  function stripWidth() { return clamp(Math.min(W, H) * (.25 + Math.random() * .07), 92, 230); }
  function widthAt(st, len) { return Math.max(0, st.w0 - st.conv * len + noise(st.seed * 2 + len / 90) * st.w0 * .05); }
  function newStrip(G, axis, w0, seed) {
    const m = Math.hypot(axis.x, axis.y), a = { x: axis.x / m, y: axis.y / m };
    const st = {
      G: { x: G.x, y: G.y }, a, dir: { x: a.x, y: a.y }, w0, conv: .07 + Math.random() * .06,
      seed: seed != null ? seed : Math.random() * 500, pts: [], len: 0, entered: false,
      state: 'rest', P: null, auto: null,
      free: { x: G.x, y: G.y }, fv: { x: 0, y: 0 }, u: { x: a.x, y: a.y },
      roll: { x: 0, v: 0 }, detached: false, dirty: true,
      path: document.createElementNS(SVGNS, 'path')
    };
    pushPt(st, G.x, G.y);
    clipEl.appendChild(st.path);
    strips.push(st);
    return st;
  }
  function pushPt(st, x, y) {
    st.pts.push({ x, y, nx: -st.dir.y, ny: st.dir.x, w: widthAt(st, st.len), jl: jag(st.seed, st.len), jr: jag(st.seed + 97, st.len) });
  }
  const head = st => st.pts[st.pts.length - 1];
  const inside = (x, y, m) => x > -m && x < W + m && y > -m && y < H + m;
  function rotate(v, ang) { const c = Math.cos(ang), s = Math.sin(ang); return { x: v.x * c - v.y * s, y: v.x * s + v.y * c }; }
  function angleTo(a, b) { return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y); }

  function advance(st, dist, steer) {
    while (dist > .01 && !st.detached) {
      const step = Math.min(STEP, dist); dist -= step;
      if (steer) {
        let d = clamp(angleTo(st.dir, steer), -TURN * step, TURN * step);
        let nd = rotate(st.dir, d);
        const dev = angleTo(st.a, nd);
        if (Math.abs(dev) > MAX_DEV) nd = rotate(st.a, Math.sign(dev) * MAX_DEV);
        st.dir = nd;
      }
      const h = head(st);
      const x = h.x + st.dir.x * step, y = h.y + st.dir.y * step;
      st.len += step; pushPt(st, x, y);
      if (!st.entered && inside(x, y, -8)) st.entered = true;
      const w = head(st).w;
      if (w < 12 || (st.entered && !inside(x, y, 3)) || st.len > 5000) detach(st);
    }
    st.dirty = true; geomDirty = true;
  }

  function detach(st) {
    if (st.detached) return;
    const g = flapParams(st);
    st.detached = true; st.state = 'gone';
    falling.push({ st, g, x: 0, y: 0, vx: st.fv.x * .25, vy: -40 + st.fv.y * .2, rot: 0, vr: (Math.random() - .5) * 2.4, t: 0 });
    if (!letgo && !revealed) setTimeout(checkCoverage, 120);
    if (!announcedReveal) { announcedReveal = true; say('A strip came off. The poster underneath reads: Get seen. Get chosen. Grow.'); }
  }

  /* ----- flap geometry: the torn strip, folded back at the tear head ----- */
  function flapParams(st) {
    const h = head(st);
    let ux = st.free.x - h.x, uy = st.free.y - h.y; const reach = Math.hypot(ux, uy);
    if (reach > 1) { ux /= reach; uy /= reach; st.u = { x: ux, y: uy }; } else { ux = st.u.x; uy = st.u.y; }
    const roll = clamp(st.roll.x, 0, 1.2);
    const len = st.len;
    const s0 = Math.max(0, (1 - roll)) * Math.min(reach, len) * .86;
    const Rh = clamp((len - s0) / 2.6, 6, 70), Rr = clamp(8 + len * .035, 8, 22);
    const R = lerp(Rh, Rr, clamp(roll, 0, 1));
    const phiMax = lerp(2.3, 4.4, clamp(roll, 0, 1));
    return { hx: h.x, hy: h.y, ux, uy, len, s0, R, phiMax };
  }
  function sliceFlap(g, halfAt) {
    // returns slices along the flap; the far end curls round a cylinder of radius R
    const out = []; const ds = Math.max(2.5, g.len / 220);
    for (let s = 0; s <= g.len + .001; s += ds) {
      let up, z, nz, phi = 0;
      if (s <= g.s0) { up = s; z = 0; nz = 1; }
      else { phi = (s - g.s0) / g.R; if (phi > g.phiMax) break; up = g.s0 + g.R * Math.sin(phi); z = g.R * (1 - Math.cos(phi)); nz = Math.cos(phi); }
      const k = 1 + z / 650;
      const [hl, hr] = halfAt(s);
      const cx = g.hx + g.ux * up, cy = g.hy + g.uy * up, vx = -g.uy, vy = g.ux;
      out.push({ lx: cx + vx * hl * k, ly: cy + vy * hl * k, rx: cx - vx * hr * k, ry: cy - vy * hr * k, nz, phi, s });
    }
    return out;
  }
  function slab(x, y, nx, ny) {
    // the stretch of the line x + n t that lies on the poster
    let t0 = -1e9, t1 = 1e9;
    for (const [p, n, max] of [[x, nx, W], [y, ny, H]]) {
      if (Math.abs(n) < 1e-6) { if (p < 0 || p > max) return [1, 0]; continue; }
      const a = (0 - p) / n, b = (max - p) / n;
      t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
    }
    return [t0, t1];
  }
  function stripHalf(st) {
    // folding over the tear head keeps left as left; only paper that was on the poster exists
    return s => {
      const idx = clamp(Math.round((st.len - s) / STEP), 0, st.pts.length - 1), p = st.pts[idx];
      const [t0, t1] = slab(p.x, p.y, p.nx, p.ny);
      const hi = Math.min(p.w / 2 + p.jl, t1), lo = Math.max(-(p.w / 2 + p.jr), t0);
      return hi > lo ? [hi, -lo] : [0, 0];
    };
  }

  /* ----- polygons, clip paths and exposed edges ----- */
  function polyOf(st) {
    const L = [], R = [];
    for (const p of st.pts) {
      L.push([p.x + p.nx * (p.w / 2 + p.jl), p.y + p.ny * (p.w / 2 + p.jl)]);
      R.push([p.x - p.nx * (p.w / 2 + p.jr), p.y - p.ny * (p.w / 2 + p.jr)]);
    }
    const poly = L.concat(R.slice().reverse());
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of poly) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    const test = poly.filter((_, i) => i % 3 === 0);
    return { L, R, poly, test, box: [x0, y0, x1, y1] };
  }
  function pip(x, y, g) {
    const b = g.box; if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) return false;
    const P = g.test; let c = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  const dStr = P => 'M' + P.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
  function syncGeometry() {
    for (const st of strips) {
      if (st.dirty || !st.g) { st.g = polyOf(st); st.path.setAttribute('d', dStr(st.g.poly)); st.dirty = false; }
    }
    // exposed edges: tear edges that are not inside another hole and still on the poster
    for (const st of strips) {
      const others = strips.filter(o => o !== st && o.g);
      const ex = side => side.map(([x, y]) => inside(x, y, -1) && !(letgo && y < letgo.y) && !others.some(o => pip(x, y, o.g)));
      st.exL = ex(st.g.L); st.exR = ex(st.g.R);
    }
    geomDirty = false;
  }

  /* ----- pointer ----- */
  const local = e => { const r = hero.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function nearestEdge(p) {
    const c = [
      { d: W - p.x, G: { x: W + 2, y: p.y }, a: { x: -1, y: 0 } },
      { d: p.x, G: { x: -2, y: p.y }, a: { x: 1, y: 0 } },
      { d: H - p.y, G: { x: p.x, y: H + 2 }, a: { x: 0, y: -1 } }
    ];
    c.sort((m, n) => m.d - n.d);
    const e = c[0];
    // near a bottom corner: tear diagonally from the corner itself
    if (H - p.y < 90 && (W - p.x < 90 || p.x < 90)) {
      const right = W - p.x < 90;
      return { d: Math.min(H - p.y, right ? W - p.x : p.x), G: { x: right ? W + 2 : -2, y: H + 2 }, a: { x: right ? -.62 : .62, y: -.78 } };
    }
    return e;
  }
  function pick(p) {
    for (let i = strips.length - 1; i >= 0; i--) {
      const st = strips[i]; if (st.detached) continue;
      const h = head(st), g = flapParams(st);
      const rx = g.hx + g.ux * (g.s0 + g.R * .8), ry = g.hy + g.uy * (g.s0 + g.R * .8);
      if (Math.hypot(p.x - h.x, p.y - h.y) < Math.max(40, h.w * .55 + 18) || Math.hypot(p.x - rx, p.y - ry) < g.R + 30) return st;
    }
    return null;
  }
  const busyAnim = () => letgo || pasteAnim || revealed;

  hero.addEventListener('pointerdown', e => {
    if (busyAnim() || e.button > 0) return;
    const p = local(e), touch = e.pointerType !== 'mouse';
    let st = pick(p);
    if (!st) {
      const ed = nearestEdge(p);
      if (ed.d <= (touch ? 72 : 56)) st = newStrip(ed.G, ed.a, peek ? peek.w0 : stripWidth(), peek ? peek.seed : undefined);
      else if (touch) { drag = { id: e.pointerId, pending: p }; return; }
      else return;
    }
    e.preventDefault();
    hold(st, p, e);
  });
  function hold(st, p, e) {
    st.state = 'held'; st.P = p; st.auto = null; st.restRoll = null;
    drag = { id: e.pointerId, st };
    try { hero.setPointerCapture(e.pointerId); } catch (_) {}
    hero.classList.add('grabbing');
    killPeek();
    kick();
  }
  hero.addEventListener('pointermove', e => {
    const p = local(e);
    if (drag && e.pointerId === drag.id) {
      if (drag.pending) {
        const dx = p.x - drag.pending.x, dy = p.y - drag.pending.y;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          const fromRight = dx < 0;
          const st = newStrip({ x: fromRight ? W + 2 : -2, y: drag.pending.y }, { x: fromRight ? -1 : 1, y: 0 }, stripWidth());
          hold(st, p, e);
        }
        return;
      }
      drag.st.P = p; kick(); return;
    }
    if (e.pointerType === 'mouse' && !busyAnim()) hover(p);
  });
  function release(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const st = drag.st; drag = null;
    hero.classList.remove('grabbing');
    if (st && !st.detached) st.state = 'rest';
    setTimeout(checkCoverage, 60);
    kick();
  }
  hero.addEventListener('pointerup', release);
  hero.addEventListener('pointercancel', release);
  hero.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !drag) { killPeek(); hero.style.cursor = ''; } });

  function hover(p) {
    const ed = nearestEdge(p), onStrip = pick(p);
    const near = ed.d <= 56 && !onStrip;
    hero.style.cursor = near || onStrip ? 'grab' : '';
    if (near) {
      if (!peek) peek = { amt: { x: 0, v: 0 }, target: 16, w0: stripWidth(), seed: Math.random() * 500 };
      peek.G = ed.G; peek.a = ed.a; peek.target = 16;
      if (!peekPath.parentNode) clipEl.appendChild(peekPath);
      kick();
    } else if (peek) { peek.target = 0; kick(); }
  }
  function killPeek() { if (peek) { peek = null; peekPath.remove(); } }
  function peekStrip() {
    // a throwaway strip, rebuilt each frame from the peek amount
    const m = Math.hypot(peek.a.x, peek.a.y), a = { x: peek.a.x / m, y: peek.a.y / m };
    const st = { G: peek.G, a, dir: a, w0: peek.w0, conv: 0, seed: peek.seed, pts: [], len: 0 };
    let x = peek.G.x, y = peek.G.y; pushPt(st, x, y);
    const n = Math.max(1, Math.round(peek.amt.x / STEP));
    for (let i = 0; i < n; i++) { x += a.x * STEP; y += a.y * STEP; st.len += STEP; pushPt(st, x, y); }
    st.free = { x: x + a.x * st.len * .9, y: y + a.y * st.len * .9 }; st.u = a; st.roll = { x: .55 };
    return st;
  }

  /* ----- keyboard / button: tear along a planned path, then let go, then paste back ----- */
  function plan() {
    const corner = wide() ? { G: { x: W + 2, y: H + 2 }, a: { x: -.62, y: -.78 }, curve: .0006 } : { G: { x: W + 2, y: H + 2 }, a: { x: -.74, y: -.67 }, curve: -.0005 };
    const P = wide()
      ? [corner, { G: { x: W + 2, y: H * .5 }, a: { x: -1, y: .12 }, curve: -.0004 }, { G: { x: W * .58, y: H + 2 }, a: { x: .2, y: -1 }, curve: .0005 }]
      : [corner, { G: { x: -2, y: H * .8 }, a: { x: 1, y: -.05 }, curve: .0003 }, { G: { x: W * .3, y: H + 2 }, a: { x: .1, y: -1 }, curve: .0004 }];
    return P;
  }
  function tearStep() {
    if (pasteAnim) { pasteAnim.speed = 3; return; }
    if (revealed || letgo) { startPaste(); return; }
    let st = strips.find(s => !s.detached && s.state !== 'held');
    if (st && st.state === 'auto') { st.auto.vmax *= 1.8; return; }
    if (!st) {
      const P = plan();
      if (planIdx >= P.length) { startLetGo(); return; }
      const pl = P[planIdx++];
      st = newStrip(pl.G, pl.a, clamp(Math.min(W, H) * .3, 100, 230));
      st.planCurve = pl.curve;
    } else if (planIdx === 0) planIdx = 1;
    st.state = 'auto';
    st.auto = { v: 0, vmax: Math.max(900, Math.hypot(W, H) * 1.05), curve: st.planCurve != null ? st.planCurve : 0 };
    kick();
  }
  tearBtn && tearBtn.addEventListener('click', tearStep);

  function coverage() {
    let hit = 0, n = 0;
    for (let gy = 0; gy < 16; gy++) for (let gx = 0; gx < 28; gx++) {
      const x = (gx + .5) / 28 * W, y = (gy + .5) / 16 * H; n++;
      if (strips.some(st => st.g && pip(x, y, st.g))) hit++;
    }
    return hit / n;
  }
  function checkCoverage() { if (!busyAnim() && strips.length && coverage() > .46) startLetGo(); }

  function startLetGo() {
    if (letgo || revealed) return;
    for (const st of strips) if (!st.detached) detach(st);
    letgo = { t: 0, y: 0 };
    revealPath.setAttribute('d', 'M0 0Z'); clipEl.appendChild(revealPath);
    setBtn('Paste it back');
    say('The whole poster came off. Underneath: Get seen. Get chosen. Grow.');
    kick();
  }
  function startPaste() {
    if (pasteAnim) return;
    if (letgo) { letgo = null; }
    for (const st of strips) st.path.remove();
    strips = []; falling = []; killPeek();
    revealed = false;
    pasteAnim = { t: 0, x: 0, speed: 1 };
    if (!revealPath.parentNode) clipEl.appendChild(revealPath);
    setBtn('Tear a strip'); tearBtn && (tearBtn.disabled = true);
    kick();
  }
  function setBtn(t) { if (tearBtn) tearBtn.textContent = t; }
  function say(t) { if (live) { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); } }

  function grip() {
    // the poster arrives with one corner already lifting: the invitation to tear
    const w = wide();
    const st = newStrip({ x: W + 2, y: H + 2 }, w ? { x: -.62, y: -.78 } : { x: -.74, y: -.67 }, clamp(Math.min(W, H) * .3, 100, 210));
    st.planCurve = w ? .0006 : -.0005;
    advance(st, 6, null);
    const h = head(st);
    st.free = { x: h.x + st.dir.x * st.len, y: h.y + st.dir.y * st.len };
    st.restRoll = .42; st.roll.x = .9; st.state = 'rest';
    // after a beat, the corner lifts on its own: the invitation to tear
    setTimeout(() => { if (st.detached || st.state !== 'rest' || st.len > 10) return; st.state = 'auto'; st.auto = { v: 0, vmax: 260, curve: 0, stopAt: w ? 88 : 60 }; kick(); }, 650 / timeScale);
  }

  /* ----- frame ----- */
  function kick() { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now) {
    raf = 0;
    const dt = Math.min(.034, (now - last) / 1000) * timeScale; last = now;
    let busy = false;
    for (const st of strips) {
      if (st.detached) continue;
      let target;
      if (st.state === 'held') {
        busy = true;
        const h = head(st), P = st.P, dx = P.x - h.x, dy = P.y - h.y, d = Math.hypot(dx, dy);
        if (d > 1) {
          const ux = dx / d, uy = dy / d, cos = ux * st.dir.x + uy * st.dir.y;
          if (d > st.len + 2 && cos > -.3) advance(st, Math.min((d - st.len) / (1 + Math.max(cos, .3)), 46), { x: ux, y: uy });
        }
        target = P;
      } else if (st.state === 'auto') {
        busy = true;
        const A = st.auto;
        A.v = Math.min(A.vmax, A.v + A.vmax * 2.6 * dt);
        let dist = A.v * dt;
        if (A.stopAt) { dist = Math.min(dist, A.stopAt - st.len); if (dist <= .01) { st.state = 'rest'; st.auto = null; continue; } }
        advance(st, dist, rotate(st.dir, A.curve * dist * 40));
        const h = head(st);
        target = { x: h.x + st.dir.x * st.len * .92, y: h.y + st.dir.y * st.len * .92 };
      } else target = null;
      if (st.detached) continue;
      if (target) {
        const sx = { x: st.free.x, v: st.fv.x }, sy = { x: st.free.y, v: st.fv.y };
        const a = spring(sx, target.x, MOTION.flap, dt), b = spring(sy, target.y, MOTION.flap, dt);
        st.free.x = sx.x; st.fv.x = sx.v; st.free.y = sy.x; st.fv.y = sy.v;
        busy = busy || a || b;
      }
      const rollTarget = st.state === 'held' ? 0 : st.state === 'auto' ? .1 : (st.restRoll != null ? st.restRoll : 1);
      if (spring(st.roll, rollTarget, MOTION.roll, dt)) busy = true;
    }
    // detached flaps fall away
    for (const f of falling) {
      f.t += dt; f.vy += 2600 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt;
    }
    falling = falling.filter(f => f.t < MOTION.ms.fallLife / 1000);
    if (falling.length) busy = true;
    // peek
    if (peek) {
      const moving = spring(peek.amt, peek.target, MOTION.peek, dt);
      if (!moving && peek.target === 0) killPeek();
      else { busy = busy || moving; const ps = peekStrip(); peek.st = ps; peekPath.setAttribute('d', dStr(polyOf(ps).poly)); }
    }
    // the whole sheet lets go
    if (letgo) {
      busy = true;
      letgo.t += dt * 1000;
      const p = Math.min(1, letgo.t / MOTION.ms.letGo);
      letgo.y = H * 1.04 * MOTION.tug(p);
      let d = 'M-4 -4H' + (W + 4).toFixed(1) + 'V' + letgo.y.toFixed(1);
      for (let x = W; x >= 0; x -= 24) d += 'L' + x.toFixed(1) + ' ' + (letgo.y + jag(7, x) * 1.6).toFixed(1);
      revealPath.setAttribute('d', d + 'Z');
      geomDirty = true;
      if (p >= 1) {
        falling.push({ sheet: true, g: { hx: W / 2, hy: H, ux: 0, uy: 1, len: H * .55, s0: H * .3, R: 40 + H * .1, phiMax: 2.2 }, x: 0, y: 0, vx: 0, vy: 200, rot: 0, vr: .3, t: 0 });
        letgo = null; revealed = true;
        revealPath.setAttribute('d', `M-4 -4H${W + 4}V${H + 4}H-4Z`);
      }
    }
    // paste the poster back with a squeegee, left to right
    if (pasteAnim) {
      busy = true;
      pasteAnim.t += dt * 1000 * pasteAnim.speed;
      const p = Math.min(1, pasteAnim.t / MOTION.ms.pasteBack);
      pasteAnim.x = -30 + (W + 60) * MOTION.paste(p);
      revealPath.setAttribute('d', `M${pasteAnim.x.toFixed(1)} -4H${W + 4}V${H + 4}H${pasteAnim.x.toFixed(1)}Z`);
      if (p >= 1) {
        pasteAnim = null; revealPath.remove(); planIdx = 0; announcedReveal = false;
        tearBtn && (tearBtn.disabled = false);
        grip(); geomDirty = true;
        say('The poster is pasted back. Ideas that create impact.');
      }
    }
    if (geomDirty) syncGeometry();
    render();
    if (busy) raf = requestAnimationFrame(frame);
  }

  /* ----- drawing ----- */
  const BACK = [226, 225, 219], FRONT = [255, 208, 0];
  function shadeCol(c, l) { return `rgb(${(c[0] * l) | 0},${(c[1] * l) | 0},${(c[2] * l) | 0})`; }
  function drawFlap(g, halfAt, alpha) {
    const S = sliceFlap(g, halfAt);
    if (S.length < 2) return;
    ctx.globalAlpha = alpha;
    // soft shadow of the lifted paper onto the wall
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.34)'; ctx.shadowBlur = 14 * dpr; ctx.shadowOffsetX = 3 * dpr; ctx.shadowOffsetY = 7 * dpr;
    ctx.fillStyle = shadeCol(BACK, .9);
    ctx.beginPath();
    S.forEach((q, i) => i ? ctx.lineTo(q.lx * dpr, q.ly * dpr) : ctx.moveTo(q.lx * dpr, q.ly * dpr));
    for (let i = S.length - 1; i >= 0; i--) ctx.lineTo(S[i].rx * dpr, S[i].ry * dpr);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = alpha;
    // slices: those curled past half a turn sit behind, so draw them first
    const order = [];
    for (let i = S.length - 2; i >= 0; i--) if (S[i].phi > Math.PI) order.push(i);
    for (let i = 0; i < S.length - 1; i++) if (S[i].phi <= Math.PI) order.push(i);
    for (const i of order) {
      const a = S[i], b = S[i + 1], nz = (a.nz + b.nz) / 2;
      let col;
      if (nz >= 0) { const crease = .86 + .14 * Math.min(1, a.s / 16); col = shadeCol(BACK, (.74 + .26 * nz) * crease); }
      else col = shadeCol(FRONT, .6 + .4 * -nz);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(a.lx * dpr, a.ly * dpr); ctx.lineTo(b.lx * dpr, b.ly * dpr); ctx.lineTo(b.rx * dpr, b.ry * dpr); ctx.lineTo(a.rx * dpr, a.ry * dpr);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = .8; ctx.stroke();      // hide hairline gaps between slices
    }
    // torn, fibrous long edges
    ctx.strokeStyle = 'rgba(255,255,253,.92)'; ctx.lineWidth = 1.5 * dpr; ctx.lineJoin = 'round';
    for (const side of ['l', 'r']) {
      ctx.beginPath();
      S.forEach((q, i) => { if (q.phi > Math.PI) return; const x = q[side + 'x'] * dpr, y = q[side + 'y'] * dpr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    }
    // the crease where the strip is still stuck to the wall
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 2 * dpr;
    ctx.beginPath(); ctx.moveTo(S[0].lx * dpr, S[0].ly * dpr); ctx.lineTo(S[0].rx * dpr, S[0].ry * dpr); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function edgeRuns(P, ex, inward, fn) {
    let run = [];
    for (let i = 0; i < P.length; i++) {
      if (ex[i]) run.push(i); else { if (run.length > 1) fn(run); run = []; }
    }
    if (run.length > 1) fn(run);
  }
  function drawRims(st, L, R, exL, exR, pts) {
    // inner shadow: the top poster's thickness shading the poster underneath
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const pass = (P, ex, sgn, off, style, width) => edgeRuns(P, ex, sgn, run => {
      ctx.beginPath();
      run.forEach((i, k) => {
        const p = pts[i], x = (P[i][0] - sgn * p.nx * off) * dpr, y = (P[i][1] - sgn * p.ny * off) * dpr;
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = style; ctx.lineWidth = width * dpr; ctx.stroke();
    });
    pass(L, exL, 1, 3, 'rgba(0,0,0,.22)', 6);
    pass(R, exR, -1, 3, 'rgba(0,0,0,.22)', 6);
    pass(L, exL, 1, 1.2, 'rgba(0,0,0,.3)', 2.2);
    pass(R, exR, -1, 1.2, 'rgba(0,0,0,.3)', 2.2);
    // white paper fibre on the torn edge
    pass(L, exL, 1, -.6, '#FBFBF6', 2.6);
    pass(R, exR, -1, -.6, '#FBFBF6', 2.6);
    pass(L, exL, 1, -2.1, 'rgba(251,251,246,.5)', 1);
    pass(R, exR, -1, -2.1, 'rgba(251,251,246,.5)', 1);
  }
  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!revealed) for (const st of strips) if (st.g && st.exL) drawRims(st, st.g.L, st.g.R, st.exL, st.exR, st.pts);
    if (peek && peek.st) {
      const g = polyOf(peek.st), ex = g.L.map(([x, y]) => inside(x, y, -1));
      drawRims(peek.st, g.L, g.R, ex, g.R.map(([x, y]) => inside(x, y, -1)), peek.st.pts);
      drawFlap(flapParams(peek.st), stripHalf(peek.st), 1);
    }
    for (const st of strips) if (!st.detached && st.len > 2) drawFlap(flapParams(st), stripHalf(st), 1);
    for (const f of falling) {
      const a = clamp(1 - (f.t - .4) / .5, 0, 1);
      ctx.save();
      const hx = f.g.hx * dpr, hy = f.g.hy * dpr;
      ctx.translate(hx + f.x * dpr, hy + f.y * dpr); ctx.rotate(f.rot); ctx.translate(-hx, -hy);
      drawFlap(f.g, f.sheet ? () => [W / 2 + 2, W / 2 + 2] : stripHalf(f.st), a);
      ctx.restore();
    }
    if (letgo && letgo.y > 2) {
      const len = letgo.y * .6;
      drawFlap({ hx: W / 2, hy: letgo.y, ux: 0, uy: 1, len, s0: len * .5, R: 26 + len * .16, phiMax: 2.5 }, () => [W / 2 + 2, W / 2 + 2], 1);
    }
    if (pasteAnim) drawSqueegee(pasteAnim.x);
  }
  function drawSqueegee(x) {
    const X = x * dpr, h = H * dpr;
    const g = ctx.createLinearGradient(X - 180 * dpr, 0, X, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.32)');
    ctx.fillStyle = g; ctx.fillRect(X - 180 * dpr, 0, 180 * dpr, h);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(X + 2 * dpr, 0, 10 * dpr, h);
    ctx.fillStyle = '#1A1814'; ctx.fillRect(X - 4 * dpr, -2, 8 * dpr, h + 4);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(X - 3 * dpr, 0, 1.5 * dpr, h);
  }

  /* ----- lifecycle ----- */
  new ResizeObserver(() => measure()).observe(hero);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(hero);
  measure();
  grip();
  syncGeometry(); render();
}
}

window.ElvanaTear = Object.assign(window.ElvanaTear || {}, { mountHero });
})();
