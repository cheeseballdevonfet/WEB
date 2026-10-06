/* =========================================================================
   Elvana Media: pages/about.js. "Layers of the wall" (INTERACTIONS.md).
   Six posters are pasted one over another in a sticky stage (about.css).
   Scrolling strips them back, the newest first: each poster comes away
   sheet by sheet along the paste seams, a roll of paper riding each peel
   line, leaving a ragged band at the top. In the team layer the initials
   posters peel to show each person's focus. Scrubbed by scroll, so it
   reverses on scroll-back and stops wherever the visitor stops.

   Keyboard and touch: scrolling (wheel, keys, swipe) drives it; the rail's
   six links jump to any layer. Screen readers get every layer in order;
   the current layer is announced politely. Reduced motion, no JS, or a
   screen too short for the stage: about.css shows the layers in flow and
   this script stands down. Sleeps when the wall is off screen.
   ========================================================================= */
(() => {
'use strict';
const root = document.documentElement;
const wall = document.getElementById('wall');
if (!wall || !root.classList.contains('motion')) return;
const E = window.Elvana || { timeScale: 1, announce() {}, feedback() {} };

const track = wall.querySelector('.wall__track');
const stage = wall.querySelector('.wall__stage');
const box = wall.querySelector('.wall__layers');
const rollsBox = wall.querySelector('.wall__rolls');
const layers = [...box.querySelectorAll(':scope > .layer')];
const links = [...wall.querySelectorAll('.wall__rail a')];
const arts = [...wall.querySelectorAll('.mate__art')];
const TEAM = layers.findIndex(l => l.id === 'team');

/* ---- Motion, named in one place ------------------------------------------
   The sequence is measured in stage heights of scrolling:
     dwell  the layer is whole and readable
     strip  its sheets peel away along the seams (staggered, smoothstep each)
     peel   the team's initials posters peel off their focus
   follow: the drawn state chases the scroll position with a 110 ms time
           constant (critically damped, no overshoot), so a hard flick reads
           as a fast strip instead of a jump.                                 */
const SEQ = [
  ['dwell', 0, .22], ['strip', 0, .66],
  ['dwell', 1, .36], ['strip', 1, .66],
  ['dwell', 2, .36], ['strip', 2, .66],
  ['dwell', 3, .24], ['peel', 3, .7], ['dwell', 3, .36], ['strip', 3, .66],
  ['dwell', 4, .36], ['strip', 4, .66],
  ['dwell', 5, .3]
];
const FOLLOW_MS = 110;
const SHEET_STAGGER = .5;      // the share of a strip spent starting sheets one after another
const MATE_STAGGER = .12;      // team posters start peeling this far apart
const smooth = q => q * q * (3 - 2 * q);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

let U = 0; const strip = [], dwellAt = []; let peel = null;
SEQ.forEach(([kind, i, len]) => {
  if (kind === 'strip') strip[i] = [U, U + len];
  else if (kind === 'peel') peel = [U, U + len];
  else dwellAt[i] = U + len / 2;               // the last dwell of a layer wins (team: after the peel)
  U += len;
});

/* seeded random, so every visit strips the same way */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---- Geometry ------------------------------------------------------------ */
let W = 0, H = 0, n = 6, xs = [], R = 28, rolls = [], order = [], tilt = [], remnant = [], mates = [];
function geometry() {
  W = box.clientWidth; H = box.clientHeight;
  const vw = innerWidth;
  n = vw >= 1100 ? 6 : vw >= 700 ? 4 : 2;            // one sheet = --sheet (base.css)
  xs = []; for (let k = 0; k <= n; k++) xs.push(k === n ? W : Math.round(k * vw / n));
  R = parseFloat(getComputedStyle(wall).getPropertyValue('--roll')) || 28;
  rolls.forEach(r => r.remove()); rolls = [];
  for (let s = 0; s < n; s++) {
    const r = document.createElement('i'); r.className = 'wall__roll';
    r.style.left = xs[s] + 'px'; r.style.width = (xs[s + 1] - xs[s]) + 'px';
    rollsBox.appendChild(r); rolls.push(r);
  }
  const deep = vw < 700 ? 9 : 14;
  layers.forEach((L, i) => {
    const rnd = rng(i * 97 + 11);
    const o = [...Array(n).keys()];
    for (let k = n - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; }
    order[i] = []; o.forEach((s, rank) => { order[i][s] = rank; });
    tilt[i] = xs.slice(0, n).map((x, s) => (rnd() * 2 - 1) * Math.min(9, (xs[s + 1] - x) * .03));
    // the ragged band a stripped poster leaves along the top of the wall
    let d = `M0 0L${W} 0`, x = W;
    while (x > 0) { const h = rnd() < .22 ? 0 : 2 + rnd() * deep; d += `L${x.toFixed(1)} ${h.toFixed(1)}`; x -= 10 + rnd() * 26; }
    remnant[i] = d + `L0 ${(2 + rnd() * deep).toFixed(1)}Z`;
  });
  mates = arts.map(a => {
    let roll = a.querySelector('.mate__roll');
    if (!roll) { roll = document.createElement('i'); roll.className = 'mate__roll'; roll.setAttribute('aria-hidden', 'true'); a.appendChild(roll); }
    return { art: a, sheet: a.querySelector('.mate__sheet'), roll, h: a.clientHeight, r: roll.offsetHeight || 22 };
  });
  drawn.fill(-1); drawnTeam = -1; rollOwner = -1; curlOn = -1;
}

/* ---- Drawing ------------------------------------------------------------- */
const drawn = new Array(layers.length).fill(-1);
let drawnTeam = -1, rollOwner = -1;
function setLayer(i, u) {
  if (drawn[i] === u) return; drawn[i] = u;
  const L = layers[i];
  if (u <= 0) { L.style.clipPath = ''; if (curlOn === i) curlOn = -1; if (rollOwner === i) rollsOff(); return; }
  const span = 1 - SHEET_STAGGER, step = n > 1 ? SHEET_STAGGER / (n - 1) : 0;
  const bottom = (H + R + 40).toFixed(1);
  let d = '', live = false;
  for (let s = 0; s < n; s++) {
    const q = smooth(clamp((u - order[i][s] * step) / span, 0, 1));
    const y = q * (H + R), t = tilt[i][s] * Math.min(1, q * 8);
    d += (s ? 'L' : 'M') + `${xs[s]} ${y.toFixed(1)}L${xs[s + 1]} ${(y + t).toFixed(1)}`;
    const roll = rolls[s];
    if (q > 0 && q < 1) {
      live = true;
      const k = .5 + .62 * q, w = xs[s + 1] - xs[s];
      roll.style.transform = `translate3d(0,${(y + t / 2 - R / 2).toFixed(1)}px,0) rotate(${Math.atan2(t, w).toFixed(4)}rad) scaleY(${k.toFixed(3)})`;
      roll.classList.add('on');
    } else roll.classList.remove('on');
  }
  d += `L${W} ${bottom}L0 ${bottom}Z`;
  L.style.clipPath = `path('${remnant[i]} ${d}')`;
  if (live && rollOwner !== i) { rollOwner = i; rollsBox.style.setProperty('--roll-ink', getComputedStyle(L).backgroundColor); }
  if (!live && rollOwner === i) rollOwner = -1;
}
/* the corner of the poster on top is already unstuck, curled to show the one beneath */
const curl = rollsBox.querySelector('.wall__curl');
let curlOn = -1;
function setCurl(top) {
  const show = top < layers.length - 1 && drawn[top] === 0 ? top : -1;
  if (curl) curl.classList.toggle('on', show > -1);
  if (show === curlOn) return;
  if (curlOn > -1 && drawn[curlOn] === 0) layers[curlOn].style.clipPath = '';
  curlOn = show;
  if (show > -1) { const c = curl ? curl.offsetWidth : 64; layers[show].style.clipPath = `polygon(0 0,100% 0,100% calc(100% - ${c}px),calc(100% - ${c}px) 100%,0 100%)`; }
}
function rollsOff() { rolls.forEach(r => r.classList.remove('on')); rollOwner = -1; }
function setTeam(u) {
  if (drawnTeam === u) return; drawnTeam = u;
  const span = 1 - MATE_STAGGER * (mates.length - 1);
  mates.forEach((m, j) => {
    const q = smooth(clamp((u - j * MATE_STAGGER) / span, 0, 1));
    if (q <= 0) { m.sheet.style.clipPath = ''; m.roll.classList.remove('on'); return; }
    const y = q * (m.h + m.r);
    m.sheet.style.clipPath = `inset(${y.toFixed(1)}px 0 0 0)`;
    if (q < 1) { m.roll.style.transform = `translate3d(0,${(y - m.r / 2).toFixed(1)}px,0) scaleY(${(.55 + .6 * q).toFixed(3)})`; m.roll.classList.add('on'); }
    else m.roll.classList.remove('on');
  });
}
let current = -1, sayTimer = 0;
function render(t) {
  for (let i = 0; i < layers.length - 1; i++) setLayer(i, clamp((t - strip[i][0]) / (strip[i][1] - strip[i][0]), 0, 1));
  if (peel) setTeam(clamp((t - peel[0]) / (peel[1] - peel[0]), 0, 1));
  let top = 0; while (top < layers.length - 1 && drawn[top] >= 1) top++;
  if (drawn[top] > 0 && curlOn === top) curlOn = -1;    // it started to strip: setLayer owns its clip now
  setCurl(top);
  let c = 0; while (c < layers.length - 1 && drawn[c] >= .5) c++;
  if (c !== current) {
    current = c;
    links.forEach((a, k) => k === c ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current'));
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => E.announce(`Layer ${c + 1} of ${layers.length}: ${layers[c].querySelector('h2').textContent.trim()}`), 700 / E.timeScale);
  }
}

/* ---- Scroll to timeline ---------------------------------------------------- */
function pinned() { return Math.max(1, track.offsetHeight - stage.offsetHeight); }
function stickTop() { return parseFloat(getComputedStyle(stage).top) || 0; }
function target() { return clamp((stickTop() - track.getBoundingClientRect().top) / pinned(), 0, 1) * U; }
function yFor(t) { return track.getBoundingClientRect().top + scrollY - stickTop() + (t / U) * pinned(); }

let cur = 0, tgt = 0, raf = 0, last = 0, awake = false, active = false;
function tick(now) {
  raf = 0;
  const dt = last ? Math.min(64, now - last) : 16; last = now;
  cur += (tgt - cur) * (1 - Math.exp(-dt * E.timeScale / FOLLOW_MS));
  if (Math.abs(tgt - cur) < 4e-4) cur = tgt;
  render(cur);
  if (cur !== tgt) raf = requestAnimationFrame(tick); else last = 0;
}
function kick() {
  if (!active || !awake) return;
  tgt = target();
  if (!raf && cur !== tgt) raf = requestAnimationFrame(tick);
}
function jump(t) { tgt = cur = t; render(cur); }

/* ---- Staged or flow --------------------------------------------------------
   The CSS decides first (html.js.motion and a screen at least 600px tall), so
   nothing shifts at load; this only steps back to flow if a layer would not
   fit whole in the stage (very large text, unusual screens).               */
const isStaged = () => !wall.classList.contains('is-flow') && getComputedStyle(stage).position === 'sticky';
function fits() { return layers.every(L => L.scrollHeight <= L.clientHeight + 2); }
function clear() {
  layers.forEach(L => { L.style.clipPath = ''; });
  arts.forEach(a => { const s = a.querySelector('.mate__sheet'); s && (s.style.clipPath = ''); });
  rollsOff(); drawn.fill(-1); drawnTeam = -1;
  curlOn = -1; if (curl) curl.classList.remove('on');
}
function decide() {
  wall.classList.remove('is-flow');
  let staged = isStaged();
  if (staged && !fits()) { wall.classList.add('is-flow'); staged = false; }
  if (!staged) { active = false; clear(); links.forEach(a => a.removeAttribute('aria-current')); return; }
  active = true;
  geometry();
  jump(target());
}

/* ---- Rail: jump to a layer (keyboard and touch) ----------------------------- */
links.forEach((a, k) => a.addEventListener('click', e => {
  if (!active) return;                      // flow: the plain #fragment link does the job
  e.preventDefault();
  scrollTo({ top: Math.round(yFor(dwellAt[k])), behavior: 'smooth' });
  try { history.replaceState(null, '', a.getAttribute('href')); } catch (_) {}
}));

function start() {
  try {
    decide();
    if (active && location.hash) {
      const k = layers.findIndex(L => '#' + L.id === location.hash);
      if (k > -1) { scrollTo({ top: Math.round(yFor(dwellAt[k])), behavior: 'instant' }); jump(dwellAt[k]); }
    }
  } catch (err) {                            // never leave a half-built stage: fall back to flow
    wall.classList.add('is-flow'); active = false; clear();
  }
}
addEventListener('scroll', kick, { passive: true });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(es => { awake = es[es.length - 1].isIntersecting; if (awake) kick(); }).observe(track);
} else awake = true;
let rz = 0;
const onResize = () => { clearTimeout(rz); rz = setTimeout(() => { try { decide(); } catch (_) { wall.classList.add('is-flow'); } }, 120); };
if ('ResizeObserver' in window) { let first = true; new ResizeObserver(() => { if (first) { first = false; return; } onResize(); }).observe(stage); }
else addEventListener('resize', onResize);
document.addEventListener('elvana:timescale', () => { last = 0; kick(); });

if (document.fonts && document.fonts.ready) document.fonts.ready.then(start, start); else start();
})();
