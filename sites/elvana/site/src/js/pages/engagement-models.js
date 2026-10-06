/* =========================================================================
   Elvana Media: pages/engagement-models.js
   "The ticket counter" (INTERACTIONS.md).
   1. Print: choosing a model (radios: click, tap or arrow keys) feeds its
      ticket out of the slot in pulses, like a thermal printer, and the
      ticket swings once as it comes free. The last ticket drops away.
      Choosing again mid-print is fine: everything starts from where it is.
   2. Tear: drag the stub sideways (or down, with a mouse) and it hinges at
      the far end of the perforation and follows; let go early and it springs
      back; pull past the threshold and it rips off and falls, then
      /contact/?model=<id> opens. The stub's button does the same tear, for
      keyboards and for anyone in a hurry. Each stub is a GET form, so with
      no JS the button simply opens the same URL.
   Reduced motion: the ticket is just there; the button opens the URL at once.
   Curves: paste, tug, lift (base.css). Timers divide by Elvana.timeScale.
   ========================================================================= */
(() => {
'use strict';
const counter = document.querySelector('[data-counter]');
if (!counter) return;
const root = document.documentElement;
const E = window.Elvana || { announce() {}, feedback() {}, timeScale: 1 };
const motionOK = root.classList.contains('motion');
const slow = () => E.timeScale || 1;
const PASTE = 'cubic-bezier(.2,.7,.1,1)';   // paste: every entrance eases out
const TUG = 'cubic-bezier(.55,0,.75,.2)';   // tug: gravity, a sheet letting go
const LIFT = 'cubic-bezier(.3,1.3,.5,1)';   // lift: one tiny overshoot
const radios = [...counter.querySelectorAll('.pick input')];
const tickets = new Map([...counter.querySelectorAll('.ticket')].map(t => [t.dataset.model, t]));
const nameOf = t => t.querySelector('.ticket__name').textContent.trim();
let out = null;

/* ---- 1. Print ------------------------------------------------------------ */
function print(model) {
  const t = tickets.get(model);
  if (!t || t === out) return;
  const prev = out;
  out = t;
  counter.classList.add('has-ticket');
  if (prev) drop(prev);
  t.getAnimations().forEach(a => a.cancel());
  resetStub(t);
  t.style.zIndex = '2';
  t.classList.add('is-out');
  E.announce(`${nameOf(t)} ticket printed. Tear off the stub to send an enquiry with this model chosen.`);
  if (!motionOK) return;
  t.animate([
    { transform: 'translateY(-101%)', easing: PASTE },
    { transform: 'translateY(-69%)', offset: .2 },
    { transform: 'translateY(-69%)', offset: .27, easing: PASTE },
    { transform: 'translateY(-37%)', offset: .47 },
    { transform: 'translateY(-37%)', offset: .54, easing: PASTE },
    { transform: 'translateY(-5%)', offset: .74, easing: PASTE },
    { transform: 'translateY(0) rotate(1.3deg)', offset: .85, easing: LIFT },
    { transform: 'translateY(0) rotate(0deg)' }
  ], { duration: 1150 / slow(), delay: (prev ? 120 : 0) / slow(), fill: 'backwards' });
}
function drop(t) {
  const from = getComputedStyle(t).transform;
  t.getAnimations().forEach(a => a.cancel());
  t.style.zIndex = '1';
  if (!motionOK) { t.classList.remove('is-out'); return; }
  const a = t.animate([{ transform: from === 'none' ? 'translateY(0)' : from, opacity: 1 }, { transform: 'translateY(70px) rotate(6deg)', opacity: 0 }],
    { duration: 320 / slow(), easing: TUG, fill: 'forwards' });
  a.onfinish = () => { if (out !== t) { t.classList.remove('is-out'); a.cancel(); } };
}
radios.forEach(r => r.addEventListener('change', () => { if (r.checked) print(r.value); }));

/* ---- 2. Tear ---------------------------------------------------------------- */
function resetStub(t) {
  const stub = t.querySelector('.ticket__stub');
  stub.getAnimations().forEach(a => a.cancel());
  stub.style.transform = ''; stub.style.transformOrigin = '';
  stub.classList.remove('is-dragging');
  delete t.dataset.torn;
}
function tear(t, hinge, dx, dy, auto) {
  if (t.dataset.torn) return;
  t.dataset.torn = '1';
  const stub = t.querySelector('.ticket__stub');
  const url = new URL(stub.action);
  url.searchParams.set('model', stub.elements.model.value);
  E.feedback('rip');
  E.announce(`Stub torn off. Opening the contact page with ${nameOf(t)} chosen.`);
  if (!motionOK) { location.assign(url.href); return; }
  t.getAnimations().forEach(a => a.finish());
  const s = hinge === 'right' ? -1 : 1;           // which end lets go last
  const from = getComputedStyle(stub).transform;
  stub.style.transformOrigin = hinge === 'right' ? '100% 0' : '0 0';
  const frames = auto
    ? [{ transform: 'none', easing: PASTE }, { transform: `rotate(${s * 7}deg)`, offset: .38, easing: TUG }, { transform: `translate(${s * -36}px, 150px) rotate(${s * 26}deg)`, opacity: 0 }]
    : [{ transform: from === 'none' ? 'none' : from, easing: TUG }, { transform: `translate(${(dx * 1.5).toFixed(1)}px, ${(Math.max(0, dy) + 160).toFixed(1)}px) rotate(${s * 34}deg)`, opacity: 0 }];
  const a = stub.animate(frames, { duration: (auto ? 540 : 380) / slow(), fill: 'forwards' });
  a.onfinish = () => location.assign(url.href);
}
tickets.forEach(t => {
  const stub = t.querySelector('.ticket__stub');
  const btn = stub.querySelector('.stub__tear');
  let drag = null, suppress = false;
  stub.addEventListener('pointerdown', e => {
    if (!motionOK || e.button > 0 || t.dataset.torn || t !== out) return;
    const box = stub.getBoundingClientRect();
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, w: box.width, mouse: e.pointerType === 'mouse',
      hinge: e.clientX - box.left < box.width / 2 ? 'right' : 'left' };
  });
  stub.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = drag.mouse ? e.clientY - drag.y : 0;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      drag.moved = true;
      try { stub.setPointerCapture(e.pointerId); } catch (_) {}
      stub.classList.add('is-dragging');
      t.getAnimations().forEach(a => a.finish());
      stub.getAnimations().forEach(a => a.cancel());
      stub.style.transformOrigin = drag.hinge === 'right' ? '100% 0' : '0 0';
    }
    e.preventDefault();
    // the tear opens from the end you hold; the paper resists, so it follows at less than your hand
    const pull = Math.abs(dx) * .9 + Math.max(0, dy);
    const ang = Math.min(22, pull / drag.w * 52);
    const s = drag.hinge === 'right' ? -1 : 1;
    stub.style.transform = `translate(${(dx * .16).toFixed(1)}px, ${(Math.max(0, dy) * .3).toFixed(1)}px) rotate(${(s * ang).toFixed(2)}deg)`;
    if (pull > drag.w * (drag.mouse ? .36 : .3)) { const h = drag.hinge; drag = null; suppress = true; stub.classList.remove('is-dragging'); tear(t, h, dx, dy, false); }
  });
  const end = () => {
    if (!drag) return;
    if (drag.moved) {
      suppress = true;
      stub.classList.remove('is-dragging');
      const from = stub.style.transform;
      stub.style.transform = '';
      if (from) stub.animate([{ transform: from }, { transform: 'none' }], { duration: 420 / slow(), easing: LIFT });   // let go early: it springs back
    }
    drag = null;
  };
  stub.addEventListener('pointerup', end);
  stub.addEventListener('pointercancel', end);
  // a drag must not also press the button
  btn.addEventListener('click', e => { if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; } }, true);
  stub.addEventListener('pointerdown', () => { suppress = false; }, true);
  stub.addEventListener('submit', e => { e.preventDefault(); tear(t, 'right', 0, 0, true); });
});

// back from the contact page (bfcache): the torn stub is whole again
addEventListener('pageshow', e => { if (e.persisted) tickets.forEach(resetStub); });
})();
