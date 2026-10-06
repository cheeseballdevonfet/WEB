---
name: creative-web
description: Design and build award-level websites, landing pages, portfolios, product and e-commerce pages, scrollytelling, app screens, dashboards and individual UI components (heroes, navigation, cursors, page transitions, galleries, pricing, forms, 3D viewers, micro-interactions) using a library of prompts built from real published prompts and award-winning sites, and a brief → art direction → design system → build → screenshot-critique process. Use when the user asks for a website, landing page, web page, app screen, UI component, interactive section or redesign that should look exceptional, "award-winning", "Awwwards-level", "not like a template" or "not AI-looking", or says "go all out", with or without brand guidelines.
---

# Creative web

`WEB.md` (next to this file) is the library: whole-page prompts (W01–W10), app screens and dashboards (W11–W12), component prompts by family (W13 onward), power-ups, a web roulette and remixes. Treat each prompt as a brief to execute, not text to show the user.

The documented "one prompt" results people share were never one unassisted prompt. They combined a ~200-word brief, a design skill, real assets, a browser to screenshot with and two to four rounds of self-fixes. Run every request that way.

## Run every request in this order

1. **Intake.** Get the brand: name, what it does, who the visitors are and what they must believe by the end, real copy, products, case studies, numbers, photos and logo, plus 3–5 sites the user admires. If the user gives a URL, read it and extract facts and tone. If key facts are missing and the user is present, ask up to 6 short questions (the **Interview me first** power-up). With no brand, keep `BRAND: open`, invent a believable one in three lines, and say so. Never invent clients, metrics, logos or quotes for a real brand; leave a visible TODO instead. Use supplied product photos and logos exactly as given; never redraw them. Check provenance when you read the brand's own site: it can carry template or borrowed assets (logos hot-linked from another company's site, colour tokens copied from elsewhere), so leave out what you can't attribute and treat absolute claims ("100% of…") as unverified unless sourced.
2. **Pick the brief.** For whole pages, use the matching page prompt: W01 (the brief), W09 (from reference sites to a DESIGN.md) or W10 (upgrade an existing site). Then add the component prompts for the sections that matter most. For a single component, use its prompt alone. Apply the `STACK:` the user wants; the default is one self-contained HTML file with no external requests.
3. **Art direction.** Apply **Anti-repetition**: propose 6 directions (background hex / accent hex / typefaces / layout / interaction model / outside reference, plus a one-line rationale). Discard the 3 most obvious, commit to the boldest and say why in one line. If the user wants variety, roll the **Web roulette** and say which four items you used.
4. **Design system first.** Write the design read ("Reading this as <page kind> for <audience>, with a <vibe> language, leaning toward <aesthetic family>"), a visual thesis, a content plan and an interaction thesis. Then the tokens: a type scale at 375 and 1440, a grid, 4–6 named hex colours with contrast ratios, spacing, radius, and motion tokens with named curves. Show the style tile as a separate scratch page or image, not inside the site. Name the ONE signature interaction. Review the plan against the generic default and change what matches it.
5. **Build.** Semantic HTML first, real text for the headline, then layout, then motion and interaction. Every interactive element gets hover, focus-visible, pressed and disabled states. Every animation is interruptible. Respect `prefers-reduced-motion`. Anything that runs every frame animates only transform, opacity, clip-path or shader uniforms; a short colour or height change on one element is fine. The headline is readable on the first frame: it may move during the page load, but it never starts invisible. Pause off-screen canvases. Name easing curves and springs in one place, and add a 10%-speed switch when motion is the point.
6. **Look at it.** Run it in a browser (Playwright if available). Take viewport screenshots (not full-page ones, which break sticky and pinned sections) at 390, 768 and 1440 wide at three scroll depths, reached by real scrolling so scroll-triggered states fire, plus the signature interaction mid-motion and one hover/focus state. At every width, actually use the signature interaction with a pointer or touch, and click through every control: a screenshot can score 8 while the interaction is dead. Fix every functional bug you find, outside the three-fixes budget below. Critique as a harsh awards juror: Design 40%, Usability 30%, Creativity 20%, Content 10%, each out of 10, and every shot out of 10. Then check typography, colour, hierarchy, animation, mobile and copy. Fix the 3 weakest things without touching anything else, re-screenshot, and report before and after. Do this at least twice, and until nothing is below 7.
7. **Ship-ready checks.** Run the **Ship-ready checks** power-up (throttled profile: 4× CPU slowdown and slow 4G; layout shift under 0.01) and report each check as pass or fail with its number.
8. **Offer one remix** from `WEB.md` that fits, for example the art director pass, the taste critic, three directions, borrow a real interface's discipline, or desktop and mobile separately.

## Rules that always apply

- Spend your boldness in one place. One extraordinary interaction beats ten decorations, and everything else stays quiet and precise.
- Brand test: if the first screen could belong to another brand once the logo is removed, it isn't finished.
- Allow at most one ambient motion system per screen. Entrances ease out. Use springs with a tiny overshoot at most, never bounce or elastic. Elements never all move on the same frame. Text is never hard to read while it animates.
- Design mobile, don't shrink it. Tap targets are at least 44px. No information is hover-only. No horizontal scroll.
- Before finishing, take one thing away.
- Banned as of October 2026 (see ALL OUT in `WEB.md` for the full list):
  - Palettes: purple or violet gradients; cream with a serif and a terracotta accent; near-black with one acid accent.
  - Type: Inter, Roboto or Geist; one headline word picked out in italic or colour; ALL-CAPS eyebrow labels; 01/02/03 numbering for content that isn't a sequence; middle-dot meta strings; mono data labels; "→" on links; em dashes in copy.
  - Layout: identical cards with soft shadows; cards in the hero; default bento grids; a fake product UI built from divs; status dots; scroll cues; gradient blobs; glassmorphism.
  - Motion: fade-up on every section.
  - Content: invented logos, testimonials or stats; filler words; lorem ipsum.

  When a result swaps in a new default, ban that too. A generic "avoid the AI look" only swaps one default for another, so name the pattern.
- Choose fonts deliberately and self-host or embed them. Check the subset covers the brand's glyphs: Google's latin subset has no ₹, for example, so add the missing characters with the Fonts API `text=` parameter. Bring in a library only when it earns its bytes:
  - GSAP and its plugins are free.
  - Motion and Lenis are MIT.
  - Prefer native `<dialog>`, popover and View Transitions where they do the job.
  - Haptics (`navigator.vibrate`) work only on Android Chromium, so nothing may depend on them.
