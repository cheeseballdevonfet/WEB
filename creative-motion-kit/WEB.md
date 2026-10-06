# Web Prompt Kit

__COUNT__ standalone prompts for award-level websites, landing pages and UI components, built from studying real prompts people use and what 2025–26 award-winning sites actually do. Every prompt works on its own, with or without brand guidelines, and defaults to one self-contained HTML file you can open anywhere.

## How to use

Every prompt starts with two lines. `BRAND: open` lets Claude invent the look (most variety); replace it with your name, site URL, colours, fonts and logo to keep everything on-brand. `STACK:` says what to build with; the default is one self-contained HTML file, and the Stack switch power-up changes it (vanilla + GSAP, Next.js + Tailwind + Motion, React Three Fiber, Astro).

Start big pages with the page prompts (W01–W08). Use the component prompts to build or replace one section at a time; paste the same Brand block above each so the pieces belong together.

The order that produces the best work: Anti-repetition (pick an unexpected art direction) → Design system first (tokens and one signature interaction before any code) → build → Juror critique (screenshots at phone, tablet and desktop, scored, three weakest fixed) → Ship-ready checks.

Use Claude Opus 5.5 on high effort for the signature moment and medium for everything else. Give it real content: copy, photos, logos and numbers. The prompts tell it never to invent clients, stats or quotes.

Prompts marked "Based on" are adapted from the creators, sites or guides linked in each entry. The rest were written for this kit. None are guaranteed as written, so expect to iterate.

## Power-ups

### Anti-repetition
id: variety
note: Makes Claude reject the default AI look before designing anything.

```text
Before designing anything, list 6 completely different art directions for this brief (layout system, typography,
palette, motion language, interaction model, and a reference era, movement or discipline outside web design).
Throw out the 3 most obvious ones, the ones any AI would pick. Commit to the boldest remaining direction and tell
me in one line which one you chose and why.
```

### Design system first
id: system
note: Tokens, type scale and one signature interaction, decided before any component code.

```text
Before any component code, write the design system and show it as a one-screen style tile: a type scale with
sizes at 375 and 1440 wide (display, headline, body, caption), a grid with breakpoints, 4–6 named colour tokens
with their contrast ratios, a spacing scale, corner radius, and motion tokens (2 easing curves, 2–3 spring
settings, durations, stagger). Name the ONE signature interaction this site will be remembered for and where it
lives. Then review the plan against the generic default you would produce for any similar site, change anything
that matches it, and only then build.
```

### ALL OUT (web)
id: allout
note: Stakes, craft rules and the bans that separate award-level sites from AI templates.

```text
Go all out. Treat this as the site that wins Site of the Day: if it looks like a template, you don't get hired.
One extraordinary interaction beats ten decorations; every other section stays quiet and precise.
Craft rules: every interactive element has hover, focus-visible, pressed and disabled states; motion is triggered
by scroll, hover or intent, never decorative autoplay noise; springs with a tiny overshoot at most; nothing linear
that starts and stops; text is never hard to read while it animates; content enters after its container moves;
mobile is designed, not shrunk; the headline is real text visible immediately; 60fps on a mid-range phone; a
reduced-motion version that still looks finished.
Banned (the giveaways of AI-made sites): centered title on a gradient, fade-and-slide-up on every section,
identical rounded cards with soft shadows, default bento grids, gradient blobs, glassmorphism, purple-to-blue neon,
near-black with one acid-green accent, cream with terracotta, Inter/Roboto/Geist, 3D emoji or stock AI imagery,
fake logos, fake testimonials or stats, lorem ipsum, pill buttons with arrows on everything.
```

### Juror critique
id: critique
note: The review loop: real screenshots at three widths, scored like an awards jury, three weakest fixed.

```text
Before you finish, run it in a browser and screenshot it at 375, 768 and 1440 wide (top, middle and bottom of the
page), plus the signature interaction mid-motion and one hover/focus state. Critique it as a harsh awards juror:
score Design, Usability, Creativity and Content out of 10, and each screenshot out of 10. List the 3 weakest
moments, fix them, re-screenshot, and show me the before and after scores. Repeat until nothing scores below 7.
```

