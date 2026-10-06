/* Specimen: Social Media Management. Drag a post (mouse, pen or touch) to another day; it is
   pasted into that day's slot and settles from where you let go (a FLIP). Keyboard: Space or
   Enter picks it up, arrows move it day to day, Space or Enter puts it down, Escape returns it.
   Reduced motion: the post moves without the settle. No JS: the planned week. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="wk"]');
if (!S || !f) return;
const days = [...f.querySelectorAll('.wk-day')], posts = [...f.querySelectorAll('.wk-post')];
const name = p => p.querySelector('.wk-t').textContent + ': ' + p.querySelector('.wk-n').textContent;
const dayOf = p => p.closest('.wk-day');
let drag = null, lifted = null, home = null;
posts.forEach(p => {
  p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-pressed', 'false');
  p.setAttribute('aria-roledescription', 'movable post');
  p.setAttribute('aria-label', `${name(p)}, ${dayOf(p).dataset.day}`);
});
// move a post's list item into a day, then let it settle from where it was on screen
function moveTo(p, day, from) {
  const li = p.parentElement, F = from || p.getBoundingClientRect();
  day.querySelector('.wk-slot').append(li);
  p.style.transform = '';
  const L = p.getBoundingClientRect();
  S.anim(p, [{ transform: `translate(${F.left - L.left}px,${F.top - L.top}px) rotate(-2deg)` }, { transform: 'translate(0,0) rotate(0deg)' }], { duration: 420, easing: S.EASE.paste });
  p.setAttribute('aria-label', `${name(p)}, ${day.dataset.day}`);
  S.say(`${name(p)} moved to ${day.dataset.day}.`);
}
function under(x, y) { return days.find(d => { const r = d.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); }
posts.forEach(p => {
  p.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    drag = { p, id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, over: null };
    try { p.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
  });
  p.addEventListener('pointermove', e => {
    if (!drag || drag.p !== p || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    if (!drag.moved) { drag.moved = true; p.classList.add('is-drag'); }
    p.style.transform = `translate(${dx}px,${dy}px) rotate(-2deg) scale(1.03)`;
    const d = under(e.clientX, e.clientY);
    if (d !== drag.over) { if (drag.over) drag.over.classList.remove('is-over'); drag.over = d; if (d) d.classList.add('is-over'); }
  });
  const up = e => {
    if (!drag || drag.p !== p || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.over) d.over.classList.remove('is-over');
    p.classList.remove('is-drag');
    if (!d.moved) return;
    const F = p.getBoundingClientRect();
    if (d.over && d.over !== dayOf(p)) moveTo(p, d.over, F);
    else { p.style.transform = ''; const L = p.getBoundingClientRect(); S.anim(p, [{ transform: `translate(${F.left - L.left}px,${F.top - L.top}px)` }, { transform: 'none' }], { duration: 380, easing: S.EASE.lift }); }
  };
  p.addEventListener('pointerup', up); p.addEventListener('pointercancel', up);
  p.addEventListener('keydown', e => {
    const k = e.key;
    if (k === ' ' || k === 'Enter') {
      e.preventDefault();
      if (lifted === p) { lifted = null; p.setAttribute('aria-pressed', 'false'); S.say(`${name(p)} put down on ${dayOf(p).dataset.day}.`); }
      else {
        if (lifted) lifted.setAttribute('aria-pressed', 'false');
        lifted = p; home = dayOf(p); p.setAttribute('aria-pressed', 'true');
        S.say(`${name(p)} picked up from ${home.dataset.day}. Use the arrow keys to choose a day, Space to put it down, Escape to cancel.`);
      }
    } else if (lifted === p && /^Arrow/.test(k)) {
      e.preventDefault();
      const i = days.indexOf(dayOf(p)) + (k === 'ArrowRight' || k === 'ArrowDown' ? 1 : -1);
      if (i >= 0 && i < days.length) { moveTo(p, days[i]); p.focus(); }
    } else if (lifted === p && k === 'Escape') {
      lifted = null; p.setAttribute('aria-pressed', 'false');
      if (home !== dayOf(p)) { moveTo(p, home); p.focus(); }
    }
  });
  p.addEventListener('blur', () => { if (lifted === p && !p.matches(':focus')) S.after(0, () => { if (document.activeElement !== p && lifted === p) { lifted = null; p.setAttribute('aria-pressed', 'false'); } }); });
});
})();
