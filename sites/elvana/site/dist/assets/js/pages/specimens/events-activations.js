/* Specimen: Events & Activations. Pull the stub away from the perforation (mouse, pen or
   touch): it swings on its top corner, follows the hand, and past the tear point it rips off
   and falls; let go early and it springs back. The button does the same tear. Then the
   ticket is checked in and the digital tie-ins tick off. Reduced motion: no swing or fall. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="tk"]');
if (!S || !f) return;
const stub = f.querySelector('.tk-stub'), btn = f.querySelector('.tk-btn'), items = [...f.querySelectorAll('.tk-list li')];
const TEAR = 18;                                         // degrees of swing at which the perforation gives
let held = null, deg = 0, torn = false;
f.classList.add('is-live');
const pose = () => { stub.style.transform = deg ? `translate(${deg * .6}px,${deg * .35}px) rotate(${deg}deg)` : ''; };
function rip() {
  if (torn) return;
  torn = true; S.fx('rip');
  btn.textContent = 'New ticket';
  const from = stub.style.transform || 'none';
  const a = S.anim(stub, [{ transform: from, opacity: 1 }, { transform: `translate(${30 + deg}px,180px) rotate(${deg + 34}deg)`, opacity: 0 }], { duration: 720, easing: S.EASE.tug });
  const done = () => {
    f.classList.add('is-torn'); stub.style.transform = ''; deg = 0;
    const tk = f.querySelector('.tk-in');
    S.anim(tk, [{ transform: 'rotate(-9deg) scale(1.7)', opacity: 0 }, { transform: 'rotate(-9deg) scale(.95)', opacity: 1, offset: .7 }, { transform: 'rotate(-9deg) scale(1)', opacity: 1 }], { duration: 380, easing: S.EASE.paste });
    S.fx('stamp');
    items.forEach((li, i) => (S.motion() ? S.after(260 + i * 260, () => li.classList.add('is-done')) : li.classList.add('is-done')));
    S.say('Stub torn off. Checked in: registration confirmed on WhatsApp, a reminder before the day, live on social on the night, and post-event content to follow.');
  };
  if (a) a.finished.then(done, done); else done();
}
function reset() {
  torn = false; deg = 0; pose();
  f.classList.remove('is-torn'); items.forEach(li => li.classList.remove('is-done'));
  btn.textContent = 'Tear the stub';
  S.anim(stub, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 420, easing: S.EASE.paste });
  S.say('A new ticket, stub attached.');
}
btn.addEventListener('click', () => {
  if (torn) { reset(); return; }
  if (!S.motion()) { rip(); return; }
  // the same tear, scripted: a quick pull past the tear point
  const t0 = performance.now(), D = 260;
  const step = now => { const k = Math.min(1, (now - t0) * S.ts / D); deg = (TEAR + 4) * (1 - Math.pow(1 - k, 2)); pose(); if (k < 1) requestAnimationFrame(step); else rip(); };
  requestAnimationFrame(step);
});
stub.addEventListener('pointerdown', e => {
  if (torn || e.button > 0) return;
  held = { id: e.pointerId, x0: e.clientX, y0: e.clientY };
  stub.classList.add('is-held');
  try { stub.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
  e.preventDefault();
});
stub.addEventListener('pointermove', e => {
  if (!held || e.pointerId !== held.id) return;
  // pulling away (right or down) swings it open on its top corner
  deg = Math.max(0, Math.min(40, ((e.clientX - held.x0) * .6 + (e.clientY - held.y0) * .8) / 5));
  if (S.motion()) pose();
  if (deg > TEAR) { held = null; stub.classList.remove('is-held'); rip(); }
});
const up = e => {
  if (!held || e.pointerId !== held.id) return;
  held = null; stub.classList.remove('is-held');
  if (deg > 0 && !torn) {
    const from = stub.style.transform; deg = 0; pose();
    S.anim(stub, [{ transform: from }, { transform: 'none' }], { duration: 420, easing: S.EASE.lift });
  }
};
stub.addEventListener('pointerup', up); stub.addEventListener('pointercancel', up);
})();