### Ship-ready checks
id: ship
note: Performance, accessibility and robustness gates before you call it done.

```text
Ship-ready checks before finishing: Largest Contentful Paint is real text or an optimised image under 2.5s on a
throttled mobile profile; layout shift 0; interactions respond under 200ms; animate only transform, opacity and
shader uniforms; pause off-screen canvases and video; images sized and lazy-loaded below the fold; fonts subset
and preloaded with fallbacks that don't shift; semantic landmarks and one h1; full keyboard navigation with a
visible focus style; colour contrast AA; alt text; a prefers-reduced-motion path; works without JavaScript for
the core content. Report each check as pass/fail with the number.
```

### Brand block
id: brand
note: Replace the BRAND: open line with this, filled in, when you want results on-brand.

```text
BRAND: {{NAME}} — {{WHAT YOU DO, ONE LINE}} — {{SITE URL, if any: read it for facts and tone}}.
Audience: {{WHO IT'S FOR}}. Personality: {{3 ADJECTIVES}}.
Colours: {{3–5 HEX CODES WITH ROLES}}. Fonts: {{DISPLAY}} + {{TEXT}}. Logo: {{ATTACHED / URL / "none"}}, use as given.
Real content to use: {{COPY, PRODUCTS, CASE STUDIES, NUMBERS, QUOTES, PHOTOS}}. Never invent clients, metrics or quotes;
leave a visible TODO where content is missing.
```

### Stack switch
id: stack
mode: replace
line: STACK
note: Changes the STACK: line of every prompt.
options:
- one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
- one HTML file with GSAP (ScrollTrigger, SplitText, Flip) and Lenis from a CDN
- Next.js App Router + TypeScript + Tailwind v4 + Motion, as a small repo I can run
- React + React Three Fiber + drei for the 3D parts, Motion for the UI, as a Vite repo
- Astro with vanilla JS islands and View Transitions, as a small repo I can run

## Web roulette

Pick one item from each list (or roll four 20-sided dice) and add this line to any prompt: `Art direction: {{A}}. Interaction model: {{B}}. Motion language: {{C}}. Constraint: {{D}}.` That's 160,000 combinations.

### Art direction
1. Swiss International Typographic Style grid
2. Museum exhibition catalogue
3. Architectural blueprint and plan drawings
4. Risograph zine, two inks
5. Mid-century airline and travel posters
6. Scientific field guide with specimen plates
7. 1960s Op Art (Riley, Vasarely)
8. Russian Constructivist poster
9. Memphis Group, 1981
10. Japanese minimalism and generous ma (negative space)
11. Blue Note record sleeves
12. Pharmaceutical packaging and labels
13. Film title sequence (Saul Bass era)
14. Transit wayfinding and signage systems
15. Fashion magazine editorial spreads
16. Brutalist raw HTML with one perfect detail
17. Arcade and pixel-art game UI
18. Cut-paper collage
19. Monochrome documentary photography
20. Botanical engraving and herbarium sheets

### Interaction model
1. The cursor is a lens that reveals a hidden layer
2. Drag to explore an infinite canvas
3. Scroll is a camera moving through one continuous scene
4. Hover a list item to preview its world
5. Click and hold to charge, release to reveal
6. The page is a physical object: paper that folds and slides
7. Everything is a list that expands in place
8. Type you can play with (variable-font axes follow the pointer)
9. Keyboard-first, with visible shortcuts
10. Scroll-scrubbed video or image sequence
11. Before/after comparison slider as the main device
12. Deep zoom from overview into a single detail
13. A timeline you scrub with a handle
14. Pinned chapters with one changing figure
15. Elastic physics: elements stretch and settle
16. A magnetic grid that snaps to the pointer
17. Draw or trace to navigate
18. A machine with levers, toggles and dials
19. Sound that responds to interaction (muted by default)
20. Device tilt on phones, pointer on desktop

