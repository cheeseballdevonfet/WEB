# Prompting patterns for Claude Opus 5.5 motion graphics: "motion" category, second half (slice indices 144–287)

Scope: entries in `/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json` with `category == "motion"` (288 total), sorted by slug ascending, indices 144–287 inclusive. That is 144 entries, from `leadnotifi-960983` to `zheke-622583`. I read all 144 prompts in full. Counts below come from Python passes over the slice (regexes plus manual reading), so treat them as approximate (±1–2). "Full" means `prompt_partial == false` (110 entries). "Partial" means `prompt_partial == true` (34 entries), where the creator shared only part of the prompt or only described the result.

## Q1. What prompt structures recur, and roughly how often?

### Takeaway
One viral one-liner dominates this half. The "15-second showreel for a résumé… go all out" prompt or a close variant makes up 52 of the 110 full prompts (47%). Fully structured spec prompts are rare: about 8 prompts over 1,000 characters, from about 5 distinct templates. Those few carry nearly all of the structure: sectioned specs, a locked palette and typefaces, a beat or timestamp storyboard, a deterministic `seek(t)` render, closed-form springs, a "Banned:" list, a loop invariant and a QA pass before the full render.

### Cited Findings

#### Slice composition and corpus caveats
- The slice has 144 entries: 110 full (76%) and 34 partial (24%). That is a lower partial rate than the corpus as a whole (196/475, 41%) or the motion category (71/288). — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json)
- The corpus is published by Skillry, a commercial skills site. The README calls it "Viral videos people made with Claude Opus 5.5". It links every entry to "live remakes on Skillry" and highlights "100 … one per distinct prompt". So it was selected for virality on X, not sampled at random. 31 of my 144 slugs are among the README highlights. — [README](/home/user/yihui-dev/awesome-opus5-5-videos/README.md); [Skillry gallery](https://skillry.dev/ai-videos/opus-5-5)
- **`tech_tags` describe Skillry's remake, not the creator's original stack.** Each `prompts/<slug>.md` lists the same values under "**Remake built with:**". For example, prasenx's entry reads "Remake built with: GLSL · Canvas · Web Audio". Do not read `tech_tags` as evidence of what Opus 5.5 produced for the creator. — [prompts/prasenx-693512.md](/home/user/yihui-dev/awesome-opus5-5-videos/prompts/prasenx-693512.md); [post](https://x.com/prasenx/status/2103538744695693512)
- Partial entries carry the label "The author didn't publish the full prompt. Below is the text of their original post." Some entries also contain curator-appended author notes under a Chinese-language header, "【作者补充制作说明】" ("author's supplementary production notes"), for example @wustep, @signalz_jp and @YarHmm. — [prompts/lnkiai-544254.md](/home/user/yihui-dev/awesome-opus5-5-videos/prompts/lnkiai-544254.md); [wustep post](https://x.com/wustep/status/2104610435571884086); [signalz_jp post](https://x.com/signalz_jp/status/2104022166471918002); [YarHmm post](https://x.com/YarHmm/status/2103505435802341449)
- Timing: 112 entries were added on 2026-09-26, 30 on 2026-09-29 and 2 on 2026-09-28. The posts span about 2026-09-22 to 2026-09-28 UTC (decoded from the X status-ID timestamps). So this is roughly one week of a viral trend. — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json)
- Language: about 128 entries are English. The rest are Japanese (about 8), Chinese (about 2), French (about 3), Portuguese (2) and Arabic (1). Almost all non-English entries are partial posts. The only full non-English prompts are @pound75423 (Japanese) and @TrigLyceee (French). — [pound75423](https://x.com/pound75423/status/2103722556918464968); [TrigLyceee](https://x.com/TrigLyceee/status/2103804459986161719)

#### Template families (verbatim reuse)
- **Showreel template:** 55 entries (52 full) contain "motion designer you are" or "showreel". Of these, 26 are verbatim (ignoring case, punctuation and accents): "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out." Another 8 add a suffix, and about 21 paraphrase it. The earliest corpus instance by decoded status ID is @stephanlivera's (about 2026-09-25 02:49 UTC). The corpus holds 91 instances, 50 of them in this slice. — [stephanlivera](https://x.com/stephanlivera/status/2103315922098470926); [leadnotifi](https://x.com/leadnotifi/status/2103628028391960983)
- Common suffixes on the showreel template:
  - A brand or URL: "for the infra company https://alchemy.com" — [onewaysidewalks](https://x.com/onewaysidewalks/status/2103500011581440008)
  - Orientation: "in portrait mode" — [ndhabarde11](https://x.com/ndhabarde11/status/2103832593355686104)
  - A mood: "psychedelic and hypnotic" — [monokern](https://x.com/monokern/status/2103563538828832979)
  - A narrative: "about the cycle of life … then cutting ready to loop to the beginning" — [loicRambo](https://x.com/loicRambo/status/2103428454355980558)
  - An audio spec — [prasenx](https://x.com/prasenx/status/2103538744695693512)
  - Bracketed placeholders: "Make a dynamic [24]-second … Only about [TOPIC]. Style: [BRAND COLORS], sound synced to the cuts." — [polydao](https://x.com/polydao/status/2103783134206566862)
- **"Highly professional SaaS product launch video" template:** 5 verbatim copies in the slice (8 in the corpus). The earliest is @moritzkremb (about 2026-09-24 10:16 UTC). It asks Claude to "Go and find some SaaS … get actual assets and images … from the internet" and to imitate "typical, very professionally edited, motion-graphics-styled product launch videos that you see people making on Twitter". — [moritzkremb](https://x.com/moritzkremb/status/2103066071838466494); [techtactician](https://x.com/techtactician/status/2103219463508144474) (adds a target site: slideforge.io)
- **XML-sectioned "UI morph" template** (`<inputs>`, `<direction>`, `<structure>`, `<build>`, `<gotchas>`, `<start>`): 3 identical copies plus 1 Pokémon adaptation in the slice (12 in the corpus). In the slice, @twoclipping posted first (about 2026-09-24 23:58 UTC). The earliest corpus copy is another @twoclipping entry filed under "3d" (about 2026-09-23). — [twoclipping](https://x.com/twoclipping/status/2103273003555402193); [sanjeevn72](https://x.com/sanjeevn72/status/2103456358125457691); [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391); [TheGrootDev](https://x.com/TheGrootDev/status/2103516567824966114)
- Smaller duplicate pairs:
  - "create a motion design video of a poster breaking out of its own frame." — [pankajkumar_dev](https://x.com/pankajkumar_dev/status/2103502614134718609); [sahilvermaai](https://x.com/sahilvermaai/status/2103725292095189237)
  - "Make a … edit that goes hard", posted 27 minutes apart — [MicheleHarmonic](https://x.com/MicheleHarmonic/status/2103111448352244175); [maxalexweber](https://x.com/maxalexweber/status/2103118009535459784)

#### Structural elements: approximate counts in the 110 full prompts
- **Duration stated:** about 65. 15 s appears 46 times (driven by the template). Others: 30 s (6), 10 s (4), 20 s (4), 14 s or 28 beats (1), 30–60 s (1), 1 min (1), 80 s (1) and 90–100 s (1). — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json); e.g. [zeezomb "80 second square animated film"](https://x.com/zeezomb/status/2102906701552726206)
- **Resolution or aspect ratio:** about 11. Values seen: 1440×1440 square (the UI-morph family, 4), 1080×1080 (techhalla), 1920×1080 (prasenx, wani_shola), 1280×720 (pound75423), a 128×96 logical pixel canvas (majidmanzarpour), "portrait mode", "vertical 9:16" (x4b47x) and "square" (zeezomb). — [techhalla](https://x.com/techhalla/status/2103411244468498547); [x4b47x](https://x.com/x4b47x/status/2103019799614034026)
- **Frame rate:** 8. 60fps in 7 (the UI-morph family, techhalla, prasenx, and majidmanzarpour's "stable 60fps"); 30fps in 1 (pound75423). — [prasenx](https://x.com/prasenx/status/2103538744695693512)
- **"Single/one (self-contained) HTML file" or HTML page:** about 8–9 (majidmanzarpour, zeezomb, the UI-morph family ×4, techhalla, xelandre, pound75423 "HTML Canvas"). — [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543); [xelandre__](https://x.com/xelandre__/status/2103473030160687413)
- **Hex palette:** only 1 prompt (techhalla: "#0A0A0A", "#FF2BD6", "#B8FF00", "#F5F5F5"). Others specify color in words: "Fixed palette of ~24 hex colors" with no values (majidmanzarpour), "pure black and white or one accent color" (UI morph), and "three colours" (wani_shola). — [techhalla](https://x.com/techhalla/status/2103411244468498547); [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543)
- **Named typefaces:** 5. Geist in the UI-morph family ×4; Archivo Black, Syne ExtraBold and IBM Plex Mono Medium with tracking values in techhalla. wani_shola asks for "the site's own fonts". — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391); [wani_shola](https://x.com/wani_shola/status/2103769906638459278)
- **Timestamped or beat-numbered storyboard:** 2 (techhalla "0.0–2.5s COLD OPEN …"; TheGrootDev "Bar 1 … 28. …"). Untimed ordered sequences are more common:
  - The arrow chain in the UI-morph family ×3
  - Numbered steps (mattbean)
  - Life stages (loicRambo)
  - Build order (Mounnna)
  - [mattbean](https://x.com/mattbean/status/2103146389412917572); [Mounnna](https://x.com/Mounnna/status/2103802871934497266)
- **A single governing visual rule or metaphor:** about 6:
  - "One shape, never cut" (UI morph ×4)
  - "a glass and gold leaf wall mosaic whose tiles were never glued down … a fish swims by its tiles swimming" (zeezomb)
  - "a street-poster that moves" (techhalla)
  - "a poster breaking out of its own frame" (×2)
  - [zeezomb](https://x.com/zeezomb/status/2102906701552726206)
- **Explicit prohibitions or negative constraints:** about 13. Five have a formal "Banned:" or "BANNED:" block (the UI-morph family ×4 and techhalla). The others are inline, for example:
  - "no video gen model, no additional libraries." — [lepadev](https://x.com/lepadev/status/2103101681806475414)
  - "Avoid the frames and texts on the corners which are typical ai made giveaways!" — [souravbhar871](https://x.com/souravbhar871/status/2103711849703477361)
  - "No AI slop." — [MiaAI_lab](https://x.com/MiaAI_lab/status/2103837519615774895)
- **Quality-bar language:** "go all out", "go crazy" or "go wild" in 53 full prompts. A dedicated "QUALITY BAR" section appears in only 1 (majidmanzarpour). — [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543)
- **Loop requirement:** about 7. Examples: "The last frame is the first frame, so it loops" and "frame 0 == frame last (position, opacity, cursor if any)". — [techhalla](https://x.com/techhalla/status/2103411244468498547)
- **Deterministic time-driven rendering** (`seek(t)`, or "every frame is calculated from the time"): 6. — [xelandre__](https://x.com/xelandre__/status/2103473030160687413)
- **QA or approval gate before final output:** 6. Examples: "Render one frame per beat before the full render. Fix anything off the grid, cramped or hard to read" (UI morph ×4); techhalla's "Pre-pass: … export one still per major beat (8 frames). Fix cramped type, orphan words, low contrast"; pound75423 asks to see a screenshot list per section before final export. — [TheGrootDev](https://x.com/TheGrootDev/status/2103516567824966114); [pound75423](https://x.com/pound75423/status/2103722556918464968)
- **Context injection:** about 26 full prompts point the model at a URL, handle, repo or brand. Examples:
  - "[gave access to Ren repo]" — [macrohou](https://x.com/macrohou/status/2103545787875733862)
  - "use assets from the current live site" — [madebyjmayala](https://x.com/madebyjmayala/status/2103578285892649220)
  - "You have access to the designs in pen" — [sachaarbonel](https://x.com/sachaarbonel/status/2103614797501673648)
  - "make a 10 sec video on whatever you know about me" — [Madhav_XO](https://x.com/Madhav_XO/status/2103605007396524440)
- **Role or persona framing:** "You are a world-class motion designer…" in 2. The showreel template frames the model as the designer being judged. — [reflex_cloud](https://x.com/reflex_cloud/status/2103552840027304046)
- **Prompt-length distribution of full prompts:** ≤100 chars: 25; 101–300: 62; 301–1,000: 15; >1,000: 8. — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json)

#### Agent-directed text (noted as data only)
- The UI-morph family ends with `<start>Ask me for the inputs, then show me the state list on the beat grid before you write any code.</start>`. This is a plan-before-code gate aimed at the generating agent. — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
- Other agent-directed lines:
  - "Please do not reference any previous memories or skills." — [nolkeeg](https://x.com/nolkeeg/status/2103841917603635633)
  - "Proceed as if you were starting with zero of my tools. Do not assume that the tools we already have are the best to use" — [reflex_cloud](https://x.com/reflex_cloud/status/2103552840027304046)
  - "dont ask just make" — [levabashidze](https://x.com/levabashidze/status/2103786742520184909)
- None of these is directed at a downstream reader. I treated them as data only.

### Inferences
- In this half, "structure" mostly means a small set of shared templates copied verbatim, not a broad habit of spec writing. Counts of structural features are therefore inflated by duplicate copies. For example, Geist, 1440×1440 and 120 BPM nearly all come from one 4-copy family.
- The long templates share a skeleton a website-component library could reuse. In order: governing visual rule → strict tokens (palette, type, tracking) → locked copy → ordered or timestamped beats → technique requirements (determinism, springs, motion blur) → Banned list → loop invariant → QA pass before rendering.
- Hex palettes and named design references are much rarer in this half than one might expect. Brand identity usually comes in through a URL, repo or site assets, not through explicit tokens.

### Gaps
- No engagement metrics (views, likes) exist in the corpus, so I cannot weight structures by how well they were received.
- I did not view the videos, posters or Skillry pages (scope was the local corpus only). Claims about output quality rest on the creators' own captions.
- Template provenance beyond the corpus is unknown. The earliest corpus instance may not be the origin.

## Q2. How do short one-line prompts compare with long spec prompts? Which kinds go with the most impressive-sounding results?

### Takeaway
Short prompts (≤300 chars, 79% of full prompts) hand art direction to the model and rely on ego and quality-bar framing plus context (a URL, repo or assets). The few long specs pin down determinism, timing, tokens and banned clichés, and they target precise, loopable, rhythmic pieces. The most excited "results" captions come mostly from partial posts. Those describe short prompts run through installed skills (Remotion or HyperFrames), multi-tool audio pipelines and long iteration loops. The prompt text itself is often missing, so impressiveness cannot be tied to prompt length.

### Cited Findings
- Examples of the shortest full prompts:
  - "Go all out." — [sudo_kiran](https://x.com/sudo_kiran/status/2103463886372696074)
  - "140 BPM rusko/skream style UK dubstep" — [Rames_Jusso](https://x.com/Rames_Jusso/status/2103200703598776559)
  - "fun motion graphic, comic book style, 10s" — [madpencil_](https://x.com/madpencil_/status/2103449418460753990)
  - "make about my studio with Risograph style" — [rneayan](https://x.com/rneayan/status/2103401006281441493)
  - "make the most impressive demo video for (company name)" — [vahidf24](https://x.com/vahidf24/status/2103258346690121886)
- Short prompts often leave every creative choice to the model and add competitive or ego stakes:
  - "You pick the design style, the look, subject etc. I just want to be extremely impressed … I want you to destroy GPT 6 when it comes to motion graphics video - because astra just wants to give me a stupid glorified powerpoint presentation." — [nolkeeg](https://x.com/nolkeeg/status/2103841917603635633)
  - "No AI slop. Something unique, think outside of the box. … Something no other model done before. Be proud. Show your best. Don't disappoint." — [MiaAI_lab](https://x.com/MiaAI_lab/status/2103837519615774895)
- Medium-length prompts add narrative or style constraints rather than technical ones:
  - "Style: doodly, cute, warm, strongly narrative, no spoken language (simple text is OK, but don't use too much explanatory/narrative text, because I want different civilizations to be able to understand it), poetic, moving, high quality." — [songkeys](https://x.com/songkeys/status/2102743212922384673) (README-highlighted)
  - "Create a pure javascript animation. 30-60s, vertical 9:16, paper cut-out shadow theatre style with gentle, fitting audio (made in code) on the topic: What makes a place feel like home?" — [x4b47x](https://x.com/x4b47x/status/2103019799614034026)
- Long spec prompts specify implementation mechanics:
  - "Every style is computed from time inside seek(t): no CSS transitions, no timers, no state carried between frames." — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
  - "Kinetic type: per-glyph spring (y, opacity, blur). Stagger = 1/16 note at 120 BPM (125ms)." — [techhalla](https://x.com/techhalla/status/2103411244468498547)
  - "Pooled allocation-free particle system … Fixed 60hz timestep update with rAF rendering. Zero object allocation inside the loop." — [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543)
- Long prompts also add templating and parameterization. TheGrootDev turned the generic UI-morph template into a 28-beat, bar-by-bar Pokémon storyboard with extra gotchas:
  - "Export the interval [0, duration) without duplicating the endpoint frame. Make the audio loop cleanly too." — [TheGrootDev](https://x.com/TheGrootDev/status/2103516567824966114)
  - pound75423's Japanese prompt uses 【…】 placeholders for the user's text, name and date. — [pound75423](https://x.com/pound75423/status/2103722556918464968)
- Self-reported reactions to results come mostly from partial posts that name tooling and leave out the prompt:
  - "The taste is unreal. The transitions, the timing, the branding. Everything is on point" (Remotion) — [priyansh0327](https://x.com/priyansh0327/status/2102472633057206409)
  - "Mind-blowing: it built this promo on the first try … It rebuilt our desktop app's UI in React straight from the XAML and design tokens. Zero screenshots." — [proanaliteg](https://x.com/proanaliteg/status/2103895246593458642)
  - "this is INSANE! The whole Twitter → 𝕏 story in 30 seconds … Opus 5.5 wrote every frame in Remotion and composed the soundtrack in code." — [TejasThange3](https://x.com/TejasThange3/status/2103735653943128242)
- Effort and iteration reported in partial posts:
  - About 90 messages, 33 video takes and about $400 of credits over 2 days for a Notion feature trailer, built in Remotion with Opus 5.5 [xhigh]. — [wustep](https://x.com/wustep/status/2104610435571884086)
  - "100% Opus 5.5 Max, in 8h15 min. Gave it access to DesignLoop, hyperframe skill, elevenlabs." — [vince_builds](https://x.com/vince_builds/status/2104257989100355650)
  - Canonical prompt plus the HyperFrames skill plus a reference to the project folder, at effort max, using about 5% of a 5-hour limit. — [thayto_dev](https://x.com/thayto_dev/status/2104200591278739735)
- Iterative critique and meta-prompting:
  - Follow-up: "can you choose a royalty-free song online? You are clearly not a good song maker. Also, I would not hire you … This is not a professional-looking video. Also, it is a bit too fast and bumpy" — [sachaarbonel](https://x.com/sachaarbonel/status/2103614797501673648)
  - "I linked the best ones and asked it why theirs beat mine. This is what it made." — [tycenjm](https://x.com/tycenjm/status/2103024522589098014)
- Some "full" prompts include the author's post commentary rather than prompt text only, for example "If Astra already blew our minds… Opus 5.5 is a monster 😱" at the end of techhalla's entry. — [techhalla](https://x.com/techhalla/status/2103411244468498547); [ParanoidAmerica](https://x.com/ParanoidAmerica/status/2103570879619686717)

### Inferences
- The one-liner works as a stress test of the model's built-in taste. It became a meme benchmark, so many outputs from the same prompt get compared. For a component library, it is a weak template because nothing pins down tokens, timing or output format.
- The most production-relevant results seem to come from short prompts plus heavy context: an installed animation skill, the real site or repo, an audio pipeline, and several iterations or takes. The long specs show what that context has to encode when no skill is present.
- The plan-or-QA gates in long prompts ("show me the state list … before you write any code"; a still per beat before rendering) are an inexpensive quality lever that short prompts never use.

### Gaps
- I could not judge which prompts produced the best-looking videos. There are no metrics and I did not view the videos. "Impressive" here means only the creators' self-reports, which are promotional by nature.
- In partial posts, the prompt, skill configuration and number of iterations are mostly unknown, so I could not compare one-shot results with iterated ones.

## Q3. How is tooling beyond raw HTML prompted (Remotion, HyperFrames, GSAP, Three.js, shaders, Lottie, audio sync)?

### Takeaway
Framework names almost never appear in the prompts themselves. Remotion is named in 2 full prompts but credited in about 23 partial posts. HyperFrames is named in 0 full prompts and 8 partial posts. GSAP and Three.js appear by name essentially only in garbled or partial text. Lottie never appears. Tooling is supplied as installed agent skills, or by prohibiting libraries outright. The technical language in full prompts is about the render pipeline and audio: headless Playwright frame capture, ffmpeg (tmix motion blur, muxing), numpy beat grids, and code-synthesized soundtracks.

### Cited Findings
- **Remotion in full prompts (2 cases):**
  - "Study how this https://experiments.cloudjoi.com works and use Remotion to make a product showcase video." — [lester_tyy](https://x.com/lester_tyy/status/2103733819568480587)
  - "Make a showreel-style motion graphics video for my portfolio website … using Remotion." — [wani_shola](https://x.com/wani_shola/status/2103769906638459278)
- **Remotion in partial posts:** about 23 credit it, usually as a pairing ("Opus 5.5 + @Remotion"). Some say it was a skill:
  - "Tried the Remotion skill in Claude Code (Opus 5.5 xhigh)" — [proanaliteg](https://x.com/proanaliteg/status/2103895246593458642)
  - "@Remotion for the skill" — [SeanTiffonnet](https://x.com/SeanTiffonnet/status/2102518598736675262)
  - "Remotion × three.jsでM3E Canvasの動画を作ってみた" ("made an M3E Canvas video with Remotion × three.js") — [lnkiai](https://x.com/lnkiai/status/2103759350330544254)
- **HyperFrames:** credited in 8 partial posts and no full prompt.
  - "Created a launch video … with Claude Opus 5.5 Medium in Claude Code with the Hyperframes by HeyGen skill." — [shushant_l](https://x.com/shushant_l/status/2102730243576619370)
  - Japanese post (my translation): the author only asked "make a Shin-Majin-style PV" and answered "omakase" (leave it to you). Video was HTML plus code drawn frame by frame (HyperFrames). BGM came from Gemini's Lyria. Sound effects were placed on landing and stamp moments by analyzing the beat: "Claude can't hear audio, yet it analyzed the waveform numerically to sync". — [Majin_AppSheet](https://x.com/Majin_AppSheet/status/2103497319899693327)
  - "Claude Opus 5.5 + HyperFrames + Gemini Flash 3.8 + Three js" for a fictional household-budget service. — [_petert](https://x.com/_petert/status/2103878940100350098)
- **GSAP, Three.js, shaders and Lottie:**
  - GSAP is never named cleanly. One voice-dictated prompt says "I think you'd use vMotion, 3GS, a bunch of stuff you've got. Use whatever you want." These look like garbled tool names; what they refer to is uncertain. — [nummanali](https://x.com/nummanali/status/2103565570310340931)
  - The only explicit GPU spec: "using WebGL2 and plain JavaScript, with no libraries and no image, font or audio files." — [zeezomb](https://x.com/zeezomb/status/2102906701552726206)
  - Lottie: 0 mentions.
  - Note: the `gsap`, `threejs` and `shader` tags (29, 23 and 16 entries) describe Skillry remakes (see Q1), not the prompts.
- **Library prohibitions as a tooling choice:**
  - "no video gen model, no additional libraries." — [lepadev](https://x.com/lepadev/status/2103101681806475414)
  - "using vanilla JavaScript and Canvas 2D. No external assets, libraries, or network requests." — [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543)
  - "Create a pure javascript animation." — [x4b47x](https://x.com/x4b47x/status/2103019799614034026)
- **Render pipeline as the spec:**
  - "Code-driven animation: an HTML/JS page where every frame is calculated from the time, captured frame by frame with headless Chrome (Playwright), then assembled with ffmpeg into an MP4 with motion blur and code-generated sound." This is the whole prompt. — [xelandre__](https://x.com/xelandre__/status/2103473030160687413)
  - "Render with Playwright: 4 subframes per frame, blended with ffmpeg tmix for motion blur at 60fps." — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
  - Japanese (my translation): "Write the animation in HTML Canvas, capture it frame by frame with Playwright, mux with audio via ffmpeg to MP4 (1280×720, 30fps, ≤30MB). Don't use AI video generation; make it all programmatic animation." — [pound75423](https://x.com/pound75423/status/2103722556918464968)
- **Audio sync prompting:**
  - Code-synthesized audio: "compose the soundtrack yourself, fully synthesized in code. no samples, no audio files, no VST instruments. every cut and transition must land on the beat. 1920x1080, 60fps. render the final video with the music mixed in as an MP4" — [prasenx](https://x.com/prasenx/status/2103538744695693512)
  - Analysis-driven: "Analyze the song with numpy for the beat grid and start on a downbeat. Place every UI sound by its measured peak." — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
  - pound75423 (my translation) asks Claude to compute BPM, first-beat position, bar heads and section energy (intro, verse, chorus, breakdown). Effects scale with the section: "intro ~40%, verse 70%, chorus 100%". — [pound75423](https://x.com/pound75423/status/2103722556918464968)
  - Lyrics sync: "check lyrics.txt to sync the visuals to" — [ParanoidAmerica](https://x.com/ParanoidAmerica/status/2103570879619686717); "perfectly syncing the lyrics and animation to the vocals and beat" — [samaote](https://x.com/samaote/status/2103510974796124569)
  - Restraint: "Add music at about 120 BPM (elite, kinetic, sophisticated) and cut every scene on the beat. No extra sound effects." — [wani_shola](https://x.com/wani_shola/status/2103769906638459278)
- **Third-party generative tools named in posts** (mostly partial):
  - ElevenLabs music plus "159 sound effects, all synced to the beat" — [PiyushAaryan2](https://x.com/PiyushAaryan2/status/2103603040079196586)
  - Gemini TTS; ffmpeg YouTube-spec checks; YouTube Data API upload — [signalz_jp](https://x.com/signalz_jp/status/2104022166471918002)
  - ComfyUI/SDXL detected and used for assets (full entry; the author's commentary) — [ParanoidAmerica](https://x.com/ParanoidAmerica/status/2103570879619686717)
  - "It controls blender, remotion, runway and veo" — [Tardigrade111](https://x.com/Tardigrade111/status/2104620857826160686)
  - Lip-synced "talking sales guy" — [QinElke](https://x.com/QinElke/status/2104176976261271655)
  - SFX restricted to camera and lens sounds common in reels (Arabic; my paraphrase) — [YarHmm](https://x.com/YarHmm/status/2103505435802341449)

### Inferences
- For website components, "tooling" mainly comes down to three things: (a) whether to forbid libraries (zero-dependency vanilla Canvas or WebGL2), (b) a deterministic time function (`seek(t)`) so the same code can drive either a live page or a frame-exact render, and (c) audio-to-motion mapping (a beat grid, or section energy driving effect intensity). Remotion and HyperFrames are video-render frameworks and matter less for live web components.
- The `seek(t)` "pure function of time" pattern carries over well to scroll-linked web animation, where t comes from scroll progress instead of a clock.

### Gaps
- What the Remotion and HyperFrames skills actually instruct is not in the corpus. Their contribution to quality cannot be separated from the prompt.
- No prompt in this half uses Lottie, CSS scroll-driven animations, the View Transitions API or GSAP ScrollTrigger by name.

## Q4. What vocabulary and phrases recur that seem to push quality?

### Takeaway
The recurring quality pushers are status and stakes language ("go all out", "showreel for a résumé", "world-class", "Dribbble-level", "if this is weak, you don't get hired"), anti-cliché bans ("No AI slop", "anything that looks like a template", "Canva-deck energy", "purple/blue neon, glassmorphism") and precise motion vocabulary (closed-form springs with "a tiny overshoot at most", per-glyph stagger by musical note value, punch-in and smash-pans, mask wipes, print misregistration, motion blur via subframes). Named studio or brand references (Swiss, brutalist, Apple keynote, Stripe, Linear, Vercel) are absent from this half. Named CSS easing curves are also absent: there are 0 matches for cubic-bezier, ease-in or ease-out.

### Cited Findings
- **Status and stakes:**
  - "showreel" appears in 51 entries and "go all out", "go crazy" or "go wild" in 55 (53 full). — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json)
  - "This piece must feel like the best designer in the room made a street-poster that moves. Showreel stakes: if this is weak, you don't get hired." — [techhalla](https://x.com/techhalla/status/2103411244468498547)
  - "Treat it as your résumé: showcase your full range, push the craft as far as possible." — [samuel_spitz](https://x.com/samuel_spitz/status/2103544855276503053)
- **Pacing grammar:** "open with a striking hook in the first second, build through a sequence of distinct techniques (typography, shape play, camera moves, colour shifts), and land on a clean, memorable final frame. Pacing should feel like it's cut to music." — [reflex_cloud](https://x.com/reflex_cloud/status/2103552840027304046)
- **Polish benchmark:** "Dribbble-level UI motion" (4 entries) — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
- **Anti-cliché bans:**
  - "Banned: bouncy easing, particle bursts, glows, gradients on UI chrome, mismatched icon strokes, dead time, anything that looks like a template." — [twoclipping](https://x.com/twoclipping/status/2103273003555402193)
  - "BANNED: Generic AI clichés (brains, robots, neural nets, sparkles), soft gradients, bouncy cartoon easing, particle explosions, stock "futuristic HUD", long paragraphs, narrator essay energy, Canva-deck energy, extra slogans beyond the locked message, purple/blue neon, glassmorphism." — [techhalla](https://x.com/techhalla/status/2103411244468498547)
  - Also: "Avoid the frames and texts on the corners which are typical ai made giveaways!" — [souravbhar871](https://x.com/souravbhar871/status/2103711849703477361)
  - A Japanese creator set out to avoid "AI臭さ" (AI-smell) by aiming for a "stylish video like one you've seen somewhere" (my translation). — [washow_cfo](https://x.com/washow_cfo/status/2104595346882175311)
- **Motion vocabulary:**
  - "Springs everywhere, a tiny overshoot at most." — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
  - "Use tightly damped springs with only a tiny overshoot." — [TheGrootDev](https://x.com/TheGrootDev/status/2103516567824966114)
  - "The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one." — [sanjeevn72](https://x.com/sanjeevn72/status/2103456358125457691)
  - "Camera: one orthographic camera; only punch-in (1.0→1.08) and horizontal smash-pans timed to beats — never random drift." — [techhalla](https://x.com/techhalla/status/2103411244468498547)
  - "eased motion only, smooth transitions instead of hard cuts, and a rhythm that speeds up and slows down with the story." — [wani_shola](https://x.com/wani_shola/status/2103769906638459278)
- **Typography vocabulary:** "Tracking: display −40 to −80; mono +20. Optical kerning. No cute script fonts."; "Letters scramble (seeded Fisher–Yates per glyph) then snap on the beat."; "mask wipe through the letterforms (the outgoing line is the mask)". — [techhalla](https://x.com/techhalla/status/2103411244468498547)
- **Brand-discipline vocabulary:** "premium brand rules: three colours and the site's own fonts, one idea per shot, key objects centred, space to breathe" — [wani_shola](https://x.com/wani_shola/status/2103769906638459278)
- **Readability gotchas:**
  - "Never put will-change on anything the camera scales or the text renders blurry. Text that swaps inside a morphing container needs its own enter and exit timing or it overlaps." — [nezbuilds](https://x.com/nezbuilds/status/2103487427365294391)
  - "Keep visible text brief enough to read at this pace." — [TheGrootDev](https://x.com/TheGrootDev/status/2103516567824966114)
- **Style tokens used as the whole art direction:**
  - "Oscilloscope style" — [rneayan](https://x.com/rneayan/status/2103401461837406275)
  - "Risograph style" — [rneayan](https://x.com/rneayan/status/2103401006281441493)
  - "comic book style" — [madpencil_](https://x.com/madpencil_/status/2103449418460753990)
  - "monty-python/vox style "postcards in space" mixed with sketchy ballpoint pen style visuals" — [ParanoidAmerica](https://x.com/ParanoidAmerica/status/2103570879619686717)
  - "polished 16-bit sprite animation, not vector shapes scaled down" — [majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543)
  - "brainrot" — [supremebeme](https://x.com/supremebeme/status/2103272941832306746)
  - "edit that goes hard" — [maxalexweber](https://x.com/maxalexweber/status/2103118009535459784)
- **Numbers as quality anchors:** "60fps" (7), "120 BPM" (6), "1/16 note … (125ms)", "4 subframes per frame", "scale 1.000→1.012→1.000" micro-breath — [techhalla](https://x.com/techhalla/status/2103411244468498547)
- **Absent from this half:** a scan found 0 matches for Swiss, brutalist, Apple, keynote, Stripe, Linear, Vercel, Bauhaus, "cinematic", cubic-bezier, ease-in/ease-out and Lottie. — [videos.json](/home/user/yihui-dev/awesome-opus5-5-videos/data/videos.json)

### Inferences
- The most transferable quality levers for web components are (1) a "Banned" list naming specific AI and template clichés, (2) spring language with a stated overshoot ceiling instead of named easings, (3) one governing visual rule, and (4) explicit readability and legibility checks.
- Ego framing ("show what an incredible motion designer you are") draws on the model's own taste but adds variance. Spec prompts replace it with stakes plus constraints, as in techhalla.

### Gaps
- Without viewing the outputs, I cannot confirm that any of these phrases actually raised quality. The link is inferred from their presence in carefully engineered prompts and from creators' captions.

## Q5. Which 8–12 prompts are the best templates for website components? (Re-scoped to a digital marketing agency site)

### Takeaway
Re-ranked for a **digital marketing agency website**, 12 full prompts (all `prompt_partial: false`) adapt well. Each is tagged with the site slot it would fill. The strongest are:
- techhalla: kinetic hero headline
- reflex_cloud: showreel hero
- wani_shola: case study / showreel with real captures
- Mounnna: logo reveal
- zeezomb: animated background / client logo wall
- the UI-morph template: CTA micro-interactions

No prompt in this half directly targets ROI counters, client logo walls or case-study page transitions. viktoroddy's "1 million monthly visitors" milestone and zeezomb's tile-flock mosaic come closest. Note: `tech_tags` describe the Skillry remake stack, not the original.

### Cited Findings

**Slot coverage at a glance:**
- Hero/showreel: #1, #2, #3
- Kinetic headline: #1
- Logo/brand reveal: #4
- Animated background / client logo wall: #5, #12
- CTA micro-animations: #6
- Service cards / services walkthrough: #7
- Case-study cards and transitions: #3, #8
- Process / how-we-work illustration: #9
- Service explainer illustration: #10
- Stat/ROI counter: #11

**1. [Slot: Hero, kinetic headline / brand bumper] Kinetic identity bumper**
- Slug: `techhalla-498547`, by @techhalla. — [post](https://x.com/techhalla/status/2103411244468498547)
- tech_tags: [canvas]. prompt_partial: false.
- Excerpt: "This piece must feel like the best designer in the room made a street-poster that moves. […] LOOPABLE: frame 0 == frame last (position, opacity, cursor if any). FORMAT: one HTML file, 1080×1080 (square, X-native). 60fps. PALETTE (strict): - bg # 0A0A0A - magenta # FF2BD6 - acid green # B8FF00 - white # F5F5F5 only for primary readable type when needed No other hues. […] TYPE SYSTEM (use all three; never one font for everything): 1) Display / scream: Archivo Black […] MESSAGE (locked — do not soften, do not add filler slogans) […] 0.0–2.5s COLD OPEN — "STOP SCROLLING" slams in from below with spring overshoot; magenta smear trail […] Letters scramble (seeded Fisher–Yates per glyph) then snap on the beat. […] replaces it via mask wipe through the letterforms (the outgoing line is the mask). […] Kinetic type: per-glyph spring (y, opacity, blur). Stagger = 1/16 note at 120 BPM (125ms)."
- Agency mapping: the agency's hero headline with rotating value propositions (per-glyph spring, scramble-then-snap, mask-wipe word swap). The "locked message" section keeps copy on-brand, and the strict token block becomes the agency palette and type system.

**2. [Slot: Hero showreel / intro sequence] Résumé reel with pacing grammar and brand promotion**
- Slug: `reflex-cloud-304046`, by @reflex_cloud. — [post](https://x.com/reflex_cloud/status/2103552840027304046)
- tech_tags: [shader, webgl, canvas, css]. prompt_partial: false.
- Excerpt: "You're a world-class motion designer, and this is your 15-second résumé reel. Make it dynamic and confident: open with a striking hook in the first second, build through a sequence of distinct techniques (typography, shape play, camera moves, colour shifts), and land on a clean, memorable final frame. Pacing should feel like it's cut to music. Go crazy. Make it promote our brand, reflex. inc."
- Agency mapping: an above-the-fold showreel loop or page-load intro (hook → technique montage → logo lockup). An agency's showreel is its core proof of craft.

**3. [Slot: Showreel + case-study section] Portfolio showreel from real site captures**
- Slug: `wani-shola-459278`, by @wani_shola. — [post](https://x.com/wani_shola/status/2103769906638459278)
- tech_tags: [svg, gsap]. prompt_partial: false. README-highlighted.
- Excerpt: "Use as much of the real website as possible: capture the pages and sections in a browser (home, Ask, package pages, Hire, mobile view, dark mode) and animate them inside browser and phone frames. - Show the site's chat answering real questions about my work, with the questions and answers large and bold. Use only facts and numbers that are on the site. - Follow premium brand rules: three colours and the site's own fonts, one idea per shot, key objects centred, space to breathe, eased motion only, smooth transitions instead of hard cuts, and a rhythm that speeds up and slows down with the story. - Add music at about 120 BPM (elite, kinetic, sophisticated) and cut every scene on the beat. No extra sound effects."
- Agency mapping: case-study tiles where each client's real site animates inside browser and phone frames. "Use only facts and numbers that are on the site" is a guardrail against invented ROI claims. "Premium brand rules" is a reusable art-direction block.

**4. [Slot: Logo / brand reveal, preloader] Shard-assembly logo reveal**
- Slug: `mounnna-497266`, by @Mounnna. — [post](https://x.com/Mounnna/status/2103802871934497266)
- tech_tags: [canvas]. prompt_partial: false. README-highlighted.
- Excerpt (full prompt): "Create a motion design video of a slow-reveal transition. Draw the logo as a wireframe first, then fly in faceted low-poly shards one by one until they assemble the logo. Finish by bringing in the app icon background and typing out the brand name."
- Agency mapping: the agency preloader or brand reveal (wireframe stroke-draw → shard fill → icon plate → typewriter wordmark). It can be reused per client on case-study openers.

**5. [Slot: Animated hero background / client logo wall] Glass and gold-leaf tile mosaic, WebGL2**
- Slug: `zeezomb-726206`, by @zeezomb. — [post](https://x.com/zeezomb/status/2102906701552726206)
- tech_tags: [threejs, shader]. prompt_partial: false.
- Excerpt (full prompt): "Make an 80 second square animated film as a single HTML file, using WebGL2 and plain JavaScript, with no libraries and no image, font or audio files. It should look like a glass and gold leaf wall mosaic whose tiles were never glued down, so they can lift, flip, fly and click back into place. Figures are flocks of tiles, so a fish swims by its tiles swimming."
- Agency mapping: the "figures are flocks of tiles" rule can drive a client logo wall where tiles fly and click into each client's logo in turn, or a hero background that reassembles into the headline. Zero-asset, single-file constraints help performance.

**6. [Slot: CTA micro-animations / interactive service tabs] UI morph, "one shape, never cut"**
- Slug: `nezbuilds-294391`, by @nezbuilds. — [post](https://x.com/nezbuilds/status/2103487427365294391)
- Identical text also appears as `twoclipping-402193` (earliest in the slice), [post](https://x.com/twoclipping/status/2103273003555402193), and as `sanjeevn72-457691`, [post](https://x.com/sanjeevn72/status/2103456358125457691).
- tech_tags: [svg]. prompt_partial: false.
- Excerpt: "Dribbble-level UI motion. One shape, never cut: every state is the same element morphing its size, radius and color while its content swaps with a short blur. A cursor drives every change with real clicks and drags. […] Springs everywhere, a tiny overshoot at most. […] The last frame is the first frame, so it loops. Banned: bouncy easing, particle bursts, glows, gradients on UI chrome, mismatched icon strokes, dead time, anything that looks like a template. […] Button → loader → check → dynamic island → […] → the knob becomes a liquid tab indicator → the tabs open into a chart that draws itself, with a tooltip on hover → it collapses into ⌘K → type to filter → enter → toast → back to the button. […] Springs are closed-form step responses. A value that changes target many times is the sum of one spring per change, so it stays a pure function of time."
- Agency mapping: the "Book a call" or "Get a proposal" button flow (button → loader → check → toast). The liquid tab indicator works for service tabs, and the self-drawing chart for a results module.

**7. [Slot: Service cards / services walkthrough] Brand-mark morph adaptation of the UI-morph template**
- Slug: `thegrootdev-966114`, by @TheGrootDev. — [post](https://x.com/TheGrootDev/status/2103516567824966114)
- tech_tags: [svg]. prompt_partial: false.
- Excerpt: "One shape, never cut: a Poké Ball continuously morphs into every interface component by changing its size, radius, and color. Its central button, dividing line, and outer shell become the controls and structure of each new state. […] 120 BPM, 4/4 time, 7 bars: 28 beats, approximately 14 seconds. […] Bar 1 — Poké Ball activation 1. A closed Poké Ball sits centered; the cursor approaches. 2. The cursor clicks its central button. 3. The button becomes a circular scanning loader. 4. The scan resolves into a check, and the shell stretches into a compact Pokédex. […] Keep one persistent outer element throughout the sequence. Its internal artwork, labels, and controls may change, but the main silhouette must visibly connect every state."
- The source contains X auto-link artifacts such as "http://recognizable.One", which I omitted with […].
- Agency mapping: replace the Poké Ball with the agency's logo mark, which morphs into each service card (SEO → Paid → Social → Content). The bar-by-bar beat sheet becomes a scroll-step storyboard.

**8. [Slot: Case-study cards / transitions] Poster breaking out of its frame**
- Slug: `pankajkumar-dev-718609`, by @pankajkumar_dev. — [post](https://x.com/pankajkumar_dev/status/2103502614134718609)
- Identical text also appears as `sahilvermaai-189237`. — [post](https://x.com/sahilvermaai/status/2103725292095189237)
- tech_tags: [canvas]. prompt_partial: false. README-highlighted.
- Excerpt (full prompt): "create a motion design video of a poster breaking out of its own frame."
- Agency mapping: case-study cards whose campaign creative breaks out of the card on hover or scroll (3D tilt or parallax pop-out), or a transition into the case-study page. A one-line concept that fits the "governing visual rule" slot of a fuller spec.

**9. [Slot: "How we work" / process steps illustration] Three-step drawing-style clip**
- Slug: `mattbean-917572`, by @mattbean. — [post](https://x.com/mattbean/status/2103146389412917572)
- tech_tags: [canvas]. prompt_partial: false.
- Excerpt (full prompt): "build me a 30s drawing style animated clip about submitting a product to AppSumo via your agent. steps are: 1. connect your agent 2. your agent fills out your listing and sets up redemption 3. go live!"
- Agency mapping: a hand-drawn process strip (Discover → Strategy → Launch) where each numbered step draws itself as it scrolls into view. The pattern is to give the style plus a numbered step list.

**10. [Slot: Service explainer illustration (SEO page)] Backlinks visualization**
- Slug: `stewchan2-369810`, by @stewchan2. — [post](https://x.com/stewchan2/status/2103542568361369810)
- tech_tags: [canvas]. prompt_partial: false.
- Excerpt (full prompt): "create an insightful, yet state of the art video visualization for how backlinks work for SEO"
- Agency mapping: an animated explainer graphic on an SEO service page (sites as nodes, links as flowing edges, authority accumulating). It is the only prompt in this half that names a digital marketing service directly.

**11. [Slot: Stat / ROI counter, milestone banner] Growth milestone launch video**
- Slug: `viktoroddy-402509`, by @viktoroddy. — [post](https://x.com/viktoroddy/status/2103802280617402509)
- tech_tags: [canvas, svg, gsap, css]. prompt_partial: false. README-highlighted.
- Excerpt (full prompt): "Create a launch video for MotionSites AI, just hit 1 million monthly visitors after 8 months after launch."
- Agency mapping: a results counter or milestone band ("+1M monthly visitors in 8 months") for client results. Pair it with wani_shola's "Use only facts and numbers that are on the site" guardrail so no figures are invented.

**12. [Slot: "About the studio" section / animated background style presets] Style-token one-liners about a studio**
- Slugs: `rneayan-441493` ("make about my studio with Risograph style"), tech_tags [canvas, svg, gsap, css] — [post](https://x.com/rneayan/status/2103401006281441493); and `rneayan-406275` ("Make Motiongraphic about my studio with Oscilloscope style"), tech_tags [canvas] — [post](https://x.com/rneayan/status/2103401461837406275).
- prompt_partial: false (both).
- Agency mapping: an "About us / studio" section or animated background that takes one style word as a preset (risograph grain and misregistration, oscilloscope phosphor traces). Shows a single style token working as the whole art direction, and it is literally about a studio.

#### Also adaptable for an agency site (not in the top 12)
- [Slot: Animated illustration / mascot, 404 or loading state] `majidmanzarpour-927543`. Its RENDERING / CHARACTER / ANIMATION / SCENE / QUALITY BAR spec skeleton and IDLE→CHARGE→CAST→RECOVER state machine are the most rigorous Canvas 2D spec in this half. — [post](https://x.com/majidmanzarpour/status/2102476258948927543)
- [Slot: Showreel with sound toggle] `prasenx-693512`: "compose the soundtrack yourself, fully synthesized in code … every cut and transition must land on the beat." — [post](https://x.com/prasenx/status/2103538744695693512)
- [Slot: Animated background with intensity parameter] `pound75423-464968`: beat-synced glitch effects with section-scaled intensity ("intro ~40%, verse 70%, chorus 100%"; my translation). — [post](https://x.com/pound75423/status/2103722556918464968)
- [Slot: Client testimonial video with kinetic captions] `sab8a-475686`: "Cut a raw talking-head clip into a punchy, fun edit with subtitles, graphics and music". tech_tags [canvas, ai-image]; README-highlighted. — [post](https://x.com/sab8a/status/2103144778481475686)
- [Slot: Parameterized brand template for any section] `polydao-566862`: "Only about [TOPIC]. Style: [BRAND COLORS], sound synced to the cuts." tech_tags [canvas, svg]; README-highlighted. — [post](https://x.com/polydao/status/2103783134206566862)
- [Slot: Preloader / splash] `modaalbuilder-868989`: "build mobile app animated splash screen creation for ...". Partial and truncated. — [post](https://x.com/modaalbuilder/status/2103053680945868989)
- [Slot: Client launch montage] The SaaS-launch template ("Go and find some SaaS … get actual assets and images … from the internet"). It delegates everything, including choosing the product, so the target must be given explicitly, as techtactician did with slideforge.io. — [moritzkremb](https://x.com/moritzkremb/status/2103066071838466494); [techtactician](https://x.com/techtactician/status/2103219463508144474)

### Inferences
- An agency component-prompt library could take the scaffold from #1 and #6 (strict palette and type tokens, locked copy, Banned list, `seek(t)` time function, closed-form springs, loop invariant, still-per-beat QA before shipping). It would then put a one-line concept (#4, #5, #8, #12) into the "governing visual rule" slot, and the client's real site or numbers (#3, #11) into the content slot.
- For live web use, the video-only steps would need replacing: Playwright subframes, MP4 export and ffmpeg tmix. A scroll-progress or requestAnimationFrame clock and `prefers-reduced-motion` fallbacks are plausible replacements. No prompt in this slice mentions reduced motion, accessibility or performance budgets beyond "stable 60fps".
- Agency-specific bans worth carrying over from #1 and #6: "Canva-deck energy", "stock 'futuristic HUD'", "Generic AI clichés", "anything that looks like a template". Agency sites compete on not looking templated.

### Gaps
- Nothing in this half directly prompts stat/ROI counters, client logo walls, testimonial carousels or case-study page transitions. These picks are adaptations, not direct evidence.
- The ranking reflects how adaptable each prompt structure is, not verified output quality. I did not watch the videos, and the corpus has no engagement data.
