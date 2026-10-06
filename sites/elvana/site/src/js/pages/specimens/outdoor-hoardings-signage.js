/* Specimen: Outdoor, Hoardings & Signage. As you type, the name is set on all three boards,
   sized to each; when you pause, the boards are repainted one after another, a brush stroke
   left to right. Reduced motion: the name just changes. No JS: "Your brand". */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="ooh"]');
if (!S || !f) return;
const input = f.querySelector('#ooh-in'), names = [...f.querySelectorAll('.ooh-name')], said = f.querySelector('.ooh-said');
const boards = [...f.querySelectorAll('.ooh-board,.ooh-panel,.ooh-fascia')];
let timer = 0, last = 'Your brand';
// size the name to its board: as large as the board allows, never wider than it
function fit(n) {
  n.style.fontSize = '';
  const box = n.parentElement, cs = getComputedStyle(box);
  const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const max = box.clientWidth * (box.classList.contains('ooh-panel') ? .3 : .2);
  n.style.fontSize = max + 'px';
  if (n.scrollWidth > room) n.style.fontSize = Math.max(14, max * room / n.scrollWidth) + 'px';
}
new ResizeObserver(() => names.forEach(fit)).observe(f);
function paint() {
  const v = input.value.trim().replace(/\s+/g, ' ') || 'Your brand';
  f.style.setProperty('--n', Math.max(5, v.length));
  names.forEach(n => { n.textContent = v; fit(n); });
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (v === last) return;
    last = v;
    boards.forEach((b, i) => S.anim(b.querySelector('.ooh-name'), [{ clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)' }], { duration: 520, delay: i * 160, easing: S.EASE.paste, fill: 'backwards' }));
    said.textContent = `The brand name on all three: ${v}.`;
  }, 450);
}
input.addEventListener('input', paint);
})();
