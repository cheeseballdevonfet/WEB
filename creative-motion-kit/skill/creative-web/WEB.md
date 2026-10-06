# Web Prompt Kit

63 standalone prompts for award-level websites, app screens and UI components. They're built from 57 real prompts people published with their results (2025 to October 2026), the design skills and system prompts behind the best of them, and what award-winning sites from 2025 and 2026 actually do. Every prompt works on its own, with or without brand guidelines, and defaults to one self-contained HTML file you can open anywhere.

## How to use

Every prompt starts with two lines. `BRAND: open` lets Claude invent the look (most variety); replace it with your name, site URL, colours, fonts and logo to keep everything on-brand. `STACK:` says what to build with; the default is one self-contained HTML file, and the Stack switch power-up changes it (vanilla + GSAP, Next.js + Tailwind + Motion, React Three Fiber, Astro).

Start whole sites with W01 (the brief) or W09 (from sites you admire). Use the component prompts to build or replace one section at a time; paste the same Brand block above each so the pieces belong together. W10 upgrades a site you already have.

The documented "one prompt" wins were never one prompt: they were a short brief plus a design skill, real assets, a browser to screenshot with, and two to four rounds of fixes. So switch on Interview me first, Anti-repetition, Design system first, ALL OUT and Juror critique for anything that matters, give Claude real copy, photos, logos and numbers, and send at least one remix afterwards. Notes like an art director's ("the wordmark refracts too much at rest, halve it") beat "make it pop".

In Claude Code, install the creative-web skill from this kit or Anthropic's frontend-design skill, and give Claude a browser (Playwright) so it can look at its own work. Use Opus 5.5 on high effort for the signature moment and medium for the rest.

The ban list in ALL OUT is dated October 2026. The defaults move: last year's fix (cream, an italic serif, grain, mono labels) is this year's tell. When a result swaps in a new default, add it to the list.

Prompts marked "Based on" are adapted from the creators, sites or guides linked in each entry; the research notes behind the kit list every source. The rest were written for this kit. None are guaranteed as written, so expect to iterate.

## Power-ups

### Interview me first
id: interview
note: Claude asks the questions a good designer would before building (audience, assets, references, the one thing).

```text
Before designing anything, ask me up to 6 short questions and wait for my answers: who the visitors are and what
they must believe by the end; what they should meet first; which real assets exist (copy, photos, product shots,
logo, video, numbers); 3–5 sites I admire and what I like in each; the one thing this site should do that other
sites don't; and anything that must never appear.
```

