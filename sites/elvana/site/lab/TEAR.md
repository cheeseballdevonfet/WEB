# Tear engine v2

The home page's signature moment (tear strips off the yellow hoarding to find the red poster underneath) and the corner peel used on inner pages. Both run on one engine and one sheet of paper: every strip, coil, falling sheet and corner peel uses the same material constants, so every release looks like the same paper.

- Engine: `site/src/js/tear.js`. One IIFE, no dependencies, exposes `window.ElvanaTear`.
- CSS: `site/src/css/tear.css`. Hero layering, the corner peel, and the still fallbacks.
- Lab: `site/lab/tear-lab.html`. Self-contained, works from file://. It holds the hero, three corner peels, slow motion (S), Show physics, and replays of every test gesture.

## The paper model in plain words

A torn strip is a ribbon of paper. One end is still glued to the wall at the **tear head**; the other end, the **free end**, is in your hand. Its width is fixed by the material; only the torn edges are random.

**While you hold it**, the strip folds back over itself at the head:

1. It goes round a small **fold cylinder** of radius `Rmin`.
2. It then runs straight toward your hand, rising gently off the wall.
3. If your hand comes back closer than the strip is long, nothing vanishes: the spare length winds into a **coil** at your hand. The coil has the paper's own **memory radius** `R0`, and every wrap adds the paper's **thickness** `h`.

Pull further than the strip reaches and the tear advances along your pull. A 180-degree peel tears half as fast as the hand moves. The tear may steer only a little per pixel and never more than about 41 degrees from where it started. Pull backwards (more than about 107 degrees away from the tear) and it stops advancing: the strip goes taut and swings round the head instead. The shape is a pure function of where the head is, where your hand is, how much has been torn, and the material. So the same gesture always gives the same shape.

**When you let go**, the paste memory takes over. The free end rolls up toward the head into a spiral coil. One critically damped spring drives it:

- It starts with a small snap of stored curl, then settles.
- It is normalised so every roll lands in exactly 560 ms, short strip or long.
- The coil ends lying across the head, on the poster, with a soft contact shadow.

A twisted flap untwists as it rolls, so every resting coil lies along its head edge.

**Grab a coil or a flap mid-roll** and it stops where it is, then unrolls as you pull. The grip starts exactly where the paper is and catches up with your finger only as your finger moves, so nothing snaps or teleports.

**Tear enough** (46% of the poster) or press the Tear button a fourth time, and the whole sheet lets go. It peels from the top under gravity, rolling itself up as one coil of the same paper, then drops off the bottom edge. **Paste it back** squeegees a fresh sheet on, and a corner lifts again after 650 ms as an invitation.

A strip that tears into an older hole, or runs off the poster, comes off clean. If you are holding it, it stays in your hand; let go and it drops, with your hand's measured velocity.

### Material constants (`MATERIAL`, one commented block at the top of tear.js)

| Constant | Value | Meaning |
| --- | --- | --- |
| `memoryK`, `memoryMin/Max` | 0.045, 12 to 26 px | `R0 = 0.045 * min(W, H)`: the radius the stock curls to by itself |
| `thickness` | 1.2 px | `h`: each wrap adds this to a coil's radius (spiral: `r = R0 + h * turns`) |
| `foldRadius` | 7 px | `Rmin`: the tightest fold while pulled taut (bending stiffness) |
| `widthK`, `widthMin/Max` | 0.26, 96 to 220 px | strip base width `0.26 * min(W, H)`, the same for every strip |
| `taper` | 0.085 | px of width lost per px torn (tears converge slowly) |
| `minWidth` | 12 px | narrower than this, the strip tears off |
| `steer`, `maxVeer` | 0.011 rad/px, 0.72 rad | how fast and how far a tear can turn toward the pull |
| `stall` | -0.3 | cos of the pull angle past which the tear stops advancing |
| `twist` | 0.9 x width | the run over which a flap twists from the head edge to the pull direction |
| `lift` | 0.1 | slope at which a held flap rises toward the hand; it lowers as it rolls |
| `cup` | 0.12 rad | a free flap cups slightly across its width (shading only) |
| `edgeEnvelope` | 4.6 px | a coil's ends sit this far past the strip's mean edge (stacked torn edges) |
| `perspective` | 900 px | paper at height z is drawn `1 + z / 900` wider |
| `front`, `back`, `fibre` | poster colour, #E2E1DB, #FBFBF6 | printed face (read from the poster), paper back, torn-fibre white |

Seeded noise is used only for the torn-edge jaggedness and fibre tufts, never for a physical parameter. Seeds come from a counter, so replays are identical.

### Motion tokens (`MOTION` and `EASE`)

