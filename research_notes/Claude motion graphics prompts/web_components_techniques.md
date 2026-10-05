# Turning AI-Generated Motion Graphics into Production-Quality Animated Website Components (and Prompting Claude Opus 5.5 to Build Them)

Research date: 2026-10-05. Scope: animated website components (not rendered video). The repo (/home/user/WEB) has no framework yet, so the notes cover both vanilla HTML/CSS/JS and React/Next.js + Tailwind.

Source-quality legend used below: **[primary]** = official docs/spec/vendor page fetched directly; **[secondary]** = blog/aggregator fetched directly; **[snippet]** = only seen as a search-result summary, not fetched in full (treat with extra caution).

---

## 1. Which animated component patterns are trending in 2026, and where are the best galleries/libraries?

### Takeaway
The 2026 landing-page vocabulary is: kinetic/split-text headlines, shader/mesh-gradient/aurora backgrounds, particle and WebGL hero scenes, scroll-driven storytelling, spotlight/beam/animated-border cards, marquees, bento grids, magnetic/cursor effects and 3D tilt cards. Most of it ships as copy-paste React + Tailwind components from React Bits, Aceternity UI and Magic UI (all installable via the shadcn CLI). React Bits is the lightest on dependencies. Anthropic's own guidance warns that scattering these effects across a page is exactly what makes a page "read as AI-generated", so treat the galleries as parts bins, not page templates.

