/* Specimen: Content & Video Production. Drag along the strip (mouse or pen), tap a frame
   (touch), or use the slider (keyboard) to scrub from storyboard to finished. It starts at
   the storyboard and, the first time it is seen, rolls through once on its own; any touch
   stops that. Reduced motion: it stays finished and moves only when you move it. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="vid"]');
if (!S || !f) return;
const strip = f.querySelector('.vid-strip'), range = f.querySelector('#vid-p'), stage = f.querySelector('.vid-stage');
const NAMES = ['Wide shot', 'Close-up', 'Insert', 'End card'];
let p = 1, roll = null, drag = false, kind = '';
function set(v, user) {
  p = Math.min(1, Math.max(0, v));
  if (user && roll) { roll.cancel(); roll = null; }
  f.style.setProperty('--p', p.toFixed(4));
  range.value = Math.round(p * 100);
  const n = p <= .005 ? 'Storyboard' : p >= .995 ? 'Finished' : NAMES[Math.min(3, Math.floor(p * 4))];
  if (stage.textContent !== n) stage.textContent = n;
}
const along = e => {
  const r = f.querySelector('.vid-frames').getBoundingClientRect();
  return matchMedia('(max-width:699px)').matches ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
};
strip.addEventListener('pointerdown', e => {
  kind = e.pointerType;
  if (kind === 'touch') return;               // touch: a tap seeks (click below); drags keep scrolling the page
  drag = true; strip.setPointerCapture(e.pointerId); set(along(e), true);
});
strip.addEventListener('pointermove', e => { if (drag) set(along(e), true); });
const end = () => { if (drag) { drag = false; S.say(`${stage.textContent}.`); } };
strip.addEventListener('pointerup', end); strip.addEventListener('pointercancel', end);
strip.addEventListener('click', e => { if (kind !== 'touch') return; set(Math.ceil(along(e) * 4) / 4, true); S.say(`${stage.textContent}.`); });
range.addEventListener('input', () => set(range.value / 100, true));
range.addEventListener('change', () => S.say(`${stage.textContent}.`));
if (S.motion()) {
  set(0);
  // first sight: roll the strip once from storyboard to finished, like a rough cut playing
  let seen = false;
  S.sleeper(f, () => {
    if (seen) return; seen = true;
    const o = { v: 0 }, t0 = performance.now(), D = 3200;
    roll = { cancel() { o.stop = true; } };
    const step = now => { if (o.stop) return; const k = Math.min(1, (now - t0) * S.ts / D); set(k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); if (k < 1) requestAnimationFrame(step); else roll = null; };
    S.after(500, () => requestAnimationFrame(step));
  }, null, '-25% 0px');
} else set(1);
})();
