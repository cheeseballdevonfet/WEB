/* =========================================================================
   Elvana Media: pages/services.js
   1. ElvanaSpec: the small kit every service specimen uses (motion gate,
      time-scaled timers and Web Animations, sleep when off-screen, announce,
      paper sounds). Specimen scripts load after this file.
   2. The fly-poster wall (/services/ only, the page's one signature).
      Choosing Create, Connect or Grow tears the other posters off the wall
      and slaps the matching ones into place: an interruptible FLIP (each
      poster starts from wherever it is on screen, even mid-move), then one
      squeegee pass that pastes any poster coming back. Reduced motion: the
      wall re-lays itself without motion. No JS: all 14 posters, no filter.
   ========================================================================= */
(() => {
'use strict';
const root = document.documentElement;
const E = () => window.Elvana || {};
const motion = () => root.classList.contains('motion');
const ts = () => E().timeScale || 1;
// Named curves (mirrors of base.css): paste = every entrance and the squeegee settle,
// tug = gravity (a sheet letting go), lift = a corner lifting with one tiny overshoot.
const EASE = { paste: 'cubic-bezier(.2,.7,.1,1)', tug: 'cubic-bezier(.55,0,.75,.2)', lift: 'cubic-bezier(.3,1.3,.5,1)' };
const live = new Set();
document.addEventListener('elvana:timescale', () => live.forEach(a => { a.playbackRate = ts(); }));
/** Web Animation that honours reduced motion (returns null) and the slow-motion switch. */
function anim(el, kf, opt) {
  if (!motion() || !el || !el.animate) return null;
  const a = el.animate(kf, opt); a.id = 'svc'; a.playbackRate = ts(); live.add(a);
  const done = () => live.delete(a); a.finished.then(done, done);
  return a;
}
const after = (ms, fn) => setTimeout(fn, ms / ts());
/** Calls wake() when el comes near the viewport and sleep() when it leaves. */
function sleeper(el, wake, sleep, margin) {
  const st = { awake: false };
  if (!('IntersectionObserver' in window)) { st.awake = true; if (wake) wake(); return st; }
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting === st.awake) return;
    st.awake = e.isIntersecting; const f = st.awake ? wake : sleep; if (f) f();
  }), { rootMargin: margin || '120px 0px' }).observe(el);
  return st;
}
window.ElvanaSpec = { motion, EASE, anim, after, sleeper, say: t => E().announce && E().announce(t), fx: n => E().feedback && E().feedback(n), get ts() { return ts(); } };

/* ---------- 2. The fly-poster wall ---------- */
const wall = document.querySelector('[data-wall]');
if (!wall) return;
const posters = [...wall.querySelectorAll('.fp')];
const blade = wall.querySelector('.fp-blade');
const bar = document.querySelector('.fp-bar');
const ctrls = [...document.querySelectorAll('[data-filter]')];
const notes = [...document.querySelectorAll('[data-note]')];
const NAMES = { all: 'all', create: 'Create', connect: 'Connect', grow: 'Grow' };
const lenOf = p => p.querySelector('h3').textContent.trim().length;
let current = 'all';

