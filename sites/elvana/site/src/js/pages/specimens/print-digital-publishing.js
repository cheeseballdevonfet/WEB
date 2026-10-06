/* Specimen: Print & Digital Publishing. Drag the page's bottom-right corner (mouse, pen or
   touch) and the page folds back along the line halfway between the corner and your hand;
   let go past the middle and it turns, otherwise it settles back. The button turns it (and
   back). Only clip-paths move. Reduced motion: it turns at once. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="mag"]');
if (!S || !f) return;
const mag = f.querySelector('.mag'), p1 = f.querySelector('.mag-p1'), p2 = f.querySelector('.mag-p2');
const flap = f.querySelector('.mag-flap'), grip = f.querySelector('.mag-grip'), btn = f.querySelector('.mag-btn');
const EAR = 34;
let W = 0, H = 0, P = null, turned = false, held = null, tween = 0;
f.classList.add('is-live');
const poly = pts => pts.length < 3 ? 'polygon(0 0,0 0,0 0)' : 'polygon(' + pts.map(p => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',') + ')';
// keep the part of a polygon where side(p) has sign s (Sutherland-Hodgman against one line)
function cut(pts, side, s) {
  const out = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], fa = side(a) * s, fb = side(b) * s;
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  });
  return out;
}
function fold(p) {
  P = p;
  const cx = W, cy = H, mx = (cx + p[0]) / 2, my = (cy + p[1]) / 2;
  let nx = cx - p[0], ny = cy - p[1]; const L = Math.hypot(nx, ny);
  if (L < .5) { p1.style.clipPath = ''; flap.style.clipPath = poly([]); return; }
  nx /= L; ny /= L;
  const side = q => (q[0] - mx) * nx + (q[1] - my) * ny, rect = [[0, 0], [W, 0], [W, H], [0, H]];
  p1.style.clipPath = poly(cut(rect, side, -1));
  flap.style.clipPath = poly(cut(rect, side, 1).map(q => { const d = side(q); return [q[0] - 2 * d * nx, q[1] - 2 * d * ny]; }));
  flap.style.setProperty('--fa', (Math.atan2(ny, nx) * 180 / Math.PI + 90).toFixed(1));
}
const rest = () => [W - EAR, H - EAR], away = () => [-W * 1.02, H];
function measure() { const r = mag.getBoundingClientRect(); W = r.width; H = r.height; fold(turned ? away() : P && held ? P : rest()); }
function go(to, done) {
  cancelAnimationFrame(tween);
  const from = P.slice(), t0 = performance.now(), D = 640;
  if (!S.motion()) { fold(to); done && done(); return; }
  const step = now => {
    const k = Math.min(1, (now - t0) * S.ts / D), e = 1 - Math.pow(1 - k, 3);
    // the corner travels in an arc, lifting a little as it crosses the page
    fold([from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e - Math.sin(e * Math.PI) * H * .18]);
    if (k < 1) tween = requestAnimationFrame(step); else if (done) done();
  };
  tween = requestAnimationFrame(step);
}
function setTurned(on) {
  turned = on;
  f.classList.toggle('is-turned', on);
  p1.setAttribute('aria-hidden', String(on)); p2.setAttribute('aria-hidden', String(!on));
  btn.textContent = on ? 'Turn back' : 'Turn the page';
}
function turn(on) {
  if (on) { S.fx('paste'); go(away(), () => setTurned(true)); S.say('Turned to the regional-language edition.'); }
  else { setTurned(false); fold(away()); go(rest()); S.say('Back to the English edition.'); }
}
btn.addEventListener('click', () => turn(!turned));
grip.addEventListener('pointerdown', e => {
  if (turned || e.button > 0) return;
  cancelAnimationFrame(tween);
  const r = mag.getBoundingClientRect();
  held = { id: e.pointerId, dx: P[0] - (e.clientX - r.left), dy: P[1] - (e.clientY - r.top) };
  mag.classList.add('is-held');
  try { grip.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
  e.preventDefault();
});
grip.addEventListener('pointermove', e => {
  if (!held || e.pointerId !== held.id) return;
  const r = mag.getBoundingClientRect();
  fold([Math.min(W - 2, e.clientX - r.left + held.dx), Math.min(H + H * .3, e.clientY - r.top + held.dy)]);
});
const up = e => {
  if (!held || e.pointerId !== held.id) return;
  held = null; mag.classList.remove('is-held');
  if (P[0] < W * .55) turn(true); else go(rest());
};
grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
new ResizeObserver(measure).observe(mag);
setTurned(false);
measure();
})();
