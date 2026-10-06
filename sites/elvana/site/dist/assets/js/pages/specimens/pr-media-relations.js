/* Specimen: PR & Media Relations. "Set it in hot metal": the headline is cast as sorts in a
   composing stick over the masthead (mirrored, glowing, cooling), then pressed onto the front
   page with a stamp. A new headline mid-setting starts the stick again. Reduced motion: the
   headline is set at once. Nothing typed leaves the page. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="pr"]');
if (!S || !f) return;
const form = f.querySelector('.pr-ctl'), input = f.querySelector('#pr-in'), stick = f.querySelector('.pr-stick');
const paper = f.querySelector('.pr-paper'), head = f.querySelector('.pr-head');
let job = 0;
const fit = t => f.style.setProperty('--len', Math.max(14, t.length));
function press(t) {
  head.textContent = t; fit(t);
  S.anim(head, [{ transform: 'scale(1.05)', opacity: .15 }, { transform: 'scale(1)', opacity: 1 }], { duration: 360, easing: S.EASE.paste });
  S.fx('stamp');
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const t = (input.value.trim().replace(/\s+/g, ' ') || input.placeholder).slice(0, 56);
  const me = ++job;
  if (!S.motion()) { press(t); S.say('Headline set: ' + t); return; }
  stick.innerHTML = '';
  stick.classList.add('is-on');
  stick.style.top = paper.offsetTop + head.offsetTop - 8 + 'px';
  S.anim(stick, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 240, easing: S.EASE.paste });
  const chars = [...t];
  chars.forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'pr-sort' + (c === ' ' ? ' sp' : '');
    s.innerHTML = '<b></b><i></i>';
    s.firstChild.textContent = c === ' ' ? '' : c;
    stick.append(s);
    S.anim(s, [{ transform: 'translateY(-26px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 200, delay: 180 + i * 34, easing: S.EASE.paste, fill: 'backwards' });
    S.anim(s.lastChild, [{ opacity: .95 }, { opacity: 0 }], { duration: 900, delay: 180 + i * 34, easing: 'ease-out', fill: 'backwards' });
  });
  const lock = 180 + chars.length * 34 + 520;
  S.after(lock, () => {
    if (me !== job) return;
    const a = S.anim(stick, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(18px) scale(.98)', opacity: 0 }], { duration: 260, easing: S.EASE.tug });
    const done = () => { if (me !== job) return; stick.classList.remove('is-on'); stick.innerHTML = ''; press(t); S.say('Headline set: ' + t); };
    if (a) a.finished.then(done, done); else done();
  });
});
fit(head.textContent);
})();