### Motion language
1. Snappy springs, tiny overshoot
2. Slow cinematic dolly moves
3. Mechanical stepped motion (no tweening between states)
4. Viscous liquid easing
5. Paper folds and slides
6. Typewriter and teletype
7. Stop motion at 12fps
8. Hard-edged mask wipes only
9. Parallax depth in three planes
10. Shape morphing between states
11. Shared-element continuity between pages
12. Inertia and momentum from the pointer
13. Frame-by-frame sprite animation
14. Slow generative noise drift
15. Split-flap board flips
16. Ripples from the interaction point
17. Scale from the origin of the click
18. Choreographed rows, staggered by 40ms
19. Rotation in 3D around one hinge
20. Blur-free crisp motion with motion-blur ghosts

### Constraint
1. Two colours only
2. One typeface, three weights
3. No images at all
4. No rounded corners
5. Everything on an 8px baseline grid, visible
6. Under 100KB total
7. Core content works without JavaScript
8. One page, one screen, no scroll
9. Monochrome plus one accent
10. Display type at 120px or larger on desktop
11. A single column, no grids
12. Every section a different full-bleed colour
13. No hover effects (touch-first)
14. At most three animated elements per screen
15. Text-only hero
16. Real data only, drawn live
17. Exactly one 3D object
18. Dark mode only, no pure black
19. Every interaction makes a sound (muted by default)
20. All motion driven by scroll, none by time

### Let Claude roll

```text
Before you start, choose one art direction, one interaction model, one motion language and one constraint that
together make the most unexpected site you can justify for this brief. Tell me the four choices in one line, then
commit to them fully.
```

## Prompts: Whole sites and pages

### 1. The Site of the Day landing page

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design and build a landing page for {{BRAND OR PRODUCT}} that shows what an incredible web designer you are, like
it's the site that wins Site of the Day. Go all out.
Before designing anything, list 6 completely different art directions (layout system, type, palette, motion
language, interaction model, reference era or movement). Throw out the 3 most obvious ones. Commit to the boldest
remaining one and tell me in one line which you chose and why.
Then write the design system (type scale, grid, 4–6 colour tokens, spacing, motion tokens) and name the ONE
signature interaction the page will be remembered for. Sections: first screen, what it is, how it works, proof,
one conversion moment, footer. Real copy only, from the brand; no lorem ipsum, no fake logos or stats.
Before you finish, screenshot at 375, 768 and 1440 wide, critique as a harsh awards juror, and fix the 3 weakest.
```

Twists: …for a product that doesn't exist yet (invent it in 3 lines first) · …in 6 sections, each with a different interaction model · …as a single screen with no scroll

### 2. The portfolio that gets you hired

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a personal portfolio for {{NAME, ROLE}} with {{4–8 PROJECTS: title, year, role, one-line outcome, images}}.
The work is the hero: the index is a list or grid where hovering a project previews it (image, motion or colour
taking over the page), and clicking expands it into the case study with a shared-element transition, without a
white flash. Each case study: problem, what I did, 3–5 images in a designed rhythm (not a stack of equal cards),
outcome in one sentence, next project. About section: one paragraph and a photo treated in the site's art
direction. Contact: email that copies on click. Pick an art direction that matches the person's discipline,
not a generic dark portfolio.
```

Twists: a type designer · a 3D artist · a product designer · a photographer · an architect

### 3. Product page for a real product

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design and build the product page for {{PRODUCT + ONE-LINE PITCH}}. The first screen shows the actual product
working (rebuilt as real, interactive UI in code, not a screenshot and not a fake dashboard), with the headline in
real text. Then: the one problem it solves, told as a scroll sequence where the UI changes state as you read;
three capabilities, each demonstrated live, not described; a proof section using only facts I give you; pricing or
the next step; FAQ as an expanding list. The signature interaction should come from how the product itself
works.
```

### 4. E-commerce product detail page

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design and build a product detail page for {{PRODUCT, PRICE, VARIANTS, MATERIALS}}. Gallery: large imagery with
a zoom you can drag, and variant changes (colour, size) that update the image with a crisp transition and no
layout shift. Add to cart: the button morphs into a confirmation and the cart count increments with a small
physical bounce. Details as expanding sections (materials, sizing, shipping, care). One editorial moment below the
fold that tells the product's story in the brand's art direction. Sticky purchase bar on mobile. Real prices and
copy only.
```