// Spans on the 12-column wall for desktop, tablet and phone, so every row is pasted edge to edge.
// Desktop: rows of three (5/4/3 by name length), the last rows in twos (7/5). Tablet: twos.
// Phone: two short names share a row, anything longer gets the full width.
function spans(L) {
  const n = L.length, d = [], t = [], p = [], rows = [];
  for (let left = n; left > 0;) {
    if (n <= 3) { rows.push(left); left = 0; }
    else if (left === 4) { rows.push(2, 2); left = 0; }
    else if (left <= 2) { rows.push(left); left = 0; }
    else { rows.push(3); left -= 3; }
  }
  let i = 0;
  for (const r of rows) {
    if (r === 1) d.push(12);
    else if (r === 2) d.push(...(L[i] >= L[i + 1] ? [7, 5] : [5, 7]));
    else { const ix = [i, i + 1, i + 2], rk = ix.slice().sort((a, b) => L[b] - L[a]), sz = {}; sz[rk[0]] = 5; sz[rk[1]] = 4; sz[rk[2]] = 3; ix.forEach(j => d.push(sz[j])); }
    i += r;
  }
  for (let k = 0; k < n; k += 2) t.push(...(k + 1 < n ? (L[k] >= L[k + 1] ? [7, 5] : [5, 7]) : [12]));
  for (let k = 0; k < n;) { if (k + 1 < n && L[k] <= 13 && L[k + 1] <= 13) { p.push(6, 6); k += 2; } else { p.push(12); k++; } }
  return [d, t, p];
}
function relayout() {
  const vis = posters.filter(p => !p.hidden), [d, t, p] = spans(vis.map(lenOf));
  vis.forEach((el, i) => { el.style.setProperty('--s', d[i]); el.style.setProperty('--st', t[i]); el.style.setProperty('--sp', p[i]); });
}
// Where a poster is on screen right now (mid-animation included), relative to the wall
function box(p, wr) {
  const r = p.getBoundingClientRect();
  let h = r.height;
  const m = /inset\(([^)]*)\)/.exec(getComputedStyle(p).clipPath || '');
  if (m) { const v = m[1].trim().split(/\s+/).map(parseFloat); const b = v.length < 3 ? v[0] : v[2]; h -= (b || 0) * (r.width / (p.offsetWidth || r.width)); }
  return { x: r.left - wr.left, y: r.top - wr.top, w: r.width, h: Math.max(1, h) };
}
function stop() {
  posters.forEach(p => { p.getAnimations().forEach(a => { if (a.id === 'svc') a.cancel(); }); p.classList.remove('is-moving'); });
  blade.getAnimations().forEach(a => a.cancel());
}
function scrap(p, F, i, wr) {
  const c = p.cloneNode(true);
  c.hidden = false; c.removeAttribute('style'); c.classList.remove('is-moving'); c.classList.add('fp-scrap');
  c.setAttribute('aria-hidden', 'true'); c.inert = true;
  c.querySelectorAll('a').forEach(a => { a.removeAttribute('href'); a.tabIndex = -1; });
  const dir = i % 2 ? 1 : -1, fall = Math.max(260, Math.min(innerHeight, wr.height - F.y + 80));
  Object.assign(c.style, { left: F.x + 'px', top: F.y + 'px', width: F.w + 'px', height: F.h + 'px', transformOrigin: dir > 0 ? '0 0' : '100% 0' });
  wall.insertBefore(c, blade);
  // the far top corner lets go first and the poster swings on the other; then gravity takes it
  const a = anim(c, [
    { transform: 'translate(0,0) rotate(0deg)', opacity: 1, easing: EASE.lift },
    { transform: `translate(0,4px) rotate(${dir * 6}deg)`, opacity: 1, offset: .24, easing: EASE.tug },
    { transform: `translate(${-dir * 6}%,${fall}px) rotate(${dir * 22}deg)`, opacity: 1, offset: .86 },
    { transform: `translate(${-dir * 7}%,${fall * 1.12}px) rotate(${dir * 25}deg)`, opacity: 0 }
  ], { duration: 860, delay: i * 34, fill: 'backwards' });
  const gone = () => c.remove();
  if (a) a.finished.then(gone, gone); else gone();
}
function apply(f) {
  if (!NAMES[f]) return;
  ctrls.forEach(c => { if (c.tagName === 'BUTTON') c.setAttribute('aria-pressed', String(c.dataset.filter === f)); });
  notes.forEach(n => { n.hidden = n.dataset.note !== f; });
  if (f === current) return;
  current = f;
  const want = p => f === 'all' || p.dataset.pillars.split(' ').includes(f);
  const moving = motion() && !!wall.animate;
  // inside the wall? bring its top up under the sticky bar first, so the result is seen from the top
  const hdr = parseFloat(getComputedStyle(root).getPropertyValue('--hdr')) || 64;
  const top0 = wall.getBoundingClientRect().top, under = hdr + (bar ? bar.offsetHeight : 0);
  if (top0 < under - 2) scrollTo({ top: scrollY + top0 - under, behavior: 'instant' });
  else if (top0 > innerHeight * .5) scrollTo({ top: scrollY + top0 - under, behavior: moving ? 'smooth' : 'instant' });
  const wr = wall.getBoundingClientRect();
  const first = new Map();
  if (moving) posters.forEach(p => { if (!p.hidden) first.set(p, box(p, wr)); });
  stop();
  const leaving = [], entering = [], staying = [];
  posters.forEach(p => {
    const w = want(p);
    if (w) (p.hidden ? entering : staying).push(p); else if (!p.hidden) leaving.push(p);
    p.hidden = !w;
  });
  relayout();
  const n = posters.filter(p => !p.hidden).length;
  ElvanaSpec.say(f === 'all' ? `Showing all ${n} services.` : `Showing the ${n} ${NAMES[f]} services. The others are torn down.`);
  if (!moving) return;
  if (leaving.length) ElvanaSpec.fx('rip');
  leaving.forEach((p, i) => scrap(p, first.get(p), i, wr));
  const wr2 = wall.getBoundingClientRect();
  staying.forEach((p, i) => {
    const F = first.get(p), r = p.getBoundingClientRect();
    const L = { x: r.left - wr2.left, y: r.top - wr2.top, w: r.width, h: r.height };
    const s = F.w / L.w, tx = F.x - L.x, ty = F.y - L.y;
    if (Math.abs(tx) < 1 && Math.abs(ty) < 1 && Math.abs(s - 1) < .005 && Math.abs(F.h - L.h) < 1) return;
    const b = Math.max(0, L.h - F.h / s);           // keep its visible height; never squash the print
    p.classList.add('is-moving');
    const a = anim(p, [
      { transform: `translate(${tx}px,${ty}px) scale(${s})`, clipPath: `inset(0px 0px ${b}px 0px)` },
      { transform: 'translate(0px,0px) scale(1)', clipPath: 'inset(0px 0px 0px 0px)' }
    ], { duration: 500, delay: 80 + i * 24, easing: EASE.paste, fill: 'backwards' });
    if (a) a.finished.then(() => p.classList.remove('is-moving'), () => {});
  });
  // one squeegee pass; posters coming back are pasted on as its wet edge crosses them
  const W = wr2.width, BW = 180, D = 680, T0 = 200;
  const b = anim(blade, [{ transform: `translateX(${-BW}px)`, opacity: 1 }, { transform: `translateX(${W}px)`, opacity: 1 }], { duration: D, delay: T0, easing: 'linear' });
  if (b) b.finished.then(() => ElvanaSpec.fx('paste'), () => {});
  entering.forEach(p => {
    const r = p.getBoundingClientRect(), x0 = r.left - wr2.left;
    anim(p, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
      { duration: D * r.width / (W + BW), delay: T0 + D * x0 / (W + BW), easing: 'linear', fill: 'backwards' });
  });
}
ctrls.forEach(c => c.addEventListener('click', e => {
  const f = c.dataset.filter;
  if (c.tagName !== 'A') { apply(f); return; }
  // a pillar's link: travel to the wall, then filter it where it can be seen
  e.preventDefault();
  const target = bar || wall, hdr = parseFloat(getComputedStyle(root).getPropertyValue('--hdr')) || 64;
  const y = scrollY + target.getBoundingClientRect().top - hdr;
  const btn = bar && bar.querySelector(`[data-filter="${f}"]`);
  let done = false;
  const go = () => { if (done) return; done = true; if (btn) btn.focus({ preventScroll: true }); apply(f); };
  if (Math.abs(y - scrollY) < 8) { go(); return; }
  scrollTo({ top: y, behavior: motion() ? 'smooth' : 'instant' });
  if (motion() && 'onscrollend' in window) addEventListener('scrollend', go, { once: true });
  setTimeout(go, motion() ? 900 : 0);
}));
})();
