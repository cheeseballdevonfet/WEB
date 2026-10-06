/* =========================================================================
   Elvana Media: pages/industries.js
   "The tri-vision hoarding" (INTERACTIONS.md). Pick a sector (tabs, arrow
   keys, or a swipe across the board) and the slats turn one by one.
   - Each slat is a triangular prism with a damped spring
       turn: k 190, c 20 (zeta .73, a few degrees of overshoot), mass 1
     and starts 34-60 ms after its left neighbour (the stagger).
   - Physically honest: a sector is only ever painted on a face that is
     turned away from you at that moment, and each pick turns the slats
     forward to the next hidden face. A pick mid-turn retargets the springs
     from wherever they are, at the speed they have: fully interruptible.
   - At rest the slats hide and the board is real HTML again (the tab
     panel, with real links). The loop only runs while turning, and snaps
     to rest if the board leaves the screen.
   Sector content is read from the plain list (#sectors), so there is one
   source. Reduced motion: no slats, the board changes in place.
   ========================================================================= */
(() => {
'use strict';
const wrap = document.querySelector('[data-tv]');
if (!wrap) return;
const root = document.documentElement;
const E = window.Elvana || { announce() {}, feedback() {}, timeScale: 1 };
const motionOK = root.classList.contains('motion');
const slow = () => E.timeScale || 1;
const TURN = { k: 190, c: 20 };      // turn: zeta = 20 / (2 * sqrt(190)) = .73
const tv = wrap.querySelector('.tv');
const screen = tv.querySelector('.tv__screen');
const flat = tv.querySelector('.tv__flat');
const slatsEl = tv.querySelector('.tv__slats');
const pick = wrap.querySelector('.tv-pick');
const tabs = [...pick.querySelectorAll('button')];

/* ---- sectors, from the plain list ---- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const sectors = [...document.querySelectorAll('.sector-list > li')].map(li => ({
  ground: li.dataset.ground || 'g-paper',
  roots: li.hasAttribute('data-roots'),
  name: li.querySelector('h3').textContent.trim(),
  need: li.querySelector(':scope > p').textContent.trim(),
  services: [...li.querySelectorAll('.often a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })),
}));
if (!sectors.length) return;
const board = (s, links) =>
  `<p class="tv-name">${esc(s.name)}</p><p class="tv-need">${esc(s.need)}</p>` +
  `<div class="tv-fit"><p class="tv-fit__l">Services that often fit</p><ul>${s.services.map(x => `<li>${links ? `<a href="${esc(x.href)}">${esc(x.text)}</a>` : `<span>${esc(x.text)}</span>`}</li>`).join('')}</ul></div>` +
  (s.roots ? '<p class="tv-roots">Group roots: a head start here</p>' : '');
let current = 0;

/* ---- tabs (WAI-ARIA tabs, automatic activation, roving tabindex) ---- */
pick.setAttribute('role', 'tablist');
flat.setAttribute('role', 'tabpanel');
tabs.forEach((t, i) => {
  t.setAttribute('role', 'tab');
  t.setAttribute('aria-controls', flat.id);
  t.addEventListener('click', () => select(i));
  t.addEventListener('keydown', e => {
    const n = tabs.length;
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
    if (to == null) return;
    e.preventDefault();
    const j = (to + n) % n;
    tabs[j].focus(); select(j);
  });
});
function mark(i) {
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  flat.setAttribute('aria-labelledby', tabs[i].id);
}
mark(0);

function paintFlat(i) {
  flat.className = 'tv__flat tv-art ' + sectors[i].ground;
  flat.innerHTML = board(sectors[i], true);
}

function select(i) {
  if (i === current) return;
  current = i;
  mark(i);
  const s = sectors[i];
  E.announce(`${s.name}. ${s.need} Services that often fit: ${s.services.map(x => x.text).join(', ')}.`);
  if (!motionOK) { paintFlat(i); return; }
  if (!slats.length) build();
  turnTo(i);
}

/* ---- slats ---- */
let slats = [], n = 0, r = 0, raf = 0, last = 0, onScreen = true;
const paint = (face, i) => { if (face.sector === i) return; face.sector = i; face.art.className = 'tv-art ' + sectors[i].ground; face.art.innerHTML = board(sectors[i], false); };
function build() {
  n = parseInt(getComputedStyle(screen).getPropertyValue('--n'), 10) || 12;
  slatsEl.textContent = '';
  slats = [];
  for (let i = 0; i < n; i++) {
    const slat = document.createElement('div'); slat.className = 'tv-slat'; slat.style.setProperty('--i', i);
    const prism = document.createElement('div'); prism.className = 'tv-prism';
    const faces = [0, 1, 2].map(f => {
      const el = document.createElement('div'); el.className = 'tv-f'; el.style.setProperty('--f', f);
      const art = document.createElement('div'); const sh = document.createElement('i'); sh.className = 'tv-sh';
      el.append(art, sh); prism.append(el);
      return { el, art, sh, sector: -1 };
    });
    slat.append(prism); slatsEl.append(slat);
    const s = { prism, faces, angle: 0, vel: 0, target: 0, pending: null, at: 0 };
    paint(faces[0], shown);
    slats.push(s);
  }
  measure();
  slats.forEach(apply);
}
function measure() {
  const w = screen.clientWidth / (n || 1);
  r = w / (2 * Math.sqrt(3));                 // a triangle's inradius: centre to face
  slatsEl.style.setProperty('--r', r.toFixed(2) + 'px');
}
function apply(s) {
  s.prism.style.transform = `translateZ(${(-r).toFixed(2)}px) rotateY(${(-s.angle).toFixed(3)}deg)`;
  // light from the front-left: a face darkens as it turns away
  for (let f = 0; f < 3; f++) {
    let d = ((f * 120 - s.angle) % 360 + 540) % 360 - 180;           // face angle from the viewer, -180..180
    const c = Math.cos(d * Math.PI / 180);
    s.faces[f].sh.style.opacity = c > 0 ? ((1 - c) * (d > 0 ? .78 : .5)).toFixed(3) : '.8';
  }
}

let shown = 0;                       // the sector the slats are turning to (or showing)
function turnTo(i) {
  shown = i;
  tv.classList.add('is-turning');
  const now = performance.now();
  const gap = Math.max(34, Math.min(60, 560 / n));       // stagger: one slat after another, left to right
  slats.forEach((s, k) => {
    if (s.pending == null) s.at = now + (k * gap) / slow();
    s.pending = i;
  });
  if (!onScreen) { snap(); return; }
  if (!raf) { last = now; raf = requestAnimationFrame(frame); }
}
function retarget(s, i) {
  // the next face that is turned away from the viewer (more than 90 degrees ahead)
  const t = Math.ceil((s.angle + 90.5) / 120) * 120;
  paint(s.faces[((t / 120) % 3 + 3) % 3], i);
  s.target = t;
}
function frame(now) {
  const dt = Math.min(.032, (now - last) / 1000) * slow();
  last = now;
  let busy = false;
  for (const s of slats) {
    if (s.pending != null) {
      if (now >= s.at) { retarget(s, s.pending); s.pending = null; } else busy = true;
    }
    const x = s.target - s.angle;
    if (Math.abs(x) < .04 && Math.abs(s.vel) < .04) { if (s.angle !== s.target) { s.angle = s.target; s.vel = 0; apply(s); } continue; }
    s.vel += (TURN.k * x - TURN.c * s.vel) * dt;
    s.angle += s.vel * dt;
    apply(s);
    busy = true;
  }
  if (busy) raf = requestAnimationFrame(frame);
  else { raf = 0; rest(); }
}
function rest() {
  paintFlat(shown);
  tv.classList.remove('is-turning');
}
function snap() {                     // jump to the end state (off-screen, or a resize)
  if (raf) { cancelAnimationFrame(raf); raf = 0; }
  slats.forEach(s => { if (s.pending != null) { retarget(s, s.pending); s.pending = null; } s.angle = s.target; s.vel = 0; apply(s); });
  rest();
}

/* ---- sleep off-screen; rebuild on a breakpoint change ---- */
new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (!onScreen && raf) snap(); }).observe(tv);
if (motionOK) {
  // build the slats before they are needed, once the board is near
  const near = new IntersectionObserver(es => { if (es[0].isIntersecting) { if (!slats.length) build(); near.disconnect(); } }, { rootMargin: '300px 0px' });
  near.observe(tv);
  let rt;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (!slats.length) return;
      const want = parseInt(getComputedStyle(screen).getPropertyValue('--n'), 10) || 12;
      if (raf) snap();
      if (want !== n) build(); else { measure(); slats.forEach(apply); }
    }, 120);
  }).observe(screen);
}

/* ---- swipe the board: left for the next sector, right for the previous ---- */
let sx = null, sy = 0, swiped = false;
screen.addEventListener('pointerdown', e => { if (e.button) return; sx = e.clientX; sy = e.clientY; swiped = false; });
screen.addEventListener('pointermove', e => {
  if (sx == null || swiped) return;
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    swiped = true;
    select((current + (dx < 0 ? 1 : -1) + sectors.length) % sectors.length);
  }
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => screen.addEventListener(t, () => { sx = null; }));
// a swipe that started on a link must not also follow it
screen.addEventListener('click', e => { if (swiped && e.target.closest('a')) { e.preventDefault(); swiped = false; } }, true);
})();
