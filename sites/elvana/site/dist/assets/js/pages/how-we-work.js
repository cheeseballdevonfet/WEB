/* =========================================================================
   Elvana Media: pages/how-we-work.js
   "The paste-up" (INTERACTIONS.md, WEB.md 30). The stacking itself is CSS:
   position: sticky plus scroll timelines, so it is scrubbed by the scroll
   and needs no per-frame script. This file only:
   1. Fit: if a sheet's content cannot fit its pinned height (a short
      screen, large text), the stack falls back to the plain sequence
      (.no-stack), so nothing is ever hidden under the next sheet.
   2. Lands: when a new sheet settles on top, it says so politely (and
      plays the paste slap, which is silent unless paper sounds are on).
      Reading it is rAF-throttled and only runs while the stack is on screen.
   ========================================================================= */
(() => {
'use strict';
const list = document.querySelector('[data-pasteup]');
if (!list) return;
const root = document.documentElement;
const E = window.Elvana || { announce() {}, feedback() {} };
if (!root.classList.contains('motion')) return;
const sheets = [...list.querySelectorAll('.sheet')];
const names = sheets.map(s => s.querySelector('h3').textContent.trim());

/* 1. Fit ---------------------------------------------------------------- */
const stacked = () => getComputedStyle(sheets[0]).position === 'sticky';
function fit() {
  list.classList.remove('no-stack');
  if (!stacked()) return;
  const over = sheets.some(s => {
    const plate = s.querySelector('.sheet__plate');
    return s.scrollHeight > s.clientHeight + 2 || plate.scrollHeight > plate.clientHeight + 2;
  });
  list.classList.toggle('no-stack', over);
}
fit();
let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 150); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

/* 2. Lands ---------------------------------------------------------------- */
let top = -1, onScreen = false, queued = false, said;
function check() {
  queued = false;
  if (!onScreen || !stacked() || list.classList.contains('no-stack')) return;
  let t = -1;
  sheets.forEach((s, i) => {
    const want = parseFloat(getComputedStyle(s).top) || 0;
    if (s.getBoundingClientRect().top <= want + 1.5) t = i;
  });
  if (t === top) return;
  const rising = t > top;
  top = t;
  if (t < 0) return;
  if (rising) E.feedback('paste');
  clearTimeout(said);
  said = setTimeout(() => E.announce(`Step ${t + 1} of ${sheets.length}: ${names[t]}${t ? `, pasted over ${names[t - 1]}` : ''}.`), 450);
}
new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) check(); }).observe(list);
addEventListener('scroll', () => { if (!queued && onScreen) { queued = true; requestAnimationFrame(check); } }, { passive: true });
})();
