/* =========================================================================
   Elvana Media: pages/404.js. "Torn down" (INTERACTIONS.md).
   Scraps of old posters lie over the useful list. Grab one and it lifts
   off the wall and follows the hand 1:1, swinging a little with the pull;
   let go and it glides to a stop, or, thrown hard, sails off the wall.
   "Clear the wall" throws them all, one after another. Everything is
   interruptible: grab a scrap mid-flight and it stops where it is.

   Keyboard: the button; tabbing into the list (or the search) clears the
   wall so focus is never hidden. Touch: scraps pan sideways under a finger
   (vertical swipes still scroll the page). The search filters every page
   on the site; the count is announced politely. Reduced motion and no JS:
   handled in CSS (no scraps over the list). The loop runs only while a
   scrap is moving.
   ========================================================================= */
(() => {
'use strict';
const root = document.documentElement;
const E = window.Elvana || { timeScale: 1, announce() {}, feedback() {} };

/* ---- Search: a filter over every page ------------------------------------- */
const q = document.getElementById('q'), list = document.getElementById('results');
const none = document.getElementById('none'), count = document.getElementById('q-count');
if (q && list) {
  const items = [...list.children];
  const norm = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ');
  const hay = items.map(li => norm(li.textContent + ' ' + (li.dataset.k || '')));
  let t = 0;
  q.addEventListener('input', () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    if (!words.length) { list.classList.remove('is-searching'); none.hidden = true; count.textContent = ''; return; }
    list.classList.add('is-searching');
    let n = 0;
    items.forEach((li, i) => { const hit = words.every(w => hay[i].includes(w)); li.classList.toggle('is-match', hit); if (hit) n++; });
    none.hidden = n > 0;
    clearTimeout(t);
    t = setTimeout(() => { count.textContent = n ? `${n} ${n === 1 ? 'page matches' : 'pages match'}.` : 'Nothing matches. Try another word.'; }, 450);
  });
}

/* ---- Report the broken link, with the address filled in ---------------------- */
const report = document.getElementById('report');
if (report) {
  const body = `The address I tried: ${location.href}` + (document.referrer ? `\nThe page I came from: ${document.referrer}` : '');
  report.setAttribute('href', report.getAttribute('href') + '&body=' + encodeURIComponent(body));
}

/* ---- The scraps ------------------------------------------------------------- */
const wall = document.querySelector('.torn');
const box = document.getElementById('scraps');
const btn = document.getElementById('clear-wall');
const finder = document.getElementById('finder');
if (!wall || !box || !root.classList.contains('motion')) return;

/* Motion, named in one place:
   follow  the held scrap tracks the pointer 1:1; its swing eases toward
           a tilt set by the pull speed (time constant 90 ms)
   glide   a released scrap keeps its speed and slows with friction
           (time constant 170 ms): wheat paste grabbing it back
   fly     thrown faster than FLING px/ms it leaves the wall: friction
           drops (time constant 900 ms) and a little gravity pulls it down
   clear   "Clear the wall" throws each scrap 70 ms after the last        */
const M = { swing: 90, glide: 170, fly: 900, fling: .75, gravity: .0016, maxTilt: 14, stagger: 70 };
const scraps = [...box.querySelectorAll('.scrap')].map(el => ({ el, x: 0, y: 0, r: 0, r0: parseFloat(getComputedStyle(el).getPropertyValue('--r')) || 0, vx: 0, vy: 0, vr: 0, s: 1, held: false, flying: false, moving: false, gone: false }));
let raf = 0, last = 0, cleared = false, clearing = false, z = 20;

function draw(p) { p.el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) rotate(${(p.r0 + p.r).toFixed(2)}deg) scale(${p.s.toFixed(3)})`; }
function off(p, wb) {
  const r = p.el.getBoundingClientRect();
  return r.right < wb.left - 10 || r.left > wb.right + 10 || r.top > wb.bottom + 10 || r.bottom < wb.top - 160;
}
function step(now) {
  raf = 0;
  const dt = last ? Math.min(40, now - last) * E.timeScale : 16 * E.timeScale; last = now;
  let busy = false;
  const wb = wall.getBoundingClientRect();
  for (const p of scraps) {
    if (p.held || p.gone || !p.moving) continue;
    const k = Math.exp(-dt / (p.flying ? M.fly : M.glide));
    if (p.flying) p.vy += M.gravity * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
    p.vx *= k; if (!p.flying) p.vy *= k; p.vr *= Math.exp(-dt / 400);
    p.s += (1 - p.s) * (1 - Math.exp(-dt / 120));
    draw(p);
    if (off(p, wb)) { gone(p); continue; }
    if (p.flying || Math.hypot(p.vx, p.vy) > .004 || Math.abs(1 - p.s) > .002) busy = true;
    else p.moving = false;
  }
  if (busy) raf = requestAnimationFrame(step); else last = 0;
}
function run() { if (!raf) { last = 0; raf = requestAnimationFrame(step); } }
function gone(p) {
  p.gone = true; p.moving = false; p.flying = false;
  p.el.classList.add('is-gone');
  if (!cleared && scraps.every(s => s.gone)) {
    cleared = true;
    settled();
    E.announce(clearing ? 'Wall cleared. The list of pages is all visible.' : 'That was the last scrap. The list of pages is all visible.');
  }
}
const hint = document.querySelector('.torn__hint');
function settled() {                         // the wall is clear: the button has done its job
  if (!btn) return;
  const had = document.activeElement === btn;
  btn.hidden = true;
  if (hint) hint.textContent = 'Wall cleared. Everything useful is on the notice.';
  if (had && q) q.focus({ preventScroll: true });
}
function fling(p, vx, vy) {
  p.held = false; p.moving = true; p.flying = true;
  p.vx = vx; p.vy = vy; p.vr = vx * .06;
  p.el.classList.remove('is-held');
}

/* Pointer: grab, follow 1:1, release with the hand's speed */
scraps.forEach(p => {
  const el = p.el;
  let id = null, sx = 0, sy = 0, ox = 0, oy = 0, lx = 0, ly = 0, lt = 0, vx = 0, vy = 0, moved = false;
  el.addEventListener('pointerdown', e => {
    if (p.gone || (e.pointerType === 'mouse' && e.button !== 0)) return;
    id = e.pointerId; el.setPointerCapture(id);
    p.held = true; p.moving = false; p.flying = false; p.vx = p.vy = p.vr = 0;   // caught mid-flight: it stops where it is
    sx = e.clientX; sy = e.clientY; ox = p.x; oy = p.y; lx = sx; ly = sy; lt = e.timeStamp; vx = vy = 0; moved = false;
    el.style.zIndex = ++z; el.classList.add('is-held');
    p.s = 1.04; draw(p);
  });
  el.addEventListener('pointermove', e => {
    if (e.pointerId !== id || !p.held) return;
    const dt = Math.max(1, e.timeStamp - lt);
    const ivx = (e.clientX - lx) / dt, ivy = (e.clientY - ly) / dt;
    vx = vx * .6 + ivx * .4; vy = vy * .6 + ivy * .4;                       // a smoothed hand speed, px per ms
    lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
    p.x = ox + (e.clientX - sx); p.y = oy + (e.clientY - sy);
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 4) { moved = true; E.feedback('rip'); }
    const tilt = Math.max(-M.maxTilt, Math.min(M.maxTilt, vx * 9));
    p.r += (tilt - p.r) * (1 - Math.exp(-dt / M.swing));
    draw(p);
  });
  const release = e => {
    if (e.pointerId !== id) return;
    id = null; p.held = false; el.classList.remove('is-held');
    if (e.timeStamp - lt > 80) { vx = 0; vy = 0; }                            // held still before letting go: no throw
    const speed = Math.hypot(vx, vy);
    if (speed > M.fling && e.type === 'pointerup') fling(p, vx, vy);
    else { p.vx = vx * .6; p.vy = vy * .6; p.vr = 0; p.moving = true; }
    run();
  };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
  el.addEventListener('lostpointercapture', e => { if (p.held) release(e); });
});

/* Clear the wall: every scrap thrown off, one after another, away from the list's middle */
function clearWall() {
  if (clearing || cleared) return;
  clearing = true;
  if (btn) { btn.disabled = true; btn.textContent = 'Clearing the wall'; }
  const fb = finder.getBoundingClientRect(), cx = fb.left + fb.width / 2;
  const rest = scraps.filter(p => !p.gone);
  rest.forEach((p, i) => setTimeout(() => {
    if (p.gone || p.held) return;
    const r = p.el.getBoundingClientRect(), dir = (r.left + r.width / 2) < cx ? -1 : 1;
    fling(p, dir * (1.5 + Math.random() * .9), -.35 - Math.random() * .35);
    run();
    if (i === 0) E.feedback('rip');
  }, i * M.stagger / E.timeScale));
  // a scrap that somehow stays (held, or caught on an edge) is cleared once the throw is over
  setTimeout(() => scraps.forEach(p => { if (!p.gone && !p.held) gone(p); }), (rest.length * M.stagger + 1600) / E.timeScale);
}
if (btn) btn.addEventListener('click', () => {
  clearWall();
  setTimeout(() => { if (q) q.focus({ preventScroll: true }); }, (scraps.length * M.stagger + 600) / E.timeScale);
});
/* Keyboard: focus never lands under a scrap */
finder.addEventListener('focusin', () => { if (!cleared && scraps.some(p => !p.gone)) clearWall(); });
document.addEventListener('elvana:timescale', () => { last = 0; });
})();
