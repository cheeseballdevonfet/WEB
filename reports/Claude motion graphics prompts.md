# Steering Opus 5.5 Motion Past the AI Look

Creators don't get video out of Claude Opus 5.5. They get a program. Usually it is one HTML file whose every frame is a pure function of time (`seek(t)`). A headless browser screenshots each frame and ffmpeg stitches them into an MP4. Creators get Remotion or HyperFrames only when they name the framework in the prompt ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). The best evidence of how people prompt for this is a Skillry-curated corpus of **475 viral posts from the model's first week**. Most of those prompts are tiny. The **median is 31 words and 70% are under 50**. One meme ("make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are…") appears **36 times verbatim**. Production specs are rare: hex palettes in **1.7%** of prompts, timestamped storyboards in **2.3%**, "Banned:" lists in **5.3%**, and `prefers-reduced-motion` in **just 3 of 475** ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)). Prompt length is not what separates striking results from the default "centered text on a gradient, everything fading in" look. Four habits are: feeding real brand assets and a named reference instead of adjectives, locking tokens with a ban-list that names each default, gating on a plan before code, and making Claude look at its own frames. For a digital marketing agency website, the corpus is most useful as a lineage of reusable structures. Those structures have to be converted from video timelines into triggered, responsive, accessible components. The corpus says nothing about several components an agency site needs most: growth charts, logo marquees, testimonials, magnetic buttons and shader gradients. The library below fills those gaps with prompts labelled as synthesized. One trap matters more than any other. Several viral prompts set palettes and fonts (near-black with acid green, "Geist or Inter") that fall inside the AI-default clusters Anthropic's own frontend-design skill warns against. Copying them verbatim brings back the look they claim to ban.

## A 31-word meme went viral, but engineered briefs carry the craft