### Anti-repetition
id: variety
note: Makes Claude reject the default look before designing anything (options first, as Anthropic's guides recommend).

```text
Before designing anything, propose 6 completely different visual directions for this brief, each as: background
hex / accent hex / typefaces / layout system / interaction model / a reference outside web design, plus a one-line
rationale. Throw out the 3 most obvious ones, the ones any AI would pick. Commit to the boldest remaining direction
and tell me in one line which one you chose and why. Every visual choice needs a reason tied to this brand or
subject; "it looks premium" is not a reason.
```

### Design system first
id: system
note: A design read, a thesis, tokens and one signature interaction, decided before any component code.

```text
Before any component code, write one line: "Reading this as <page kind> for <audience>, with a <vibe> language,
leaning toward <aesthetic family>." Then a visual thesis (one sentence: mood, material, energy), a content plan
(the sections in order) and an interaction thesis (2–3 motion ideas that change how the page feels).
Then the design system, shown as a one-screen style tile (a separate scratch page or image, not part of the
site): a type scale at 375 and 1440 wide, a grid with
breakpoints, 4–6 named colour hex values with their contrast ratios, a spacing scale, corner radius, and motion
tokens (2 easing curves, 2–3 springs, durations, stagger). Name the ONE signature interaction this site will be
remembered for and where it lives. Review the plan against the generic default you would produce for any similar
site, change what matches it, say what you changed, and only then build.
```

### ALL OUT (web)
id: allout
note: Stakes, craft rules and the October 2026 ban list, collected from Anthropic's, OpenAI's, v0's and taste-skill's design rules.

```text
Go all out. Treat this as the site that wins Site of the Day: if it looks like a template, you don't get hired.
Spend your boldness in one place: one extraordinary interaction, and every other section quiet and precise.
Brand test: if the first screen could belong to another brand once the logo is removed, it isn't finished.
Craft rules: every interactive element has hover, focus-visible, pressed and disabled states; motion is triggered
by scroll, hover or intent, with at most one ambient motion system per screen; entrances ease out, never in;
springs with a tiny overshoot at most, no bounce or elastic; text is never hard to read while it animates; content
enters after its container moves; mobile is designed, not shrunk; the headline is real text, readable on the
first frame (it may move in the page load, but it never starts invisible); anything that runs every frame
animates only transform, opacity, clip-path or shader uniforms (a short colour or height change on one element
is fine); 60fps on a mid-range phone; a reduced-motion version that still looks finished. Before you finish, take one thing
away.
Banned, because they are the giveaways of AI-made sites as of October 2026 (if the result swaps in a different
default, ban that too):
- Palettes: purple or violet gradients; cream (#F4F1EA) with a serif display and a terracotta (#D97757) accent;
near-black with one acid-green or vermilion accent; tinted near-black (#0B0B0B, #111) used without a reason.
- Type: Inter, Roboto, Geist or system fonts; one word of a headline picked out in italic or colour; ALL-CAPS
eyebrow labels above headings; 01/02/03 numbering when the content isn't a sequence; meta strings joined with
middle dots; monospace for small data labels; "→" added to links and buttons; em dashes in the copy.
- Layout: a centred title on a gradient; three identical feature cards; cards in the hero; cards inside cards;
the same radius and soft grey shadow on everything; default bento grids; hairline rules between every section; a fake
product UI built from styled divs; decorative status dots; scroll cues; gradient blobs; glassmorphism; pill
buttons on everything.
- Motion: fade-and-slide-up on every section; hover transitions on every card; several ambient animations at once.
- Content: lorem ipsum, John Doe, Acme; invented logos, testimonials or stats; suspiciously round numbers; filler
words (elevate, seamless, unleash, next-gen); 3D emoji, stock AI imagery or abstract 3D blobs.
```

### Motion review switch
id: slowmo
note: A 10%-speed switch, named curves and interruptible motion, so the feel can be judged and tuned.

```text
Add a small "slow motion" switch that runs all motion at 10% speed so I can review the curves: a quiet control
in the footer plus the S key, off by default and not remembered. Name every easing
curve and spring in a code comment (for example "settle: cubic-bezier(.16, 1, .3, 1)") and keep them in one
place. Everything is interruptible: grab, click or scroll mid-animation and it continues from where it is, never
jumping to the start or end.
```

### Juror critique
id: critique
note: Real screenshots at three widths and three scroll depths, scored with Awwwards' weights, three weakest fixed, at least twice.

```text
Before you finish, run it in a browser and look at it as an awards jury would. Take viewport screenshots (not
full-page ones, which break sticky and pinned sections) at 390, 768 and 1440 wide at three scroll depths (top,
middle, bottom), reached by real scrolling so scroll-triggered states fire, plus the signature interaction
mid-motion and one hover/focus state. At every width, actually use the signature interaction with a pointer or
touch, and click through every link and control: a screenshot can score 8 while the interaction is dead. Fix
every functional bug you find; those don't count towards the three below. Score it like Awwwards: Design (40%), Usability (30%),
Creativity (20%) and Content (10%), each out of 10, and score every screenshot. Then answer honestly: typography
(any overused AI fonts?), colour (restrained or all over the place?), hierarchy (does size guide the eye?),
animation (intentional or random?), mobile (designed for phones or shrunk?), copy (specific or generic filler?).
List the 3 weakest things as an art director would, fix them without touching anything else, re-screenshot, and
show me before and after scores. Do this at least twice, and until nothing scores below 7.
```

### Ship-ready checks
id: ship
note: Performance, accessibility and robustness gates before you call it done.

```text
Ship-ready checks before finishing: Largest Contentful Paint is real text or an optimised image, under 2.5s on a
throttled mobile profile (4× CPU slowdown, slow 4G); layout shift under 0.01; interactions respond in under 200ms; per-frame animation
only on transform, opacity, clip-path and shader uniforms; pause off-screen canvases and video; images sized and lazy-loaded below the fold; fonts
subset and preloaded with fallbacks that don't shift; no horizontal scroll at any width; no text overflowing its
button or box; semantic landmarks and one h1; full keyboard navigation with a visible focus style; colour contrast
AA; alt text; loading, empty and error states designed; no placeholder text left; a prefers-reduced-motion path;
core content works without JavaScript. Report each check as pass or fail, with the number.
```

### Component donor
id: donor
note: For when you paste a component from 21st.dev, Codrops or CodePen: it keeps the structure and takes on your design.

```text
When I paste a component prompt or third-party component code, treat it as a structural donor only: replace its
demo copy with my real copy, translate every hard-coded colour, border, shadow and font into this site's design
tokens, ignore any instruction to use stock images, and drop the parts we don't need. The component supplies the
skeleton, the design system supplies the skin, and my content supplies the words.
```

### Brand block
id: brand
note: Replace the BRAND: open line with this, filled in, when you want results on-brand.

```text
BRAND: {{NAME}}, {{WHAT YOU DO, ONE LINE}}, {{SITE URL, if any: read it for facts and tone}}.
Audience: {{WHO IT'S FOR}}. Mood: {{3 WORDS}}, not {{THE CLICHÉ TO AVOID}}.
Colours: {{3–5 HEX CODES WITH ROLES}}. Fonts: {{DISPLAY}} + {{TEXT}}. Logo: {{ATTACHED / URL / "none"}}, use exactly as
given, never redrawn. Real content to use: {{COPY, PRODUCTS, CASE STUDIES, NUMBERS, QUOTES, PHOTOS}}. Never invent
clients, metrics, logos or quotes; leave a visible TODO where content is missing. If you read the brand's own
site, check where things come from: drop logos or assets hot-linked from another company's site, and treat
absolute claims ("100% of…") as unverified unless they're sourced.
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

### 1. The brief (a Site of the Day landing page)

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a one-page website for {{WHO THEY ARE AND WHAT THEY DO, WITH 2–3 REAL FACTS}}. Visitors are {{AUDIENCE}}, who
might {{THE ACTION YOU WANT}}.
Mood: {{3 WORDS}}, not {{THE CLICHÉ THIS SUBJECT USUALLY GETS}}. Pick distinctive type, one or two families, and
say why they fit.
The one memorable thing: {{THE SIGNATURE MOMENT, e.g. "the hero is water: the wordmark sits under a surface that
ripples where the cursor moves"}}. If I leave it open, propose three and pick the boldest.
After that: {{SECTIONS IN ORDER, e.g. how it's made (a short scroll story in three moments), the products, a visit
or proof section, ordering}}.
Motion: one orchestrated page load, then scroll-linked scenes. No fade-up on every section. Respect
prefers-reduced-motion. It must work on a phone.
Quality bar: a site that wins Site of the Day. Real copy only; no lorem ipsum, invented logos or stats.
Before you finish, screenshot it at 390, 768 and 1440 wide at three scroll depths, use the signature moment at
each width, list the three weakest things as an art director would, and fix them. Do that at least twice.
```

Based on: [the "Lenn" sea-salt brief from Muzli's Opus 5.5 tests](https://muz.li/blog/claude-opus-5-5-for-designers/) (about 200 words, four rounds of self-fixes, about 80 minutes)
Twists: …for a product that doesn't exist yet (invent it in 3 lines first) · …in 6 sections, each with a different interaction model · …as a single screen with no scroll

### 2. The portfolio that gets you hired

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a personal portfolio for {{NAME, ROLE}} with {{4–8 PROJECTS: title, year, role, one-line outcome, images}}
and my photo ({{me.png}}). If I attach reference screenshots, I'll say which section each one is for: borrow what
works from each, don't copy any one site. Ask me any clarifying questions before you build.
The work is the hero: the index is a list or grid where hovering a project previews it (image, motion or colour
taking over the page), and clicking expands it into the case study with a shared-element transition, without a
white flash. Each case study: problem, what I did, 3–5 images in a designed rhythm (not a stack of equal cards),
outcome in one sentence, next project. About: one paragraph and my photo treated in the site's art direction.
Contact: an email that copies on click. Pick an art direction from my discipline, not a generic dark portfolio.
```

Based on: [monokern's "$10,000-level" portfolio prompt (3.17M views, 12.2K bookmarks)](https://x.com/monokern/status/2071246711222055363)
Twists: a type designer · a 3D artist · a product designer · a photographer · an architect

### 3. Product page for a real product

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design and build the product page for {{PRODUCT + ONE-LINE PITCH}}. The first screen shows the actual product:
the photos, renders or video I give you, used exactly as they are, never redrawn. If it's software, show one real
interaction that genuinely works; a static fake dashboard made of styled divs is the commonest tell of an AI page.
The headline is real text. Then: the one problem it solves, told as a scroll sequence where the product changes
state as you read; three capabilities, each demonstrated, not described; proof using only facts I give you;
pricing or the next step; FAQ as an expanding list. The signature interaction should come from how the product
itself works.
```

Based on: [Nate Herk's Opus 5.5 vs Sonnet 5.5 product-page tests](https://x.com/nateherk/status/2104729265409229087) (Opus used the real product photo; the re-modelled can wasn't accurate) and [taste-skill v2's "no fake product UI" rule](https://github.com/Leonxlnx/taste-skill)

### 4. E-commerce product detail page

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design and build a product detail page for {{PRODUCT, PRICE, VARIANTS, MATERIALS, PHOTOS}}. Gallery: large imagery
with a zoom you can drag, and variant changes (colour, size) that update the image with a crisp transition and no
layout shift. Add to cart: the button morphs into a confirmation and the cart count increments with a small
physical bounce. Details as expanding sections (materials, sizing, shipping, care). One editorial moment below the
fold that tells the product's story in the brand's art direction. Sticky purchase bar on mobile. Real prices,
photos and copy only; never redraw the product.
```

Twists: …the product is a fragrance · …the product is a chair · …the product is a limited drop with a real countdown

### 5. Scrollytelling long-read

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Turn {{ARTICLE / STORY / REPORT + ITS DATA}} into an editorial scrollytelling page. First answer five questions:
what is the scroll journey; what should the reader meet first; what must they believe by the end; which real
assets exist; what should this page do that others don't. Then describe the feeling you're aiming for, not just
the components.
A pinned figure (chart, map, diagram or illustration) changes state as each paragraph scrolls past; text stays
readable at all times in a comfortable measure (60–75 characters). Chapters with a strong typographic opener each.
At least one moment where the reader controls the figure (scrub, toggle, hover a data point). Data is real and
labelled with its source. Works as a plain readable article with JavaScript off or reduced motion on.
```

Based on: [Nate Herk's Scrollcraft skill and its five interview questions](https://x.com/nateherk/status/2091265388067569835)

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
Build a microsite for {{EVENT / CAMPAIGN, DATE, PLACE, WHAT HAPPENS}}. Open with a 10–12 second title sequence,
thought of as opening titles, not a website: kinetic type on a strict grid that resolves into the lockup with the
date and place, then hands over to the page. Build it on one timeline and name its easing curves in a comment. One
big idea carries through every section (a poster system, a lineup that reacts to the pointer, a map). The date,
place and call to action are findable in two seconds on a phone. Include the share card (Open Graph image,
1200×630) designed in the same system, and an add-to-calendar button that works.
```

Based on: [the "Offset" title-sequence prompt from Muzli's Opus 5.5 tests](https://muz.li/blog/claude-opus-5-5-for-designers/)

### 8. Design system and style tile

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Before building any site for {{BRAND}}, create its design system as a living style tile page: a visual thesis in
one sentence; 3 candidate type pairings rendered as real headlines and paragraphs; a colour system with named
tokens, roles and AA contrast ratios; a type scale at 375 and 1440; spacing and grid shown visually; buttons, links,
inputs, toggles and cards in every state (default, hover, focus, pressed, disabled, error); motion tokens
demonstrated live (easing curves plotted, springs animating a square, a 10%-speed toggle); and one signature
interaction prototyped. Then tell me which pairing and palette you recommend and why.
```

### 9. From sites you admire to a DESIGN.md

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
These are screenshots or links of sites I like: {{3–5 REFERENCES, e.g. from Godly, Refero, One Page Love or
Awwwards}}. Don't write any code yet.
1. For each one, tell me what it does well: layout, typography, colour, spacing, white space, motion.
2. List what they have in common, ask me which parts I want, and wait for my answer.
3. Write a DESIGN.md with real values (font sizes, weights, colour codes, spacing, corner radius, easing) and a
decision log where every design choice gets recorded. My brand wins on colours and fonts; the references win on
layout and feel. Mark anything you can't tell from the screenshots as an estimate; don't make it up. Keep it to
one screen.
4. Then build {{THE PAGE}} from DESIGN.md and my real copy, screenshot it, review it against DESIGN.md, and fix
what fails.
```

Based on: [Voxyz's screenshots-to-DESIGN.md prompt](https://x.com/Voxyz_ai/status/2106474370860548341) and [Charlie Hills' DESIGN.md merge prompt](https://x.com/charliejhills/status/2067933151754924228)

### 10. Upgrade the site you already have

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Here is my current site: {{URL OR CODE}}. Keep every fact, page and piece of copy, and redesign how it looks and
feels. First, screenshot it at 390 and 1440 wide and list everything about it that a generic template or AI-built
site would also do (palette, type, layout, section order, cards, motion, copy patterns). Propose 3 distinct
directions (background hex, accent hex, typefaces, one-line rationale) and wait for me to pick one. Then rebuild
it in that direction, designing desktop and mobile separately rather than shrinking one into the other, and show
me before and after screenshots side by side.
```

Based on: [Hamel Husain's before/after upgrade with the frontend-design plugin](https://x.com/HamelHusain/status/1993909306824249580), [Anthropic's options-first prompt](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) and [Jeffrey Emanuel's desktop-and-mobile polish prompt](https://x.com/doodlestein/status/2007194101448573036)

## Prompts: App screens and dashboards

### 11. An app screen that looks real

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design a high-fidelity {{APP TYPE}} {{SCREEN, e.g. home screen}} for a phone, as an interactive web page in a phone
frame. Colour: {{BACKGROUND}} with {{ONE ACCENT}} as the only accent. Flat: no drop shadows, no outlines or visible
borders around cards, buttons or sections, no gradients, no glassmorphism, no neumorphism, no floating cards. Build
hierarchy with spacing, layout, colour and type alone. Use realistic, specific data ({{e.g. balances, names, dates
that look like a real person's}}), not round numbers or John Doe. Every control responds: tabs switch, lists
scroll, one gesture (pull to refresh, swipe a row) works. Make it look like a real app someone would use every
day.
```

Based on: [designwithkingsley's banking-screen prompt, run in Claude Design and Lovable](https://x.com/desgnwitkinsley/status/2045931569550880984)
Twists: a banking home screen · a fitness log · a recipe app · a train ticket wallet · a smart-home control

### 12. A dashboard people want to open

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design a dashboard for {{WHAT IT MONITORS, FOR WHOM}}. Before building, decide the one question the person opens it
to answer and make that the first thing they see, large. Then the 3–5 things that explain it, as a composed layout
rather than a grid of identical cards with shadows. Charts drawn in SVG from realistic data, every value
readable on hover or tap, units and time ranges always visible. Filters and date ranges that actually filter.
Loading, empty and error states designed. Include as many relevant features and interactions as the job needs,
then remove anything that doesn't serve that one question.
```

Based on: [Anthropic's frontend-aesthetics cookbook test prompts](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics) and [OpenAI's GPT-5.4 frontend rules](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4) ("App UI made of stacked cards instead of layout")
Twists: renewable-energy monitoring · a newsroom's live traffic · a restaurant's evening service · a personal finance month

## Prompts: First screens

### 13. Living-material hero

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the first screen for {{BRAND}} where the background is a material, not a decoration: {{WATER / INK / SILK /
SAND / SMOKE / MOLTEN GLASS}}, whichever belongs to what the brand does (say why in one line), rendered in a WebGL
fragment shader. The pointer disturbs it with momentum: direction and speed shape the disturbance, which decays
over 1–2 seconds. The headline and one call to action are real HTML text on top, readable at every moment and
visible before the shader starts.
Interrupt: fast movements stack and decay naturally, never snap. Touch: the disturbance follows the finger, and a
slow idle drift plays when nobody touches it. Reduced motion: one still frame chosen to look like a poster.
Budget: render only while the hero is on screen, cap device pixel ratio at 1.5, and halve the resolution if frames
take longer than 20ms.
```

Based on: [Dash Creative's cursor ripple (Codrops, July 2026)](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/) and [Muzli's Opus 5.5 sea-salt demo](https://muz.li/blog/claude-opus-5-5-for-designers/)
Twists: …the material drains away on scroll to reveal the next section · …the material forms the logo and dissolves when touched · …two materials meet where the pointer is

### 14. A headline that performs

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a type-only first screen for {{BRAND}}: no image, no video, the headline "{{HEADLINE}}" is the whole show.
Use a variable font with at least two axes (weight, width, slant or optical size) and map them to something
meaningful: pointer distance from each letter, scroll velocity, or time of day. Letters respond individually but
the word always stays readable. Pick a typeface with a real reason; no Inter, Roboto or Geist.
Keep the headline as one accessible text node (split visual letters are aria-hidden). Interrupt: every response
eases back within 600ms when the pointer leaves. Touch: letters respond to the finger while dragging, then settle.
Reduced motion: the headline sits at its most beautiful axis setting. Budget: no layout shift while axes change;
animate font-variation-settings on a contained element only.
```

Based on: [the variable-type explorer in Dropbox's brand guidelines (Awwwards case study)](https://www.awwwards.com/case-study-dropbox-brand-guidelines.html)
Twists: …the letters weigh more the longer you stay · …each letter is a different axis · …the headline rewrites itself when you scroll back up

### 15. The object you can grab

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a first screen around exactly one object you can pick up: {{THE PRODUCT / THE LOGO AS A SOLID / A SYMBOL OF
WHAT THE BRAND DOES}}, in 3D. Near the pointer it leans toward it like a magnet (max 8° of rotation). Drag it to
spin it with inertia; release it and it settles back to its hero pose with a spring that overshoots once. Light it
from the pointer so the material reads (metal, glass, rubber, paper). Headline and call to action in real text.
Interrupt: grabbing mid-settle catches it exactly where it is. Touch: one-finger drag rotates, the page still
scrolls vertically. Reduced motion: a still render at the best angle. Budget: under 50k triangles, textures
compressed, the object loads after the text has painted, and a static image stands in until it's ready.
```

Based on: [Dash Creative's magnet-drag 3D logo (Codrops)](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/) and [Lando Norris's rotatable helmet (WebGPU.com)](https://www.webgpu.com/showcase/mclaren-f1-driver-lando-norris-official-website/)
Twists: …it shatters into its parts if you shake it · …two objects that attract each other · …made only with CSS 3D transforms

### 16. Scroll from frame one

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a first screen for {{BRAND}} that starts changing on the very first pixel of scroll. Over the first 100vh,
{{THE PORTRAIT / THE PRODUCT / THE PLACE}} transforms in three beats: shapes wipe across it, it {{PIXELATES /
DISSOLVES INTO HALFTONE / SPLITS INTO STRIPS}}, and a {{SIGNATURE / LINE / MARK}} draws itself over a headline that
scrolls at a different speed. Everything is scrubbed by scroll position, not triggered, so scrolling back reverses
it exactly.
Interrupt: scrubbing means any speed and direction work. Touch: native scroll, no hijacking, no smooth-scroll lag.
Reduced motion: the three beats become three still frames that crossfade. Budget: one canvas or SVG layer, no
reflow in the scroll handler, 60fps on a mid-range phone.
```

Based on: [Lando Norris's scroll-driven hero, Awwwards Site of the Year 2025 (Colorlib)](https://colorlib.com/wp/animation-websites/)
Twists: …the beats are driven by time instead, and scroll only speeds them up · …the transformation tells the brand's origin story in three frames

### 17. The poster hero

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the first screen for {{BRAND}} as if it will be printed as a poster: a strict grid, one dominant
typographic or image element, a clear hierarchy, nothing decorative. Every still frame should be worth framing.
Motion is restrained: one entrance under 900ms (the headline first, the image 120ms later), then stillness. The
only further motion comes from the visitor: hover, scroll or focus each produce one precise, small response.
Pick the art direction from a print tradition outside web design and name it.
Touch: the layout is recomposed for the portrait screen, not shrunk. Reduced motion: no entrance at all; it is
already finished. Budget: Largest Contentful Paint is the headline text, under 1.5s.
```

Based on: [hontran.dev on why Unseen Studio and Obys win: "restraint reads as premium" and "static frames already look like posters"](https://www.hontran.dev/blog/best-award-winning-websites-2026)
Twists: …a Swiss poster · …a Polish film poster · …a protest placard · …a pharmaceutical label

## Prompts: Navigation and menus

### 18. The physical-object menu

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the site menu for {{BRAND}} as a physical object that belongs to the brand: {{A CASSETTE / A DRAWER / A
FOLDER TAB / A MATCHBOX / A TICKET STUB / A RECORD SLEEVE}}. Opening it slides the object out with weight and it
snaps into place with a spring; closing pushes it back. On Android, give a 10ms haptic pulse on the snap (iPhones
have no vibration API); an optional click sound stays muted by default. Each link is printed on the object in the brand's type.
Opening and closing have different feels (heavy out, quick back). Build it on a native <dialog> or popover: a
real button with aria-expanded, focus moves in and stays there, Escape closes it and focus returns to the button. Interrupt: tapping again mid-open reverses from where it is. Reduced motion: it appears in
place without sliding. Budget: transforms only, under 15KB of code.
```

Based on: [Yestalgia's Walkman cassette menu (Codrops, September 2026)](https://tympanus.net/codrops/2026/09/12/yestalgia-bringing-decathlons-90s-spirit-to-life-through-a-playful-digital-experience/)

### 19. Squash-and-stretch tabs

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a tab bar for {{TABS AND THEIR CONTENT}} where the active indicator travels like something alive: it
stretches toward the new tab (leading edge first, trailing edge 60ms behind), then squashes slightly and settles
with a spring. The content swaps with a short directional move that matches the direction of travel.
Interrupt: clicking another tab mid-travel retargets from the current shape, never jumps. Keyboard: roving
tabindex, arrow keys move, Home and End jump, the ARIA tabs pattern. Touch: swipe the content to change tabs.
Reduced motion: the indicator moves without stretch and content swaps instantly.
```

Based on: [the squash-and-stretch tabs in Dropbox's brand guidelines (Awwwards case study)](https://www.awwwards.com/case-study-dropbox-brand-guidelines.html)

### 20. The menu is a transition

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a full-screen menu for {{BRAND, ITS 4–7 PAGES}} where opening it is itself a transition: the current page
recedes ({{SCALES INTO A CARD / TILTS BACK IN 3D / SLIDES UNDER A CURTAIN}}) and the links reveal line by line
through masks, 50ms apart. Hovering or focusing a link previews where it goes: its image, colour or a live count
of what's inside, taking over the background. Closing reverses everything and returns focus to the menu button.
Interrupt: every stage can be reversed mid-way. Touch: the preview shows on press, the link opens on release.
Reduced motion: a simple crossfade. Budget: the page underneath is not re-rendered, only transformed.
```

Based on: the menu transitions on [Immersive Garden](https://www.awwwards.com/sites/immersive-garden-website) and [Floema](https://www.awwwards.com/sites/floema) (Awwwards)

### 21. Command bar navigation

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Add keyboard-first navigation to {{SITE}}: pressing "/" or Cmd/Ctrl+K opens a command bar that searches pages,
projects, sections and actions (copy email, switch theme, play reel). Fuzzy matching, results grouped and
previewed as you move through them with arrow keys, Enter to go, Escape to close. Show the shortcut hint once,
quietly, in the corner. Design it in the site's art direction, not a generic modal.
Touch: a search button opens it as a bottom sheet with a large input. Accessibility: the combobox and listbox
pattern, results announced. Reduced motion: no scale or blur on open. Budget: the index is built at load from the
page itself, no server.
```

Based on: [Floema's menu and search interaction (Awwwards)](https://www.awwwards.com/sites/floema)

### 22. A header that earns its space

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the site header for {{BRAND}}: full size at the top, it compresses to a compact bar after 80px of scroll,
hides when scrolling down, and comes back on any upward scroll of 8px or more. It switches between light and dark
treatments based on the section underneath, without flicker. On long pages, a hairline reading-progress bar sits
on its bottom edge.
Interrupt: rapid direction changes never make it jitter (hysteresis of 8px). Touch: it never covers a focused
input. Reduced motion: it stays visible and only compresses. Budget: one IntersectionObserver per section, no
scroll-handler layout reads.
```

## Prompts: Cursor and presence

### 23. The cursor as a lens

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a section for {{BRAND}} where the pointer carries a lens that reveals a hidden layer of the same scene: {{THE
X-RAY OF THE PRODUCT / THE SKETCH UNDER THE PAINTING / THE "BEFORE" PHOTO / THE CODE BEHIND THE UI / THE MAP UNDER
THE CITY}}, through a soft-edged mask 100–150px across with feathered edges. The lens follows with a slight lag
(spring, not linear, but never so slow it feels late), grows when it passes something meaningful, and the system
cursor stays visible. Choose the lens shape from the brand.
Interrupt: fast movements never tear the mask. Touch: press and hold to show the lens offset above the finger so
it isn't hidden, or drag a lens handle. Reduced motion and keyboard: a toggle that shows the hidden layer side by
side. Budget: a CSS mask or one shader, no per-frame DOM layout.
```

Based on: [monokern's flashlight hero prompt (3.17M views)](https://x.com/monokern/status/2071246711222055363), whose first build lagged behind the cursor
Twists: …the lens is a magnifying glass with real refraction · …two hidden layers, toggled by clicking · …the lens leaves a slowly fading trail

### 24. Live presence: other visitors' cursors

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Add live presence to {{SITE}}: other people on the page appear as small, labelled cursors in the site's style.
Press "/" to type a short message (60 characters max) that floats at your cursor and fades after 8 seconds. Idle
cursors fade after 30 seconds; at most 20 are shown; a visible toggle hides everyone else. Never fake visitors.
In this single-file version, sync between open tabs with BroadcastChannel and say so in a comment; write the
transport behind one small interface so it can swap to {{PARTYKIT / LIVEBLOCKS / SUPABASE REALTIME / A WEBSOCKET
SERVER}}. Sanitise and rate-limit messages. Touch: show other cursors, hide your own. Reduced motion: cursors jump
instead of gliding. Budget: send positions at most 20 times a second, interpolate the rest.
```

Based on: [bleibtgleich'26, whose live cursors and chat were written by Claude (Codrops, September 2026)](https://tympanus.net/codrops/2026/09/23/bleibtgleich26-a-180-turn-from-brutalism-to-minimalism/)

### 25. Magnetic controls, done right

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Make the main buttons and links of {{SECTION}} magnetic: within 80px the element drifts toward the pointer by up
to 8px, its label moves 1.5× as far as its background (a small depth effect), and it springs home when the pointer
leaves. Keep the system cursor; don't replace it. Hover, focus-visible and pressed states are as designed as the
magnet effect.
Interrupt: leaving and re-entering mid-spring continues from the current position. Touch: no magnet at all; a
crisp pressed state instead. Reduced motion: no drift. Budget: one shared pointermove listener, transforms only,
and nothing runs when the pointer is far away.
```

## Prompts: Scroll storytelling

### 26. Pinned chapters with one changing figure

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Tell {{STORY OR EXPLANATION, IN 4–7 STEPS}} as a scrollytelling section: one figure ({{CHART / DIAGRAM / MAP /
PRODUCT / ILLUSTRATION}}) stays pinned while short text steps scroll past it. Each step changes the figure's state
with a 400–600ms transition, triggered when the step crosses the middle of the screen, and scrolling back reverses
it. Text stays readable at all times (60–75 characters per line). At one step the reader can take control of the
figure (scrub, toggle or hover).
Touch: the figure sits in the top half and the text cards slide over the bottom half. Reduced motion: states
change without transition. No JavaScript: each step shows its figure state as a still image. Budget: the figure
updates in one requestAnimationFrame per step.
```

Based on: [Tracing Art's scroll-driven data visualisation (Awwwards)](https://www.awwwards.com/sites/tracing-art)

### 27. Hold-to-advance gates

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Between the chapters of {{STORY}}, add one gate the visitor has to press and hold to break through: holding for
1.2 seconds fills a progress shape drawn in the brand's style, with a rising tension (a tremor, a sound muted by
default, a 10ms haptic on phones), and on completion the gate breaks open into the next chapter with a payoff
transition. Release early and it springs back. Use at most two gates on the page.
Keyboard: hold Space or Enter. Accessibility: a visible "skip" link and an aria-live label that announces the
progress. Reduced motion: holding still works, the break is a crossfade. Budget: one canvas or SVG for the gate.
```

Based on: [ZERO's hold-to-advance chapter gates (Codrops, July 2026)](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/)

### 28. Scroll-scrubbed sequence

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Show {{PRODUCT / OBJECT / SCENE}} as a scroll-scrubbed sequence: {{60–120 FRAMES OR A VIDEO}} drawn to a canvas,
with the frame chosen by scroll position and smoothed
(current += (target − current) × 0.12 each frame) so it never stutters; the video never autoplays. Three to five text callouts enter at specific frames and point to what
they describe. If I don't give you frames, generate the sequence in code (SVG or canvas drawing) so it stays
self-contained.
Loading: the first frame first, then every 8th frame, then fill the gaps, so scrubbing works immediately at lower
precision. Touch: a lighter frame set at half resolution, native scroll. Reduced motion: five key frames as a
stepped sequence. Budget: decode frames off the main thread with createImageBitmap, keep at most 120 in memory.
```

Based on: [Floema's scroll video zoom (Awwwards)](https://www.awwwards.com/sites/floema) and the smoothing in [Tanzil Chowdhury's scroll-scrubbed hero prompt](https://x.com/iamtanzil_/status/2086297598726680963)
Twists: …the sequence is a slow orbit around the product · …the sequence assembles the product from parts · …scrolling fast blurs the frames

### 29. The horizontal room

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build one horizontal section inside a vertical page for {{GALLERY / TIMELINE / ROOMS / PROCESS}}: the section pins
and vertical scroll moves it sideways, like walking along a wall. Use it once, for content that is truly a
sequence, and give the reader a position indicator and a reason to stop at each item (a caption, a detail that
reveals as it reaches centre).
Keyboard and trackpads: horizontal scroll and arrow keys work too. Touch: no pinning; a native horizontal swipe
with scroll-snap instead. Reduced motion: a regular vertical list. Budget: transforms only, images lazy-loaded
one screen ahead.
```

Based on: [ERA Residence's horizontal gallery, still winning in August 2026 (Awwwards)](https://www.awwwards.com/sites/era-residence)

### 30. Stacking chapters

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Lay out {{3–6 CHAPTERS, SERVICES OR CASE STUDIES}} so they stack as you scroll: each new chapter slides up over
the previous one, which stays still, scales down by 4% and dims. Use a physical metaphor from the brand instead of
generic cards: {{SHEETS OF PAPER / INDEX CARDS / FILM FRAMES / PRINTED PROOFS / CLOTH SWATCHES}}, each a different
colour or texture. Each chapter's content is readable while it's on top.
Touch: the same stacking with native scroll, smaller scale change. Reduced motion: chapters scroll normally with
no scale or dim. Budget: position: sticky and transforms only, no scroll handler.
```

Based on: [MindMarket's scroll-stacking cards (Awwwards)](https://www.awwwards.com/sites/mindmarket) and the sticky stacking in [Leon Lin's Nura Health prompt](https://x.com/LexnLin/status/2024590793034649737)

## Prompts: Type in motion

### 31. Kinetic headline, still readable

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Animate the section headlines of {{SITE}} so each one resolves into readable text as it enters: from {{BLURRED
BLOBS / SCATTERED LETTERS / REDACTED BARS / SCRAMBLED GLYPHS / INK BLEEDING INTO PAPER}}, chosen to fit the brand.
Each headline takes under 900ms, lines are staggered 60–80ms, and the words are readable by 60% of the way
through. Different headlines may use different variants, but none of them fade up.
Keep the real text accessible (split pieces aria-hidden, the full line as text). Interrupt: scrolling past fast
completes the animation instantly. Touch: the same, with less blur. Reduced motion: the text is simply there.
Budget: animate transforms, opacity and filter on at most 40 elements at a time.
```

Based on: [bleibtgleich'26's text that resolves from blurred blobs (Codrops)](https://tympanus.net/codrops/2026/09/23/bleibtgleich26-a-180-turn-from-brutalism-to-minimalism/)

### 32. Variable type you can play with

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a type explorer for {{TYPEFACE OR BRAND}}: the visitor types their own words and plays with the variable
axes through a control that is itself a designed object ({{A DIAL / A 2D PAD / A SET OF SLIDERS LIKE A MIXING
DESK}}). Show a glyph grid, a waterfall of sizes and one real paragraph. One mode maps the axes to the pointer
position for free play.
Keyboard: every control is a labelled range input underneath. Touch: the 2D pad works with one finger.
Reduced motion: values change without easing. Budget: no layout shift while axes change.
```

Based on: [the variable-type explorer in Dropbox's brand guidelines (Awwwards case study)](https://www.awwwards.com/case-study-dropbox-brand-guidelines.html)

### 33. Lettering that assembles on scroll

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Make the {{BRAND NAME OR KEY WORD}} assemble itself as the reader scrolls: the letters start {{STRETCHED TALL / IN
PIECES / SPREAD ACROSS THE SCREEN / AS OTHER LETTERS}}, then stretch, snap and recombine into the word, landing
with a small overshoot at exactly the moment the section is centred. Scrubbed by scroll, so it reverses cleanly.
Build it as SVG paths or per-letter transforms.
Touch: fewer pieces, the same idea. Reduced motion: the word is already assembled. Accessibility: the word is real
text for screen readers. Budget: transforms only, one SVG.
```

Based on: [Mat Voyce's letters that stretch, snap and recombine on scroll (hontran.dev)](https://www.hontran.dev/blog/best-award-winning-websites-2026)

### 34. Extruded 3D type without WebGL

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Make the display titles of {{SITE}} look extruded and solid, like {{CHROME / CANDY / STONE / PRINTED FOAM}}, built
from stacked per-letter duplicates (8–16 layers offset in depth) with no WebGL. The titles tilt toward the pointer
by up to 12° and the extrusion follows; on scroll, they rotate a little around one axis.
Touch: split by word instead of letter and fewer layers, tilting with the device or not at all. Reduced motion:
static extrusion at a flattering angle. Accessibility: one real text layer, the duplicates aria-hidden. Budget:
under 300 duplicate elements on screen.
```

Based on: [Yestalgia's fake-3D extruded titles (Codrops)](https://tympanus.net/codrops/2026/09/12/yestalgia-bringing-decathlons-90s-spirit-to-life-through-a-playful-digital-experience/)

## Prompts: Images and media

### 35. Images as material

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Render the images of {{SECTION OR SITE}} as WebGL planes that sit exactly where the real <img> elements are (the
DOM stays the source of truth for layout, alt text and accessibility). As each one enters the screen it reveals
through {{A LUMINANCE-TO-INK SKETCH / A WAVY MORPH / HALFTONE DOTS / PIXEL SORTING / A PRINTING PRESS PASS}}; on
hover it responds with a subtle displacement that follows the pointer.
Interrupt: leaving mid-reveal pauses, coming back resumes. Touch: the reveal runs; no hover effect. Reduced motion
and no WebGL: the plain images, already visible. Budget: one shared canvas for all planes, textures uploaded only
when near the screen.
```

Based on: Kononenko's [ink-sketch image reveals](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/) and bleibtgleich'26's [wavy morph reveals](https://tympanus.net/codrops/2026/09/23/bleibtgleich26-a-180-turn-from-brutalism-to-minimalism/) (Codrops)

### 36. The viewer that opens from where you clicked

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a full-screen image viewer for {{GALLERY}}: clicking a thumbnail grows it from its exact position into the
viewer (no fade from nowhere); arrows, swipe and keyboard move between images; pinch or double-tap zooms; drag
down to dismiss, with the speed of the throw deciding whether it closes; closing flies the image back to its
thumbnail.
Accessibility: a modal dialog with focus trapped and restored, Escape closes, alt text and a caption with the
count. Interrupt: dragging mid-animation catches the image. Reduced motion: crossfades. Budget: load the full-size
image only when the viewer opens.
```

Based on: [Kononenko's full-screen viewer that expands from the click point (Codrops)](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/)

### 37. A video player that belongs to the brand

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design a custom video player for {{FILM / REEL / PRODUCT VIDEO}} in the site's art direction: a designed poster
frame, a play control that is a moment in itself, a scrubber that previews frames on hover, captions, mute and
full screen. Nothing autoplays with sound. Hide the controls after 2 seconds of stillness while playing.
Keyboard: Space plays and pauses, arrows seek 5 seconds, M mutes, F goes full screen, with visible focus.
Touch: big tap targets, double-tap to seek. Reduced motion: no animated poster. Budget: preload="metadata" until
the visitor asks to play.
```

Based on: [House of Yellow's custom players and four-marquee play button (Codrops, September 2026)](https://tympanus.net/codrops/2026/09/16/house-of-yellow/)

### 38. A flat photo with depth

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Turn {{ONE PHOTO}} into a shallow 3D relief: use a depth map (supplied, or painted by hand in a few gradient
layers) to displace the image in a shader so it parallaxes with the pointer by at most 12px, like a bas-relief
catching light from the cursor. Keep the edges clean: no stretched smears at depth boundaries.
Touch: the device tilt (with permission) or a slow automatic drift. Reduced motion: the flat photo. Budget: one
plane, the depth map at half resolution.
```

Based on: [Immersive Garden's bas-relief interaction (Awwwards)](https://www.awwwards.com/sites/immersive-garden-website)

## Prompts: Galleries and work indexes

### 39. A gallery with three ways to look

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a work index for {{PROJECTS WITH TITLE, YEAR, TYPE, 2–6 IMAGES EACH}} with three modes: a designed grid, a
dense list with metadata, and an infinite canvas you can drag in any direction. Switching modes moves every image
to its new place (FLIP), with no cut. Hovering a project lights up all of its images and reduces the rest to
outlines.
Interrupt: switching mode mid-transition retargets from where everything is. Touch: drag with momentum on the
canvas; tap highlights, a second tap opens. Reduced motion: modes switch instantly. Budget: virtualise the
canvas, lazy-load images, under 100 elements animating at once.
```

Based on: [Kononenko's grid, list and infinite-drag gallery](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/) and [House of Yellow's grid/list toggle](https://tympanus.net/codrops/2026/09/16/house-of-yellow/) (Codrops)

### 40. The project list with a preview

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a typographic list of {{PROJECTS}}: large names, small metadata. Hovering a row brings up its preview image
or video, which follows the pointer with a lag and leans with the pointer's speed (at most 6°). Moving between rows
swaps the preview with a short mask wipe in the direction of travel, never a flicker. The rest of the list dims.
Keyboard: focusing a row shows its preview pinned beside it. Touch: tapping a row expands it in place to show the
preview and a link. Reduced motion: the preview appears fixed beside the list. Budget: preload the next row's
image on hover.
```

### 41. A slider seen through a mask

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a slider for {{SLIDES}} where the active slide is seen through a focal mask shaped by the brand ({{A CAMERA
APERTURE / A KEYHOLE / A PORTHOLE / THE LOGO'S COUNTER}}). Changing slides closes the mask on the old image and
opens it on the new one; a film strip of thumbnails runs along one edge. Dragging the strip moves with momentum and
snaps to the nearest slide.
Interrupt: dragging during a transition takes over immediately. Keyboard: arrows, with the slide announced to
screen readers. Touch: swipe anywhere. Reduced motion: crossfade. Budget: CSS clip-path or one shader.
```

Based on: [Telescope's focal-mask slider (Codrops)](https://tympanus.net/codrops/2026/05/27/whooshes-snaps-and-shaders-adrien-vanderpotte-and-the-feeling-of-the-interface/) and [Siena Film Foundation's film-strip slider (Awwwards)](https://www.awwwards.com/sites/siena-film-foundation)

### 42. A gallery visitors can rearrange

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a gallery of {{IMAGES OR OBJECTS}} that visitors can rearrange: drag any item and the others make room with
springs; a "shuffle" control rearranges everything procedurally into a new composition; the visitor's arrangement
is remembered on their device. Every arrangement should still look composed: snap to a grid with deliberate
gaps, never a jumble.
Keyboard: Space picks an item up, arrows move it, Space drops it, with announcements. Touch: long-press to pick up.
Reduced motion: items move without springs. Budget: FLIP transforms, no layout thrash during drag.
```

Based on: [Siena Film Foundation's procedural slider re-arrangement (Awwwards)](https://www.awwwards.com/sites/siena-film-foundation)

## Prompts: Page transitions

### 43. Colour flood transition

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build page transitions for {{SITE, ITS PAGES OR PRODUCTS, EACH WITH ITS OWN COLOUR}}: clicking a link floods that
item's colour outward from the exact click point to fill the screen (550–700ms, ease-in-out), the page swaps under
the cover, and the new page's headline enters first, its image 120ms later, as the colour drains away.
Use a single-page router with history support so back and forward replay the transition in reverse. Interrupt:
clicking during a transition queues nothing and goes straight to the latest target. Reduced motion: a 150ms
crossfade. Budget: no white flash, and the next page is prefetched on hover.
```

Based on: [TrueKind's product-colour flood transitions (Codrops, June 2025)](https://tympanus.net/codrops/2025/06/25/designing-truekind-a-skincare-brands-journey-through-moodboards-motion-and-meaning/)

### 44. The image that becomes the page

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a shared-element transition from {{CARDS / LIST ITEMS / THUMBNAILS}} to their detail pages: the clicked
image grows into the detail page's hero while the rest of the page changes around it, and the title travels with
it. Back reverses it exactly into the right card, even if the list was scrolled. Use the View Transitions API with
a FLIP fallback.
Interrupt: going back mid-transition reverses from the current state. Reduced motion: crossfade only.
Accessibility: focus moves to the new page's h1 and the title is announced. Budget: no layout shift on arrival.
```

### 45. A transition system, not a transition

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the transition system for {{SITE AND ITS PAGE TYPES}}: a 250ms crossfade between simple pages, a
directional wipe into hero pages, a shared-element move from any card to its detail page, and a distinct exit for
leaving the site. Write it as one table (from → to → transition → duration → easing), then implement it with one
router. Every transition can be interrupted, and back and forward reverse what played.
Reduced motion: every transition becomes a 120ms crossfade. Budget: no transition over 800ms; the visitor never
waits on an animation to click again.
```

Based on: [Kononenko's crossfades for simple pages and wipes for heroes (Codrops)](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/)

## Prompts: Products and 3D

### 46. Product viewer with hotspots

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a product viewer for {{PRODUCT, ITS 3–6 KEY FEATURES}}. Before coding, propose the numbers: camera field of
view, orbit limits, each hotspot's camera position, easing and duration for every move. Then build it: a 3D model ({{GLB FILE I GIVE YOU / A MODEL YOU
BUILD FROM PRIMITIVES}}) that turns with drag, with numbered hotspots fixed to the surface. Choosing a hotspot
flies the camera to that feature and opens a short annotation; the features are also listed beside the viewer so
nothing depends on finding a hotspot. Offer AR on phones that support it.
Keyboard: hotspots are buttons in tab order. Touch: one-finger rotate, two-finger zoom, the page still scrolls.
Reduced motion: camera cuts instead of flying. Budget: a poster image until the model has loaded, the model under
3MB with compressed textures.
```

Based on: [Shin's luxury-watch prompt, which asks for the numbers first](https://x.com/Shin_Engineer/status/1991740779652657455), and [Lando Norris's helmet hall of fame (WebGPU.com)](https://www.webgpu.com/showcase/mclaren-f1-driver-lando-norris-official-website/)

### 47. A material sample under the cursor

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Show the material of {{PRODUCT}} as a sample you can almost touch: {{FABRIC / BRUSHED METAL / LEATHER / PAPER /
CERAMIC / A HEX SHIELD}} rendered with a normal map, lit by the pointer as if it were a small lamp, so the weave,
grain or relief catches the light as you move. A short caption names the material and one fact about it.
Touch: the light follows the finger, then drifts back to a flattering angle. Reduced motion: a still,
well-lit render. Budget: one shader, textures under 500KB.
```

Based on: [Floema's material sample that responds to the mouse (Awwwards)](https://www.awwwards.com/sites/floema) and [Cerebrium's cursor-lit shield (Codrops)](https://tympanus.net/codrops/2026/07/23/building-cerebrium-making-serverless-infrastructure-tangible/)

### 48. Exploded view on scroll

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Show how {{PRODUCT}} is made with an exploded view: as the reader scrolls, the product separates into its
{{4–8 PARTS}} along clean axes, each part's label attaches with a leader line, and at the end it reassembles with
a satisfying final click into place. Scrubbed by scroll. Use CSS 3D or SVG unless the parts need real 3D.
Touch: the same, with labels in a list below. Reduced motion: one labelled exploded diagram. Accessibility: the
parts list is real text. Budget: transforms only.
```

Based on: [m0h's exploded-keyboard product page prompt](https://x.com/exploraX_/status/2051240544043504028) and [GQ × Audemars Piguet's gesture-driven watch engineering (Awwwards)](https://www.awwwards.com/sites/gq-ap-the-extraordinary-lab)

## Prompts: Pricing, forms and calls to action

### 49. Pricing that explains itself

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the pricing section for {{PLANS, PRICES, LIMITS, WHAT'S INCLUDED}}: one input that matters drives everything
({{SEATS / USAGE / VOLUME / PROJECT SIZE}}, as a slider or stepper), and every plan recalculates live. Only the
digits that change roll to their new value, digit by digit. Both monthly and yearly prices are in the HTML. The plan that fits the input is highlighted with a one-line reason. A monthly/yearly
switch shows the exact saving. Below, a comparison that fits a phone without horizontal scroll.
Real prices only; never invent a discount or "most popular" badge. Keyboard: the input is a labelled range, and the
results announce politely. Reduced motion: numbers change without rolling. Budget: no layout shift as numbers
change width (tabular figures).
```

### 50. The form people finish

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the {{CONTACT / ONBOARDING / QUOTE / APPLICATION}} form for {{BRAND}} so people finish it: ask only what's
needed ({{FIELDS}}), one question per screen on phones and grouped on desktop, labels always visible, validation
after a field loses focus (:user-invalid, not on first keystroke), inputs that grow with their content, errors that say how to fix it, progress that shows what's left, and answers saved as
they type. The success state is a designed moment that says what happens next and when.
Accessibility: real labels, errors tied to fields and announced, focus moves to the first error. Touch: the right
keyboard for each field, tap targets of at least 44px. Reduced motion: steps swap without sliding.
```

### 51. A physical call to action

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Make the main call to action of {{SITE}} ({{GET IN TOUCH / BOOK / BUY / JOIN}}) a physical object you
operate: {{A PHONE DIAL YOU TURN / A TICKET YOU TEAR / A LEVER YOU PULL / A STAMP YOU PRESS / A SWITCH YOU FLIP}}, chosen
for the brand. It resists a little, has a satisfying moment of completion, and snaps back if you let go early;
completion triggers the real action. Next to it, a plain link does the same thing for anyone in a hurry.
Keyboard: Enter completes the gesture with the same animation. Touch: designed for a thumb. Reduced motion: the
completion is shown without the gesture. Budget: under 20KB, no library.
```

Based on: [bleibtgleich'26's contact dial](https://tympanus.net/codrops/2026/09/23/bleibtgleich26-a-180-turn-from-brutalism-to-minimalism/) and [Aurel's ticket-tear call to action](https://tympanus.net/codrops/2025/05/20/behind-the-curtain-building-aurels-grand-theater-from-design-to-code/) (Codrops)

### 52. A sign-up with a payoff

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the {{WAITLIST / NEWSLETTER / EARLY ACCESS}} sign-up for {{BRAND}}: one field and one button, with copy that
says exactly what people get and how often. On submit the button becomes a designed confirmation that the visitor
keeps ({{A TICKET / A PASS / A POSTCARD / A RECEIPT}}) with their email and today's date on it, plus "add to
calendar" or "share" if there's an event. No fake queue positions or subscriber counts.
States: empty, typing, invalid, sending, success, already signed up, network error. Accessibility: errors
announced, focus moves to the confirmation. Reduced motion: the confirmation appears without the transformation.
```

## Prompts: Proof and data

### 53. Proof without fakes

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build the proof section for {{BRAND}} using only what I give you: {{QUOTES WITH NAME, ROLE, PHOTO / CASE RESULTS /
CLIENT LOGOS / AWARDS / PRESS}}. Lead with outcomes, not adjectives: three short case results, each with the
problem, what changed, and the number. Quotes are set as editorial pull quotes with the person's real name.
Hovering a quote highlights the part of the product or work it's about.
If anything is missing, show a clearly marked TODO in the layout instead of inventing it. No logo walls of
companies that aren't clients. Touch: quotes are a swipeable row with visible position. Reduced motion: no
auto-advance.
```

### 54. A chart that draws itself

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Visualise {{DATASET, ITS SOURCE AND THE ONE POINT IT MAKES}} as a chart in the site's art direction: the headline
states the point, the chart proves it. When it enters the screen, the lines draw or bars grow in under 800ms,
with the key data point arriving last and annotated. Hover or tap any point to read its exact value. The source is
labelled under the chart.
Accessibility: an accessible data table behind a "view data" toggle, colours distinguishable without colour
vision. Reduced motion: drawn already. Budget: SVG, no charting library for under 500 points.
```

Based on: [Tracing Art's scroll-driven data visualisation (Awwwards)](https://www.awwwards.com/sites/tracing-art)
Twists: …the reader drags a slider to see the future scenario · …the chart is drawn as a physical object (thread, stacked paper, bricks)

### 55. Numbers that mean something

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Present {{3–5 REAL KEY NUMBERS AND WHAT THEY MEAN}} without the 0→100 counter cliché. The number is visible
immediately; motion is used to explain its size: a comparison the reader already knows ({{FOOTBALL PITCHES /
STACKED PAGES / A YEAR AS A ROW OF DAYS}}), drawn to scale, building as they scroll. Each number gets one sentence
of context and its source.
Accessibility: numbers are real text, the visuals are labelled. Touch: the same visuals, stacked. Reduced motion:
the comparisons are already drawn. Real numbers only; leave a TODO where one is missing.
```

## Prompts: Loaders, footers and 404s

### 56. A loader worth waiting for, or none

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Decide first whether {{SITE}} needs a loader at all: only if it has heavy assets that must be ready before the
first screen works. If it does, design one that shows real progress (no fake 0→100 counter), finishes within 2.5
seconds on a fast connection (1.5 seconds when cached), and turns into the first screen without a cut, so the loader's last frame is the
hero's first frame. It never plays again in the same session.
If it doesn't, show the content immediately and load heavy pieces behind it, and tell me why. Reduced motion: a
simple progress line. Budget: the loader's own code under 5KB, inline.
```

Based on: [Kononenko's deliberately simple loader (Codrops)](https://tympanus.net/codrops/2026/09/18/kononenko-architectural-bureau/) and the [counter preloaders that still appear in 2026 (Colorlib)](https://colorlib.com/wp/animation-websites/)

### 57. The footer as a destination

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Make the footer of {{SITE}} the last memorable moment: {{PARTICLES THAT FORM THE BRAND MARK AND SCATTER FROM THE
POINTER / A CURTAIN REVEAL FROM UNDER THE PAGE / A LOOKBOOK THAT EXPANDS IN PLACE / A HUGE WORDMARK THAT REACTS TO SCROLL SPEED / A LIVE CLOCK OF THE
STUDIO'S CITY}}. The useful parts stay plain and clear: contact, sitemap, social, legal, a back-to-top link.
Expanding anything never makes the page jump.
Touch: the moment responds to touch or plays once on arrival. Reduced motion: a still version. Budget: the
footer's canvas only runs while it's on screen.
```

Based on: [Oryzo's interactive footer particles (Awwwards)](https://www.awwwards.com/sites/oryzo-ai) and [Yestalgia's footer lookbook (Codrops)](https://tympanus.net/codrops/2026/09/12/yestalgia-bringing-decathlons-90s-spirit-to-life-through-a-playful-digital-experience/)

### 58. A 404 people share

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the 404 page for {{BRAND}} as a small, delightful interaction that only this brand would make ({{A TINY GAME
/ AN OBJECT YOU CAN BREAK / A MAP OF WHERE YOU GOT LOST / A JOKE IN THE BRAND'S VOICE}}), playable in 10 seconds.
Then get people unstuck: a search box, links to the 3–5 most useful pages, and a way to report the broken link.
Make sure the server returns status 404, and that it works without JavaScript.
```

Based on: the designed 404s on [The Renaissance Edition](https://www.awwwards.com/sites/the-renaissance-edition) and [ERA Residence](https://www.awwwards.com/sites/era-residence) (Awwwards) and [Aurel (Codrops)](https://tympanus.net/codrops/2025/05/20/behind-the-curtain-building-aurels-grand-theater-from-design-to-code/)

### 59. The theme switch as a moment

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Build a light/dark (day/night) switch for {{SITE}} where switching is a small event: {{THE SUN SETS BEHIND THE
HEADLINE / LIGHTS TURN ON WINDOW BY WINDOW / INK FLOODS OUT FROM THE SWITCH / A SHUTTER CLOSES}}, using the View
Transitions API with a plain fallback. Both themes are designed, not inverted: the images, shadows and accent
colour change too, and both pass AA contrast.
Start from the system preference, remember the visitor's choice, and never flash the wrong theme on load.
Keyboard: the switch is a button with aria-pressed. Reduced motion: instant swap.
```

Based on: [ERA Residence's day/night toggle (Awwwards)](https://www.awwwards.com/sites/era-residence)

## Prompts: Micro-interactions and feel

### 60. Buttons with feel

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the button system for {{BRAND}}: primary, secondary and text buttons, each with default, hover (150ms),
focus-visible, pressed (scale 0.97 in 80ms), loading (the label morphs into progress without changing width),
success (a check draws in 400ms, then returns to default after 2s), error (two 6px shakes) and disabled states.
Hover does something that belongs to the brand, not a generic lift and shadow.
Show every state on one specimen page with a 10%-speed toggle so the motion can be judged. Touch: pressed is the
star, no hover-only feedback. Reduced motion: colour changes only.
```

Based on: the AI-slop tells "hover states that do nothing" and "buttons that snap instead of easing" ([925studios, March 2026](https://www.925studios.co/blog/ai-slop-web-design-guide))

### 61. Fling it

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Prototype {{THE MINI PLAYER TO FULL PLAYER OF A MUSIC APP / A CARD STACK / A BOTTOM SHEET / A PHOTO PILE}} in a
phone frame, as a web page I can use with a mouse or a finger. It follows my finger 1:1, rubber-bands at its
limits, and settles with a spring that keeps my release speed, so a gentle toss and a hard flick feel different.
Fling it to dismiss; the release speed decides whether it goes. Everything is interruptible: grab it mid-animation
and it stops where it is. Add one small reward inside (a like with a burst, a list I can reorder by dragging, a
waveform I can scrub). Draw any artwork in code.
Add a "slow motion" switch that runs all motion at 10% speed so I can review the curves, and name every spring in
a code comment. Keyboard: arrow keys and Escape do the same actions. Reduced motion: no springs.
```

Based on: [the Hummock player prompt from Muzli's Opus 5.5 tests](https://muz.li/blog/claude-opus-5-5-for-designers/) (spring 0.52s response, 0.76 damping in the result)
Twists: …a wallet of cards · …a deck of recipe cards · …a stack of film negatives

### 62. Sound and haptics layer

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design the sound of {{SITE}}: 5–8 tiny interaction sounds (hover tick, click, toggle, open, close, success,
transition whoosh) synthesised with the Web Audio API so there are no files, all from one sonic idea that fits
the brand ({{WOOD / GLASS / TAPE / PAPER / ANALOGUE SYNTH}}). Sound is off until the visitor turns it on with a
visible control, and the choice is remembered. On Android, add 10ms haptic pulses to snaps and completions
(Safari has no vibration API, so nothing may depend on them).
Never play sound on load, keep it quiet (peaks under −18dBFS), vary pitch slightly so repeats don't grate, and
play nothing when the tab is hidden.
```

Based on: [Aurel's interaction sound effects](https://tympanus.net/codrops/2025/05/20/behind-the-curtain-building-aurels-grand-theater-from-design-to-code/), [Adrien Vanderpotte's "whooshes and snaps"](https://tympanus.net/codrops/2026/05/27/whooshes-snaps-and-shaders-adrien-vanderpotte-and-the-feeling-of-the-interface/) and [Yestalgia's haptics](https://tympanus.net/codrops/2026/09/12/yestalgia-bringing-decathlons-90s-spirit-to-life-through-a-playful-digital-experience/) (Codrops)

### 63. Controls with physics

```text
BRAND: open
STACK: one self-contained HTML file (vanilla HTML, CSS and JS, no build step, no external requests)
Design a set of controls for {{PRODUCT OR SITE}} that feel like real hardware: a toggle switch whose knob squashes
as it travels, a slider with detents that click at meaningful values, a stepper that rolls its digits, a checkbox
whose mark draws itself, and a segmented control whose highlight slides. Each one is built on the native input so
forms, keyboards and screen readers work unchanged.
Interrupt: every control can be reversed mid-motion. Touch: targets of at least 44px. Reduced motion: state
changes are instant but still clearly visible.
```

## Remixes

### Art director pass
Based on: [Muzli's follow-up prompt from its Opus 5.5 tests](https://muz.li/blog/claude-opus-5-5-for-designers/)

```text
Take screenshots at 1440 and 390 pixels wide and at three scroll depths. List the three weakest things you see, as
an art director would, then fix them. Do not touch anything I have not mentioned.
```

### Harsh juror pass

```text
Be honest: would this win Site of the Day? Screenshot it at 390, 768 and 1440 wide (top, middle, bottom) and the
signature interaction mid-motion. Score Design (40%), Usability (30%), Creativity (20%) and Content (10%) out of 10
like an Awwwards jury, list the 3 weakest moments with screenshots, fix them, and show me the before and after
scores.
```

### Honest six-point review
Based on: [monokern's review rubric](https://x.com/monokern/status/2071246711222055363)

```text
Review this site against these criteria and be honest about what needs work: typography (are we using overused AI
fonts?), colour (is the palette restrained or all over the place?), hierarchy (does text size guide the eye
correctly?), animation (smooth and intentional, or choppy and random?), mobile (actually designed for phones, not
just shrunk?), copy (restrained and specific, or generic AI filler?). Then fix the worst three.
```

### What would the taste critic say?
Based on: [Charlie Hills' taste pass](https://x.com/charliejhills/status/2067933151754924228) and the "remove one accessory" rule in [Anthropic's frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

```text
What would a taste critic say about this page? Look for overload: effects that are tasteful alone but add up to
"AI-built" together. Keep one ambient motion system per screen, remove any looping animation that asks for
attention, and then, like checking the mirror before leaving the house, take one more thing away. Show me what you
removed.
```

### Three radically different directions

```text
Now make 3 radically different versions of this page, each in its own file: different art direction, type,
palette, layout system and interaction model. One of them should be a direction I would never have thought to ask
for. Keep the content and structure identical so I can compare them fairly.
```

### Make it less AI
Based on: [Anthropic's Opus 5.5 prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) ("avoid a generic AI look" just swaps one default for another; name the patterns and extend the list)

```text
List every choice in this page that a generic AI-built site would also make: palette, typefaces, layout, section
order, card styles, labels, motion and copy patterns. Replace each with a specific, deliberate alternative that fits
the art direction and say why. Then check which new defaults you reached for instead, add them to the banned list,
and check again.
```

### Borrow a real interface's discipline
Based on: [a June 2026 experiment where "make it look like a Qt app" removed almost all of the slop](https://envs.net/~volpe/blog/posts/reduce-slop.html)

```text
Restyle this page with the discipline of {{A REAL, NON-WEB INTERFACE: a Teenage Engineering manual / a Swiss rail
timetable / an airline boarding pass / a Braun product label / a 1990s desktop app / a museum wall label}}: borrow
its grid, type, spacing and restraint, not its logos. Keep the content. Tell me which three rules from it you
applied.
```

### Push the signature moment

```text
Find the single most memorable interaction on this page and make it twice as good: more precise timing, a better
response to the pointer, a payoff at the end, a detail that rewards trying it twice. Cut anything elsewhere that
competes with it.
```

### Desktop and mobile, separately
Based on: [Jeffrey Emanuel's repeated polish prompt](https://x.com/doodlestein/status/2007194101448573036) ("these really add up after 10 iterations")

```text
There are still strong opportunities to make this more intuitive, polished and visually striking. Consider desktop
and mobile separately and optimise each for what it's good at: hover, precision and space on desktop; thumbs,
scrolling and one hand on a phone (tap targets of at least 44px, no hover-only information, no horizontal scroll).
Redesign, don't shrink. Screenshot both before and after.
```

### Pre-ship QA with subagents
Based on: [Voxyz's pre-ship checklist prompt](https://x.com/Voxyz_ai/status/2106474370860548341)

```text
Check this site before it ships, in groups: design-system consistency (every colour, size, spacing and radius from
the tokens), layout (no horizontal scroll, nothing overflowing, nothing overlapping), states (loading, empty,
error, hover, focus), content (no placeholder text, no invented facts), accessibility and performance. Send one
subagent per group to check without editing anything. Then fix everything yourself from their lists, so no two
agents edit the same file. Show me the list of issues first and wait for my go-ahead, and when you're done, give me
before-and-after screenshots.
```

### Accessibility and performance pass

```text
Audit this page for keyboard navigation, focus visibility, screen-reader labels, colour contrast, reduced motion,
Largest Contentful Paint, layout shift and interaction latency. Fix every failure and report each check with its
number before and after.
```

### Director notes
note: Vague notes like "make it better" get random changes; specific ones get exactly what you want.

- The wordmark refracts too much at rest; halve it.
- The headline arrives after the image; reverse that so the words land first and the image follows 120ms later.
- The hover state on the project list is too timid: scale the preview to 1.06, shift it 12px toward the pointer, and add a 200ms mask reveal.
- Everything on this page fades up the same way. Give each section its own entrance that matches its content, and make two sections enter with no animation at all.
- The page has no rhythm: alternate dense and airy sections, and make one section break the grid on purpose.
- The colours are timid. Pick one section to flood with the accent colour edge to edge.
- The globe moves too fast to understand; slow it to a third and let it pause on each city.
