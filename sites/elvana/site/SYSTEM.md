# Elvana Media site: design system and builder's guide

This is the shared system behind every page of www.elvanamedia.com. It was extracted from the approved home page, variation A, "Hoarding". The idea is Mumbai street and outdoor media made physical: flat poster inks on paper sheets, pasted edge to edge on a billboard grid, with loud and confident type. All the energy goes into one physical act per page.

Read this before you build a page. When this file and the code disagree, the code is right; fix this file.

```
python3 build.py              # build dist/ + preview/ and validate (exit 1 on any error)
node tools/qa.js --out /tmp/qa      # every page at 390/768/1440: errors, overflow, contrast, screenshots
node tools/crawl.js           # link crawl of dist/ and preview/
node tools/ship.js            # Ship-ready checks for the home page (--page /contact/ for another)
node tools/compare.js         # home vs variation A, side by side
```

Playwright must be on `NODE_PATH`. Fonts are already in `src/fonts/`; `python3 tools/fonts.py` re-fetches them.

---

## 1. The tree

```
site/
  build.py            pages + partials -> dist/ and preview/, then validation (see section 9)
  build-report.json   written by the build: pages, sizes, warnings (the QA tools read it)
  SYSTEM.md           this file
  src/
    partials/         head.html (meta, OG, JSON-LD hook), header.html, footer.html
    pages/            one file per route: front matter + body markup; files starting with _ are not built
      _template.html  the documented starting point for a new page
      index.html      home (ported from A)
      services.html, services/<slug>.html (14), our-edge.html, how-we-work.html, industries.html,
      engagement-models.html, work.html, work/case-study-template.html (noindex), about.html,
      contact.html, privacy.html, terms.html, 404.html
    css/              base.css (tokens, reset, type, grounds, utilities)
                      components.css (every reusable component)
                      tear.css (hero tear mechanics; owned by the tear module, do not edit)
                      pages/<page>.css (page-only layout)
    js/               core.js (every page), tear.js (tear + peel; owned by the tear module, do not edit), pages/<page>.js
    fonts/            woff2 subsets (section 8)
    og/               og-default.html (the share poster) -> og-default.png
  tools/              fonts.py, render-og.js, lib.js, qa.js, crawl.js, ship.js, compare.js, fontcache/
  dist/               deploy output (generated)
  preview/            self-contained pages for review (generated)
```

---

## 2. How to add or finish a page

1. Copy `src/pages/_template.html` to the route's file, for example `src/pages/services/seo-sem.html`. Every route already has a stub, so usually you edit the stub. Set the front matter (section 3) and keep the hero, `<h1 id="page-h">`, and the closing CTA poster.
2. Replace the TODO poster with sections built from the components in section 6. Write links root-absolute (`href="/contact/"`). Take facts from `CONTENT.md` only. Draft copy for review lives in `CONTENT-PAGES.md`; use only lines the client has approved. Anything still missing gets a `.todo` sticker.
3. Put page-only CSS in `src/css/pages/<name>.css` and list it in front matter (`css: pages/<name>`). Run `python3 build.py`, then `node tools/qa.js --only /your/path/`, and look at the screenshots at all three widths.

A new route also needs a link in `src/partials/footer.html` (the build fails otherwise), and in `header.html` if it belongs in the main nav.

---

## 3. Front matter

```
---
title: SEO & SEM | Elvana Media          # full <title>, unique, 65 chars or fewer
name: SEO & SEM                          # breadcrumbs + JSON-LD (default: title before " | ")
description: Rank higher on Google ...   # unique, 70 to 170 chars, facts from CONTENT.md
path: /services/seo-sem/                 # route, root-absolute, ends in /
body_class: page-service                 # optional
css: pages/service                       # optional, comma separated, from src/css without .css
js: tear, pages/service                  # optional; libraries load before core.js, pages/* after
noindex: true                            # optional: robots noindex, left out of sitemap.xml
og_title / og_image / og_image_alt       # optional overrides (og_image absolute URL)
---
```