Anthropic released Opus 5.5 on 22 September 2026. It reported that when testers had several models build a game from one prompt, Opus 5.5 "scored higher than any other model on the strength of its graphics and polish" ([Anthropic](https://www.anthropic.com/news/claude-opus-5-5)). Within a week, X filled with animations. Skillry collected **475 of those posts from 441 authors**, all dated 22–28 September. They split into **motion 288 (60.6%)**, interactive 70, explainer 62 and 3D 55 ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)). The pipeline behind them is surprisingly uniform. Tommy Rossi inspected one run and found it "put all the code in a single index.html file and rendered it using playwright frame by frame." He noted the model "seems to prefer doing everything with zero dependencies from scratch instead of using tools like remotion, egaki, or hyperframes" ([@__morse](https://x.com/__morse/status/2103485566570369333)). Remotion is named in 62 entries, but almost always in the post text rather than the prompt. In practice, frameworks reach the model as installed agent skills ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json); [Remotion skills](https://www.remotion.dev/docs/ai/skills)).

The prompts themselves are short and repetitive. Only **418 distinct texts** exist among the 475 entries. **41.3% are "partial"**, meaning the corpus holds the creator's post rather than the prompt. Most of that partial text is tweet copy such as "Opus 5.5 just one-shot this" ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)). The table shows how rarely prompts specify what a production team would.

| What the prompt specifies | Share of all 475 prompts |
|---|---|
| A duration | 42.3% (35–39% after removing the viral clone) |
| Any negative constraint ("no…", "avoid…") | 19.6% |
| A beat/BPM grid | 8.4% |
| Resolution or aspect ratio | 8.4% |
| Frame rate | 6.5% |
| A self-verification step (screenshots, contact sheet) | 5.3% |
| An explicit "Banned:" list | 5.3% |
| "Single HTML file" | 5.3% |
| Named fonts | 4.2% |
| Determinism (`seek(t)`, "pure function of time") | 3.6% |
| A plan-before-code gate ("ask me… first") | 3.2% |
| A timestamped storyboard | 2.3% |
| Responsive or mobile behaviour | 2.3% |
| Hex colours | 1.7% |
| Live scroll input | 1.3% |
| `prefers-reduced-motion` | 0.6% (3 prompts) |

Source: regex passes over [videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json). The counts are approximate to within a few entries.

The corpus is really two populations. One is a long tail of one-liners. The other is roughly **15–25 engineered prompts** that hold almost every precise spec. The one-liner that defined the trend is Stephan Livera's résumé showreel, run on Max effort. It drew **about 17K likes and 2.25M views** ([@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926)). 0xMovez's breakdown explains why it works. "Showreel for a résumé" sets a genre with known rules. Making the model the subject leaves "No content to get wrong". "Go all out" acts as an effort multiplier. He also names its weakness, "brief contagion": "Hundreds of identical prompts produced reels that rhyme with each other… A one-liner tests the engine. It never tests the idea" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). The engineered pole is @twoclipping's open-sourced XML template, with sections `<inputs>`, `<direction>`, `<structure>`, `<build>`, `<gotchas>` and `<start>`. It drew **about 12.1K likes and 1.03M views** ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)), plus a reported **~19K bookmarks** ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). That bookmark-to-like ratio suggests creators treat the spec as reusable craft and the one-liner as a party trick.

The generic failure is well documented, and Anthropic itself names its cause. "Asked for frontend work without design direction, Claude Opus 5.5 falls back on a few default styles, and a general instruction such as 'avoid a generic AI look' mostly swaps one default for another" ([Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). Anthropic calls the underlying mechanism "distributional convergence" toward safe, high-probability choices ([Claude blog](https://claude.com/blog/improving-frontend-design-through-skills)). Creators describe the same thing in motion terms: "centered text on a gradient, everything fading in, a logo at the end. They don't give it a reference, don't give it a render engine, don't ask it to look at its own frames" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). Four habits recur in the work that escapes it. The first is **real assets and a named reference**: "naming a style works way better than describing one" ([@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)), and Tony Dinh's polished reel came from three extra lines (product URL, "use actual product screenshot, logo, assets", "must have music"), per [0xMovez](https://x.com/0xMovez/status/2104216919033192746). The second is **locked tokens plus a ban-list naming each default**, as in @twoclipping's "Banned: bouncy easing, particle bursts, glows, gradients on UI chrome… anything that looks like a template." The third is **a plan gate**: "fixing a storyboard is way cheaper than fixing a render" ([@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)). The fourth is **a visual self-review loop**. 0xMovez calls that feedback loop "the whole difference between the 'mid' first try people complain about and the viral ones" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). One vendor's tally points the same way: minimal prompts earned a median 3 likes against 34 for personalized ones. That source sells a video tool, so treat the number as directional ([Everleigh, dev.to](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)).

"One-shot" claims hide real labour, and that should shape your budget. A Claude Code team member summed up the gap: "the post: 'Claude one-shot this' / the prompt: 10k characters with good takes plus skills, examples and API keys" ([@trq212](https://x.com/trq212/status/2102870353781641416)). One creator logged **62.7M tokens, 163 model calls, ~$34 and about 6¾ hours** for a 45-second short ([@mablesjoseph](https://x.com/mablesjoseph/status/2103465246014746943)). Another logged **~90 messages, 33 takes and ~$400** over two days for a feature trailer ([@wustep](https://x.com/wustep/status/2104610435571884086)).

The corpus also misses most of what a website needs. Real-time input specs are rare. Half the "cursor" hits describe a scripted cursor inside a rendered video, and live scroll input appears in 6 prompts. "Funnel" appears once, in a copywriting brief. Ten of the 11 "chart" mentions come from one copied template, and none of the 3 "agency" mentions is a marketing-agency site ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)). Award juries reward a different set of things: "transitions that carry meaning," atmospheric rather than spectacular WebGL, roughly 60fps on mid-range phones, and a reduced-motion path ([Hon Tran, Awwwards juror](https://www.hontran.dev/blog/best-award-winning-websites-2026)). The library therefore keeps the corpus's structures and rewrites its timing, interaction and accessibility from scratch.

## One spec block keeps every prompt on-brand and outside the AI clusters

Consistency across thirty prompts comes from writing the brand down once and pasting it above every prompt. Better still, store it in `/brand/BRAND.md` and point `CLAUDE.md` at it so every Claude Code session loads it. Anthropic's current frontend-design skill starts with exactly this kind of "compact token system", 4–6 named hex colours plus type roles. It then reviews that plan against "the generic default you would produce for any similar page" before any code is written ([SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)). The design-token format is now stable (DTCG Format Module 2025.10), so `/brand/tokens.json` can generate CSS variables and a Tailwind theme from one source ([W3C DTCG](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)).

The ban-list is built from what Anthropic's skill says "AI-generated design right now clusters around":

1. A warm cream background (near `#F4F1EA`) with a high-contrast serif and a terracotta accent (near `#D97757`).
2. "A near-black background with a single bright acid-green or vermilion accent".
3. Broadsheet layouts with hairline rules and zero radius.
4. "The SaaS-card kit": identical rounded cards with an `rgba(0,0,0,.1)` shadow.
5. "Template chrome": ALL-CAPS eyebrows, middle-dot meta strings, monospace labels and appended arrows.

The skill also flags "fade-and-slide-up entrances on each section and hover transitions on every card" and the "big number with a small label… and a gradient accent" hero ([SKILL.md](https://raw.githubusercontent.com/anthropics/skills/HEAD/skills/frontend-design/SKILL.md)). Anthropic's Opus 5.5 guide adds italic accent words, "01/02/03" labels and pill buttons ([Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). The cookbook adds Inter, Roboto, Arial, Space Grotesk and purple-on-white gradients ([Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)). HeyGen's HyperFrames skill independently lists gradient text, left-edge accent stripes, cyan-on-dark or purple-to-blue neon, and pure `#000`/`#fff` as "the first thing every LLM reaches for" ([hyperframes-creative](https://raw.githubusercontent.com/heygen-com/hyperframes/HEAD/skills/hyperframes-creative/SKILL.md)).

The viral prompts themselves land in these clusters. @techhalla's strict palette is `#0A0A0A` with `#B8FF00` acid green and IBM Plex Mono for small labels ([@techhalla](https://x.com/techhalla/status/2103411244468498547)), which hits clusters 2 and 5. @twoclipping's case-study brief asks for "one clean sans (Geist or Inter)" ([@twoclipping](https://x.com/twoclipping/status/2102554209166000267)). The spec therefore bans those by name too.

The motion tokens are lifted from creators rather than invented. The curve `cubic-bezier(0.16, 1, 0.3, 1)` appears independently in two unrelated briefs, one with the rule "overshoot below ~2%" ([@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937); [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030)). "Springs everywhere, a tiny overshoot at most" is the UI-morph family's damping rule ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)). 0xMovez publishes snappy/default/heavy spring presets and a `track(t, keys, k=170, d=26)` helper ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). "Aim for half the speed you'd default to" for camera moves comes from [@jake11moran](https://x.com/jake11moran/status/2103237884564414633), and "at least one 400ms moment of absolute stillness" from [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495). The snappy (300/30) and heavy (120/30) spring numbers are starting values from general practice, not from any creator, so tune them by eye at 10% speed. For a marketing agency, the honesty clause matters most. It merges "No invented results: no %, multipliers, customer names or figures" ([@ik_builds](https://x.com/ik_builds/status/2103890476885585923)), "Do not invent metrics that imply real customer data" ([@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)) and "Use only facts and numbers that are on the site" ([@wani_shola](https://x.com/wani_shola/status/2103769906638459278)).

Paste both blocks above every prompt in the library. The second block, `<component_contract>`, carries the web rules the corpus almost never states: triggers instead of timestamps, a responsive container, reduced motion, performance and verification. The performance and accessibility clauses follow web.dev's compositor guidance, WCAG 2.3.3, and the reduced-motion hooks in Motion, GSAP and Lenis ([web.dev](https://web.dev/articles/animations-guide); [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html); [Motion](https://motion.dev/docs/react-accessibility); [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()); [Lenis](https://github.com/darkroomengineering/lenis)).

```text
<brand_spec>
AGENCY: {{AGENCY_NAME}}: {{ONE_LINE_POSITIONING}}. Tagline: {{TAGLINE}}. URL: {{URL}}.
AUDIENCE: {{AUDIENCE}}. PERSONALITY: {{THREE_ADJECTIVES}}. VOICE: sharp, natural, confident; not overhyped, not corporate.
LOCKED COPY: use copy from {{COPY_FILE}} verbatim. Do not soften it or add slogans.
TRUTH: every number, client name, logo, quote, screenshot and UI comes from {{CASE_STUDIES_DIR}}, {{METRICS_FILE}}
  or {{TESTIMONIALS_FILE}}. Never invent metrics, %, multipliers, clients, quotes or screens. Never redraw a client's UI
  from imagination; capture and animate the real thing. Missing data = a visibly marked TODO slot, never a plausible fake.

COLOR (CSS variables; OKLCH + hex):
  --ink:    {{INK_HEX}}     text and line work (not pure #000)
  --paper:  {{PAPER_HEX}}   main background (not pure #fff; not cream/off-white near #F4F1EA)
  --field:  {{FIELD_HEX}}   dominant brand colour for large areas
  --accent: {{ACCENT_HEX}}  CTAs + one highlight per view; ≤10% of any screen
  --signal: {{SIGNAL_HEX}}  data only (chart lines, positive deltas)
  Ratios ≈ 70% paper/ink, 20% field, ≤10% accent. No other hues. No gradient text. No gradients on UI chrome.

TYPE:
  Display: {{DISPLAY_FONT}} (prefer a variable font with a wdth or wght axis so the wordmark can animate);
           tracking -2% to -4% at large sizes; display ≥3× body size on desktop; sizes via clamp().
  Text:    {{TEXT_FONT}}.
  Never: Inter, Roboto, Arial, system-ui stacks, Space Grotesk, Geist (the viral-template default), monospace
         labels, italic accent words in headlines.

SHAPE GRAMMAR: one brand primitive, {{BRAND_SHAPE}}, reused as mask, cursor label, quote mark, loader, divider and
  process stage. One corner radius: {{RADIUS}}. No blobs, no glassmorphism, no identical rounded-card grids.
LINE: icons 24px grid, 1.5px stroke, round caps/joins, currentColor. Illustrations 2px stroke, flat fills.

MOTION TOKENS:
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1)    reveals and entrances; overshoot below ~2%
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)   camera-like moves and scroll scenes
  spring.snappy  {stiffness 300, damping 30}       buttons, toggles, leading edges
  spring.default {stiffness 170, damping 26}       cards, containers, panels
  spring.heavy   {stiffness 120, damping 30}       big type, logo lockups: no visible overshoot
  durations: micro 150ms · ui 300ms · reveal 700ms · camera 1200–2000ms (half the speed you'd default to) · stagger 60ms
  RULES: one signature motion moment per page, everything else quiet. Springs everywhere, a tiny overshoot at most,
  none on headlines. No linear easing on anything that starts and stops (continuous marquees excepted). Elements do
  not all start and stop on the same frame. Content enters after its container starts moving and leaves before the
  next move, so text never overlaps. Hold ≥400ms of stillness when a key line becomes readable. Any loop's last
  state equals its first.

BANNED (AI-default clusters and template tells):
  cream/off-white + high-contrast serif + terracotta/clay accent · near-black + one acid-green or vermilion accent ·
  broadsheet hairline rules, zero radius, dense newspaper columns · SaaS-card kit (identical rounded cards, one radius,
  rgba(0,0,0,.1) shadow, gradient washes) · template chrome (tracked ALL-CAPS eyebrow over every heading, meta strings
  joined by middle dots, monospace data labels, "→" appended to links, pill buttons, 01/02/03 labels outside the
  Process section) · hero made of a big number + small label + supporting stats + gradient accent · purple-to-blue
  or cyan-on-dark neon, purple gradient on white, gradient text, left-edge accent stripes · fade-and-slide-up on every
  section, hover transitions on every card, everything fading in, centered title on gradient · bouncy/elastic easing,
  particle bursts, glows, lens flares, camera shake, RGB split, glitch, crossfades, blur-ins · corner labels, frame
  borders, fake HUD, timecodes, fake dashboards, spinning logos · stock AI imagery (brains, robots, neural nets,
  sparkles) · Canva-deck energy · anything that looks like a template.
</brand_spec>

<component_contract>
STACK: {{STACK}} =
  (A) vanilla HTML/CSS/JS, ES modules, no build step; GSAP from a CDN only where a prompt calls for it; or
  (B) Next.js App Router + TypeScript + Tailwind v4; Motion for React springs/gestures/layout, wrapped in
      <MotionConfig reducedMotion="user">; GSAP + ScrollTrigger via useGSAP for pinned or scrubbed scroll;
      "use client" only where needed.
DRIVERS: never absolute timestamps. Trigger on load, on entering view (IntersectionObserver, ≥30% visible, once),
  on hover/:focus-visible, on pointer position (lerped inside one rAF loop), or on scroll progress (CSS
  animation-timeline inside @supports, else ScrollTrigger scrub). Write every sequence as a pure function of progress
  p∈[0,1] so it is scrubbable, reversible and interruptible. Seeded randomness only.
RESPONSIVE: fluid 320–1920px; the component fills its container; reserve space with aspect-ratio/min-height so
  CLS = 0; type via clamp(); pointer effects off on (hover: none) and (pointer: coarse), with a tap equivalent.
REDUCED MOTION: under prefers-reduced-motion: reduce, show the final state immediately (opacity ≤150ms only): no
  parallax, scrub, autoplay loops, shake or large translations. Any auto-playing loop >5s has a visible pause control.
PERFORMANCE: animate only transform, opacity, @property custom properties and shader uniforms; never
  width/height/top/left/box-shadow. Apply will-change only during an animation and never on scaled text. One rAF
  loop per page with time-based deltas. Pause off-screen (IntersectionObserver) and on visibilitychange. Canvas DPR
  ≤2 (≤1.5 on mobile). Lazy-load WebGL and GSAP plugins after first paint so LCP is real text. Static fallback if
  WebGL fails. Name any new dependency and its size.
ACCESSIBILITY: semantic HTML first; content readable with JS off; hover state = :focus-visible state; decorative
  canvas/SVG aria-hidden; split text keeps an accessible label; no focus traps in pinned sections.
VERIFY: run it; screenshot at 375, 768 and 1440 wide; replay the motion at 10% speed; critique as a harsh motion
  director, not a proud author; fix the 3 worst problems; report what changed and bytes added.
</component_contract>
```

The following fill is my own illustration, not from any source; run L0 to choose yours. Ink `#14162B`, paper `#E9EDF3`, field ultramarine `#2934D6`, accent marigold `#FFB21F` (never as text on paper), signal `#0B8A5F` (chart strokes only, ~3.7:1 on paper). Pair a variable grotesque display face that has a `wdth` axis with a text face that is not on the banned list. The placeholders used throughout are listed below.

| Placeholder | What to supply |
|---|---|
| `{{AGENCY_NAME}}`, `{{TAGLINE}}`, `{{URL}}`, `{{ONE_LINE_POSITIONING}}` | Identity and positioning line |
| `{{COPY_FILE}}`, `{{MANIFESTO_LINES}}`, `{{CTA_LABEL}}`, `{{CTA_HEADLINE}}` | Locked copy |
| `{{CASE_STUDIES_DIR}}`, `{{CASE_ID}}`, `{{CLIENT}}`, `{{CLIENT_URL}}` | Case-study folders: covers, layers, captures |
| `{{METRICS_FILE}}` | JSON of {client, metric, before, after, period, source} |
| `{{TESTIMONIALS_FILE}}`, `{{TEAM_FILE}}` | Verbatim quotes with permission flags; team data |
| `{{CLIENT_LOGOS_DIR}}`, `{{PLATFORM_PARTNER_BADGES}}` | Client and ad-platform SVGs (replaces third-party brand names in source prompts) |
| `{{LOGO_SVG}}`, `{{BRAND_SHAPE}}`, `{{SHAPE_GRAMMAR}}` | Existing logo and the brand primitive (L24) |
| `{{SERVICES}}`, `{{PROCESS_STEPS}}`, `{{AUDIT_NAME}}` | Service list, process stages, lead-magnet name |
| `{{SHOWREEL_MP4}}`, `{{SHOWREEL_POSTER}}`, `{{CLIENT_CLIP}}` | Rendered video assets (L7, L17) |
| `{{STACK}}`, `{{RENDER_ROUTE}}` | Option A or B above; Remotion or `seek(t)` + Playwright |

## The prompt library: 31 prompts across twelve sections plus graphic assets

Each entry gives the original source excerpt with its author and post URL, followed by an adapted prompt you can paste below the two blocks above. Labels mark where each prompt came from. **Adapted** means a real source prompt exists and was converted. **Synthesized from fragments** means no source prompt covers the component, so it was assembled from cited lines in other prompts; this covers the gap areas. **Synthesized** means no corpus source exists at all. Third-party brands in source prompts (Spotify, Meta, Google, sprites.ai, TanStack and others) are replaced with placeholders. Nobody has tested the adapted prompts as a set, so treat them as strong first drafts.

### How video prompts become component prompts

Every conversion follows one rule: keep the source's pure-function architecture and its spring and ban-list discipline, and replace the clock. Where a video prompt says `seek(t)`, a component uses `draw(p)`, with `p` coming from scroll, hover dwell or pointer position. No creator in the corpus published such a conversion. The table is a synthesis built on Anthropic's "one well-orchestrated page load" guidance and current browser support ([Claude blog](https://claude.com/blog/improving-frontend-design-through-skills); [Chrome scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)).

| The video prompt says | The component prompt says |
|---|---|
| "15-second video, 1080×1080" | Fills its container; aspect-ratio reserved; clamp() type; works from 320 to 1920px |
| "0:00–0:02 logo draws; 0:02–0:05 headline slides in" | Delays relative to the trigger: logo 600ms, headline +200ms with 50ms stagger; total ≤1.5s |
| "Render at 60fps with Playwright; plays once" | Real-time rAF; plays once on load or at 30% in view; final state persists |
| "Loop the whole piece" | Only ambient layers loop (≥10s period), and they pause off-screen, in hidden tabs and under reduced motion |
| "Camera pushes in, pans across" | Progress tied to scroll (`view()` / ScrollTrigger scrub) or to lerped pointer position |
| "Hard cuts on the beat" | No audio; changes land at scroll checkpoints or user steps |
| "No CSS transitions or timers" (for frame capture) | CSS/WAAPI preferred for simple states; pure functions only for scrubbed stages |
| "Go all out" | One signature moment; everything else quiet; budgets respected |
| (implicit: the viewer only watches) | Hover, focus, pressed and disabled states; touch fallback; interruptible |
| (implicit: everyone sees motion) | A reduced-motion variant that shows the final frame |

| # | Section | Prompt | Basis | Lead source |
|---|---|---|---|---|
| L0 | Global | Kickoff plan | Adapted | Anthropic docs, Muzli |
| L1 | Preloader | Wireframe to shards to wordmark | Adapted | @Mounnna |
| L2 | Nav | Two-spring indicator, flood menu | Adapted | @twoclipping |
| L3 | Hero | Kinetic headline with landing slot | Adapted | @techhalla, @jake11moran |
| L4 | Hero | Scroll-scrubbed showreel | Adapted | @iamtanzil_ |
| L5 | Hero (alt) | Cursor x-ray "behind the campaign" | Adapted | @iamtanzil_ |
| L6 | Hero background | Noise-to-signal particle field | Adapted | Muzli, @ishuagra02 |
| L7 | Motion graphics | Rendered agency showreel film | Adapted | @stephanlivera, @HO_BA, @reflex_cloud, 0xMovez |
| L8 | Services | Hover list with one morphing demo | Adapted | @HowDevelop, @TheGrootDev |
| L9 | Services (SEO) | Live backlink explainer | Adapted | @stewchan2, @ParkerRex, @AstroTheWizard |
| L10 | Work | Breakout card, shared-element transition | Adapted | @pankajkumar_dev, @daniel_haida |
| L11 | Case study | Real-site capture, results flip | Adapted | @wani_shola, @twoclipping |
| L12 | Results | Count-up and self-drawing growth chart | Synthesized from fragments (gap) | @daniel_haida, @twoclipping, @AstroTheWizard |
| L13 | Client logos | CSS marquee | Synthesized (gap) | none |
| L14 | Client logos (bold) | Tile-flock logo mosaic | Adapted | @zeezomb |
| L15 | Process | One shape, never cut, on scroll | Adapted | @verbove, @charlesmendez |
| L16 | Testimonials | Verbatim quote deck | Synthesized from fragments (gap) | @Bilimfili1 |
| L17 | Testimonials | Talking-head edit (rendered) | Adapted | @sab8a, @l3d1c |
| L18 | About | Architectural manifesto | Adapted | @Gdgtify |
| L19 | Team | Risograph duotone portraits | Synthesized from fragments | @rneayan, Muzli |
| L20 | Contact | Submit button morph flow | Adapted | @twoclipping, @op7418 |
| L21 | CTA | Magnetic CTA | Synthesized from fragments (gap) | @BThreeAgency |
| L22 | Conversion | Free-audit score reveal | Adapted | @op7418 |
| L23 | Footer | Variable-font wordmark sign-off | Synthesized from fragments | @twoclipping |
| L24 | Asset | Brand mark / primitive SVG | Adapted | Ciyo |
| L25 | Asset | Service icon set | Adapted | Analytics Vidhya |
| L26 | Asset | Spot illustration set | Adapted | ChatPRD (Claire Vo) |
| L27 | Asset | Shape library, cover template | Synthesized from fragments | @techhalla, Muzli |
| L28 | Asset | Shader gradient background | Synthesized from fragments (gap) | @zeezomb, @brainextends |
| L29 | Asset | OG images | Synthesized | Next.js docs |
| L30 | Asset | Brand reference sheet | Synthesized | none |

### Global: plan before any pixels move

#### L0. Kickoff plan · Adapted

**Source:** Anthropic, Prompting Claude Opus 5.5, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
> "Output a vanilla HTML/CSS personal website with placeholder data. Do not use a cream or off-white background, italic accent words in headlines, numbered '01/02/03' section labels, monospace labels, or pill-shaped buttons."

**Source:** Muzli (Petras Baukys), https://muz.li/blog/claude-opus-5-5-for-designers/ (vendor blog)
> "The one memorable thing: the hero is water."

Muzli also recommends asking for "eight type pairings" and "one orchestrated moment per page". The frontend-design skill adds the persona and the review-against-default pass.

```text
Using <brand_spec> and <component_contract> above: you are the design lead at a studio known for giving every
client a distinct visual identity. Plan the {{AGENCY_NAME}} website before writing any component code.
1) Read {{COPY_FILE}}, {{CASE_STUDIES_DIR}}, {{METRICS_FILE}}, {{TESTIMONIALS_FILE}} and {{LOGO_SVG}}. List what you
   found and what is missing. Do not invent anything to fill gaps.
2) Propose 8 display/text type pairings that obey the bans; render them as /brand/type.html; recommend one and say why.
3) Fill every colour token with named OKLCH + hex values and roles; render swatches with WCAG contrast ratios.
4) Name the ONE memorable thing for this site (where we spend boldness) and which section owns it. Every other section
   stays quiet.
5) ASCII wireframes for: preloader, nav, hero, services, work, results, client logos, process, testimonials,
   about/team, CTA/contact, footer.
6) Review the plan against the generic default you would produce for any agency site. List every place it still
   matches a banned cluster, and change it.
Stop and wait for my OK.
```

### Preloader: draw the mark, then get out of the way

#### L1. Brand-mark preloader · Adapted

**Source:** @Mounnna, https://x.com/Mounnna/status/2103802871934497266 (full prompt; README-highlighted)
> "Create a motion design video of a slow-reveal transition. Draw the logo as a wireframe first, then fly in faceted low-poly shards one by one until they assemble the logo. Finish by bringing in the app icon background and typing out the brand name."

The adaptation turns an open-ended video into a ≤1.4s preloader. It never blocks a page that is already ready, and it skips repeat visits and reduced motion.

```text
Using <brand_spec> and <component_contract> above, build <Preloader> for {{AGENCY_NAME}}.
Concept: the mark from {{LOGO_SVG}} (never redrawn) draws as a 1.5px --ink wireframe via stroke-dashoffset; 6–10 flat
faceted shards in --field and --accent, cut from the mark's own geometry, fly in one by one and lock into the mark;
then the wordmark types on in {{DISPLAY_FONT}}.
Timing from start: wireframe 0–450ms (--ease-in-out); shards 300–900ms, 50ms stagger, spring.heavy, no visible
overshoot; wordmark 800–1100ms; exit 1100–1400ms as a --field curtain wiping upward to reveal the hero, which is
already rendered underneath.
Rules: total ≤1.4s; if the page is ready sooner, fast-forward to the exit; never wait on assets not needed above the
fold; show once per session (sessionStorage); with JS off or under reduced motion, render nothing and show the hero.
Deliver the component plus stills at 0, 450, 900 and 1300ms at 375 and 1440 wide, and your critique.
```

### Navigation: one stretchy indicator, one flood

#### L2. Nav with a liquid indicator and flood menu · Adapted

**Source:** @twoclipping, https://x.com/twoclipping/status/2103273003555402193 (full XML template)
> "The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one. Same trick for the toggle knob."

**Source:** @twoclipping, https://x.com/twoclipping/status/2103835273813496100 (keynote-film template)
> "A flood must overscale past the corners and take about 0.3s, or half the screen changes in one frame."

The same keynote template also has a "liquid glass" recipe: an SVG `feImage` displacement map through three `feDisplacementMap`s, with the warning "backdrop-filter: url() misreads displacement maps in Chromium, so clone the scene instead." That recipe sits next to the banned glassmorphism look, so use it only if glass is the site's one signature moment.

```text
Using <brand_spec> and <component_contract> above, build <SiteNav> for {{AGENCY_NAME}}.
Desktop: wordmark left; links {{NAV_LINKS}}; one primary CTA "{{CTA_LABEL}}". The hover/active indicator is one
{{BRAND_SHAPE}}-derived bar under the links. Its leading edge rides spring.snappy and its trailing edge rides
spring.default, so it stretches toward the target and settles. Keyboard focus moves it exactly as hover does.
Scroll: hide on scroll-down past 80px and return on scroll-up (transform only); after 40px add a solid --paper
background. No blur, no glass.
Mobile (<768px): the menu icon morphs into a close icon (the same strokes morph, not a swap). The full-screen menu
opens as a --field flood growing from the button, overscaling past the far corner in ~300ms (--ease-out). Links
enter after the flood covers 60% and leave before it retracts. Focus is trapped only while the menu is open; Esc
closes; body scroll locks.
Gotchas: no will-change on scaled text; text swapping inside a morphing element needs its own enter/exit timing.
Reduced motion: the indicator jumps without stretch; the menu opens with a 120ms opacity fade.
```

### Hero and showreel: spend the page's boldness here

#### L3. Kinetic headline with a landing slot · Adapted

**Source:** @techhalla, https://x.com/techhalla/status/2103411244468498547 (full prompt, posted in a reply)
> "Kinetic type: per-glyph spring (y, opacity, blur). Stagger = 1/16 note at 120 BPM (125ms)." … "Letters scramble (seeded Fisher–Yates per glyph) then snap on the beat." … "replaces it via mask wipe through the letterforms (the outgoing line is the mask)."

**Source:** @jake11moran, https://x.com/jake11moran/status/2103237884564414633 (full prompt)
> "Open on a big centered line - "in the AI era, the hard part is" - entering word by word from the right … then scale it down into place above a spinning list. 2. The list rotates through 30 hard things … Go fast, it's not meant to be read, then land slowly on "managing your desktop"."

The blur in the source is replaced with transform-only ghost copies. Filter blur is paint-expensive, and the contract forbids it.

```text
Using <brand_spec> and <component_contract> above, build <HeroKinetic>, the homepage hero for {{AGENCY_NAME}}.
Unless the L0 plan placed the signature moment elsewhere, it lives here.
Content (server-rendered, so LCP is the headline): line "{{HERO_LINE_1}}" (e.g. "Growing a brand today, the hard part
is"), a slot cycling through 8–12 real client pain points from {{COPY_FILE}}, subline {{HERO_SUBLINE}}, CTA
"{{CTA_LABEL}}" and secondary "Watch the reel".
On load (once): line words rise from yPercent 110 inside overflow-hidden masks, 700ms --ease-out, 60ms stagger. At
+500ms the slot spins: pain points flick past at 80–120ms each, with two low-opacity trailing copies for motion blur
(transform only, never filter: blur). It decelerates over ~900ms and lands slowly on "{{LANDING_PHRASE}}" in --accent
with spring.heavy. Optional: the landing phrase's letters scramble through 3 seeded glyphs before snapping.
Idle: every 4s the slot swaps to the next value proposition with per-glyph springs on y and opacity (30ms glyph
stagger); the outgoing word is the mask for the incoming one. Pause swaps while the hero is off-screen, the tab is
hidden, or the headline is hovered or focused.
Layout: left-aligned, never centered-on-gradient; clamp(3rem, 9vw, 9rem); min-height 90svh; the slot reserves the
width of its longest phrase.
A11y: one real <h1>; the slot has aria-live="off" and its full list is in visually hidden text.
Reduced motion: no spin or scramble; static landing phrase; swaps become 150ms fades every 6s with a pause control.
Implementation: GSAP SplitText or hand-split spans on one timeline.
```

#### L4. Scroll-scrubbed showreel section · Adapted

**Source:** @iamtanzil_, https://x.com/iamtanzil_/status/2103820321673675031 (full prompt, 1,584 words)
> "A cinematic, scroll-scrubbed 3D hero header for the luxury/fantasy brand "AUREN" where a full-screen background video plays frame-by-frame as the user scrolls through a 500vh section … Do NOT autoplay the video — keep it muted + playsInline and drive currentTime from ScrollTrigger. … Do NOT forget the 500vh root height + sticky inner wrapper; without both, there is no scroll runway and the video won't scrub. … Initialise the ScrollTrigger only after video metadata loads, and kill it on unmount to avoid leaks."

```text
Using <brand_spec> and <component_contract> above, build <ShowreelScrub>, placed directly after the hero, using
{{SHOWREEL_MP4}} (from L7).
Structure (≥1024px): root height 400vh with a sticky 100vh inner wrapper. The video is muted, playsInline,
preload="metadata", poster {{SHOWREEL_POSTER}}, and never autoplays. Its currentTime follows scroll progress
(ScrollTrigger scrub, or a CSS scroll timeline read in the rAF loop). Encode with short keyframe intervals so seeking
stays smooth.
Overlays follow scroll progress p, not clock time: p 0.05–0.20 "{{REEL_LINE_1}}"; p 0.30–0.55 two featured-work cards
from {{CASE_STUDIES_DIR}} (client, one real metric, link) slide in 24px with a fade; p 0.65–0.85 "{{REEL_LINE_2}}";
p 0.90–1.00 the CTA "Watch the full reel", which opens a dialog with sound and native controls.
Initialise ScrollTrigger after loadedmetadata; kill it on unmount. Without the root height plus the sticky wrapper
there is no scroll runway.
Below 1024px, and under reduced motion: no runway and no scrub. Use a normal 16:9 block with the poster, a play
button, and the overlays as static text beneath. Never scroll-jack.
```

#### L5. Cursor x-ray "behind the campaign" hero (alternative) · Adapted

**Source:** @iamtanzil_, https://x.com/iamtanzil_/status/2103459843831120030 (full prompt, ~11K characters)
> "A full-viewport, dark, cinematic e-bike product header for the brand **OBLT**, built in React (client component) with pure CSS and an interactive cursor-following "x-ray" spotlight reveal — moving the mouse wipes away the bike's exterior photo to expose its internal carbon/gearbox structure underneath. […] Constants: `RADIUS = 165` px (spotlight radius), `FEATHER = 45` px (soft edge). […] Respects `@media (prefers-reduced-motion: reduce)` […] Don't invert the mask logic: opaque `#000` in the radial gradient REVEALS the x-ray layer; the transparent ring hides it."

```text
Using <brand_spec> and <component_contract> above, build <HeroXray> as an alternative hero: "the work, and the
thinking under it".
Layers: the top layer is a finished campaign creative from {{CASE_STUDIES_DIR}}. The under layer is the same frame as
strategy, drawn in --ink line work on --paper: wireframe, audience annotations, and the real metrics from
{{METRICS_FILE}} pinned to the regions they affected.
Reveal: a cursor-following spotlight (RADIUS 165px, FEATHER 45px) wipes the top layer away using CSS mask-image with
a radial-gradient positioned by CSS variables --x/--y, written from a lerped pointer (factor ~0.15) in the single rAF
loop. Opaque in the gradient reveals the under layer; transparent hides it. Do not invert this.
Headline: words pull up once on load (cubic-bezier(.16,1,.3,1), 600ms, 80ms stagger), left-aligned, clamp(36px,
7vw, 116px).
Touch, (hover: none) and reduced motion: replace the spotlight with a before/after toggle button ("Show the
strategy"), plus an optional drag handle on touch.
No animation libraries needed; React or vanilla per {{STACK}}.
```

#### L6. Noise-to-signal particle field (hero background) · Adapted

**Source:** Muzli, https://muz.li/blog/claude-opus-5-5-for-designers/ (vendor blog; demo built in Claude Code)
> "The one memorable thing: the hero is water. A real-time WebGL water surface fills the screen and ripples where the cursor moves, with the Lenn wordmark under the surface, refracting. As you scroll, the tide drains away and salt crystals appear on the clay."

**Source:** @ishuagra02, https://x.com/ishuagra02/status/2102920408743678129 (full prompt)
> "Create a stylistic 3D environment of a busy Santa Monica beach that adapts to the time of day. The art style must be a particle illustration, which uses thousands of tiny glowing specks rather than solid fills with flowing ribbon strokes behind figures to suggest motion."

```text
Using <brand_spec> and <component_contract> above, build <SignalField>, the ambient layer behind <HeroKinetic>. It
must never compete with the headline.
Concept: noise becomes signal. Thousands of 2–3px specks (--ink on --paper, or --paper on --field) drift on a
flow-field, with faint ribbon strokes trailing the fastest. Over the first 100vh of scroll they organise into a rising
line built from the real points in {{FEATURED_METRIC_SERIES}}, then dissolve back to noise as the hero leaves.
Pointer: specks within 120px are pushed aside and spring back (spring.default), driven by the lerped pointer in the
one rAF loop. On touch, a gentle response to scroll velocity replaces the cursor effect.
Time of day: the tint shifts subtly with the visitor's local hour (4 preset mixes of --paper/--field), never dropping
headline contrast below WCAG AA.
Budget: Canvas 2D up to ~3,000 specks; WebGL points or instancing only above that. DPR ≤2 (1.5 mobile). Pause
off-screen and on hidden tab. Initialise after the headline paints. Specks, not bloom: no glow halos.
Fallback (no canvas/WebGL, or reduced motion): a static SVG poster rendered from the same code at its "signal"
state. Reuse it as the OG background (L29).
```

#### L7. The agency showreel film (rendered motion graphic) · Adapted

**Source:** @stephanlivera, https://x.com/stephanlivera/status/2103315922098470926 (full prompt; Max effort; ~17K likes)
> "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."

**Source:** @HO_BA, https://x.com/HO_BA/status/2103845264649761062 (full prompt; effort high)
> "Use actual product screenshot/logo/assets Must have music and motion must match the music Do it like a real professional production video, not like a demo or prototype. Add more animation and motion design; avoid using screenshots as raw; instead, break them down into components/icons so we can animate those too."

**Source:** @reflex_cloud, https://x.com/reflex_cloud/status/2103552840027304046 (full prompt)
> "open with a striking hook in the first second, build through a sequence of distinct techniques (typography, shape play, camera moves, colour shifts), and land on a clean, memorable final frame. Pacing should feel like it's cut to music."

**Source:** 0xMovez's "agency persona" variant, https://x.com/0xMovez/status/2104216919033192746
> "make a 30-second showreel as if you were a niche branding studio for startup founders… One accent color. Every shot is a different technique."

This is the one prompt that stays a video. It produces the file that L4 scrubs and that the hero's "Watch the reel" dialog plays.

```text
Using <brand_spec> above (motion tokens, bans and truth rules apply), act as a senior motion designer and make the
{{AGENCY_NAME}} showreel: a 30-second film plus 15s and 6s cut-downs. It plays muted on the homepage and with sound
in a dialog.
Sources of truth: {{CASE_STUDIES_DIR}} (real client creative, screenshots, results), {{LOGO_SVG}}, {{METRICS_FILE}}.
Use the real assets, but never as flat raw screenshots: break them into components, icons and layers so each can
animate. Show only numbers in {{METRICS_FILE}}. Credit work as "{{AGENCY_NAME}} for {{CLIENT}}" and never imply we
built the client's product.
Structure: a hook in the first second; one case study every 3–4s, each shown with a different technique (kinetic
type, shape morph, masked reveal, camera push through layered UI, a chart that draws itself). Use object-driven
transitions: a card becomes the next card, a chart line becomes a connector. Land on a still logo frame with
{{TAGLINE}} and {{URL}}, held ≥1s. Keep key content in a 9:16-safe centre area.
Motion: springs with a tiny overshoot at most; camera moves 1.5–3s on gentle curves; cuts on a 120 BPM grid; music
synthesized in code or {{MUSIC_FILE}}, mixed to -14 LUFS.
Render route {{RENDER_ROUTE}}: Remotion importing our CSS tokens and fonts, OR one HTML file with window.seek(t)
rendered by Playwright + ffmpeg. Every frame is a pure function of time: no CSS transitions, timers or Math.random.
Gate: first show 3 storyboard variants as one still per scene. Wait for my pick.
Self-review: render a contact sheet (one frame per beat) and a 360px phone test. Score 1–10 for hook, phone
readability, motion quality, variety, brand accuracy and sound sync. Fix the 3 worst issues. Repeat until every score
is ≥8, then do the full render.
Deliver: 1920×1080 and 1080×1920 H.264 (yuv420p) MP4s, a WebM, and a poster JPG from the strongest frame.
```

### Services: every transition demonstrates the service

#### L8. Services hover list with one morphing demo · Adapted

**Source:** @HowDevelop, https://x.com/HowDevelop/status/2103840883812733090 (full prompt; README-highlighted)
> "Every transition should visually demonstrate a feature, rather than simply replace one title card with another. Keep all on-screen wording brief and legible. Avoid generic stock footage, spinning logos, fake dashboards, excessive glitch effects, and tiny code nobody can read."

**Source:** @TheGrootDev, https://x.com/TheGrootDev/status/2103516567824966114 (full prompt)
> "Keep one persistent outer element throughout the sequence. Its internal artwork, labels, and controls may change, but the main silhouette must visibly connect every state."

```text
Using <brand_spec> and <component_contract> above, build <ServicesList> for {{SERVICES}} (e.g. SEO, Paid media,
Social, Content, CRO, Analytics).
Layout ≥1024px: a left column of large service rows (display type plus a one-line description) and a sticky demo
panel on the right. Below 1024px: rows become accordions and each demo renders inline under its open row.
Central rule: one shape, never cut. The demo panel is a single {{BRAND_SHAPE}} container that persists across
services. It morphs size, radius and colour to become each service's demonstration, and its silhouette visibly
connects every state. Each demo demonstrates the service rather than swapping a title card:
SEO: nodes link up and one page's authority bar fills as links arrive.
Paid media: a budget slider is dragged and channel bars reallocate.
Social: a post's engagement ticks up and it rises to the top of a feed.
Content: a headline rewrites itself word by word.
CRO: two page variants race and the winner grows into the panel.
Each demo is draw(p), p∈[0,1], driven by hover/focus dwell (0→1 over 1.2s; reverses smoothly when the pointer leaves).
Content enters after the container starts morphing and exits before the next morph.
Demo data illustrates the mechanism: label it "How it works" and never present it as a client result.
Touch: tapping a row opens it and plays its demo once. Reduced motion: each demo's final frame, instantly.
Avoid: identical icon cards, fake dashboards, stock footage, spinning logos, unreadably small text.
```

#### L9. Live backlink explainer for the SEO page · Adapted

**Source:** @stewchan2, https://x.com/stewchan2/status/2103542568361369810 (full prompt)
> "create an insightful, yet state of the art video visualization for how backlinks work for SEO"

**Source:** @ParkerRex, https://x.com/ParkerRex/status/2103206747846701462 (full prompt)
> "explain a token bucket rate limiter, canvas only, no libraries, every frame a pure function of time so my renderer can screenshot it."

**Source:** @AstroTheWizard, https://x.com/AstroTheWizard/status/2103629247751618782 (full prompt)
> "Where you can, simulate the real thing: the random walk should be an actual random walk, not a drawing of one."

```text
Using <brand_spec> and <component_contract> above, build <BacklinkExplainer> for the SEO service page: an insightful,
state-of-the-art visualization of how backlinks work. Canvas only, no libraries.
Simulate the real thing: run an actual simplified PageRank iteration on a 12–20-node graph, so authority values are
computed, not drawn. Node size = authority. Links show as flowing dashes in the link direction (no particles).
Four scroll steps (sticky canvas ≥1024px; stacked below), one formal idea each:
1) a new page with no links sits isolated;
2) links arrive from low-authority sites and give a small gain;
3) one link from a high-authority site gives a large gain, and the number updates;
4) a link farm adds many links for little gain: "Quality over quantity".
Every frame is draw(p), with p = scroll progress: a pure function, no timers, no state between frames, so it scrubs
both ways. Add exportPNG(p) for social stills.
One short caption per step, readable at 375px. Footnote: "Simplified model; real ranking uses many more signals."
Reduced motion: four static diagrams with captions. Each step has a text description for screen readers.
```

### Work and case studies: real captures, shared-element transitions

#### L10. Work grid with breakout cards and a shared-element transition · Adapted

**Source:** @pankajkumar_dev, https://x.com/pankajkumar_dev/status/2103502614134718609 (full prompt; README-highlighted)
> "create a motion design video of a poster breaking out of its own frame."

**Source:** @daniel_haida, https://x.com/daniel_haida/status/2104139720829636937 (partial entry; ~15,000-character prompt quoted in the post)
> "Prefer object-driven transitions: a card becomes the next card, a chart line becomes a connector … I want transitions that make the viewer think: "Of course the next scene came from that.""

**Source:** @brainextends, https://x.com/brainextends/status/2103801834930606193 (full prompt)
> "Use match-position transitions, coordinated scaling, masked reveals, and perspective Outgoing titles must disappear before incoming titles occupy the same space"

```text
Using <brand_spec> and <component_contract> above, build <WorkGrid> and its transition into <CaseStudyHero>.
Grid: 6–9 projects from {{CASE_STUDIES_DIR}} (client, category, one real headline result, cover layers). Use an
asymmetric grid with spans by importance, not identical cards.
Governing idea: the creative breaks out of its own frame. Each cover has a clipped background plate and a separate
cut-out foreground layer. On hover or focus, the plate scales to 1.03 inside its clip while the cut-out moves −4% y
and scales to 1.08 past the card edge, revealing a pre-rendered offset shadow (fade a shadow layer; never animate
box-shadow). 400ms, spring.default; reverses smoothly mid-way. On desktop, the cursor becomes a {{BRAND_SHAPE}} label
reading "View case".
Transition: a click performs a shared-element transition in which the cover becomes the case-study hero (View
Transitions API with a view-transition-name per card; Motion layoutId in React). The card title exits masked in 200ms
before the hero title enters. Total ≤500ms; Back interrupts it. Cross-document transitions are progressive
enhancement, so Firefox gets a normal navigation.
Touch: no breakout; tap navigates. Reduced motion: no breakout; 150ms fade between pages.
```

#### L11. Case-study showcase from real captures · Adapted

**Source:** @wani_shola, https://x.com/wani_shola/status/2103769906638459278 (full prompt; README-highlighted)
> "Use as much of the real website as possible: capture the pages and sections in a browser (home, Ask, package pages, Hire, mobile view, dark mode) and animate them inside browser and phone frames. … Use only facts and numbers that are on the site."

**Source:** @twoclipping, https://x.com/twoclipping/status/2102554209166000267 (full prompt)
> "the hero in a phone next to a panel that flips into results, big stats on push cuts … Never set opacity or filter on a preserve-3d element, because it flattens and both faces show. Fade its wrapper instead."

```text
Using <brand_spec> and <component_contract> above, build <CaseStudyShowcase> for {{CASE_ID}}.
Assets: with Playwright, capture {{CLIENT_URL}} at 1440 and 390 wide (full-page desktop, full-page mobile, and 3–4
key sections) into /content/{{CASE_ID}}/captures, and list what you captured. Split the hero capture into layers (nav,
headline, product image, CTA) so they move independently. Never redraw the client's UI from imagination.
Section (≥1024px, sticky, 200vh): a browser frame and a phone frame side by side. As it scrolls, the phone scrolls
through the real mobile capture, while the browser layers separate in depth by ≤12px and settle.
At p≈0.6 the panel beside the phone flips (rotateY 180°, spring.heavy) into a results card showing 2–3 metrics from
/content/{{CASE_ID}}/metrics.json, each with its period and source. Only numbers from that file.
Gotcha: never set opacity or filter on a preserve-3d element; fade its wrapper instead.
Credit: "{{AGENCY_NAME}} for {{CLIENT}}", subordinate to the client's brand.
Below 1024px, and under reduced motion: static frames stacked, with the results card face-up.
```

### Results: numbers that resolve, charts that draw real data

#### L12. Results band with a self-drawing growth chart · Synthesized from fragments (gap: no corpus prompt for a standalone growth chart)

**Fragment:** @daniel_haida, https://x.com/daniel_haida/status/2104139720829636937
> "The hero financial number resolves crisply. The chart draws in. Supporting metrics settle slightly later. Use subtle stagger."

**Fragment:** @twoclipping, https://x.com/twoclipping/status/2103273003555402193
> "the tabs open into a chart that draws itself, with a tooltip on hover"

**Fragment:** @AstroTheWizard, https://x.com/AstroTheWizard/status/2103629247751618782
> "Include real numbers … and be honest about uncertainty in the estimates."

This prompt deliberately avoids the "big number with a small label… and a gradient accent" treatment that Anthropic's skill flags as a default.

```text
Using <brand_spec> and <component_contract> above, build <ResultsBand>, the outcomes proof for {{AGENCY_NAME}}.
Data: {{METRICS_FILE}} entries {client, metric, before, after, period, source, series[]}. Render only what is there.
Layout: NOT a big number + small label + gradient. One featured result is written as a sentence with the number
inline in display type ("{{CLIENT}} grew qualified leads from 140 to 410 a month in 6 months"), beside a line chart of
its real series. Below it, 3–4 secondary results as compact rows, each with a sparkline.
Motion (once, at 30% in view): the featured number resolves first, rolling from before to after in 900ms
(--ease-out), with tabular-nums and its width reserved. The line then draws left to right (SVG stroke-dashoffset on a
path computed from the real points, 1200ms, --ease-in-out). The area under the line fades to 12% --signal after the
line passes. Annotation pins ("campaign launch", "new landing page") pop in with spring.snappy as the line reaches
their x. Secondary rows settle 150ms later, 60ms stagger.
Chart hover/focus: a crosshair snaps to the nearest real point, with a tooltip showing value and date; arrow keys step
through points.
Honesty: show period and source under every metric. Show estimates as bands, not points. The y axis starts at 0
unless clearly labelled. No truncation that exaggerates growth.
Reduced motion: final numbers and the full chart immediately; tooltips still work.
A11y: a visually hidden <table> per chart and an aria-label summarising the trend.
```

### Client logos: a quiet marquee or a flocking mosaic

#### L13. Client logo marquee · Synthesized (gap: no corpus prompt)

**Fragment:** @AnnaCher___, https://x.com/AnnaCher___/status/2103571096549433425 (full prompt)
> "Connect ad account (Meta, Google, LinkedIn, TikTok, Reddit logos) → loader → check"

That line is the only logo row in the corpus. The third-party platform names become `{{PLATFORM_PARTNER_BADGES}}`.

```text
Using <brand_spec> and <component_contract> above, build <LogoMarquee> from {{CLIENT_LOGOS_DIR}} (SVGs used with
permission), plus an optional second row of {{PLATFORM_PARTNER_BADGES}}.
CSS only: each row's track holds the logo list twice (the duplicate aria-hidden), animated with @keyframes
translateX(0 → −50%) at constant velocity. Linear is correct here. Row 1 runs ~50s per loop; row 2 ~65s in the
opposite direction. Fade the edges with mask-image on the container.
Optical sizing: normalise logos to equal visual area, not equal width; monochrome --ink by default.
Interaction: hover or keyboard focus on a row pauses it (animation-play-state). The hovered or focused logo shifts to
its original colours over 200ms. A logo is a link only if a case study exists.
Reduced motion: no movement; a centred, wrapped static grid. Screen readers get the client list once, as text.
Don't: speed up on scroll, 3D tilt, glow, or recolour the whole row at once.
```

#### L14. Tile-flock client mosaic (bold alternative) · Adapted

**Source:** @zeezomb, https://x.com/zeezomb/status/2102906701552726206 (full prompt)
> "Make an 80 second square animated film as a single HTML file, using WebGL2 and plain JavaScript, with no libraries and no image, font or audio files. It should look like a glass and gold leaf wall mosaic whose tiles were never glued down, so they can lift, flip, fly and click back into place. Figures are flocks of tiles, so a fish swims by its tiles swimming."

```text
Using <brand_spec> and <component_contract> above, build <ClientMosaic>, a bolder alternative to the marquee. Use it
only if the L0 plan makes this the signature moment.
Concept: a wall mosaic whose tiles were never glued down, so they lift, flip, fly and click back into place. Figures
are flocks of tiles: each client logo forms from its tiles flocking.
A grid of square tiles (12–18px desktop; fewer and larger on mobile) with --paper, --ink and --field faces. At 30% in
view, tiles flock into the first logo from {{CLIENT_LOGOS_DIR}} (sample each SVG into the tile grid at build time),
hold 2.5s with the client name as real text beneath, then lift, flip (a face swap mid-rotation, spring.default) and
fly into the next logo, clicking into place with a tiny overshoot at most. Hovering a tile tips it 15° toward the
pointer.
Implementation: Canvas 2D up to ~2,000 tiles, else WebGL2 instanced quads; no libraries; seeded flight paths.
Pause off-screen and on hidden tab. Run one cycle through all logos, then rest on the agency mark with a "Replay"
button; no endless loop.
Reduced motion: a static logo grid. Screen readers get a plain list of client names.
```

### Process: one shape, never cut, driven by scroll

#### L15. Scroll-driven process story · Adapted

**Source:** @verbove, https://x.com/verbove/status/2103483957266268381 (full prompt)
> "One HTML file. One canvas One draw(t) function No CSS transitions No timers No state carried between frames One shape, never cut … Real UI. Real data. No placeholders. … Content enters after its container starts morphing and leaves before the next morph so text never overlaps."

**Source:** @charlesmendez, https://x.com/charlesmendez/status/2102847039415476517 (full prompt)
> "an example of a user creating a chatgpt ads campaign, then connecting their metrics, understanding attribution, then connecting a voice agent to it, the agent responding, then doing follow up, adding humans in the loop and then providing analytics."

That is the corpus's only marketing-pipeline narrative. Here it supplies the stage logic.

```text
Using <brand_spec> and <component_contract> above, build <ProcessStory> for {{PROCESS_STEPS}} (e.g. 01 Audit,
02 Strategy, 03 Build, 04 Launch, 05 Optimise). Numbered labels are allowed here because this is a real sequence.
Central rule: one shape, never cut. A single {{BRAND_SHAPE}} persists through every step, changing size, radius and
colour while its content swaps:
Audit: a scanning loader sweeps a real client-site thumbnail and drops 3 issue pins.
Strategy: it stretches into a channel tab bar whose indicator's leading edge rides a faster spring than its trailing
edge.
Build: it widens into a landing-page wireframe whose blocks assemble.
Launch: it collapses into a toggle that flips to "Live".
Optimise: it opens into a chart that draws itself, with a tooltip on hover.
Architecture: one draw(p) function, where p is scroll progress through the section (CSS view timeline inside
@supports, else ScrollTrigger scrub 0.5). Inside the stage: no CSS transitions, no timers, no state carried between
frames, so it scrubs backwards cleanly. Content enters after its container starts morphing and leaves before the
next morph.
Layout ≥1024px: pinned stage left, step copy right. Each step is a focusable h3, and focusing it scrolls it into view
without trapping. Below 1024px: no pin; stacked cards, each showing its step's final frame.
Real UI, real data: thumbnails and deliverables from {{CASE_STUDIES_DIR}}; no placeholders.
Reduced motion: no scrub; the stage snaps to each step's final frame at step boundaries.
```

### Testimonials: verbatim quotes, no auto-advance

#### L16. Testimonial quote deck · Synthesized from fragments (gap: no corpus prompt)

**Fragment:** @Bilimfili1, https://x.com/Bilimfili1/status/2103743617848459762 (full prompt)
> "Nothing made up: every number and label on screen comes from the recordings… Let viewers follow: each feature stays on screen for at least 2.5 seconds."

```text
Using <brand_spec> and <component_contract> above, build <TestimonialDeck> from {{TESTIMONIALS_FILE}} (quote, name,
role, company, logo, photo, permission). Quotes are verbatim: never edit, shorten or invent. Skip entries without
permission.
One testimonial at a time in large display type; the opening quote mark is the {{BRAND_SHAPE}}. On entering view and
on each change, the quote reveals line by line through masks (lines rise 100% to 0, 600ms --ease-out, 80ms stagger);
the attribution fades in 200ms after the last line.
Navigation: previous/next buttons; arrow keys when focused; and a drag on the card stack (cards beneath peek with
2–3° rotation). Dragging past 30% of the width advances; otherwise the card springs back from where it was
(spring.default).
No auto-advance by default. If {{AUTO_ADVANCE}} is on: dwell = max(6s, 250ms × word count), a visible pause button,
and pause on hover, focus and off-screen.
Markup: <figure><blockquote><figcaption>, with one aria-live="polite" region for changes.
Reduced motion: 150ms crossfade, no drag physics.
Avoid: carousels of identical cards, five-star rows, stock avatars.
```

#### L17. Video testimonial edit · Adapted

**Source:** @sab8a, https://x.com/sab8a/status/2103144778481475686 (full prompt; README-highlighted)
> "Cut a raw talking-head clip into a punchy, fun edit with subtitles, graphics and music"

**Source:** @l3d1c, https://x.com/l3d1c/status/2104649028193632524 (partial; post text)
> "Captions are measured in the real font and shrink to fit the 9:16 safe zone, so nothing hides under TikTok's buttons."

```text
Using <brand_spec> above (motion tokens and bans apply), cut {{CLIENT_CLIP}}, a raw talking-head testimonial, into a
30–45s edit with kinetic captions, light graphics and music, for the testimonials section and for social.
Nothing made up: every on-screen word comes from the transcript; every number comes from {{METRICS_FILE}}. Each key
line stays on screen ≥2.5s.
Captions: measured in {{TEXT_FONT}} and shrunk to fit the safe zone of each output (16:9 site; 9:16 and 1:1 social),
never under platform UI. One --accent emphasis word per caption.
Graphics: the client logo traced to SVG (not redrawn), one lower-third, and at most two metric callouts that build in
on a beat. Music ~100–120 BPM, cut on the beat, ducked under speech; no whooshes or risers.
Route: Remotion, or seek(t) + Playwright + ffmpeg. Render a contact sheet first and check for clipped captions,
overlap and single-frame pops. Then deliver MP4s, a WebVTT file and a poster frame.
On the site: <video muted playsinline controls> with captions on by default; no autoplay under reduced motion.
```

### About and team: manifesto as architecture, portraits in two inks

#### L18. Architectural manifesto · Adapted

**Source:** @Gdgtify, https://x.com/Gdgtify/status/2103458245213929495 (full prompt)
> "CENTRAL VISUAL RULE Words have assigned architectural roles. WAIT is a lintel. WAITING is a suspended load. VOICE is a support. ROOM is an opening. FLOOR is a platform. These roles must emerge from the actual letterforms, not from separate illustrations placed behind text. […] Allow at least one 400ms moment of absolute stillness."

**Source:** @alex_prompter, https://x.com/alex_prompter/status/2103499977632997524 (full prompt), useful for ordering the manifesto lines
> "5 scenes. The customer's problem, what I do, how it works in 3 steps, one proof point, and my name at the end."

```text
Using <brand_spec> and <component_contract> above, build <Manifesto> for the About page from {{MANIFESTO_LINES}}
(4–5 locked lines, ordered: the client's problem, what we do, how, one proof, our name).
Central visual rule: words have assigned architectural roles. {{WORD_A}} is a lintel the next line rests on;
{{WORD_B}} is a support column; {{WORD_C}} is an opening through which a team photo appears; {{WORD_D}} is a platform
the CTA stands on. These roles must emerge from the actual letterforms, not from illustrations behind the text. Use
real glyph paths for structural words (converted at build time), preserve counters and legibility during
deformation, and never interpolate arbitrary path points.
Drive it with scroll progress through a 250vh sticky section (≥1024px). Each line assembles, its structural word
deforms into its role, and the layout settles. After each line becomes readable, hold at least 400ms of absolute
stillness. Never destroy a line before it can be read.
Type: {{DISPLAY_FONT}} for structural words; {{TEXT_FONT}} for the rest.
Mobile and reduced motion: the final composition as static SVG.
A11y: the manifesto exists once as plain text (h2 + paragraphs); the SVG composition is aria-hidden.
```

#### L19. Team grid in risograph duotone · Synthesized from fragments

**Fragment:** @rneayan, https://x.com/rneayan/status/2103401006281441493 (full prompt)
> "make about my studio with Risograph style"

**Fragment:** Muzli, https://muz.li/blog/claude-opus-5-5-for-designers/ (vendor blog; describes the model's output)
> "risograph-style album covers (2-color SVG with registration misalignment and paper grain texture)"

```text
Using <brand_spec> and <component_contract> above, build <TeamGrid> from {{TEAM_FILE}} (name, role, photo, one human
fact).
Style: risograph. Render each portrait as two flat ink layers (--ink plus --field or --accent) via an SVG
feColorMatrix duotone, with a static paper-grain overlay (≤2% opacity) and a 1–2px registration offset between
layers. Pre-render the duotones at build time if the live filter costs more than 2ms per frame on a mid-range phone.
Hover or focus: the top layer slides a further 2–3px out of register (transform only), the portrait tilts ≤3°, and the
person's fact rises in under their name (masked, 300ms). Touch: tap toggles the fact.
Grid: varied sizes (founders larger), not identical cards; a single once-only reveal for the whole grid, nothing more
on scroll.
Reduced motion: no offset or tilt; facts always visible. Alt text gives name and role.
```

### CTA and contact: one magnetic button and a submit that morphs

#### L20. Contact form submit flow · Adapted

**Source:** @twoclipping, https://x.com/twoclipping/status/2103273003555402193 (full XML template)
> "Button → loader → check → dynamic island → … → toast → back to the button." … "Drags are direct manipulation: while the cursor is held, the value is computed from its position. On release it springs back from wherever it was."

**Source:** @op7418, https://x.com/op7418/status/2103724883301814408 (full prompt, Chinese; translation from the research notes)
> "The animation state machine must be rigorous: ignore clicks during playback, no swallowed clicks or corrupted state."

```text
Using <brand_spec> and <component_contract> above, build the submit flow for <BriefForm> in the contact section.
One shape, never cut: the submit button is the only element that changes. States: idle → validating → sending →
success | error.
Idle: a real <button type="submit"> labelled "{{CTA_LABEL}}". On submit, the label exits masked (150ms) and the button
morphs into a circle (FLIP: measure, then animate transform, never width). A loader ring draws inside it. On server
success the ring resolves into a check (300ms stroke draw), then the shape expands into a confirmation that names the
action: "Brief received, {{FIRST_NAME}}. {{AGENCY_NAME}} replies within {{SLA}}." Springs, tiny overshoot at most.
Error: the circle returns to button form and the message appears under the failing field. No shake.
State machine: ignore clicks while a transition runs (no swallowed or double submits); cancel and zero every looping
tween on each state change. With JS off, use a normal POST and a server-rendered thank-you page.
A11y: status changes announced via aria-live="polite"; focus moves to the confirmation heading.
Reduced motion: no morph; text and icon change in place with a 120ms fade.
```

#### L21. Magnetic CTA block · Synthesized from fragments (gap: no corpus prompt for magnetic buttons)

**Fragment:** @BThreeAgency, https://x.com/BThreeAgency/status/2103739079745827092 (full prompt)
> "Treat the badge as a solid 3D object that tilts toward the cursor following the rules of physics. Keep it fast and smooth, it should not be bouncy."

```text
Using <brand_spec> and <component_contract> above, build <MagneticCTA>: the closing block, with an oversized line
"{{CTA_HEADLINE}}" (e.g. "Let's grow something measurable") and one primary button "{{CTA_LABEL}}".
Button physics: treat it as a solid object. Within 120px of the pointer it moves toward the pointer by up to 8px and
tilts ≤4° toward it; its label moves 1.4× as far, for depth. Fast and smooth, not bouncy: spring.snappy, no visible
overshoot. On leave it springs back from wherever it was.
Implementation: pointermove only writes the target to a ref or CSS variable; the single rAF loop applies the
transform. Disabled on (hover: none), (pointer: coarse) and reduced motion.
Keyboard: :focus-visible gives the same "attracted" state, centred, plus the standard focus ring.
Headline: words rise once at 40% in view (700ms, --ease-out, 60ms stagger); then the accent word fills with --accent
left to right via clip-path.
This is the site's only magnetic element. No cursor trails, glows or particle bursts.
```

#### L22. Free-audit score reveal (conversion moment) · Adapted

**Source:** @op7418, https://x.com/op7418/status/2103724883301814408 (full prompt, Chinese; translation from the research notes)
> "Make it a single-file web page (HTML + CSS + JS) that plays in full with one click … [Rhythm: five phases, none optional] 1. Ready: idle float, a shake every few seconds hinting it's clickable … Must work at phone width; respect the reduce-motion setting … ignore clicks during playback … Target 60fps. First load must show the full idle scene, never blank."

The source is a mobile-game reward sequence with bloom, screen shake and confetti. The adaptation keeps the anticipation, charge, reveal and settle rhythm, plus the robustness rules, and drops the effects the brand spec bans. The "micro-breath" scale comes from [@techhalla](https://x.com/techhalla/status/2103411244468498547).

```text
Using <brand_spec> and <component_contract> above, build <AuditReveal>. After a visitor submits their URL to the free
{{AUDIT_NAME}}, it reveals their score and top three findings. Keep a five-phase rhythm, restyled for a premium brand:
1) Ready: the score dial idles with a slow breathing scale (1.000→1.012→1.000 over 3s) and a "Run my audit" hint.
2) Progress: each completed check (speed, SEO, tracking, conversion) ticks one dial segment with a short spring and
   updates its label.
3) Charge (~1s): segments tighten and the needle hesitates near the final value. Anticipation, not shake.
4) Reveal: the score counts up to its real value (tabular-nums), a --accent flood fills behind it, and three finding
   cards arrive on short arcs with ≤2% overshoot.
5) Settle: the score flies into a sticky "Your report" chip in the nav, which bumps once on arrival.
Rules: the state machine ignores input during playback; every looping tween is cancelled and zeroed on state change;
first paint shows the full idle dial, never blank; 60fps on a mid-range phone; no audio. Scores come from real checks.
If this is a demo, label it "Example audit".
Reduced motion: skip phases 3–5 animation; show the score, findings and chip immediately.
Banned here: confetti, screen shake, bloom flashes, coin or gem effects.
```

### Footer: a wordmark that stretches into place

#### L23. Variable-font wordmark sign-off · Synthesized from fragments

**Fragment:** @twoclipping, https://x.com/twoclipping/status/2103835273813496100 (full prompt)
> "Wordmark squeeze: every letter moves toward the dot by the same factor and its drawn width follows (narrow the wdth axis, scale the rest), so the letters stay touching"

**Fragment:** @daniel_haida, https://x.com/daniel_haida/status/2104139720829636937
> "The final frame must have enough stillness to register."

```text
Using <brand_spec> and <component_contract> above, build <SiteFooter>.
Sign-off: the {{AGENCY_NAME}} wordmark set edge to edge in {{DISPLAY_FONT}} (variable, with a wdth axis). As the footer
enters (the last 60vh of scroll), the wordmark expands from a squeezed state to full width. Every letter moves by the
same factor and its drawn width follows the wdth axis, so the letters stay touching. Then it holds still: the final
frame needs enough stillness to register. If the font has no wdth axis, scaleX each letter span instead.
Note: animating font-variation-settings re-lays out text every frame. That is fine for one wordmark and never for
paragraphs; run it inside the shared rAF loop.
Utilities: contact email with copy-to-clipboard (the label swaps to "Copied" with a 150ms masked swap); {{CITY}} local
time, updated each minute; social and legal links. Links underline-draw on hover/focus (scaleX from the left, 200ms).
Reduced motion: the wordmark is static at full width.
```

### Graphic assets: one primitive feeds icons, illustrations, backgrounds and OG cards

Opus 5.5 can produce a site's whole asset kit in code. One creator's drink-brand build "generated all the svgs - Built the can in 3D - Painted its own labels and then rendered those to make product photo variations" in a single prompt ([@per_simmons_](https://x.com/per_simmons_/status/2103208157308944727)). There are documented limits. Claude does poorly at photorealism, painterly texture, busy organic scenes and natural lighting, and changing "one thing per message" works better than regenerating ([Analytics Vidhya](https://www.analyticsvidhya.com/blog/2026/06/claude-image-generation/)). Agency photography should therefore come from shoots or an image model, and every vector asset should derive from the L24 primitive.

#### L24. Brand mark / primitive SVG · Adapted

**Source:** Ciyo, https://ciyo.ai/blog/claude-opus-5-5-svg-logo (vendor blog)
> "Design a simple logo mark for Kettle & Crumb, a neighbourhood bakery. Draw it as one SVG file: a kettle whose steam curls up into an ear of wheat. Use exactly two flat colours, charcoal #2B2A28 and amber #C47A1C, on a transparent background. No gradients, no filters, no text."

In Ciyo's test, the first output had a spout that "floated apart", and at 32 px "seven overlapping grain ellipses merged into one orange blob". One feedback round fixed both.

```text
Using <brand_spec> above, design {{AGENCY_NAME}}'s brand primitive: the one shape the site reuses (preloader, cursor
label, quote mark, loader, divider, process stage).
Draw it as one SVG file: {{MARK_CONCEPT}} (e.g. "a signal line that steps upward and closes into a speech-bubble
corner"). Use exactly two flat colours, --ink {{INK_HEX}} and --accent {{ACCENT_HEX}}, on a transparent background.
No gradients, no filters, no text. At most 12 shapes on a 48-unit grid with integer coordinates.
Then render it at 16, 32, 64 and 256px on --paper and on --field, and look at the renders. Fix any part that floats
apart and any shapes that merge into a blob at 32px. Report the shape count and bytes before and after.
Export: mark.svg; a single-path version for clip-path/mask; a component that uses currentColor; and a stroke-only
version for the L1 preloader draw-on. If {{LOGO_SVG}} exists, derive the primitive from it; never redraw the logo.
```

#### L25. Service icon set · Adapted

**Source:** Analytics Vidhya, https://www.analyticsvidhya.com/blog/2026/06/claude-image-generation/
> "Give me a flat weather icon set: sun, cloud, rain, snow, lightning. Keep one consistent style."

```text
Using <brand_spec> above, create the service icon set in one pass, so every icon shares weight and spacing:
{{ICON_LIST}} (e.g. SEO, paid search, paid social, content, email, CRO, analytics, brand).
Specs: 24×24 viewBox, 2px safe padding, stroke 1.5, stroke="currentColor", fill="none", round caps and joins, no
transforms, coordinates on integer or .5 values, consistent optical size. Borrow angles and radii from the L24
primitive where it reads naturally.
Output: individual optimised SVGs, a sprite, and /brand/icons.html showing them at 16, 24 and 48px on light and dark.
Screenshot the sheet, list any icon whose weight or size differs, and fix it.
Motion variant: an optional 400ms draw-on (stroke-dashoffset, --ease-out) triggered by the parent link's hover or
focus; none under reduced motion. Icons are aria-hidden when paired with text.
```

#### L26. Spot illustration set · Adapted

**Source:** Claire Vo via ChatPRD "How I AI", https://www.chatprd.ai/how-i-ai/workflows/claude-opus-5-5-svg-illustrations (vendor-hosted)
> "Make three SVG illustrations of characters with three different sort of, um, faces or emotions on them."

```text
Using <brand_spec> above, make {{K}} spot illustrations together, so they share line weight, density and character
design: {{SCENES}} (e.g. "a marketer buried in dashboards", "the same person seeing one clear chart", "a team at
launch", an empty state "no results yet", a 404 "lost signal").
Style: {{ILLUSTRATION_STYLE}} (e.g. editorial single-line with flat accent fills). Palette: only --ink, --paper,
--field and --accent, with at most 3 per illustration; flat fills; 2px stroke; no gradients, text, raster, photoreal
or painterly effects. viewBox 0 0 480 360.
Structure for later animation: named layer groups (bg, mid, figure, detail), with ids prefixed ill-{name}- so inlined
SVGs never collide.
Decorative ones are aria-hidden; meaningful ones get a <title>.
Review: render all of them on one sheet, check faces, hands, stroke ends and colour proportions for consistency, and
fix outliers before delivering.
```

#### L27. Brand shape library and case-study cover template · Synthesized from fragments

**Fragment:** @techhalla, https://x.com/techhalla/status/2103411244468498547
> "A thick magenta bar and a thin acid green rule form an L-bracket mark (custom, not a logo download)"

**Fragment:** @brainextends, https://x.com/brainextends/status/2103801834930606193
> "designed playlist sleeves… finished graphic-design covers, with bold typography and simple geometric motifs"

The techhalla colours are swapped for tokens, because that palette sits in Anthropic's near-black-plus-acid-green cluster.

```text
Using <brand_spec> above, build the brand shape library from {{SHAPE_GRAMMAR}} and the L24 primitive.
1) Derive 6–8 primitives (e.g. bar, rule, bracket, quarter-circle, step, notch). Custom geometry, not icon downloads.
2) Compose 3 hero arrangements for section backgrounds and 1 seamless tile (SVG <pattern>), using tokens only.
3) Make a case-study cover template: a two-colour SVG cover with bold {{DISPLAY_FONT}} type, one motif from the
   library, a 2–3px registration offset between the colour layers, and a static paper grain. Parameters: client name,
   category, and one real result.
Export every shape as a component taking className and colour props mapped to CSS variables, with stable ids per
sub-shape so it can later stroke-draw, morph or parallax.
Show everything on /brand/shapes.html and flag any arrangement that drifts toward banned defaults (blobs, gradient
washes, glassmorphism, broadsheet hairlines).
```

#### L28. Shader gradient background · Synthesized from fragments (gap: the corpus has 0 "animated background" prompts)

**Fragment:** @zeezomb, https://x.com/zeezomb/status/2102906701552726206
> "using WebGL2 and plain JavaScript, with no libraries and no image, font or audio files"

**Fragment:** @brainextends, https://x.com/brainextends/status/2103801834930606193
> "a soft atmospheric green background: luminous emerald near the upper-left corner, deeper forest green toward the sides, fading to near-black at the bottom"

```text
Using <brand_spec> and <component_contract> above, write brand-bg.js: a vanilla ES module with no dependencies, ≤6KB
minified, that mounts one <canvas> behind any element carrying data-brand-bg.
Look: a soft atmospheric field. --field glows luminous near one corner, deepens toward the edges and fades to --ink at
the bottom, built from slow fbm noise in one fragment shader. Colours come from CSS variables (--field, --paper,
--accent, with accent ≤10% of the area). No purple-to-blue, no neon, no gradient text over it.
Motion: period ~16s via uTime. uIntensity scales by section (hero 1.0, content sections 0.3). Optional pointer
influence bends the flow by ≤5% through a lerped uniform.
Budget: devicePixelRatio capped at 2 (1.5 on mobile); ResizeObserver; pause when off-screen (IntersectionObserver)
and when the tab is hidden; initialise after first paint.
Fallback: if WebGL context creation fails, or under prefers-reduced-motion, render a static CSS layered gradient in
the same colours. Export a poster PNG from the shader at a chosen t for OG images and the reduced-motion state, so
the static and moving versions match.
Markup: aria-hidden="true", pointer-events: none. Text above it must keep WCAG AA contrast on every frame; test the
worst frame.
```

#### L29. Open Graph images · Synthesized

**Basis:** Next.js ImageResponse docs, https://nextjs.org/docs/app/api-reference/functions/image-response
> "Only flexbox and a subset of CSS properties are supported… `display: grid` will not work"

The same docs set a 500KB bundle cap (fonts and images included) and a 1200×630 default, and require ttf, otf or woff fonts.

```text
Using <brand_spec> above, build Open Graph images.
Next.js: app/opengraph-image.tsx, plus a per-route opengraph-image.tsx for each case study, using ImageResponse from
next/og at 1200×630. Flexbox only (display: grid will not work). Load {{DISPLAY_FONT}} and {{TEXT_FONT}} as local
.ttf/.otf files. Colours from tokens. Inline the L24 primitive SVG. Keep the total under 500KB.
Template: title (≤60 characters) in display type; client and category; one real result if it exists in
metrics.json; the primitive bottom-right; the L28 poster PNG (or flat --field) as background.
Vanilla/static alternative: a build-time Node script using Satori that writes /og/*.png from the same template.
Render the home OG and two case-study OGs, view each at 1200×630 and at a 600px preview, and fix any clipped or
low-contrast text.
```

#### L30. Brand reference sheet · Synthesized

```text
Using <brand_spec> above and every asset approved so far, build /brand/reference.html: palette swatches with
contrast ratios, the type scale, the icon sheet, illustration thumbnails, shape primitives, the mark at every size,
and live demos of each motion token (ease curves plotted, springs animating a square, durations side by side, and a
10%-speed toggle).
From now on, every asset or component prompt ends with: "Match /brand/reference.html. Screenshot your new work next to
it and list deviations before finishing."
```

## Workflow: pick the stack, ration effort, make Claude watch its own output

### Stack: vanilla for speed, Next.js when tokens and transitions must travel

Left alone, Opus 5.5 builds zero-dependency single files ([@__morse](https://x.com/__morse/status/2103485566570369333)). For the agency site, the choice should follow the content model rather than the model's instinct. Choose **Next.js App Router with Tailwind** for any of these: case studies that will grow; per-route OG images through `ImageResponse`; shared-element transitions through Motion `layoutId`; or a Remotion showreel that imports the site's own tokens. One creator's Remotion ad "imports my site's CSS tokens and fonts, so it uses the same design system as the site" ([@l3d1c](https://x.com/l3d1c/status/2104649028193632524)). Choose **vanilla** for a small static site where every kilobyte is visible and Claude's default path is an asset. Either way, never stack Motion, GSAP, Lenis and Three.js on one page unless each earns its bytes. Muzli's demos show the model making these picks itself: GSAP ScrollTrigger with Lenis for scroll narratives, Motion springs for interruptible gestures, and raw WebGL for the water hero ([Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/)).

| Job | Tool | Licence and support (Oct 2026) |
|---|---|---|
| Hover, focus, marquees, borders | CSS transitions, `@keyframes`, `@property`, `linear()` | `linear()` in Chrome 113, Firefox 112, Safari 17.2 ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/types/easing-function.json)) |
| Unpinned scroll reveals and parallax | CSS `animation-timeline: view()` in `@supports`, with an IntersectionObserver fallback | Chrome 115+, Safari 26; Firefox preview only ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json)) |
| Pinned or scrubbed stories, SplitText, SVG draw/morph | GSAP + ScrollTrigger (+ Lenis) | 100% free including all plugins since 3.13 ([GSAP](https://gsap.com/blog/3-13/)); Lenis honours reduced motion by default ([Lenis](https://github.com/darkroomengineering/lenis)) |
| React springs, gestures, layout | Motion with `MotionConfig reducedMotion="user"` | MIT ([Motion](https://motion.dev/docs/react-accessibility)) |
| Page transitions | View Transitions API | Same-document Baseline since Firefox 144 ([web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)); cross-document Chrome 126 and Safari 18.2, not Firefox ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/view-transition.json)) |
| Real 3D | Three.js, or R3F with `frameloop="demand"` | Keep draw calls to "a few hundred or less" ([R3F](https://r3f.docs.pmnd.rs/advanced/scaling-performance)) |
| Showreel and testimonial films | `seek(t)` + Playwright + ffmpeg, Remotion (`npx skills add remotion-dev/skills`), or HyperFrames | [Remotion](https://www.remotion.dev/docs/ai/skills); [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache 2.0) |

Copy-paste galleries (React Bits, Aceternity, Magic UI) are useful parts bins, but audit them first. One comparison reports that the two Motion-based galleries lacked `prefers-reduced-motion` handling as of March 2026 ([PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026)).

### Effort: medium for routine work, higher only for the signature moment

Anthropic's guidance is conservative. Opus 5.5 defaults to `medium`, which "matches or exceeds Claude Opus 5 at `high`" on coding evals, and `xhigh`/`max` should be reserved "for work where you've measured a quality gain" ([Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)). Video creators push harder. "Every viral one-shot in the list ran on xhigh or max", and 0xMovez advises xhigh for new films and max "when the first 3 seconds have to carry a launch" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). John Heibel finds that "the reasoning level corresponds to how 'extravagant' and detail-oriented the model makes the scene" ([ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)). Muzli lands in between: "Medium default; high for hero moments; max reserved for measured quality gains". It also reports, secondhand, a max-effort attempt that ran 20 minutes, cost $2.56 and "returned nothing" ([Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/)). The practical split for this library: medium for L8–L30 and for every fix round; high or xhigh for L0, L3 (or whichever section owns the signature moment) and L7; max only after a side-by-side shows it helps.

### Loops: plans before code, screenshots before sign-off

Two habits do most of the work. The first is a gate. @twoclipping's template ends "show me the state list on the beat grid before you write any code" ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)). Asking for "3 storyboard variants" and "one still frame per scene before anything moves" is cheaper than fixing a render ([@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)). The second is a critique loop that runs on images, not code. Opus 5.5 "reads screenshots more accurately" than Opus 5 ([Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)), and the frontend-design skill tells Claude to "Critique your own work as you build, taking screenshots" ([SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)). Muzli's web build ran "four rounds of screenshots and fixes" with a browser attached through `claude --chrome`, and asked for motion reviews at 10% speed ([Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/)). One fire-simulation film went through about 40 vision-model critiques that caught "a flame that kept dying" ([@NathanWilbanks_](https://x.com/NathanWilbanks_/status/2103881538592981110)). The prompt below adapts 0xMovez's contact-sheet critique for components. Paste it after any first build ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).

```text
Open the screenshots at 375, 768 and 1440 and the 10%-speed recording of each animation, and look at them properly.
Be a harsh motion director, not a proud author. Score 1–10: impact in the first 5 seconds · readability at phone
size · motion quality (springs, no dead frames, nothing linear that starts and stops) · restraint (one signature
moment) · brand accuracy against brand_spec · accessibility (focus, reduced motion) · performance (transform/opacity
only, one rAF loop, no layout shift). List the 3 biggest problems and the state or scroll progress where each
happens. Hunt specifically for: text overlapping during swaps, anything sliding instead of easing, any banned
default, blurry scaled text, layout shift when motion starts, motion that ignores reduced motion. Fix them,
re-screenshot only the affected states, show the new scores, and repeat until every score is 8+.
```

### Fix prompts for the failures creators actually hit

Vague notes produce random changes. "Vague notes like 'make it better' get random changes. camera words get exactly the change you want" ([@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)). Each fix below names the symptom and the expected result.

| Symptom | Follow-up prompt | Source |
|---|---|---|
| The result still looks "AI" | "List the palette, type, layout and motion choices you made. Which match brand_spec BANNED or the five AI-default clusters? Replace each with a token-based alternative, then add any new default you noticed to BANNED." | [Prompting Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) ("check which styles the first result used… extend the list") |
| Text collides during swaps | "Text that swaps inside a morphing container needs its own enter and exit timing. Content enters after its container starts morphing and leaves before the next morph. Verify at 10% speed." | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193); [@verbove](https://x.com/verbove/status/2103483957266268381) |
| Blurry text while scaling | "Remove will-change from anything that scales with text inside; apply it only during the animation; re-screenshot at 2× DPR." | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193); [web.dev](https://web.dev/articles/animations-guide) |
| Cheap or janky easing | "Replace every easing curve with springs from our motion tokens. Tiny overshoot on UI, none on type. Nothing linear. Stagger so elements don't start and stop on the same frame." | [0xMovez](https://x.com/0xMovez/status/2104216919033192746); [Ciyo](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide); [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937) |
| Invented names, numbers or UI | "Delete every number, client, logo and quote not present in {{METRICS_FILE}} / {{CASE_STUDIES_DIR}}; replace each with a visible TODO slot. Never redraw a UI from imagination; crop and animate the real capture." | [Everleigh](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3) (model invented "Verdant"); [0xMovez](https://x.com/0xMovez/status/2104216919033192746) |
| An SVG breaks at small sizes | "Render at 16/32/64px. Fix parts that float apart and shapes that merge into a blob. Report shape count and bytes before and after." | [Ciyo](https://ciyo.ai/blog/claude-opus-5-5-svg-logo) |
| One moment is wrong | "At scroll progress 0.4 in <ProcessStory>, the step-3 label overlaps the shape. Expected: the label enters after the morph completes." (a state-specific note with the expected outcome) | [Everleigh](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3) |
| Pacing feels off | Director notes: "slow the headline reveal to 0.7x", "hard cut here instead of a fade", "push in on the CTA". | [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437) |
| A loop stutters at the seam | "Make the last state identical to the first, including position and velocity." | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193) |
| Polish plateaus | "What looks least premium? Fix it." | [@dreyk0o0](https://x.com/dreyk0o0/status/2103822946800165270) ("What looks least realistic? Fix it.") |
| Jank or layout shift | "List every animated property. Convert any width/height/top/left/box-shadow animation to transform/opacity, reserve space so CLS = 0, and move pointer math into the single rAF loop." | [web.dev CLS](https://web.dev/articles/optimize-cls); [web.dev INP](https://web.dev/articles/optimize-inp) |
| A gallery component lacks reduced motion | "Add a prefers-reduced-motion path to every animation in this component: final state immediately, opacity only." | [PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026) |
| Runtime error or hang | Paste the console error verbatim; one message usually fixes it. | [Everleigh](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3) (~40s fix) |

One human check stays unavoidable. Every's test, as cited by Muzli, found the model "Better at looking right than at being right about your brand", with a wrong logo and swapped brand colours. Muzli adds that it "Can't judge 'how the scroll feels on a real phone'" ([Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/)). Review every section on a mid-range Android phone with CPU throttling before launch.

## Caveats: one curated week, partial prompts and remake tags

The corpus is a showcase, not a sample. It is maintained by **Skillry, a commercial skills site** that sells premium skills and links every entry to its own "remake". It bills the set as "Viral videos people made with Claude Opus 5.5" ([README](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/README.md); [Skillry](https://skillry.dev/ai-videos/opus-5-5)). All posts fall within one week of launch, and the data contains **no views, likes or ratings**. Engagement figures in this report are fxtwitter snapshots taken on 5 October 2026, and they are still rising. Most of the "impressiveness" in the corpus is creators' own promotional captions. **41.3% of entries are partial**, meaning post text rather than prompts. Several of the strongest sources, including @daniel_haida, @aschapmann and @ik_builds, are prompts quoted inside partial posts, so their completeness can't be verified. **`tech_tags` describe Skillry's remake stack, not the creator's**. 141 entries carry `threejs`, but only 27 prompts mention Three.js ([videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)). Duplication inflates every frequency (418 distinct texts among 475). Category labels are loose. Whitespace word counts undercount Chinese and Japanese prompts.

Several workflow sources are vendors with something to sell: Ciyo, Muzli, Everleigh/opus6.video, ChatPRD, and 0xMovez's own Substack. Their test anecdotes are unaudited. None of the researchers watched the output videos, so the selection of source prompts reflects how specific and transferable each prompt is, not verified visual quality. The video-to-component conversions and every prompt labelled "synthesized" have **no published before/after evidence**. They combine corpus fragments, Anthropic guidance and web-platform documentation, and they need testing. Browser-support facts are as of October 2026: Firefox's scroll-driven animations were still preview-only, and cross-document View Transitions were unsupported in Firefox. Finally, several source prompts name real brands (Spotify, Meta, Google, TanStack, sprites.ai). The adapted prompts replace those with placeholders. Client-logo use on the live site needs permission.

## Conclusion

The corpus's lasting value is a portable contract, not any single effect. That contract has five parts: every state as a pure function of progress, damping written as words ("a tiny overshoot at most", "fast and smooth, not bouncy"), bans that name each default, honesty clauses, and a rule that Claude must look at its own output before declaring success. Swapping `seek(t)` for `draw(progress)` is the one move that turns a viral video prompt into a component that scrubs, reverses, interrupts and respects reduced motion. No creator in the corpus made that move publicly. The prompts here are ahead of the evidence on interaction and accessibility, so test them in that order.

For a digital marketing agency, two choices become strategic. First, the honesty clauses are a feature you sell. A results section that refuses invented numbers, shows periods and sources, and draws real series is harder to fake than any shader. Second, restraint is the differentiator, because the viral Opus aesthetic is itself becoming a recognisable cluster: near-black with acid green, Geist, warm-gray canvases, everything springing. A site that looks like an Opus showreel will read as AI-made within months. Build the token plan and `/brand/reference.html` first. Spend boldness on one signature moment. Make every other section quietly excellent and measured on a real phone.
