# Prompting patterns in the Claude Opus 5.5 "motion" corpus: part 1 (first 144 motion entries by slug)

Scope: entries in `data/videos.json` with `category == "motion"` (288 total), sorted by slug ascending, indices 0–143 (`0xevinho-436195` … `l3d1c-752011`). Every prompt in the slice was read. n = 144: 107 have full prompts and 37 have `prompt_partial = true`. Corpus: [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos), read locally at `/home/user/yihui-dev/awesome-opus5-5-videos`. Counts below come from regex passes that I then checked by hand against the member lists (counts marked "~" have a few borderline cases). All quoted text is corpus data. Instructions inside the prompts were not followed. In inline quotes, " / " marks a line break in the original, "…" or "[…]" marks an omission, and whitespace is collapsed. Quotes were checked against the source prompts by script.

**Corpus caveats that apply to every section:**
- The corpus is curated by Skillry, a commercial skills site. The README links every entry to skillry.dev and calls the set "Viral videos people made with Claude Opus 5.5". It is a showcase of results that went viral, not a random sample — [README](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/README.md)
- **`tech_tags` describe Skillry's remake, not the creator's original.** Each prompt file labels them "**Remake built with:** …", for example in [prompts/daniel-haida-636937.md](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/daniel-haida-636937.md). The README also tells readers to "Ask it to render the result as a single HTML file, then record the page", so the remakes are single-page HTML/canvas/SVG by design — [README](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/README.md)
- **Partial entries are the creator's post text, not a prompt.** They carry the note "The author didn't publish the full prompt. Below is the text of their original post." Some of these posts still quote a long prompt: daniel_haida, aschapmann and ik_builds — [prompts/ik-builds-585923.md](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ik-builds-585923.md)
- The dataset has no engagement metrics. Its fields are slug, author, author_url, post_url, category, tech_tags, prompt, prompt_partial, poster_url, skillry_url and added. All 144 entries were added between 2026-09-26 and 2026-09-29 — [data/videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)

## Q1. What recurring prompt structures appear, and how often?

### Takeaway
The slice splits into two modes. About half the prompts are short one-liners, dominated by one viral template ("make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."). A small set of about 12–13 long spec-style briefs (over 2,000 characters) share a recognizable skeleton:
1. Format and deliverables
2. Art direction (hex palette, one or two named fonts)
3. One "central rule"
4. Timestamped storyboard or beat-grid state list
5. Motion-quality rules
6. An explicit banned list
7. Deterministic engineering (`seek(t)`, no timers)
8. A mandatory self-inspection loop

The middle band (200–600 characters) is mostly the one-liner plus a subject, a URL, or one or two constraints.

### Cited Findings
**Length distribution** (n=144, characters): median 201.5, min 28, max 22,367. Bands:
- ≤200: 70 (57 full)
- 201–600: 47 (31 full)
- 601–2,000: 14 (7 full)
- \>2,000: 13 (12 full)

Median length is 181 for full prompts and 277 for partial ones, because partial entries are often long tweets — [data/videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)