### Cited Findings
**Libraries and galleries**
- React Bits: 110+ components. It does not force Framer Motion; it uses CSS animations and pulls in GSAP, Three.js or Matter.js only for the components that need them. It installs via the shadcn CLI (e.g. `npx shadcn@latest add "https://reactbits.dev/r/..."`) or jsrepo, and comes in four variants (JS-CSS, JS-Tailwind, TS-CSS, TS-Tailwind). Example components: SplitText, Aurora, magnetic buttons, spotlight cards, typewriter, word scramble, gradient mesh. MIT. — [PkgPulse, Mar 25 2026](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026) [secondary]
- Aceternity UI: built on Tailwind + Framer Motion (Motion), which PkgPulse estimates at ~125KB. Known for beams, tracing beams, spotlight, 3D card, infinite moving cards and card-hover effects, with a dark-mode SaaS aesthetic. Magic UI: Tailwind + Motion, focused on micro-interactions and marketing animations (animated beam, globe, aurora, blur-in text, word pull-up, retro grid, neon gradient). Both are copy-paste via shadcn CLI and MIT. — [PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026) [secondary]; [DEV Community](https://dev.to/hiteshbhardwaj/5-best-animated-component-libraries-for-react-and-nextjs-in-2026-1382) [snippet]
- **The sources conflict on popularity numbers:**
  - React Bits stars: "24,000+, #3 in JS Rising Stars 2025 with 26,200 new stars" per [PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026), versus "37K stars, #2 in JS Rising Stars 2025" per [DEV Community](https://dev.to/hiteshbhardwaj/5-best-animated-component-libraries-for-react-and-nextjs-in-2026-1382) [snippet].
  - Aceternity component count: "~50" per PkgPulse versus "200+" per the DEV snippet.
  - Magic UI stars: "~18K" per PkgPulse versus "20.5K" per the DEV snippet.
  - I could not verify these on GitHub (API access was blocked in this session).
- Accessibility gap: as of March 2026, PkgPulse reports that React Bits has `prefers-reduced-motion` support on its 2025/2026 roadmap, and that Aceternity and Magic UI "lack this currently". — [PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026) [secondary; claim not independently verified]
- Motion+ (paid, from the Motion team): a one-time payment with lifetime updates. It advertises "460+ premium examples, 110+ tutorials, AI Kit" and premium APIs such as Cursor and Ticker. — [motion.dev](https://motion.dev/docs/react-accessibility) [primary]. The npm README lists older counts (330+ examples, 100+ tutorials). — [motion README](https://cdn.jsdelivr.net/npm/motion@13.1.0/README.md) [primary]
- Codrops is still publishing current motion tutorials, e.g. "Reverse-Engineering Claude AI's Mascot Animations with SVG and GSAP" (May 5 2026). — [Codrops](https://tympanus.net/codrops/2026/05/05/reverse-engineering-claude-ais-mascot-animations-with-svg-and-gsap/) (returned 403 to the fetcher; title and date from search results only)
- https://scroll-driven-animations.style is the demo gallery Chrome's docs point to for CSS scroll-driven animations. — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) [primary]

**Trend signals**
- Kinetic typography (letters that shift, stretch and respond to scroll or interaction), variable fonts that respond to interaction, scroll storytelling, and WebGL/Three.js/Spline 3D elements are cited as 2026 trends. Awwwards and Savee are "full of sites using full-screen video or looping device scenes". — [Studio Meyer](https://studiomeyer.io/en/blog/webdesign-trends-2026), [Figma resource library](https://www.figma.com/resource-library/web-design-trends/), [Bellaworks](https://bellaworksweb.com/website-design-trends-2026/) [snippets; generic trend pieces, low evidentiary weight]
- Patterns showcased in Opus 5.5 demos (Sept 2026):
  - A WebGL water hero that "ripples where the cursor moves, with the wordmark under the surface, refracting", with the tide draining and salt crystals appearing on scroll.
  - A 12-second looping kinetic-type title sequence "on a strict grid".
  - A mini-player to full-player drag transition that "follows my finger 1:1, then settles with a spring".
  - Source: [Muzli blog, Sep 28 2026](https://muz.li/blog/claude-opus-5-5-for-designers/) [secondary]
- Anthropic's current frontend-design skill (fetched October 2026) calls these out as generic: "fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated". It also lists as AI defaults: "a big number with a small label, supporting stats, and a gradient accent" heroes; "the SaaS-card kit" (identical rounded cards, one radius, `rgba(0,0,0,.1)` shadows, gradient washes); and cream backgrounds with terracotta accents (#F4F1EA / #D97757). — [anthropics/claude-code frontend-design SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]

### Inferences
- **Pattern-to-implementation map** (my synthesis from the sources above):

| Pattern | Lightest robust implementation |
|---|---|
| Kinetic/split-text headline | GSAP SplitText (now free), React Bits SplitText, or Motion `stagger` |
| Shader, mesh-gradient or aurora background | A single full-screen fragment shader (OGL or raw WebGL); a CSS layered-gradient fallback |
| Particle field | Canvas 2D for fewer than ~a few thousand points; Three.js/R3F `InstancedMesh` beyond that |
| Cursor-follow / magnetic button | Pointer events + `transform` with lerp in rAF, or Motion springs |
| Marquee / logo wall | Pure CSS `@keyframes translateX` on a duplicated track, paused on hover/focus |
| Bento grid with motion | CSS grid + Motion `layout` animations, or View Transitions |
| Scroll storytelling | CSS `animation-timeline: view()/scroll()` where supported; GSAP ScrollTrigger (+ Lenis) for pinning and complex timelines |
| Stat counter | IntersectionObserver + rAF tween; reserve width with tabular numbers to avoid layout shift |
| Animated borders / beams | Animated `conic-gradient` via `@property` angle, or SVG `stroke-dashoffset` |
| Page transitions | View Transitions API (same-document Baseline; cross-document in Chromium/Safari) |
| 3D product card | CSS `perspective` + `rotateX/Y` tilt; R3F only for real 3D models |

- For "sick looking" rather than "template-looking" results, pick one hero-level effect per page and keep the rest quiet. This follows the official skill's guidance ("spend your boldness in one place") and Muzli's "one orchestrated moment per page" tip.
- Treat copy-pasted gallery components as starting code. Before shipping, audit each one for `prefers-reduced-motion`, off-screen pausing and keyboard focus, because at least one comparison reports that the two biggest Motion-based galleries do not handle reduced motion.

### Gaps
- No primary, quantitative 2026 data on pattern popularity (e.g., Awwwards statistics). Trend sources are generic blog posts.
- Star and component counts conflict between secondary sources, and I couldn't check GitHub directly.
- I didn't fetch Motion Primitives (ibelick) or the current Aceternity Pro/Magic UI Pro pricing, so their licensing tiers are unverified here.

---

## 2. Which tools fit which job, with 2026 licensing and browser support?

### Takeaway
- **Native CSS covers most component motion:** transitions/keyframes, `linear()` easing, scroll-driven animations (Chromium plus Safari 26; Firefox still only in Nightly/preview) and View Transitions (same-document Baseline since Firefox 144; cross-document Chromium 126+ and Safari 18.2+, not Firefox).
- **GSAP:** 100% free for commercial use since the 3.13 release in spring 2025, all plugins included, under a no-charge license whose only notable restriction is against building no-code visual animation tools that compete with Webflow.
- **Motion (formerly Framer Motion):** MIT, the idiomatic React choice.
- **Lenis:** MIT, honors reduced motion by default.
- **Three.js / R3F:** for real 3D.
- **Rive / Lottie:** for designer-authored vector animation.

### Cited Findings
**CSS scroll-driven animations (`animation-timeline`, `scroll()`, `view()`)**
- MDN browser-compat-data (main branch, read Oct 2026): Chrome 115+, Edge mirrors Chrome, Safari 26 (desktop and iOS mirror), Firefox `"preview"` (Nightly only, not stable). — [MDN BCD animation-timeline.json](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json) [primary]
- "CSS scroll-driven animations now run in Chrome and Safari 26… only Firefox doesn't support this." — [BuildMVPFast](https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026) [snippet], consistent with BCD.
- Scroll-driven animations are an Interop 2026 focus area (`animation-timeline`, `scroll-timeline`, `view-timeline`), so Firefox support is actively targeted this year. — [web.dev Interop 2026, Feb 12 2026](https://web.dev/blog/interop-2026) [primary]
- They integrate with WAAPI and CSS Animations and "can run off the main thread", unlike scroll-event JS, which is subject to jank because scroll events arrive asynchronously. — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) [primary]

**View Transitions API**
- Same-document (`document.startViewTransition`, `view-transition-name`, `view-transition-class`, `match-element`, `:active-view-transition`) became Baseline Newly available with Firefox 144 (stable Oct 14 2025). — [web.dev, Oct 16 2025](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) [primary]
- BCD: `startViewTransition` is in Chrome 111, Safari 18 and Firefox 144. — [MDN BCD Document.json](https://github.com/mdn/browser-compat-data/blob/main/api/Document.json) [primary]
- Cross-document (MPA) transitions:
  - Opt-in on both pages with `@view-transition { navigation: auto; }`. Same-origin navigations only; in Chrome 126 main-frame only. — [Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) [primary]
  - BCD `@view-transition`: Chrome 126, Safari 18.2, Firefox not supported (bug 1860854). — [MDN BCD view-transition.json](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/view-transition.json) [primary]
  - Cross-document view transitions are an Interop 2026 focus area. — [web.dev Interop 2026](https://web.dev/blog/interop-2026) [primary]

**CSS easing**
- `linear()` easing (lets you express spring/bounce curves in pure CSS) is supported in Chrome 113, Firefox 112 and Safari 17.2. — [MDN BCD easing-function.json](https://github.com/mdn/browser-compat-data/blob/main/css/types/easing-function.json) [primary]

**GSAP**
- "Thanks to Webflow GSAP is now 100% FREE including ALL of the bonus plugins like SplitText, MorphSVG… even for commercial use."
  - All plugins moved into the public `gsap` npm package. Club members were told to move off the private registry by June 1 2025.
  - The 3.13 release also rewrote SplitText ("50% smaller, 14 new features").
  - Source: [GSAP 3.13 release blog](https://gsap.com/blog/3-13/) [primary]
- The pricing page confirms the whole library is free, including ScrollTrigger, ScrollSmoother, DrawSVG, Inertia, SplitText and MorphSVG. The original team is maintained full-time at Webflow. — [gsap.com/pricing](https://gsap.com/pricing/) [primary]
- License restriction ("Prohibited Uses"): use "in tools that allow users to build visual animations without code that… competes with Webflow's visual animation building capabilities". The license also forbids removing notices or reverse-engineering to build competing products. AI-generated code that uses GSAP is explicitly not a prohibited use. — [GSAP Standard License](https://gsap.com/community/standard-license/) [primary]
- The `gsap-trial` package is deprecated; use the standard `gsap` package. — [gsap-trial README](https://cdn.jsdelivr.net/npm/gsap-trial@3.13.0/README.md) [primary]

**Motion (motion.dev, formerly Framer Motion)**
- MIT-licensed. It uses a "hybrid engine" that combines JS with native browser APIs for "120fps GPU-accelerated motion". — [motion README](https://cdn.jsdelivr.net/npm/motion@13.1.0/README.md) [primary]
- Motion+ is the paid add-on (see Q1).

**Lenis (smooth scroll)**
- MIT (darkroom.engineering). Built "for sync" with WebGL scroll scenes, GSAP ScrollTrigger and parallax off one loop. The documented GSAP integration is:
  - `lenis.on('scroll', ScrollTrigger.update)`
  - `gsap.ticker.add(...)`
  - `gsap.ticker.lagSmoothing(0)`
- `respectReducedMotion` defaults to `true`: under `prefers-reduced-motion: reduce`, smoothing is disabled (lerp forced to 1) and programmatic scrolls jump instantly.
- Nested scrollers need `data-lenis-prevent`. The `allowNestedScroll` option "can create performance issues". Anchors need `anchors: true`.
- Source: [Lenis README](https://github.com/darkroomengineering/lenis) [primary]

**Three.js / React Three Fiber**
- R3F renders in a 60fps loop by default. `<Canvas frameloop="demand">` renders only on change, with `invalidate()` for external mutations.
- Keep draw calls to "a few hundred or less" (1000 as the very maximum) and use instancing.
- Drei `<PerformanceMonitor>` can adapt `dpr` (e.g. start at 1.5, drop to 1, raise to 2) and fall back after N flip-flops.
- Source: [R3F docs: Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) [primary]

**Rive and Lottie**
- Rive's State Machine keeps interaction logic inside the `.riv` file. Vendor/secondary claims put Rive files at ~10x smaller than equivalent Lottie JSON (~50KB vs ~500KB for a complex character). LottieFiles added a native state machine to its web-based Lottie Creator in late 2025. Paid tiers: Rive from $9/mo, LottieFiles from $15/mo; both have free plans. — [Makerstack Rive review](https://makerstack.co/reviews/rive-review/), [LottieFiles blog](https://lottiefiles.com/blog/design-guides-and-tips/best-motion-design-tools-ranked-by-use-case), [Toolradar](https://toolradar.com/compare/rive-vs-lottie) [snippets; vendor-adjacent, numbers unverified]

**Creator usage**
- Muzli's Opus 5.5 demos used GSAP ScrollTrigger for scroll narratives, Motion for springs and interruptible animations, Lenis synced with GSAP, and WebGL shaders. — [Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/) [secondary]

### Inferences
**Decision guide (my synthesis):**
1. **Hover/focus states, entrances, marquees, borders:** plain CSS (`transition`, `@keyframes`, `@property`, `linear()`). No dependency, compositor-friendly, trivial to switch off for reduced motion.
2. **Scroll-linked reveals and parallax with no pinning:** CSS `animation-timeline: view()` inside `@supports (animation-timeline: view())`, so Firefox users get a static or IntersectionObserver-class-toggle fallback. Revisit when Firefox ships (Interop 2026 target).
3. **Pinned or scrubbed multi-step scroll stories, SplitText, SVG morph/draw:** GSAP + ScrollTrigger (+ Lenis if smooth scroll is desired). It is free for commercial sites. Use `gsap.matchMedia()` for breakpoints and reduced motion. In React, use `@gsap/react`'s `useGSAP` (I didn't fetch it this session, so verify).
4. **React state-driven UI motion (springs, gestures, layout/shared-element, exit animations):** Motion. Wrap the app in `<MotionConfig reducedMotion="user">`.
5. **Route/page transitions and DOM reorders:** View Transitions API. Same-document works cross-browser. Cross-document is progressive enhancement: Firefox ignores it and the page still works.
6. **Full-screen shader, mesh-gradient or noise backgrounds:** a single fragment shader on one `<canvas>`. OGL or raw WebGL keeps the bundle small; Three.js/R3F is overkill unless there is real 3D geometry. I didn't fetch OGL's license or bundle size this session, so verify before quoting.
7. **Real 3D (models, lighting, physics):** Three.js or R3F with `frameloop="demand"` where the scene can rest, plus a DPR cap and PerformanceMonitor.
8. **Designer-authored, stateful vector animation (mascots, animated icons with states):** Rive. **Simple After Effects exports:** Lottie/dotLottie.
9. **Avoid** stacking Motion + GSAP + Lenis + Three.js on one landing page unless each earns its bytes. PkgPulse's ~125KB estimate for Framer Motion suggests the cost matters (unverified figure).

### Gaps
- I didn't fetch current bundle-size figures for GSAP core, Motion (`m`/LazyMotion/mini `animate`), OGL or Three.js. Quote sizes only after checking bundlephobia or each project's docs.
- I didn't check Rive and Lottie runtime licenses (Rive web runtime and lottie-web are believed open source, but unverified here).
- Three.js WebGPU renderer status in October 2026 isn't covered (the only mention was an [AY Automate](https://www.ayautomate.com/resources/claude-opus-5-5-motion-graphics) summary listing "Three.js + WebGPU" in creator stacks).
- I didn't check whether Firefox stable will ship scroll-driven animations before end of 2026. As of the BCD snapshot it was "preview" only.

---

## 3. How should you prompt Claude (Opus 5.5 / Claude Code) to build these components well?

### Takeaway
Anthropic's guidance for Opus 5.5 is explicit:
- Without design direction it "falls back on a few default styles". A vague "avoid a generic AI look" just swaps one default for another.
- Name the specific patterns to avoid, iterate, and request animation and interactivity explicitly.
- Let the frontend-design skill (or its distilled `<frontend_aesthetics>` prompt) drive a plan → review → build → screenshot-critique loop.

For motion components, add what the official prompts leave implicit: framework and component API, exact motion specs (trigger, duration, easing, stagger, spring), responsive behavior, a reduced-motion variant and performance budgets.

### Cited Findings
**Official Anthropic guidance**
- **Opus 5.5 frontend defaults:** "Asked for frontend work without design direction, Claude Opus 5.5 falls back on a few default styles, and a general instruction such as 'avoid a generic AI look' mostly swaps one default for another. It responds well to instructions that name specific patterns to avoid… Work iteratively: check which styles the first result used instead, and extend the list if needed." Example prompt: *"Output a vanilla HTML/CSS personal website with placeholder data. Do not use a cream or off-white background, italic accent words in headlines, numbered '01/02/03' section labels, monospace labels, or pill-shaped buttons."* — [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) [primary]
- **Opus 5.5 effort:**
  - Default effort is `medium`. Opus 5.5 at `medium` "matches or exceeds Claude Opus 5 at `high`" on coding evals.
  - Reserve `xhigh`/`max` "for work where you've measured a quality gain".
  - It reads screenshots more accurately than Opus 5 and is more reliable at computer use from screenshots.
  - Source: [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5) [primary]
- **Model launch:** Opus 5.5 was released Sept 22 2026. Anthropic says that when testers had several Claude models build a game from a single prompt, "Opus 5.5 scored higher than any other model on the strength of its graphics and polish". — [Anthropic: Introducing Claude Opus 5.5](https://www.anthropic.com/news/claude-opus-5-5) [primary]
- **General best practices** (covers Opus 5.5 among current models): "Animations and interactive elements should be requested explicitly when desired". Use quality modifiers, e.g. "Include as many relevant features and interactions as possible. Go beyond the basics…". The page reproduces the `<frontend_aesthetics>` snippet and links the full skill. It also points to Claude Design (a canvas product) for frontend design work outside the API. — [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) [primary]
- **The distilled `<frontend_aesthetics>` prompt**, motion clause verbatim: "Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions." Other clauses:
  - Typography: avoid Inter/Roboto/Arial/system fonts.
  - Color: "Dominant colors with sharp accents outperform timid, evenly-distributed palettes", using CSS variables.
  - Backgrounds: "Layer CSS gradients, use geometric patterns…".
  - Avoid "purple gradients on white" and convergence on Space Grotesk.
  - Sources: [Claude Cookbook: Prompting for frontend aesthetics](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) [primary]; [Claude blog: Improving frontend design through Skills, Nov 12 2025](https://claude.com/blog/improving-frontend-design-through-skills) [primary]
- **Cookbook strategies:**
  - "Guide specific design dimensions" (typography, color, motion, backgrounds).
  - "Reference design inspirations" (IDE themes, cultural aesthetics).
  - "Call out common defaults". Isolated prompts (e.g. a typography-only `<use_interesting_fonts>` block, or a locked theme block) give "faster generation times and more predictable outputs".
  - Typography block: use extremes ("100/200 weight vs 800/900", "size jumps of 3x+") and "State your choice before coding".
  - Source: [Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) [primary]
- **Why it works:** "distributional convergence". Safe design choices dominate training data, so without direction Claude "samples from this high-probability center". Anthropic adds: "The more you can map aesthetic improvements to implementable frontend code, the better Claude can execute." — [Claude blog](https://claude.com/blog/improving-frontend-design-through-skills) [primary]
- **Current frontend-design skill (Claude Code plugin; the October 2026 text differs from the Nov 2025 version):**
  - Persona: "design lead at a design studio".
  - Ground the design in the subject's world.
  - Two passes: first a token plan with 4–6 named hex colors, type roles, a layout concept with ASCII wireframes, and principles. Then review that plan against "the generic default you would produce for any similar page" before coding.
  - Quality floor: "responsive down to mobile, visible keyboard focus, reduced motion respected".
  - "Critique your own work as you build, taking screenshots".
  - "Spend your boldness in one place."
  - Watch CSS specificity conflicts.
  - Source: [SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]
- The skill is model-invoked (it loads automatically for UI work, not via a slash command). A third-party site claims it is the most-installed official plugin, with 1.1M+ installs. — [ClaudeLog](https://claudelog.com/faqs/what-is-frontend-design-skill-in-claude-code/) [snippet; install count unverified]

**Creator tips specific to Opus 5.5 web UI work**
- Muzli (Sept 28 2026):
  - Connect Claude to a browser so "it can screenshot its own page at desktop and phone size".
  - Ask for a motion review "at 10% speed" to judge easing.
  - One demo ran "four rounds of screenshots and fixes".
  - Ban patterns "by name". Ask for "eight type pairings" before building. Ask for "one orchestrated moment per page".
  - "Turn effort up, not to max" (`/effort high` for key moments).
  - Caveats: the model can't verify brand accuracy (wrong logo/brand green), phone interaction feel still needs a human, older-hardware performance is untested, and max-effort runs cost about $2.56+ per attempt.
  - Source: [Muzli blog](https://muz.li/blog/claude-opus-5-5-for-designers/) [secondary]
- Muzli's actual prompts are art-directed briefs, not specs:
  - "Build a one-page website for Lenn, a two-person sea salt harvest on the salt marshes of Guérande… WebGL water hero that ripples where the cursor moves…"
  - "Make a 12-second looping title sequence… as a web page… kinetic type on a strict grid… colours swap in hard cuts on the beat."
  - "Prototype the mini player to full player transition… Drag it up and the album art grows out of it… following my finger 1:1, then settles with a spring."
  - Source: [Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/) [secondary]
- Video-style creator prompts that went viral after the launch:
  - Stephan Livera's "make a dynamic 15-second motion graphics video… go all out".
  - A keynote-style prompt specifying "1920×1080", "Playwright at 60fps", "no CSS transitions or timers", "keyframe tables for every animated value", and banning "crossfades, blur-ins, 3D flips, particles".
  - Typical runs took 2–5 iterative rounds.
  - Source: [AY Automate roundup, pulled 2026-09-28](https://www.ayautomate.com/resources/claude-opus-5-5-motion-graphics) [secondary aggregator of X posts]
- Charlie Hills' Claude Code motion-graphics workflow renders frames to MP4 using HyperFrames (`npx skills add heygen-com/hyperframes`) plus a free 13-folder "motion-graphics-skills" pack (github charlie947/motion-graphics-skills). This targets video, not components. — [Charlie Hills, Sep 27 2026](https://charliehills.substack.com/p/claude-code-motion-graphics) [secondary; partly paywalled]

### Inferences
**A prompt template for an animated component** (synthesized from the official guidance plus motion-engineering practice; fill the braces):

```text
Build a {ComponentName} component.

Stack: {Next.js 15 App Router + React + TypeScript + Tailwind v4 + Motion | vanilla HTML/CSS/JS, single file, no build step}.
Add only these dependencies: {gsap | motion | lenis | ogl | none}. Client component only where needed ("use client").

API: props {headline: string; items: Item[]; trigger: "load" | "inView" | "hover"; loop?: boolean; className?: string}.
It must render meaningful content with JS disabled / before hydration (no blank hero).

Art direction: {subject + audience}. Palette as CSS variables: {--bg #…, --ink #…, --accent #…}. Type: {display font} for
headline, {text font} for body. Do NOT use: {cream background, purple-on-white gradient, Inter/Space Grotesk,
italic accent word in headline, 01/02/03 labels, pill buttons, glassmorphism cards, fade-up on every section}.

Motion spec (the one orchestrated moment):
- Trigger: plays once when 30% of the component enters the viewport (not on every scroll pass).
- Headline: split into words; each word translateY(100%)→0 and opacity 0→1, 700ms, ease cubic-bezier(0.16,1,0.3,1),
  stagger 60ms. Total sequence ≤ 1.2s.
- Background: slow ambient loop (≥ 12s period), pauses when off-screen or tab hidden.
- Hover/focus: buttons use a spring (stiffness 300, damping 25) on scale 1→1.03; same state on :focus-visible.
- Animate only transform and opacity (and shader uniforms). No width/height/top/left/box-shadow animation.

Reduced motion: under prefers-reduced-motion: reduce, show the final state instantly (or ≤150ms opacity fade only),
no parallax, no autoplaying loop, static background frame.

Responsive: fluid from 320px to 1920px; type via clamp(); container uses aspect-ratio or min-height so nothing shifts
when animation starts (CLS = 0). Pointer effects disabled on (hover: none) devices.

Performance budget: canvas devicePixelRatio capped at 2; ≤ 1 requestAnimationFrame loop; IntersectionObserver +
visibilitychange pause; lazy-load the WebGL/GSAP chunk after first paint; fall back to CSS gradient if WebGL fails.

Accessibility: semantic HTML, decorative canvas aria-hidden, visible focus ring, any looping motion >5s gets a
pause control.

Verify: run it, screenshot at 375 / 768 / 1440 widths, replay the motion at 10% speed and critique easing,
then list what you changed. Report bundle size added.
```

**Tips that follow from the cited guidance:**
- Run the frontend-design skill's plan step first. Ask for the token plan, 3–8 type pairings and an ASCII layout, approve one, then build. This matches the official two-pass process and Muzli's "eight type pairings" tip.
- Ban defaults by name, and grow the ban list after each round (official Opus 5.5 guidance).
- Request motion explicitly. Current models do what's asked; the best-practices page says animations "should be requested explicitly".
- Give exact numbers for duration, easing (cubic-bezier or GSAP ease names such as `power3.out` / `expo.out`), stagger and spring stiffness/damping. Otherwise the model picks generic 300ms ease-in-out everywhere. This is a reasoned inference, not an Anthropic claim.
- Use `/effort high` for the hero or signature component and the default `medium` for routine components. Avoid `max` unless you've measured a gain (Opus 5.5 docs; Muzli).
- In Claude Code, give it a browser or Playwright to screenshot its own output at several widths. Opus 5.5's better screenshot reading makes this loop more valuable (Opus 5.5 docs).
- For a React/Next.js repo, put a condensed `<frontend_aesthetics>` block plus motion and accessibility rules in CLAUDE.md, or rely on the skill auto-loading. The blog explains the skill exists so this context loads only when needed.

### Gaps
- I found no official Anthropic page specifically about prompting for animation timing or easing specs. The motion spec template above is my synthesis.
- I didn't read the full "Prompting Claude Opus 5" and "Prompting Claude Sonnet 5" pages, which mention "design and frontend defaults" sections.
- I didn't fetch the GSAP "agent skills" (e.g. greensock/gsap-plugins on skills directories) or the Motion+ "AI Kit", so I can't confirm their contents. Both appear to be vendor-provided Claude/agent skills that may improve library-correct code.

---

## 4. Performance and accessibility essentials that separate polished results from janky ones

### Takeaway
- Animate only `transform` and `opacity`, which stay on the compositor, cause no layout shift and don't count toward CLS.
- Use `will-change` sparingly and only when a problem is measured.
- Drive custom motion with one `requestAnimationFrame` loop and pause anything off-screen. Use on-demand rendering and DPR caps for WebGL.
- Keep interaction handlers tiny for INP.
- Honor `prefers-reduced-motion` everywhere (CSS media query, `MotionConfig`, `gsap.matchMedia`, Lenis default). WCAG 2.3.3 (AAA) names parallax and scroll-triggered movement as vestibular triggers.

### Cited Findings
**Compositing and CSS performance**
- Move with `transform: translate/rotate`, resize with `scale`, show/hide with `opacity`. "Avoid any property that triggers layout or paint unless it's absolutely necessary." Blur and shadow animations are paint-expensive. "Restrict animations to opacity and transform to keep animations on the compositing stage." — [web.dev: High-performance CSS animations](https://web.dev/articles/animations-guide) [primary; last updated 2020 but still the canonical guidance]
- `will-change`: don't use it early. Use it only when you see graphics issues, apply it via JS just before a change and remove it after, because layer creation "can cause other performance issues". — [web.dev](https://web.dev/articles/animations-guide) [primary]
- In web.dev's demo, a `top/left` animation dropped ~50% of frames while the `transform` version dropped ~1%. Diagnose with DevTools Performance (non-zero "Rendering"), the FPS meter and Paint Flashing. — [web.dev](https://web.dev/articles/animations-guide) [primary]

**Core Web Vitals**
- CLS: animating `top`/`left` causes layout shifts "even when the element being moved is on its own layer". "Composited animations using translate can't impact other elements, and so don't count toward CLS." `box-shadow`/`box-sizing` changes trigger layout, paint and composite. — [web.dev: Optimize CLS](https://web.dev/articles/optimize-cls) [primary]
- INP: do as little as possible in event callbacks. Update the UI for the next frame, then defer the rest (e.g. `requestAnimationFrame(() => setTimeout(work, 0))`). Avoid layout thrashing (forced synchronous layout). — [web.dev: Optimize INP](https://web.dev/articles/optimize-inp) [primary]

**Animation loops, scroll and WebGL**
- `requestAnimationFrame` runs at roughly the display refresh rate (60, 75, 120 or 144 Hz), so drive motion by the timestamp argument, not by frame count. rAF "calls are paused in most browsers when running in background tabs or hidden iframes". — [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) [primary]
- Scroll-event-driven JS animations are subject to main-thread jank. CSS/WAAPI scroll timelines can run off the main thread. — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) [primary]
- WebGL/R3F: use on-demand rendering (`frameloop="demand"`), instancing, draw-call limits, LOD and adaptive DPR via `PerformanceMonitor`. "Movement regression" lowers pixel ratio or effects during motion. — [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) [primary]

**Reduced motion and WCAG**
- WCAG 2.2 SC 2.3.3 Animation from Interactions (Level **AAA**): "Motion animation triggered by interaction can be disabled, unless the animation is essential."
  - Parallax is named as "often non-essential". Scroll-triggered element movement can trigger vestibular disorders (dizziness, nausea, migraine).
  - Sufficient techniques: C39 (CSS `prefers-reduced-motion`), SCR40 (the same query in JS), or a site-wide user setting.
  - Color, opacity and blur changes that don't change perceived size, shape or position aren't "motion animation" under the definition. An erratum amends the blur exclusion, so treat blur cautiously.
  - SC 2.2.2 Pause, Stop, Hide covers auto-started animation separately.
  - Source: [W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) [primary]
- Motion: `<MotionConfig reducedMotion="user">` disables transform and layout animations while keeping opacity and color. `useReducedMotion()` handles bespoke cases: swap slide for fade, stop autoplay video, disable parallax. Guidance: replace transform animations on large elements with opacity. — [Motion docs: accessibility](https://motion.dev/docs/react-accessibility) [primary]
- GSAP: `gsap.matchMedia()` with conditions such as `{isDesktop, isMobile, reduceMotion: "(prefers-reduced-motion: reduce)"}` auto-reverts animations and ScrollTriggers when the query stops matching. `gsap.matchMediaRefresh()` supports an on-page reduced-motion toggle. — [GSAP docs: matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) [primary]
- Lenis: honors reduced motion by default and exposes `lenis.prefersReducedMotion`. — [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- Anthropic's skill sets "visible keyboard focus, reduced motion respected" as part of the quality floor for all generated UI. — [SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]

### Inferences
**Production checklist to paste into prompts or CLAUDE.md** (synthesized from the sources above):
1. Only `transform`, `opacity`, `filter: opacity`, CSS custom properties registered with `@property`, and shader uniforms are animated. No layout properties.
2. Reserve space for animated content (fixed `aspect-ratio`/`min-height`, `font-variant-numeric: tabular-nums` for counters) so CLS stays at 0.
3. One rAF loop per page (GSAP ticker, or a shared loop that Lenis and WebGL read from). Use time-based deltas.
4. Canvas/WebGL:
   - `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, or R3F `dpr={[1, 2]}`. This is common practice; I didn't fetch a three.js primary source for it this session.
   - Pause rendering when an IntersectionObserver reports the canvas off-screen and on `document.visibilitychange`. rAF already pauses in hidden tabs per MDN, but not for an off-screen canvas within a visible tab.
   - Dispose geometries and materials on unmount. Provide a CSS-gradient fallback if WebGL context creation fails.
5. Lazy-load heavy motion code (Three.js/OGL/GSAP plugins) via dynamic `import()` or `next/dynamic` with `ssr: false` after the hero text is painted, so LCP is real text or an image, not a canvas.
6. Keep pointer handlers cheap (write to a ref or CSS variable; read it in rAF) to protect INP. Disable cursor and magnetic effects on `(hover: none)` and `(pointer: coarse)`.
7. `prefers-reduced-motion: reduce`:
   - Remove parallax, scroll-scrubbed movement, autoplaying loops and large translations.
   - Keep short opacity fades and state-change feedback.
   - Tooling: `MotionConfig reducedMotion="user"`, `gsap.matchMedia`, Lenis default, a CSS `@media` block.
   - For autoplaying ambient loops longer than 5s, also add a visible pause control (this is SC 2.2.2's threshold; I didn't fetch it this session).
8. Keyboard: hover effects must have `:focus-visible` equivalents. Marquees pause on hover and focus. Pinned scroll sections must not trap Tab focus. Decorative canvases get `aria-hidden="true"`. Split-text must keep an accessible label (SplitText-style libraries can wrap characters in spans; confirm screen readers read whole words, e.g. via `aria-label` on the parent).
9. Test on a mid-range Android phone and with CPU throttling. The Muzli article notes the model doesn't test older hardware itself.

### Gaps
- I didn't fetch the MDN IntersectionObserver page, the three.js manual's HD-DPI section (the manual is JS-rendered and returned no text), or WCAG 2.2.2's exact wording. The specific recipes above (DPR cap, pause control) are standard practice, but this session didn't source them from primary text.
- I didn't verify whether GSAP SplitText 3.13+ adds ARIA attributes automatically. Check the SplitText docs.
- I found no 2026 field data quantifying INP or CLS regressions caused specifically by animation libraries.

---

## 5. How to adapt a "video-style" prompt (fixed duration, timestamped storyboard, 1080×1080) into a component prompt

### Takeaway
Video prompts optimize for a deterministic, frame-rendered timeline on a fixed canvas. Viral Opus 5.5 prompts specify resolution, fps, keyframe tables and "no CSS transitions or timers" for Playwright frame capture. Components need the opposite: event- or state-driven timelines (load, in-view, hover, scroll progress), fluid containers, interruptibility, idle and loop behavior that pauses, and reduced-motion and no-JS states. The conversion is mostly mechanical:
- timestamps → relative delays/labels on a timeline
- canvas size → container + aspect-ratio
- "plays once for 15s" → "plays ≤1.5s on trigger, then idles"
- "camera move" → scroll progress
- render pipeline → real-time rAF with budgets

### Cited Findings
- **Video-style prompts in the wild:**
  - The keynote prompt specified "one continuous take", "120 BPM, 54 beats", "1920×1080", "Playwright at 60fps", HTML/SVG rendering with "no CSS transitions or timers", and banned "crossfades, blur-ins, 3D flips, particles". The recommended fix for random timing was "keyframe tables for every animated value".
  - A pixel-art loop used "largest integer scale that fits, center it, imageSmoothingEnabled false" (a responsive-canvas rule) and allocation-free particle pools for performance.
  - Source: [AY Automate roundup](https://www.ayautomate.com/resources/claude-opus-5-5-motion-graphics) [secondary]
- **Web-native versions of the same ideas:**
  - "a 12-second looping title sequence… as a web page".
  - "a mini-player → full-player transition… following my finger 1:1, then settles with a spring" (gesture-driven, interruptible).
  - "a WebGL water hero that ripples where the cursor moves… As you scroll, the tide drains away" (pointer- and scroll-driven).
  - Source: [Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/) [secondary]
- A popular "motion design pipeline" prompt makes Claude study reference videos frame by frame, storyboard before animating, and build scenes in GSAP + Three.js. — [X post via search](https://x.com/RoundtableSpace/status/2105209785335373948) [snippet]
- **GSAP mechanics that map storyboards to code:** `gsap.timeline()` orchestrates sequences, `gsap.to()` tweens, `gsap.set()` makes instant frame swaps, and the `"<"` position parameter syncs tweens to start together. Creator motion principles: "vary speed so things land slowly enough to read, leave fast"; "one object carries the story across shots". — [Search summary of creator posts](https://charliehills.substack.com/p/opus-55-motion-graphics) [snippet]
- **Official guidance points toward triggered moments over long sequences:** "one well-orchestrated page load with staggered reveals" ([Claude blog](https://claude.com/blog/improving-frontend-design-through-skills)) and "Motion that answers a person's action… is welcome when it shows what changed" ([SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)). [primary]
- Scroll-linked replacements for "camera moves" can run on CSS scroll/view timelines (off the main thread) in Chromium and Safari 26. — [Chrome for Developers](https://developer.chrome.com/docs/css-ui/scroll-driven-animations), [MDN BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json) [primary]

### Inferences
**Translation table, video concept → component concept** (synthesized):

| Video prompt says | Component prompt should say |
|---|---|
| "15-second video, 1080×1080 (or 1920×1080)" | "Component fills its container; `aspect-ratio: 1` on desktop, auto height on mobile; type via `clamp()`; works 320–1920px" |
| "0:00–0:02 logo draws on; 0:02–0:05 headline slides in…" | "On trigger: logo stroke draw 600ms; headline words start at +200ms, stagger 50ms; CTA at +900ms. Total ≤1.5s" (timeline labels/delays relative to trigger, not absolute clock) |
| "Plays once / render at 60fps with Playwright" | "Real-time rAF; time-based; plays once per page view on load or when 30% in view; final state persists" |
| "Loop the whole piece" | "Only the ambient background loops (≥10s period, subtle); pauses off-screen, on hidden tab, and under reduced motion" |
| "Camera pushes in / pans across" | "Progress tied to scroll (`animation-timeline: view()` or ScrollTrigger `scrub`) or pointer position (lerped)" |
| "Hard cuts on the beat / music sync" | "No audio. Cuts tied to scroll checkpoints or user steps; or a short CSS `steps()` sequence" |
| "No CSS transitions or timers" (for frame capture) | The reverse: "Prefer CSS transitions and WAAPI/compositor animations; JS only where interactivity requires" |
| "Go all out" | "One signature moment; everything else quiet; respect budgets (≤1 canvas, DPR ≤2, CLS 0)" |
| (implicit: viewer just watches) | "Interactive states: hover, `:focus-visible`, active/pressed, disabled; touch fallbacks; interruptible (re-hover mid-animation reverses smoothly)" |
| (implicit: everyone sees motion) | "Reduced-motion variant: final frame shown instantly, opacity-only feedback" |

**Example A: kinetic hero** (synthesized before/after, not quoted from a source)
- *Before (video-style):*
  > "Make a 10-second 1080×1080 motion graphic for 'Northwind Coffee'. 0:00–0:02 a coffee ring stain draws itself. 0:02–0:05 the words 'Slow roasted. Fast mornings.' slam in letter by letter with expo.out. 0:05–0:08 steam particles rise. 0:08–0:10 logo lockup and hold. 60fps, export MP4."
- *After (component, React/Next.js + Tailwind + GSAP):*
  > "Build `<HeroKinetic headline subline ctaLabel ctaHref />` for Northwind Coffee's homepage hero (Next.js App Router, TypeScript, Tailwind v4, GSAP + SplitText via `useGSAP`, client component).
  > - Layout: full-width section, `min-h-[90svh]`, headline left-aligned at `clamp(3rem, 9vw, 9rem)`. The SVG coffee-ring sits behind the headline at 60% opacity, `aspect-ratio: 1`, max 70vmin.
  > - On first paint (once per visit): the ring's `stroke-dashoffset` draws in 900ms `power2.inOut`. At +250ms the headline words rise from `yPercent: 110` inside overflow-hidden masks, 650ms `expo.out`, stagger 0.06. CTA fades/slides 12px at +800ms.
  > - Ambient: 20–40 steam wisps as a lightweight canvas or SVG loop, ≤ 8s cycle, paused via IntersectionObserver and `visibilitychange`.
  > - Interactions: CTA magnetic offset ≤ 6px with spring return, disabled on `(hover: none)`. Identical focus-visible style.
  > - Reduced motion: render final state, no steam, no magnetic effect.
  > - Server-render the headline text so LCP is text; no layout shift.
  > - Screenshot at 375/768/1440 and replay at 10% speed before finishing."

**Example B: looping shader background** (vanilla)
- *Before:* "A 12-second seamless loop of flowing aurora gradients, 1080×1080, export GIF."
- *After:*
  > "Vanilla JS module `aurora-bg.js` that mounts a single `<canvas>` behind any element with `data-aurora`.
  > - One fragment shader (fbm noise, 3 palette colors from CSS variables `--c1/--c2/--c3`). Period ~12s via `uTime`.
  > - `devicePixelRatio` capped at 2 (1.5 on mobile). Resize with ResizeObserver.
  > - Pause when off-screen (IntersectionObserver) and when the tab is hidden.
  > - If WebGL fails or `prefers-reduced-motion: reduce`, render a static CSS layered-gradient with the same colors.
  > - `aria-hidden`, `pointer-events: none`. No dependencies, ≤ 6KB minified."

**Example C: storyboard → scroll story**
- *Before:* "30-second explainer: 0:00 phone appears; 0:05 screen 1; 0:12 screen 2; 0:20 zoom out to 3 phones; 0:28 logo."
- *After:*
  > "A `<ScrollStory steps={[…]}/>` section (or a vanilla equivalent) where a sticky phone mockup swaps screens as each of 4 text steps scrolls past.
  > - Implementation: CSS `position: sticky` + `animation-timeline: view()` crossfades inside `@supports`. Otherwise GSAP ScrollTrigger with `scrub: 0.5` and `pin` on desktop ≥1024px only. On mobile, stacked static cards.
  > - Reduced motion: no scrub, screens swap instantly at step boundaries.
  > - Keyboard: each step is a focusable heading, and focus scrolls it into view without trapping."

- **General rule:** keep any long "showreel" sequence for a video asset (`<video>` with `muted playsinline`, poster frame, and pause under reduced motion) and build only the interactive moments as live components. Viral Opus 5.5 showreels were 15–30s and rendered frame-by-frame, which isn't how a component should run.

### Gaps
- I found no published, sourced before/after pair that converts a video-style Claude prompt into a component prompt. The examples above are my synthesis and should be presented as such.
- The detailed Charlie Hills workflow (Steps 3–4) is behind a subscription wall, and the Codrops mascot tutorial returned 403, so I couldn't mine either for component-adaptation specifics.

---

## 6. (Scope update) Section map of standout digital-agency sites in 2025–2026, and the motion patterns award-winning agency sites use in each

### Takeaway
Agency homepages still follow a recognizable map: hero/showreel → services → selected work/case studies → results/stats → client logos → process → testimonials → team/culture → big CTA/contact → footer. Award-winning studio sites (Awwwards/FWA/CSSDA) differ in execution, not structure. An Awwwards juror says juries reward singular art direction, "transitions that carry meaning", choreographed scroll pacing, atmospheric (not gratuitous) WebGL, GSAP-driven type, ~60fps on mid-range phones and a reduced-motion path. I found no primary dataset that maps motion patterns to sections, so the per-section mapping below is a synthesis.

### Cited Findings
**What juries reward and what recent winners look like**
- Hon Tran (Awwwards jury member, June 27 2026) lists recent award winners, including UK studio By-Kin, which won Awwwards SOTD, the Developer Award, an FWA and CSSDA Web of the Day, and Australian studio Uncommon Studio, which won SOTD, the Developer Award and an FWA. Patterns he highlights:
  - "transitions that carry meaning" and page-to-page movement treated as camera moves
  - choreographed scroll reveals that pace the narrative
  - WebGL used for "atmospheric lighting rather than spectacle" (Three.js scenes treating projects as spotlit installations)
  - GSAP-driven letter animation (stretching, snapping)
  - disciplined grids
  - Source: [Hon Tran, "10 Best Award-Winning Websites of 2026"](https://www.hontran.dev/blog/best-award-winning-websites-2026) [secondary; juror's opinion]
- The same juror lists jury criteria: singular art direction, meaningful motion choreography "not decorative effects", performance holding ~60fps on mid-range mobile, accessibility (a reduced-motion path) and technical execution under load. — [Hon Tran](https://www.hontran.dev/blog/best-award-winning-websites-2026) [secondary]
- Recent Awwwards SOTD winners in the design-agency category include Meer Mohsin (SOTD + Developer Award, Sep 26 2026), L.I.S.A. by Locomotive (Sep 16 2026), Warm & Fuzzy by Neutral Studio (Sep 12 2026) and HOBRO DIGITAL (Aug 29 2026). — [Awwwards design-agencies](https://www.awwwards.com/websites/design-agencies/) [primary listing]; dates from [Awwwards Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) via search summary [snippet]
- Immersive Garden is cited as an SOTD agency site: black-and-white, minimalist layout, effects and interactive content. — [MyCodelessWebsite](https://mycodelesswebsite.com/agency-websites/) [snippet; the page itself returned a bot wall]

**Section-level interaction patterns**
- The hover-reveal list (a list of rows with a large image panel that changes per hovered row) is described as useful for "agency capabilities pages, portfolio indexes, and 'our work' sections". Cursor-following project previews (image or video that follows the cursor) are sold as off-the-shelf components (e.g. ProjectPeek). Studios such as Kind Heart Design use custom cursors that turn into "View Work" buttons over projects. — [Framer blog: hover effects](https://www.framer.com/blog/hover-effects/), [Framer Marketplace: ProjectPeek](https://www.framer.com/marketplace/components/projectpeek/) [snippets]

**Generic homepage and content guidance (not agency-award specific)**
- An agency homepage must quickly answer "What do you do? Why should I care? What should I do next?" Users "often spend less than 20 seconds" on a homepage at first glance. Core pages: Home, Services, Portfolio, About, Blog, Contact. — [OneNine](https://onenine.com/website-homepage-design-best-practices/), [Hive House Digital](https://hivehousedigital.com/blog/homepage-ux-best-practices/), [Taskip](https://taskip.net/how-to-create-website-for-digital-marketing-agency/) [snippets; generic marketing advice, the 20-second figure is unsourced in the snippet]
- Older roundup (Nov 2023): hero image/video with a clear value proposition, services, client logos as social proof, CTAs above the fold, case studies, team bios. — [Unicorn Platform](https://unicornplatform.com/blog/best-agency-websites/) [secondary; dated]

**Library parts that map to agency sections**
- Marquee/logo walls and infinite moving cards (Aceternity, Magic UI), number tickers/counters (Magic UI), spotlight/3D cards, SplitText. — see Q1 sources: [PkgPulse](https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026)

**Anthropic skill rules that apply**
- Numbered markers are fine "only if the content actually is a sequence — like a stepped process or a timeline". That fits an agency "Process" section and not much else.
- The "big number with a small label, supporting stats, and a gradient accent" hero is flagged as the default treatment.
- Source: [SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]

### Inferences
**Agency section map with motion per section** (synthesized; pick one hero-level "boldness" moment, keep the others restrained):

| Section | Job | Motion patterns seen on award-level studio sites | Restraint / a11y note |
|---|---|---|---|
| Preloader / intro (optional) | Brand moment while assets load | Wordmark draw or counter → curtain wipe into hero | Keep ≤1–1.5s and never block content that is already ready; skip under reduced motion and on repeat visits |
| Hero / showreel | Who you are + proof in 5s | Kinetic headline (SplitText line/word reveals); muted `playsinline` showreel loop or WebGL "atmosphere" (shader/mesh gradient, cursor-reactive); hover "Play reel" cursor that expands into a full player | Headline is server-rendered text (LCP). Reel has poster + pause; no autoplay under reduced motion |
| Services / capabilities | What you sell | Hover-reveal list (row hover swaps an image or video panel); accordion expand with layout animation; subtle line-draw underlines | Hover equals focus; panel content also reachable on touch (tap to expand) |
| Selected work / case studies | Proof | Cursor-follow preview or "View work" cursor; image/video scale-on-hover inside a mask; shared-element page transition from grid card to case-study hero (View Transitions / Motion `layoutId`); a Three.js gallery for flagship studios | Cursor tricks off on `(hover: none)`. Transitions ≤500ms, interruptible; MPA cross-document transitions are progressive enhancement |
| Results / stats | ROI credibility (key for a *marketing* agency) | Count-up numbers on enter; animated chart or sparkline draw; before→after metric flips | Avoid the generic "big number + small label + gradient" hero cliché; tabular numbers to prevent layout shift; final values in HTML |
| Client logos | Social proof | CSS marquee (duplicated track), grayscale→color on hover | Pause on hover/focus; static grid under reduced motion |
| Process | How you work | Sticky scroll story (pinned visual, steps advance via `view()` timeline / ScrollTrigger); numbered steps are legitimate here | No scroll-jacking; content readable without scrubbing |
| Testimonials | Voice of client | Slow crossfade or draggable cards; quote text reveal | No auto-advancing carousel without a pause control |
| Team / culture | Human trust | Portrait hover (color/duotone swap, slight tilt); candid video loops | Alt text; avoid motion-heavy grids |
| CTA / contact | Convert | Oversized kinetic "Let's talk" type, magnetic primary button, form micro-feedback (success state that names the action) | Real `<button>`/`<a>`; visible focus; form motion only on user action |
| Footer | Wayfinding + brand sign-off | Giant wordmark that reveals or parallaxes on reach; local time/clock; marquee of contact | Parallax off under reduced motion |

- **For a *digital marketing* agency** (rather than a pure design studio), the Results/stats and case-study sections carry more conversion weight. The "signature" motion moment might sit in the hero or on the case-study transition. Animating numbers or charts is the natural place to make data feel alive without becoming decorative.
- **Global patterns that recur across sections:**
  - smooth scroll (Lenis) + ScrollTrigger
  - one custom cursor system
  - a consistent page-transition style
  - a single easing "signature" (e.g. one expo-out curve and one spring) reused everywhere, which the motion tokens in Q7 can encode

### Gaps
- I found no primary, quantitative study of which sections or motion patterns appear on award-winning agency sites (Awwwards tag data wasn't extractable from the listing page). The per-section mapping is a synthesis of a juror's observations, component marketplaces and general practice.
- I couldn't fetch FWA or CSSDA listings. The Codrops agency-pattern tutorials (hover reveals, image trails, page transitions) weren't retrievable (403).
- I found no 2026 data on agency-site conversion impact of motion (e.g. whether showreel heroes outperform static ones).

---

## 7. (Scope update) Prompting Claude for graphic ASSETS that stay consistent across a site (SVG illustrations, icon sets, brand shapes, animated backgrounds, OG images)

### Takeaway
Consistency comes from writing the brand down once and making every asset prompt reference it:
- **A token file** (colors, type, radii, stroke, motion), ideally in the now-stable W3C-CG Design Tokens format (2025.10) and mirrored as CSS variables.
- **A short visual-language/"design philosophy" doc** (named style, shape grammar, do/don't list).
- **Per-asset-type technical rules** (e.g. 24px grid, 1.5px stroke, `currentColor`).

Ask for assets in sets, edit one thing per message, and have Claude screenshot new assets beside a reference sheet. Anthropic's own skills follow this pattern: frontend-design's token plan, theme-factory's palette + font-pair themes, canvas-design's philosophy-first two-step.

### Cited Findings
**Token format and Anthropic's skill patterns**
- The Design Tokens Community Group published the first stable Design Tokens Format Module (2025.10) on Oct 28 2025. It supports theming and multi-brand, modern color (Display P3, OKLCH, CSS Color 4), and aliases/component-level references. It is a Community Group report, "not a W3C Standard". — [W3C DTCG announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/), [Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) [primary]
- The frontend-design skill's first pass is a "compact token system": 4–6 named hex colors, typefaces and their roles, a layout concept with ASCII wireframes, and principles. This plan is then reviewed against generic defaults before any code is written. — [SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]
- Anthropic's theme-factory skill defines a theme as "a cohesive color palette with hex codes" + "complementary font pairings", to be applied "consistently throughout" all artifacts. For a custom theme it says: generate it, "show it for review and verification", then apply. — [anthropics/skills theme-factory](https://github.com/anthropics/skills/blob/main/skills/theme-factory/SKILL.md) [primary]
- Anthropic's brand-guidelines skill is a worked example of a machine-usable brand spec: named colors with hex values and roles (main vs accent), heading/body fonts with fallbacks, and rules such as "Non-text shapes use accent colors… cycles through orange, blue, and green". **Note:** that skill encodes *Anthropic's* brand, so it should not be used for the agency site. The frontend-design skill also calls #D97757 terracotta a tell on user briefs. — [brand-guidelines SKILL.md](https://github.com/anthropics/skills/blob/main/skills/brand-guidelines/SKILL.md), [frontend-design SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]
- Anthropic's canvas-design skill works in two steps: first write a named "design philosophy" (an aesthetic movement, 4–6 paragraphs covering space/form, color/material, scale/rhythm, composition, hierarchy) as a .md file, then express it visually. This makes a reusable written art direction that later prompts can cite. — [canvas-design SKILL.md](https://github.com/anthropics/skills/blob/main/skills/canvas-design/SKILL.md) [primary]

**SVG best practices and limits**
- Name the style ("flat vector", "single-line art", "isometric", "editorial spot illustration"), set palette and mood together, request SVG output, change "one thing per message", and request sets together so pieces share weight and spacing. Example: "Give me a flat weather icon set: sun, cloud, rain, snow, lightning. Keep one consistent style." Claude can't reliably do photorealism, painterly or textured work, busy organic scenes, or natural lighting. — [Analytics Vidhya, Jun 22 2026](https://www.analyticsvidhya.com/blog/2026/06/claude-image-generation/) [secondary]
- Community Claude "icon designer" skills encode stroke width (e.g. 1.5px/2px), corner radius, pixel-grid alignment, optical adjustments and color tokens so icons stay cohesive. — [Playbooks: icon-designer skill](https://playbooks.com/skills/eddiebe147/claude-settings/icon-designer), [icon-set-generator skill](https://playbooks.com/skills/jezweb/claude-skills/icon-set-generator) [snippets; third-party skills, unaudited]

**Claude's self-review and OG images**
- Opus 5.5 reads screenshots and diagrams more accurately than Opus 5, and the frontend-design skill tells Claude to "critique your own work… taking screenshots". Both support a render-and-compare loop for assets. — [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5), [SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) [primary]
- OG images in Next.js (v16.3 docs, Aug 2026):
  - `opengraph-image.tsx` + `ImageResponse` from `next/og`, default 1200×630.
  - "Only flexbox and a subset of CSS properties are supported… `display: grid` will not work".
  - Maximum bundle 500KB including fonts and images.
  - Fonts must be `ttf`, `otf` or `woff` (ttf/otf preferred).
  - Generated at build time or per request. Uses Satori + Resvg.
  - Source: [Next.js ImageResponse docs](https://nextjs.org/docs/app/api-reference/functions/image-response) [primary]

### Inferences
**1. Create a single source of truth before generating any asset.** For example, `/brand/tokens.json` (DTCG format) → generated `/styles/tokens.css` (CSS variables) + Tailwind theme, plus `/brand/BRAND.md`. Reference both in CLAUDE.md so every Claude Code session loads them. A suggested BRAND.md skeleton (synthesized):

```text
# Brand spec: {Agency name}
Positioning: {one sentence}. Audience: {who}. Personality: {3 adjectives}.
Color (OKLCH + hex): ink, paper, accent-1, accent-2, signal (data/positive), muted. Ratios: ~70% paper/ink, 20% muted, ≤10% accent.
Type: Display {family, weights, tracking}, Text {family}. Scale: {e.g., 1.333}. Never: {banned fonts}.
Shape grammar: {e.g., "quarter-circles + 8px-radius rectangles on a 12-col grid; no blobs, no glassmorphism"}.
Line: icon stroke 1.5px @24px, round caps/joins; illustration stroke 2px; no gradients inside icons.
Texture/background: {e.g., "fine 2% grain + one OKLCH mesh gradient using accent-1→paper"}.
Motion tokens: ease-out = cubic-bezier(0.16,1,0.3,1); ease-in-out = cubic-bezier(0.65,0,0.35,1);
  spring = {stiffness 300, damping 30}; durations: micro 150ms, ui 300ms, reveal 700ms; stagger 60ms.
Imagery: {photo treatment, e.g., duotone ink/accent-1}. Illustration style name: {e.g., "editorial single-line with flat accent fills"}.
Do / Don't: {lists, including the frontend-design skill's AI-default tells to avoid}.
```

**2. Per-asset prompt templates** (each one starts with "Follow /brand/BRAND.md and /brand/tokens.json exactly"):
- **Icon set:**
  > "Create all N icons in one pass: {list}. 24×24 viewBox, 2px safe padding, stroke 1.5, `stroke="currentColor"`, `fill="none"`, round caps/joins, no transforms, integer or .5 coordinates, consistent optical size. Output individual optimized SVG files plus a contact-sheet HTML page that renders them at 16/24/48px on light and dark. Screenshot the sheet and fix any icon whose weight or size differs."
  - Requesting sets together follows Analytics Vidhya. The technical constraints are common icon-system practice, not sourced here.
- **Spot illustrations:**
  > "Style: {named style from BRAND.md}. Palette: only tokens ink/paper/accent-1/accent-2. Max 3 colors per illustration, flat fills, 2px stroke, no gradients/text/raster. viewBox 0 0 480 360. Make the full set of {k} together so they share line weight and density. Decorative SVGs get `aria-hidden="true"`; meaningful ones get `<title>`. Prefix all ids with `ill-{name}-` to avoid collisions when inlined."
  - Avoid asking for photoreal, painterly or busy scenes (documented limits).
- **Abstract brand shapes / pattern library:**
  > "Derive 6–8 primitives from the shape grammar, then compose 3 hero arrangements and 1 seamless tile (SVG `<pattern>`). Export as React components taking `className` and color props mapped to CSS variables, so the same shapes can animate later (stroke-draw, morph, parallax)."
- **Animated background:**
  > "Use the same tokens as uniforms or CSS variables."
  - Add the Q5 Example B constraints: DPR cap, off-screen pause, reduced-motion static frame, CSS fallback, ≤ N KB.
  - Generate a static PNG/SVG poster from the same code for OG images and reduced motion, so the moving and static versions match.
- **OG images:**
  > "Build `app/opengraph-image.tsx` (and per-route `opengraph-image.tsx` for case studies) using ImageResponse, 1200×630, flexbox only, brand fonts as local .ttf, colors from tokens, the brand shape SVG inlined. Keep under 500KB. Template: title (≤60 chars), client/category, accent shape bottom-right."
  - Vanilla/static-site alternative: a build-time Node script using Satori, or pre-exported PNGs.

**3. Lock consistency with a reference sheet.** After the first approved asset batch, have Claude build `/brand/reference.html` (palette swatches, type scale, icon sheet, illustration thumbnails, shape primitives, motion-curve demos). Later prompts say "match reference.html; screenshot your new asset next to it and list deviations". This uses Opus 5.5's improved screenshot reading and the skill's screenshot-critique step.

**4. Edit, don't regenerate.** Edit one attribute per message (Analytics Vidhya) and keep assets as code (SVG/React/shader) rather than raster, so tokens can be updated globally (e.g. an accent color change propagates via CSS variables).

### Gaps
- I found no official Anthropic guide specifically on generating consistent SVG icon or illustration systems. The guidance combines Anthropic's skills (token plan, themes, design philosophy) with secondary creator tips.
- I didn't fetch the Satori CSS support list or `@vercel/og` limits beyond the Next.js docs summary. Check font subsetting and emoji handling when building.
- I didn't evaluate Claude's raster/AI-image options (e.g. MCP image generators mentioned in creator stacks, or Figma's MCP `generate_image`) for photographic assets. For photography or painterly needs, an image model or stock or commissioned photography is likely required, since Claude's SVG output is documented as weak there.
- I didn't verify the quality of third-party "icon designer" Claude skills. Audit any community skill before installing.