| Token | Value | Use |
| --- | --- | --- |
| `hz` | 240 | fixed physics substeps per simulated second |
| `roll` + `snap` | 560 ms, 0.55 | release: one critically damped spring with a 0.55 snap, normalised to land at 560 ms |
| `lift` | 180 ms | a held flap rising off the wall, critically damped |
| `peelRoll` / `peelAway` | 620 / 900 ms | corner peel rolling back to rest / rolling away |
| `catchPx` | 70 px | the grip's offset to the finger decays by e every 70 px the finger travels |
| `peek`, `peekLift` | 240 ms, 15 px | a hovered edge lifts, critically damped |
| `letGo` | 1000 ms, `tug` curve | the sheet unpeeling under gravity |
| `gravity`, `fallFade` | 2600 px/s², 420 ms | paper that has come off |
| `paste` | 1100 ms, `paste` curve | squeegee |
| `scripted` | 760 ms, `pull` curve | keyboard tear |
| `invite` | 650 ms | delay before the corner lifts by itself |
| `velocityMs` | 60 ms | least-squares window for pointer velocity |
| `EASE.paste` | cubic-bezier(.2,.7,.1,1) | squeegee settle |
| `EASE.tug` | cubic-bezier(.55,0,.75,.2) | gravity |
| `EASE.pull` | cubic-bezier(.42,0,.3,1) | a hand pulling |

### States

- **Strip:** `held` (a pointer) or `script` (the keyboard), then `roll` (memory roll-up), then `rest`. `gone` once it has come off and is falling.
- **Sheet:** intact, then let-go (peel line falling), then revealed, then paste (squeegee), then intact with the corner invitation.
- **Corner peel:** `rest` (small memory curl), `held`, `roll`, then rest again or peeled (`.is-peeled`).

### Time

Physics advances only in fixed 1/240 s substeps, through an accumulator; drawing interpolates between the last two substeps. Pointer events are applied at their own timestamps. The same gesture therefore gives the same geometry at 30, 60 or 144 fps (measured difference: 0.000 px).

Slow motion scales simulated time, so the paper slows down but a held strip still follows your finger exactly. The engine sleeps when nothing moves and while the hero is off screen.

## Input

- **Pointer events with capture,** for mouse, touch and pen.
- **Touch on paper never scrolls the page.** The edge zones (`.grip`) are `touch-action:none`, and a touch that grabs paper cancels scrolling. A vertical swipe in the middle of the poster still scrolls the page. A horizontal swipe in the middle starts a strip from the side it moves away from.
- **Velocity** is a least-squares fit over the last ~60 ms, used for:
  - a piece that comes off as you let go;
  - deciding a corner peel on a flick;
  - the swipe start;
  - the debug overlay.
- **Keyboard:** the "Tear a strip" button runs the same physics with a scripted grip path (three planned strips that never cross each other, then let-go, then paste). Each corner peel adds a "Peel back" button that is visually hidden until focused; it becomes "Put it back" once peeled.
- **Reduced motion and no JavaScript:** nothing mounts. The page shows its still, layered composition: the torn hero through `#still-wide` / `#still-tall`, and every peel with a static curled corner.

## Rendering

The page has one canvas per hero (the existing `.tear-canvas`) and one per peel.

