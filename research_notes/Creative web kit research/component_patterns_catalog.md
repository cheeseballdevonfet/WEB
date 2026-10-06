# Award-Level UI Component Patterns: Implementation Catalogue (October 2026)

Research date: 2026-10-06. This file builds on `/home/user/WEB/research_notes/Claude motion graphics prompts/web_components_techniques.md`, which already covers licensing basics, the performance/accessibility rules (transform/opacity only, one rAF loop, DPR caps, reduced motion, WCAG 2.3.3), the agency section map and Anthropic's frontend-design guidance. None of that is repeated here. Section 1 lists what has changed since then. Sections 2–19 are the pattern catalogue, one component family per section.

**How to read this file**
- **Source tags:**
  - **[primary]**: official docs/spec/vendor page, MDN browser-compat-data (BCD) or the npm registry, fetched directly this session.
  - **[secondary]**: a third-party blog or repo fetched directly.
  - **[digest]**: a third-party README or newsletter (found via GitHub code search) that links to and summarises a Codrops article.
  - **[title-only]**: a Codrops article whose exact title, date and URL are known from its dated URL in a fetched README or digest, but whose body could not be fetched.
  - **[snippet]**: seen only in search-result text.
- **Codrops access:** tympanus.net returned 403 to curl and WebFetch in this session. Its RSS feed returned 410, its WordPress REST API returned 403 and the Wayback Machine reset the connection. Every Codrops URL below is real and dated (taken from READMEs that link to it), but article contents are known only through demo-repo READMEs and digests. Open the article before quoting implementation specifics from it.
- **Pattern cards** sit under each section's *Inferences*. They are implementation synthesis built on the cited findings. "Core trick" lines are my engineering summary unless they carry an inline citation.
- **Card format:** *Look/feel* → *Build* (technique, APIs/libraries, core trick) → *Pitfalls → fixes* (performance and a11y) → *Touch* → *Ref*.
- **Current stable browsers on 2026-10-06** (BCD): Chrome 155 (released 2026-10-06), Firefox 157 (2026-09-29), Safari 27 (2026-09-14). — [BCD browsers/chrome.json](https://github.com/mdn/browser-compat-data/blob/main/browsers/chrome.json), [firefox.json](https://github.com/mdn/browser-compat-data/blob/main/browsers/firefox.json), [safari.json](https://github.com/mdn/browser-compat-data/blob/main/browsers/safari.json) [primary]

---

## 1. Library and browser-API status as of October 2026 (and what changed since the earlier notes)

### Takeaway
- **What moved since the earlier notes:**
  - GSAP is at 3.15 (new `easeReverse`; `yoyoEase` deprecated).
  - Motion jumped to v14 and gained view-transition helpers (`animateView`, `<AnimateView>`) and Three.js/WebGPU "effects".
  - React 19.3 (Sept 9 2026) ships `<ViewTransition>`.
  - CSS anchor positioning now works in all three engines (Firefox 147, Jan 2026).
  - Chrome added CSS scroll-*triggered* animations (`animation-trigger`) and scoped `element.startViewTransition()`.
  - `field-sizing`, `text-box`, `sibling-index()` and `shape()` became cross-engine during 2026.
  - Safari 27 shipped the HTML `<model>` element and customizable `<select>`.
- **What did not move:**
  - Firefox still has no cross-document view transitions and only preview-channel scroll-driven animations.
  - `interpolate-size`/`calc-size()` are Chromium-only.
  - WebGPU exists in every engine but not on every platform (Firefox: Windows and Apple-silicon macOS only; no Linux/Android).
- **Frozen or slow libraries:**
  - Barba.js: last release Aug 2024, but still used in 2026 Codrops tutorials.
  - Theatre.js: last release May 2024; v1 development moved private.
  - lottie-web: May 2025.
  - Howler: Sept 2023.
  - OGL: Jan 2025; small and stable.
- **Active alternatives:** Swup 4.10 and Taxi 2.0 (both Sept 2026) for page transitions; dotLottie-web (weekly releases) instead of lottie-web.

### Cited Findings

**Library versions and licenses** (npm registry, read 2026-10-06; links are to registry JSON) [primary]

| Package | Latest | Published | License | Note |
|---|---|---|---|---|
| [gsap](https://registry.npmjs.org/gsap) | 3.15.0 | 2026-04-13 | "Standard 'no charge' license" | All plugins in public package |
| [@gsap/react](https://registry.npmjs.org/@gsap/react) | 2.1.2 | 2025-01-15 | GSAP standard license | `useGSAP` |
| [motion](https://registry.npmjs.org/motion) / [framer-motion](https://registry.npmjs.org/framer-motion) | 14.0.0 | 2026-10-02 | MIT | Same version for both |
| [lenis](https://registry.npmjs.org/lenis) | 1.3.26 | 2026-08-05 | MIT | `dev` tag 2.0.0-dev.5 |
| [@barba/core](https://registry.npmjs.org/@barba/core) | 2.10.3 | 2024-08-12 | MIT | No release since |
| [swup](https://registry.npmjs.org/swup) | 4.10.0 | 2026-09-03 | MIT | Active alternative |
| [@unseenco/taxi](https://registry.npmjs.org/@unseenco/taxi) | 2.0.0 | 2026-09-27 | BSD-3-Clause | "routing, preloading, and additional script reloading" |
| [three](https://registry.npmjs.org/three) | 0.186.1 (r186) | 2026-09-24 | MIT | |
| [@react-three/fiber](https://registry.npmjs.org/@react-three/fiber) | 9.8.1 | 2026-09-24 | MIT | `alpha` 10.0.0-alpha.5 |
| [@react-three/drei](https://registry.npmjs.org/@react-three/drei) | 10.7.9 | 2026-09-25 | MIT | `alpha` 11.0.0-alpha.7 |
| [postprocessing](https://registry.npmjs.org/postprocessing) / [@react-three/postprocessing](https://registry.npmjs.org/@react-three/postprocessing) | 6.39.5 / 3.1.3 | Sept 2026 | Zlib / MIT | |
| [ogl](https://registry.npmjs.org/ogl) | 1.0.11 | 2025-01-27 | Unlicense | |
| [@theatre/core](https://registry.npmjs.org/@theatre/core) / [@theatre/studio](https://registry.npmjs.org/@theatre/studio) | 0.7.2 | 2024-05-19 | Apache-2.0 / **AGPL-3.0-only** | Studio (editor) is AGPL |
| [@rive-app/canvas](https://registry.npmjs.org/@rive-app/canvas) / [webgl2](https://registry.npmjs.org/@rive-app/webgl2) | 2.44.0 | 2026-09-30 | MIT | react-canvas 4.36.0 |
| [lottie-web](https://registry.npmjs.org/lottie-web) | 5.13.0 | 2025-05-21 | MIT | |
| [@lottiefiles/dotlottie-web](https://registry.npmjs.org/@lottiefiles/dotlottie-web) | 0.81.0 | 2026-10-06 | MIT | react 0.20.0 |
| [@splinetool/runtime](https://registry.npmjs.org/@splinetool/runtime) | 2.0.71 | 2026-10-05 | *(no license field)* | react-spline 4.1.0 (2025-07-15) |
| [@google/model-viewer](https://registry.npmjs.org/@google/model-viewer) | 4.3.1 | 2026-06-04 | Apache-2.0 | |
| [howler](https://registry.npmjs.org/howler) | 2.2.4 | 2023-09-19 | MIT | |
| [tone](https://registry.npmjs.org/tone) | 15.1.22 | 2025-04-27 | MIT | `next` 15.5.57 |
| [@number-flow/react](https://registry.npmjs.org/@number-flow/react) | 0.6.2 | 2026-07-18 | MIT | Animated number component |
| [@paper-design/shaders-react](https://registry.npmjs.org/@paper-design/shaders-react) | 0.0.81 | 2026-09-17 | Apache-2.0 | `MeshGradient`, `DotOrbit` |
| [troika-three-text](https://registry.npmjs.org/troika-three-text) / [three-msdf-text-utils](https://registry.npmjs.org/three-msdf-text-utils) | 0.52.5 / 1.5.0 | Jul / Mar 2026 | MIT / ISC | SDF/MSDF WebGL text |
| [embla-carousel](https://registry.npmjs.org/embla-carousel) | 8.6.0 | 2025-04-04 | MIT | |
| [split-type](https://registry.npmjs.org/split-type) | 0.3.4 | 2023-10-22 | ISC | Stale; GSAP SplitText is free |
| [@use-gesture/react](https://registry.npmjs.org/@use-gesture/react) | 10.3.1 | 2024-03-21 | MIT | Stale |

**GSAP**
- 3.15 (Apr 13 2026) adds `easeReverse`, a tween property that defines a different ease for when the playhead runs backwards.
  - `true` reuses the forward ease "adapted for reverse"; a string gives a different ease.
  - "GSAP recalculates easing from precisely where the playhead changed direction", so it works when interrupted mid-tween.
  - It cascades from timeline `defaults`. The docs recommend it for "Toggleable UI, modals, menus, drawers, tooltips", with a tip to reverse faster: `tl.timeScale(1.5).reverse()`.
  - `yoyoEase` is deprecated and internally replaced by `easeReverse`.
  - Source: [GSAP 3.15 release](https://gsap.com/blog/3-15/) [primary]
- 3.14 (Dec 8 2025) adds:
  - MorphSVG `smooth` (e.g. `smooth: 80` or `"auto"`, which redraws the path with evenly spaced anchors);
  - `curveMode: true` to avoid mid-morph kinks;
  - a new GSAP Demo Hub (first 50 demos).
  - Source: [GSAP 3.14 release](https://gsap.com/blog/3-14/) [primary]
- The release index confirms 3.13 (Apr 29 2025) as the "100% FREE" release. It also dates older APIs: `quickTo()`, Observer and ScrollSmoother arrived in 3.10 (Mar 2022), and `matchMedia()`/`context()` in 3.11. — [GSAP blog index](https://gsap.com/blog/) [primary]
- SplitText (3.13 rewrite, "half the size, 14 new features"):
  - `aria: "auto"` (default) adds `aria-label` to the split element and `aria-hidden` to the generated line/word/char elements.
  - `autoSplit` + `onSplit()` re-splits after fonts load or the width changes, and syncs or cleans up any animation returned from `onSplit`.
  - `mask: "lines" | "words" | "chars"` adds clip wrappers. `deepSlice` handles nested inline elements across lines. `propIndex` adds CSS vars like `--word: 3`. `smartWrap` keeps words together when splitting only chars.
  - Source: [SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) [primary]. This **closes the earlier notes' gap** on SplitText ARIA.
- `useGSAP()` is a drop-in for `useEffect`/`useLayoutEffect` that reverts everything created inside via `gsap.context()`. It takes `{ scope, dependencies, revertOnUpdate }` and needs `"use client"` in the App Router. — [GSAP React guide](https://gsap.com/resources/React/) [primary]

**Motion (motion.dev)**: changelog highlights, 2026 — [CHANGELOG.md](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- 14.0.0 (Oct 2 2026): only removes internal APIs that 13.5.1 had restored for `framer-motion` 13.0–13.4 compatibility. No public API break is listed.
- 13.5.0 (Oct 1 2026):
  - `spring` accepts negative `bounce` (0 to −1) for overdamped springs.
  - `<m>` is 20% smaller.
  - `scroll`/`useScroll` now "use main thread for all `offset` animations".
  - This came a day after 13.4.7 had moved more offsets onto `ViewTimeline`, so the hardware-accelerated scroll path is in flux.
- 13.4.4 (Sept 25): `scroll` is 44% smaller, `useScroll` 33% smaller, scroll callbacks 50% faster. `ScrollTimeline` support for JS callbacks was removed because it "benchmarked no improvement over `scrollInfo`".
- 13.4.0 (Sept 14): `AnimateView`, "View transitions for React 19.3, built on React's `ViewTransition`".
- 13.3.0: spring retargeting takes 80% less time. `animate` is 10% smaller with 20% faster startup.
- 13.2.0 (Sept 3):
  - `animate.addEffect()`;
  - `threeEffect` (`motion/three`), which animates Three.js objects, materials, shader uniforms and TSL uniform nodes;
  - `vgpuEffect` (`motion/vgpu`).
- 13.1.0 (Aug 10): multidimensional `Reorder` with automatic axis detection and RTL.
- 12.43.0 (Jul 27): hardware acceleration for `backgroundColor` and SVG elements.
- 12.41.0 (Jun 23): `animateView` moved from Motion+ early access into the main library.
  - `.add()` auto-generates and removes `view-transition-name`. `.new()`/`.old()`/`.layout()`/`.class()` configure the transition.
  - Group layers auto-crop and animate `border-radius`.
- 12.40.0 (May 21): a `path` option on `transition` and `arc()` for motion along an arc.

**Motion bundle sizes and paid components** (this closes the earlier notes' bundle-size gap)
- `useAnimate` mini is 2.3kb (WAAPI only) and hybrid is 17kb.
- The `motion` component cannot tree-shake below 34kb. `m` + `LazyMotion` is "just under 4.6kb" initial, with `domAnimation` +15kb (animations, variants, exit, tap/hover/focus) and `domMax` +25kb (adds drag and layout).
- Source: [Motion: reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) [primary]
- `<AnimateNumber>` (2.5kb, `Intl.NumberFormat`) and `<Cursor>` (custom, follow and magnetic cursors, built on layout animations) are **Motion+ only** (paid, one-time). — [AnimateNumber](https://motion.dev/docs/react-animate-number), [Cursor](https://motion.dev/docs/cursor) [primary]

**React / Next.js view transitions**
- React 19.3 (Sept 9 2026) "adds new features like View Transitions, Fragment Refs…". — [react.dev blog](https://react.dev/blog) [primary]
- `<ViewTransition>` animates on `enter`/`exit`/`update`/`share`. It is activated only by updates inside a Transition, `<Suspense>` or `useDeferredValue`; a plain `setState` does not trigger it. `name` is only for shared-element pairs. — [react.dev ViewTransition](https://react.dev/reference/react/ViewTransition) [primary]
- Next.js: "View transitions work in the App Router with no configuration." React's integration uses transition types and `view-transition-class` ("Chromium 125+ and recent Safari and Firefox"). — [Next.js view transitions guide](https://nextjs.org/docs/app/guides/view-transitions) [primary]

**Smooth scroll, transitions and editors**
- Lenis README features:
  - It "runs on native scroll", so `position: sticky`, anchors and accessibility keep working.
  - Options include `autoRaf`, `autoToggle`, `anchors`, `allowNestedScroll` (noted to have a performance cost), `stopInertiaOnNavigate`, `prevent(node)`, `virtualScroll`, `syncTouch`, and `infinite` (which needs `syncTouch: true` on touch devices). `respectReducedMotion` defaults to `true`.
  - `data-lenis-prevent[-wheel|-touch|-vertical|-horizontal]` attributes; companion packages `lenis/react`, `lenis/snap` and `lenis/framer`.
  - Source: [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- Barba README still shows a "stability-stable" badge and documents `sync` mode (leave and enter play together). — [Barba README](https://github.com/barbajs/barba) [primary]
- Theatre.js README: "Theatre.js 1.0 is around the corner. We have _temporarily_ moved development to a private repo… Terms and license will remain OSS." — [Theatre README](https://github.com/theatre-js/theatre) [primary]

**Three.js / R3F / WebGPU** (this closes the earlier notes' WebGPU gap)
- `WebGPURenderer` "tries to use a WebGPU backend if the browser supports WebGPU. If not, WebGPURenderer falls back to a WebGL 2 backend." — [three.js WebGPURenderer docs](https://threejs.org/docs/pages/WebGPURenderer.html) [primary]
- R3F: v8 pairs with React 18 and v9+ with React 19. Its README says: "With minor changes in v9 and significant work in v10 WebGPU support is first class. We support all ThreeJS WebGPU features/Nodes." — [R3F v10 readme](https://github.com/pmndrs/react-three-fiber/blob/v10/readme.md) [primary]. v10 is still `alpha` on npm.
- web.dev (Nov 25 2025): WebGPU is "officially supported across Chrome, Edge, Firefox, and Safari". [web.dev](https://web.dev/blog/webgpu-supported-major-browsers) [primary]
  - Chrome/Edge 113 on Windows, macOS and ChromeOS; Android from 121 (Android 12+, Qualcomm/ARM GPUs).
  - Firefox 141 on Windows; Firefox 145 on macOS Tahoe ARM64.
  - Safari on macOS/iOS/iPadOS/visionOS 26.
- BCD adds: Chrome 144 on Linux (Intel Gen12+ only); Firefox 147 on older Apple-silicon macOS; Firefox has no Linux and no Intel-Mac support. — [BCD api/GPU.json](https://github.com/mdn/browser-compat-data/blob/main/api/GPU.json) [primary]
- Safari 27 adds WGSL `clip_distances`. — [WebKit: Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) [primary]

**Rive, Lottie/dotLottie, Spline**
- Rive's web runtime is a JS/WASM library with high- and low-level APIs. Its docs index lists State Machines, **Data Binding**, Rive Events and Layout. — [rive-wasm README](https://github.com/rive-app/rive-wasm) [primary]
- Data Binding: "Connect your code to bound editor elements using View Models". It exposes text, number, boolean, image, list and artboard properties, with `autoBind` and `viewModelInstance` on web. — [Rive data binding](https://rive.app/docs/runtimes/data-binding) [primary, via WebFetch summary]
- Rive Scripting uses **Luau** for procedural drawing, custom layout, listeners and data-binding integration. — [Rive scripting](https://rive.app/docs/scripting/getting-started) [primary, via WebFetch summary]
- dotlottie-web features (per its README):
  - A Rust + WASM core powered by ThorVG, with Software (Canvas2D), WebGL2 and experimental WebGPU backends.
  - dotLottie v2 theming, state machines and audio; slots (color, scalar, vector, gradient, text, image).
  - `DotLottieWorker`, which renders off the main thread on `OffscreenCanvas`.
  - Source: [dotlottie-web README](https://github.com/LottieFiles/dotlottie-web) [primary]
- Spline pricing (page read 2026-10-06):
  - Free: "Web exports with watermark".
  - Hobby: $12/seat/mo billed yearly ($15 monthly); "No watermark on web exports".
  - Pro: $25 ($30); "No watermark on web embeds", video export, Apple & Android exports, unlimited variables/APIs/webhooks.
  - Max: $60 ($70).
  - Enterprise (custom pricing) is the only card that lists **"Code & Self-hosted exports"**.
  - Source: [Spline pricing](https://spline.design/pricing) [primary]

**CSS / DOM feature support** (BCD main branch, read 2026-10-06; release dates from BCD browser files) [primary]

| Feature | Chrome | Safari | Firefox | Status |
|---|---|---|---|---|
| `animation-timeline: scroll()/view()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json)) | 115 | 26 | preview only | **Not Baseline** (unchanged) |
| `animation-trigger` / `timeline-trigger` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-trigger.json)) | 146 | – | – | Chrome-only, experimental |
| `@view-transition` cross-document ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/view-transition.json)) | 126 | 18.2 | – (bug 1860854) | Unchanged |
| `view-transition-name: match-element` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/view-transition-name.json)) | 137 | 18.4 | 144 | All engines |
| `document.activeViewTransition` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/api/Document.json)) | 142 | 26.2 | 147 (2026-01-13) | All engines |
| Scoped `Element.startViewTransition()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/api/Element.json)) | 147 (2026-04-07) | – | – | Chrome-only |
| Nested `view-transition-group` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/view-transition-group.json)) | 140 | – | – | Chrome-only |
| Anchor positioning `anchor-name` / `position-area` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/anchor-name.json)) | 125 / 129 | 26 | 147 (2026-01-13) | **All engines since Jan 2026** |
| `@starting-style` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/starting-style.json)) / `transition-behavior` | 117 | 17.5 / 17.4 | 129 | All engines since Aug 2024 |
| `popover` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/html/global_attributes.json)) | 114 | 17 | 125 | All engines since Apr 2024 |
| `popover="hint"` | 151 (133–150 partial) | preview | 153 (149–152 partial) | Not in Safari |
| `commandfor` / command invokers ([BCD](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLButtonElement.json)) | 135 | 26.2 (2025-12-12) | 144 | All engines since Dec 2025 |
| `interestfor` (interest invokers) | 142 | – | – | Chrome-only |
| `<dialog closedby>` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/html/elements/dialog.json)) | 134 | preview | 141 | Not in Safari stable |
| `interpolate-size` / `calc-size()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/interpolate-size.json)) | 129 | – | – | Chromium-only (unchanged) |
| `field-sizing` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/field-sizing.json)) | 123 | 26.2 | 152 (2026-06-16) | All engines since Jun 2026 |
| `text-box` (trim) ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-box.json)) | 133 | 18.2 | 154 (2026-08-18) | All engines since Aug 2026 |
| `sibling-index()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/types/sibling-index.json)) | 138 | 26.2 | 154 | All engines since Aug 2026 |
| `shape()` (clip-path) ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/types/basic-shape.json)) | 135 | 18.4 | 148 (2026-02-24) | All engines since Feb 2026 |
| `@property` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/property.json)) | 85 | 16.4 | 128 | All engines since Jul 2024 |
| `corner-shape` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/corner-shape.json)) | 139 | preview | preview | Chrome-only |
| `::scroll-marker` / `::scroll-button` carousels ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/scroll-marker.json)) | 135 | – | – | Chrome-only |
| `@container scroll-state()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/container.json)) | 133 | – | – | Chrome-only |
| `scrollsnapchange` event | 129 | – | – | Chrome-only |
| `appearance: base-select` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/appearance.json)) | 135 | 27 | 149 (flag) | Chrome + Safari |
| `<model>` element ([BCD](https://github.com/mdn/browser-compat-data/blob/main/html/elements/model.json)) | – | 27 | – | Safari-only |
| `Navigator.vibrate()` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json)) | 32 | never | removed in 129 | Effectively Chromium/Android-only |
| `navigator.getAutoplayPolicy()` | – | – | 112 | Firefox-only |
| `prefers-reduced-transparency` ([BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/media.json)) | 118 | – | flag | Chrome-only |

- **The Chrome blog and BCD disagree on scroll-triggered animations.** The Chrome blog (Dec 12 2025) said they would land "in Chrome 145"; BCD records `animation-trigger` in 146. Cite BCD for the version.
  - Syntax: `animation-trigger: --t play-forwards play-backwards`, plus `timeline-trigger-name`/`-source: view()`, activation and active ranges (`contain` / `cover`), and `trigger-scope`. The post's demo ships an IntersectionObserver fallback.
  - Source: [Chrome: scroll-triggered animations](https://developer.chrome.com/blog/scroll-triggered-animations) [primary]
- Safari 27 (Sept 2026) adds:
  - the HTML `<model>` element (USDZ/GLB `<source>`, `environmentmap`, `stagemode`, and an Immersive API that replaces "Spatial Backdrop");
  - customizable `<select>` via `appearance: base-select`;
  - scroll anchoring (`overflow-anchor`);
  - transform-aware anchor positioning; the `position-anchor` default changes from `auto` to `normal`;
  - a fix for `display` transitions animating popovers/dialogs incorrectly on close.
  - Source: [WebKit: Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) [primary]
- HTML-in-Canvas (render live DOM into canvas/WebGL) is in a Chrome origin trial: "Intent to Experiment (M148–M151)". It is explored in Codrops "Exploring the HTML-in-Canvas Proposal" (May 13 2026). — [digest: open-worship-app README](https://github.com/OpenWorshipApp/open-worship-app-dt) citing [Codrops](https://tympanus.net/codrops/2026/05/13/exploring-the-html-in-canvas-proposal/) [digest/title-only]

### Inferences
**Updates to the earlier notes' decision guide:**
1. **Overlays, menus and tooltips:** default to native `popover` / `<dialog>` + `@starting-style` + `transition-behavior: allow-discrete` + anchor positioning. All of these are cross-engine now, and they bring top-layer, light-dismiss and focus handling for free. Keep GSAP (`easeReverse`) or Motion for choreography inside the overlay.
2. **Scroll reveals:** CSS `view()` timelines and `animation-trigger` are still progressive enhancement (Firefox lacks scroll timelines; triggers are Chrome-only). Prompts should demand an IntersectionObserver or ScrollTrigger fallback inside `@supports not (animation-timeline: view())`.
3. **React route/shared-element transitions:** React 19.3 `<ViewTransition>` (Next.js App Router needs no config), or Motion `<AnimateView>` / `animateView()` when you want springs and interruption.
   - Keep Motion `layoutId` for in-page shared layouts that must work identically everywhere.
   - Firefox still won't animate MPA navigations, so treat MPA view transitions as progressive enhancement.
4. **New WebGL work:** `three/webgpu` `WebGPURenderer` + TSL is the 2026 Codrops default (see the 15+ WebGPU/TSL articles below). Its automatic WebGL2 fallback makes it safe. Plain `WebGLRenderer` + GLSL remains fine for simple shader heroes. R3F v10 (WebGPU-first) is alpha, so production R3F stays on v9.
5. **Library hygiene for prompts:**
   - Don't pick split-type or @use-gesture for new builds (stale). Use GSAP SplitText (free, ARIA-aware) or Motion's split-text tutorials, and Motion drag or GSAP Observer/Draggable.
   - Barba still works but is frozen. Prefer native view transitions, or Swup/Taxi if you need a JS router with hooks.
   - Theatre.js Studio is AGPL and unmaintained publicly, so use it only for authoring, or avoid it.

### Gaps
- No bundle sizes measured for GSAP core/ScrollTrigger, three, R3F, Rive or dotLottie WASM; bundlephobia was not fetched. Lenis says only "a few KB".
- Rive pricing: the Framer-rendered pricing page showed "$32/seat/mo" and "$20/seat monthly Agent credits" but couldn't be mapped to plan names. Rive's editor and export licensing tiers remain unverified.
- Spline runtime license: the npm package has no `license` field and I found no runtime license page. Check Spline's Terms before self-hosting exports.
- No Firefox ship date found for scroll-driven animations or cross-document view transitions (both are Interop 2026 focus areas per the earlier notes).
- GitHub release notes for three r186 and R3F were not readable (the API was blocked for those repos), so the per-release change lists are missing.
- "vgpu" (used by Motion's `vgpuEffect` and Codrops' "Building Vercel's Prism with vgpu", Sept 3 2026) is not identified: maintainer and license unknown.

---

## 2. Hero / first screen

### Takeaway
In 2026, award-level heroes fall into five builds:
- one atmospheric shader canvas *behind* server-rendered type;
- a kinetic type lockup;
- a pinned "scroll-into" hero that zooms or unmasks into the next section;
- a cursor-reactive image (lens, relight, displacement);
- a data/CMS-driven timeline hero.

The craft lessons in the case studies are restraint ("knowing when to stop adding") and keeping the shader from competing with reading.

### Cited Findings
- Codrops "Magnetic Commerce: Building the Dash Creative Website" (Jul 21 2026), as summarised by a digest:
  - "The shader sits behind the type so it does not compete with reading."
  - A soft falloff replaces a hard edge; distortion "gradually loses momentum before returning to its resting state".
  - "Knowing when to stop adding": small timing, easing and copy changes beat new effects.
  - Source: [digest: SafeAI.Watch README](https://github.com/ryanportfolio/SafeAI.Watch) citing [Codrops](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/) [digest]
- Codrops "Building a Layered Zoom Scroll Effect with GSAP ScrollSmoother and ScrollTrigger" (Oct 29 2025) recreates Telescope's "smooth, layered zoom scroll animation… cinematic, depth-filled". Demo: tympanus.net/Tutorials/TelescopeZoom/. — [repo README joffreysp/telescope-zoom](https://github.com/joffreysp/telescope-zoom) [secondary]
- Codrops "How to Animate WebGL Shaders with GSAP: Ripples, Reveals, and Dynamic Blur Effects" (Oct 8 2025). — [repo README](https://github.com/biazo/codrops-animate-shaders-with-gsap) [secondary]
- Codrops "Building a Mouse-Following Square Lens Effect with Three.js and GLSL" (Aug 25 2026); demo tympanus.net/Tutorials/MouseFollowingSquareLensEffect/. — [repo README](https://github.com/tomoyukinakata/mouse-following-square-lens-effect) [secondary]
- Codrops "Relighting Images with Depth Maps and Three.js" (Aug 19 2026): TSL/WebGPU, normals from depth via central differences, plus a luminance-gradient detail term. Repo: DGFX/codrops-relightning-images. — [digest: Sersan notes](https://github.com/SerSan-AI-Studio/Sersan) [digest]
- Codrops "Building an Animated Testimonial Hero Using the GSAP Timeline and Dynamic CMS Data" (Aug 18 2026). — [Codrops](https://tympanus.net/codrops/2026/08/18/building-an-animated-testimonial-hero-using-the-gsap-timeline-and-dynamic-cms-data/) [title-only]
- Codrops "WebGL for Designers: Creating Interactive Shader-Driven Graphics Directly in the Browser" (Mar 4 2026) highlights Unicorn Studio, a no-code shader tool. — [digest: globestudio](https://github.com/alevizio/globestudio) [digest]
- Stylised shader backdrops on Codrops:
  - "Efecto: Building Real-Time ASCII and Dithering Effects with WebGL Shaders" (Jan 4 2026) — [Codrops](https://tympanus.net/codrops/2026/01/04/efecto-building-real-time-ascii-and-dithering-effects-with-webgl-shaders/) [title-only]
  - "Interactive WebGL Backgrounds: A Quick Guide to Bayer Dithering" (Jul 30 2025) — [Codrops](https://tympanus.net/codrops/2025/07/30/interactive-webgl-backgrounds-a-quick-guide-to-bayer-dithering) [title-only]
- Ready-made shader components: `@paper-design/shaders-react` exports `MeshGradient` and `DotOrbit` (Apache-2.0, v0.0.81 Sept 2026, so pre-1.0). — [npm](https://registry.npmjs.org/@paper-design/shaders-react) [primary]
- Motion 13.2 `threeEffect` can tween Three.js materials, shader uniforms and TSL uniform nodes with Motion's springs. — [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- Video heroes:
  - "Muted autoplay is always allowed" in Chrome — [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay) [primary]
  - Safari autoplay needs `playsinline` — [MDN Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) [primary]

### Inferences (pattern cards)
**H1. Atmospheric shader field behind live type**
- *Look/feel:* A slow noise or mesh gradient (or dither/ASCII field) fills the first screen. It bends gently toward the cursor and eases back. Big HTML headline on top.
- *Build:*
  - One full-viewport `<canvas>` behind the content: OGL, raw WebGL, `three/webgpu` + TSL, or Paper `MeshGradient`. Uniforms: `uTime`, `uMouse` (lerped), `uScroll`, plus palette from CSS variables.
  - Mouse influence = a uniform that springs to the target and decays (Motion `threeEffect`/`springValue`, or `gsap.quickTo` on a proxy object).
  - **Core trick:** the headline stays DOM text (LCP, SEO, a11y). The shader samples a low-res FBO and only reacts to pointer *velocity*, so it calms when the user stops.
- *Pitfalls → fixes:*
  - LCP regressions from canvas-first render: paint the CSS gradient poster first, then lazy-init the canvas.
  - GPU drain: cap DPR at 1.5–2, pause on IntersectionObserver and `visibilitychange`, render at half resolution and upscale.
  - Contrast: put a scrim behind the text; test WCAG contrast against the brightest shader frame.
  - Reduced motion: freeze on a static frame.
- *Touch:* no hover, so drive `uMouse` from scroll or device tilt, or idle drift. Keep it to a single, cheap pass on mobile.
- *Ref:* [Codrops Dash case study](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/), [Animating WebGL shaders with GSAP](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects), [three WebGPURenderer](https://threejs.org/docs/pages/WebGPURenderer.html).

**H2. Kinetic type lockup**
- *Look/feel:* Oversized headline lines rise out of masks. Letters stretch or snap, settling into a tight grid, then idle.
- *Build:*
  - GSAP SplitText `{ type: "lines,words", mask: "lines", autoSplit: true, onSplit(self){ return gsap.from(self.lines,{yPercent:110, stagger:0.08, ease:"expo.out"}) } }`.
  - Trim display type with `text-box: trim-both cap alphabetic` (cross-engine since Aug 2026) so the masks hug the glyphs.
  - **Core trick:** `mask: "lines"` + `autoSplit` gives correct line masks after font load and resize, without manual wrappers ([SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)).
- *Pitfalls → fixes:*
  - Splitting before fonts load creates wrong line breaks: use `autoSplit` and `onSplit`.
  - Screen readers: SplitText's default `aria: "auto"`.
  - CLS: the headline occupies its final box from first paint; animate transforms only.
- *Touch:* identical. Shorten total duration on small screens.
- *Ref:* SplitText docs; section 6.

**H3. Scroll-into hero (layered zoom / unmask)**
- *Look/feel:* The hero is pinned. Scrolling zooms through stacked layers (foreground scales fastest) or grows a masked window until it becomes the next section.
- *Build:*
  - ScrollTrigger `pin: true, scrub: 1` timeline. Each layer gets a different `scale`/`z`. Optionally ScrollSmoother `data-speed` for depth.
  - Mask variant: animate an SVG `<mask>` or `clip-path: inset()/circle()` from small to full.
  - **Core trick:** one master timeline with layers starting at the same label but scaling at different rates; `scrub` (seconds of catch-up) gives the cinematic lag ([ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)).
- *Pitfalls → fixes:*
  - Pin jitter: use `anticipatePin`, or ScrollSmoother, which "avoids… the occasional 'jitter' of a pinned element" ([ScrollSmoother docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/)).
  - Huge scale on large images: pre-size the assets and use `will-change` only during the pin.
  - Vestibular risk: under reduced motion, replace the zoom with a crossfade.
- *Touch:* `normalizeScroll: true` stops address-bar resize jumps. Shorten the pin distance on mobile.
- *Ref:* [Layered zoom tutorial](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger), [repo](https://github.com/joffreysp/telescope-zoom).

**H4. Cursor-reactive image (lens / relight / displacement)**
- *Look/feel:* A hero photo where a square lens, light source or ripple follows the cursor, revealing an alternate image, a relit version or a refraction.
- *Build:* three.js plane with two textures (or texture + depth map). The fragment shader computes the lens mask from `uMouse` (SDF box/circle with smoothstep edge) and mixes the textures. For relight, compute normals from the depth map and dot them with the light direction.
- *Pitfalls → fixes:* never put meaningful text inside the image (it isn't readable by AT); keep the `<img>` in the DOM with `alt` as the canvas's source and fallback; lerp the mouse to avoid INP-heavy handlers.
- *Touch:* tap-and-drag moves the lens; otherwise auto-orbit.
- *Ref:* [Square lens](https://tympanus.net/codrops/2026/08/25/building-a-mouse-following-square-lens-effect-with-three-js-and-glsl/), [Relighting with depth maps](https://tympanus.net/codrops/2026/08/19/relighting-images-with-depth-maps-and-three-js/).

**H5. Showreel hero that expands into a player**
- *Look/feel:* A muted loop in a framed tile. The cursor becomes "Play reel"; a click grows the tile to fullscreen with sound and controls.
- *Build:* `<video muted playsinline loop autoplay poster>` (muted autoplay is allowed per Chrome; `playsinline` per MDN). On click, Flip.fit or Motion `layoutId` moves the tile to a fullscreen `<dialog>`, then unmutes inside the click handler (a user gesture, so audio is permitted).
- *Pitfalls → fixes:* serve short H.264/AV1 at 720p for the loop; show the poster under reduced motion and for `Save-Data`; captions on the full player; focus moves into the dialog and returns on close.
- *Touch:* tap to expand; no hover label.
- *Ref:* [Chrome autoplay](https://developer.chrome.com/blog/autoplay), [Flip docs](https://gsap.com/docs/v3/Plugins/Flip/).

**H6. Data/CMS-driven timeline hero**
- *Look/feel:* The hero cycles client quotes, logos and metrics as a choreographed sequence built from CMS entries.
- *Build:* build the GSAP timeline at runtime from an array (one `addLabel` per item), `repeat: -1`, pausable.
- *Pitfalls → fixes:* WCAG 2.2.2 requires a pause/stop for auto-moving content lasting more than 5s ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)); render all entries in HTML for SEO.
- *Ref:* [Codrops testimonial hero](https://tympanus.net/codrops/2026/08/18/building-an-animated-testimonial-hero-using-the-gsap-timeline-and-dynamic-cms-data/).

### Gaps
- None of the Codrops hero articles could be read directly. Their shader specifics (falloff curves, uniform names) are known only from digests.
- I found no field data on whether shader heroes hurt conversion or Core Web Vitals in 2026.

---

## 3. Navigation, menus and overlays

### Takeaway
The 2026 baseline for overlays is native: `popover`/`<dialog>` for top-layer, light-dismiss and focus; `@starting-style` + `transition-behavior: allow-discrete` for enter/exit; anchor positioning for dropdowns, tooltips and mega-menus (all engines since Jan 2026); and `commandfor` to open them without JS (all engines since Dec 2025). Award-level menus layer choreography on top. GSAP 3.15 `easeReverse` was designed for exactly this case: menus that open with one feel and close with another, even when interrupted.

### Cited Findings
- `popover`, `@starting-style`, `transition-behavior`, anchor positioning and `commandfor` support: see the Section 1 table [BCD, primary].
- `easeReverse` targets "Toggleable UI, modals, menus, drawers, tooltips", recalculates from where the playhead reversed, and pairs with `timeScale(1.5).reverse()` for a snappier close. Its release post includes a radial-menu demo. — [GSAP 3.15](https://gsap.com/blog/3-15/) [primary]
- Codrops "A Playful Clip Menu with GSAP's easeReverse" (Apr 22 2026); demo tympanus.net/Development/EaseReverseClipMenu/. — [Codrops](https://tympanus.net/codrops/2026/04/22/a-playful-clip-menu-with-gsaps-easereverse), [repo README](https://github.com/codrops/EaseReverseClipMenu) [secondary]
- Safari 27:
  - fixed "display property transitions caused popovers and `<dialog>` elements to animate incorrectly when closing";
  - made anchor positioning transform-aware;
  - changed the `position-anchor` default to `normal`;
  - added `anchors-valid`/`anchors-visible` handling.
  - Source: [WebKit Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) [primary]
- `popover="hint"` is full in Chrome 151 and Firefox 153 (older builds partial), preview-only in Safari. `interestfor` (hover/focus-triggered popovers) is Chrome 142+ only. `<dialog closedby>`: Chrome 134, Firefox 141, Safari preview. — [BCD](https://github.com/mdn/browser-compat-data/blob/main/html/global_attributes.json) [primary]
- Scroll locking with smooth scroll: Lenis `data-lenis-prevent` and `prevent: (node) => node.id === 'modal'` let overlays scroll natively. — [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- ScrollSmoother: `position: fixed` elements must sit outside `#smooth-content`. — [ScrollSmoother docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) [primary]
- Motion `layoutId` "underline" pattern for shared indicators. — [Motion layout animations](https://motion.dev/docs/react-layout-animations) [primary]

### Inferences (pattern cards)
**N1. Full-screen clip-path takeover menu**
- *Look/feel:* The burger morphs to an X. A panel wipes in (`clip-path: inset(0 0 100% 0)` → `inset(0)` or a circle from the button). Links rise line by line with large type; the hovered link pushes the others or shows an image preview. Closing is quicker and uses a different ease.
- *Build:*
  - `<button commandfor="menu" command="toggle-popover">` + `<nav id="menu" popover>`; GSAP timeline on the `toggle` event.
  - `ease: "expo.out", easeReverse: "power3.in"` on the timeline defaults; `tl.reversed() ? tl.timeScale(1).play() : tl.timeScale(1.5).reverse()`.
  - **Core trick:** reuse one timeline for open and close, so interruptions (mash-clicking) reverse from the current point with the right ease ([GSAP 3.15](https://gsap.com/blog/3-15/)).
- *Pitfalls → fixes:*
  - Focus: popover gives light-dismiss but not a focus trap. For a modal-style menu use `<dialog>` + `showModal()` (inert background).
  - `aria-expanded` is handled automatically for popover invokers (a browser behavior, not verified this session); otherwise set it manually.
  - Stop Lenis (`lenis.stop()`) while open.
  - Reduced motion: opacity-only fade.
- *Touch:* the same panel; links ≥44px tall; disable hover previews.
- *Ref:* [Codrops clip menu](https://tympanus.net/codrops/2026/04/22/a-playful-clip-menu-with-gsaps-easereverse).

**N2. Zero-JS animated popover or dialog**
- *Look/feel:* Panels scale and fade from their trigger; the backdrop blurs in; everything reverses on dismiss.
- *Build:* `[popover]{transition: opacity .2s, transform .2s, overlay .2s allow-discrete, display .2s allow-discrete} [popover]:popover-open{opacity:1; transform:none} @starting-style{[popover]:popover-open{opacity:0; transform:scale(.96)}}`. Same pattern for `dialog[open]` and `::backdrop`.
- *Pitfalls → fixes:* in older Safari, exit animations misbehaved (fixed in 27), so accept a hard close there. Keep it under 250ms.
- *Touch:* bottom-sheet variant via `position-area`/media query; swipe-to-dismiss needs JS (Motion `drag="y"`).
- *Ref:* [BCD @starting-style](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/starting-style.json), [WebKit 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/).

**N3. Anchor-positioned dropdown, tooltip or mega-menu**
- *Look/feel:* Menus that hug their trigger, flip when near an edge, and slide a shared highlight between items.
- *Build:* `anchor-name: --nav-products` on the trigger; `position-anchor: --nav-products; position-area: bottom span-right; position-try-fallbacks: flip-block` on the popover. Optional sliding highlight: one absolutely-positioned element re-anchored to the hovered item (its `anchor-name` changes on hover, with `transition` on inset properties).
- *Pitfalls → fixes:* in Safari before 27, transformed anchors were ignored and `position-anchor: auto` side effects existed (fixed in 27); test both. Provide a keyboard path (arrow keys) and `Esc`.
- *Touch:* tap opens the panel; hover-intent delays are irrelevant there.
- *Ref:* [BCD anchor-name](https://github.com/mdn/browser-compat-data/blob/main/css/properties/anchor-name.json), [WebKit 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/).

**N4. Hide-on-scroll-down / reveal-on-scroll-up header**
- *Look/feel:* The header slides away while reading and returns on the slightest upward scroll, gaining a solid background once scrolled.
- *Build:* track scroll direction with ScrollTrigger `onUpdate: self => self.direction` or Lenis `lenis.direction`, then toggle `translateY(-100%)`. The "scrolled" state can use CSS `@container scroll-state(scrolled: top)` in Chrome only, so keep the JS fallback.
- *Pitfalls → fixes:* don't hide it while focus is inside the header; skip-link target stays visible; reduced motion = instant toggle.
- *Touch:* same; respect iOS rubber-banding (ignore negative scroll).

**N5. Morphing active-indicator (pill or underline)**
- *Look/feel:* The active pill glides and resizes between nav items or tabs.
- *Build:* Motion `<motion.span layoutId="nav-pill">` rendered inside the active item ([Motion layout](https://motion.dev/docs/react-layout-animations)). Vanilla: `view-transition-name` on the pill plus `document.startViewTransition()` (same-document is cross-engine).
- *Pitfalls → fixes:* use `aria-current="page"`; the pill is decorative.

### Gaps
- I didn't fetch MDN pages on popover focus management or on `aria-expanded` automation for invokers. The note above is from general knowledge and should be verified.
- I found no 2026 Codrops article on mega-menus or anchor positioning specifically.

---

## 4. Cursor and pointer effects

### Takeaway
The 2026 cursor vocabulary:
- a small blend-mode cursor that turns into contextual labels ("View", "Drag", "Play");
- magnetic targets;
- image trails (now with physics/gravity);
- WebGL flowmap or fluid distortion under the pointer;
- lens/spotlight reveals.

All are pointer-only enhancements: build them behind `(hover: hover) and (pointer: fine)`, never hide the system cursor without a fallback, and keep handlers to "write a value; read it in rAF".

### Cited Findings
- Motion+ `<Cursor>`: "replace the default browser cursor, create engaging follow-cursor animations, or add magnetic…"; "Built on Motion's layout animations". Paid (Motion+). — [Motion Cursor](https://motion.dev/docs/cursor) [primary]
- Codrops "Made With GSAP: Building a Fun Gravity-Based Mouse Trail" (May 20 2026). — [Codrops](https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/) [title-only]
- A digest describes the classic image-trail principle as "every time mouse travel **distance** passes a threshold, show the next image" and links the original Codrops "Image Trail Effects" (**2019, older**), demo tympanus.net/Development/ImageTrailEffects/. — [digest: oh-my-design](https://github.com/kwakseongjae/oh-my-design) [digest]
- `gsap.quickTo()` (since 3.10) is GSAP's helper for high-frequency retargeting such as cursor followers. — [GSAP blog index](https://gsap.com/blog/) [primary]
- GSAP Observer:
  - unifies wheel, touch and pointer deltas per rAF tick ("debounced for performance by default");
  - `tolerance`, `lockAxis`, and a minimum drag distance so tiny finger presses aren't read as drags;
  - callbacks `onHover`, `onMove`, `onDrag`, `onStop`.
  - Source: [Observer docs](https://gsap.com/docs/v3/Plugins/Observer/) [primary]
- WebGL pointer distortion on Codrops: "Mouse Flowmap Deformation with OGL" and an OGL fluid-distortion hover demo (older; author and tag pages surfaced in search). — [Codrops author page](https://tympanus.net/codrops/author/robin) [snippet; older]
- Square lens following the mouse (Aug 25 2026). — [repo README](https://github.com/tomoyukinakata/mouse-following-square-lens-effect) [secondary]

### Inferences (pattern cards)
**C1. Blend-mode cursor with contextual labels**
- *Look/feel:* A 10px dot (or ring) with `mix-blend-mode: difference` trails the pointer. Over project cards it grows into a 96px disc reading "View"; over sliders, "Drag"; over video, "Play".
- *Build:*
  - Fixed `div` with `pointer-events: none`. `pointermove` stores x/y; a `gsap.quickTo(el,"x",{duration:.35,ease:"power3"})` pair renders it.
  - State via `data-cursor="view"` on targets (event delegation on `pointerover`). Scale and label through CSS classes.
  - **Core trick:** the dot uses `transform` only and the label is pre-rendered, so a state change is a class flip, not a layout.
- *Pitfalls → fixes:*
  - Never set `cursor: none` globally: keep the native cursor on text inputs and links, or at least restore it on `:focus-visible`.
  - Give the label an `aria-hidden` element; the real link text carries meaning.
  - Hide on `pointerleave` of the document.
- *Touch:* don't render it (`@media (hover: none)`). Labels become visible captions or icons on cards.
- *Ref:* [Motion Cursor](https://motion.dev/docs/cursor), [GSAP quickTo (3.10)](https://gsap.com/blog/).

**C2. Magnetic buttons and links**
- *Look/feel:* Within ~80px the button leans toward the pointer (max 6–12px); its label moves a bit further (parallax). It springs back on leave.
- *Build:* on `pointermove` inside an expanded hit area, `dx = (x - cx) * 0.3`; `quickTo` for the button and `0.5×` for the inner label. Elastic or spring return on `pointerleave` (Motion `useSpring` or GSAP `elastic.out(1,0.4)`).
- *Pitfalls → fixes:* the moving target must not move away from the click point (cap the offset); include `:focus-visible` styles; disable under reduced motion.
- *Touch:* off; use the `:active` press scale instead.

**C3. Image trail (classic and gravity variants)**
- *Look/feel:* Moving the pointer stamps a sequence of project images that fade, shrink or fall with gravity and bounce off the viewport floor.
- *Build:*
  - A pool of N `<img>` (reuse, don't create). On each rAF, compare the distance travelled since the last stamp to a threshold. When it's exceeded, take the next pooled image and animate from pointer position to fade/scale-out.
  - Gravity variant: give each stamp `vx`/`vy` from pointer velocity, then integrate gravity in the ticker, or use GSAP InertiaPlugin/physics.
  - **Core trick:** distance-threshold spawning, not time-based (per the digest), keeps density constant regardless of speed.
- *Pitfalls → fixes:* decode images ahead of time (`img.decode()`); cap concurrent stamps (8–12); `aria-hidden` on the layer; disable under reduced motion.
- *Touch:* drive with `pointermove` while dragging on a dedicated area, or replace with a tap-to-cycle gallery.
- *Ref:* [Gravity trail (2026)](https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/), Image Trail Effects (2019, older; via the digest).

**C4. WebGL flowmap or fluid distortion under the pointer**
- *Look/feel:* The page (or an image) ripples like liquid where the pointer passes, settling over ~1s.
- *Build:* ping-pong render targets storing a velocity "flowmap" that decays each frame (OGL ships a `Flowmap` helper; Codrops flowmap tutorials are older). The image shader offsets UVs by the flowmap.
- *Pitfalls → fixes:* full-screen ping-pong is fill-rate heavy, so run the flowmap at 128–256px resolution; pause off-screen.
- *Touch:* works with touch-move; keep it subtle.

**C5. Spotlight or lens reveal (CSS-only version)**
- *Look/feel:* A circular window reveals a second layer (colour photo over greyscale, or "x-ray" text) following the cursor.
- *Build:* write `--x`/`--y` custom properties on `pointermove`; `mask-image: radial-gradient(circle 120px at var(--x) var(--y), #000 99%, transparent)` on the top layer. Register `--x`/`--y` with `@property` (cross-engine) if you want to transition them.
- *Pitfalls → fixes:* mask repaint cost on large layers, so constrain the element size; reduced motion = static split.

### Gaps
- I couldn't read the 2026 gravity-trail article to confirm whether it uses InertiaPlugin, a custom integrator or Matter.js.
- I didn't fetch the OGL Flowmap source to cite its API.

---

## 5. Scroll storytelling (pinning, scrubbing, sticky stacks, horizontal sections, scroll-linked 3D)

### Takeaway
GSAP ScrollTrigger (+ Lenis or ScrollSmoother) remains the production default for pinned, scrubbed chapters; nearly every 2025–26 Codrops scroll tutorial uses it. CSS `view()`/`scroll()` timelines cover pin-free reveals and parallax in Chromium and Safari 26+. Chrome 146's `animation-trigger` adds declarative play-once/reverse triggers. Motion's `scroll()` moved its offset animations back to the main thread in 13.5. Scroll-linked 3D now commonly follows a Blender-authored camera path.

### Cited Findings
- ScrollTrigger [docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) [primary]:
  - `scrub: 1` = "takes 1 second to 'catch up' to the scrollbar".
  - `snap: { snapTo: "labels", duration: {min:.2,max:3}, delay:.2 }`.
  - Pinning auto-adds padding (`pinSpacing: false` disables it). `anticipatePin` counters the pin delay from threaded scrolling.
  - `containerAnimation` drives triggers inside horizontally moving sections. Caveats: "the container's animation must use a linear ease (`ease: "none"`)", and pinning and snapping aren't available on containerAnimation-based triggers.
  - `fastScrollEnd` forces completion when leaving faster than 2500px/s by default.
  - "No scroll-jacking", so it combines with CSS scroll snapping.
- ScrollSmoother [docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) [primary]:
  - Uses native scroll; `data-speed` (including `"auto"` for parallax inside `overflow:hidden` frames) and `data-lag`.
  - `normalizeScroll: true` prevents most mobile address-bar show/hide resizing and overscroll.
- CSS scroll-driven animations: Chrome 115, Safari 26, Firefox preview only. Scroll-triggered (`animation-trigger`, `timeline-trigger`, `trigger-scope`): Chrome 146. The Chrome demo ships an IntersectionObserver fallback. — [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/animation-timeline.json), [Chrome blog](https://developer.chrome.com/blog/scroll-triggered-animations) [primary]
- Motion `scroll`/`useScroll`: 44%/33% smaller and callbacks 50% faster (13.4.4). `offset` animations on the main thread from 13.5.0. — [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- Lenis: native-scroll based (sticky works); `lenis/snap`; `infinite` needs `syncTouch` on touch. — [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- Codrops 2025–26 scroll tutorials:
  - Elastic Grid Scroll: "each column of a grid moves at a slightly different speed, creating a soft, elastic feel". GSAP ScrollTrigger + ScrollSmoother (repo created Jun 2025). — [repo README](https://github.com/codrops/ElasticGridScroll) [secondary]
  - Exploring 3D Image Rotations on Scroll (Jun 18 2026): GSAP, ScrollTrigger and Lenis; three.js for variations 7–15. — [Codrops](https://tympanus.net/codrops/2026/06/18/exploring-3d-image-rotations-on-scroll), [repo README](https://github.com/codrops/RotatingOnScrollAnimations) [secondary]
  - SVG Mask Transitions on Scroll with GSAP and ScrollTrigger (Mar 11 2026). — [Codrops](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/) [title-only]
  - Building a Scroll-Driven 3D Gallery Using a Blender Camera Path with Three.js and GSAP (Jul 7 2026). — [Codrops](https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap) [title-only]
  - Reactive Depth: Scroll-Driven 3D Image Tube with React Three Fiber (Feb 17 2026). — [Codrops](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber) [title-only]
  - Scroll-Reactive 3D Gallery with Three.js, Velocity and Mood-Based Backgrounds (Mar 9 2026). — [Codrops](https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds) [title-only]
  - The Never Ending Story: Seamless Infinite Scroll with GSAP & Lenis (May 28 2026). A digest says it addresses the usual "jump" and "blank screen" problems of infinite scroll. — [Codrops](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis) [title-only/digest]
  - Creating a Smooth Horizontal Parallax Gallery: From DOM to WebGL (Feb 19 2026). One rebuild describes "two rows of two, travelling against each other", scroll-pinned. — [Codrops](https://tympanus.net/codrops/2026/02/19/creating-a-smooth-horizontal-parallax-gallery-from-dom-to-webgl/), [digest: Alex-Obeid portfolio](https://github.com/Alex-Obeid/Personal_Portfolio) [digest]
  - Sticky Grid Scroll: a scroll-driven animated grid (Mar 2 2026). — [digest: Achmage-Skills](https://github.com/laguna821/Achmage-Skills) citing [Codrops](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) [digest]
  - Building an Infinite Parallax Grid with GSAP and Seamless Tiling (Jun 11 2025). — [repo README](https://github.com/JorgeCapillo/infinite-layers-grid) [secondary]
  - Also: a scroll-driven 3D cube gallery in Webflow with GSAP (May 26 2026) and an on-scroll 3D carousel with a page transition (2025, [repo](https://github.com/codrops/3DCarousel)).
- Older but still canonical: "Animate a Camera Fly-through on Scroll Using Theatre.js and React Three Fiber" (Codrops, **2023**). — [Codrops ?p=70449](https://tympanus.net/codrops/?p=70449) [snippet; older]

### Inferences (pattern cards)
**S1. Pinned chapter (sticky visual, stepping copy)**
- *Look/feel:* The left half is a pinned device/visual. Copy blocks scroll past on the right; each step crossfades or animates the visual.
- *Build:*
  - CSS-first: `position: sticky` visual; each step `<section>` drives a class via ScrollTrigger `onToggle` (discrete), or scrubs a timeline with labels per step plus `snap: "labels"`.
  - **Core trick:** sticky for layout plus *discrete* step triggers (not scrub) keeps text readable and is reduced-motion-friendly by construction.
- *Pitfalls → fixes:* don't scroll-jack. Every step's content is real HTML in order (screen readers read the steps). Avoid pinning on mobile (stack instead).
- *Touch:* stack visual and text per step below 768px.

**S2. Sticky card stack**
- *Look/feel:* Full-width cards stick at the top and the next slides over. Earlier cards scale down to ~0.9 and darken, forming a deck.
- *Build:* each card `position: sticky; top: calc(var(--i) * 1.5rem)`. Scale/darken earlier cards with CSS `animation-timeline: view()` + `animation-range: exit` (Chromium/Safari), or ScrollTrigger scrub as a fallback. `sibling-index()` (cross-engine Aug 2026) can compute `--i` without inline styles.
- *Pitfalls → fixes:* `filter: brightness()` repaints, so use an overlay with opacity instead. Keep cards' focus order natural.
- *Touch:* works natively; reduce offsets.

**S3. Horizontal section driven by vertical scroll**
- *Look/feel:* The page pins and content travels sideways; inner items animate as they enter horizontally.
- *Build:* `gsap.to(track,{x:()=>-(track.scrollWidth-innerWidth), ease:"none", scrollTrigger:{pin:true, scrub:1, end:()=>"+="+track.scrollWidth, invalidateOnRefresh:true}})`. Inner triggers use `containerAnimation: thatTween` (linear ease required; no pin/snap inside) ([ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)).
- *Pitfalls → fixes:*
  - Keyboard: Tab into an off-screen card must scroll it into view. Listen for `focusin` and set the scroll position to the matching progress.
  - Provide a native horizontal `overflow-x: auto` + scroll-snap variant for touch and reduced motion.
- *Touch:* prefer native horizontal swipe (scroll-snap) over a vertical-to-horizontal mapping.
- *Ref:* [Horizontal parallax gallery](https://tympanus.net/codrops/2026/02/19/creating-a-smooth-horizontal-parallax-gallery-from-dom-to-webgl/).

**S4. Mask or clip transitions between sections**
- *Look/feel:* The next section is revealed through a growing SVG shape (logo, blob, arch) or a clip-path wipe as you scroll.
- *Build:* SVG `<mask>` with a `<path>` scaled from ~0 to cover via scrub, or `clip-path: shape(...)` (cross-engine since Feb 2026) or `inset()/circle()` tweened by ScrollTrigger.
- *Pitfalls → fixes:* masks over large videos are expensive, so use a poster image during the scrub. Reduced motion: hard cut.
- *Ref:* [SVG mask transitions](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/).

**S5. Scroll-linked 3D camera path**
- *Look/feel:* Scrolling flies the camera through a 3D gallery or scene along an authored path, with images or chapters along the way.
- *Build:*
  - Export the camera path from Blender (curve points or baked camera animation in glTF) to a `CatmullRomCurve3`. Scroll progress (ScrollTrigger `onUpdate` or Lenis) maps to `curve.getPointAt(p)` and `lookAt(curve.getPointAt(p+ε))`.
  - Damp toward the target in the render loop. R3F: drei `ScrollControls`/`useScroll`, or a GSAP proxy.
  - **Core trick:** authoring the path in Blender separates art direction from code. Damping the camera, not the scroll, keeps native scroll.
- *Pitfalls → fixes:* provide DOM chapter headings for a11y and SEO; `frameloop="demand"` while idle; mobile LOD; reduced motion = jump cuts between chapter cameras.
- *Touch:* lower DPR; fewer post effects.
- *Ref:* [Blender camera path gallery](https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap), [3D image tube R3F](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber), Theatre.js fly-through (2023, older).

**S6. Velocity-reactive elastic grid or skew**
- *Look/feel:* Grid columns lag behind each other, or images skew and stretch with scroll speed and settle when scrolling stops.
- *Build:* ScrollSmoother `data-lag` per column (0.1, 0.2, 0.3…), per the Elastic Grid Scroll credits. Or read `ScrollTrigger.getVelocity()`/`lenis.velocity`, clamp it, and `quickTo` a `skewY`.
- *Pitfalls → fixes:* clamp velocity (±10deg); reset on idle; disable under reduced motion.
- *Ref:* [Elastic Grid Scroll](https://github.com/codrops/ElasticGridScroll).

**S7. CSS-only reveal and parallax layer (progressive)**
- *Build:* `@supports (animation-timeline: view()) { .reveal { animation: rise linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; } }`. Optional Chrome-146 play-once: `timeline-trigger: --t view() contain / cover; animation-trigger: --t play-forwards play-backwards;`.
- *Pitfalls → fixes:* Firefox gets nothing unless you add IntersectionObserver class toggles. Never hide content by default without JS: start visible and animate *from* an offset only once JS or `@supports` confirms.

### Gaps
- I couldn't read the Codrops camera-path or infinite-scroll articles, so their exact Blender export method and infinite-loop strategy are unverified.
- I found no benchmark comparing Motion `scroll()` main-thread offsets with CSS ScrollTimeline after the 13.5 change.

---

## 6. Text and type effects (split text, variable-font axes, scramble/decode, kinetic headlines, text along paths)

### Takeaway
Split-text reveals are solved infrastructure (GSAP SplitText, free and ARIA-aware, with masks and auto re-split). The 2026 frontier is:
- scroll-coupled waves and arcs of type;
- WebGL/WebGPU text (MSDF) that dissolves or deforms while the DOM copy stays for SEO and a11y;
- variable-font axis play;
- CSS-only staggers via `sibling-index()`;
- tighter display setting via `text-box` trim (now cross-engine).

### Cited Findings
- SplitText v3.13+ options (`aria`, `autoSplit`/`onSplit`, `mask`, `deepSlice`, `propIndex`, `smartWrap`). — [SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) [primary]
- ScrambleTextPlugin options: `chars` (`"upperCase"`, `"lowerCase"`, `"upperAndLowerCase"` or a custom string), `revealDelay`, `speed`, `tweenLength` (gradually tweens length differences), `rightToLeft`. — [ScrambleText docs](https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin/) [primary]
- Variable fonts:
  - The five registered axes are weight (`wght`), width (`wdth`), slant (`slnt`), italic (`ital`) and optical size (`opsz`).
  - In `font-variation-settings`, "axis names are case-sensitive. The registered axis names must be in lower case, and custom axes must be in upper case".
  - Source: [MDN Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) [primary]
- `text-box` is cross-engine since Firefox 154 (Aug 2026); `sibling-index()` likewise. — [BCD text-box](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-box.json), [BCD sibling-index](https://github.com/mdn/browser-compat-data/blob/main/css/types/sibling-index.json) [primary]
- Motion publishes split-text tutorials ("react-split-text", "js-split-text-scatter", "js-split-text-wavy"). — [motion.dev tutorials](https://motion.dev/tutorials/react-split-text) [snippet]
- Codrops type tutorials:
  - Building a Scroll-Driven Dual-Wave Text Animation with GSAP (Jan 15 2026). — [Codrops](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/) [title-only]
  - On-Scroll Text Motion: "On-scroll animations for typographic elements with GSAP", demo tympanus.net/Development/ScrollMotion/ (repo Dec 2025). — [repo README](https://github.com/codrops/ScrollTextMotion) [secondary]
  - WebGPU Gommage Effect: Dissolving MSDF Text into Dust and Petals with Three.js & TSL (Jan 28 2026). — [three-msdf-text-utils README](https://github.com/leochocolat/three-msdf-text-utils) citing [Codrops](https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/) [digest]
  - Interactive Text Destruction with Three.js, WebGPU and TSL (Jul 22 2025). — [Codrops](https://tympanus.net/codrops/2025/07/22/interactive-text-destruction-with-three-js-webgpu-and-tsl) [title-only]
  - How to Create Responsive and SEO-friendly WebGL Text (Jun 5 2025). — [Codrops](https://tympanus.net/codrops/2025/06/05/how-to-create-responsive-and-seo-friendly-webgl-text) [title-only]
  - Animating Letters with Shaders (Mar 24 2025). — [Codrops](https://tympanus.net/codrops/2025/03/24/animating-letters-with-shaders-interactive-text-effect-with-three-js-glsl) [title-only]
  - Building an Infinite Marquee Along an SVG Path with React & Motion (Jun 17 2025). — [Codrops](https://tympanus.net/codrops/2025/06/17/building-an-infinite-marquee-along-an-svg-path-with-react-motion) [title-only]
  - Reverse-Engineering Claude AI's Mascot Animations with SVG and GSAP (May 5 2026). A follower credits it for "asymmetric hop easing, per-limb phase offsets". — [digest: Ivel10Go/claude-mascot](https://github.com/Ivel10Go/claude-mascot) [digest]
- MSDF/SDF text libraries: `three-msdf-text-utils` 1.5.0, `troika-three-text` 0.52.5. — [npm](https://registry.npmjs.org/troika-three-text) [primary]

### Inferences (pattern cards)
**T1. Masked line reveal (the workhorse)**
- *Look/feel:* Each line slides up from behind an invisible baseline; slight stagger; expo-out.
- *Build:* `SplitText.create(el,{type:"lines", mask:"lines", autoSplit:true, onSplit:s=>gsap.from(s.lines,{yPercent:100, stagger:.08, duration:.9, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 80%", once:true}})})`. CSS-only alternative: wrap lines server-side, then `transition-delay: calc(sibling-index() * 60ms)`.
- *Pitfalls → fixes:* masks clip descenders, so add `padding-bottom` to masks or use `text-box` trim deliberately; keep `aria: "auto"`; once per view.
- *Touch:* same.

**T2. Scramble or decode**
- *Look/feel:* Labels or numbers resolve from random glyphs (terminal or HUD vibe), often on hover or on section enter.
- *Build:* `gsap.to(el,{duration:1, scrambleText:{text:el.dataset.text, chars:"upperCase", revealDelay:.3, speed:.6}})` ([ScrambleText docs](https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin/)). Use monospace or `font-variant-numeric: tabular-nums` to stop width jitter.
- *Pitfalls → fixes:*
  - Screen readers may announce the garbage: set `aria-label` with the final text on the element and `aria-hidden` on an animated duplicate.
  - Don't scramble long body text. Reduced motion: no scramble.

**T3. Variable-font axis play**
- *Look/feel:* Headlines breathe in weight or width on scroll; letters near the cursor fatten (proximity); hover links widen.
- *Build:* animate a registered custom property (`@property --wght {syntax:'<number>'; inherits:true; initial-value:400}`) and set `font-variation-settings: "wght" var(--wght)` (lowercase registered axes per MDN). Per-char proximity: SplitText chars, distance from the pointer mapped to `--wght` in rAF.
- *Pitfalls → fixes:* reflow. Width/weight changes alter layout, so animate per-char inside fixed-width containers or accept layout cost on short headlines only. Pick fonts whose axes are interpolation-safe.
- *Touch:* use scroll instead of proximity.

**T4. Kinetic marquee and text along a path**
- *Look/feel:* Oversized words loop horizontally, speeding up or reversing with scroll velocity; or a ribbon of text runs along a curved SVG path.
- *Build:*
  - Marquee: duplicated track + `xPercent` loop (GSAP `horizontalLoop` helper or CSS keyframes); multiply `timeScale` by clamped scroll velocity.
  - Path: SVG `<textPath href="#curve" startOffset>`, animating `startOffset` (or Motion values per Codrops 2025).
- *Pitfalls → fixes:* WCAG 2.2.2 (pause for >5s motion); `aria-hidden` on duplicates; a static line under reduced motion.

**T5. WebGL/MSDF text effects with DOM parity**
- *Look/feel:* A headline that dissolves into particles or petals, ripples or shatters on hover or scroll.
- *Build:* render the same string with MSDF (three-msdf-text-utils or troika) in a canvas positioned exactly over the DOM text. The DOM text is `color: transparent` (still selectable and readable) or visually hidden. Effects run in TSL/GLSL.
- *Pitfalls → fixes:* font metric mismatch, so measure the DOM rect and size the canvas text from it on resize; font atlas weight; fallback to DOM text when WebGL fails.
- *Ref:* [WebGPU gommage](https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/), [SEO-friendly WebGL text](https://tympanus.net/codrops/2025/06/05/how-to-create-responsive-and-seo-friendly-webgl-text).

**T6. Scroll-driven wave or arc text**
- *Look/feel:* Two rows of words undulate in opposite sine waves as you scroll.
- *Build:* SplitText words; on ScrollTrigger `onUpdate`, set each word's `y = A·sin(k·i + progress·ω)` via `gsap.quickSetter`, or let CSS compute it with `sibling-index()` and a scroll-progress custom property.
- *Ref:* [Dual-wave text](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/).

### Gaps
- The Motion split-text tutorials were seen only as search results, so it's unverified whether Motion core now ships a split-text utility or it lives in Motion+.
- The dual-wave and gommage articles' internals couldn't be read.

---

## 7. Image and media effects (WebGL displacement hovers, reveal masks, clip-path wipes, video scrubbing, image trails)

### Takeaway
Image effects split into three groups:
1. **CSS-native** (clip-path/mask wipes, now with responsive `shape()` in every engine).
2. **Shader-driven** (displacement/ripple/blur reveals whose uniforms are tweened by GSAP, plus stylisation passes like dithering, ASCII and datamosh, increasingly in TSL/WebGPU).
3. **Media scrubbing** (video tied to scroll), which lives or dies on encoding keyframe density.

### Cited Findings
- Codrops "How to Animate WebGL Shaders with GSAP: Ripples, Reveals, and Dynamic Blur Effects" (Oct 8 2025). — [repo README](https://github.com/biazo/codrops-animate-shaders-with-gsap) [secondary]
- Codrops "From Shader Uniforms to Clip-Path Wipes: How GSAP Drives My Portfolio" (May 6 2026). — [Codrops](https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/) [title-only]
- Codrops "Animating in Frames: Repeating Image Transition" (Apr 28 2025): "A transition that moves an image in frames (image copies/repetitions) on a path". Uses GSAP + Lenis. — [repo README](https://github.com/codrops/RepeatingImageTransition) [secondary]
- Codrops "Composite Rendering: The Brilliance Behind Inspiring WebGL Transitions" (Feb 23 2026). — [Codrops](https://tympanus.net/codrops/2026/02/23/composite-rendering-the-brilliance-behind-inspiring-webgl-transitions) [title-only]
- Stylisation passes:
  - "Breaking the Frame: Real-Time Datamosh Effect with Three.js" (Sep 2 2026)
  - "Beyond the Luminance Ramp: A Shape-Aware ASCII Renderer" (Sep 4 2026)
  - "Building an Infinite Loom: Unravelling Images into Threads" (Sep 5 2026)
  - "Implementing a Dissolve Effect with Shaders and Particles" (Feb 17 2025)
  - Source: [Codrops 2026 list](https://tympanus.net/codrops/2026/09/02/breaking-the-frame-building-a-real-time-datamosh-effect-with-three-js) [title-only]
- `shape()` for clip-path: Chrome 135, Safari 18.4, Firefox 148. — [BCD basic-shape](https://github.com/mdn/browser-compat-data/blob/main/css/types/basic-shape.json) [primary]
- Video scrubbing (GSAP staff on the forum): smooth seeking "is about keyframes encoded in the video, and the frequency of those… The more keyframes, the more data (bigger file size) but the easier it is to jump to specific frames smoothly". They also say to try "various codecs and keyframe intervals" because of hardware decoding differences. — [GSAP forum: scrub through video smoothly](https://gsap.com/community/forums/topic/25730-scrub-through-video-smoothly-scrolltrigger/) [primary community/staff]
- Autoplay: inaudible media isn't subject to autoplay blocking; Safari needs `playsinline`. — [MDN Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) [primary]

### Inferences (pattern cards)
**I1. WebGL displacement or ripple hover**
- *Look/feel:* On hover, an image warps through a displacement texture (liquid, noise, stripes) into a second image, or ripples outward from the pointer.
- *Build:*
  - A plane per image synced to its DOM rect (or a single full-screen canvas that renders all tracked rects).
  - The fragment shader mixes `tex1`/`tex2` using `uProgress` and offsets UVs by `texture(disp, uv).r * uIntensity * (1.0 - abs(uProgress*2.0-1.0))`.
  - GSAP tweens `uProgress` on `pointerenter`/`leave`.
  - **Core trick:** the intensity term peaks mid-transition and is zero at both ends, so the images are pixel-perfect at rest.
- *Pitfalls → fixes:* DOM/canvas desync on scroll, so update positions from the same Lenis/ScrollTrigger tick. Texture memory: limit resolution; lazy-create planes in view. Keep the `<img>` as the semantic element and fallback.
- *Touch:* trigger on in-view or tap; otherwise show static images.

**I2. Clip-path or mask wipe reveal**
- *Look/feel:* Images reveal with a directional wipe, iris or diagonal blade, often with an inner counter-scale (image scales 1.2→1 while its frame opens).
- *Build:* `clip-path: inset(100% 0 0 0)` → `inset(0)` with an inner `<img>` `scale` tween. Complex responsive shapes: `clip-path: shape(from 0% 0%, line to 100% 0%, …)` (cross-engine). Triggered by ScrollTrigger `once`, or CSS `view()` where available.
- *Pitfalls → fixes:* clip-path animation repaints, so keep elements moderate in size. Reduced motion: opacity fade. Reserve the box (`aspect-ratio`) for CLS.

**I3. Scroll-scrubbed video**
- *Look/feel:* A product rotates or a scene plays exactly with the scroll position.
- *Build:*
  - Option A: `<video muted playsinline preload="auto">` encoded all-intra or with very short GOPs; ScrollTrigger `onUpdate` sets `video.currentTime = p * duration` (throttled to rAF).
  - Option B (most robust): an image sequence (WebP/AVIF frames) drawn to `<canvas>`, preloading nearby frames first.
  - **Core trick:** smoothness depends on keyframe density, not JavaScript ([GSAP forum](https://gsap.com/community/forums/topic/25730-scrub-through-video-smoothly-scrolltrigger/)).
- *Pitfalls → fixes:* file size balloons (budget it; serve a lower-frame-count set on mobile); show a poster until enough frames are ready; reduced motion = a few static key frames.
- *Touch:* iOS seeking is the weakest path, so prefer the image sequence on mobile.

**I4. Image trail:** see section 4, card C3.

**I5. Repeating-frame or echo transition**
- *Look/feel:* When opening a project, the thumbnail leaves a trail of copies along a curved path into the hero position (an onion-skin effect).
- *Build:* clone the image N times; GSAP MotionPath (or a computed bezier) with staggered starts; the copies fade as the final one lands. Flip.fit computes the target rect.
- *Ref:* [Repeating Image Transition](https://tympanus.net/codrops/2025/04/28/animating-in-frames-repeating-image-transition), [Thumbnail flow with MotionPath](https://tympanus.net/codrops/2026/06/04/creating-a-thumbnail-flow-animation-with-gsap-motionpath) [title-only].

**I6. Stylisation pass as a state (dither, ASCII, pixelate, datamosh)**
- *Look/feel:* Images load or hover in as dithered or ASCII and resolve to full fidelity; or glitch (datamosh) on transitions.
- *Build:* a post-processing pass on the image plane with uniform `uResolve` 0→1 (pixel size and dither threshold driven by it).
- *Pitfalls → fixes:* flashing glitch effects risk WCAG 2.3.1 (three flashes), so keep them under 3Hz and low-contrast. Respect reduced motion.

### Gaps
- No primary source fetched on recommended encoding settings (e.g. ffmpeg `-g 1`) for scroll video. The forum only states the keyframe trade-off.
- The "composite rendering" article's technique is unknown (title-only).

---

## 8. Work grids and galleries (FLIP layout transitions, draggable infinite canvases, filters/sorting, hover previews)

### Takeaway
- **Layout changes** (filter, sort, grid ⇄ list, card → detail) are FLIP problems. Use GSAP Flip (framework-agnostic, handles grid/flex with `absolute: true`), Motion `layout`/`layoutId` (React), or view transitions (`match-element` auto-naming, cross-engine).
- **Exploration galleries** in 2026 are draggable infinite canvases (DOM with wraparound tiling, or R3F chunked rendering) and WebGL grids that bend with velocity. The newest are WebGPU/TSL "liquid glass" grids.

### Cited Findings
- GSAP Flip [docs](https://gsap.com/docs/v3/Plugins/Flip/) [primary]:
  - Records state with `Flip.getState()`; "you make whatever changes you want", then `Flip.from()` animates from the old state.
  - `absolute: true` "solves layout challenges with flexbox, grid"; `scale: true` vs width/height; `nested: true` stops compounding offsets.
  - `onEnter`/`onLeave` handle `display:none` toggles; `Flip.fit()` places one element exactly over another.
- Motion layout [docs](https://motion.dev/docs/react-layout-animations) [primary]:
  - "performs all layout animations using the CSS transform property".
  - `layoutId` matches two elements (shared transitions, modals, underlines).
  - `transition.layout.path = arc()` curves the motion.
- Motion 13.1 added multidimensional `Reorder` with automatic axis detection and RTL. — [changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- `view-transition-name: match-element` auto-names elements by identity (same-document only); `view-transition-class` styles groups (e.g. `::view-transition-group(*.card)`). — [Chrome: View transitions in 2025](https://developer.chrome.com/blog/view-transitions-in-2025) [primary]
- Codrops galleries:
  - Animating Responsive Grid Layout Transitions with GSAP Flip (Jan 20 2026). — [Codrops](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip) [title-only]
  - Infinite Canvas: Building a Seamless, Pan-Anywhere Image Space (Jan 7 2026). A digest describes it as React Three Fiber with chunk-based rendering and performance-first techniques. — [Codrops](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space), [digest: fe-bits-weekly](https://github.com/yusixian/fe-bits-weekly) [digest]
  - Recreating Palmer's Draggable Product Grid with GSAP (Sep 1 2025; "An original idea by Uncommon"). — [repo README](https://github.com/joffreysp/draggable-grid) [secondary]
  - Building an Infinite GSAP Scroll Gallery with Parallax and Flip Transitions (Jul 30 2026). — [Codrops](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/) [title-only]
  - Animated Product Grid Preview with GSAP & Clip-Path (May 27 2025). — [Codrops](https://tympanus.net/codrops/2025/05/27/animated-product-grid-preview-with-gsap-clip-path) [title-only]
  - From Flat to Spatial: 3D Product Grid with React Three Fiber (Feb 24 2026). A digest notes procedural grid lines with dual smoothstep. — [digest: Sersan](https://github.com/SerSan-AI-Studio/Sersan) [digest]
  - Infinite Liquid Glass Grid with Three.js, WebGPU and TSL (Sep 8 2026): "rounded corners, bevel and refraction all in the material". — [digest: PyShader](https://github.com/NucleantUI/PyShader) [digest]
  - Building an Interactive Image Grid with Three.js (Mar 18 2025). — [Codrops](https://tympanus.net/codrops/2025/03/18/building-an-interactive-image-grid-with-three-js) [title-only]
- Observer/Draggable plumbing: Observer `lockAxis`, drag-minimum and `onDrag`/`onStop` callbacks. InertiaPlugin is included free since 3.13 (earlier notes). — [Observer docs](https://gsap.com/docs/v3/Plugins/Observer/) [primary]

### Inferences (pattern cards)
**G1. Filter or sort with FLIP**
- *Look/feel:* Choosing a category makes non-matching cards shrink and fade while the remaining ones glide into new slots.
- *Build:*
  - Vanilla: `const s = Flip.getState(".card"); applyFilter(); Flip.from(s,{absolute:true, duration:.6, ease:"power3.inOut", stagger:.02, onEnter:els=>gsap.fromTo(els,{opacity:0,scale:.9},{opacity:1,scale:1}), onLeave:els=>gsap.to(els,{opacity:0,scale:.9})})`.
  - React: `<motion.li layout>` inside `<AnimatePresence>`.
  - Native: `document.startViewTransition(applyFilter)` with `.card{view-transition-name:match-element; view-transition-class:card}`.
- *Pitfalls → fixes:* announce the result count in an `aria-live="polite"` region. Filters are real buttons with `aria-pressed`. Use `absolute: true` to stop grid reflow jumps.
- *Touch:* same; larger hit targets for filter chips.

**G2. Grid ⇄ list or slideshow layout switch**
- *Build:* toggle a class on the container; Flip with `nested: true` if images inside also resize.
- *Ref:* [Responsive grid Flip (2026)](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip); "Ideas for Grid to Slideshow Switch Animations" (older Codrops).

**G3. Draggable infinite canvas**
- *Look/feel:* An endless 2D field of images you can drag in any direction with momentum. Items parallax slightly; hovering or clicking zooms one into a detail view.
- *Build:*
  - DOM version: a tile of the grid repeated 3×3. Track an `offset` (x,y) updated by drag (Observer `onDrag` deltas) plus inertia, and position each item at `((base + offset) mod tileSize) - tileSize/2`.
  - WebGL version: instanced planes in chunks around the camera; only the visible chunks are rendered (the R3F "chunk" approach in the digest).
  - **Core trick:** modulo wrapping of positions instead of moving a giant canvas, so the DOM and draw-call count stay constant.
- *Pitfalls → fixes:*
  - Keyboard access: provide arrow-key panning and a "View as list" link; every item is a real link.
  - Momentum must stop on `pointerdown`. Lazy-load images per tile.
- *Touch:* native-feeling drag needs `touch-action: none` on the canvas only; leave the rest of the page scrollable.
- *Ref:* [Infinite canvas (2026)](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space), [Palmer draggable grid](https://tympanus.net/codrops/2025/09/01/recreating-palmers-draggable-product-grid-with-gsap).

**G4. Hover-preview index (list → floating media)**
- *Look/feel:* A typographic project list; hovering a row shows its image or video in a floating frame that follows the cursor with lag and swaps with a clip or scale transition between rows.
- *Build:* one floating container with `quickTo` x/y. Image swap via a clip-path wipe or crossfade keyed by row index. Video previews preloaded (`preload="metadata"`) and only played while hovered.
- *Pitfalls → fixes:* the preview is decorative (`aria-hidden`); the row is a link with full text. Disable on touch.
- *Touch:* show a thumbnail inline in each row.

**G5. Card → case-study shared-element expand**
- *Look/feel:* The clicked card's image grows seamlessly into the next page's hero.
- *Build:* same page: `Flip.fit` or Motion `layoutId`. Across routes: view transitions (section 9). Motion `animateView(update).add(fromEl, toEl)` gives the two elements a shared name and morphs them with springs ([animateView docs](https://motion.dev/docs/animate-view)).
- *Pitfalls → fixes:* move focus to the new heading; the browser Back button reverses the transition.

**G6. WebGL grid with velocity bend or liquid glass**
- *Look/feel:* A grid on a plane that curves (barrel distortion) as you drag or scroll and flattens when still; or glass tiles refracting what's behind them.
- *Build:* a vertex shader bends by `uVelocity` (`z -= uVelocity * pow(uv.x-.5, 2.)`); liquid glass via TSL refraction in `three/webgpu` with WebGL2 fallback.
- *Pitfalls → fixes:* keep a DOM grid for SEO and focus; the canvas mirrors it.

### Gaps
- The Codrops 2026 infinite-canvas article's exact chunking scheme and input handling were not readable.
- I didn't verify whether GSAP Flip has any 2026 API additions (the 3.14/3.15 posts don't mention Flip).

---

## 9. Page and route transitions (View Transitions same- and cross-document, Barba.js, Next.js/React patterns, shared-element)

### Takeaway
The platform now does most of the work:
- **SPA/same-document view transitions** are cross-engine.
- **React 19.3** ships `<ViewTransition>` (Next.js App Router needs no config).
- **MPA cross-document transitions** need only `@view-transition { navigation: auto }` in Chromium and Safari 18.2+. Firefox simply navigates without animation.

JS routers (Barba, Swup, Taxi) remain the choice when you need a *persistent* WebGL canvas, audio or complex choreography across pages. Codrops' 2026 tutorials still pair Barba with Astro, and go further with persistent WebGPU canvases.

### Cited Findings
- Cross-document view transitions [Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) [primary]:
  - Opt in with `@view-transition { navigation: auto; }`; "limited to same-origin navigations"; no cross-origin redirects.
  - `pageswap` fires before the old page's last frame; `pagereveal` fires on the new page before first render.
  - "the `pagereveal` event listener… must register… in a classic parser-blocking script in the `<head>` (not a module, not async, not defer)".
  - The same page also covers Speculation Rules prerendering.
- Firefox has no `@view-transition` (BCD `false`, bug 1860854). — [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/view-transition.json) [primary]
- Chrome: View transitions in 2025 [blog](https://developer.chrome.com/blog/view-transitions-in-2025) [primary]:
  - Firefox 144 shipped same-document view transitions, `view-transition-class`, `match-element` and `:active-view-transition`, but "Firefox's initial implementation… does not include view transition types". Chrome recommends its `transitionHelper` for progressive enhancement.
  - Nested view-transition groups arrived in Chrome 140 (keeps clipping and 3D during the transition).
  - Scoped `element.startViewTransition()` lets multiple transitions run at once and blocks pointer events only in that subtree. BCD: shipped in Chrome 147.
- React `<ViewTransition>` (React 19.3) and Next.js App Router integration: see Section 1. — [react.dev](https://react.dev/reference/react/ViewTransition), [Next.js guide](https://nextjs.org/docs/app/guides/view-transitions) [primary]
- Motion `animateView()` runs "view transitions with spring animations and interruption handling". `.add(fromElement, toElement)` morphs a card into a detail view and "cleans both names up afterwards". — [animateView docs](https://motion.dev/docs/animate-view) [primary]
- Barba 2.10.3 (Aug 2024; README badge "stable"; `sync` mode). — [npm](https://registry.npmjs.org/@barba/core), [README](https://github.com/barbajs/barba) [primary]
- Codrops transition tutorials:
  - Creating Custom Page Transitions in Astro with Barba.js and GSAP (Apr 8 2026). — [Astro blog roundup](https://github.com/withastro/astro.build) citing [Codrops](https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/) [digest]
  - Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro and Barba.js (Feb 2 2026). — [digest: TomPlanche/portfolio-v222](https://github.com/TomPlanche/portfolio-v222) [digest]
  - Building Async Page Transitions in Vanilla JavaScript (Feb 26 2026). — [Codrops](https://tympanus.net/codrops/2026/02/26/building-async-page-transitions-in-vanilla-javascript/) [title-only]
  - Building Persistent Page Transitions with WebGPU and Vanilla JavaScript (Jun 30 2026). — [Codrops](https://tympanus.net/codrops/2026/06/30/building-persistent-page-transitions-with-webgpu-and-vanilla-javascript/) [title-only]
  - Building Seamless 3D Transitions with Webflow, GSAP and Three.js (Mar 18 2026). — [Codrops](https://tympanus.net/codrops/2026/03/18/building-seamless-3d-transitions-with-webflow-gsap-and-three-js) [title-only]
- A non-visual polyfill for same-document view transitions, "view-transitions-mock" (bram.us, Mar 11 2026). — [digest](https://github.com/TUARAN/frontend-weekly-digest-cn) [digest]
- Lenis `stopInertiaOnNavigate` stops inertia when an internal link is clicked. — [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- Swup 4.10.0 (Sept 2026, MIT) and Taxi 2.0.0 (Sept 27 2026, BSD-3; "routing, preloading, and additional script reloading"). — [npm swup](https://registry.npmjs.org/swup), [npm taxi](https://registry.npmjs.org/@unseenco/taxi) [primary]

### Inferences (pattern cards)
**R1. MPA cross-document view transition (CSS-first)**
- *Look/feel:* Clicking a project card morphs its image into the case-study hero on the next page; everything else crossfades or slides by direction.
- *Build:*
  - Both pages: `@view-transition{navigation:auto}`. Shared element: `view-transition-name: project-42` on the card image (list page) and the hero (detail page), set via inline style or `attr()`.
  - Direction types: in the `<head>` classic script, `pagereveal` → `e.viewTransition.types.add(isBack ? 'back' : 'forward')`, then style `html:active-view-transition-type(back)`.
  - Add Speculation Rules prerender for instant loads.
  - **Core trick:** only *one* element per name per page, so set the name only on the clicked card (in `pageswap`, or by URL matching in `pagereveal`).
- *Pitfalls → fixes:*
  - Firefox: no animation (acceptable).
  - Long transitions feel like lag: keep ≤400ms. Reduced motion: `@media (prefers-reduced-motion){ ::view-transition-group(*){animation:none} }`.
  - Snapshots are images, so text reflows can stretch: use `object-fit`-style overrides on `::view-transition-old/new`.
- *Touch:* identical; iOS Safari 18.2+.

**R2. React/Next.js shared-element routes**
- *Build:*
  - `<ViewTransition name={`project-${id}`}>` around the card image and the detail hero; navigation must happen inside `startTransition` (Next `<Link>` does).
  - `enter`/`exit` class names map to CSS keyframes on `::view-transition-new(.slide-up)`. Use Motion `<AnimateView>` for springs or interruption.
- *Pitfalls → fixes:* React only animates updates in a Transition, Suspense or `useDeferredValue` ([react.dev](https://react.dev/reference/react/ViewTransition)). Duplicate names throw an error, so derive names from IDs.

**R3. Router curtain or wipe (Barba, Swup or Taxi + GSAP)**
- *Look/feel:* A brand-coloured panel sweeps across (or splits), the URL changes behind it, and the panel lifts with the new page's headline rising.
- *Build:* Barba `transitions:[{ leave(){ return gsap.to(curtain,{yPercent:0}) }, enter(){ return gsap.to(curtain,{yPercent:-100}) } }]` with `sync:false`. Re-init page scripts and ScrollTriggers in hooks; reset Lenis (`lenis.scrollTo(0,{immediate:true})`).
- *Pitfalls → fixes:*
  - Focus management: move focus to the new `<h1>` or `<main>`; update `document.title`; announce via a live region.
  - Analytics page views. Barba is frozen since 2024, so Swup or Taxi are maintained alternatives.

**R4. Persistent WebGL or WebGPU canvas across routes**
- *Look/feel:* A 3D scene or shader background never reloads; on navigation it morphs (camera move, texture dissolve) while the DOM swaps.
- *Build:* the canvas lives outside the router container (Barba wrapper, Next layout, Astro persisted island). The router's leave/enter hooks drive the scene's transition uniform; new page textures are preloaded before `enter` resolves.
- *Pitfalls → fixes:* memory leaks (dispose per-page textures); route-specific scroll sync; still show a DOM-only path when WebGL fails.
- *Ref:* [Persistent WebGPU page transitions](https://tympanus.net/codrops/2026/06/30/building-persistent-page-transitions-with-webgpu-and-vanilla-javascript/), [Astro + Barba](https://tympanus.net/codrops/2026/04/08/creating-custom-page-transitions-in-astro-with-barba-js-and-gsap/).

**R5. Component-scoped view transitions (progressive)**
- *Build:* `card.startViewTransition(() => update())` in Chrome 147+, falling back to `document.startViewTransition` or no animation. Useful for several simultaneous widget transitions, e.g. multiple filters animating at once.

### Gaps
- Not verified: whether Safari supports view-transition *types* in cross-document transitions, and how Next.js handles Back/Forward direction types. Both need checking before prompting.
- The Codrops async and persistent transition articles were not readable.

---

## 10. Product and 3D (React Three Fiber/drei, model-viewer, turntables, configurators, exploded views; Spline licensing)

### Takeaway
- **R3F 9 (React 19) + drei 10** is the production React stack; R3F v10 (first-class WebGPU) is alpha.
- **Asset pipeline matters most:** `gltfjsx --transform` (Draco, prune, resize, WebP) cuts 70–90%.
- **`<model-viewer>` 4.3** remains the no-build path to AR and Quick Look, and Safari 27's native `<model>` element is a new Safari-only option.
- **Spline** is the fastest designer path, but the free plan watermarks web exports and the pricing page lists code/self-hosted export only on Enterprise. Check licensing before choosing Spline for a client site.

### Cited Findings
- R3F: v9+ pairs with React 19; "no overhead" vs plain three; WebGPU "first class" in v10 (alpha on npm). — [R3F v10 readme](https://github.com/pmndrs/react-three-fiber/blob/v10/readme.md), [npm](https://registry.npmjs.org/@react-three/fiber) [primary]
- `gltfjsx` "will optionally compress your model with up to 70%-90% size reduction". `--transform` does "draco, prune, resize" with WebP textures by default; `--instance` and `--instanceall` instance repeated geometry; output is `model-transformed.glb` used via `useGLTF`. — [gltfjsx README](https://github.com/pmndrs/gltfjsx) [primary]
- `<model-viewer>` 4.3.1 (Jun 2026, Apache-2.0). three.js is a peer dependency, and the README recommends locking three to the tested version "due to frequent upstream breaking changes". — [model-viewer README](https://github.com/google/model-viewer/blob/master/packages/model-viewer/README.md) [primary]
- Safari 27 `<model>`: `<source>` USDZ/GLB, `environmentmap`, `stagemode`, JS API, an Immersive API, and `dynamic-range-limit` for HDR. Safari-only per BCD. — [WebKit Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [BCD model](https://github.com/mdn/browser-compat-data/blob/main/html/elements/model.json) [primary]
- Spline tiers (Free watermark → Hobby no watermark on exports → Pro no watermark on embeds, plus Apple/Android exports → Enterprise "Code & Self-hosted exports"). The `@splinetool/runtime` npm package has no license field. — [Spline pricing](https://spline.design/pricing), [npm](https://registry.npmjs.org/@splinetool/runtime) [primary]
- R3F scaling (from the earlier notes): `frameloop="demand"`, ≤ a few hundred draw calls, `PerformanceMonitor` adaptive DPR. — [R3F docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance) [primary]
- Motion `threeEffect` animates Three.js objects and materials with Motion springs. — [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- Codrops 3D production pieces:
  - "Blender to Three.js and Back: 10 Tips for a Better Workflow" (Aug 24 2026). — [repo README](https://github.com/andrewwoan/codrops-demo-for-threejs-conference) [secondary]
  - "Building Efficient Three.js Scenes: Optimize Performance While Maintaining Quality" (Feb 11 2025). — [Codrops](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality) [title-only]
  - Cloth Simulation Balloon Button: "bake a cloth simulation in Blender, export it, and bring it into Three.js as an interactive, replayable animation" (2025). — [repo README](https://github.com/codrops/BalloonButton) [secondary]
  - "Crumbled Paper: Houdini VAT in three.js" (Sep 19 2026). — [Codrops](https://tympanus.net/codrops/2026/09/19/crumbled-paper-houdini-vat-threejs) [title-only]
  - "From Flat to Spatial: 3D Product Grid with R3F" (Feb 24 2026) and "Immersive 3D Weather Visualization with R3F" (Sep 18 2025). [title-only]
- Codrops also covers Rive in React: "Integrating Rive into a React Project: Behind the Scenes of Valley Adventures" (May 12 2025). — [Codrops](https://tympanus.net/codrops/2025/05/12/integrating-rive-into-a-react-project-behind-the-scenes-of-valley-adventures) [title-only]

### Inferences (pattern cards)
**P1. Hero turntable or "hold the product"**
- *Look/feel:* A product floats in soft studio light; drag to rotate with inertia and rubber-band limits; it idles with slow auto-rotate; contact shadow below.
- *Build:* R3F `<Canvas dpr={[1,2]} frameloop="demand">` + drei `Stage`/`Environment` (HDRI) + `ContactShadows` + `PresentationControls` (snap-back, polar limits) or `OrbitControls` with damping; `useGLTF` on a `gltfjsx --transform` asset. Show a poster `<img>` until `onCreated` plus the first frame.
- *Pitfalls → fixes:* HDRI size (use a 1k `.hdr`/KTX2); call `invalidate()` on interaction under demand mode; describe the product in text (canvas `aria-hidden`, real `<h1>`/specs in DOM); provide "rotate left/right" buttons for keyboard users.
- *Touch:* one-finger rotate vs page scroll conflict, so use `touch-action: pan-y` on the canvas and require horizontal drag to rotate.

**P2. Configurator (colour, material, variant)**
- *Look/feel:* Swatches swap materials with a crossfade; the camera moves to the relevant part; the price updates.
- *Build:* keep materials in a map; tween `material.color` or `uMix` between textures (Motion `threeEffect` or GSAP). Camera targets via drei `CameraControls.setLookAt(…, true)`. State goes in the URL for shareable configs. `<model-viewer>` alternative: `variant-name` with KHR_materials_variants (from model-viewer knowledge; docs not fetched).
- *Pitfalls → fixes:* swatches are radio inputs with labels (not just colour); the price change is announced; preload variant textures.
- *Touch:* bottom-sheet controls; camera presets instead of free orbit.

**P3. Exploded view on scroll**
- *Look/feel:* Scrolling separates the product into its parts along axes, with callouts appearing next to each part, then reassembles.
- *Build:* for each mesh, compute `dir = normalize(mesh.center - model.center)`; one scrubbed ScrollTrigger timeline animates `mesh.position = base + dir * k * progress`. Callouts are DOM labels projected from 3D positions (drei `<Html>`), shown at labels in the timeline.
- *Pitfalls → fixes:* author part pivots correctly in Blender (or offsets look wrong); keep DOM callouts as the readable content; reduced motion = a static exploded render plus a list.

**P4. AR and Quick Look handoff**
- *Build:* `<model-viewer src="x.glb" ios-src="x.usdz" ar ar-modes="webxr scene-viewer quick-look" camera-controls poster="x.webp" loading="lazy">` (attribute names from model-viewer conventions; its docs page is client-rendered and was not verified this session). Safari 27: native `<model>` with GLB/USDZ sources as progressive enhancement.
- *Pitfalls → fixes:* pin the three version (per the README); poster for LCP; `alt` text on the element.

**P5. Spline embed (designer-owned scene)**
- *Build:* `@splinetool/react-spline` or `runtime` with a hosted scene URL; drive events from the page via its API.
- *Pitfalls → fixes:* the Free plan watermarks exports; the runtime bundle is large (35.9MB unpacked on npm; transfer size not measured); the license is unspecified on npm. Use it for prototypes or marketing scenes where vendor hosting is acceptable.

**P6. Baked-simulation hero objects (cloth, VAT, physics)**
- *Look/feel:* A button inflates like a balloon, or paper crumples on hover.
- *Build:* simulate in Blender or Houdini, then bake to morph targets or a Vertex Animation Texture; scrub the bake's time uniform on hover or scroll.
- *Ref:* [Balloon Button repo](https://github.com/codrops/BalloonButton), [Houdini VAT](https://tympanus.net/codrops/2026/09/19/crumbled-paper-houdini-vat-threejs).

### Gaps
- `<model-viewer>` attribute names and Spline runtime licensing were not verified from primary text this session (docs JS-rendered; no license page found).
- No measured transfer size for `@splinetool/runtime` or `@google/model-viewer`.
- No 2025–26 Codrops article specifically on exploded views or configurators was found.

---

## 11. Pricing and plan toggles

### Takeaway
The award-level pricing moment is a monthly/annual toggle whose thumb glides (shared-layout animation) while prices *roll* digit by digit to the new value. NumberFlow (MIT, `Intl`-aware, respects reduced motion by default) or Motion+ `AnimateNumber` (paid) do the digit roll. The rest is semantics: a radio group or switch, both prices in the HTML, and the change announced politely.

### Cited Findings
- NumberFlow [docs](https://number-flow.barvian.me/) [primary]:
  - Props `format: Intl.NumberFormatOptions` and `locales`; `trend` (digit direction; default the sign of the change); `animated`.
  - `respectMotionPreference` (default `true`: "Can be set to false to animate regardless of the user's reduced motion preference").
  - A `continuous` plugin; uses `will-change` only via `data-will-change`.
  - npm: v0.6.2 (Jul 2026), MIT ([npm](https://registry.npmjs.org/@number-flow/react)).
- Motion+ `AnimateNumber`: "lightweight (2.5kb)", "Uses the built-in Intl.NumberFormat… (e.g., currency, compact notation)", "perfect for counters, dynamic pricing, countdowns"; Motion+ members only. — [Motion docs](https://motion.dev/docs/react-animate-number) [primary]
- Motion `layoutId` for a shared indicator (pill or underline) that moves between options. — [Motion layout](https://motion.dev/docs/react-layout-animations) [primary]
- Tabular numerals to prevent layout shift (earlier notes, from web.dev CLS guidance).

### Inferences (pattern cards)
**PR1. Billing toggle with sliding thumb and rolling prices**
- *Look/feel:* A segmented control (Monthly | Yearly −20%). The pill glides with a spring; all plan prices roll their digits; a "save" badge pops in.
- *Build:*
  - `<fieldset role="radiogroup">` with two `<input type="radio">` + labels. Thumb: Motion `layoutId="billing-pill"`, or CSS anchor positioning of one pill to the checked label (`:has(:checked)`).
  - Prices: `<NumberFlow value={price} format={{style:"currency", currency:"USD", maximumFractionDigits:0}} />`.
  - **Core trick:** render the *final* price text server-side for each billing period (data attributes or both in DOM), so crawlers and no-JS users see real prices; the roll is decoration.
- *Pitfalls → fixes:* announce "Prices now billed yearly" via an `aria-live="polite"` region (not every digit); `font-variant-numeric: tabular-nums`; NumberFlow honours reduced motion by default.
- *Touch:* a full-width segmented control ≥44px tall.

**PR2. Recommended-plan emphasis and expand**
- *Look/feel:* The middle card sits slightly raised with an animated border (conic gradient via `@property` angle). Selecting a card expands its feature list.
- *Build:* `@property --angle` + `conic-gradient(from var(--angle), …)` animated slowly (paused off-screen and under reduced motion). Expansion: `interpolate-size: allow-keywords` (Chromium) with a `grid-template-rows: 0fr→1fr` fallback, or Motion `layout`.
- *Pitfalls → fixes:* the animated border is decorative; keep text contrast; no infinite animation without a pause control if it's prominent.

**PR3. Usage or seat slider with live price**
- *Build:* `<input type="range">` styled; NumberFlow for total and per-seat; `trend` forced to the slider direction; `Intl` compact notation for big tiers.
- *Pitfalls → fixes:* the range has `aria-valuetext` like "25 seats, $480 per month".

**PR4. Comparison table with sticky header and column focus**
- *Build:* `position: sticky` header; hovering or focusing a plan column highlights it via `:has()`; a native `<table>`.
- *Touch:* a plan switcher (tabs) instead of a wide table.

### Gaps
- No case-study data on whether animated price changes affect conversion.
- I didn't verify NumberFlow's bundle size.

---

## 12. Forms and conversion moments (multi-step, inline validation, submit morphs)

### Takeaway
Modern CSS removed most form JavaScript:
- `:user-invalid` (Baseline since Nov 2023) shows errors only after interaction;
- `field-sizing: content` (cross-engine since Jun 2026) auto-grows inputs and textareas;
- `appearance: base-select` (Chrome 135, Safari 27) makes `<select>` fully styleable.

The award-level touches are directional step transitions, a submit button that morphs through loading to success while staying one accessible control, and a restrained success moment.

### Cited Findings
- `:user-invalid` matches invalid fields "after the user has interacted with it"; Baseline widely available since Nov 2023. — [MDN :user-invalid](https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid) [primary]
- `field-sizing`: Chrome 123, Safari 26.2, Firefox 152. — [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/field-sizing.json) [primary]
- Customizable select: "Start by applying `appearance: base-select`… enables the new powers in HTML" (Safari 27). Chrome 135; Firefox behind a flag (149). — [WebKit Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [BCD appearance](https://github.com/mdn/browser-compat-data/blob/main/css/properties/appearance.json) [primary]
- `interpolate-size: allow-keywords` animates to and from `auto` heights. It is "Limited availability", Chromium-only. — [MDN interpolate-size](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size), [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/interpolate-size.json) [primary]
- Motion `AnimatePresence` fixes in 2026 relevant to step flows (e.g. `mode="wait"` no longer drops new children during a React transition, 13.4.6). — [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- GSAP `easeReverse` suits reversible UI (back/next). — [GSAP 3.15](https://gsap.com/blog/3-15/) [primary]

### Inferences (pattern cards)
**F1. Multi-step form with directional motion**
- *Look/feel:* Steps slide left on Next and right on Back; a progress bar fills; step headings animate in.
- *Build:*
  - React: `<AnimatePresence mode="wait" custom={dir}>` with variants keyed by step and `custom` direction.
  - Vanilla: `document.startViewTransition()` with a `types` set of `forward`/`back` (note Firefox's lack of types per the Chrome blog), or GSAP timelines.
  - The progress bar is a `<progress>` element styled; its fill animates `scaleX` on a pseudo-element.
- *Pitfalls → fixes:* move focus to the new step's heading; preserve entered data; announce "Step 2 of 4"; reduced motion = crossfade.
- *Touch:* keep the Next button visible above the virtual keyboard (`position: sticky; bottom: 0`, or `interactive-widget` viewport handling).

**F2. Inline validation that waits**
- *Look/feel:* Errors appear only after leaving a field, sliding open under it; a success tick draws in when fixed.
- *Build:* `input:user-invalid + .msg{…}`; the message container expands with `grid-template-rows: 0fr→1fr` (cross-engine) or `interpolate-size` (Chromium). Tick: SVG `pathLength="1"` + `stroke-dashoffset` transition.
- *Pitfalls → fixes:* link messages with `aria-describedby`; set `aria-invalid` on submit; never colour-only; don't shake fields (vestibular, and it's ambiguous).

**F3. Submit button morph**
- *Look/feel:* The button shrinks to a circle with a spinner, then expands into "Sent ✓" (or back with an error) without layout jumps.
- *Build:* one `<button>` whose label swaps inside a fixed-width wrapper; width animated via Motion `layout` (transform-based, per docs) or FLIP; spinner via CSS. Status text goes into an `aria-live="polite"` region; `aria-busy="true"` while pending.
- *Pitfalls → fixes:* don't disable the button without explaining why; keep the focus ring; ≥300ms minimum display of loading to avoid flicker.

**F4. Auto-growing fields and styled selects**
- *Build:* `textarea, input{field-sizing: content; min-inline-size: 12ch}`; `select{appearance: base-select}` with `::picker(select)` styling and `@starting-style` open animation. Fallback: the native select.

**F5. Success moment**
- *Look/feel:* A short celebratory burst (confetti or brand shapes) and a headline that names what happened ("We'll reply within a day").
- *Build:* a one-shot canvas burst (≤1s) or Lottie/dotLottie/Rive animation; skipped under reduced motion; focus moves to the confirmation heading.

### Gaps
- I didn't fetch WCAG 3.3.1/3.3.3 or ARIA authoring guidance this session; the error-messaging advice is standard practice.
- Firefox support for `base-select` beyond the flag is unknown.

---

## 13. Data and stats visualisation on marketing sites

### Takeaway
Marketing data viz in 2026 is about one honest number or one route, animated once:
- count-up stats with tabular numerals;
- line or area charts that draw on scroll;
- scroll-driven SVG maps;
- occasionally instanced 3D "data as matter".

Accuracy and accessibility come first: the real value is in HTML, the motion only reveals it.

### Cited Findings
- Codrops "Creating Scroll-Driven SVG Map Animations with GSAP" (May 21 2026). A digest describes ScrollTrigger animating map routes and trajectories. — [digest: fe-bits-weekly](https://github.com/yusixian/fe-bits-weekly) citing [Codrops](https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/) [digest]
- Codrops "Animating 160,000 Cubes in Three.js to Visualize Dithering" (Apr 1 2026) and "Creating an Immersive 3D Weather Visualization with React Three Fiber" (Sep 18 2025). — [Codrops](https://tympanus.net/codrops/2026/04/01/animating-160000-cubes-in-three-js-to-visualize-dithering), [Codrops](https://tympanus.net/codrops/2025/09/18/creating-an-immersive-3d-weather-visualization-with-react-three-fiber) [title-only]
- Number animation components: NumberFlow (`Intl` formatting, `trend`, reduced-motion default) and Motion+ `AnimateNumber` ("counters, dynamic pricing, countdowns"). — [NumberFlow](https://number-flow.barvian.me/), [Motion](https://motion.dev/docs/react-animate-number) [primary]
- Scroll-triggered play-once (`animation-trigger`, Chrome 146) can replace IntersectionObserver for "animate when visible". — [Chrome blog](https://developer.chrome.com/blog/scroll-triggered-animations) [primary]
- DrawSVG is among the free GSAP plugins (earlier notes, gsap.com/pricing).

### Inferences (pattern cards)
**D1. Count-up stats**
- *Build:* the HTML contains the final value (`<data value="4200000">4.2M</data>`). On first view, animate from 0 with NumberFlow or a GSAP tween writing `textContent` through `Intl.NumberFormat` (`notation:"compact"`). Use `tabular-nums` and a fixed min-width.
- *Pitfalls → fixes:* screen readers should read the final value, so put `aria-hidden` on the animating clone or animate only after the accessible text is set. Play once. Avoid the "big number + small label + gradient" hero cliché flagged in the earlier notes.

**D2. Chart draw-on**
- *Look/feel:* Line or area paths draw left to right as the chart enters, data points pop in sequence, and the axis labels stay static.
- *Build:* SVG `<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">` → 0 (CSS transition or `view()` timeline). Area fill via `clip-path: inset(0 100% 0 0)` → `inset(0)`. Points staggered with `sibling-index()`.
- *Pitfalls → fixes:* provide a `<table>` or summary sentence (`<figcaption>`); colour plus pattern for series; reduced motion = drawn state.

**D3. Scroll-driven route or map**
- *Build:* SVG map; route path drawn with a scrubbed `strokeDashoffset`; MotionPath for a marker following it; captions at labels.
- *Ref:* [Codrops SVG map](https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/).

**D4. Morph between datasets (bar race, before/after)**
- *Build:* bars as DOM elements re-ordered with GSAP Flip or Motion `layout` (transform-based), with values via NumberFlow.

**D5. Instanced "data as matter"**
- *Look/feel:* Thousands of particles or cubes assemble into the shape of a number, map or chart.
- *Build:* three.js `InstancedMesh` (or TSL compute on WebGPU) with per-instance target positions; progress uniform from scroll.
- *Pitfalls → fixes:* the real numbers are in DOM text; respect reduced motion (show the assembled state).

### Gaps
- No 2025–26 primary source on chart-animation accessibility specific to marketing sites was fetched; the guidance above is standard practice.

---

## 14. Testimonials and social proof

### Takeaway
Social proof motion should stay calm:
- slow quote crossfades with line reveals;
- logo marquees that pause;
- swipeable card decks.

The CMS-driven, timeline-choreographed testimonial hero is a 2026 Codrops pattern. Native CSS carousels (`::scroll-button`/`::scroll-marker`, which build accessible controls automatically) are Chrome-only, so they must enhance a plain scroll-snap list. Anything auto-advancing for more than 5s needs a pause control (WCAG 2.2.2, Level A).

### Cited Findings
- WCAG 2.2.2 (Level A): "For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it…". Auto-updating information likewise needs pause, stop, hide or a frequency control. — [W3C Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) [primary]
- CSS carousels (Chrome 135+) [Chrome blog](https://developer.chrome.com/blog/carousels-with-css) [primary]; BCD confirms Chrome-only:
  - `::scroll-button(left|right)` and `::scroll-marker`/`scroll-marker-group`.
  - "The browser places the elements as siblings, with the proper roles, in the proper tab order, and maintains their state". `:target-current` styles the active marker.
- Codrops "Building an Animated Testimonial Hero Using the GSAP Timeline and Dynamic CMS Data" (Aug 18 2026). — [Codrops](https://tympanus.net/codrops/2026/08/18/building-an-animated-testimonial-hero-using-the-gsap-timeline-and-dynamic-cms-data/) [title-only]
- Codrops "Mastering Carousels with GSAP: From Basics to Advanced Animation" (Apr 21 2025). — [Codrops](https://tympanus.net/codrops/2025/04/21/mastering-carousels-with-gsap-from-basics-to-advanced-animation) [title-only]
- `embla-carousel` 8.6.0 (Apr 2025), MIT. — [npm](https://registry.npmjs.org/embla-carousel) [primary]

### Inferences (pattern cards)
**TS1. Quote spotlight with line reveal**
- *Look/feel:* One large quote at a time. Lines rise in (SplitText masks); author and logo fade; a thin progress bar shows time to the next quote; a pause button sits beside it.
- *Build:* a GSAP timeline per quote built from CMS data; `repeat:-1`. The pause button toggles `tl.paused()`; pause on hover, on focus-within and when the tab is hidden.
- *Pitfalls → fixes:* WCAG 2.2.2 pause control; every quote is in the DOM (crawlers, screen readers; inactive ones `inert` or visually hidden with an accessible list alternative); reduced motion = no autoplay, manual arrows.

**TS2. Logo marquee**
- *Build:* CSS keyframes on a duplicated track (`aria-hidden` on the clone), `animation-play-state: paused` on `:hover`/`:focus-within`, `prefers-reduced-motion` → static wrapped grid. Velocity-reactive speed optional (section 6, T4).

**TS3. Swipeable card deck or carousel**
- *Build:* base layer is `overflow-x: auto; scroll-snap-type: x mandatory` list items (works everywhere, touch-native). Enhance with `::scroll-button()`/`::scroll-marker` in Chrome via `@supports selector(::scroll-marker)`. Use Embla or GSAP Draggable + Inertia for a stacked "deck" (cards rotate and fly off on swipe).
- *Pitfalls → fixes:* the stacked deck needs buttons as alternatives to swipe; announce "3 of 8".

**TS4. Wall-of-love masonry**
- *Build:* CSS columns or grid; stagger-in on view with `animation-delay: calc(sibling-index() * 40ms)` inside `@supports`. Optional: subtle infinite vertical drift of columns at different speeds (pause control needed if more than 5s).

**TS5. Video testimonials**
- *Build:* muted hover-preview loops (`preload="none"` until hover); click opens a `<dialog>` player with sound and captions.
- *Touch:* tap opens the player directly.

### Gaps
- The W3C WAI carousel tutorial (animations page) returned 403, so its specific guidance isn't quoted.
- I couldn't read the Codrops testimonial-hero article.

---

## 15. Loaders and preloaders (and when not to use them)

### Takeaway
Use a preloader only when the experience genuinely cannot start without heavy assets (a WebGL world, a 3D product) and the wait is unavoidable. Even then, tie it to real progress, keep it under ~1.5s when assets are cached, and skip it on repeat visits. WCAG 2.2.2 exempts a loader that is the only content while files download. Everything else should stream: SSR content plus skeletons, with the signature motion moved to the hero reveal.

### Cited Findings
- WCAG 2.2.2's Understanding document notes that a preloader animation shown as the only page content during downloads does not need a pause mechanism, "even though the animation may run for more than 5 seconds for users with slower connections". — [W3C 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) [primary]
- A 2026 portfolio README describes a canvas "PixelReveal" overlay: "A grid of rectangles sweeps top-to-bottom, each cell briefly flashing blue before clearing", with "per-cell timing noise added around a linear sweep to avoid a mechanical look". It credits Codrops' scroll-revealed WebGL gallery (Feb 2 2026). — [TomPlanche/portfolio-v222 README](https://github.com/TomPlanche/portfolio-v222) [secondary]
- dotLottie's `DotLottieWorker` renders on a Web Worker with `OffscreenCanvas`, keeping loaders off the main thread. — [dotlottie-web README](https://github.com/LottieFiles/dotlottie-web) [primary]
- The earlier notes' rule (≤1–1.5s, never block ready content, skip under reduced motion and on repeat visits, LCP must be real content) still applies.

### Inferences (pattern cards)
**L1. Real-progress counter plus curtain**
- *Look/feel:* A big 0→100 counter (tabular numerals) with a thin bar; at 100 a curtain splits and the hero headline rises.
- *Build:* progress = loaded bytes or assets from `THREE.LoadingManager` / `Promise.allSettled` of `img.decode()`, font loading and texture loads. Displayed with a lerp so it never jumps backwards. A minimum display of ~600ms avoids flashes. Set `sessionStorage` to skip on repeat.
- *Pitfalls → fixes:* fake timers that delay ready content hurt LCP and trust. The page content stays in the DOM underneath (no `display:none` on `<main>` for crawlers). Add `aria-busy` on main plus a polite "Loading" status.

**L2. Wordmark that becomes the nav logo**
- *Build:* a centred SVG wordmark draws (`stroke-dashoffset`), then `Flip.fit(wordmark, navLogo)` animates it to the header slot and swaps to the real logo.

**L3. Grid or pixel dissolve reveal**
- *Build:* a canvas overlay of cells cleared in a noisy sweep (per the README above); `aria-hidden`; removed from the DOM after.

**L4. No preloader (recommended default)**
- *Build:* SSR content; skeletons that match final layout boxes; images with `aspect-ratio` and LQIP; WebGL fades in when ready (start at `opacity: 0` on the canvas only).

### Gaps
- No 2025–26 field data quantifying bounce or LCP impact of preloaders on award sites.

---

## 16. Footers

### Takeaway
Award-level footers are a sign-off moment:
- a curtain reveal from beneath the page;
- a giant fitted wordmark;
- live local time or status;
- a final magnetic CTA.

Primary 2025–26 sources specific to footers are thin. The cards below are synthesised from documented primitives (sticky positioning, ScrollSmoother/Lenis parallax, `text-box`, container units).

### Cited Findings
- ScrollSmoother `data-speed`/`data-lag` and Lenis (native scroll keeps `position: sticky` working) are the documented primitives for footer parallax and reveals. — [ScrollSmoother docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/), [Lenis README](https://github.com/darkroomengineering/lenis) [primary]
- `text-box` trim is cross-engine since Aug 2026, useful for edge-to-edge wordmarks. — [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-box.json) [primary]
- Safari 27 adds scroll anchoring, which prevents jumps when content (e.g. a lazily loaded footer embed) is inserted above the viewport. — [WebKit Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) [primary]
- The earlier notes' agency map lists "giant wordmark that reveals or parallaxes on reach; local time/clock; marquee of contact".

### Inferences (pattern cards)
**FT1. Curtain-reveal footer**
- *Look/feel:* The page lifts away like a sheet, revealing a dark footer that was "underneath" the whole time.
- *Build:* `footer{position: sticky; bottom: 0; z-index: 0}` with `main{position: relative; z-index: 1; background: var(--bg)}`, or a fixed footer with a `main` margin-bottom equal to footer height. Optional: footer content scales 0.95→1 on a `view()` timeline.
- *Pitfalls → fixes:* footer links must be reachable and not covered (check focus visibility); a tall footer on mobile breaks the sticky trick, so disable it below a height threshold.

**FT2. Giant fitted wordmark**
- *Build:* SVG `<text textLength="100%" lengthAdjust="spacingAndGlyphs">` or `font-size: Xcqi` in a container-query box, plus `text-box: trim-both cap alphabetic`. Letters rise via SplitText chars on enter, or parallax upward with `data-speed="0.8"`.
- *Pitfalls → fixes:* `aria-hidden` if it duplicates the logo; ensure no horizontal overflow at 320px.

**FT3. Live local time, status and CTA**
- *Build:* `Intl.DateTimeFormat(…, {timeZone:"Europe/London", hour:"2-digit", minute:"2-digit"})` updated every minute (not every second); a magnetic "Start a project" button (section 4, C2); copy-email micro-interaction (section 18).

**FT4. Playful physics sign-off (optional)**
- Letters or brand shapes fall and stack (Matter.js or Rapier) when the footer enters; draggable. Keep it off on reduced motion and low-power devices.

### Gaps
- I found no 2025–26 Codrops or primary article focused on footer patterns. This section is mostly synthesis.

---

## 17. 404 and empty states

### Takeaway
Distinctive 404s and empty states are small interactive characters or toys (Rive state machines, SVG + GSAP rigs, tiny physics scenes), but they must lead with recovery: search, top links, home. Rive's Data Binding and Scripting (Luau) make data-reactive characters practical without bespoke JS. The 2026 Codrops "Claude mascot" breakdown is a public reference for SVG character rigs.

### Cited Findings
- Rive Data Binding (view models exposing text, numbers, booleans, images, lists) and Scripting (Luau: procedural drawing, layout, listeners) let a character react to app state, e.g. the search query or item count. — [Rive data binding](https://rive.app/docs/runtimes/data-binding), [Rive scripting](https://rive.app/docs/scripting/getting-started) [primary, via WebFetch summaries]
- dotLottie v2 supports state machines and theming in one `.lottie` file. — [dotlottie-web README](https://github.com/LottieFiles/dotlottie-web) [primary]
- Codrops "Reverse-Engineering Claude AI's Mascot Animations with SVG and GSAP" (May 5 2026). Followers describe "asymmetric hop easing, per-limb phase offsets, and holding…" as the ideas that make motion "read as weight". — [digest: Ivel10Go/claude-mascot](https://github.com/Ivel10Go/claude-mascot) [digest]
- A Codrops case study on comfort-oriented "emotional" websites (May 30 2026). — [Codrops](https://tympanus.net/codrops/2026/05/30/the-future-of-emotional-technology-comfort-websites-for-growth-and-self-awareness) [title-only]

### Inferences (pattern cards)
**E1. Interactive 404 toy**
- *Look/feel:* A big "404" made of physics letters you can knock over, or a lost-character animation that follows the cursor, above a clear search box and three links.
- *Build:* SVG plus GSAP rig, Rive, or a light physics canvas.
- *Pitfalls → fixes:* the server must return HTTP 404 (not 200). The headline states the problem in text. Recovery links come first in DOM order. Reduced motion: a static illustration.

**E2. Data-reactive empty-state character**
- *Build:* Rive file with a view model property such as `itemCount` or `isSearching`; the app sets it via `viewModelInstance` and the character's state machine responds (sleeping, waking, pointing at the CTA).
- *Pitfalls → fixes:* the canvas is `aria-hidden`; the message and CTA are DOM text.

**E3. Search-first 404 with suggestions**
- *Build:* the input autofocuses only if it's the page's primary action; the URL slug pre-fills the query; results animate in with stagger.

### Gaps
- No primary 2025–26 source on 404 or empty-state best practice was fetched (e.g. Google Search Central on soft 404s). The HTTP-status advice is standard practice, not sourced here.

---

## 18. Micro-interactions (buttons, toggles, toasts, copy, likes)

### Takeaway
Micro-interactions earn "award" polish through:
- physically plausible springs (Motion's negative-bounce overdamped springs, fast retargeting);
- asymmetric open/close easing (GSAP `easeReverse`);
- native entry/exit for transient UI (`popover` + `@starting-style`);
- always pairing the visual with an accessible state (`aria-pressed`, live regions).

Haptics via `navigator.vibrate` work only on Chromium/Android (never on Safari; Firefox removed it in 129), so never rely on them.

### Cited Findings
- Motion springs: negative `bounce` (0 to −1) for overdamped springs (13.5.0); retargeting 80% faster (13.3.0); a `path`/`arc()` transition option (12.40). — [Motion changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md) [primary]
- GSAP `easeReverse` plus `timeScale(1.5).reverse()` for snappier closes of toggleable UI. — [GSAP 3.15](https://gsap.com/blog/3-15/) [primary]
- `@starting-style`, `transition-behavior`, `popover` and `commandfor` all work in every engine (Section 1 table). — [BCD](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/starting-style.json) [primary]
- `Navigator.vibrate`: Chrome 32+, Safari never, Firefox removed in 129. — [BCD Navigator](https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json) [primary]
- Codrops "Cloth Simulation: Balloon Button" (baked Blender sim as an interactive button, 2025). — [repo README](https://github.com/codrops/BalloonButton) [secondary]
- Codrops "7 Must-Know GSAP Animation Tips for Creative Developers" (Sep 3 2025). — [Codrops](https://tympanus.net/codrops/2025/09/03/7-must-know-gsap-animation-tips-for-creative-developers) [title-only]
- `linear()` easing for CSS springs is cross-engine (earlier notes, BCD).

### Inferences (pattern cards)
**M1. Button press and hover**
- *Look/feel:* Hover: the label slides up and is replaced by a duplicate from below (text roll) and the background fills from the cursor's entry side. Press: scale 0.97 with an overdamped spring back.
- *Build:* text roll with two stacked spans in an `overflow: clip` box, translating `-100%` on `:hover`/`:focus-visible`. Directional fill: compute the entry edge on `pointerenter`, set `--x`/`--y`, and animate a `clip-path: circle(0 at var(--x) var(--y))` → `circle(150%)` pseudo-element. Press via `:active{transform:scale(.97)}` with a `linear()` spring easing.
- *Pitfalls → fixes:* the duplicate label is `aria-hidden`; identical focus-visible state; keep the hit area constant (don't scale the hit box below 44px).

**M2. Toggle or switch**
- *Build:* `<button role="switch" aria-checked>` or a checkbox; thumb `translateX` with a spring (Motion `layout` on the thumb, or CSS `linear()` spring); track colour transition; optional icon morph (sun/moon via MorphSVG or two crossfaded SVGs).
- *Pitfalls → fixes:* state must be visible without colour (position plus icon); reduced motion = instant.

**M3. Toast stack**
- *Look/feel:* Toasts slide in from the bottom, stack with slight scale/offset, expand on hover, and swipe away.
- *Build:* each toast is `popover="manual"` (top layer, no light-dismiss); entry via `@starting-style`; stacked offset via `translateY(calc(sibling-index() * -8px)) scale(calc(1 - sibling-index()*.04))`; exit via `transition-behavior: allow-discrete`. Swipe-dismiss via pointer events or Motion `drag="x"`. Announce through a persistent `role="status"` live region (not the popover itself).
- *Pitfalls → fixes:* WCAG 2.2.1 timing, so pause the auto-dismiss on hover and focus; don't put the only copy of important info in a toast.

**M4. Copy to clipboard**
- *Build:* `navigator.clipboard.writeText()` inside the click handler; the icon morphs (copy → check) for 1.5s; a polite live region says "Copied".
- *Touch:* the same; optionally `navigator.vibrate(10)` where supported (feature-detect; no Safari).

**M5. Like or heart burst**
- *Look/feel:* The heart pops (scale 0.8 → 1.2 → 1), fills, and a ring plus 6–8 particles burst.
- *Build:* WAAPI keyframes on the icon; particles are absolutely positioned spans animated with `element.animate()` and removed on finish (or a small Rive/dotLottie asset). Use `aria-pressed` on the button. Optimistic UI with rollback.
- *Pitfalls → fixes:* no burst under reduced motion (fill change only).

**M6. Accordion or disclosure**
- *Build:* `<details>` + `::details-content{transition: content-visibility .3s allow-discrete, height .3s}` with `interpolate-size: allow-keywords` on `:root` (Chromium animates; other engines snap, which is acceptable). Cross-engine smooth fallback: a `grid-template-rows: 0fr → 1fr` wrapper.

### Gaps
- I didn't fetch MDN on `::details-content` support or `navigator.clipboard` permissions; verify those before prompting.
- No 2026 source compared toast libraries (e.g. Sonner) for accessibility.

---

## 19. Sound on the web (when it's appropriate, autoplay rules, Howler/Tone/Web Audio)

### Takeaway
Sound belongs on immersive or brand-experience sites (WebGL worlds, games, music and audio brands), always **opt-in**: off by default, with a visible, persistent toggle. Browsers block audible autoplay until a user gesture, so create or resume the `AudioContext` inside the first click (Tone.js requires `await Tone.start()`).
- **Howler** (7kb gzipped, sprites, spatial; last released 2023) is fine for UI sound sprites.
- **Tone.js** suits generative or musical audio.
- **Raw Web Audio** (`AnalyserNode`) drives audio-reactive visuals.

2026 Codrops builds coordinate GSAP, Three.js, Lenis and Web Audio from one loop and cap simultaneous voices.

### Cited Findings
- Chrome autoplay [policy](https://developer.chrome.com/blog/autoplay) [primary]:
  - "Muted autoplay is always allowed." Audible autoplay is allowed if the user has interacted with the domain, or on desktop when the Media Engagement Index threshold is crossed, or for an installed PWA.
  - Top frames can delegate to iframes with `allow="autoplay"`.
  - An `AudioContext` created before a user gesture starts suspended and must be resumed after one.
- MDN [Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) [primary]:
  - Calling Web Audio `start()` "outside the context of handling a user input event is subject to autoplay rules".
  - Catch `play()` promise `NotAllowedError` and show a play UI.
  - `navigator.getAutoplayPolicy()` exists (BCD: Firefox only).
- Tone.js: "Browsers will not play _any_ audio until a user clicks something… Run your Tone.js code only after calling `Tone.start()` from an event listener"; it returns a promise. — [Tone.js README](https://github.com/Tonejs/Tone.js) [primary]
- Howler: defaults to Web Audio with HTML5 Audio fallback, sound sprites, 3D spatial/stereo panning, "As light as 7kb gzipped". npm latest 2.2.4 (Sept 2023). — [howler.js README](https://github.com/goldfire/howler.js), [npm](https://registry.npmjs.org/howler) [primary]
- dotLottie v2 files can carry audio. — [dotlottie-web README](https://github.com/LottieFiles/dotlottie-web) [primary]
- Codrops audio-in-experience references:
  - "The Architecture Behind Trionn: Coordinating GSAP, Three.js, Lenis and Web Audio" (Jul 15 2026). — [Codrops](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/) [title-only]
  - "Coding a 3D Audio Visualizer with Three.js, GSAP & Web Audio API" (Jun 18 2025). — [Codrops](https://tympanus.net/codrops/2025/06/18/coding-a-3d-audio-visualizer-with-three-js-gsap-web-audio-api) [title-only]
  - "Building an Endless Interactive Glass Xylophone with Three.js" (Aug 4 2026). — [Codrops](https://tympanus.net/codrops/2026/08/04/building-an-endless-interactive-glass-xylophone-with-three-js/) [title-only]
  - "Garden Anomaly caps audio at 8 voices" (Aug 6 2026). — [digest: alexwelcing/Lupi](https://github.com/alexwelcing/Lupi) [digest]
- The same digest notes "iOS Low Power Mode caps rAF at 30 Hz (WebKit bug 168837)". — [digest](https://github.com/alexwelcing/Lupi) [digest; WebKit bug not opened]

### Inferences (pattern cards)
**SND1. Opt-in sound toggle**
- *Look/feel:* A small animated equaliser icon ("Sound off/on") in a corner; turning it on fades in ambient audio over ~1s.
- *Build:*
  - A `<button aria-pressed>` creates or resumes the `AudioContext` (or `await Tone.start()`, or Howler's first `play()`) inside the click handler. Gain ramps with `linearRampToValueAtTime`.
  - Persist the choice in `localStorage`. Pause on `visibilitychange`.
  - **Core trick:** a single master `GainNode`, so mute, duck and fade are one parameter.
- *Pitfalls → fixes:* never autoplay audible sound (blocked, and hostile); honour reduced motion for audio-reactive visuals; provide captions or transcripts for spoken content.

**SND2. UI sound sprites**
- *Build:* one Howler sprite file (`sprite: {hover:[0,120], click:[200,90]}`) at low volume, with random pitch variation ±5% to avoid fatigue. Cap concurrent voices (cf. "8 voices") and throttle hover sounds.
- *Pitfalls → fixes:* sounds only after opt-in; nothing on focus events (screen-reader users would be overwhelmed).

**SND3. Generative or ambient score tied to scroll and interaction**
- *Build:* Tone.js synth or sampler; scroll progress maps to filter cutoff or chord changes on the Transport; pointer speed maps to note density.
- *Pitfalls → fixes:* CPU on low-end phones, so keep it to one or two synths; stop when hidden.

**SND4. Audio-reactive visuals**
- *Build:* `AnalyserNode.getByteFrequencyData()` once per rAF feeds uniforms (bass → scale, highs → particles); smooth with a lerp.
- *Ref:* [3D audio visualizer](https://tympanus.net/codrops/2025/06/18/coding-a-3d-audio-visualizer-with-three-js-gsap-web-audio-api), [Trionn architecture](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/).

**When sound is appropriate (synthesis):** experiential brand sites, games, music and audio products, and a single "signature" sound on a CTA after opt-in. **Inappropriate:** content and SaaS marketing pages, forms, or any page people read at work.

### Gaps
- I didn't fetch Safari- or WebKit-specific autoplay documentation. The Chrome and MDN rules are cited, and Safari behaviour is covered only by MDN's `playsinline` note.
- No 2026 source on whether Howler is still maintained beyond the npm date (Sept 2023), nor a vetted modern alternative.
