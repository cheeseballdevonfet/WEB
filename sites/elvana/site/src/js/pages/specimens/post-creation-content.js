/* Specimen: Post Creation & Content. Back/Next and the dots follow the native swipe of the
   carousel; each marked day in the sample month becomes a button that opens its post, which
   you approve with a stamp. Reduced motion: no stamp animation, instant scrolling. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="post"]');
if (!S || !f) return;
const track = f.querySelector('.pc-slides'), slides = [...track.children], dots = [...f.querySelectorAll('.pc-dots i')];
const prev = f.querySelector('.pc-prev'), next = f.querySelector('.pc-next'), detail = f.querySelector('.pc-detail');
const TYPE = { reel: 'Reel', carousel: 'Carousel', static: 'Static post', story: 'Story' };
let at = 0;
function sync() {
  at = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
  dots.forEach((d, i) => d.classList.toggle('is-on', i === at));
  prev.disabled = at <= 0; next.disabled = at >= slides.length - 1;
}
const go = d => track.scrollTo({ left: (at + d) * track.clientWidth, behavior: S.motion() ? 'smooth' : 'instant' });
prev.addEventListener('click', () => go(-1));
next.addEventListener('click', () => go(1));
track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
// a mouse can drag the slides too (touch already swipes natively); it snaps to the nearest slide
let grab = null;
track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; grab = { x: e.clientX, s: track.scrollLeft, id: e.pointerId }; track.style.scrollSnapType = 'none'; track.setPointerCapture(e.pointerId); });
track.addEventListener('pointermove', e => { if (grab && e.pointerId === grab.id) track.scrollLeft = grab.s - (e.clientX - grab.x); });
const drop = e => { if (!grab || e.pointerId !== grab.id) return; const d = grab.x - e.clientX; grab = null; track.style.scrollSnapType = ''; const i = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth + Math.sign(d) * .3))); track.scrollTo({ left: i * track.clientWidth, behavior: S.motion() ? 'smooth' : 'instant' }); };
track.addEventListener('pointerup', drop); track.addEventListener('pointercancel', drop);
sync();
// the calendar
const ok = new Set();
const days = [...f.querySelectorAll('.pc-month [data-post]')].map(li => {
  const n = li.querySelector('span').textContent, b = document.createElement('button');
  b.type = 'button'; b.className = 'pc-day'; b.textContent = n; b.setAttribute('aria-pressed', 'false');
  b.setAttribute('aria-label', `Day ${n}: ${TYPE[li.dataset.post]}, ${li.dataset.title}`);
  li.querySelector('span').replaceWith(b);
  b.addEventListener('click', () => show(li, b, n));
  return b;
});
function show(li, b, n) {
  days.forEach(d => d.setAttribute('aria-pressed', String(d === b)));
  const done = ok.has(li);
  detail.innerHTML = '';
  const p = (cls, t) => { const e = document.createElement('p'); e.className = cls; e.textContent = t; detail.append(e); return e; };
  p('pc-detail__k', `Day ${n}: ${TYPE[li.dataset.post]}`);
  p('pc-detail__t', li.dataset.title);
  p('pc-detail__s', done ? 'Approved and scheduled. Captions, hashtags and posting time are set for the platform.' : 'Caption, hashtags and posting time drafted. Waiting for your approval.');
  if (done) { p('pc-stamp', 'Approved'); return; }
  const a = document.createElement('button');
  a.type = 'button'; a.className = 'tag tag-ink'; a.textContent = 'Approve this post';
  a.addEventListener('click', () => {
    ok.add(li); li.classList.add('is-ok'); S.fx('stamp');
    show(li, b, n);
    const st = detail.querySelector('.pc-stamp');
    S.anim(st, [{ transform: 'rotate(-8deg) scale(1.6)', opacity: 0 }, { transform: 'rotate(-8deg) scale(.96)', opacity: 1, offset: .7 }, { transform: 'rotate(-8deg) scale(1)', opacity: 1 }], { duration: 380, easing: S.EASE.paste });
    b.focus();
    S.say(`Day ${n} approved and scheduled.`);
  });
  detail.append(a);
  S.anim(detail, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 380, easing: S.EASE.paste });
}
})();