**The "showreel" template dominates.**
- 16 prompts are identical after normalizing punctuation and case.
- 32 contain the exact clause "motion designer you are, like it's your showreel for a résumé. go all out".
- 38 contain "motion designer you are".
- 48 contain that phrase or "showreel".
- Canonical example: "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out." — [@3xtihor](https://x.com/3xtihor/status/2103551886272159839); identical prompts include [@akbuilds_](https://x.com/akbuilds_/status/2103646141271150675), [@jasonzhou1993](https://x.com/jasonzhou1993/status/2103663364958515541), [@kenn](https://x.com/kenn/status/2103337314021937232)

**Common variants of the template** add one of the following:
- A subject: "(About the pipefitters bible)" — [@Adamdesgns](https://x.com/Adamdesgns/status/2103542756555768014)
- A brand: "brand it for Based Agency." — [@dansushik](https://x.com/dansushik/status/2103547478482289121)
- A research step: "Research Distilbook.Make a dynamic 40-second motion graphics video on Distilbook…" — [@ajith_io](https://x.com/ajith_io/status/2103469807375208546)
- A target placement: "like it's the hero video on its GitHub README" — [@hqmank](https://x.com/hqmank/status/2103831140033241156)

**Other copy-pasted templates in the slice:**
- **UI-morph "One shape, never cut" XML brief** (2,711 characters): three identical copies — [@demonugc](https://x.com/demonugc/status/2103526713208525162), [@dzhohola](https://x.com/dzhohola/status/2103605737595249003), [@hiCallMeChai](https://x.com/hiCallMeChai/status/2103600312296878304) — plus a product-specific variant for sprites.ai — [@AnnaCher___](https://x.com/AnnaCher___/status/2103571096549433425)
- **"highly professional SaaS product launch video"** (520 characters): two identical copies — [@drrickio](https://x.com/drrickio/status/2103333836130009558), [@hSanat](https://x.com/hSanat/status/2103358205091012699) — and a hybrid with the showreel line — [@gouthamjay8](https://x.com/gouthamjay8/status/2103816261339910269)
- **Music-video brief:** @anjmaxx reuses whole paragraphs of @anabology's brief ("I don't want you to produce something that is GPT slop…") — [@anjmaxx](https://x.com/anjmaxx/status/2103173729656459455); [@anabology](https://x.com/anabology/status/2103534482930491441)

**Feature frequencies across the 144 prompts:**

| Feature | Count | Notes |
|---|---|---|
| Quality-bar exhortation ("go all out", "go crazy", "let you cook", "make every second count") | 51 (47 full) | |
| Duration stated | ~82 | 15 s ≈ 40; 20 s ≈ 9; 30 s ≈ 9; 40 s = 3; also 45 s, 60 s, 90 s, 3 min and 4 min |
| Resolution stated | 9 | 1920×1080 ×3; 1080×1080 ×2; 1440×1440 ×4 |
| fps stated | 8 | 60 fps in 7; 30 fps in 1 ([@HowDevelop](https://x.com/HowDevelop/status/2103840883812733090)) |
| Aspect ratio stated (9:16, 16:9, square) | 14 | |
| "One self-contained HTML file" | 5 | the four UI-morph briefs plus @Gdgtify |
| Hex palette | 5 | listed below |
| Named fonts | ~10 | Geist ×5 (incl. "Geist or Inter"); Plus Jakarta Sans + JetBrains Mono; Anton + Caveat; Almarai; a serif / heavy grotesque / monospace triad |
| Timestamped storyboard | 5 | plus 1 numbered 7-step shot list ([@jake11moran](https://x.com/jake11moran/status/2103237884564414633)) and 4 beat-grid state chains ("120 BPM, 7 bars, something happens on every beat" — [@demonugc](https://x.com/demonugc/status/2103526713208525162)) |
| Named "central rule" | 6 | listed below |
| Explicit negative constraints (banned lists, "Avoid…", "No …", "NOT:") | ~22 (16 full) | |
| Anti-"AI look" language ("template", "slop", "generic", "typical ai made giveaways") | 13 | |
| Explicit role prompt ("You are…", "Act as a senior motion designer", "world-class animator") | ~7 | the showreel template casts the model as a motion designer implicitly in 38 more |
| Self-QA / iteration loop (render frames, contact sheet, inspect, fix, "start over") | ~15 (10 full) | |
| Deterministic `seek(t)` / no timers | 8 | |
| XML-tagged sections (`<direction>`, `<structure>`, `<build>`, `<gotchas>`, `<art_direction>`, `<timeline>`, `<motion_quality>`) | 5 | |
| Seamless loop requested | 6 | |
| Audio, music or SFX mentioned | 37 (27 full) | |
| Beat/BPM sync | 17 | 120 BPM recurs |
| "Research the product, site, repo or portfolio first" | ~46 | |
| Non-English prompts | ~21 | Spanish, Portuguese, French, Turkish, Chinese, Japanese, Korean, German |

Hex palettes appear in:
- [@AnnaCher___](https://x.com/AnnaCher___/status/2103571096549433425): #FD9543
- [@brainextends](https://x.com/brainextends/status/2103801834930606193): #1ED760
- [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937): 11 tokens
- [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495): #102820 / #F4E9D5 / #F2B544
- [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030): #272727 / #E0E1CC / #2ed3b1

Named central rules:
- "CENTRAL VISUAL RULE Words have assigned architectural roles" — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495)
- "One shape, never cut" — UI-morph ×4, e.g. [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "ONE SHOT = ONE IDEA." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

Seamless-loop phrasing: "The last frame is the first frame, so it loops" (UI-morph ×4) — [@demonugc](https://x.com/demonugc/status/2103526713208525162); "render(0)=render(20)" — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495); "1080×1080, 1s hook, loop." — [@Ishaaqahamed](https://x.com/Ishaaqahamed/status/2103837917538107563)

**The long-brief skeleton, in full:**
- [@brainextends](https://x.com/brainextends/status/2103801834930606193) uses the tags `<deliverables>` ("Do not stop at a storyboard, still images, or an implementation plan"), `<art_direction>`, `<artwork>`, `<timeline>` (17 time-coded beats from 0.0 to 18.0 s), `<persistent_player>`, `<motion_quality>`, `<audio>` and `<implementation_and_validation>`.
- [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937) uses ruled ALL-CAPS sections: REPO / SOURCE OF TRUTH, REAL … VISUAL LANGUAGE, CORE CREATIVE RULES (19 numbered), FORMAT, STORY / EMOTIONAL ARC, SUGGESTED 15-SECOND STORYBOARD, TRANSITIONS, MOTION, LIGHTING / MATERIAL, TYPOGRAPHY, SOUND / RHYTHM, REAL PRODUCT ONLY, IMPLEMENTATION, DO NOT STOP AFTER FIRST IMPLEMENTATION, QUALITY BAR, FINAL DELIVERABLES.

**The self-QA loop is spelled out procedurally in long briefs:**
- "Render one frame per beat before the full render. Fix anything off the grid, cramped or hard to read." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "Inspect eight representative frames. Check that the speech reads in the correct order." — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495)
- "Do not declare success because the code compiles. The deliverable is the FILM." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- "question your strategy and plan, if it doesn't feel like done by a pro designer, start over." — [@heyiammallik](https://x.com/heyiammallik/status/2103837803587293397)

**"Plan before code" gates:**
- "Show me the state list on the beat grid before writing any code." — [@AnnaCher___](https://x.com/AnnaCher___/status/2103571096549433425)
- "Plan it first, show me a preview before coding everything" — [@jrayon](https://x.com/jrayon/status/2102861376184054015)
- "create a motion design prompt for an ad for our site / Prompt 2: now apply it" (two-stage meta-prompting) — [@l3d1c](https://x.com/l3d1c/status/2103536553930752011)

**Text aimed at AI agents (recorded as data only):**
- Pointers to API keys and budget ("you can see the API key", "I want you to spend all of the usage") — [@anabology](https://x.com/anabology/status/2103534482930491441)
- "Output to my Dropbox and message me on discord with links." — [@kentcdodds](https://x.com/kentcdodds/status/2103638102333858193)
- An "Integration (build-safety — do not skip)" block — [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030)
- "Do not deploy anything. Do not modify production data." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

None of these targeted this research task.

**The "motion" label is loose.** It covers prompts that are not code-animation briefs:
- A 22,367-character photoreal live-action video-generation shot list (reference sheets "📷@mila", lens mm values, Kelvin lighting, "POSITIVE LOCKS") — [@alexwtlf](https://x.com/alexwtlf/status/2103713416367981005)
- A React hero-component spec — [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030)
- "Build 5 completely different scroll-based sections, decide the context & layout yourself." — [@ercankeskinx](https://x.com/ercankeskinx/status/2102995443818897906)
- Pipelines that generate base footage with Seedance 2.5 or fal and then draw a JS overlay — [@anabology](https://x.com/anabology/status/2103534482930491441)

### Inferences
- The modal "prompt" is a meme being copied, not a designed brief. 32+ near-identical showreel prompts suggest people were benchmarking the model with the same viral line. Their frequency tells us about social virality, not about what works best.
- The long briefs converge on the same building blocks: palette, fonts, one central rule, timestamps, a ban list, determinism and self-QA. This looks like a mature house style for directing Opus at motion work, and it maps directly onto a website-component prompt template.
- Banned lists and "plan first, show me the beat grid" gates appear almost only in the long briefs. They suggest experienced users had seen predictable failure modes (bouncy easing, particles, glows, corner text) and were pre-empting them.

### Gaps
- Without engagement data, I cannot tell whether the structured briefs produced better videos than the one-liners in this slice. See Q2 for the weak proxies available.
- The "Research first" count (~46) includes prompts that simply contain a URL. Whether the model actually researched anything cannot be verified from the text.

## Q2. How do short one-liners compare to long spec-style prompts, and which kinds are attached to the most impressive-sounding results?

### Takeaway
Nothing in the corpus measures impressiveness: there are no views, likes or ratings. The proxies are weak:
- **README "highlight" status.** The README highlights "one per distinct prompt", which is a de-duplication rule rather than a quality rule. All 27 highlighted entries in this slice have full prompts. Highlight rates are highest for medium (201–600 character) prompts.
- **Creators' own claims.** The most emphatic "this replaced an agency" claims sit on partial entries. Those describe long context-rich setups (repo, brand tokens, Remotion or HyperFrames, several feedback rounds), not the bare one-liner. In practice, short prompts plus rich context (codebase, site, assets, reference videos) and iteration were behind most of the product films.

### Cited Findings
**README-highlight rate by prompt length** (full prompts only; highlight rule = "100 highlighted below, one per distinct prompt"):

| Length band | Highlighted |
|---|---|
| ≤200 characters | 10/57 (18%) |
| 201–600 | 12/31 (39%) |
| 601–2,000 | 2/7 |
| \>2,000 | 3/12 |
| Partial entries | 0/37 |

The ≤200 rate is pushed down mechanically, because the 16 identical showreel prompts can be highlighted only once — [README](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/README.md); [data/videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)

Highlighted entries span both extremes:
- Long: @anabology, 9,618 characters — [post](https://x.com/anabology/status/2103534482930491441); @brainextends, 8,142 characters — [post](https://x.com/brainextends/status/2103801834930606193); @HowDevelop, 5,464 characters — [post](https://x.com/HowDevelop/status/2103840883812733090)
- Very short: "以动态设计师的高级审美，制作一段动态的15秒动态图形视频" (28 characters; my translation: "with a motion designer's refined aesthetic, make a dynamic 15-second motion graphics video") — [@ChatGptAstra](https://x.com/ChatGptAstra/status/2103834787647807540)
- Very short: "make a dynamic 15-second motion graphics video for AIsa. Go all out." — [@0xfemyn](https://x.com/0xfemyn/status/2103796337041137833)
- Very short: "4 seasons passing outside a train window, a cozy carriage, a cup of coffee on the table, Grand Budapest Hotel style" — [@itsolelehmann](https://x.com/itsolelehmann/status/2103124033365762215)

**Evidence that the one-liner improves output:**
- "i didnt use it originally and then asked it to do a re-run with this prompt and the output was far better" — [@elliot_garreffa](https://x.com/elliot_garreffa/status/2104213514944446825) (partial). The same post lists what helped: "references - give it 1 or 2 reference videos", "storyboard … if you have specifics, list them out prior", "use remotion as the main driver".

**Impressive-sounding claims attached to long briefs or context-rich setups:**
- "1 prompt and 2 rounds of feedback" with a ~15,000-character brief, aiming for "a genuinely premium, Apple-level product film" — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937) (partial; prompt quoted in post)
- "I WAS QUOTED $3000 FOR THIS!!!" for a 15-second placeholder template run on "Opus 5.5 (medium)" — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923) (partial)
- "The taste on this model is insane. The transitions, the timing, the branding. Better than anything I have gotten from Fable 5.1 or GPT 6 Astra." (no prompt shared) — [@bridgemindai](https://x.com/bridgemindai/status/2102462889160286423) (partial)
- "No skills, no templates, no design brief → Just my project repo … in ONE prompt" (max effort) — [@KingOKings](https://x.com/KingOKings/status/2103874453687992769) (partial)
- What made the difference was the contents of the project folder: "o Claude navegou no simulador do iOS e gravou as telas" ("Claude navigated the iOS simulator and recorded the screens") and real data queries — [@jesscaroline7](https://x.com/jesscaroline7/status/2104336637752955094) (partial)
- "Ours wasn't one prompt either … storyboard first, one still per beat, then many rounds of notes." — [@Fr_Sorrentino](https://x.com/Fr_Sorrentino/status/2103922812255871017) (partial)
- Started from "make a hype demo/launch video for @momwiseai" inside a dedicated "studio" repo with style guides and tokens; "took maybe 4 revisions" — [@francoxavier33](https://x.com/francoxavier33/status/2103486218323341663) (partial)
- Contact sheet of ~20 stills reviewed before rendering; "Captions are measured in the real font and shrink to fit the 9:16 safe zone"; "Every cut lands on a 120 BPM grid"; one codebase outputs 30 s, 15 s and 6 s cuts; "My part was saying what felt wrong." — [@l3d1c](https://x.com/l3d1c/status/2104649028193632524) (partial)

**Effort and cost reports (all partial):**
- effort xhigh, "思考 約23分、レンダリング 約90秒" (about 23 minutes of thinking, about 90 seconds of rendering) — [@geneLab_999](https://x.com/geneLab_999/status/2104163377560088672)
- "en 20 minutos … coste un 20% del consumo de 5h del plan Max" (in 20 minutes; cost 20% of the 5-hour Max-plan budget) — [@Javi_llofriu](https://x.com/Javi_llofriu/status/2103372534922059888)
- "about 5 mins with the hyperframes skill … effort on the highest" — [@jayjohnsonai](https://x.com/jayjohnsonai/status/2104188140718117305)
- "around 20 minutes" for a 30-second Remotion showreel — [@iammukeshm](https://x.com/iammukeshm/status/2103511739585421585)

**Specificity as the "wow" factor:** "The cylinders flash in the real firing order, and the 0–100 timer runs in real time: 3.4 s." — [@Dys_hay](https://x.com/Dys_hay/status/2103819139307749645) (partial)

**Short prompts that still name a sharp creative frame:**
- "Make it feel like it won an Emmy for main title design." — [@abhinayguptha](https://x.com/abhinayguptha/status/2103565090721259981)
- "create a 30 second ad for Opus 5.5 inspired by Apple 1984 ad, iykyk! avoid the border text or frames!" — [@1littlecoder](https://x.com/1littlecoder/status/2103746736980378066) (highlighted)
- "Build a 45-second machine that plays an original piece of music, where every note comes from a visible collision." — [@KamStudioLabs](https://x.com/KamStudioLabs/status/2102899866762440893)

### Inferences
- The showreel one-liner works because it sets an identity and a quality bar ("incredible motion designer", "showreel", "go all out") and leaves art direction to the model. It suits an open-ended reel. For brand-accurate output (real UI, palette, legible claims), creators switch to long briefs or supply a repo or design tokens.
- For a website-component library, the best results are likely to come from a hybrid: a short identity and quality line, plus the long briefs' constraints (palette, fonts, central rule, ban list, determinism, self-check). The hybrids in this slice (@gouthamjay8, @HO_BA) do exactly this, and both are highlighted.
- Partial posts are survivorship-biased marketing, and many promote the creator's product. Their claims ("$3000", "Apple-level") should be read as enthusiasm, not as measured outcomes.

### Gaps
- No views, likes or ratings exist in the data, so I could not link prompt type to measured impressiveness. This would need the X posts themselves, which are out of scope.
- I could not view the videos or the Skillry remakes, so judgments of the output quality are not possible from the text alone.

## Q3. Which tech_tags are most common, and which techniques and effects are named?

### Takeaway
Among the remake tags in the slice, canvas (106/144) and svg (68) dominate, followed by gsap (31), css (30), threejs (12) and shader (11). These reflect Skillry's HTML remakes. The creators' own pipelines, named in post text, were mostly Remotion (React) and HeyGen's HyperFrames (HTML + GSAP), with Playwright + FFmpeg for frame capture and Python- or numpy-synthesized audio.

The named techniques cluster around:
- Springs and easing
- Masked and kinetic typography
- Shared-element or morphing transitions
- Camera push/pull
- Motion blur from subframes
- Paper, grain, CRT and hand-drawn textures

Particles and glitch effects appear mainly in ban lists.

### Cited Findings
**Tag counts** (slice n=144): canvas 106, svg 68, gsap 31, css 30, threejs 12, shader 11, particles 7, audio 7, pixel 3, physics 3, webgl 2, ai-image 2. Partial entries lean svg (33 of 37) while full entries lean canvas (86 of 107) — [data/videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)

For the 38-prompt "motion designer you are" family, the remakes are mostly canvas (34), then svg 13, css 8, gsap 5, threejs 4, shader 3, particles 3 — [data/videos.json](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/data/videos.json)

**Original toolchains named in prompts or posts:**
- Remotion in 27 entries (26 partial). Example: "React + TypeScript con Remotion y la música sintetizada en Python a 120 BPM, con cada corte sincronizado al beat" (React + TypeScript with Remotion and music synthesized in Python at 120 BPM, every cut synced to the beat) — [@alanschwegler](https://x.com/alanschwegler/status/2102634404774629665)
- HyperFrames in 11 entries (10 partial). Example: "gave it @HeyGen’s HyperFrames skills and pointed it at https://kotlinlang.org" — [@jetbrains](https://x.com/jetbrains/status/2102459650125754812)
- Playwright/FFmpeg in 7 full prompts. Example: "Use apenas: JavaScript, Playwright e FFmpeg." (Use only JavaScript, Playwright and FFmpeg) — [@andre_lucaxxs](https://x.com/andre_lucaxxs/status/2103292636945846347)
- Audio code-synthesized in step with the visuals: "Opus also wrote the music in Python, note by note, and the track reads the same beat file as the visuals" — [@apoorvjain25](https://x.com/apoorvjain25/status/2104528012746309680)

**Named motion and engineering techniques:**
- **Closed-form springs and two-edge stretch:** "Springs are closed-form step responses. A value that changes target many times is the sum of one spring per change, so it stays a pure function of time." and "The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- **Motion blur from subframes:** "Render with Playwright: 4 subframes per frame, blended with ffmpeg tmix for motion blur at 60fps." — [@demonugc](https://x.com/demonugc/status/2103526713208525162); "Use 3–5 temporal subframe samples per output frame for restrained motion blur / Keep stationary text and artwork sharp" — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- **Masked reveals and match-position transitions:** "Reveal them with short masked vertical movements"; "Use match-position transitions, coordinated scaling, masked reveals, and perspective"; "Outgoing titles must disappear before incoming titles occupy the same space" — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- **Object-driven transitions:** "a card becomes the next card, a chart line becomes a connector … the camera moves through the product"; transitions should make viewers think "Of course the next scene came from that." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- **Glyph-path typography:** "Use actual glyph paths for structural words. Preserve counters and legibility during deformation." and "Use time-remapping curves and analytic transforms." — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495)
- **Classical animation principles and handwriting:** "Real easing, squash/stretch, stagger, overlap, onion skin, smear, follow-through" and "Caveat handwriting via stroke-dashoffset" — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923)
- **Kinetic type:** "kinetic typography word by word, spring easing, smooth camera pushes and pans, depth and glow, elements that build in on the beat instead of just appearing" — [@aschapmann](https://x.com/aschapmann/status/2104230888812724497); "entering word by word from the right with an orange colorama text wipe" — [@jake11moran](https://x.com/jake11moran/status/2103237884564414633)
- **Textures:**
  - "hand-drawn pencil style with a little bit of tasteful chromatic aberration" — [@GroundControl](https://x.com/GroundControl/status/2103678647777230877)
  - "add film grain and CRT effect" — [@johnsavage_ai](https://x.com/johnsavage_ai/status/2103792769982427263)
  - "styles look like handcrafted with paper, cardboard" — [@jrayon](https://x.com/jrayon/status/2102861376184054015)
  - "900 frames, 10 scenes, all code, paper style" — [@helloshiva0801](https://x.com/helloshiva0801/status/2103733875734438284)
- **"Liquid" effects:** "the knob becomes a liquid tab indicator" (UI-morph ×4) — [@demonugc](https://x.com/demonugc/status/2103526713208525162); "flowing pearlescent liquid silk and molten glass" album art — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- **Physics and simulation:**
  - Explosion brief: "tek karelik parlama veya rastgele parçacık yağmuru yeterli değil" ("a single-frame flash or random particle rain is not enough"), replayable from another angle — [@FornYapayZeka](https://x.com/FornYapayZeka/status/2102971287224135914)
  - Fireworks with a replayable finale — [@FornYapayZeka](https://x.com/FornYapayZeka/status/2102888241443795431)
  - "every note comes from a visible collision" — [@KamStudioLabs](https://x.com/KamStudioLabs/status/2102899866762440893)

**Particles are mentioned in 7 prompts, and 6 of those ban them:**
- "Banned: bouncy easing, particle bursts, glows…" — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "No particles, shockwave rings, lens flares, camera shake" — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- "No particle spam." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

**Glitch appears only as a ban:** "excessive glitch effects" — [@HowDevelop](https://x.com/HowDevelop/status/2103840883812733090); "glitch" in the list of bad transitions — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

### Inferences
- For web work, the transferable stack from these prompts is: deterministic time-driven animation (a `seek(t)` pure function), closed-form springs, masked text reveals and shared-element transitions. These map to GSAP/CSS/WAAPI or Framer Motion on a site, with Remotion or HyperFrames for exported hero videos.
- Because the remake tags are Skillry's, they show what Skillry used to re-create each output in a single HTML page. They do not show the creator's original stack, so tag frequencies should not be read as "what creators used".

### Gaps
- The exact mapping from original toolchain to remake tag is undocumented. For example, the corpus does not say why partial entries skew svg.
- Engagement or quality by tag cannot be measured (no metrics).

## Q4. What vocabulary and phrases recur that seem to push quality?

### Takeaway
The quality-raising vocabulary falls into six groups:
1. **Identity and stakes framing:** showreel, résumé, Emmy, Apple-level, Dribbble-level, "world-class".
2. **Precise easing language:** critically damped, "tiny overshoot at most", cubic-bezier(0.16, 1, 0.3, 1), "half the speed you'd default to".
3. **Restraint and anti-AI-cliché bans:** template, slop, corner text or frames, particles, glows, crossfades.
4. **Legibility and pacing rules:** "one shot = one idea", "keep each scene on screen long enough to read", a 400 ms stillness.
5. **Production-grade technical terms:** 60 fps, motion blur subframes, beat grid, LUFS.
6. **Studio and style references:** Apple 1984, Netflix title design, Stripe, Studio1, YC videos, K-pop, Grand Budapest Hotel, Peter Gabriel's "Sledgehammer".

### Cited Findings
**Stakes and quality bar:**
- "go all out" and close variants appear in 51 prompts (47 full).
- "Make it feel like it won an Emmy for main title design." — [@abhinayguptha](https://x.com/abhinayguptha/status/2103565090721259981)
- "Dribbble-level UI motion." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "Every important frame should be good enough to use as a still advertisement." / "I would rather have: 3 extraordinary visual moments than 10 mediocre feature animations." / "Go all out creatively, but exercise ruthless restraint. Make Taxtello look expensive." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- "Do it like a real professional production video, not like a demo or prototype." and "Make the motions more juicy." — [@HO_BA](https://x.com/HO_BA/status/2103845264649761062)
- "Needs to be production grade with sound" — [@davidmarcus](https://x.com/davidmarcus/status/2103275618045686217)
- "every frame matters from the first frame to the final frame. go crazy" — [@heyiammallik](https://x.com/heyiammallik/status/2103837803587293397)
- "One thing to keep in mind: it should be cool as fck." — [@ajith_io](https://x.com/ajith_io/status/2103541149709615243)
- "make no mistakes." — [@anabology](https://x.com/anabology/status/2103534482930491441)

**Anti-cliché and "AI giveaway" bans.** One recurring complaint is HUD-style chrome:
- "Avoid the frames and texts on the corners which are typical ai made giveaways!" — [@1littlecoder](https://x.com/1littlecoder/status/2103587706999914649)
- "avoid the border text or frames!" — [@1littlecoder](https://x.com/1littlecoder/status/2103746736980378066)
- "Do not add an outer caption, creator watermark, decorative footer, or progress counter" — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- "No chrome (scrubber, timecode, fps, headers). No animator jargon on screen ("squash", "stagger", "easing"...)." — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923)

Other anti-cliché lines:
- "I don't want you to produce something that is GPT slop" and "I wouldn't fit too heavily to Pixar. I think it's kind of slop." — [@anabology](https://x.com/anabology/status/2103534482930491441)
- "Banned: … anything that looks like a template." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "This is NOT a generic SaaS explainer. This is NOT a feature walkthrough. This is NOT a startup template animation." and a "NOT:" palette list: "cyberpunk / crypto / neon / gaming / generic AI purple / rainbow gradients" — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- "No distressed protest-poster clichés, megaphones, flags, crowds, microphones, or stock footage." — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495)
- "Avoid generic stock footage, spinning logos, fake dashboards, excessive glitch effects, and tiny code nobody can read." — [@HowDevelop](https://x.com/HowDevelop/status/2103840883812733090)

**Easing and timing vocabulary:**
- "Springs everywhere, a tiny overshoot at most." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "Favor critically damped springs or carefully tuned smooth easing / No repeated bouncing or large elastic overshoots" and "Use continuous acceleration and deceleration" — [@brainextends](https://x.com/brainextends/status/2103801834930606193)
- "Use premium easing. No linear movement."; "cubic-bezier(0.16, 1, 0.3, 1)"; "overshoot below ~2%"; "Avoid cartoon springiness." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937). The same curve appears as `cubic-bezier(.16,1,.3,1)` in [@iamtanzil_](https://x.com/iamtanzil_/status/2103459843831120030).
- "Camera pushes, pulls and pans run like 1.5 to 3 seconds on gentle ease-in-out curves, nothing snappy - aim for half the speed you'd default to." — [@jake11moran](https://x.com/jake11moran/status/2103237884564414633)
- "Allow at least one 400ms moment of absolute stillness. Use critically damped motion for settling loads." — [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495)
- "a new idea every 1.5–2 s, a sound on every hit." — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923)

**Legibility and pacing:**
- "keep each scene on screen long enough to read" — [@aschapmann](https://x.com/aschapmann/status/2104230888812724497)
- "Text that swaps inside a morphing container needs its own enter and exit timing or it overlaps." — [@demonugc](https://x.com/demonugc/status/2103526713208525162)
- "The first 1.5 seconds must already look premium." / "No five-second logo intro." / "Typography should move as designed objects." / "Avoid generic motion-graphics behavior where every word animates independently." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

**Hook and loop:**
- "hook in the first second" — [@jhylee95](https://x.com/jhylee95/status/2103604431627452427)
- "1s hook, loop" — [@Ishaaqahamed](https://x.com/Ishaaqahamed/status/2103837917538107563)
- "Match the last frame to the first, cursor position and speed included, or the loop stutters." — [@AnnaCher___](https://x.com/AnnaCher___/status/2103571096549433425)

**Audio craft terms:**
- "Score the music so every cut, animation hit, and scene change lands on a beat or drop; retimed until synced." — [@jhylee95](https://x.com/jhylee95/status/2103604431627452427)
- "Master -14 LUFS, -2 dBTP, re-measured after AAC encode." — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923)
- "Avoid: • huge cinematic trailer boom • EDM risers • loud whooshes everywhere" — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

**Style and studio references:**
- "Apple product launch film × premium fintech × editorial motion design × restrained Stripe-like product presentation" — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- "premium developer-tool launch film produced by Studio1" — [@HowDevelop](https://x.com/HowDevelop/status/2103840883812733090)
- "inspiration is yc videos and claude social videos" — [@KmAsiff](https://x.com/KmAsiff/status/2103810247131549880)
- "K-pop is a good anchor point visually" and "internet brutalism style" — [@anabology](https://x.com/anabology/status/2103534482930491441)
- "in the style of Peter Gabriel's Sledgehammer and Big Time" — [@DavidShulmanFL](https://x.com/DavidShulmanFL/status/2103336310089842921)
- "an Apple-style 30s video of my app" — [@gautam_mer1](https://x.com/gautam_mer1/status/2103703336780530003)

**Translated "creative freedom" closing paragraph** (shared by two Turkish prompts; my translation): "Creative choices are yours … Don't settle for the first ordinary web demo that comes to mind: first briefly weigh a few ideas in your own domain, pick the original one that will look strongest on video, then turn it into a working product. Decorative imitation that makes the subject look easier than it is is not accepted." — [@FornYapayZeka](https://x.com/FornYapayZeka/status/2102971287224135914)

**Truthfulness guardrails, relevant to marketing claims:**
- "No invented results: no %, multipliers, customer names or figures." — [@ik_builds](https://x.com/ik_builds/status/2103890476885585923)
- "Do not call it a stable v1 release. Do not present planned orchestration features as already shipped." — [@HowDevelop](https://x.com/HowDevelop/status/2103840883812733090)
- "Do not invent metrics that imply real customer data." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

### Inferences
- The phrases most likely to carry over to web-component prompts are:
  - an identity and stakes frame ("as a senior motion designer… Dribbble-level")
  - one named easing curve or spring spec
  - a ban list naming the specific AI giveaways (corner labels, timecodes, glows, particles, bouncy springs, crossfades)
  - legibility rules (exit before enter; minimum read time)
  - an honesty clause for any numbers shown
- `cubic-bezier(0.16, 1, 0.3, 1)` (an expo-out-style curve) appears independently in two unrelated prompts. It is a strong candidate for the library's default "premium" ease.

### Gaps
- There is no controlled evidence that any single phrase (for example "go all out") changes output quality. The only direct testimony is @elliot_garreffa's re-run anecdote.
- The corpus does not show which ban-list items actually fixed observed failures and which were written pre-emptively.

## Q5. Which 8–12 prompts are the best templates for website components? (Adjusted for a digital-marketing-agency site per the coordinator's scope update)

### Takeaway
These twelve picks cover the main slots of an agency site:
- Hero showreel
- Kinetic headlines
- Logo and brand reveal
- Stat/ROI counters
- Service cards
- Client/platform logo walls
- Case-study transitions
- CTA micro-interactions
- Animated backgrounds and illustrations

The strongest are the structured briefs (@AnnaCher___/@demonugc, @Gdgtify, @brainextends, @daniel_haida, @HowDevelop, @iamtanzil_). A few short prompts are kept because they compress a whole slot into one line (@heyiammallik, @Ishaaqahamed-style loops). Excerpts are verbatim except that whitespace is collapsed; "[…]" marks omissions.

### Cited Findings

#### 1. Slot: HERO SHOWREEL (agency reel built from the portfolio) — `heyiammallik-293397` (@heyiammallik)
- post_url: https://x.com/heyiammallik/status/2103837803587293397 · tech_tags: threejs, canvas · prompt_partial: false · README-highlighted: yes
- Excerpt (complete prompt):
> you are a pro motion designer. analyze my portfolio and make a ~30 second video from it. check what are the recent trending techniques used for motion and sound design. question your strategy and plan, if it doesn't feel like done by a pro designer, start over. every frame matters from the first frame to the final frame. go crazy
- Mapping: an autoplay muted hero reel for the agency homepage, generated from the case-study folder. Its "start over" self-critique line is worth keeping.
- Agency variants:
  - "make a dynamic 15-second motion graphics video that shows what an incredible work Studio1 is doing, you will get relevant info from case study, create like it's a good showreel for a Studio1 intro launch. go all out." — [@Astrodevil_](https://x.com/Astrodevil_/status/2103600734017392708) (svg, canvas, gsap; full)
  - "…like its your showreel for a resume. go all out, and brand it for Based Agency." — [@dansushik](https://x.com/dansushik/status/2103547478482289121)

#### 2. Slot: HERO SECTION + CTA MICRO-ANIMATION (interactive cursor-reveal header) — `iamtanzil-120030` (@iamtanzil_)
- post_url: https://x.com/iamtanzil_/status/2103459843831120030 · tech_tags: canvas, css · prompt_partial: false · README-highlighted: no
- Excerpt:
> A full-viewport, dark, cinematic e-bike product header for the brand **OBLT**, built in React (client component) with pure CSS and an interactive cursor-following "x-ray" spotlight reveal — moving the mouse wipes away the bike's exterior photo to expose its internal carbon/gearbox structure underneath. […] Constants: `RADIUS = 165` px (spotlight radius), `FEATHER = 45` px (soft edge). […] Each word animates `wpuUp` with `cubic-bezier(.16,1,.3,1) both`, default `duration = 0.6s`, staggered by `delayStep = 0.08s` (`animationDelay: i * 0.08s`). […] Respects `@media (prefers-reduced-motion: reduce)` → `.wpu-word { animation: none; }`. […] Don't invert the mask logic: opaque `#000` in the radial gradient REVEALS the x-ray layer; the transparent ring hides it.
- Mapping: this is already a website hero spec. For an agency, the cursor "x-ray" could reveal the wireframe or process layer under a finished campaign visual ("before/after"). The word pull-up stagger and the CTA pill hover (gap widening, circle scaling to 1.1) are reusable CTA micro-animations. It is the only prompt in the slice that asks for reduced-motion support.

#### 3. Slot: KINETIC HEADLINE / MANIFESTO SECTION — `gdgtify-929495` (@Gdgtify)
- post_url: https://x.com/Gdgtify/status/2103458245213929495 · tech_tags: canvas · prompt_partial: false · README-highlighted: no
- Excerpt:
> Deliver one self-contained HTML file, 1080×1080, targeting 60fps, using SVG and/or Canvas. Embed all required assets. ART DIRECTION Background #102820. Paper # F4E9D5. Structural accent # F2B544. A literary editorial world with the scale and confidence of a public monument. Use a high-contrast serif for the speech, a heavy grotesque for load-bearing words, and a restrained monospace for small timing marks. […] CENTRAL VISUAL RULE Words have assigned architectural roles. WAIT is a lintel. WAITING is a suspended load. VOICE is a support. ROOM is an opening. FLOOR is a platform. These roles must emerge from the actual letterforms, not from separate illustrations placed behind text. […] Allow at least one 400ms moment of absolute stillness.
- Mapping: an "About / our manifesto" section where the agency's 4–5-line positioning statement builds the layout (headline words become structural shapes). Its `seek(t)` and `render(0)=render(20)` rules suit scroll-scrubbed or looping playback. The palette, type triad, central rule and ban list form a model brief structure.

#### 4. Slot: KINETIC ROTATING-WORD HEADLINE + LOGO/ICON CAROUSEL — `jake11moran-414633` (@jake11moran)
- post_url: https://x.com/jake11moran/status/2103237884564414633 · tech_tags: canvas, svg, gsap, ai-image · prompt_partial: false · README-highlighted: no
- Excerpt:
> Motion should feel slow and polished - one continuous camera over one Mac desktop, no hard cuts. Camera pushes, pulls and pans run like 1.5 to 3 seconds on gentle ease-in-out curves, nothing snappy - aim for half the speed you'd default to. Add motion blur on fast moves and a light film grain finish. […] 1. Open on a big centered line - "in the AI era, the hard part is" - entering word by word from the right with an orange colorama text wipe over it (the `colorama-wipe` registry component). Hold it about a second, then scale it down into place above a spinning list. 2. The list rotates through 30 hard things about working in the AI era - spending tokens wisely, picking the right model, managing context windows, etc - each with a real app icon. Go fast, it's not meant to be read, then land slowly on "managing your desktop".
- Mapping: a "Growing a brand today, the hard part is ___" hero headline. A slot-machine list spins through pain points and platform icons, then lands on the agency's service. The same mechanic gives a client or platform logo carousel. "Half the speed you'd default to" is a reusable pacing instruction.

#### 5. Slot: LOGO / BRAND REVEAL + NARRATIVE LANDING FLOW — `aschapmann-724497` (@aschapmann)
- post_url: https://x.com/aschapmann/status/2104230888812724497 · tech_tags: svg, gsap, css · prompt_partial: **true** (the post quotes the prompt in full) · README-highlighted: no
- Excerpt:
> Act as a senior motion designer and build a 30-second launch video for [product] in Remotion, entirely in code so I can edit and re-render it: first read my landing page and codebase to pull the real story, copy, colors, font and logo file (trace the logo to SVG so it stays sharp and can be animated), then write the video as one story (why the market matters, why it's painful today, how [product] fixes it, what you get) in 4 to 5 scenes with one short title each, animate everything like a premium product film (kinetic typography word by word, spring easing, smooth camera pushes and pans, depth and glow, elements that build in on the beat instead of just appearing), keep each scene on screen long enough to read, add one soft sound effect for every element that appears and silence otherwise, and end on a memorable animated logo reveal with the tagline and URL
- Mapping: covers two needs. First, an SVG logo-reveal component for the agency or for each client case study ("trace the logo to SVG so it … can be animated"). Second, a four-beat landing narrative (market → pain → fix → benefits) that maps to homepage scroll sections. The [product] placeholder makes it a ready-made parameterized template.

#### 6. Slot: STAT / ROI COUNTERS + CASE-STUDY TRANSITIONS — `daniel-haida-636937` (@daniel_haida)
- post_url: https://x.com/daniel_haida/status/2104139720829636937 · tech_tags: canvas, svg, css · prompt_partial: **true** (the post includes what the author calls the "full prompt", ~15,000 characters) · README-highlighted: no
- Excerpt:
> Reveal the actual Taxtello Cockpit as a dimensional product surface. Not just a screenshot placed on screen. Reconstruct/crop/layer it so individual interface regions can animate. The hero financial number resolves crisply. The chart draws in. Supporting metrics settle slightly later. Use subtle stagger. […] 6. Prefer object-driven transitions: a card becomes the next card, a chart line becomes a connector, a receipt becomes a booking, a number becomes another interface element, the camera moves through the product. 7. Use premium easing. No linear movement. 8. Motion should overlap naturally. Elements should not all start and stop at exactly the same frame. […] I want transitions that make the viewer think: “Of course the next scene came from that.”
- Mapping:
  - **Results / ROI band:** the hero metric (e.g. "+212% ROAS") resolves first, the chart draws in, and secondary KPIs settle with stagger.
  - **Case-study navigation:** a client card morphs into the case-study header (object-driven or shared-element transitions).
  - **Defaults:** its "NOT:" palette list and `cubic-bezier(0.16, 1, 0.3, 1)` with "overshoot below ~2%" are good library defaults.
  - **Honesty clause:** pair it with "Do not invent metrics that imply real customer data."

#### 7. Slot: CTA MICRO-INTERACTIONS + AD-PLATFORM LOGO WALL + ROAS CHART (marketing-tech specific) — `annacher-433425` (@AnnaCher___)
- post_url: https://x.com/AnnaCher___/status/2103571096549433425 · tech_tags: svg · prompt_partial: false · README-highlighted: no
- Excerpt:
> Analyze http://sprites.ai and build a product promo from our own UI, not generic components. […] Dribbble-level UI motion. One shape, never cut: every state is the same element morphing its size, radius and color while its content swaps with a short blur. A cursor drives every change with real clicks and drags. Warm-gray canvas, black and white components, one accent (#FD9543), Geist. Springs everywhere, a tiny overshoot at most. […] Connect ad account (Meta, Google, LinkedIn, TikTok, Reddit logos) → loader → check → prompt bar types "Launch ads that convert" → island "Researching 42 competitors" → […] → budget slider that stretches past max → Autopilot toggle → knob becomes a liquid tab indicator across channels → ROAS chart draws itself with hover tooltip → ⌘K → type "pause" → toast "Paused 3 losing ads" → back to the button.
- Mapping: the closest subject match to a digital-marketing agency, since it covers ad accounts, ROAS and campaign budgets. Uses on an agency site:
  - CTA button → loader → check → toast flow for the contact form
  - an ad-platform logo row (Meta/Google/LinkedIn/TikTok)
  - a channel tab indicator with a "liquid" stretch
  - a self-drawing ROAS chart with tooltip
- **Generic base version** (same build rules; asks the user for 8–12 UI states): `demonugc-525162` (@demonugc), https://x.com/demonugc/status/2103526713208525162, tech_tags: svg, prompt_partial: false. Identical copies: `dzhohola-249003` (css) and `hicallmechai-878304` (svg, gsap), both full. Key build excerpt from @demonugc:
> The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one. Same trick for the toggle knob. 4. Drags are direct manipulation: while the cursor is held, the value is computed from its position. On release it springs back from wherever it was. […] Never put will-change on anything the camera scales or the text renders blurry. Text that swaps inside a morphing container needs its own enter and exit timing or it overlaps.

#### 8. Slot: SERVICE CARDS / "WHAT WE DO" SECTION + "A [AGENCY] FILM" CREDIT — `howdevelop-733090` (@HowDevelop)
- post_url: https://x.com/HowDevelop/status/2103840883812733090 · tech_tags: canvas · prompt_partial: false · README-highlighted: yes
- Excerpt:
> Make it feel like a premium developer-tool launch film produced by Studio1: fast, precise, visually surprising, and polished enough to open a keynote or lead a social campaign. Use the TanStack AI feature details below as the source of truth. Studio1 is presenting the film; do not imply Studio1 built TanStack AI. […] Every transition should visually demonstrate a feature, rather than simply replace one title card with another. Keep all on-screen wording brief and legible. Avoid generic stock footage, spinning logos, fake dashboards, excessive glitch effects, and tiny code nobody can read. […] 0:00–0:02 — Hook: A single prompt cursor blinks. It sends one signal that expands into a network of possibilities. […] Add a small “A Studio1 film” credit, visually subordinate to TanStack AI.
- Mapping:
  - A services grid in which each card's hover or scroll animation demonstrates the service ("every transition should visually demonstrate a feature") instead of a static icon with copy.
  - The "presented by [agency], visually subordinate" credit pattern suits case-study films made for clients.
  - The prompt also requires "keep important content within a 9:16-safe central area", useful for responsive reuse.

#### 9. Slot: CASE-STUDY CAROUSEL / CLIENT WORK STRIP + ANIMATED GRADIENT BACKGROUND + MASKED TWO-LINE HEADLINE — `brainextends-606193` (@brainextends)
- post_url: https://x.com/brainextends/status/2103801834930606193 · tech_tags: shader, svg · prompt_partial: false · README-highlighted: yes
- Excerpt:
> Outside the stage, use a soft atmospheric green background: luminous emerald near the upper-left corner, deeper forest green toward the sides, fading to near-black at the bottom […] 0.6–1.5 seconds: The icon transitions into a small Spotify identity above two centered lines: “Discover” “new music” The first line is white; the second is green Reveal them with short masked vertical movements […] Transition into a horizontal strip of colorful playlist covers Heading: “Every mood” Supporting line: “Find what moves you” The strip slides smoothly sideways, with edge cards partially cropped by the stage […] Use match-position transitions, coordinated scaling, masked reveals, and perspective Outgoing titles must disappear before incoming titles occupy the same space
- Mapping:
  - A case-study or client-logo marquee whose edge cards are cropped by a rounded "stage".
  - A clicked cover expanding into the case-study hero (match-position).
  - A two-tone masked headline reveal (line 1 white, line 2 accent).
  - An atmospheric corner-glow gradient background.
- Uses Spotify branding, which must be swapped for agency or client brands.

#### 10. Slot: ANIMATED ILLUSTRATION / HAND-DRAWN ANNOTATIONS + PARAMETERIZED BRAND TEMPLATE — `ik-builds-585923` (@ik_builds)
- post_url: https://x.com/ik_builds/status/2103890476885585923 · tech_tags: canvas, svg · prompt_partial: **true** (the post quotes the template) · README-highlighted: no
- Excerpt:
> Create a 15s motion-graphics film explaining {{PRODUCT}}. HyperFrames + GSAP, no voiceover, no footage. Style: paper-light canvas, marker notes that draw on, real physics, huge kinetic type, hard light/dark switches, a new idea every 1.5–2 s, a sound on every hit. […] - No invented results: no %, multipliers, customer names or figures. […] - Fonts {{BRAND_FONTS}}; Anton for kinetic type; Caveat handwriting via stroke-dashoffset. - Real easing, squash/stretch, stagger, overlap, onion skin, smear, follow-through. Check the HyperFrames registry first. Set every from-state at t=0 (seek-safe); never cover an exit. One primary move per transition; no generic push/slide/rotate-swing.
- Mapping:
  - Marker-style annotations that draw themselves (stroke-dashoffset) around key claims or case-study visuals.
  - "Hard light/dark switches" as section transitions.
  - Anton kinetic display type for section headers.
- The `{{PLACEHOLDER}}` structure (COLOR_CANVAS / INK / ACCENT_1 / ACCENT_2, LOGO_FILE, BANNED_WORDS) is a direct model for a reusable agency prompt template.

#### 11. Slot: CASE-STUDY SECTIONS FROM CLIENT SCREENSHOTS — `ho-ba-761062` (@HO_BA)
- post_url: https://x.com/HO_BA/status/2103845264649761062 · tech_tags: canvas · prompt_partial: false · README-highlighted: yes
- Excerpt:
> Use actual product screenshot/logo/assets Must have music and motion must match the music Do it like a real professional production video, not like a demo or prototype. Add more animation and motion design; avoid using screenshots as raw; instead, break them down into components/icons so we can animate those too. Make the motions more juicy. Use the best motion design techniques you can.
- Mapping: the key instruction for agency case studies is to decompose client screenshots into animatable layers rather than pasting flat images. It matches @daniel_haida's "Reconstruct/crop/layer it so individual interface regions can animate". It works for "before/after" and "campaign results" panels.

#### 12. Slot: LOOPING SOCIAL / HERO BACKGROUND TILE (minimal template) — `ishaaqahamed-107563` (@Ishaaqahamed)
- post_url: https://x.com/Ishaaqahamed/status/2103837917538107563 · tech_tags: canvas · prompt_partial: false · README-highlighted: yes
- Excerpt (complete prompt):
> Make a dynamic 15-second motion graphics video that shows why [your product] is the best at [what it does], like a showreel. Go all out: 1080×1080, 1s hook, loop.
- Mapping: the shortest effective template, with an identity frame, a quality bar and three hard specs (square, 1-second hook, seamless loop). Uses: a looping square tile for service pages, a social-proof section, or an Instagram-ready asset the agency also publishes.

**Runners-up** (for backgrounds and intro splashes):
- "Make a 20-second title sequence for a Netflix thriller that doesn't exist yet. Make it feel like it won an Emmy for main title design." — [@abhinayguptha](https://x.com/abhinayguptha/status/2103565090721259981) (shader, webgl, canvas; full). Suits a cinematic page-load splash.
- "use this image only as a style/vibe refference image and create a Opus 5.5 launch video (20 sec long) add film grain and CRT effect, make it mesmerizing" — [@johnsavage_ai](https://x.com/johnsavage_ai/status/2103792769982427263) (threejs, shader, canvas; full; highlighted). Suits a retro-futurist background.
- "it should start with a single dot on a black screen and then have multiple windows show up on the screen … Finally the camera zooms out to make the desktop look like a point in space." — [@dale_vaz](https://x.com/dale_vaz/status/2103290592679879074) (canvas; full; highlighted). Suits a dashboard-intro hero.

### Inferences
- A practical agency prompt template, combining the patterns above:
  1. Identity and stakes line (@heyiammallik / @Ishaaqahamed)
  2. Read the real brand sources first (@aschapmann / @daniel_haida)
  3. Hex palette and font roles (@Gdgtify / @daniel_haida)
  4. One central motion rule (@Gdgtify, "One shape, never cut")
  5. Beat-by-beat or timestamped state list (@brainextends / @AnnaCher___)
  6. Easing spec, e.g. `cubic-bezier(0.16,1,0.3,1)`, overshoot ≤2%, closed-form springs
  7. Ban list (template look, corner chrome, particles, glows, crossfades, bouncy springs)
  8. Honesty clause for stats
  9. Determinism and reduced-motion (@iamtanzil_)
  10. A render-and-inspect loop before delivery
- For live website components rather than exported video, the `seek(t)` pure-function discipline from the @demonugc and @Gdgtify briefs carries over directly: it makes animations scroll-scrubbable and pausable.

### Gaps
- None of the picks has measurable outcome data. Picks 5, 6 and 10 come from partial entries: the prompt text is quoted in the post, but whether it is complete or edited cannot be verified.
- Picks 7 and 9 reference real third-party brands (Sprites.ai, Spotify, Meta, Google and others). The agency library should template these out, and trademark use in client-facing demos was not assessed.
- Only @iamtanzil_ asks for accessibility (prefers-reduced-motion). The slice offers no guidance on web performance budgets such as bundle size, mobile GPU cost or LCP impact of hero video.
