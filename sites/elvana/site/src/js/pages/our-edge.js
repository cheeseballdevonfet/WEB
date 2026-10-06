/* =========================================================================
   Elvana Media: pages/our-edge.js
   "Follow one lead" (INTERACTIONS.md): the pinned scroll story, on WEB.md 26.
   1. Chapters: the chapter crossing mid-screen is the active one
      (IntersectionObserver, no scroll handler). Scrolling back reverses.
      The route marks it and fills its rail; on the pinned stage (desktop,
      motion) the chapter's mock-up wipes in over the last one, from the left
      going forward and from the right going back, and its report line is
      stamped. Stage changes are announced politely.
   2. Mock-ups: each plays its short sequence once, when first shown. Leaving
      it mid-way, or scrolling the story off-screen, finishes it at once, so
      nothing runs off-screen and nothing is left half-drawn.
   3. The bot (chapter 2): answers what the visitor types, from a script.
   No JS: the plain sequence, complete. Reduced motion: the same, still; the
   bot still answers. Timers divide by Elvana.timeScale (slow-motion review).
   ========================================================================= */
(() => {
'use strict';
const story = document.querySelector('[data-story]');
if (!story) return;
const root = document.documentElement;
const E = window.Elvana || { announce() {}, feedback() {}, timeScale: 1 };
const motionOK = root.classList.contains('motion');
const pinMQ = matchMedia('(min-width:1100px) and (min-height:700px)');   // mirrors the PINNED block in our-edge.css
const pinned = () => motionOK && pinMQ.matches;
const slow = () => E.timeScale || 1;
const PASTE = 'cubic-bezier(.2,.7,.1,1)';   // paste: base.css --ease-paste
const WIPE_MS = 520, LEAVE_MS = 560;

const chapters = [...story.querySelectorAll('.ch')];
const texts = chapters.map(c => c.querySelector('.ch-text'));
const screens = chapters.map(c => c.querySelector('.scr'));
const names = chapters.map(c => c.querySelector('h3').textContent.trim());
const route = story.querySelector('.route');
const links = [...route.querySelectorAll('a')];
let active = 0, inView = false;
// the squeegee (pinned stage only; CSS hides it elsewhere)
const sq = document.createElement('div'); sq.className = 'squeegee'; sq.setAttribute('aria-hidden', 'true');
const sqBar = document.createElement('i'); sq.append(sqBar); story.append(sq);

/* ---- 2. Mock-up sequences --------------------------------------------- */
const timers = new Map();
screens.forEach(s => { timers.set(s, []); if (motionOK) s.setAttribute('data-armed', ''); });
const later = (s, fn, ms) => timers.get(s).push(setTimeout(fn, ms / slow()));
function stop(s) { timers.get(s).forEach(clearTimeout); timers.set(s, []); }
// keep the newest visible line of a chat thread in view (inside the thread only, never the page)
function follow(s) {
  const th = s.querySelector('.thread'); if (!th) return;
  const shown = [...th.children].filter(li => !li.classList.contains('bit') || li.classList.contains('in'));
  const last = shown[shown.length - 1]; if (!last) return;
  th.scrollTop = Math.max(0, last.offsetTop + last.offsetHeight - th.clientHeight + 8);
}
function finish(s) {
  stop(s);
  s.querySelectorAll('.bit').forEach(b => b.classList.add('in'));
  const w = s.querySelector('.wave'); if (w) w.classList.remove('on');
  s.classList.add('is-done'); s.dataset.state = 'done';
  follow(s);
}
function play(s) {
  if (s.dataset.state) return;
  if (!motionOK) { finish(s); return; }
  s.dataset.state = 'playing';
  const wave = s.querySelector('.wave');
  let t = 280;
  s.querySelectorAll('.bit').forEach(b => {
    later(s, () => { b.classList.add('in'); if (wave) wave.classList.toggle('on', b.classList.contains('ai')); follow(s); }, t);
    t += +b.dataset.ms || 500;
  });
  later(s, () => finish(s), t);
}
const finishPlaying = except => screens.forEach(s => { if (s !== except && s.dataset.state === 'playing') finish(s); });

/* ---- 1. Chapters --------------------------------------------------------- */
function setActive(i, quiet) {
  if (i < 0) return;
  const prev = active;
  if (i === prev && !quiet) return;
  active = i;
  story.dataset.active = String(i + 1);
  chapters.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.classList.toggle('is-past', k < i); });
  links.forEach((a, k) => {
    if (k === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    a.parentElement.classList.toggle('is-past', k < i);
  });
  route.style.setProperty('--p', String(i / (chapters.length - 1)));
  if (!pinned()) return;
  if (!quiet && prev !== i) {
    const old = chapters[prev], s = screens[i];
    old.classList.add('is-leaving'); clearTimeout(old._leave);
    old._leave = setTimeout(() => old.classList.remove('is-leaving'), LEAVE_MS / slow());
    s.getAnimations().forEach(a => a.cancel());
    const fwd = i > prev, opts = { duration: WIPE_MS / slow(), easing: PASTE };
    s.animate([{ clipPath: fwd ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0% 0 0%)' }], opts);
    // the squeegee rides the wet edge: left to right going forward, right to left going back
    const w = sq.clientWidth;
    sqBar.getAnimations().forEach(a => a.cancel());
    sqBar.animate(fwd
      ? [{ transform: 'translateX(-150px)', opacity: 1 }, { transform: `translateX(${w - 150}px)`, opacity: 1, offset: .92 }, { transform: `translateX(${w - 150}px)`, opacity: 0 }]
      : [{ transform: `translateX(${w}px) scaleX(-1)`, opacity: 1 }, { transform: 'translateX(0) scaleX(-1)', opacity: 1, offset: .92 }, { transform: 'translateX(0) scaleX(-1)', opacity: 0 }], opts);
    finishPlaying(s);
    const did = chapters[i].querySelector('.ch-log__t').lastChild.textContent.trim();
    E.announce(`Step ${i + 1} of ${chapters.length}: ${names[i]}. Live report: ${did}`);
  }
  if (inView) play(screens[i]);
}

// the chapter crossing a thin band is the active one: mid-screen in the sequence; on the pinned
// stage a third of the way down, so a chapter's text is fully on screen when its mock-up arrives
let io, targets = [];
function observe() {
  if (io) io.disconnect();
  targets = pinned() ? texts : chapters;     // .ch is display:contents when pinned (no box to observe)
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(targets.indexOf(e.target)); }),
    { rootMargin: pinned() ? '-32% 0px -67% 0px' : '-49% 0px -49% 0px' });
  targets.forEach(t => io.observe(t));
}
observe();

