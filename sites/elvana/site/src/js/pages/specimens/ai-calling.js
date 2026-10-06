/* Specimen: AI Calling. Play a written sample call: the waveform fills from the left, the
   line being spoken is marked, and the note for your team appears when the call ends. The
   waveform is also a seek slider (arrow keys, drag or tap). Pauses when scrolled away.
   Reduced motion: the bars do not "talk"; playback still runs. No JS: both transcripts. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="call"]');
if (!S || !f) return;
const btn = f.querySelector('.call-btn'), lbl = f.querySelector('.call-lbl'), seek = f.querySelector('.call-seek');
const wave = f.querySelector('.call-wave'), [dim, on] = f.querySelectorAll('.call-bars');
const lines = [...f.querySelectorAll('.call-script li')], chips = [...f.querySelectorAll('[data-lang]')];
const N = 72, GAP = 420;
let lang = 'en', seg = [], T = 1, t = 0, playing = false, raf = 0, last = 0, now = -1;
// one bar shape for the whole call: a fixed pseudo-random envelope (no audio, no data)
let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const H = Array.from({ length: N }, () => 24 + Math.round(rnd() * 72)), D = H.map(() => Math.round(rnd() * 360));
[dim, on].forEach(box => box.innerHTML = H.map((h, i) => `<i style="--h:${h};--d:${D[i]}"></i>`).join(''));
function build() {
  let at = 0;
  seg = lines.map(li => { const len = li.querySelector('.t-' + lang).textContent.length, d = 700 + len * 52; const s = { a: at, b: at + d, who: li.dataset.who }; at += d + GAP; return s; });
  T = at - GAP;
  // colour the bars by who is speaking at that moment
  [dim, on].forEach(box => [...box.children].forEach((b, i) => { const x = (i + .5) / N * T, s = seg.find(s => x < s.b + GAP) || seg[seg.length - 1]; b.classList.toggle('c', s.who === 'c'); }));
}
function render() {
  const p = Math.min(1, t / T);
  on.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)`;
  wave.style.setProperty('--p', p.toFixed(4));
  seek.value = Math.round(p * 1000);
  const k = seg.findIndex(s => t >= s.a && t < s.b + GAP);
  if (k !== now) { now = k; lines.forEach((li, i) => li.classList.toggle('is-now', i === k && (playing || t > 0) && t < T)); }
  f.classList.toggle('is-ended', t >= T);
  wave.classList.toggle('is-talking', playing && k >= 0 && t < seg[k].b && S.motion());
}
function frame(ts) {
  const dt = Math.min(64, ts - (last || ts)); last = ts;
  t += dt * S.ts;
  if (t >= T) { t = T; stop(true); }
  render();
  if (playing) raf = requestAnimationFrame(frame);
}
function play() {
  if (t >= T) t = 0;
  playing = true; last = 0; btn.classList.add('is-on'); lbl.textContent = 'Pause';
  raf = requestAnimationFrame(frame);
}
function stop(ended) {
  playing = false; cancelAnimationFrame(raf); btn.classList.remove('is-on');
  lbl.textContent = ended ? 'Play it again' : 'Play the call';
  if (ended) S.say('Call ended. A note for your team is shown below the transcript.');
  render();
}
btn.addEventListener('click', () => (playing ? stop(false) : play()));
seek.addEventListener('input', () => { t = seek.value / 1000 * T; render(); });
chips.forEach(c => c.addEventListener('click', () => {
  if (c.dataset.lang === lang) return;
  const p = t / T; lang = c.dataset.lang; f.dataset.lang = lang;
  chips.forEach(o => o.setAttribute('aria-pressed', String(o === c)));
  build(); t = p * T; now = -1; render();
  S.say(lang === 'hi' ? 'The call is now in Hinglish, with the English meaning under each line.' : 'The call is now in English.');
}));
S.sleeper(f, null, () => { if (playing) stop(false); });
f.classList.add('is-live'); f.dataset.lang = lang;
build(); render();
})();