### 5. Scrollytelling long-read

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Turn {{ARTICLE / STORY / REPORT + ITS DATA}} into an editorial scrollytelling page. A pinned figure (chart, map,
diagram or illustration) changes state as each paragraph scrolls past; text stays readable at all times in a
comfortable measure (60–75 characters). Chapters with a strong typographic opener each. At least one moment where
the reader controls the figure (scrub, toggle, hover a data point). Data must be real and labelled with its
source. Works as a plain readable article with JavaScript off or reduced motion on.
```

### 6. Studio or agency site

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the site for {{STUDIO NAME, WHAT THEY DO, CITY}} with {{3–6 REAL PROJECTS}}. It should feel like the studio's
best project. First screen: a statement in display type and one live, interactive piece of the studio's work
(not a showreel autoplaying behind text). Work index with hover previews and shared-element transitions into case
studies; services as a list where each item demonstrates itself on hover; a team section with real people; a
contact moment that is the most delightful interaction on the page. Avoid every agency cliché: 0–100 preloader
counters, blob cursors, giant marquee text, grain over everything.
```

### 7. Event or campaign microsite

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a microsite for {{EVENT / CAMPAIGN, DATE, PLACE, WHAT HAPPENS}}. One big idea carried through every section
(a poster system, a countdown that's actually designed, a map, a lineup that reacts to the pointer). Make the
date, place and call to action findable in two seconds on a phone. Include the share card (Open Graph image
1200×630) designed in the same system, and an add-to-calendar button that works.
```

### 8. Design system and style tile

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Before building any site for {{BRAND}}, create its design system as a living style tile page: 3 candidate type
pairings rendered as real headlines and paragraphs; a colour system with named tokens, roles and AA contrast
ratios; a type scale at 375 and 1440; spacing and grid shown visually; buttons, links, inputs, toggles and cards in
every state (default, hover, focus, pressed, disabled, error); motion tokens demonstrated live (easing curves
plotted, springs animating a square, a 10%-speed toggle); and one signature interaction prototyped. Then tell me
which pairing and palette you recommend and why.
```

## Remixes

### Harsh juror pass

```text
Be honest: would this win Site of the Day? Screenshot it at 375, 768 and 1440 wide (top, middle, bottom) and the
signature interaction mid-motion. Score Design, Usability, Creativity and Content out of 10 like an awards jury,
list the 3 weakest moments with screenshots, fix them, and show me the before and after scores.
```

### Three radically different directions

```text
Now make 3 radically different versions of this page, each in its own file: different art direction, type,
palette, layout system and interaction model. One of them should be a direction I would never have thought to ask
for. Keep the content and structure identical so I can compare them fairly.
```

### Make it less AI

```text
List every choice in this page that a generic AI-built site would also make: palette, typefaces, layout, section
order, card styles, motion, copy patterns. Replace each one with a specific, deliberate alternative that fits the
art direction, then add any new default you noticed to the banned list and check again.
```

### Push the signature moment

```text
Find the single most memorable interaction on this page and make it twice as good: more precise timing, a better
response to the pointer, a payoff at the end, a detail that rewards trying it twice. Cut anything elsewhere that
competes with it.
```

### Mobile pass

```text
Open it at 375 wide and use it like a phone user: thumb reach, tap targets of at least 44px, no hover-only
information, readable type without zoom, no horizontal scroll, no motion that fights the scroll. Redesign
(don't just shrink) any section that fails, and screenshot before and after.
```

### Accessibility and performance pass

```text
Audit this page for keyboard navigation, focus visibility, screen-reader labels, colour contrast, reduced motion,
Largest Contentful Paint, layout shift and interaction latency. Fix every failure and report each check with its
number before and after.
```

### Director notes
note: Vague notes like "make it better" get random changes; specific ones get exactly what you want.

- The headline arrives after the image; reverse that so the words land first and the image follows 120ms later.
- The hover state on the project list is too timid: scale the preview to 1.06, shift it 12px toward the pointer, and add a 200ms mask reveal.
- Everything on this page fades up the same way. Give each section its own entrance that matches its content, and make two sections enter with no animation at all.
- The page has no rhythm: alternate dense and airy sections, and make one section break the grid on purpose.
- The colours are timid. Pick one section to flood with the accent colour edge to edge.