// sequence layout: each mock-up plays when a third of it is on screen
const seen = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !pinned()) play(e.target); }), { threshold: .35 });
screens.forEach(s => seen.observe(s));

// sleep off-screen: anything mid-sequence finishes when the story leaves the viewport
new IntersectionObserver(es => {
  inView = es[0].isIntersecting;
  if (inView) { if (pinned()) play(screens[active]); }
  else finishPlaying(null);
}).observe(story);

pinMQ.addEventListener('change', () => {
  screens.forEach(s => s.getAnimations().forEach(a => a.cancel()));
  chapters.forEach(c => c.classList.remove('is-leaving'));
  observe(); setActive(active, true);
});
setActive(0, true);

/* ---- 3. The bot ----------------------------------------------------------- */
const chat = story.querySelector('.scr--chat');
const form = chat && chat.querySelector('[data-ask]');
if (!form) return;
const thread = chat.querySelector('.thread');
const input = form.querySelector('input');
let booked = '';
// Scripted answers for a sample institute. Order matters: the first match answers.
const RULES = [
  [/\b(human|person|people|someone|counsell?or|talk to|speak to|call me|agent)\b/i, () => "Of course. I've asked a counsellor to reply here during working hours. A person can take over at any point."],
  [/\b(bot|robot|ai|automated|machine|real person)\b/i, () => "Yes, I'm the institute's automated assistant. A person from the team can take over whenever you like."],
  [/\b(fee|fees|price|prices|cost|costs|charges?|how much|rupees?)\b|₹/i, () => "Fees depend on the batch, so a counsellor shares the exact fee on a free call. Shall I book one? Saturday 11 am or Sunday 4 pm."],
  [/\b(saturday|sat|11)\b/i, () => { booked = 'Saturday at 11 am'; return 'Booked: your counselling call is on Saturday at 11 am. I\'ll send a reminder before it.'; }],
  [/\b(sunday|sun|4)\b/i, () => { booked = 'Sunday at 4 pm'; return 'Booked: your counselling call is on Sunday at 4 pm. I\'ll send a reminder before it.'; }],
  [/\b(book|booking|slot|appointment|yes|yeah|ok|okay|sure)\b/i, () => booked ? `You're booked for ${booked}. Want a different slot? Saturday 11 am or Sunday 4 pm.` : 'Happy to book a free counselling call. Saturday 11 am or Sunday 4 pm?'],
  [/\b(online|remote|from home|live class)\b/i, () => 'Online batches run on the same weekend schedule as the classroom ones.'],
  [/\b(where|centre|center|address|location|andheri|classroom|branch)\b/i, () => 'The classroom batch is at the Andheri centre. Online batches are open too.'],
  [/\b(time|timing|timings|when|weekday|evening|weekend|batch|batches|schedule|start|course)\b/i, () => 'Weekend batches run on Saturday and Sunday, and weekday evening batches are open too. Which suits you?'],
  [/\b(hi+|hello|hey|namaste|good (morning|evening|afternoon))\b/i, () => "Hello! I'm the institute's automated assistant. Ask me about batches, fees, the centre, or booking a call."],
  [/\b(thanks|thank you|thx|great|cool|nice)\b/i, () => "You're welcome. Message here any time."],
];
const FALLBACK = "I'm a scripted mock-up, so I only know a few things: batches, fees, the centre, booking a call, or handing you to a person.";
const answer = q => { for (const [re, fn] of RULES) if (re.test(q)) return fn(); return FALLBACK; };

function add(cls, label, text) {
  const li = document.createElement('li');
  li.className = 'msg ' + cls;
  if (label) { const s = document.createElement('span'); s.className = 'sr'; s.textContent = label; li.append(s); }
  li.append(document.createTextNode(text));
  thread.append(li);
  const extra = thread.querySelectorAll('.msg:not(.bit)');   // keep the thread short: drop the oldest typed lines
  if (extra.length > 24) extra[0].remove();
  follow(chat);
  return li;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const q = input.value.trim().slice(0, 140);
  if (!q) { input.focus(); return; }
  finish(chat);                       // typing interrupts the scripted thread: it is shown complete
  input.value = '';
  add('them', 'You wrote: ', q);
  const typing = add('bot typing', '', 'Typing');
  typing.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    typing.remove();
    const a = answer(q);
    add('bot', 'Bot: ', a);
    E.announce('Bot: ' + a);
  }, (motionOK ? 720 : 320) / slow());
});
form.querySelectorAll('[data-say]').forEach(b => b.addEventListener('click', () => {
  input.value = b.dataset.say;
  if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true }));
}));
})();