The build fills these placeholders in the page body: `{{crumbs}}` `{{name}}` `{{title}}` `{{path}}` `{{description}}`. Any `<script type="application/ld+json">` in the body moves to `<head>`, after the site graph (Organization, LocalBusiness, WebSite, WebPage and BreadcrumbList, which every page gets automatically).

---

## 4. Tokens (all in `src/css/base.css`)

### Inks

Every poster is printed in **one** ink. Apply it with a ground class, never with a raw colour.

| Token | Hex | Role | Contrast (WCAG 2.x) |
| --- | --- | --- | --- |
| `--yellow` | #FFD000 | hoarding yellow, the brand ground, primary tags | ink on it 12.05 |
| `--red` | #C8201A | cinema red, the poster underneath | paper 5.12; yellow 3.88 (24px and up only) |
| `--ink` | #1A1814 | key plate: header, footer, dark posters | paper 15.90, yellow 12.05, paper-dim 12.61 |
| `--blue` | #1F3FB4 | process blue, secondary posters | paper 7.76, yellow 5.88 |
| `--paper` | #F2F3EF | cool white poster stock (not cream) | ink 15.90, blue 7.76, red 5.12 |
| `--back` | #E2E1DB | back of the paper, on lifted or torn flaps only | decorative |
| `--wall` | #A39F96 | the concrete wall, seen only in gaps | decorative (paper on it fails) |
| `--paper-dim` | #D9DAD5 | small print on ink | 12.61 on ink |
| `--ink-soft` | #3D3A35 | secondary text on paper | 10.16 on paper |

Red on yellow and yellow on red are 3.88. Use them only for display type 24px and up, or for decoration.

### Grounds

| Class | Background / text | `--focus` ring | `--hi` highlight |
| --- | --- | --- | --- |
| `.g-yellow` | yellow / ink | ink | red |
| `.g-red` | red / paper | paper | yellow |
| `.g-ink` | ink / paper | yellow | yellow |
| `.g-blue` | blue / paper | yellow | yellow |
| `.g-paper` | paper / ink | blue | red |

`.hi-ink` colours text with the ground's `--hi`. Use it for **one** heading per poster at most, never for one word inside a headline (that's on the ban list).

### Type

Display: **Yatra One** (Latin and Devanagari, drawn from hand-painted Mumbai railway signage). Text: **Mukta** 400 / 600 / 800. Both are OFL. Headings use the display face at weight 400 only: it has no bold, so never set `font-weight` on it.

| Class / use | 375 | 1440 | Line height |
| --- | --- | --- | --- |
| home hero h1 | min(15.2cqh, 24cqw) | about 165 (min(23cqh, 12.4cqw)) | .9 |
| page hero h1 (`.page-hero h1`) | 52 | about 135 (`.is-long`: 118) | .9 |
| `.d1` | 48 | 118 (max 124) | .95 |
| `.d2` | 34 | 60 | .95 |
| `.d3` | 26 | 37 | .95 |
| `.lede` | 19 | 24 | 1.42, max 38ch |
| body | 17 | 19 | 1.5 |
| `.small` | 14 | 15 | never below 14 |

Labels are sentence case in Mukta 800, never all-caps eyebrows. Use no middle-dot meta strings, no monospace labels and no "→".

### Grid and space

- **Billboard grid.** 12 columns at 1100px and up, 6 on tablets, 4 on phones. There are no gutters: posters sit edge to edge. The 12-column components (`.flyer-wall`, `.demo-grid`, `.page-hero`, `.vacant`) take spans `.w3 .w4 .w5 .w6 .w7 .w8 .w12`.
- **Sheets.** `--sheet` is 1/6 of the width on desktop, 1/4 on tablet and 1/2 on phone, and `--sheet-h` = 1.5 × sheet. Paste seams are drawn at every sheet, automatically, on every `.paste`.
- **Padding.** `--pad-x` 20 to 64 and `--pad-y` 56 to 112 (poster padding). The radius is 0 everywhere: paper is cut square.
- **Breakpoints.** 1099 (tablet), 979 (header switches to the Menu popover), 860, 699 (phone).

### Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-paste` | cubic-bezier(.2,.7,.1,1) | every entrance; the squeegee settle |
| `--ease-tug` | cubic-bezier(.55,0,.75,.2) | gravity: a sheet letting go |
| `--ease-lift` | cubic-bezier(.3,1.3,.5,1) | a corner lifting, one tiny overshoot |
| `--t-press` / `--t-lift` / `--t-paste` / `--t-paste-in` | 120 / 220 / 320 / 900 ms | press, hover lift, small paste, poster paste fallback |
| springs (tear.js) | flap k260 c26, roll k120 c19, peek k300 c30 | tear and peel physics |

Every duration multiplies by `--slow` (10 while slow motion is on). JS timers divide by `Elvana.timeScale`.

---

## 5. Rules

**Motion.**
- **One signature per page.** On the home page it is the hero tear. An inner page may use the **peel** once, in its hero, or nothing.
- **One ambient system: paste-on-scroll.** Each `.poster` is squeegeed on as it scrolls in. Never add a second ambient animation: no marquees, no floating shapes, no parallax, no fade-up on sections.
- **Allowed micro-motion.** The tag lift on hover, the flyer corner lift on hover or focus, and the demos (they play once in view and can be replayed).
- **How motion moves.** Entrances ease out. Per-frame animation touches only transform, opacity and clip-path. Everything can be interrupted.
- **Reduced motion and no JS.** Both give a finished, still page: the hero shows its torn corner still, demos show their final state, posters are simply there.

**Content.**
- Facts come from `CONTENT.md` only. Never invent clients, logos, results, numbers, prices, testimonials or photos.
- Where content is missing, show a designed TODO: a `.todo` sticker inline, or the vacant TODO block for a whole section.
- The legal name (ELEVANA MEDIA PRIVATE LIMITED) appears only in the footer's legal line.
- The wordmark is typographic ("Elvana" in Yatra One). Never redraw or trace the raster logo; the official SVG replaces the wordmark once supplied (there is a comment in `header.html`).
- No people photos exist. Use initials on halftone (`.portrait`, `.team .ini`), never stock or AI faces.

**Copy (ALL OUT ban list, October 2026; the build greps for these).**
- No em dashes, no "→" on links, no middle-dot strings.
- No lorem ipsum, John Doe or Acme.
- No filler words: elevate, seamless, unleash, next-gen, cutting-edge, world-class, game-changing, synergy.
- Numbered lists (`.steps`) only for real sequences.

**Devanagari.**
- Yatra One carries the full Devanagari block. The Devanagari file downloads only on pages that use it (dist), and is inlined only into preview pages that contain it.
- Mark every Devanagari word with `lang="hi"`. In body text, wrap it in `<span class="deva" lang="hi">` so it sets in the display face (Mukta ships Latin only; the text stack falls back to Yatra One).
- Hinglish (Hindi in Latin letters) is `lang="hi-Latn"`.
- Any Hindi line that is not in `CONTENT.md` needs client approval; leave an HTML comment with its English meaning.

**Accessibility.**
- One `<h1>` per page.
- Every interactive element has hover, `:focus-visible`, active and disabled states.
- Tap targets are at least 44px.
- Nothing is hover-only.
- Decorative elements are `aria-hidden`.
- Live changes are announced through `Elvana.announce()`.

---

## 6. Component catalogue

Markup snippets are minimal. Copy them, then change the grounds and the content.

### Poster and paste (the page section, and the ambient system)
```html
<section class="poster" id="models" aria-labelledby="models-h" style="--under:var(--paper)">
  <div class="paste g-blue"> … </div>
</section>
```
Every section after the hero is a poster pasted over the last one.
- **`--under`** is the ink of the poster **above** it, which shows while this one is pasted on. Never set two adjacent posters in the same ink.
- **The paste.** The squeegee and paste run on the scroll timeline. Where scroll timelines are missing, core.js runs a time-driven paste for posters that start below the fold.
- **Under a page hero.** The poster right under a page hero is never animated, because it can be on screen at load.
- **Full-bleed content.** Use `.paste.flush` to drop the padding (flyer walls, pillars).
- **Seams.** They are automatic. Add `.seamed` to any positioned block to get them elsewhere.

