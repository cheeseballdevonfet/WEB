/* Specimen: SMS Blasting. The chips swap the template type: the old message slides up the
   thread and the new one is pasted on. Plays its first message when it comes into view.
   Reduced motion: instant swaps. No JS: all three messages are shown. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="sms"]');
if (!S || !f) return;
const btns = [...f.querySelectorAll('[data-pick]')], msgs = [...f.querySelectorAll('.sms-msg')], notes = [...f.querySelectorAll('.sms-note')];
const NAME = { promo: 'Promotional', txn: 'Transactional', svc: 'Service' };
let cur = 'promo';
f.classList.add('is-live');
msgs.forEach(m => { m.hidden = m.dataset.t !== cur; });
notes.forEach(n => { n.hidden = n.dataset.t !== cur; });
const arrive = m => S.anim(m, [{ clipPath: 'inset(0 100% 0 0)', transform: 'translateY(12px)' }, { clipPath: 'inset(0 0% 0 0)', transform: 'translateY(0)' }], { duration: 460, easing: S.EASE.paste, fill: 'backwards' });
function show(t) {
  btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pick === t)));
  if (t === cur) return;
  const old = msgs.find(m => m.dataset.t === cur), next = msgs.find(m => m.dataset.t === t);
  msgs.forEach(m => { m.getAnimations().forEach(a => a.cancel()); m.hidden = m !== next && m !== old; });
  notes.forEach(n => { n.hidden = n.dataset.t !== t; });
  cur = t;
  const a = S.anim(old, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-46px)', opacity: 0 }], { duration: 300, easing: S.EASE.tug, fill: 'forwards' });
  const hide = () => { if (old !== msgs.find(m => m.dataset.t === cur)) old.hidden = true; if (a) a.cancel(); };
  if (a) a.finished.then(hide, () => {}); else hide();
  arrive(next);
  S.say(`${NAME[t]} message shown, with its registered template.`);
}
btns.forEach(b => b.addEventListener('click', () => show(b.dataset.pick)));
// the first message lands once, when the phone comes into view
let seen = false;
if (S.motion()) f.classList.add('is-armed');
S.sleeper(f, () => { if (seen) return; seen = true; f.classList.remove('is-armed'); arrive(msgs.find(m => m.dataset.t === cur)); }, null, '-20% 0px');
})();
