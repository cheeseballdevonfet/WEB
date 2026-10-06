/* Specimen: Website Development. Scrolling the section through the screen takes the sample
   page from wireframe (top of the screen) to finished; the slider does the same by hand and
   holds until the section leaves the screen. Asleep (no scroll work) while off-screen.
   Reduced motion: the finished page, and the slider still works. No JS: finished. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="web"]');
if (!S || !f) return;
const range = f.querySelector('#web-p'), stage = f.querySelector('.web-stage');
const STAGES = [[.04, 'Wireframe'], [.22, 'Navigation'], [.44, 'Headline'], [.6, 'Imagery'], [.76, 'Features'], [.94, 'Form'], [1.01, 'Finished']];
let manual = false, awake = false, queued = false;
const name = p => (STAGES.find(s => p < s[0]) || STAGES[STAGES.length - 1])[1];
function set(p) {
  f.style.setProperty('--p', p.toFixed(3));
  range.value = Math.round(p * 100);
  const n = p >= .999 ? 'Finished' : name(p);
  if (stage.textContent !== n) stage.textContent = n;
}
// 0 when the page's top edge enters the bottom of the screen, 1 when its middle reaches the upper third
function fromScroll() {
  const r = f.getBoundingClientRect(), vh = innerHeight, a = vh * .92, b = vh * .34 - r.height * .5;
  return Math.min(1, Math.max(0, (a - r.top) / (a - b)));
}
function onScroll() {
  if (manual || !awake || queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; set(fromScroll()); });
}
range.addEventListener('input', () => { manual = true; set(range.value / 100); });
range.addEventListener('change', () => S.say(`${stage.textContent}: the sample page is ${range.value === '100' ? 'finished' : 'part pasted up'}.`));
if (S.motion()) {
  S.sleeper(f, () => { awake = true; addEventListener('scroll', onScroll, { passive: true }); onScroll(); },
    () => { awake = false; manual = false; removeEventListener('scroll', onScroll); }, '200px 0px');
  set(fromScroll());
} else set(1);
})();