### Header and menu (partial, every page)
`partials/header.html` holds the wordmark, the main nav (Services, Our edge, How we work, Industries, Work, About) and the "Let's talk" tag to `/contact/`. Below 980px a native popover menu replaces the nav and pastes down from the top. The build adds `aria-current="page"` to links to the current page and `aria-current="true"` to the nav item of its section, so don't hand-write either.

### Footer (partial, every page)
`partials/footer.html` holds the promise ("Your Brand. Our Impact."), a site map that links **every** indexable page, the contact details, the legal line, Privacy, Terms, the **slow-motion switch** (`#slowmo`, also the S key), "Back to the top" and the shared live region `#sr-live`. The build fails if an indexable page is missing from it.

### Page hero (every inner page)
```html
<section class="page-hero" aria-labelledby="page-h">
  <div class="page-hero__main g-yellow">
    {{crumbs}}
    <h1 id="page-h" class="is-long">Outdoor, Hoardings &amp; Signage</h1>
  </div>
  <div class="page-hero__side g-blue">
    <p class="page-hero__line">One line from CONTENT.md.</p>
    <p class="page-hero__sign"><span class="d">Beyond digital</span>Elvana Media</p>
  </div>
</section>
```
Two posters side by side on the hoarding: the title sheet (8 of 12 columns, always yellow) and a side sheet (4 of 12). They stack on tablets and phones.
- **`.is-long`.** Add it when the title is longer than about 17 characters.
- **Crumbs.** `{{crumbs}}` renders `nav.crumbs` from the page path. Leave it out on top-level pages if you like.
- **Side-sheet inks used so far.** Core services red, Beyond digital blue, company pages ink, red or blue, legal paper. Keep each family consistent.

### Peel (optional signature, inner-page heroes only, once per page)
```html
<div class="peel" data-peel data-peel-corner="br">        <!-- br | bl | tr | tl -->
  <div class="peel__under page-hero__side g-yellow" aria-hidden="true">…</div>
  <div class="peel__over page-hero__side g-red">…</div>
</div>
```
Contract:
- **`tear.js` owns the peel.** It auto-inits every `[data-peel]`, lets the visitor peel `.peel__over` back from `data-peel-corner` to show `.peel__under`, and sets `data-peel-mounted` on the element once it has taken over.
- **CSS fallback.** Until `data-peel-mounted` is set (no JS, reduced motion, or tear.js missing), components.css shows a still, pre-curled corner: `.peel__over` is clipped at the corner (size `--peel`) and a folded paper triangle sits on top.
- **Content placement.** Essential content and links go on `.peel__over`. `.peel__under` is a reward (short, `aria-hidden` when it repeats something).
- **Wiring.** Add `tear` to `css` and `js` in the front matter. `404.html` is the live example.

### Hero tear (home only)
The block between `<!-- TEAR:BEGIN -->` and `<!-- TEAR:END -->` in `pages/index.html` is variation A's markup, unchanged. Its parts:
- `.hero` holds `.sheet-top` (with the h1) and `.sheet-under`;
- the tear canvas and grips;
- `#tear-live`;
- the svg defs `#tear-clip`, `#still-wide` and `#still-tall`;
- the snipe, with `#tear-btn`.

`tear.js` exposes `window.ElvanaTear.mountHero(heroEl, {button, live, clip, motion})`, and core.js calls it. `tear.css` holds only the mechanics (stacking, clip paths, canvas, grips). The composition (where the h1, sign-off and promise sit) is in `pages/home.css`. **Do not edit `tear.js` or `tear.css`.** They are replaced as a pair by the tear module, against this DOM contract.

