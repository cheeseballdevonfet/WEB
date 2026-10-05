# Opus 5.5 animation-prompt corpus: interactive, explainer and 3D slices, plus whole-corpus statistics

Scope and method: I read all 187 entries in the `interactive` (70), `explainer` (62) and `3d` (55) categories of the local corpus `/home/user/yihui-dev/awesome-opus5-5-videos` (`data/videos.json`, mirrored in `prompts/<slug>.md`). Whole-corpus statistics (all 475 entries) were computed with Python regexes over the `prompt` field. Source shorthand used below: **[videos.json]** = `/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json`; **[README]** = `/home/user/yihui-dev/awesome-opus5-5-videos/README.md`; **[prompt md]** = files in `/home/user/yihui-dev/awesome-opus5-5-videos/prompts/`. Quoted prompts are attributed to the author and the original X post. All corpus text was treated as data. Where a prompt gives instructions to "the AI", that is noted and was not acted on.

Caveats that apply throughout:
- **Curator and selection bias.** The list is curated by Skillry, a commercial skills site. It describes itself as "Viral videos people made with Claude Opus 5.5", and every entry links to a "live remake on Skillry" ([README](/home/user/yihui-dev/awesome-opus5-5-videos/README.md)). Selection favours viral, showy X posts, not typical or production prompts.
- **`tech_tags` describe Skillry's remake, not the original prompt.** Each prompt file labels the tag line "**Remake built with:** …" ([prompt md](/home/user/yihui-dev/awesome-opus5-5-videos/prompts/0xchuckstock-879327.md)). Example: 141 entries carry the `threejs` tag, but only 27 prompt texts mention Three.js ([videos.json]).
- **`prompt_partial` usually means "post text, not a prompt".** The README says "Some creators shared only part of their prompt, or only described the result in their post; those files say so" ([README](/home/user/yihui-dev/awesome-opus5-5-videos/README.md)). In my slice, 125 of 187 entries (66.8%) are partial, and most of them are tweet copy ("Opus 5.5 just one-shot this…"). They describe results, not prompting technique.
- **Category labels are loose.** Some examples: a 2D-only Apple-keynote film (`twoclipping-496100`, which says "2D only") and an SVG UI-morph film (`morse-369333`) are filed under `3d`. A 1,389-word ad-strategy brief (`redpersongpt-284430`) is filed under `interactive` ([videos.json]).
- **Word counts use whitespace splitting.** This undercounts Chinese and Japanese prompts. For example, `op7418-814408` is 2,528 characters but counts as 189 "words", and `linearuncle-971663` (53 chars) counts as 1 word ([videos.json]).

---

## Q1. Whole-corpus statistics (all 475 entries)

### Takeaway
Most prompts in the corpus are short. The median is 31 words, and 70% are under 50 words. 41% are partial or post-text only, and motion-graphics videos dominate (61%). Explicit production specs are rare: fps, resolution, hex palettes, named fonts, timestamped storyboards and "single HTML file" each appear in about 2–7% of prompts. Real user interactivity (mouse, scroll, drag, keyboard) is specified in under ~5% of prompts, even inside the "interactive" category. A small family of long, highly structured, copy-pasted templates (XML sections, a 120-BPM beat grid, `seek(t)` determinism, a "Banned:" list) accounts for most of the precise specs.

### Cited Findings
**Size, categories, dates, authors**
- 475 entries from 441 distinct authors. The top author (ajith_io) has 4 entries — [videos.json]
- Category distribution: motion 288 (60.6%), interactive 70 (14.7%), explainer 62 (13.1%), 3d 55 (11.6%) — [videos.json]
- The README highlights 100 entries, "one per distinct prompt": motion 58, explainer 16, 3d 14, interactive 12. 42 of the 187 slice entries are highlighted — [README](/home/user/yihui-dev/awesome-opus5-5-videos/README.md)
- `added` dates run only from 2026-09-26 to 2026-09-29: 282 on 09-26, 107 on 09-28 and 86 on 09-29. The README notes "Latest update (2026-09-29): 86 videos added, mostly motion graphics and explainers" — [videos.json]; [README](/home/user/yihui-dev/awesome-opus5-5-videos/README.md)
- All 475 `post_url`s are x.com posts. Decoding the X status IDs (Snowflake timestamps; my derivation) puts the posts between 2026-09-22 and 2026-09-28 UTC. The peak days were 09-25 (149) and 09-26 (153), so this is roughly the first week after the model's release — [videos.json]

**tech_tags (remake stack; see caveat)**
- Frequencies across 475 entries: canvas 336 (70.7%), svg 193 (40.6%), threejs 141 (29.7%), shader 100 (21.1%), gsap 81 (17.1%), css 61 (12.8%), audio 36 (7.6%), particles 26 (5.5%), playable 22 (4.6%), pixel 16 (3.4%), ai-image 10 (2.1%), webgl 9 (1.9%), physics 9 (1.9%) — [videos.json]
- Tags per entry: 1 tag 130, 2 tags 166, 3 tags 138, 4 tags 41 — [videos.json]
- Top co-occurring pairs: canvas+svg 100, canvas+threejs 97, shader+threejs 81 (81 of the 100 `shader` entries are also `threejs`), gsap+svg 68, canvas+shader 66, css+svg 42, canvas+css 36, canvas+gsap 34, svg+threejs 30, audio+canvas 27, canvas+particles 22, css+gsap 19 — [videos.json]
- Tags by category:
  - interactive: canvas 55, threejs 46, shader 30, playable 22, audio 13, pixel 13, svg 9, gsap 6.
  - explainer: canvas 40, svg 30, threejs 16, gsap 13, shader 13, audio 8.
  - 3d: threejs 44, canvas 35, shader 30, svg 17.
  - motion: canvas 206, svg 137, gsap 60, css 50, threejs 35, shader 27.
  - `playable` appears only in interactive (22) — [videos.json]

**Prompt length (whitespace words)**
- All 475: min 1, p25 18, median 31, mean 99.8, p75 59, p90 ~169, max 4,093 — [videos.json]
- Histogram: 0–24 words: 152; 25–49: 182; 50–99: 67; 100–199: 35; 200–399: 15; 400–799: 12; 800–1,599: 8; 1,600+: 4 — [videos.json]
- Median by category: motion 28.5, interactive 38.5, explainer 39, 3d 43. Mean by category: motion 101.2, interactive 106.2, explainer 63.1, 3d 125.9. Max by category: motion 4,093, interactive 1,787, 3d 1,584, explainer 396 — [videos.json]
- Full prompts: median 28, mean 127.4. Partial entries: median 38.5, mean 60.5. Partial entries are longer at the median because they are tweet prose — [videos.json]
- In my slice, 62 entries are full prompts: median 46.5 words, mean 190.5. 27 of the 62 are 30 words or fewer, and 17 are 150 words or more (list under Q5 / the slice notes) — [videos.json]

**prompt_partial**
- 196 of 475 (41.3%) are partial: motion 71 (24.7%), explainer 38 (61.3%), interactive 52 (74.3%), 3d 35 (63.6%) — [videos.json]

