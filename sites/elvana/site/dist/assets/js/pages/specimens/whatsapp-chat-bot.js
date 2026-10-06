/* Specimen: WhatsApp Chat Bot. Type, or tap a suggestion; scripted answers for a sample clinic.
   It introduces itself as automated, books a visit (morning or evening, then a name: lead
   capture), and hands over to a person when asked or unsure. Nothing leaves the page.
   Reduced motion: no typing dots, answers arrive at once. No JS: a sample conversation. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="bot"]');
if (!S || !f) return;
const log = f.querySelector('.bot-log'), form = f.querySelector('.bot-form'), input = f.querySelector('#bot-in');
const send = f.querySelector('.bot-send'), goals = [...f.querySelectorAll('[data-goal]')];
let state = '', slot = '', busy = 0;
f.classList.add('is-live');
const OFFER = 'I can help with timings, bookings and prices, or connect you to a person.';
function add(cls, who, text) {
  const li = document.createElement('li');
  li.className = 'bot-m ' + cls;
  if (who) { const w = document.createElement('span'); w.className = 'who'; w.textContent = who; li.append(w); }
  li.append(text);
  log.append(li);
  S.anim(li, [{ clipPath: 'inset(0 100% 0 0)', transform: 'translateY(8px)' }, { clipPath: 'inset(0 0% 0 0)', transform: 'none' }], { duration: 360, easing: S.EASE.paste });
  log.scrollTop = log.scrollHeight;
  return li;
}
function answer(q) {
  const t = q.toLowerCase();
  if (/person|human|agent|someone|staff|team|talk|speak|call me/.test(t)) { state = ''; return ['Connecting you to the clinic team now. A person will reply in this chat.', 'Handed to a person', 'person']; }
  if (state === 'name') {
    const name = q.trim().replace(/\s+/g, ' ').slice(0, 30);
    state = '';
    return [`Thanks, ${name}. You're booked for tomorrow ${slot}, and I'll send a reminder before your visit. Anything else?`, 'Lead captured: name and preferred time', 'book'];
  }
  if (state === 'when' && /morning|evening|afternoon|night|am\b|pm\b/.test(t)) {
    slot = /evening|night|pm\b/.test(t) ? 'evening' : 'morning'; state = 'name';
    return [`Tomorrow ${slot} works. What name should I put the booking under?`];
  }
  if (/book|appoint|visit|slot|schedule|reserve|consult/.test(t)) { state = 'when'; return ['Happy to book a visit. Would you like a morning or an evening slot?']; }
  if (/price|cost|fee|charge|how much|rate|pay/.test(t)) return ['It depends on the treatment. I can book a consultation, or connect you to the team for the details. Which would you like?'];
  if (/time|timing|open|hour|close|when|sunday|today/.test(t)) return ["We're open Monday to Saturday, mornings and evenings. Shall I book a visit?", '', 'time'];
  if (/where|address|location|direction|reach|map|parking/.test(t)) return ["We're in Andheri East. I can send the map pin here once you book. Shall I?"];
  if (/^(hi|hello|hey|namaste|good)\b/.test(t)) return ['Hello! ' + OFFER];
  if (/\b(thank|thanks|ok|okay|great|bye)\b/.test(t)) return ['You are welcome. Message here any time.'];
  if (/^(yes|yeah|sure|please)/.test(t)) { state = 'when'; return ['Great. Morning or evening?']; }
  return ["Sorry, I'm not sure I understood. " + OFFER, 'Unsure, so a person is offered', 'unsure'];
}
function ask(q) {
  q = q.trim();
  if (!q || busy) return;
  add('is-you', 'You', q);
  const [a, note, goal] = answer(q);
  busy = 1; send.disabled = true;
  const dots = S.motion() ? document.createElement('li') : null;
  if (dots) { dots.className = 'bot-typing'; dots.setAttribute('aria-hidden', 'true'); dots.innerHTML = '<i></i><i></i><i></i>'; log.append(dots); log.scrollTop = log.scrollHeight; }
  S.after(dots ? 650 + Math.min(900, a.length * 9) : 0, () => {
    if (dots) dots.remove();
    add('is-bot', 'Assistant', a);
    if (note) add('is-note', '', note);
    busy = 0; send.disabled = false;
    const g = goal && goals.find(x => x.dataset.goal === goal);
    if (g && !g.classList.contains('is-done')) { g.classList.add('is-done'); g.insertAdjacentHTML('beforeend', '<span class="sr"> (done)</span>'); }
    S.say('Assistant: ' + a);
  });
}
form.addEventListener('submit', e => { e.preventDefault(); const q = input.value; input.value = ''; ask(q); });
f.querySelectorAll('[data-say]').forEach(b => b.addEventListener('click', () => ask(b.dataset.say)));
})();