### Snipe
```html
<div class="snipe g-ink"><p class="pos">Line in display type</p><p class="hint">Small print</p><div class="acts">…tags…</div></div>
```
The strip pasted under a hero poster. Use it on the home page only for now.

### Tag (the button)
```html
<a class="tag" href="/contact/">Let's talk</a>              <!-- yellow; the primary action -->
<a class="tag tag-ink" href="/services/">All 14 services</a> <!-- ink, on yellow or paper -->
<a class="tag tag-line" href="/industries/">…</a>           <!-- outlined in the poster's text colour -->
<button class="replay" type="button">Replay</button>       <!-- small secondary control -->
```
A square-cut paper tag that lifts at one corner on hover (`--ease-lift`) and presses down when clicked. Disable it with `[disabled]` or `aria-disabled="true"`. Use one primary (yellow or ink) tag per poster; wrap several tags in `.tags`. Use labels, never arrows. `.poster-foot` is the row for a poster's one onward link.

### Head split
```html
<div class="head-split"><h2 class="d1" id="x-h">Heading</h2><p class="lede">Lede</p></div>
```
The heading takes 7 columns and the lede 5, bottom-aligned. Use it to open most posters. It stacks below 1100px.

### Facts and statements
```html
<ul class="facts"><li><b class="num">2026</b><span>Incorporated in Mumbai</span></li>…</ul>
<div class="statements"><p><b>Vision</b>…</p><p><b>Mission</b>…</p></div>
```
- **Facts.** Big painted numbers in a strip that bleeds to the poster edges. Use them for real facts only. A missing number is a `.todo` in place of the `.num`.
- **Statements.** Two or three short statements with display labels.

### Pillars
```html
<div class="pillars"><div class="pillar g-yellow"><h3>Create.</h3><p>…</p></div>…</div>
```
Three full-height posters side by side (Create. Connect. Grow.). Put them inside `.paste.flush`.

### Flyer wall (corner lift)
```html
<div class="flyer-wall">
  <div class="flyer flyer--head g-ink w4"><h2>Core services</h2><p>…</p></div>
  <article class="flyer g-yellow w5"><h3><a href="/services/website-development/">Website Development</a></h3><p>…</p></article>
  <article class="flyer g-paper w3 half">…</article>
</div>
```
Fly-posters on a 12-column wall, mixed inks.
- **Corner lift.** On hover, keyboard focus or press, a flyer's bottom-right corner lifts and shows the paper's back (CSS only, `@property --c/--k`).
- **Whole-flyer link.** The `h3 a` stretches over the whole flyer.
- **Spans.** Rows of spans must add up to 12. `.half` makes a flyer half width on phones.

### Bill
```html
<div class="paste bill g-paper"><div class="bill-head"><h2 class="d1">…</h2><p class="d2">…</p></div>
  <ul class="bill-list"><li><h3><a href>…</a></h3><p>…</p></li>…</ul></div>
```
A printed bill: a ruled list of named items in three, then two, then one column. Use it for lists of six or more.

### Demos (illustrative product demonstrations)
```html
<div class="demo-grid">
  <article class="demo demo-chat g-blue" data-demo="chat">…<ol class="chat"><li class="ln them">…</li><li class="ln bot">…</li></ol>
    <figcaption><span>Illustrative chat for a sample institute. Not a real customer.</span><button class="replay js-only motion-only" type="button">Replay</button></figcaption></article>
  <!-- data-demo="call" (.wave + .script), "blast" (.tpl + .segs/.cells), "report" (.bars, --v:0..1) -->
</div>
```
core.js plays each demo once when it is 35% in view, and its Replay button plays it again. Every demo **must** carry a caption saying it is illustrative. They show no client data, ever. See `pages/index.html` for the full markup of all four.

### Steps
```html
<ol class="steps"><li><span class="n" aria-hidden="true">1</span><h3>Discover</h3><p>…</p></li>…</ol>
```
Use these only for a real sequence (the five-step process). The numbers are painted large in red.

