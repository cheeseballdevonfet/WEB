/* Specimen: Branding & Identity. Turns the sample brand book's leaves on the spine: drag a
   page across (mouse, pen or touch; it follows your hand and settles either way), use the
   buttons, or the arrow keys on the buttons. The closed book sits centred. Only the two pages
   on show are exposed to screen readers. Reduced motion: pages change without turning. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="bb"]');
if (!S || !f) return;
const book = f.querySelector('.bb'), leaves = [...f.querySelectorAll('.bb-leaf')], N = leaves.length;
const prev = f.querySelector('.bb-prev'), next = f.querySelector('.bb-next'), where = f.querySelector('.bb-where');
const NAMES = ['Cover', 'The mark and clear space', 'Colour and type', 'Voice: what we say and what we do not', 'Packaging and signage', 'Back cover'];
let at = 0, drag = null, busy = null;
f.classList.add('is-live');
const pose = (l, deg) => { l.style.transform = `rotateY(${-deg}deg)`; l.style.setProperty('--sh', (Math.sin(deg * Math.PI / 180) * .28).toFixed(3)); };
function layout() {
  leaves.forEach((l, i) => {
    const turned = i < at;
    l.style.zIndex = turned ? i + 1 : 2 * N - i;
    pose(l, turned ? 180 : 0);
    const [front, back] = l.children;
    front.setAttribute('aria-hidden', String(i !== at));
    back.setAttribute('aria-hidden', String(i !== at - 1));
  });
  book.style.setProperty('--shift', at === 0 ? -1 : at === N ? 1 : 0);
  prev.disabled = at === 0; next.disabled = at === N;
  where.textContent = NAMES[at];
}
function turn(dir, from) {
  const i = dir > 0 ? at : at - 1;
  if (i < 0 || i >= N) return;
  if (busy) { const b0 = busy; busy = null; b0.finish(); layout(); }
  const l = leaves[i], a = from != null ? from : dir > 0 ? 0 : 180, b = dir > 0 ? 180 : 0;
  at += dir;
  l.style.zIndex = 3 * N;
  where.textContent = NAMES[at];
  const an = S.anim(l, [{ transform: `rotateY(${-a}deg)` }, { transform: `rotateY(${-b}deg)` }], { duration: 160 + 620 * Math.abs(b - a) / 180, easing: S.EASE.paste });
  if (an) { busy = an; book.style.setProperty('--shift', at === 0 ? -1 : at === N ? 1 : 0); an.finished.then(() => { if (busy === an) { busy = null; layout(); } }, () => {}); } else layout();
  S.say(NAMES[at] + '.');
}
function settle(i, deg, forward) {
  // let go mid-turn: finish the turn past the middle, otherwise lay the page back
  const goes = deg > 90;
  if (forward ? goes : !goes) { at = forward ? i : i + 1; turn(forward ? 1 : -1, deg); return; }
  const l = leaves[i], an = S.anim(l, [{ transform: `rotateY(${-deg}deg)` }, { transform: `rotateY(${forward ? 0 : -180}deg)` }], { duration: 200 + 300 * (forward ? deg : 180 - deg) / 180, easing: S.EASE.paste });
  if (an) an.finished.then(layout, () => {}); else layout();
}
prev.addEventListener('click', () => turn(-1));
next.addEventListener('click', () => turn(1));
[prev, next].forEach(b => b.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); turn(e.key === 'ArrowRight' ? 1 : -1); (e.key === 'ArrowRight' ? next : prev).focus(); }
}));
book.addEventListener('pointerdown', e => {
  if (busy || e.button > 0) return;
  const r = book.getBoundingClientRect(), right = e.clientX > r.left + r.width / 2;
  const i = right ? at : at - 1;
  if (i < 0 || i >= N) return;
  drag = { i, x0: e.clientX, w: r.width / 2, forward: right, deg: right ? 0 : 180, id: e.pointerId };
  leaves[i].style.zIndex = 3 * N;
  book.classList.add('is-grabbing');
  try { book.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
});
book.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x0, k = Math.min(1, Math.max(0, (drag.forward ? -dx : dx) / (drag.w * 1.6)));
  drag.deg = drag.forward ? k * 180 : 180 - k * 180;
  pose(leaves[drag.i], drag.deg);
});
const up = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const d = drag; drag = null; book.classList.remove('is-grabbing');
  if (Math.abs(d.deg - (d.forward ? 0 : 180)) < 4) { layout(); return; }   // a click, not a drag
  settle(d.i, d.deg, d.forward);
};
book.addEventListener('pointerup', up); book.addEventListener('pointercancel', up);
layout();
})();