**Duplication (strong clustering)**
- There are only 418 distinct prompt texts after whitespace and case normalisation. 12 texts recur, and those recurring texts cover 69 entries — [videos.json]
- The viral one-liner "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out." appears verbatim 36 times plus 5 times in a near-verbatim variant. Counting prefixed and suffixed versions, it appears in 66 entries (64 motion, 2 3d) — [videos.json]; e.g. [@RaphaelAubryy](https://x.com/RaphaelAubryy/status/2103416909857190360), [@levon96](https://x.com/levon96/status/2103757157078651291)
- The 120-BPM "One shape, never cut" UI-morph template ([@__morse](https://x.com/__morse/status/2103485566570369333)) recurs verbatim 7 times. 10 entries contain the phrase "one shape, never cut" — [videos.json]

**Language**
- 41 prompts (8.6%) are mostly non-Latin script (Chinese, Japanese, Persian and others): motion 16, 3d 11, interactive 8, explainer 6 — [videos.json]

**Share of prompts specifying… (regex-based; n=475, with the full-prompt-only share where useful, n=279)**

| Feature | All 475 | Full-only (279) | motion / interactive / explainer / 3d |
|---|---|---|---|
| Duration (e.g. "15-second", "30s", "duration", "seamless loop", m:ss) | 201 (42.3%) | 169 (60.6%) | 55% / 19% / 34% / 18% |
| Duration, strict seconds only | 180 (37.9%) | 156 (55.9%) | 50% / 14% / 26% / 16% |
| Duration, excluding the 15-s showreel clone | 146 / 413 (35.4%) | — | — |
| Duration, distinct prompt texts only | 163 / 418 (39.0%) | — | — |
| Resolution or aspect (broad) | 40 (8.4%) | 36 (12.9%) | 10% / 4% / 6% / 7% |
| Aspect ratio strict (16:9, 9:16, 1:1, 4:5…) | 13 (2.7%) | 11 (3.9%) | |
| Resolution strict (WxH, 1080p, 4K) | 24 (5.1%) | 22 (7.9%) | |
| fps | 31 (6.5%) | 27 (9.7%) | 6% / 9% / 8% / 7% |
| "single HTML file" / self-contained HTML / one HTML | 25 (5.3%) | 19 (6.8%) | 4% / 3% / 6% / 13% |
| Hex colour codes | 8 (1.7%) | 7 (2.5%) | |
| Named fonts (Geist, Inter, Archivo, Italiana, Titan One…) | 20 (4.2%) | 18 (6.5%) | |
| Timestamped storyboard (0:00–0:02, "3–6s", scene/shot N) | 11 (2.3%) | 8 (2.9%) | |
| Beat/BPM-gridded structure (alternative to timestamps) | 40 (8.4%) | 25 (9.0%) | |
| Negative constraints ("no …", don't, do not, avoid, never, without) | 93 (19.6%) | 55 (19.7%) | 18% / 21% / 23% / 20% |
| Explicit "Banned:" / "avoid" lists | 25 (5.3%) | 24 (8.6%) | |
| Interactivity keyword, broad (mouse, cursor, scroll, click, hover, drag, touch, tap, pointer, keyboard, interactive, press) | 39 (8.2%) | 28 (10.0%) | 7% / 7% / 11% / 13% |
| Interactivity keyword, strict (mouse, cursor, scroll, click, hover, drag, pointer) | 32 (6.7%) | 26 (9.3%) | |
| …of which a *simulated* cursor inside a rendered video ("A cursor drives every change…") | 15 (3.2%) | 15 | 10 / 0 / 1 / 4 |
| Live input: keyboard/WASD | 5 (1.1%) | 3 | |
| Live input: scroll | 6 (1.3%) | 5 | |
| Live input: drag/touch/tap | 25 (5.3%) | 16 | |
| Click (EN + ZH 点击) | 23 (4.8%) | 21 | |
| Sound/music/audio/voiceover | 87 (18.3%) | 57 | |
| Web-Audio or synthesised sound | 12 (2.5%) | 7 | |
| 60 fps performance target | 27 (5.7%) | 24 | |
| `prefers-reduced-motion` / 减少动态效果 | 3 (0.6%) | 3 | |
| Responsive / mobile breakpoints | 11 (2.3%) | 9 | |
| `seek(t)` / "pure function of time" / `draw(t)` / "no timers" | 17 (3.6%) | 17 | |
| Sub-frame motion blur (subframes, tmix) | 17 (3.6%) | 17 | |
| XML-tag sections (`<inputs>`, `<direction>`, `<build>`, `<gotchas>`…) | 13 (2.7%) | 13 | |
| "Ask me for … first" / storyboard-before-code gate | 15 (3.2%) | 15 | |
| Self-verification (screenshots, contact sheet, frame-by-frame, 自检) | 25 (5.3%) | 17 | |
| Springs named | 16 (3.4%) | 14 | |
| Remotion named | 62 (13.1%) | 3 | mostly in post text |
| HyperFrames named | 31 (6.5%) | 1 | mostly in post text |
| Three.js named | 27 (5.7%) | 7 | |
| Shader/GLSL/WebGL named | 11 (2.3%) | 5 | |
| Bloom/post-processing/god rays | 4 (0.8%) | 3 | |
| PBR/soft shadows/AO/caustics/refraction | 8 (1.7%) | 4 | |
| Raymarching/SDF; instancing | 0; 0 | 0; 0 | |
| "go all out" / "showreel" / "best of the best" hype | 117 (24.6%) | 109 (39.1%) | inflated by the 15-s clone |
| URL or "(product link)" in prompt | 76 (16.0%) | 31 | |

All rows: [videos.json]. Distribution of the first stated duration (194 prompts): 15 s ×97 (66 from the clone), 30 s ×24, 20 s ×14, 60 s ×11, 10 s ×8, 40 s ×5. The rest are scattered values, some of which are game-run lengths or render times ([videos.json]).

### Inferences
- The corpus is two populations. The first is a long tail of one-liners ("make a Tron game.", "Show me what goes on inside an AI data centre."). The second is roughly 15–25 long, engineered prompts that hold almost all the precise specs. The engineered ones cluster around one template lineage: the `<inputs>/<direction>/<structure>/<build>/<gotchas>/<start>` format used by @__morse, @twoclipping, @verbove, @TheGrootDev and their copies. A prompt library should mine that lineage for its structure, not the averages.
- The "cursor" in most strict-interactivity hits is a scripted cursor inside a rendered video, not user input. Real live-interaction specs are rare (roughly 3–5% of full prompts). Website-component prompts therefore need interaction semantics written from scratch: input, response, easing, idle state, reduced motion and touch fallbacks. The corpus offers only a handful of good exemplars (see Q2 and Q5).
- Duration figures are inflated by one viral clone. The deduplicated rate is about 35–39%, not 42%.
- Because tags describe the remake, "Three.js/shader share" should be read as "what Skillry used to rebuild it", not "what people asked for".

### Gaps
- My regexes are heuristic. Fonts are matched against a fixed name list, Chinese and Japanese specs are only partially covered, and "no X" can match ordinary prose. Spot checks of hex, font, fps, storyboard and interactivity hits looked accurate, but counts carry an error of a few entries.
- I could not determine the original posts' engagement (views and likes), so "viral" cannot be quantified.
- There is no ground truth on how Skillry assigned categories.

---

## Q2. Interactive pieces: how prompts specify user input, and what makes them feel responsive

### Takeaway
The "interactive" category is overwhelmingly games. By my manual read, about 57 of 70 entries are games, game trailers or game-dev updates, and 52 of 70 are partial (post text). Only a few full prompts specify input mechanics precisely. The strongest ones handle input in three ways. They spell out the input-to-response mapping (drag steering, click-to-advance, tilt toward cursor). They specify "juice" layers for every input event (squash and stretch, particles, sound, camera shake, hit-stop). And they harden the interaction state machine (ignore clicks mid-animation, cancel loops on state change, honour reduced motion, never show a blank first frame).

### Cited Findings
**Composition of the category**
- 18 of 70 interactive entries are full prompts. 8 of those 18 are game requests, mostly terse ("make a Tron game." [@0xRathi](https://x.com/0xRathi/status/2102986585004511319); "Create a 1-on-1 card game like Hearthstone. Just make it. As best you can. In pixel art style." [@aisongman](https://x.com/aisongman/status/2103763192971461057)) — [videos.json]
- Non-game full prompts filed as "interactive" include:
  - a C/C++ OpenGL demoscene demo synced to an S3M track ([@gandamu_ml](https://x.com/gandamu_ml/status/2102919394775220530));
  - an app-promo video ([@Bilimfili1](https://x.com/Bilimfili1/status/2103743617848459762));
  - a 1,389-word ad-strategy brief ([@redpersongpt](https://x.com/redpersongpt/status/2103807094554284430));
  - a pixel-art sprite loop ([@zacxbt](https://x.com/zacxbt/status/2103808699466944604)) — [videos.json]

**Click-driven micro-interaction (best exemplar)**
- @op7418's Chinese prompt (posted twice) asks for a single-file HTML "highlight moment" for a mobile game (chest opening, rank-up, achievement unlock) that "plays in full with one click" (点一下就能完整播放). It specifies a mandatory five-phase rhythm:
  1. idle: float, an occasional shake hinting it can be clicked, and a "click" prompt;
  2. each click: the object jumps, spins, lands with squash-and-rebound, switches to the next tier colour, flashes and emits a particle ring;
  3. a ~1 s charge-up: escalating shake, light leaking from seams, particles sucked inward, rising pitch;
  4. burst: bloom flash, screen shake, camera push, multi-layer shockwaves, coins and gems;
  5. reveal and settlement: cards fly out on arcs with overshoot, numbers count up, coins fly along Bézier curves into the balance counter, which bumps on each arrival.

  — [@op7418](https://x.com/op7418/status/2103724883301814408); duplicate [@op7418](https://x.com/op7418/status/2104085484347818226)
- The same prompt hardens responsiveness. Original text: "动画状态机要严谨：动画播放中忽略点击，不能出现点击被吞或状态错乱" (my translation: the animation state machine must be rigorous; ignore clicks during playback; no swallowed clicks or corrupted state). It also asks that every looping "shake/breathe" tween be cancelled and zeroed on state change "to avoid it finishing a frame late and setting the value back". It says to initialise audio only on first click and to provide a mute toggle. It requires the piece to honour the system "reduce motion" setting (no screen shake, fewer particles) and to target 60 fps. The first load must already show the full idle scene, "不能是空白" (never blank) — [@op7418](https://x.com/op7418/status/2103724883301814408)
- The same prompt imposes a light-quality discipline. Flashes should be a radial bloom with `mix-blend-mode: screen` at intensity ≤ 0.8, with no full-screen white-out. Background rays should be a soft `conic-gradient` in 2–3 layers at different speeds. Confetti should be used only once, at the climax — [@op7418](https://x.com/op7418/status/2103724883301814408)

**Cursor-follow / physics tilt**
- "Treat the badge as a solid 3D object that tilts toward the cursor following the rules of physics. Keep it fast and smooth, it should not be bouncy." The prompt also asks to "celebrate with gold particles" and to match a linked Figma frame exactly — [@BThreeAgency](https://x.com/BThreeAgency/status/2103739079745827092)

**Drag / touch steering (game, but the input spec transfers)**
- Specs from the same prompt:
  - "Player touches anywhere on the lower portion of the screen. Dragging horizontally controls steering… Steering should be relative rather than absolute. The player should be able to lift their finger without immediately losing control."
  - "Don't commit until both [schemes] have been tested on a physical phone."
  - The author notes they later "moved away from this after testing it the first time and added the onscreen joystick."

  — [@froessell](https://x.com/froessell/status/2103789415323562325)
- Feedback layering in the same PRD: "Every significant collision should combine: physics + particles + audio + camera response", with a chain "IMPACT → physics impulse → … → camera shake → hit stop → sound → score popup". It specifies "50–100 ms hit stop" and "Don't overdo continuous shaking." — [@froessell](https://x.com/froessell/status/2103789415323562325)

**Keyboard / first-person**
- "Controls: arrows/WASD (throttle, brake/reverse, steering), space = boost". The HUD boost meter is specified as a battery that fills red→yellow→green and pulses or glows at 100%. Acceptance criterion: "Stable 60 FPS on an average laptop." — [@_nieGRAMotny_](https://x.com/_nieGRAMotny_/status/2103128800909197521)
- Example prompt shared by @dreyk0o0 (partial; attributed in the post to Noah Wachnick's run): "First-person controls: WASD, mouse look, jump… Place and break blocks with the mouse… Smooth 60 fps on a laptop… Test it, fix every bug, then keep improving the visuals until it looks as realistic as possible." — [@dreyk0o0](https://x.com/dreyk0o0/status/2103822946800165270)
- "First/third-person player (V toggles)… a hotbar and an inventory (E)… a guard who draws a sword when you get close and faces you… No floating labels over the NPCs." — [@Viggle_PINOC](https://x.com/Viggle_PINOC/status/2102861939072434495)

**Free-camera exploration**
- "Create a cinematic browser-based 3D world that can be explored freely with a camera… This is not a game and not combat-focused, the goal is pure exploration, atmosphere, composition, and visual discovery." — [@LexnLin](https://x.com/LexnLin/status/2103194052850241739)

**Sound as interaction feedback**
- Web Audio is synthesised per event (jump, land, level-up chord, rising charge tone, explosion with low end plus noise, pop, count tick, coin clink, victory fanfare), with "no audio files" — [@op7418](https://x.com/op7418/status/2103724883301814408)
- Partial post: an interactive WebGL2 piece where you "drag to look around and zoom, drag the timeline to change the hour; click the river to release a lantern, which pops a line of poetry and a guzheng note; click the moon for a close-up". The guzheng uses a Karplus-Strong string model (my translation of the post) — [@DemitiyaGeekzen](https://x.com/DemitiyaGeekzen/status/2103517910274818523)
- Partial post: an audio-reactive 3D "magic eye" where "Every kick flips the plates open. The bass pushes the lens forward. The highs light up the glowing core" — [@Acoramaa](https://x.com/Acoramaa/status/2104145227573248467)

**Performance discipline for live interaction**
- "Pooled allocation-free particle system: preallocate and reuse… Fixed 60hz timestep update with rAF rendering. Zero object allocation inside the loop." — [@zacxbt](https://x.com/zacxbt/status/2103808699466944604)
- "Police, particles and debris should use object pooling… Mobile performance should be considered from the beginning… ~12 active vehicles, ~100 simple debris/particles" — [@froessell](https://x.com/froessell/status/2103789415323562325)

**Cross-category pointers (motion category; covered in depth by other researchers, noted here because they are the corpus's clearest live-input web components)**
- A React hero with "an interactive cursor-following 'x-ray' spotlight reveal — moving the mouse wipes away the bike's exterior photo to expose its internal carbon/gearbox structure", built with a CSS `mask-image` and no animation libraries — [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030)
- "Build 5 completely different scroll-based sections, decide the context & layout yourself." (12 words) — [@ercankeskinx](https://x.com/ercankeskinx/status/2102995443818897906)

### Inferences
- Responsiveness in these prompts comes from four ingredients:
  - an explicit input → response mapping (relative vs absolute steering; tilt toward cursor; click advances a tier);
  - a feedback stack per event (motion + particles + sound + camera, with hit-stop);
  - anticipation and idle affordances (idle shake hinting "click me"; a ~1 s charge-up before the payoff);
  - state-machine robustness (input locking during transitions, cancelling loop tweens, first-gesture audio unlock).

  The @op7418 prompt is the only one in the slice that covers all four and adds accessibility (reduced motion). It is the best template to generalise into web micro-interactions such as like/reward buttons, achievement toasts and checkout success.
- "Fast and smooth, not bouncy" (@BThreeAgency) and "Springs everywhere, a tiny overshoot at most" (@__morse) show that prompt authors control feel through damping vocabulary. Web component prompts should state the spring or damping intent explicitly.
- Game PRDs (@froessell, @_nieGRAMotny_) show a staged-milestone pattern with acceptance criteria and "do not continue until it feels satisfying". That pattern transfers well to building complex interactive components iteratively.

### Gaps
- No full prompt in the slice specifies hover states, focus/keyboard accessibility for UI components, pointer-capture or touch fallbacks for cursor effects, or scroll-linked animation other than @iamtanzil_'s video scrub.
- Most interactive "results" (black-hole lab, planet, magic eye, lantern river) exist only as partial post descriptions. Their actual prompts are not in the corpus, so the input specs listed above describe outcomes, not prompting technique.
- @froessell's PRD targets Unity, and @gandamu_ml's prompt targets C/C++/OpenGL. Their web-transferability is my inference.

---

## Q3. Explainers: how prompts structure narrative animation, and how that maps to website sections

### Takeaway
Explainer prompts structure narrative in one of five ways:
1. Scene lists (problem → what we do → 3-step how-it-works → proof → name).
2. Process timelines (empty glass → finished cocktail).
3. Beat grids (120 BPM, "something happens on every beat", one morphing shape driven by a cursor).
4. "One strong formal idea per scene" with real simulated data.
5. Most powerful for the web, but only in partial posts: explorable "labs" ("explain X by building one you can take apart in your browser").

The strongest full prompts also demand determinism ("every frame a pure function of time"). That maps directly to scroll-scrubbed how-it-works sections.

### Cited Findings
**Composition**
- 24 of 62 explainers are full prompts and 38 (61.3%) are partial. Full prompts are split between product explainers (startup, product URL, app walkthrough) and educational topics (recursion, derivatives, photons, rate limiters, spin glasses, cocktail recipes, the history of AI) — [videos.json]

**Scene-list narrative (maps to a landing-page story)**
- "Build a 30-second animated explainer for my business as a single HTML page. 5 scenes. The customer's problem, what I do, how it works in 3 steps, one proof point, and my name at the end. Bold text, smooth transitions, my brand colours." — [@alex_prompter](https://x.com/alex_prompter/status/2103499977632997524)
- "an example of a user creating a chatgpt ads campaign, then connecting their metrics, understanding attribution, then connecting a voice agent to it, the agent responding, then doing follow up, adding humans in the loop and then providing analytics." The narrative here is a user journey — [@charlesmendez](https://x.com/charlesmendez/status/2102847039415476517)

**Process / transformation narratives**
- "show the full recipe from start to finish (empty glass to completed cocktail) - Explainer video style - Showing the recipe ingreidents + measurements as they're going into the cup. Should be a 30s video." — [@Ror_Fly](https://x.com/Ror_Fly/status/2102853258582880547); near-copy by [@Sarut0biSasuke](https://x.com/Sarut0biSasuke/status/2103418429248069973)
- A history-of-a-building narrative: "start with a minimal architecture to completed venue". It is fed a Wikipedia URL and a GSAP docs URL — [@RetropunkAI](https://x.com/RetropunkAI/status/2103237989065277590)

**Beat-grid product story with a morphing shape (maps to an animated product walkthrough)**
- @verbove's prompt:
  - "One HTML file. One canvas / One draw(t) function / No CSS transitions / No timers / No state carried between frames / One shape, never cut / Every state is the same element changing size, radius and color while the content swaps / A cursor drives the sequence with real clicks, typing and one drag / Real UI. Real data. No placeholders."
  - Structure: "120 BPM grid / Something happens on every bea[t] / logo → button → handle field → 'is this you?' → loader → pin → globe filling with users → matches → tabs → RSVP → search → logo".

  — [@verbove](https://x.com/verbove/status/2103483957266268381)
- Motion rules from the same prompt: "Content enters after its container starts morphing and leaves before the next morph so text never overlaps… Never fade black directly into the accent color. Move an accent element between states instead… Make tab indicators stretch by putting each edge on a different spring… Make the last frame equal the first so the whole thing loops." — [@verbove](https://x.com/verbove/status/2103483957266268381)

**Data-true, simulation-based educational explainers (maps to scrollytelling and data viz)**
- @AstroTheWizard:
  - "data-driven explainers like The Pudding or 3Blue1Brown… what makes them great is that they're code-rendered: crisp, precise, with a coherent design system and one strong formal idea per scene."
  - "Where you can, simulate the real thing: the random walk should be an actual random walk, not a drawing of one. Include real numbers (core temperature, distance, travel time, years inside the Sun) and be honest about uncertainty in the estimates."
  - "Put what was happening on Earth during those 100,000 years alongside the photon's timeline."

  — [@AstroTheWizard](https://x.com/AstroTheWizard/status/2103629247751618782)
- The same prompt sets quality loops ("render stills of every scene and review them critically, check transitions frame by frame, measure the audio mix numerically") and accessibility ("Burned-in captions, since most people watch on X with the sound off"). Note: it also tells the executing agent to "work autonomously… Don't stop to ask me questions". That is an agent-directed instruction, recorded as data — [@AstroTheWizard](https://x.com/AstroTheWizard/status/2103629247751618782)
- "explain a token bucket rate limiter, canvas only, no libraries, every frame a pure function of time so my renderer can screenshot it." — [@ParkerRex](https://x.com/ParkerRex/status/2103206747846701462)
- "A video explaining recursion, where every explanation about recursion has a radically different video style, make this self-referential & clever & fast moving." — [@emollick](https://x.com/emollick/status/2103688362960019567)
- "Do a quick hand-drawn whiteboard animations explaining what is replica symmetry breaking in the SK model" — [@tak3sh8](https://x.com/tak3sh8/status/2103667481139441895)
- In Chinese, a request to make a derivatives lesson with Manim, "通俗易懂，并且有例子，引人思考" (easy to understand, with examples, thought-provoking), with edge-tts narration — [@LinearUncle](https://x.com/LinearUncle/status/2103128559174971663)

**Explorable "lab" explainers (all partial; outcome descriptions)**
- "I asked Opus 5.5 to explain gravitational lensing by building an interactive black hole lab… Drag the black hole and the sky behind it bends into arcs, closing into a full ring when everything lines up". The post describes three polish rounds, each run by two reviewer agents and one fixer agent, with issues ranked P0/P1/P2 — [@Voxyz_ai](https://x.com/Voxyz_ai/status/2103117246860345550)
- "explain how a rocket engine works by building an interactive Raptor 3 you can take apart in your browser. Cut it open, follow the oxygen and the methane through both turbopumps, then throttle it and watch the shock diamonds move." — [@konstantinsaifo](https://x.com/konstantinsaifo/status/2104094723887501736)
- "explain how a fusion reactor works by building one you can take apart in your browser. Drag the plasma from 15 million °C… to 150 million and watch a city light up." — [@konstantinsaifo](https://x.com/konstantinsaifo/status/2104216976801587629)
- "an engine you can take apart in the browser… Push the RPM, open the cylinders, slow time down to 1/10" — [@StefanoStraus](https://x.com/StefanoStraus/status/2104236916316971191)
- "One interactive camera lab… adjust the focus ring, move lens elements, shift the focal plane, and see real-time depth-of-field effects." — [@chudry223](https://x.com/chudry223/status/2103044654187081860)

**Explainer inserted into longer media; brand constraints**
- "Write a shared style bible and a component kit first, so every animation looks like the same show." … "Copy must be verbatim or faithful to what's said. Never invent facts, numbers or quotes. Sync each animation's beats to the spoken words." The prompt also gives brand constraints: "charcoal, white and black only, Arial" — [@stokebuilder](https://x.com/stokebuilder/status/2103896101120356793) (partial; curator-labelled supplementary notes)

**Tooling mentions (mostly in post text)**
- Remotion is named in 9 explainer entries and HyperFrames in 7, almost all partial — [videos.json]. Example: "Using React/TypeScript (Remotion), every image drawn in SVG and Canvas, an open-source TTS voice, and a score synthesized in Python." — [@_Tony_TT_](https://x.com/_Tony_TT_/status/2103227891009872147)

### Inferences
- Mapping to website sections:
  - **@alex_prompter's 5-scene structure** maps one-to-one onto a landing-page narrative: problem, value proposition, 3-step how-it-works, social proof, CTA. Each scene becomes a scroll-triggered section.
  - **@verbove/@__morse's "one shape, never cut"** maps to a sticky product-walkthrough component. A single morphing card or device frame changes state as the user scrolls or clicks; content enters after the container morphs and exits before the next morph.
  - **"Every frame a pure function of time"** (@ParkerRex, @verbove `draw(t)`, @__morse `seek(t)`) is exactly the architecture needed for scroll-scrubbed explainers. Replace `t` with scroll progress, and the animation becomes reversible, scrubbable and SSR-safe.
  - **"Simulate the real thing" plus real numbers plus honest uncertainty** (@AstroTheWizard) is the right brief for data/stat components (count-ups, comparative timelines, live simulations).
  - **The "take it apart in your browser" pattern** (@konstantinsaifo, @StefanoStraus, @Voxyz_ai) is the template for interactive "how it works" hero modules: exploded views, sliders that drive a physical parameter, and cut-away toggles.
- Explainer prompts rarely specify captions, diagram style or chart types. A website-component library would need to add these explicitly: chart grammar, label placement and accessible text equivalents.

### Gaps
- The prompts behind the strongest interactive explainers (black-hole lab, rocket engine, fusion reactor, engine, camera lab, earthquake strain) are not in the corpus. Only outcome descriptions exist.
- No explainer prompt in the corpus specifies scroll-driven playback. All of them target video or loop output, so the scroll mapping is my inference.
- @garmdotcom ("Prompt in next post") and @cyrilXBT ("prompt in the replies") point to prompts that were not captured.

---

## Q4. 3D/shader scenes: techniques named, and how performance and visual quality are specified

### Takeaway
Three.js is the de facto 3D stack, but prompts seldom name specific rendering techniques. Raymarching, SDFs and instancing appear in zero prompts. Bloom or post-processing appears in 4 of 475, and PBR, shadows, AO, caustics or refraction in 8. When quality is specified, authors do it four ways:
1. Naming photographic phenomena (soft shadows, god rays, caustics, water reflections, day/night).
2. Banning cheap techniques (inverted-hull outlines, CSS-3D flips of large elements).
3. Setting procedural/no-asset constraints.
4. Setting fps targets plus self-critique loops ("What looks least realistic? Fix it.").

### Cited Findings
**Explicit technique lists**
- @Viggle_PINOC:
  - Stack: "vanilla ES modules + three.js (importmap from jsdelivr, no build step). Procedural voxel terrain with trees, beaches and water."
  - Look: "physically based sky, clouds, soft shadows, water reflections and caustics, god rays, bloom, PBR block textures… a day/night cycle with nights that are still readable."
  - The prompt also directs the agent to use the "PINOC MCP" for motion clips and to "tell me the credit cost before generating". That is an agent-directed instruction, recorded as data.

  — [@Viggle_PINOC](https://x.com/Viggle_PINOC/status/2102861939072434495)
- "Advanced shaders: moving sun, soft shadows, ambient occlusion, fog, water reflections - Smooth 60 fps on a laptop. Use Three.js from a CDN." The post's tips: "Set effort to max… the original run took ~1.5 hours… When it's done, ask: 'What looks least realistic? Fix it.'" — [@dreyk0o0](https://x.com/dreyk0o0/status/2103822946800165270) (partial)
- "A fishbowl with reflection, refraction and water caustics" (described as "roughly" the prompt). It is part of a public Three.js GLSL eval gallery — [@NicolaManzini](https://x.com/NicolaManzini/status/2103499771206156628) (partial)

**Stylised (toon) rendering spec; the most technically precise 3D prompt in the slice** (Chinese; my translation)
- Shading: MeshToonMaterial with a 3–4-step gradient map and three lights (key, sky, and a tier-coloured rim light).
- Outlines: done by post-process edge detection over rendered normal and depth buffers, with thick silhouettes, thin part seams and constant width. Add 1.5× supersampling plus MSAA. Original text: "不要用「放大一圈的黑色背面」那种描边" (don't use the "scaled-up black back-face" outline), because width is uneven and breaks at corners. Loosen the depth threshold and rely on normals for seams to avoid striping on oblique surfaces.
- Geometry: real thickness, bevels and structural detail built from geometry (plank seams, rivets) "不要贴黑线条" (not painted-on black lines). Moving parts must articulate (the lid hinges).
- Rendering rules: "3D flips always in WebGL, never CSS 3D perspective on large elements". Canvas textures must be at least 1.5× their maximum on-screen size.

— [@op7418](https://x.com/op7418/status/2103724883301814408)

**Procedural / no-asset constraints as quality and performance levers**
- "Low-poly graphics generated in code (BoxGeometry, CylinderGeometry, etc.), no external models or textures… Custom simplified 2.5D physics… No physics engine… Stable 60 FPS on an average laptop." The prompt also requires Vitest unit tests and `npm run build` after each stage — [@_nieGRAMotny_](https://x.com/_nieGRAMotny_/status/2103128800909197521)
- "Build everything in Blender Python. No downloaded meshes, textures or HDRIs. Write reusable generators… so every building traces back to data". Sources are recorded with confidence levels (1906 Market Street reconstruction) — [@alexalbert__](https://x.com/alexalbert__/status/2102466523164274839)
- Particle aesthetic: "The art style must be a particle illustration, which uses thousands of tiny glowing specks rather than solid fills with flowing ribbon strokes behind figures to suggest motion", in an environment that "adapts to the time of day" — [@ishuagra02](https://x.com/ishuagra02/status/2102920408743678129)

**Shader-only scenes (partial; outcome descriptions)**
- "a single html file. no libraries, no images, no 3d models. every ocean, every mountain and every city light is math… drag it and it spins. raise the sea level and watch continents drown. move the sun and watch the cities switch on at night. hit 'new planet'…" — [@0xSolty](https://x.com/0xSolty/status/2102888414219735200)
- Post (my translation): the whole frame is computed per pixel by one WebGL2 shader with no images. That includes twilight sky gradients, sun and moon paths computed for Nanchang's latitude, procedural fish-scale clouds, and river reflections from 9 summed wave sets. A Canvas-2D building facade is drawn on top — [@DemitiyaGeekzen](https://x.com/DemitiyaGeekzen/status/2103517910274818523)
- "a real 3D fluid simulation that runs on the GPU. The flame colors come from blackbody physics, the smoke is real volume, it runs at 96 fps in 1080p, and it critiqued its own renders about 40 times… render a frame, have a vision model pick it apart like a VFX supervisor, fix it, repeat." — [@NathanWilbanks_](https://x.com/NathanWilbanks_/status/2103881538592981110)
- "110k rigid bodies in real time… Augmented Vertex Block Descent… in WebGPU with @threejs" — [@nybobs](https://x.com/nybobs/status/2103385835328680050)
- "Three.js + TSL" — [@techartist_](https://x.com/techartist_/status/2103933640392786274)

**Camera-journey 3D ("powers of ten" zooms; partial)**
- "start at my desk and don't stop zooming until we hit a single atom inside the CPU… One continuous shot, no cuts. The ruler on the right tracks the scale the whole time" — [@Acoramaa](https://x.com/Acoramaa/status/2103833991879053577)
- Similar: from a smartphone down to atoms ([@irinatoxi](https://x.com/irinatoxi/status/2104212841657962937)); from Cabo da Roca to the observable universe ([@kgonia7](https://x.com/kgonia7/status/2103835848575746268)); from a data centre into a silicon atom ([@ai_ba_reza](https://x.com/ai_ba_reza/status/2103792451551113363))

**Non-3D "gotchas" relevant to faux-3D on the web**
- "Never set opacity or filter on a preserve-3d element, because it flattens and both faces show. Fade its wrapper instead." — [@twoclipping](https://x.com/twoclipping/status/2102554209166000267)
- "Never put will-change on anything the camera scales or the text renders blurry." — [@__morse](https://x.com/__morse/status/2103485566570369333)
- "backdrop-filter: url() misreads displacement maps in Chromium, so clone the scene instead." — [@twoclipping](https://x.com/twoclipping/status/2103835273813496100)

**Minimal 3D prompts are common**
- "Build a Douglas A-1H Skyraider in Three.js" ([@BuildFastWithAI](https://x.com/BuildFastWithAI/status/2103152898708582551)); "Implement code to be able to navigate in a pagoda in 3D." ([@BuildFastWithAI](https://x.com/BuildFastWithAI/status/2103483174957597035)); "Show me what goes on inside an AI data centre." ([@mdaman010](https://x.com/mdaman010/status/2103845689713111079))
- In Chinese, a request for "the most complex, most detailed, most beautiful pelican-riding-a-bicycle animation… any technique… take a whole day if you like" — [@AxtonLiu](https://x.com/AxtonLiu/status/2103119648271290566)

### Inferences
- For 3D website components (hero scenes, product viewers), the corpus suggests a prompt formula:
  - name the stack and loading constraints (Three.js via importmap/CDN, single file, no build step);
  - list the visual phenomena wanted (soft shadows, AO, fog, reflections, bloom), not just "realistic";
  - set procedural/no-asset rules where appropriate;
  - set a numeric fps target on stated hardware ("60 fps on an average laptop");
  - ban known-bad shortcuts (inverted-hull outlines, CSS-3D flips of large elements, `will-change` on scaled text, opacity on `preserve-3d`);
  - require a self-critique loop.
- The corpus lacks GPU-budget specs (draw calls, DPR caps, instancing, LOD, lazy init, pausing off-screen). Website prompts should add them, because hero backgrounds must coexist with page content. This is my inference from the absence of such specs.
- The "take it apart" and "drag to spin, slider to change a parameter" outcomes (@0xSolty, @konstantinsaifo) are the closest the corpus gets to 3D product-viewer/configurator components.

### Gaps
- No prompt in the corpus names raymarching, SDF scenes, InstancedMesh/instancing, EffectComposer passes, HDR environment maps or tone mapping. The corpus cannot show how Opus 5.5 responds to such technical vocabulary.
- Most technically impressive 3D results (planet, fluid fire, AVBD physics, WebGL2 landscape) are partial posts without prompts.
- No prompt specifies mobile GPU fallbacks or `prefers-reduced-motion` for 3D.

---

## Q5. Best 10–15 prompts in the slice as templates for WEBSITE COMPONENTS

### Takeaway
Fifteen entries stand out. Ten are full prompts and five are partial, flagged below. They cover:
- click micro-interactions (@op7418)
- a scroll-scrubbed hero (@iamtanzil_)
- a cursor-tilt 3D badge (@BThreeAgency)
- morphing UI states and liquid glass (@__morse, @twoclipping, @verbove)
- a pixel canvas mascot (@zacxbt)
- narrative and how-it-works structure (@alex_prompter, @AstroTheWizard, @ParkerRex)
- 3D/shader scene quality (@Viggle_PINOC, @ishuagra02, @dreyk0o0)
- explorable product/physics viewers (@0xSolty, @konstantinsaifo)

Several of the best (the @__morse, @twoclipping and @verbove lineage) were written for frame-by-frame video rendering. Their `seek(t)`/Playwright/ffmpeg build steps must be swapped for live `requestAnimationFrame` or scroll-progress drivers in a web component.

### Cited Findings

**1. `op7418-814408`: @op7418. Click-driven reward-reveal micro-interaction**
- Post: https://x.com/op7418/status/2103724883301814408. tech_tags: threejs, shader, canvas, gsap. prompt_partial: **false**. The same prompt appears as `op7418-818226` with tags canvas, svg, gsap, css ([post](https://x.com/op7418/status/2104085484347818226)) — [videos.json]
- Verbatim excerpt (Chinese original):

  > 做成一个可以直接打开的单文件网页（HTML + CSS + JS），点一下就能完整播放，效果对标商业手游的结算 / 奖励演出。… 【演出节奏：五个阶段，缺一不可】 1. 预备：主体待机浮动，每隔几秒抖一下提示可以点击，底部显示「点击」提示。 2. 升级：每点一次，主体跳起、在空中转一圈、落地时压扁再回弹；同时切换到下一等级的颜色，闪一下光，冒一圈粒子，标题更新。 … - 手机宽度也要能用；遵守「减少动态效果」设置（关闭震屏，减少粒子）。 - 动画状态机要严谨：动画播放中忽略点击，不能出现点击被吞或状态错乱。 - 目标 60fps。第一次打开时就是完整的待机画面，不能是空白。

  My translation: "Make it a single-file web page (HTML + CSS + JS) that plays in full with one click, at the level of a commercial mobile game's reward sequence… [Rhythm: five phases, none optional] 1. Ready: the object idles and floats, shakes every few seconds to hint it's clickable, with a 'tap' hint at the bottom. 2. Upgrade: on every click the object jumps, spins once in the air, squashes on landing and rebounds; it switches to the next tier's colours, flashes, emits a ring of particles, and the title updates… Must work at phone width; respect the reduce-motion setting (no screen shake, fewer particles). The animation state machine must be rigorous: ignore clicks during playback, no swallowed clicks or corrupted state. Target 60fps. The first load must show the full idle scene, never blank."
- Maps to: a reward, achievement or success micro-interaction component (click-to-celebrate button, unlock modal, checkout confirmation), including state-machine and reduced-motion hardening.

**2. `iamtanzil-675031`: @iamtanzil_. Scroll-scrubbed cinematic 3D hero header**
- Post: https://x.com/iamtanzil_/status/2103820321673675031. tech_tags: threejs, gsap (the actual prompt uses React + framer-motion + GSAP ScrollTrigger and a pre-rendered video). prompt_partial: **false**. 1,584 words — [videos.json]
- Verbatim excerpt:

  > A cinematic, scroll-scrubbed 3D hero header for the luxury/fantasy brand "AUREN" where a full-screen background video plays frame-by-frame as the user scrolls through a 500vh section, with sequential timed overlays (title, description, feature cards, final title) revealing themselves at specific video timestamps. … Root: `.auren-header-section` — position: relative; width: 100%; height: 500vh … Inner sticky wrapper … position: sticky; top: 0 … height: 100vh … Content is choreographed to video timestamps, not scroll position directly. … Do NOT autoplay the video — keep it muted + playsInline and drive currentTime from ScrollTrigger. … Do NOT forget the 500vh root height + sticky inner wrapper; without both, there is no scroll runway and the video won't scrub. … Initialise the ScrollTrigger only after video metadata loads, and kill it on unmount to avoid leaks.

- Note: an "Integration (build-safety — do not skip)" block tells the executing agent not to overwrite existing files or set global styles. This is agent-directed text, recorded as data. It is also a good pattern for component prompts.
- Maps to: a scroll-scrubbed video or 3D hero section with timestamp-gated overlays. It is the most complete website-component spec in the slice (exact CSS, breakpoints, a "common mistakes" list).

**3. `bthreeagency-827092`: @BThreeAgency. Cursor-tilt 3D badge unlock**
- Post: https://x.com/BThreeAgency/status/2103739079745827092. tech_tags: canvas, svg, css. prompt_partial: **false** — [videos.json]
- Verbatim (entire prompt):

  > Using the linked Figma frame build a badge unlock screen. Match the design exactly. Use the file's assets, lighting, type and layout and add only the motion. Animate the badge so it feels premium and celebratory. Build its scene and then celebrate with gold particles. Treat the badge as a solid 3D object that tilts toward the cursor following the rules of physics. Keep it fast and smooth, it should not be bouncy.

- Maps to: a cursor-reactive tilt card or badge (pricing card, achievement, product tile) with a particle celebration. A design-locked "add only the motion" brief.

**4. `morse-369333`: @__morse. One morphing shape through 12+ UI states**
- Post: https://x.com/__morse/status/2103485566570369333. tech_tags: svg. prompt_partial: **false**. 474 words. Copied verbatim 7 times in the corpus — [videos.json]
- Verbatim excerpt:

  > Dribbble-level UI motion. One shape, never cut: every state is the same element morphing its size, radius and color while its content swaps with a short blur. A cursor drives every change with real clicks and drags. … Springs everywhere, a tiny overshoot at most. … Banned: bouncy easing, particle bursts, glows, gradients on UI chrome, mismatched icon strokes, dead time, anything that looks like a template. … Button → loader → check → dynamic island → music player with a play/pause morph → scrub the progress bar → it becomes a volume slider that stretches when dragged past max → a toggle flips on the beat → the knob becomes a liquid tab indicator … 3. The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one. … 4. Drags are direct manipulation: while the cursor is held, the value is computed from its position. On release it springs back from wherever it was.

- Maps to: a micro-interaction kit (button→loader→success, morphing toggle, stretchy tab indicator, rubber-band slider) and a "dynamic island"-style morphing container. Strip the video render pipeline (Playwright/ffmpeg/BPM).

**5. `twoclipping-496100`: @twoclipping. Liquid glass, iris and goo transitions (Apple-keynote film)**
- Post: https://x.com/twoclipping/status/2103835273813496100. tech_tags: canvas. prompt_partial: **false**. 912 words. Filed as "3d" but says "2D only" — [videos.json]
- Verbatim excerpt:

  > Every scene is made out of the previous one: nothing fades, blurs or cuts. Objects change shape instead … Banned: crossfades, blur-ins, brightness "developing", 3D flips, particles, glows, holds longer than 1s, anything that looks like a template. … 3. Liquid glass: each glass element holds its own clone of the scene behind it, filtered with an SVG feImage displacement map (a rounded-rect distance field) through three feDisplacementMaps at slightly different scales for chromatic edges, plus a rim light. … 4. Goo: blur + alpha threshold, then composite the source atop it so the glass stays sharp inside. 5. Iris: 6 blades around a hexagonal aperture. … backdrop-filter: url() misreads displacement maps in Chromium, so clone the scene instead. A flood must overscale past the corners and take about 0.3s, or half the screen changes in one frame.

- Maps to: liquid-glass toolbars/cards, gooey merge effects, camera-iris page transitions and "flood" route transitions, with concrete Chromium workarounds.

**6. `verbove-268381`: @verbove. Product story as a single morphing shape (canvas `draw(t)`)**
- Post: https://x.com/verbove/status/2103483957266268381. tech_tags: canvas. prompt_partial: **false**. 279 words — [videos.json]
- Verbatim excerpt:

  > <inputs> Ask me for: • my product + URL • 8–12 UI states that tell its story • the real data shown in each state • brand colors + fonts + accent color … <rules> One HTML file. One canvas One draw(t) function No CSS transitions No timers No state carried between frames One shape, never cut … Real UI. Real data. No placeholders. … <motion> Closed-form springs everywhere with only a tiny overshoot. If a value changes target multiple times, sum one spring per change. Content enters after its container starts morphing and leaves before the next morph so text never overlaps. Use a short blur on transitions. Never fade black directly into the accent color. Move an accent element between states instead. Make tab indicators stretch by putting each edge on a different spring.

- Maps to: a sticky "how it works" product walkthrough driven by scroll progress (`t` = scroll). The pure-function architecture makes it scrubbable and reversible.

**7. `zacxbt-944604`: @zacxbt. Crisp pixel-art canvas animation with a state machine**
- Post: https://x.com/zacxbt/status/2103808699466944604. tech_tags: canvas, pixel, playable. prompt_partial: **false**. 347 words. Also duplicated once in the corpus — [videos.json]
- Verbatim excerpt:

  > Create a single self-contained HTML file that renders an animated pixel art wizard casting a spell, using vanilla JavaScript and Canvas 2D. No external assets, libraries, or network requests. RENDERING - Draw everything to an offscreen canvas at a fixed logical resolution of 128x96, then blit to a fullscreen display canvas scaled by the largest integer factor that fits the window, centered, with imageSmoothingEnabled = false and CSS image-rendering: pixelated. … - Fixed palette of ~24 hex colors … - Looping state machine: IDLE (2-frame bob, beard sway) -> CHARGE … -> CAST … -> RECOVER … - Pooled allocation-free particle system … - Fixed 60hz timestep update with rAF rendering. Zero object allocation inside the loop. QUALITY BAR - Crisp pixels at any window size, seamless loop, stable 60fps …

- Maps to: a pixel-art mascot, loader or 404/hero illustration on canvas. It is a strong performance template: integer scaling, pooled particles, fixed timestep.

**8. `alex-prompter-997524`: @alex_prompter. 5-scene business explainer**
- Post: https://x.com/alex_prompter/status/2103499977632997524. tech_tags: svg, gsap. prompt_partial: **false**. 63 words — [videos.json]
- Verbatim (entire prompt):

  > Adopt the role of an expert motion designer. Build a 30-second animated explainer for my business as a single HTML page. 5 scenes. The customer's problem, what I do, how it works in 3 steps, one proof point, and my name at the end. Bold text, smooth transitions, my brand colours. My business [DESCRIBE WHAT YOU SELL, WHO IT'S FOR AND YOUR COLOURS]

- Maps to: a landing-page narrative scaffold (problem → solution → 3-step how-it-works → proof/stat → CTA) as scroll-triggered animated sections.

**9. `astrothewizard-618782`: @AstroTheWizard. Data-true educational explainer**
- Post: https://x.com/AstroTheWizard/status/2103629247751618782. tech_tags: canvas. prompt_partial: **false**. 396 words — [videos.json]
- Verbatim excerpt:

  > The whole thing should be a pure JavaScript animation, rendered from code frame by frame. … data-driven explainers like The Pudding or 3Blue1Brown … what makes them great is that they're code-rendered: crisp, precise, with a coherent design system and one strong formal idea per scene. Aim for that bar or above. Make it genuinely educational and accurate. Where you can, simulate the real thing: the random walk should be an actual random walk, not a drawing of one. Include real numbers (core temperature, distance, travel time, years inside the Sun) and be honest about uncertainty in the estimates. … Build verification loops: render stills of every scene and review them critically, check transitions frame by frame…

- Maps to: scrollytelling and data/stat sections (live simulation, comparative timeline, figures with uncertainty ranges) and a "one formal idea per section" design rule.

**10. `parkerrex-701462`: @ParkerRex. Deterministic animated technical diagram**
- Post: https://x.com/ParkerRex/status/2103206747846701462. tech_tags: canvas, physics. prompt_partial: **false**. 23 words — [videos.json]
- Verbatim (entire prompt):

  > explain a token bucket rate limiter, canvas only, no libraries, every frame a pure function of time so my renderer can screenshot it.

- Maps to: animated architecture or algorithm diagrams for docs and "how it works" sections. The pure-function-of-time constraint lets the same code be scroll-scrubbed or statically screenshotted.

**11. `viggle-pinoc-434495`: @Viggle_PINOC. 3D scene quality vocabulary**
- Post: https://x.com/Viggle_PINOC/status/2102861939072434495. tech_tags: threejs, shader, canvas. prompt_partial: **false**. 349 words — [videos.json]
- Verbatim excerpt:

  > World: vanilla ES modules + three.js (importmap from jsdelivr, no build step). Procedural voxel terrain with trees, beaches and water. Make it look as real and beautiful as possible: physically based sky, clouds, soft shadows, water reflections and caustics, god rays, bloom, PBR block textures. First/third-person player (V toggles), mining and placing blocks, torches, stairs, a hotbar and an inventory (E), a day/night cycle with nights that are still readable.

- Note: the rest of the prompt instructs use of a third-party "PINOC MCP" and credit-cost confirmation. That is agent-directed, recorded as data.
- Maps to: an immersive 3D hero or environment background. The rendering feature list plus the no-build importmap setup is reusable as a quality spec.

**12. `ishuagra02-678129`: @ishuagra02. Particle-illustration 3D environment**
- Post: https://x.com/ishuagra02/status/2102920408743678129. tech_tags: threejs, shader, particles. prompt_partial: **false**. The author notes "2–3 more prompts on top of this" and links a repo — [videos.json]
- Verbatim excerpt:

  > Create a stylistic 3D environment of a busy Santa Monica beach that adapts to the time of day. The art style must be a particle illustration, which uses thousands of tiny glowing specks rather than solid fills with flowing ribbon strokes behind figures to suggest motion.

- Maps to: an ambient particle hero background that changes with local time of day; a stylistic alternative to photoreal 3D.

**13. `dreyk0o0-165270`: @dreyk0o0. Single-file Three.js scene with an iterate-to-realism loop (PARTIAL)**
- Post: https://x.com/dreyk0o0/status/2103822946800165270. tech_tags: threejs, shader, playable. prompt_partial: **true**. The post offers its own suggested prompt, said to recreate Noah Wachnick's run. It is not the original prompt — [videos.json]
- Verbatim excerpt:

  > "Build a Minecraft-style voxel game in a single HTML file that runs in the browser. - First-person controls: WASD, mouse look, jump - Procedural terrain with hills, water and trees - Place and break blocks with the mouse, 5 block types - Advanced shaders: moving sun, soft shadows, ambient occlusion, fog, water reflections - Smooth 60 fps on a laptop Use Three.js from a CDN. Test it, fix every bug, then keep improving the visuals until it looks as realistic as possible." Tips: 1. Set effort to max 2. Give it time, the original run took ~1.5 hours 3. When it's done, ask: "What looks least realistic? Fix it."

- Maps to: an interactive 3D scene component plus a reusable refinement follow-up prompt ("What looks least realistic? Fix it.").

**14. `0xsolty-735200`: @0xSolty. Procedural shader planet with direct manipulation (PARTIAL)**
- Post: https://x.com/0xSolty/status/2102888414219735200. tech_tags: shader, webgl. prompt_partial: **true**. Outcome description; the only prompt quoted is "build me a planet" — [videos.json]
- Verbatim excerpt:

  > i asked opus 5.5 to build me a planet. not a picture of a planet. a whole planet. it wrote a single html file. no libraries, no images, no 3d models. every ocean, every mountain and every city light is math, generated live in your browser. then i started playing with it. drag it and it spins. raise the sea level and watch continents drown. move the sun and watch the cities switch on at night. hit "new planet" and it invents a new world.

- Maps to: an interactive shader globe or product-viewer pattern (drag-to-rotate, parameter sliders, "regenerate" button), e.g. a hero globe for global-reach stats.

**15. `konstantinsaifo-501736`: @konstantinsaifo. "Take it apart in your browser" exploded-view explainer (PARTIAL)**
- Post: https://x.com/konstantinsaifo/status/2104094723887501736. tech_tags: threejs, shader. prompt_partial: **true**. Sibling: `konstantinsaifo-587629` (fusion reactor, [post](https://x.com/konstantinsaifo/status/2104216976801587629)) — [videos.json]
- Verbatim excerpt:

  > I asked Claude Opus 5.5 to explain how a rocket engine works by building an interactive Raptor 3 you can take apart in your browser. Cut it open, follow the oxygen and the methane through both turbopumps, then throttle it and watch the shock diamonds move.

- Maps to: a 3D product viewer or interactive how-it-works module with cut-away, flow-path highlighting and a parameter slider driving the visual. The prompt pattern is "explain X by building a Y you can take apart".

**Honourable mentions (not in the top 15)**
- [@Voxyz_ai](https://x.com/Voxyz_ai/status/2103117246860345550) (partial): drag-to-lens black-hole lab plus a multi-agent P0/P1/P2 review workflow.
- [@DemitiyaGeekzen](https://x.com/DemitiyaGeekzen/status/2103517910274818523) (partial): full-frame WebGL2 shader landscape with free-view drag/zoom, timeline scrub and click-to-spawn interactions.
- [@Acoramaa](https://x.com/Acoramaa/status/2104145227573248467) (partial): audio-reactive 3D object.
- [@twoclipping](https://x.com/twoclipping/status/2102554209166000267) (full): minimal launch film with a "3D carousel of real videos with floor reflections" and `preserve-3d` gotchas.
- [@emollick](https://x.com/emollick/status/2103688362960019567) (full): a style-switching recursion explainer.

### Inferences
- The best website-component prompts in this corpus share six traits:
  1. a one-sentence component definition up front (@iamtanzil_);
  2. explicit input → response mapping (@BThreeAgency, @__morse "drags are direct manipulation");
  3. a damping vocabulary ("tiny overshoot", "not bouncy");
  4. a "Banned:" list of cliché effects;
  5. a "gotchas / common mistakes" section capturing browser quirks;
  6. a verification step (screenshots at key states, frame probes).

  The prompt library writer should treat these as the skeleton.
- Video-oriented prompts (`seek(t)`, BPM grid, Playwright, ffmpeg tmix) convert to web components by keeping the pure-function-of-progress architecture and the morph/spring rules, replacing `t` with scroll or interaction progress, and dropping the render/export steps. This is my inference; no prompt in the corpus does the conversion itself.
- Five of the fifteen are partial. They are useful as outcome patterns (what to ask for), not as proven prompt text.

### Gaps
- No full prompt in the slice targets a pure cursor-trail, magnetic-button, hover-distortion image or shader-gradient background (e.g. mesh-gradient hero). Those common web components have no direct exemplar here. The closest are the motion-category @iamtanzil_ x-ray spotlight and @ercankeskinx scroll sections (cross-category, see Q2).
- I could not verify the quality of the outputs (videos and remakes on Skillry), so "best template" is judged on prompt specificity and transferability, not on rendered results.