### Cast and strip note
```html
<ul class="cast"><li class="lead">Insurance &amp; Financial Services</li>…<li>Corporate &amp; B2B</li></ul>
<p class="strip-note">One sentence on a yellow strip pasted askew.</p>
```
- **Cast.** A billing block of names, slash-separated like film credits. `.lead` marks the larger names.
- **Strip note.** Use it at most once per page.

### Vacant (the empty state and the TODO block)
```html
<div class="paste vacant">                      <!-- add vacant--todo for the stub version -->
  <div class="vacant__frame"><span class="todo">TODO: …</span><h2 class="vacant__title">First case studies are being written.</h2></div>
  <div class="plate g-red"><p>…</p><a class="tag" href="/contact/">…</a></div>
</div>
```
A freshly pasted blank sheet with paste brush marks. A dashed frame marks where the poster will go, and a plate is pasted over the frame's bottom edge (never over its title).
- **Where it's used.** The Work empty state (home and `/work/`) and the "This page is being pasted up" TODO block on stub pages.
- **Removal.** The block goes when the content arrives. The Work state stays until a real case study exists.

### TODO sticker
```html
<span class="todo">TODO: price</span>
```
A small askew sticker for a visible, honest gap. It turns ink on yellow grounds. Every TODO must name what is missing.

### Rate card
```html
<div class="rate"><article><h3>Monthly Retainer</h3><dl><dt>Best for</dt><dd>…</dd></dl>…
  <dl><dt>Price</dt><dd class="price"><span class="pl">From</span><span class="amt">₹<span class="gap" role="img" aria-label="amount to be confirmed"></span></span><span class="todo">TODO: price</span></dd></dl></article></div>
```
A rate board whose numbers are still to be painted. Use it on blue or ink grounds. Prices stay TODO until Elvana supplies them.

### People: founder, team and backing
`.founder` (with a `.portrait` initials block), `.team` (a ruled roll with `.ini` initials) and `.backing` (a blue poster inside a paper one). See `pages/index.html`. Missing focus areas and photos are `.todo`.

### Station boards
```html
<ul class="boards"><li class="board main"><div class="sign"><span class="hi" lang="hi">मुंबई</span><span class="en">Mumbai</span></div><div class="posts" aria-hidden="true"></div><p class="meta"><b>Andheri East</b><span>Registered office</span></p></li>…<li class="board next">…</li></ul>
```
City signs in Devanagari and Latin, on posts. `.main` marks the big one and `.next` the dashed "coming soon" sign.

### Form and details
```html
<form data-mailto-form action="mailto:info@elvanamedia.com" method="post" enctype="text/plain"> … </form>
<dl class="details"><div><dt>Email</dt><dd><a class="big" href="mailto:…">…</a></dd></div>…</dl>
```
- **Fields.** Big ruled fields (`.field`, with `.two` for a pair).
- **Validation.** core.js validates on blur and on send. Required fields need `aria-describedby` pointing at their `.err`. An optional `data-msg` sets the message; CSS prefixes "Fix this:".
- **Sending.** On send, core.js opens the visitor's email app with the message composed, and the `role="status"` paragraph says so. Without JS, the form posts to `mailto:`.
- **Placement.** Use the form on `.g-yellow` or `.g-paper` grounds.

### CTA poster (the closing poster)
```html
<section class="poster" aria-labelledby="cta-h" style="--under:var(--paper)">
  <div class="paste g-yellow cta-poster"><h2 class="d1" id="cta-h">Let's create impact together</h2>
    <div><p class="lede">…</p><div class="tags"><a class="tag tag-ink" href="/contact/">Let's talk</a>…</div></div></div></section>
```
Every page except Contact ends with it, always linking to `/contact/`.

---

## 7. JavaScript

