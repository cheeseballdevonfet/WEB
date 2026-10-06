/* Specimen: WhatsApp Blasting. "Send the broadcast" works down the opted-in list (sent, then
   delivered), skips the customer who did not opt in, and the message lands on the phone with
   quick-reply buttons; a tap turns the broadcast into a conversation. Reduced motion: the same
   steps without the stagger. No JS: the message is already on the phone. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="wab"]');
if (!S || !f) return;
const btn = f.querySelector('.wab-send'), chat = f.querySelector('.wab-chat'), msg = f.querySelector('.wab-msg');
const rows = [...f.querySelectorAll('.wab-row')], qbs = [...f.querySelectorAll('.wab-qb')];
const st = r => r.querySelector('.wab-st');
const timers = [];
const later = (ms, fn) => timers.push(S.motion() ? S.after(ms, fn) : (fn(), 0));
f.classList.add('is-live');
function reset() {
  timers.splice(0).forEach(clearTimeout);
  chat.classList.remove('has-msg');
  chat.querySelectorAll('.wab-you,.wab-note,.wab-reply').forEach(n => n.remove());
  qbs.forEach(q => { q.disabled = true; q.removeAttribute('aria-pressed'); });
  rows.forEach(r => { if (!r.classList.contains('is-out')) { st(r).textContent = 'Opted in'; st(r).className = 'wab-st'; } });
}
function line(cls, text) {
  const p = document.createElement('p'); p.className = cls; p.textContent = text; chat.append(p);
  S.anim(p, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 360, easing: S.EASE.paste });
}
function sendIt() {
  reset();
  btn.disabled = true;
  let n = 0;
  rows.forEach((r, i) => {
    if (r.classList.contains('is-out')) {
      later(160 + i * 170, () => S.anim(st(r), [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 300, easing: S.EASE.paste }));
      return;
    }
    const k = n++;
    later(160 + i * 170, () => { st(r).textContent = 'Sent'; st(r).className = 'wab-st is-sent'; });
    later(560 + i * 170, () => {
      st(r).textContent = 'Delivered'; st(r).className = 'wab-st is-read';
      if (k === 0) {
        chat.classList.add('has-msg');
        S.anim(msg, [{ clipPath: 'inset(0 100% 0 0)', transform: 'translateY(10px)' }, { clipPath: 'inset(0 0% 0 0)', transform: 'none' }], { duration: 480, easing: S.EASE.paste });
        S.fx('paste');
      }
    });
  });
  later(560 + rows.length * 170 + 200, () => {
    qbs.forEach(q => { q.disabled = false; });
    btn.disabled = false; btn.textContent = 'Send it again';
    S.say(`Broadcast delivered to ${n} opted-in customers. One customer was skipped because they had not opted in. The quick-reply buttons on the phone now work.`);
  });
}
btn.addEventListener('click', sendIt);
qbs.forEach(q => q.addEventListener('click', () => {
  qbs.forEach(o => { o.disabled = true; });
  q.setAttribute('aria-pressed', 'true');
  line('wab-you', q.dataset.r);
  const yes = q.dataset.r === 'Show me';
  later(650, () => {
    line('wab-msg wab-reply', yes ? "Here's the collection. Want help choosing? A person from the store can reply here too." : 'No problem. Reply STOP any time and we will not message you again.');
    line('wab-note', yes ? 'Handed to the chat bot' : 'Opt-out respected');
    S.say(yes ? 'The store replied with the collection. The conversation is handed to the chat bot.' : 'The store replied: you can stop these messages any time.');
  });
}));
reset();
})();
