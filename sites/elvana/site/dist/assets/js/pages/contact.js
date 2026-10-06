/* =========================================================================
   Elvana Media: pages/contact.js. "Paste your enquiry" (INTERACTIONS.md).
   States, on #sheet-wrap[data-state]:
     blank    the empty poster (fields as printed rules)
     editing  something typed; answers are kept for this tab as they type
     invalid  a send with something missing: each field says how to fix it,
              focus moves to the first one and the count is announced
     sending  the enquiry, printed as a poster, is squeegeed over the form
              and stamped RECEIVED; the email app opens with it filled in
     done     what happens next: open the email again, copy it, WhatsApp it,
              or write another (a fresh blank poster, details kept)
   ?model=retainer|campaign|project and ?service=<slug> pre-select the need;
   ?brand= (the Work page's sign painter) fills Company.
   Without JS the form posts to mailto: as text/plain. Reduced motion: the
   states swap without the squeegee or the stamp's fall.
   ========================================================================= */
(() => {
'use strict';
const wrap = document.getElementById('sheet-wrap');
const form = document.getElementById('enquiry');
if (!wrap || !form) return;
const E = window.Elvana || { timeScale: 1, announce() {}, feedback() {} };
const root = document.documentElement;
const $ = id => document.getElementById(id);
const printed = $('printed'), after = $('after'), send = $('send'), left = $('left'), fix = $('fix'), fromLink = $('from-link');
const f = { name: $('f-name'), company: $('f-company'), email: $('f-email'), phone: $('f-phone'), service: $('f-service'), message: $('f-msg') };
const TO = (form.getAttribute('action') || 'mailto:info@elvanamedia.com').replace(/^mailto:/, '').split('?')[0];
const waLink = $('wa-text'), waBase = waLink.getAttribute('href').split('?')[0];
const KEY = 'elvana-enquiry';
form.noValidate = true;

/* ---- Reading the form ------------------------------------------------------ */
const radio = n => { const r = form.querySelector(`input[name="${n}"]:checked`); return r ? r.value : ''; };
const val = el => el.value.replace(/[ \t]+/g, ' ').trim();
const digits = s => s.replace(/\D/g, '');
const reply = () => radio('reply') || 'Email';
function data() {
  return { name: val(f.name), company: val(f.company), email: val(f.email), phone: val(f.phone), city: radio('city'),
    service: f.service.value, model: radio('model'), message: f.message.value.trim(), reply: reply() };
}

/* ---- What is required depends on how they want a reply ---------------------- */
const MSG = {
  name: () => 'add your name so we know who to reply to.',
  email: v => v ? 'check the email address. It should look like name@company.com.' : 'add your email, or choose Call or WhatsApp below and give a number.',
  phone: v => v ? 'check the number. Give 10 digits, or +91 and 10 digits.' : `add a number for us to ${reply() === 'Call' ? 'call' : 'WhatsApp'}, or choose Email below.`,
  message: () => 'tell us in a line or two what you need. A sentence is plenty.'
};
function needs(key) {
  if (key === 'name' || key === 'message') return true;
  if (key === 'email') return reply() === 'Email' || !!val(f.email);
  if (key === 'phone') return reply() !== 'Email' || !!val(f.phone);
  return false;
}
function ok(key) {
  const v = key === 'message' ? f.message.value.trim() : val(f[key]);
  if (key === 'email') return v ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : !needs('email');
  if (key === 'phone') { const d = digits(v); return v ? d.length >= 10 && d.length <= 13 : !needs('phone'); }
  return !!v;
}
function check(key) {
  const el = f[key], err = $(el.getAttribute('aria-describedby'));
  const good = ok(key);
  if (good) { el.removeAttribute('aria-invalid'); err.textContent = ''; }
  else { el.setAttribute('aria-invalid', 'true'); err.textContent = MSG[key](val(el)); }
  return good;
}
const KEYS = ['name', 'email', 'phone', 'message'];
function syncRequired() {
  const r = reply();
  f.email.required = r === 'Email'; f.phone.required = r !== 'Email';
  form.querySelector('[data-opt="email"]').hidden = r === 'Email';
  form.querySelector('[data-opt="phone"]').hidden = r !== 'Email';
  ['email', 'phone'].forEach(k => { if (f[k].getAttribute('aria-invalid')) check(k); });
}
function countLeft() {
  const missing = KEYS.filter(k => needs(k) && !ok(k)).length;
  left.textContent = missing ? `${missing} ${missing === 1 ? 'answer' : 'answers'} still needed` : 'All set. Paste it on the wall.';
  left.classList.toggle('is-set', !missing);
}

/* ---- Draft: kept for this tab while they type ---------------------------------- */
let saveT = 0;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { sessionStorage.setItem(KEY, JSON.stringify(data())); } catch (_) {} }, 250);
}
function restore() {
  let d = null; try { d = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (_) {}
  if (!d) return false;
  ['name', 'company', 'email', 'phone', 'message'].forEach(k => { if (d[k]) f[k].value = d[k]; });
  if (d.service) f.service.value = d.service;
  [['city', d.city], ['model', d.model], ['reply', d.reply]].forEach(([n, v]) => { if (!v) return; const r = form.querySelector(`input[name="${n}"][value="${CSS.escape(v)}"]`); if (r) r.checked = true; });
  return Object.values(d).some(Boolean);
}

/* ---- Arriving from another page ------------------------------------------------- */
function fromUrl() {
  const q = new URLSearchParams(location.search), picked = [];
  const model = (q.get('model') || '').toLowerCase();
  const m = model && form.querySelector(`input[name="model"][data-model="${CSS.escape(model)}"]`);
  if (m) { m.checked = true; picked.push(m.value); }
  const slug = (q.get('service') || '').toLowerCase();
  const o = slug && f.service.querySelector(`option[data-slug="${CSS.escape(slug)}"]`);
  if (o) { f.service.value = o.value; picked.push(o.value); }
  const brand = (q.get('brand') || '').trim().slice(0, 80);
  if (brand && !val(f.company)) f.company.value = brand;
  if (picked.length) {
    fromLink.textContent = 'From the page you came from: ';
    const b = document.createElement('b'); b.textContent = picked.join(', '); fromLink.appendChild(b);
    fromLink.append('. Change it if you like.');
    fromLink.hidden = false;
  }
}

/* ---- The enquiry, as an email --------------------------------------------------- */
function compose(d) {
  const need = [d.service, d.model].filter(Boolean).join(', ');
  const subject = `Enquiry from ${d.name}${d.company ? ' (' + d.company + ')' : ''}`;
  const lines = [d.message, '', `Name: ${d.name}`];
  if (d.company) lines.push(`Company: ${d.company}`);
  if (d.email) lines.push(`Email: ${d.email}`);
  if (d.phone) lines.push(`Phone or WhatsApp: ${d.phone}`);
  if (d.city) lines.push(`City: ${d.city}`);
  if (d.service) lines.push(`Service: ${d.service}`);
  if (d.model) lines.push(`Way of working: ${d.model}`);
  lines.push(`Reply by: ${d.reply}`, '', 'Sent from the contact page of www.elvanamedia.com');
  const body = lines.join('\n');
  return { subject, body, need, href: `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
let sent = null;

/* ---- States ------------------------------------------------------------------------ */
const motion = () => root.classList.contains('motion');
const later = (fn, ms) => setTimeout(fn, ms / E.timeScale);
function setState(s) { wrap.dataset.state = s; }
function fillPrinted(d, c) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const put = (k, v) => printed.querySelectorAll(`[data-k="${k}"]`).forEach(el => { el.textContent = v; });
  put('date', today); put('stampdate', today);
  put('need', c.need || 'A new enquiry');
  put('message', d.message.length > 320 ? d.message.slice(0, 317).trimEnd() + '...' : d.message);
  put('from', [d.name, d.company, d.city].filter(Boolean).join(', '));
  put('reply', d.reply === 'Email' ? `Email, ${d.email}` : `${d.reply}, ${d.phone}`);
}
function submit(e) {
  e.preventDefault();
  if (wrap.dataset.state === 'sending') return;
  const bad = KEYS.filter(k => !check(k));
  countLeft();
  if (bad.length) {
    setState('invalid');
    fix.textContent = bad.length === 1 ? 'One answer needs fixing. It is marked in red.' : `${bad.length} answers need fixing. They are marked in red.`;
    fix.hidden = false;
    E.announce(fix.textContent);
    f[bad[0]].focus();
    return;
  }
  fix.hidden = true;
  const d = data(), c = compose(d);
  sent = c;
  fillPrinted(d, c);
  waLink.setAttribute('href', `${waBase}?text=${encodeURIComponent(`${c.subject}\n\n${d.message}`)}`);
  // hand the message to the email app now, inside the click, so the browser allows it
  try { window.location.href = c.href; } catch (_) {}
  setState('sending');
  send.disabled = true; send.textContent = 'Pasting it up';
  printed.hidden = false; after.hidden = false; after.classList.add('is-waiting');
  wrap.style.setProperty('--ph', printed.offsetHeight + 'px');
  wrap.classList.add('is-sent');
  wrap.scrollIntoView({ block: 'start', behavior: 'instant' });   // the poster is now short: go straight to it
  E.feedback('paste');
  if (!motion()) { stamped(); return; }
  wrap.classList.add('is-pasting');
  later(() => { wrap.classList.add('is-stamping'); E.feedback('stamp'); later(stamped, 260); }, 900);
}
function stamped() {
  wrap.classList.remove('is-pasting', 'is-stamping');
  wrap.classList.add('is-stamped-done');
  setState('done');
  after.hidden = false; after.classList.remove('is-waiting');
  if (motion()) { after.classList.remove('is-in'); void after.offsetWidth; after.classList.add('is-in'); }
  send.disabled = false; send.textContent = 'Paste it on the wall';
  try { const d = data(); d.message = ''; d.service = ''; d.model = ''; sessionStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {}
  E.announce('Pasted and stamped received. Your email app should open with the enquiry ready: press send there.');
  $('after-h').focus({ preventScroll: true });
}
function another() {
  after.hidden = true; after.classList.remove('is-in', 'is-waiting');
  printed.hidden = true;
  wrap.classList.remove('is-stamped-done', 'is-sent');
  f.message.value = ''; f.service.value = '';
  form.querySelectorAll('input[name="model"]').forEach(r => { r.checked = false; });
  fromLink.hidden = true;
  KEYS.forEach(k => { f[k].removeAttribute('aria-invalid'); $(f[k].getAttribute('aria-describedby')).textContent = ''; });
  setState('blank');
  if (motion()) { wrap.classList.remove('is-fresh'); void wrap.offsetWidth; wrap.classList.add('is-fresh'); later(() => wrap.classList.remove('is-fresh'), 950); }
  countLeft();
  E.announce('A fresh poster is up. Your details are kept; write the next message.');
  f.message.focus();
}

/* ---- Wiring ------------------------------------------------------------------------ */
form.addEventListener('submit', submit);
KEYS.forEach(k => f[k].addEventListener('blur', () => { if (val(f[k]) || f[k].getAttribute('aria-invalid')) check(k); countLeft(); }));
form.addEventListener('input', e => {
  if (wrap.dataset.state === 'blank' || wrap.dataset.state === 'done') setState('editing');
  const k = KEYS.find(x => f[x] === e.target);
  if (k && f[k].getAttribute('aria-invalid') && ok(k)) check(k);     // clear an error as soon as it is fixed, never add one mid-word
  if (wrap.dataset.state === 'invalid' && !KEYS.some(x => f[x].getAttribute('aria-invalid'))) { setState('editing'); fix.hidden = true; }
  countLeft(); save();
});
form.addEventListener('change', e => {
  if (e.target.name === 'reply') syncRequired();
  if (e.target.name === 'service' || e.target.name === 'model') fromLink.hidden = true;   // their own choice now
  countLeft(); save();
});
$('again-mail').addEventListener('click', () => { if (sent) window.location.href = sent.href; });
$('copy').addEventListener('click', async () => {
  if (!sent) return;
  const text = `To: ${TO}\nSubject: ${sent.subject}\n\n${sent.body}`;
  let done = false;
  try { await navigator.clipboard.writeText(text); done = true; } catch (_) {
    const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); try { done = document.execCommand('copy'); } catch (__) {} t.remove();
  }
  E.announce(done ? `Copied. Paste it into an email to ${TO}.` : `Copy did not work here. Write to ${TO}.`);
  $('copy').textContent = done ? 'Copied' : 'Copy did not work';
  later(() => { $('copy').textContent = 'Copy the message'; }, 2400);
});
$('another').addEventListener('click', another);

const restored = restore();
fromUrl();
syncRequired();
countLeft();
if (restored) setState('editing');
})();
