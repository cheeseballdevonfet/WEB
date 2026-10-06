---
name: creative-web
description: Design and build award-level websites, landing pages, portfolios, product and e-commerce pages, scrollytelling, and individual UI components (heroes, navigation, cursors, page transitions, galleries, pricing, forms, 3D viewers, micro-interactions) using a library of proven prompts and an art-direction → design-system → build → screenshot-critique process. Use when the user asks for a website, landing page, web page, UI component, interactive section or redesign that should look exceptional, "award-winning", "Awwwards-level", "not like a template", or "go all out", with or without brand guidelines.
---

# Creative web

`WEB.md` (next to this file) is the library: whole-page prompts (W01–W08), component prompts by family, power-ups, a web roulette and remixes. Treat each prompt as a brief to execute, not text to show the user.

## Run every request in this order

1. **Intake.** Get the brand: name, what it does, audience, real copy, products, case studies, numbers, photos, logo. If the user gives a URL, read it and extract facts and tone. If there's no brand, keep `BRAND: open` and invent a believable one in three lines, then say so. Never invent clients, metrics, logos or quotes for a real brand; leave a visible TODO instead.
2. **Pick the brief.** Use the matching page prompt from `WEB.md` for whole pages, plus the component prompts for the sections that matter most. For a single component, use its prompt alone. Apply the `STACK:` the user wants (default: one self-contained HTML file, no external requests).
3. **Art direction.** Apply the **Anti-repetition** power-up: list 6 directions, discard the 3 obvious ones, commit to the boldest and say why in one line. If the user wants variety, roll the **Web roulette** and say which four items you used.
4. **Design system first.** Apply **Design system first**: type scale at 375 and 1440, grid, 4–6 colour tokens with contrast ratios, spacing, radius, motion tokens, and the ONE signature interaction. Review it against the generic default and change what matches.
5. **Build.** Semantic HTML first, real text for the headline, then layout, then motion and interaction. Every interactive element gets hover, focus-visible, pressed and disabled states. Respect `prefers-reduced-motion`. Animate transform, opacity and shader uniforms only. Pause off-screen canvases.
6. **Look at it.** Run it in a browser (Playwright if available) and screenshot at 375, 768 and 1440 wide (top, middle, bottom), the signature interaction mid-motion, and one hover/focus state. Critique as a harsh awards juror (Design, Usability, Creativity, Content out of 10; every shot out of 10), fix the 3 weakest, re-screenshot, report before/after. Repeat until nothing is below 7.
7. **Ship-ready checks.** Run the **Ship-ready checks** power-up and report pass/fail with numbers.
8. **Offer one remix** from `WEB.md` that fits (three directions, make it less AI, push the signature moment, mobile pass).

## Rules that always apply

- One extraordinary interaction beats ten decorations; everything else stays quiet and precise.
- Springs with a tiny overshoot at most; nothing linear that starts and stops; elements never all move on the same frame; text is never hard to read while it animates.
- Mobile is designed, not shrunk: tap targets ≥ 44px, no hover-only information, no horizontal scroll.
- Banned: centered title on a gradient, fade-and-slide-up on every section, identical rounded cards with soft shadows, default bento grids, gradient blobs, glassmorphism, purple-to-blue neon, near-black with one acid-green accent, cream with terracotta, Inter/Roboto/Geist, 3D emoji or stock AI imagery, fake logos/testimonials/stats, lorem ipsum.
- Fonts: choose deliberately and embed or self-host them; libraries only when they earn their bytes (GSAP and its plugins are free; Motion and Lenis are MIT).