**core.js (every page)**
- **MOTION.** Named curves and timings.
- **Slow motion.** The switch and the S key (off by default, not remembered). It dispatches `elvana:timescale` on `document` with `detail.timeScale` (1 or 0.1).
- **Menu.** It closes after a link is chosen.
- **Hero tear.** It calls `ElvanaTear.mountHero` when the page has a `.hero`.
- **Paste fallback.** It runs the time-driven paste where scroll timelines are missing.
- **Demos.** It plays each `[data-demo]` once in view.
- **Forms.** It handles `form[data-mailto-form]`.
- **API.** `window.Elvana = { MOTION, announce(text), setSlow(on), timeScale }`.

**Page scripts** go in `src/js/pages/<name>.js`, as an IIFE in strict mode. They load after core.js and use `window.Elvana`. Gate every animation on `document.documentElement.classList.contains('motion')`, divide timers by `Elvana.timeScale`, and leave the final state visible without JS.

**tear.js**: see the hero tear and the peel contract above.

---

## 8. Fonts

| File | Face | Covers | dist |
| --- | --- | --- | --- |
| `yatra-one-latin.woff2` | Yatra One 400 | full Latin + ₹ | preloaded |
| `yatra-one-devanagari.woff2` | Yatra One 400 | U+0900-097F, ZWNJ/ZWJ, dotted circle | only when a page uses it (unicode-range) |
| `mukta-{400,600,800}-latin.woff2` | Mukta | full Latin + ₹ | 400 and 800 preloaded |

- **Source.** The files come from Google Fonts `text=` subsetting, the same pipeline and cache as variation A (`tools/fonts.py`, `tools/fontcache/`).
- **dist.** Fonts use `font-display: swap`. Preloads are added by a script, and never on `file://`, where Chromium blocks CORS preloads.
- **preview.** Each page inlines only the faces whose unicode-range intersects its own characters, with `font-display: block`.
- **Out-of-range characters.** The build warns about any character outside the subsets.

---

## 9. SEO and the build

**Per page.** The build generates these from front matter and `partials/head.html`:
- `<title>`, meta description, and canonical `https://www.elvanamedia.com<path>` (none on 404);
- `robots noindex` when asked;
- Open Graph and Twitter tags, with the default image `/assets/og-default.png`, 1200×630, rendered from `src/og/og-default.html`;
- JSON-LD: Organization, LocalBusiness (registered office in Andheri East, Mumbai 400069; +91 89283 39531; info@elvanamedia.com), WebSite, WebPage and BreadcrumbList;
- the favicon, an inline SVG "E" poster in ink on yellow.

**dist/.**
- Shared assets live in `/assets/{css,js,fonts}`.
- Links are relative and end in `index.html`, so the site works from `file://`, a subfolder or a domain root. `--clean-urls` drops the `index.html` for a server.
- Also written: `sitemap.xml` (indexable pages only) and `robots.txt`.
- `404.html` is self-contained and its links are root-absolute, because a host serves it at any URL. `--base /sub/` sets the prefix for a subfolder deploy.

**preview/.** Every page is self-contained (CSS, JS and only the fonts it uses, inline), and the links between pages are relative.

**Validation.** The build fails (exit 1) on any of these:
- an internal link or `#fragment` that doesn't resolve, in either tree;
- not exactly one h1, or a missing header, main or footer;
- a duplicate id;
- a duplicate title or description;
- a missing canonical or OG tag;
- an external request (`src`, stylesheet, `url()`, `@import`, or a URL in JS or CSS);
- banned copy;
- an indexable page missing from the footer.

It warns when a title is over 65 characters or a description falls outside 70 to 170.

**QA tools.** All of them use Playwright, with real wheel scrolling so the scroll-driven states fire.
- `tools/qa.js`: every page at 390, 768 and 1440 in both trees. It checks errors, blocked requests, overflow, clipped words, the h1, landmarks, computed AA contrast and aria-current. It takes screenshots at top, middle and bottom, plus a contact sheet per width.
- `tools/crawl.js`: the link crawl.
- `tools/ship.js`: the Ship-ready checks (4× CPU throttle, slow 4G over http, CLS, LCP, interaction latency, keyboard, reduced motion, no JS).
- `tools/compare.js`: home vs A.
