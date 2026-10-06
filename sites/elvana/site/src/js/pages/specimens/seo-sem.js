/* Specimen: SEO & SEM. The typed name is set into the ad, the local listing and the organic
   result as you type; a search chip re-pastes the page for a new search. Reduced motion:
   instant. No JS: "Your business". Nothing typed leaves the page. */
(() => {
'use strict';
const S = window.ElvanaSpec, f = document.querySelector('[data-spec="seo"]');
if (!S || !f) return;
const input = f.querySelector('#seo-name'), chips = [...f.querySelectorAll('[data-q]')], rows = [...f.querySelectorAll('.serp-r')];
const set = (k, v) => f.querySelectorAll(`[data-v="${k}"]`).forEach(n => { if (n.textContent !== v) n.textContent = v; });
let timer = 0;
function name() {
  const v = input.value.trim().replace(/\s+/g, ' ') || 'Your business';
  set('name', v);
  set('slug', v.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '') || 'yourbusiness');
  clearTimeout(timer);
  timer = setTimeout(() => S.say(`Results now show ${v}.`), 900);
}
function pick(b) {
  chips.forEach(c => c.setAttribute('aria-pressed', String(c === b)));
  set('q', b.dataset.q); set('c', b.dataset.c); set('t', b.dataset.t); set('d', b.dataset.d);
  rows.forEach((r, i) => S.anim(r, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 420, delay: i * 90, easing: S.EASE.paste, fill: 'backwards' }));
  S.say(`Search: ${b.dataset.q}.`);
}
input.addEventListener('input', name);
chips.forEach(b => b.addEventListener('click', () => pick(b)));
})();