- **Settled pieces.** Settled rims (the white torn fibre and the poster's edge shadow) and resting coils live on two offscreen canvases. Each new piece is added once, and a hole that is still growing erases the settled rims it tears through.
- **Per frame.** Only the moving paper is drawn: the box it used last frame is cleared and refilled from the settled layers. This is verified to be pixel-identical to a full redraw.
- **Shading.** Paper is shaded from its surface normal: the printed front has a satin sheen, the white back is matte and brighter inside curls (paper bounces light).
- **Shadows.** One cast shadow per flap is offset by each part's height and blurred at quarter resolution. A tight contact shadow sits along the crease.
- **Torn edges.** They show a white fibre core and a broken fibre haze, anchored to the material.
- **Pixel density** is capped at 1.5.
- **Clip winding.** Every clip path is wound the same way as the full-sheet rectangle. Chrome merges `#tear-clip`'s children into one nonzero path, so opposite windings used to cancel where holes overlapped.

## API

```js
ElvanaTear.mountHero(heroEl, { button, live, clip, canvas, invite = true, front, back, debug })   // -> instance | null
ElvanaTear.mountPeel(peelEl, { corner, label, labelBack, front, back })                          // -> instance | null
ElvanaTear.autoInit()          // mounts every .hero that has a .tear-canvas and every [data-peel]; idempotent
ElvanaTear.setTimeScale(s)     // 1 normal, 0.1 slow motion (also listens for document 'elvana:timescale')
ElvanaTear.MATERIAL, ElvanaTear.MOTION, ElvanaTear.version
```

Both mounts return `null` without motion (reduced motion, or no `motion` class on `<html>`). tear.js calls `autoInit()` itself on `DOMContentLoaded`, unless `window.ElvanaTearManual` is set before the script loads. Mounting twice returns the same instance.

- **Hero instance:** `tear()` (same as the button), `letGo()`, `pasteBack()`, `reset()`, `play(events)` (replays `[{t, type: 'down'|'move'|'up', x, y, touch}]` through the real input code), `setDebug(on)`, `destroy()`, and `debug` (snapshot, sample, verifyFrame, stats).
- **Peel instance:** `peel()` (same as its button), `peeled`, `play(events)`, `reset()`, `destroy()`.
- **DOM events:**
  - `elvana:tear`, `elvana:release`, `elvana:detach`, `elvana:letgo` and `elvana:paste` fire on the hero;
  - `elvana:peel` (`detail.peeled`) fires on the peel;
  - a new `<path>` is still added to `#tear-clip` for every strip, so a sound hook watching that element keeps working.

## DOM contract

### Hero (unchanged from variation A; nothing new is needed)

```html
<section class="hero">
  <div class="sheet sheet-top">... h1 ...</div>          <!-- its background is the printed face -->
  <div class="sheet sheet-under">...</div>               <!-- clip-path:url(#tear-clip) while live -->
  <svg class="still-rim">...</svg>                       <!-- still composition only -->
  <canvas class="tear-canvas js-only motion-only" aria-hidden="true"></canvas>
  <div class="grip grip-b|grip-l|grip-r js-only motion-only" aria-hidden="true"></div>
  <p class="sr" id="tear-live" aria-live="polite"></p>
</section>
<svg ...><defs><clipPath id="tear-clip" clipPathUnits="userSpaceOnUse"></clipPath> #still-wide, #still-tall</defs></svg>
<button id="tear-btn" type="button">Tear a strip</button>
```

The engine creates no hero elements. It writes the paths in `#tear-clip`, the button label ("Tear a strip" / "Paste it back") and the live region, and adds `.grabbing` to the hero while a strip is held.

### Corner peel

```html
<div class="peel" data-peel data-peel-corner="br">   <!-- tl | tr | bl | br; default br -->
  <div class="peel__under" aria-hidden="true">reward line</div>
  <div class="peel__over">essential content</div>
</div>
```

Optional attributes: `data-peel-label="Peel back: Asha's focus"` and `data-peel-label-back`, for when several peels share a page (the About layers). The engine sets `[data-peel-mounted]` and `.peel--live`. It adds `.peel__canvas` (exactly the element's size, so nothing spills), `.peel__grip` (the corner's touch zone) and the `.peel__btn` button. It toggles `.is-peeled` and `.is-grabbing`, and sets an inline `clip-path` on `.peel__over`.

## Integrating

**Home page.** `tear.css` and `tear.js` replace the old pair one for one; the hero markup between the `TEAR` markers stays as it is.

- core.js may keep calling `ElvanaTear.mountHero(hero, { button, live, clip })`; the later `autoInit()` is then a no-op.
- The slow-motion switch keeps working through the `elvana:timescale` event core.js already sends.
- The A-page rules for `.hero`, `.sheet*`, `.still-rim`, `.tear-canvas`, `.grip` and `.hero.grabbing` now live in tear.css, and the page CSS may drop its copies. tear.css also gives `.sheet-under` its own layer (`will-change:transform`) so a growing hole re-masks it instead of repainting its type.

**Inner pages (service heroes, 404, About).** Use the `.peel` markup above in place of the side sheet and load `tear` CSS and JS (front matter `css: tear`, `js: tear`). tear.js mounts every `[data-peel]` on its own.

- Keep essential content on `.peel__over`.
- One peel per hero is the design rule. The engine handles several (each sleeps until touched), for example About's team posters; give each a `data-peel-label`.
- The 404's torn-down scraps can use the same component, or `mountPeel(el, { corner })` on each scrap.

**Reduced motion / no JS.** Nothing to do: tear.css shows the torn hero and the curled corners still.

## How it was verified

The full numbers and contact sheets are in the work folder (`scratchpad/elvana/tear-v2/shots`).

- **Same gestures, both engines.** The lab's gestures went through the old and the new engine with an identical virtual clock: slow short pull, fast long pull, diagonal, reverse (slack), release and re-grab, three strips.
  - Final coil radius equals `R0 + h * turns` within 0.3 px on every release (old engine: 12 to 44 px).
  - Roll duration is ±2% (t99 449 to 465 ms).
  - 0 flicker frames (old: 8 to 25 per release).
  - Identical geometry at 30, 60 and 144 fps (old: up to 3 px apart).
- **Real input.** Playwright mouse at 1440x900 and CDP touch at 390x844, plus the keyboard path through let-go and paste, and the corner peels: no console errors and no network requests.
- **Performance at 4x CPU, with the site QA's own procedure** (frames in the second after the Tear button): ahead of the old engine at 390, 768 and 1440. Draw time at 1440: 0.6 ms average and 1.6 ms p95, normal CPU.
