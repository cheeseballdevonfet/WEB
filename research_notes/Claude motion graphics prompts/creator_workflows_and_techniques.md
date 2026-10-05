# Creator workflows, tooling and prompting techniques behind "made with Claude Opus 5.5" motion graphics (state as of early October 2026)

Scope note: Claude Opus 5.5 shipped on 22 Sep 2026. Anthropic described it as "the first model in our new Claude 5.5 family", performing "at the level of Claude Fable 5.1 for most tasks" and costing "40% less to run than Opus 5" ([@claudeai launch post, 97K likes / 28M views](https://x.com/claudeai/status/2102435511222890900)). Almost all of the viral animation posts are from 22–28 Sep 2026. Engagement numbers below were read on 2026-10-05 through the fxtwitter API mirror of each X post. They are approximate and still rising. Sources that are promotional or vendor-run are labelled **[promo]**, and aggregators are labelled **[aggregator]**.

Local corpus cross-check (`/home/user/yihui-dev/awesome-opus5-5-videos`, 475 entries): the README links to Skillry with UTM tags, so it is a Skillry-maintained list **[promo]**. I used it only for name and keyword counts. The counts are in Q1 and Q3. 196 of the 475 entries are flagged `prompt_partial`.

---

## Q1. What workflows and tools do creators use, and how does code become a video?

### Takeaway
Opus 5.5 never outputs video. It writes a program, usually a deterministic `seek(t)`/`draw(t)` function in one HTML file. A headless browser (Playwright/Chromium) screenshots every frame and ffmpeg encodes the MP4. Left alone, Opus picks this zero-dependency route on its own. Remotion (React) and HyperFrames (HeyGen's HTML+GSAP renderer) are opt-in frameworks that people name explicitly in their prompts. Three.js, Canvas2D, SVG and shaders are the main drawing layers. Screen recording is the fallback when you only have the claude.ai chat app.

### Cited Findings

**Default pipeline: one HTML file, seek(t), Playwright, ffmpeg**
- "Opus 5.5 takes text and images in and puts text out. It cannot emit an MP4. Every video in this trend is a program that Opus wrote." The trick is determinism: "Opus writes a single function, draw(t) or seek(t), that paints the exact frame for any moment in time. A headless browser calls it 900 times for 15 seconds at 60 fps, screenshots each frame, and ffmpeg stitches them." — [0xMovez, "How to build motion design studio with Opus 5.5 (Full-course)", X article, 27 Sep 2026, ~7.7K likes / 1.78M views](https://x.com/0xMovez/status/2104216919033192746)
- Tommy D. Rossi (@__morse) looked at a one-shot run and found it "put all the code in a single index.html file and rendered it using playwright frame by frame in a headless window, then ffmpeg to generate the mp4. it used a seek function and eval to render each frame." He also wrote: "the model seems to prefer doing everything with zero dependencies from scratch instead of using tools like remotion, egaki, or hyperframes", and it "used [Python] to output timestamps of the beats and used them as magic numbers in the html page." His code is in a [gist](https://gist.github.com/remorses/3d467b50a0519ef7859823046dc9c427). — [@__morse, 25 Sep 2026](https://x.com/__morse/status/2103485566570369333)
- 0xMovez's summary of the same finding: Opus "skipped Remotion and HyperFrames even when available. If you want a framework, say so explicitly." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746). Ciyo says the same: "Left alone, Opus tends to pick the simplest route: one HTML file, no framework, Playwright for the screenshots, ffmpeg for the video." — [Ciyo blog, 28 Sep 2026 **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)
- Stack used in Ciyo's test: Node.js, Playwright + Chromium, ffmpeg, Python with librosa, and Claude Code on Opus 5.5. They rendered 180 frames (6 s @ 30 fps, 1080×1920) in about 9 s on a MacBook. — [Ciyo **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)
- The setup block 0xMovez published is `brew install node ffmpeg python`, `pip install numpy librosa soundfile`, `npm i -D playwright && npx playwright install chromium`, plus a `render.mjs` that takes `--fps 60 --dur 15 --sub 4` and pipes frames into ffmpeg. — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Motion blur by subframe averaging: "Render with Playwright: 4 subframes per frame, blended with ffmpeg tmix for motion blur at 60fps" ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)). @verbove's version: "render every frame in headless Chrome at 60fps, averaging 6 subframes for motion blur. Pipe into ffmpeg: H.264 + yuv420p. Export all aspect ratios in parallel" ([@verbove](https://x.com/verbove/status/2103483957266268381)).

**claude.ai chat vs Claude Code**
- "The chat app can write an animation, but only Claude Code (or any agent with a shell) can render it, listen to it and look at its own frames. That feedback loop is the whole difference between the 'mid' first try people complain about and the viral ones." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Rexan Wong: without a framework, "opus can only describe a video or hand you a rough html page you have to screen record". With one, "every frame is exact, and when you ask for a change it edits one line and re-renders instead of starting over." — [@rexan_wong, 26 Sep 2026, ~6.8K likes / 620K views](https://x.com/rexan_wong/status/2103707054108299437)
- The Skillry-maintained corpus README tells readers to paste a prompt into "Claude Code, the Claude app, or any agent running Opus 5.5" and then "Ask it to render the result as a single HTML file, then record the page if you want a video." — [awesome-opus5-5-videos README (local corpus) **[promo]**](https://skillry.dev/ai-videos/opus-5-5)
- Some posts are openly screen recordings. Tim Guignard tested HyperFrames and said "The video below is actually a screen record" ([@TimGuignard](https://x.com/TimGuignard/status/2104515756159623571)). nybobs's three.js/WebGPU physics demo reel was "recorded on an M4 Max" ([@nybobs](https://x.com/nybobs/status/2103385835328680050)). Other posts make a point of offline rendering. NathanWilbanks_'s GPU fire film: "The film isn't screen recorded. Each frame is rendered offline with scripted camera moves… One HTML file, one conversation." ([@NathanWilbanks_](https://x.com/NathanWilbanks_/status/2103881538592981110))

**Remotion (React)**
- Remotion's official Agent Skills install with `npx skills add remotion-dev/skills`. They are also offered during `bun create video` and are meant for "Claude Code, Codex, Kimi Code or Cursor". — [Remotion docs: AI skills](https://www.remotion.dev/docs/ai/skills); [remotion-dev/skills README](https://raw.githubusercontent.com/remotion-dev/skills/HEAD/README.md)
- Creator examples that name Remotion:
  - onur ozcan's 2-minute Steve Jobs film: "remotion + react + svg, ~8.7k lines … jointed character rig with a procedural walk cycle … 23 custom transitions … soundtrack synthesized in node, cuts locked to 120 bpm … 3,570 frames, rendered in under 5 min" ([@oozn](https://x.com/oozn/status/2103482545111232946)).
  - Daniel Haida's Taxtello product film: "react + remotion, 0 after effects; the soundtrack is code too, synthesized in python from sine waves and noise; 1 prompt and 2 rounds of feedback" ([@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)).
  - l3d1c's grouped_news launch ad "is a React app. It imports my site's CSS tokens and fonts, so it uses the same design system as the site … the 30s, 15s and 6s cuts in 16:9 and 9:16 are each a different list of scenes." He did voiceover and music with ElevenLabs ([@l3d1c](https://x.com/l3d1c/status/2104649028193632524)).
  - Other Remotion posts: [@wani_shola](https://x.com/wani_shola/status/2103769906638459278), [@HowDevelop (TanStack)](https://x.com/HowDevelop/status/2103840883812733090).
- 0xMovez's "route B" commands: `npx create-video@latest launch-film && npx skills add remotion-dev/skills`, then in claude `/remotion-create a 20s 9:16 launch film for [PRODUCT], springs only, one accent color`, then `npx remotion studio` and `npx remotion render Main out/launch.mp4`. He frames Remotion as "best for series, templates, data-driven videos". — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)

**HyperFrames (HeyGen, HTML + GSAP)**
- "Write HTML. Render video. Built for agents." HyperFrames is an open-source (Apache 2.0) framework that seeks each frame in headless Chrome, captures it and encodes with FFmpeg, with audio mixed separately. It enforces determinism. At fetch time it had about 57.1K stars and needed Node 22+ and FFmpeg. — [heygen-com/hyperframes GitHub](https://github.com/heygen-com/hyperframes)
- Composition rules: GSAP timelines must be created `{ paused: true }`. Elements carry `data-start`, `data-duration` and `data-track-index` and use `class="clip"`. No build step is needed. Claude Code install: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`. Other agents use `npx skills add heygen-com/hyperframes`. The CLI is `npx hyperframes init / preview / render`. — [hyperframes GitHub](https://github.com/heygen-com/hyperframes)
- Creator examples:
  - Vox's "small print" story was "rendered with hyperframes, all in one index.html. it synthesized the music in python, then went through the render second by second and polished it again" ([@Voxyz_ai, ~950 likes](https://x.com/Voxyz_ai/status/2102531681450119426)).
  - georgejimenez98: "Opus 5.5 Max + Hyperframes locally, with Fal AI for voices, music & SFX" ([post](https://x.com/georgejimenez98/status/2103214871785427173)).
  - mattworkman: "HyperFrames staging, edit - JavaScript, ThreeJS, - fal GPT Image 2.5 and Seedance 2.5" ([post](https://x.com/mattworkman/status/2104662818742309357)).
  - washow_cfo: Claude Code (Opus 5.5) / Gemini TTS / HyperFrames ([post](https://x.com/washow_cfo/status/2104595346882175311)).
  - Miguel07Code's Fourier-series explainer ([post](https://x.com/Miguel07Code/status/2103626582896091611)).
  - jake11moran made a product teaser "with @HyperFrames_ and opus 5.5 and one rambled prompt via whispr" ([post](https://x.com/jake11moran/status/2103237884564414633)).

**Three.js / WebGPU / shaders / p5.js**
- iniyanai's mechanical-keyboard explainer: "wrote the music in code, used real switch recordings as the beats, built the 3D in @threejs and timed every cut to the beat" ([@iniyanai](https://x.com/iniyanai/status/2103814603100856596)).
- nybobs built an AVBD rigid-body solver "in WebGPU with @threejs", and "Opus 5.5 even put together this whole demo reel video just from a single text prompt in Claude Code" ([@nybobs](https://x.com/nybobs/status/2103385835328680050)).
- John Heibel's ClaudeAnimationBase is a starter kit for "animating a character in p5.js and p5.brush with Claude Opus 5.5". It is based on his music video repo [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo). The kit renders through headless Chrome and ffmpeg, and "All test videos were generated with Opus 5.5 on xhigh reasoning in Claude Code." — [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase). PDoomVideo is reported at about 1.1K stars ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)) or 1,316 stars ([pasqualepillitteri.it **[aggregator]**](https://pasqualepillitteri.it/en/news/19007/opus-5-5-motion-design-video-en)).
- buildwithhanif/claude-animation-skill is a Claude Code plugin for "Hand-drawn 2D animation, written as code". It uses Node + ffmpeg, with "No browser, no GPU, no API keys", and draws on node canvas. — [GitHub](https://github.com/buildwithhanif/claude-animation-skill)
- 0xMovez: "Pleometric suggested p5.js and Opus chose to write its own paper renderer. When you give a reference, let the model pick the technique." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)

**Hybrid pipelines with generative video and audio**
- Donald's Claude Pop music video used "generate-then-trace". Seedance 2.5 renders base shots, then Opus "redraws the whole video in JavaScript on top" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)). His brief gives Claude ElevenLabs and fal ("foul" in his dictation) API keys and the Seedance 2.5 docs ([@donaldjewkes prompt](https://x.com/donaldjewkes/status/2102801469976248500)).
- Tardigrade111: Opus 5.5 "controls blender, remotion, runway and veo to make this by itself" ([post](https://x.com/Tardigrade111/status/2104620857826160686)).
- Audio approaches seen across posts:
  - Beat grids measured with numpy/librosa ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)).
  - Music synthesized in Python or Node ([@Voxyz_ai](https://x.com/Voxyz_ai/status/2102531681450119426), [@oozn](https://x.com/oozn/status/2103482545111232946)).
  - ElevenLabs voice ([@l3d1c](https://x.com/l3d1c/status/2104649028193632524)).
  - Royalty-free Mixkit tracks ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)).
  - Python plus ffmpeg only, with no browser ([@kloss_xyz](https://x.com/kloss_xyz/status/2103664956482941143)).

**Corpus cross-check (local, Skillry-derived **[promo]**)**
- Tech tags across 475 entries: canvas 336, svg 193, threejs 141, shader 100, gsap 81, css 61, audio 36.
- Keyword counts in prompt/post text: "Remotion" 62 entries, "HyperFrames" 27, "Playwright" 16, "ffmpeg" 19, "Claude Code" 21. "p5.js", "Motion Canvas" and "Lottie" each have 0.
- Categories: motion 288, interactive 70, explainer 62, 3d 55. The [Skillry page](https://skillry.dev/ai-videos/opus-5-5) shows the same category counts.

### Inferences
- The tools split into three tiers:
  1. Default: the model's own zero-dependency `seek(t)` + Playwright + ffmpeg route. It needs nothing installed beyond the renderer.
  2. Frameworks: Remotion when a creator wants React, reuse of existing design-system tokens or components, multiple cut lengths, or an existing Remotion repo (l3d1c, daniel_haida). HyperFrames when they want HTML+GSAP plus a large packaged skill library.
  3. Drawing layers inside either route: Canvas2D, SVG, Three.js/WebGPU, shaders, p5.brush.
- Lottie and Motion Canvas are essentially absent from this trend. p5.js shows up mainly through p5.brush starter kits, not in the viral prompts.
- "Render, then look at frames" needs a shell. That is why the Claude Code (or agent) workflow dominates the high-quality examples, while claude.ai chat outputs tend to be screen-recorded HTML.

### Gaps
- I could not get Anthropic-published documentation or an official blog post on Opus 5.5 animation or video workflows. The launch post has no animation details.
- No first-party data on what share of creators used claude.ai vs Claude Code vs other agents. The corpus has only 21 explicit "Claude Code" mentions, so most posts don't say.
- Arthur Katcher's "Workflow is in the comments" ([post](https://x.com/arthurkatcher/status/2104198927549604161)) could not be retrieved, because replies aren't exposed via the mirror.
- The Reddit threads themselves were not fetched. Reddit evidence below comes only through aggregators.

---

## Q2. Which skills, plugins and system prompts for motion design exist, and what do they tell the model to do?

### Takeaway
Three kinds of packaged instruction dominate:
1. Official framework skills: Remotion's `remotion-dev/skills` and HeyGen's 21-skill HyperFrames plugin. They encode determinism rules such as frame-driven animation, no CSS transitions and paused GSAP timelines, along with design-direction rules.
2. Creator-built Claude Code skills and starter kits: buildwithhanif's claude-animation, JohnHeibel's ClaudeAnimationBase/ANIMATION_GUIDE.md, charlie947's motion-graphics-skills, and 0xMovez's `motion-reel` skill template.
3. Per-project CLAUDE.md "house rules": render contract, banned looks, and a critique loop.

Anthropic's own `frontend-design` skill is a web-UI design skill, not a video skill. It does carry anti-generic and motion-restraint guidance.

### Cited Findings

**Remotion official skills**
- The skills are:
  - `/remotion-best-practices` ("encompasses all other skills")
  - `/remotion-create`
  - `/remotion-markup` (compositions, animations, layout, typography, media, effects, audio, fonts, timing)
  - `/remotion-studio`
  - `/remotion-render`
  - `/remotion-maps`
  - `/remotion-captions`
  - `/remotion-saas`
  - `/remotion-interactivity`
  - `/remotion-docs`
  - `/remotion-upgrade`
  - `/remotion-multimedia` (Mediabunny)

  Example prompts given: "/remotion-create Make a promo video for a record store", "/remotion-markup Create an animated title card using Inter." — [remotion-dev/skills README](https://raw.githubusercontent.com/remotion-dev/skills/HEAD/README.md); [Remotion docs](https://www.remotion.dev/docs/ai/skills)
- The `remotion-markup` skill tells the agent to "Drive animations using `useCurrentFrame()` and `interpolate()`", warns that "CSS `transition` or `animation` will not render correctly, they need to [be] refactored", suggests `Easing.bezier()` / `Easing.spring()`, prefers `scale`/`translate`/`rotate` CSS properties over `transform`, and names Google Fonts as "the recommended way to load fonts in Remotion". — [remotion-markup SKILL.md](https://raw.githubusercontent.com/remotion-dev/skills/HEAD/skills/remotion-markup/SKILL.md)
- Older-model note: Remotion's agent skills were circulating before Opus 5.5. A setup guide is dated May 2026 in its URL ([mer.vin, May 2026](https://mer.vin/2026/05/remotion-agent-skills-install-remotion-dev-skills-for-claude-code-and-cursor/)), which is the Opus 5 / pre-5.5 era. I did not verify which model those guides used.

**HyperFrames skills (HeyGen)**
- There are 21 skills:
  - Router: `/hyperframes`.
  - Workflows: `/product-launch-video`, `/faceless-explainer`, `/pr-to-video`, `/embedded-captions`, `/talking-head-recut`, `/motion-graphics`, `/music-to-video`, `/slideshow`, `/general-video`, `/remotion-to-hyperframes`.
  - Domain skills: `/hyperframes-core`, `-animation`, `-keyframes`, `-creative`, `/media-use`, `/hyperframes-cli`, `-audio`, `-registry`, `/figma`.
  
  Quickstart prompt: "Using `/hyperframes`, create a 10-second product intro with a fade-in title, a background video, and subtle background music." — [hyperframes GitHub](https://github.com/heygen-com/hyperframes)
- The `/motion-graphics` skill is described as "A short, design-led motion graphic where motion is the message — kinetic typography, stat count-up, chart/data-viz hit, logo sting… Usually under 10s (up to ~30s), no narration". It is "autonomous by design — at most one clarifying question" and "Asset-first: decide the asset strategy and source real material before designing the shot". Its phases are init, plan (director subagent), source, design, build (builder subagent), verify (`lint`, `check`, proof snapshots, `snapshots/contact-sheet.jpg`), approve ("render now, or what changes?") and render. — [motion-graphics SKILL.md](https://raw.githubusercontent.com/heygen-com/hyperframes/HEAD/skills/motion-graphics/SKILL.md)
- `/hyperframes-creative` says to read `house-style.md` and `video-composition.md` first. It calls skipping them "the single biggest cause of generic, web-page-looking output". Its "Lazy Defaults to Question" list, described as "AI design tells — the first thing every LLM reaches for", is:
  - gradient text
  - left-edge accent stripes
  - "Cyan-on-dark / purple-to-blue gradients / neon accents"
  - pure #000/#fff
  - identical card grids
  - "Everything centered with equal weight"
  - banned fonts
  
  — [hyperframes-creative SKILL.md](https://raw.githubusercontent.com/heygen-com/hyperframes/HEAD/skills/hyperframes-creative/SKILL.md); [house-style.md](https://raw.githubusercontent.com/heygen-com/hyperframes/HEAD/skills/hyperframes-creative/references/house-style.md)

**Anthropic `frontend-design` skill (web UI, not video)**
- It sets up a persona: "Approach this as the design lead at a design studio known for giving every client a distinct visual identity". On motion: "Use non-user-triggered motion sparingly and deliberately… A single orchestrated moment… lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated."
- It flags a Claude-specific tell: "a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent…)". It asks the model to review its plan against the brief before coding, and to "Critique your own work as you build, taking screenshots".
- Source: [anthropics/skills frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/HEAD/skills/frontend-design/SKILL.md). The same file ships as a Claude Code plugin at [anthropics/claude-code plugins/frontend-design](https://raw.githubusercontent.com/anthropics/claude-code/HEAD/plugins/frontend-design/skills/frontend-design/SKILL.md).
- I found no viral Opus 5.5 video post that credits `frontend-design`, and the corpus has 0 mentions.
- The skill's full calibration list (verbatim, verified in the SKILL.md) is introduced by "AI-generated design right now clusters around some traits":
  1. "a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent";
  2. "a near-black background with a single bright acid-green or vermilion accent";
  3. "a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns";
  4. "the SaaS-card kit: content chopped into identical rounded cards… the same soft grey shadow (rgba(0,0,0,.1))… gradient washes as decoration";
  5. "template chrome… a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots… a monospace face for small data labels; a '→' appended to link and button text."
  
  It then asks for "a compact token system… Color: describe the core base palette as 4–6 named hex values." — [frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/HEAD/skills/frontend-design/SKILL.md)

**Web and landing-page skills used by designers with Opus 5.5 (relevant to agency sites)**
- Muzli's designer guide used Claude Code with `frontend-design@claude-plugins-official` ("house style bans, taste rules"), `playground@claude-plugins-official` (a slider-based tool builder) and `make-interfaces-feel-better` by Jakub Krehel (optical alignment, interruption). It lists three environments: Claude Design (canvas-based, no code visibility), the Claude Code desktop app with a live browser via `claude --chrome`, and browser Claude. — [Muzli blog, Petras Baukys, 28 Sep 2026 **[promo: Muzli]**](https://muz.li/blog/claude-opus-5-5-for-designers/)
- Muzli's effort advice for web work: "Medium default; high for hero moments; max reserved for measured quality gains". This is more conservative than the video creators' xhigh/max advice. — [Muzli **[promo]**](https://muz.li/blog/claude-opus-5-5-for-designers/)

**Creator-built skills and starter kits**
- buildwithhanif/claude-animation-skill (MIT, Claude Code plugin): "What makes code look drawn isn't the model, it's a vocabulary of detail and a habit of looking." It provides:
  - a "detail bible" ("base → texture → edge")
  - anatomical rigs
  - a harness with `sheet`, `strip` ("12 consecutive frames around a fast action") and `verify` ("a frame must be identical rendered in or out of order")
  - a staged render that "never overwrites a good file with a failed encode"
  - synthesized SFX and music scripts
  
  Install: `claude plugin marketplace add buildwithhanif/claude-animation-skill`. — [GitHub](https://github.com/buildwithhanif/claude-animation-skill)
- JohnHeibel/ClaudeAnimationBase: ANIMATION_GUIDE.md holds the rules, "handmade, alive, one piece, no text, transitions always, something happens in every scene". The model "storyboards first, builds shot by shot, renders contact sheets to check its own work". Prompt: "Read ANIMATION_GUIDE.md, then make a 15-second video of Clawd trying to catch a butterfly." — [GitHub](https://github.com/JohnHeibel/ClaudeAnimationBase). In PDoom, "Opus wrote ANIMATION_GUIDE.md to brief the subagents it ran in parallel and STORYBOARD.md after the first generation" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- Charlie Hills's newsletter recommends `npx skills add heygen-com/hyperframes` plus "13 skill folders" from `charlie947/motion-graphics-skills` copied into `~/.claude/skills/`. — [charliehills.substack.com, 27 Sep 2026 **[promo]**, partly paywalled](https://charliehills.substack.com/p/claude-code-motion-graphics)
- 0xMovez's `motion-reel` SKILL.md template:
  - Inputs to collect first.
  - A pipeline: Playwright asset grab, then a style_guide.md from the reference, then `beats.py → beats.json`, then a shotlist "Show it and wait for OK", then `index.html with window.seek(t) using lib/motion.js springs`, then contact sheet + critique for "3 rounds minimum", then render/sfx/mix to -14 LUFS.
  - Hard rules: "Real product UI only. Never invent screens. No Math.random, no timers, no CSS transitions in render mode. Banned: corner labels, centered title on gradient, everything fading in."
  
  — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Donald's brief tells Claude to "use the skill mesh to look at the compendium of references that I've pulled, and also the skill video scoring to learn how to make JavaScript songs". These are his private skills. — [@donaldjewkes](https://x.com/donaldjewkes/status/2102801469976248500)
- 21st.dev components: Rexan Wong recommends installing @21st_dev "for high quality components in the video … instead of whatever opus invents on the spot". — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)
- Skillry sells "Premium Skills" ($9.99/mo, $79/yr, $169 lifetime) and hosts the 475-video gallery with Opus 5.5 "remakes" made "from the prompt the creator shared". — [skillry.dev **[promo]**](https://skillry.dev/ai-videos/opus-5-5)

**CLAUDE.md "house rules" (0xMovez template, verbatim excerpt)**
- "## Render contract - Every film is a pure function of time: `window.seek(t)` paints frame t. - No CSS transitions, no setTimeout, no requestAnimationFrame in render mode, no state carried between frames. Seeded noise only (mulberry32), never Math.random. - Render with `node render.mjs`, encode H.264 yuv420p, CRF 16."
- "## Look - Banned defaults: centered title on gradient, everything fading in, corner labels and frame borders, glow on UI chrome, generic particle bursts. - One display face, one UI face. One accent color… - Every 2 to 4 seconds something new must happen on screen."
- "## Sound - Score and SFX are synthesized in code unless a track is supplied. - Place hits on the measured beat grid (beats.json). Loudness -14 LUFS."
- "## Loop before you show me anything 1. Render one frame per beat as a contact sheet and LOOK at it. 2. Score it 1-10… 3. Fix the 3 worst problems. Repeat until every score is 8+. 4. Only then do the full render."
- Source: [0xMovez](https://x.com/0xMovez/status/2104216919033192746). Ciyo's version of the house rules: "No timers or unseeded random numbers; avoid 'centered title on gradient'; something new every 2-4 seconds; render contact sheet before showing final output." — [Ciyo **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)

### Inferences
- All the serious skills converge on the same two pillars. The first is a determinism contract: frame or time is the only input, with no CSS transitions, timers or unseeded randomness. The second is a visual self-review loop: contact sheets, strips and scored critique. The design-taste parts (ban-lists of "AI tells") are shared too. HyperFrames' lazy-defaults list, Anthropic's frontend-design skill and creators' CLAUDE.md ban-lists overlap heavily: centered text, gradients, neon or purple, fade-ins, numbered labels.
- Packaging a pipeline as a skill is how creators make later "one-prompt" claims true. The long brief and harness get moved into the skill.

### Gaps
- I did not read the full HyperFrames typography.md "banned fonts" list or Remotion's timing.md / transitions.md rule files.
- I could not inspect charlie947/motion-graphics-skills, which sits behind a paywall or link. I also could not inspect the contents of guanmo-ai/awesome-ai-motion.
- I found no evidence of an Anthropic-published, motion-specific skill or system prompt for Opus 5.5.

---

## Q3. Which prompting techniques do creators recommend?

### Takeaway
There are two poles, and both work:
- The 30-word "showreel for a résumé… go all out" one-liner on xhigh or max effort. It tests the engine, and 0xMovez notes it suffers "brief contagion".
- Long structured specs: XML-tagged state lists with build rules and gotchas, 10K–15K-character director's briefs with timestamped storyboards, hex palettes, named fonts, ban-lists, a "reject your own result if…" clause, and mandatory frame review.

Recurring techniques:
- Give a reference (frame, video or named style) instead of adjectives.
- Feed real brand assets.
- Ask for a storyboard or state list first, then stills, then motion.
- Specify closed-form springs and a BPM grid.
- Iterate with director-style camera notes rather than "make it better".

### Cited Findings

**The one-liner and why it works**
- Verbatim: "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out." The post says it was run "Opus 5.5 on Max effort". — [@stephanlivera, 25 Sep 2026, ~17K likes / 2.25M views](https://x.com/stephanlivera/status/2103315922098470926)
- Rob Hallam: "I didn't believe it but this was actually one-shot. Opus 5.5 on xhigh effort: [same prompt]" ([@robj3d3, ~800 likes](https://x.com/robj3d3/status/2103875898349088830)). Himanshu used the same prompt "on MAX … (sound ON)" ([@himanshutwtxs](https://x.com/himanshutwtxs/status/2103495232637882858)).
- 0xMovez's analysis of the wording:
  - "showreel for a résumé" sets a genre with known rules.
  - "what an incredible motion designer you are" makes the model the subject, so there is "No content to get wrong".
  - "15-second" is "short enough to finish in one pass and long enough for 6 to 8 shots".
  - "go all out" works as an effort multiplier on top of xhigh or max.
  
  He calls the weakness "brief contagion": "Hundreds of identical prompts produced reels that rhyme with each other… A one-liner tests the engine. It never tests the idea." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Corpus cross-check: "go all out" appears in 103 of 475 entries, "incredible motion designer" in 93, and "showreel for a r[ésumé]" in 79. — local corpus (Skillry-derived) **[promo]**

**Effort and extended thinking settings**
- "Opus 5.5 defaults to medium effort and always thinks before answering. Every viral one-shot in the list ran on xhigh or max. Use medium for small fixes and re-renders, xhigh for new films, max when the first 3 seconds have to carry a launch." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746). Ciyo gives the same ladder: xhigh for new videos, max for critical launches, medium for tweaks. — [Ciyo **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)
- John Heibel: "I've found that the reasoning level corresponds to how 'extravagant' and detail-oriented the model makes the scene. All test videos were generated with Opus 5.5 on xhigh reasoning in Claude Code." — [ClaudeAnimationBase README](https://github.com/JohnHeibel/ClaudeAnimationBase)

**Structured XML spec (state list, not vibe)**
- @twoclipping open-sourced a template with these tags: `<inputs>` (ask for 8–12 UI states, colors, a ~120 BPM royalty-free song), `<direction>`, `<structure>` ("120 BPM, 7 bars, something happens on every beat"), `<build>`, `<gotchas>` and `<start>` ("Ask me for the inputs, then show me the state list on the beat grid before you write any code"). Full text is in Q5. — [@twoclipping, 24 Sep 2026, ~12.1K likes / 1.03M views](https://x.com/twoclipping/status/2103273003555402193). 0xMovez calls it "the most-bookmarked prompt of the week (907K views, 19K bookmarks)" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- @verbove reused the structure for MakerMap. He "showed it one viral motion post and said: 'explain MakerMap, but make it insane'", and the spec used tags `<inputs>`, `<rules>`, `<structure>`, `<motion>` and `<export>`. — [@verbove](https://x.com/verbove/status/2103483957266268381)

**Long director's briefs and timestamped storyboards**
- Thariq (@trq212, described by 0xMovez as on the Claude Code team): "the post: 'Claude one-shot this' / the prompt: 10k characters with good takes plus skills, examples and API keys". — [@trq212, ~2.2K likes](https://x.com/trq212/status/2102870353781641416)
- Donald dictated a ~9,500-character brief: "I spoke to my computer for 5mins, claude worked for 12 hours". — [@donaldjewkes, ~10.9K likes / 3.9M views](https://x.com/donaldjewkes/status/2102801274173587569); [brief](https://x.com/donaldjewkes/status/2102801469976248500). 0xMovez says @pradeepXkapoor's "Pip" robot film used a 19,000-character brief ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- The skeleton 0xMovez extracts from long briefs:
  - "Film in one line"
  - References
  - "Tools & keys… 'Spend it economically.'"
  - Character bible
  - "Beat sheet. Acts with timestamps, a visual payoff every 3 to 5 seconds, a hook in the first 2"
  - Text on screen
  - "Workflow gates. Plan → rig → stills → animatic → full pass → polish → audio → render"
  - Critique loop ("until every score is 8+")
  - Deliverables
  
  — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Daniel Haida's 15.5K-character Remotion brief for Taxtello contains:
  - a persona ("You are the senior motion designer, product designer and Remotion engineer")
  - negative framing ("This is NOT a generic SaaS explainer")
  - reference mashups ("Apple product launch film × premium fintech × editorial motion design × restrained Stripe-like product presentation")
  - an exact hex palette (#0c0f1a, #e8b84b …) and named fonts (Plus Jakarta Sans, JetBrains Mono)
  - 19 numbered "CORE CREATIVE RULES"
  - a timestamped storyboard (0.00–1.20, 1.20–4.40 …)
  - a cubic-bezier spec (`cubic-bezier(0.16, 1, 0.3, 1)`, "overshoot below ~2%")
  - a "Reject your own result if it feels like" list
  
  — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- wani_shola's Remotion prompt includes "three colours and the site's own fonts, one idea per shot… eased motion only… Add music at about 120 BPM… cut every scene on the beat." — [@wani_shola](https://x.com/wani_shola/status/2103769906638459278)

**References: name a look, feed a frame**
- Rexan Wong: "naming a style works way better than describing one. Without a reference, opus falls back to its default look: centered text, gradient background, everything fading in". He suggests getting reference videos from whatships.com. — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)
- 0xMovez's reference prompt (verbatim excerpt): "Extract one frame every 0.5s with ffmpeg. Study them. Write ./docs/style_guide.md: palette (hex), type (family, weight, tracking), shot lengths, transition types, camera moves, texture/grain… Take the grammar of the reference, never its content, logos or characters. Show me both files. Wait for my OK before any code." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Pleometric's TikTok-feed piece "started from a single frame of another viral animation" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746); [@pleometric](https://x.com/pleometric/status/2102572941699354900)). Donald's brief points Claude at his own reference folder and at a GitHub repo of prior work ([@donaldjewkes](https://x.com/donaldjewkes/status/2102801469976248500)).

**Real brand assets instead of invented UI**
- Tony Dinh's TypingMind reel: "Just 1 year ago, I paid ~$1,000+ for a video like this. Now I made this with Opus 5.5 in less than 30 minutes" ([@tdinh_me](https://x.com/tdinh_me/status/2103703135902740699)). 0xMovez says three extra lines did it: the product URL, "use actual product screenshot, logo, assets", and "must have music" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- Rexan Wong: "dump all of it into opus: your brand (logo, colors, fonts), screenshots of your real product, the reference video, and a quick braindump … then ask for 3 storyboard variants… ask for one still frame per scene before anything moves. fixing a storyboard is way cheaper than fixing a render." — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)
- 0xMovez's brand prompt (verbatim excerpt): "Visit the site. Use real screenshots (Playwright), the real logo, real colors and fonts. Save everything to ./assets and list what you found before you animate. Never redraw the product UI from imagination." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)

**Negative constraints and ban-lists**
- twoclipping: "Banned: bouncy easing, particle bursts, glows, gradients on UI chrome, mismatched icon strokes, dead time, anything that looks like a template." — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193)
- The anti-slop variant 0xMovez attributes to @1littlecoder: "Avoid frames and text in the corners, the usual giveaways of AI-made video." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Everleigh's "six-part spec" is Format, Content (copy "in quotation marks, exactly as it should render"), Structure ("Assign the last frame a job and a duration"), Look (named reference + hex palette + typeface), Motion, and Avoid (named defaults). He reports that minimal prompts (~26 words median) got a median of 3 likes, versus 34 for personalized ones. — [dev.to, Jonathan Everleigh, 4 Oct 2026 **[promo: opus6.video]**](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)

**Motion vocabulary: springs and beat grids**
- "Springs are closed-form step responses. A value that changes target many times is the sum of one spring per change, so it stays a pure function of time." — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193)
- 0xMovez's spring "presets": "Snappy UI: buttons, toggles, leading edges / Default: cards, containers, camera / Heavy: big type, 3D objects, logo lockups / Playful: mascots, stickers (visible overshoot)". He publishes a `track(t, keys, k=170, d=26)` helper. — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Cutting on a beat grid is near-universal:
  - 120 BPM is the default tempo ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193), [@oozn](https://x.com/oozn/status/2103482545111232946), [@l3d1c](https://x.com/l3d1c/status/2104649028193632524), [@wani_shola](https://x.com/wani_shola/status/2103769906638459278)).
  - "Every cut lands on a 120 BPM grid, which made the music easy to line up" ([@l3d1c](https://x.com/l3d1c/status/2104649028193632524)).
  - Corpus cross-check: "BPM" appears in 22 entries.

**Other variants**
- Story instead of techniques (attributed to @sonnylazuardi): "use your showreel energy, but tell a story: the history of [TOPIC]… surprise me with the storyboard. 45 seconds, vertical 9:16."
- Agency persona: "make a 30-second showreel as if you were a niche branding studio for startup founders… One accent color. Every shot is a different technique."
- Sound bar (attributed to @kloss_xyz): "S-tier sound design, no generic synth pads. Compose an original piano score and sync every cut to it."
- All three from [0xMovez](https://x.com/0xMovez/status/2104216919033192746).

**Gating, subagents and long autonomous runs**
- From the 0xMovez director template:
  - "Treat this as a multi-session production. Don't rush to a final render."
  - "Show me the shot list. Then continue without waiting if I don't answer in 10 minutes."
  - "Animatic at 960x540 with placeholder audio. Fix pacing before polish."
  - "Split work across subagents per chapter. Write docs/ANIMATION_GUIDE.md first so every subagent codes in the same style."
  
  — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Donald's brief grants budget and autonomy: "I have a Claude Max plan with 100% available usage. I want you to spend all of the usage… pushing tokens aggressively, but also economically". It ends with "make no mistakes." — [@donaldjewkes](https://x.com/donaldjewkes/status/2102801469976248500)

### Inferences
- Engagement shows both poles can go viral. The one-liner reached 17K likes and 2.25M views. The XML spec got 12K likes, roughly 1M views and about 19K bookmarks. Bookmark-heavy engagement on the spec suggests creators see it as reusable craft.
- The techniques that recur in independent sources are:
  1. Reference over adjectives.
  2. Real assets, never invented UI.
  3. Plan artifacts (state list, storyboard, stills, animatic) before motion.
  4. Closed-form springs plus a BPM grid.
  5. Explicit ban-lists.
  6. xhigh or max effort for new pieces.
- "Make it 10x better"-style escalation prompts are not a documented technique among the high-engagement sources. Creators instead advise specific director notes (see Q4).

### Gaps
- I did not verify against Anthropic documentation the claim that Opus 5.5's default effort is "medium" or the exact effort-level names. It is reported by 0xMovez and Ciyo only.
- I found no controlled comparison of long vs short prompts other than Everleigh's like-count stat, which comes from a vendor and covers small samples.
- I found no evidence that "make it 10x better" follow-ups are common or effective for Opus 5.5 video.

---

## Q4. What failure modes do creators report, and how do they fix them?

### Takeaway
The most-reported failure is the generic "AI look": centered text on a gradient, everything fading in, a logo at the end, corner labels, invented or fake UI, and "blah" text design. Other recurring problems:
- Text overlap during morphs or swaps.
- Clipped or overflowing layouts.
- Blurry text under camera scaling.
- Loop-seam stutters.
- Non-determinism from CSS transitions or timers.
- Slow renders for GPU-heavy looks.
- Inflated "one-shot" claims that hide hours of iteration and sizeable token costs.

The fixes are:
- Determinism rules (pure `seek(t)`).
- Contact-sheet, strip and phone-size self-critique with scored rubrics.
- Specific timestamped or camera-language notes.
- Prompts that refactor to springs.
- Supplying real assets and exact copy.

### Cited Findings

**Generic "AI look"**
- "Most people who try motion design with Opus 5.5 end up with the same video: centered text on a gradient, everything fading in, a logo at the end. They don't give it a reference, don't give it a render engine, don't ask it to look at its own frames." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Rexan Wong: "my one prompt video looked mid … without [real components], opus draws your product UI from scratch and it looks off. wrong spacing, placeholder boxes, fake-looking buttons … the whole video reads as cheap." — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)
- washow_cfo (Japanese) says Claude Code videos are trending "but there's an AI smell (AI臭さ)", so he aimed for a "stylish" look seen elsewhere ([post](https://x.com/washow_cfo/status/2104595346882175311)). mattworkman: "very blah text design, I need a fal design skill/guideline ideally" ([post](https://x.com/mattworkman/status/2104662818742309357)). Tim Guignard: "the result is ok. Not crazy, but with a few more indications and a clear direction, it would probably get much nicer" ([post](https://x.com/TimGuignard/status/2104515756159623571)).
- Fixes:
  - A reference video or frame ([@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)).
  - Ban-lists in CLAUDE.md ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
  - A self-rejection clause, "Reject your own result if it feels like: a SaaS template • a PowerPoint animation • a website screen recording • a generic Remotion demo • a crypto advertisement • an AI-generated promo template • five screenshots sliding around" ([@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)).
  - Skill-level lazy-default lists ([HyperFrames house-style.md](https://raw.githubusercontent.com/heygen-com/hyperframes/HEAD/skills/hyperframes-creative/references/house-style.md)).

**Invented content and UI**
- In Everleigh's first test run the model invented an app name, "Verdant", and a spring-2026 date. The fix was to supply exact copy in quotation marks. — [dev.to **[promo]**](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)
- Creators guard against this in their prompts: "Do not invent screens. Do not invent metrics that imply real customer data" ([@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)); "Real UI. Real data. No placeholders." ([@verbove](https://x.com/verbove/status/2103483957266268381)); "Never redraw the product UI from imagination. Crop and animate the real thing." ([0xMovez](https://x.com/0xMovez/status/2104216919033192746))

**Text overlap, clipping and blurry text**
- twoclipping's `<gotchas>`: "Never put will-change on anything the camera scales or the text renders blurry. Text that swaps inside a morphing container needs its own enter and exit timing or it overlaps." — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193). Verbove's fix rule: "Content enters after its container starts morphing and leaves before the next morph so text never overlaps." — [@verbove](https://x.com/verbove/status/2103483957266268381)
- In Ciyo's test, the first render had "steam overlapping headlines, static opening frame, unreadable button text". One prompt iteration with visual feedback (a contact sheet) fixed all three. — [Ciyo **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)
- Everleigh saw "Wordmark clipped at 3.4s; plant overlapped text at 13.5s". The fix was a "Timestamp-specific edit with expected outcome". — [dev.to **[promo]**](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)
- Safe zones: "Captions are measured in the real font and shrink to fit the 9:16 safe zone, so nothing hides under TikTok's buttons." — [@l3d1c](https://x.com/l3d1c/status/2104649028193632524)

**Loop seams and timing**
- "Make the last frame identical to the first, cursor position and speed included, or the loop stutters." — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193)
- Non-deterministic timing is designed out rather than fixed afterwards. The rules used are "no CSS transitions, no timers, no state carried between frames" ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)) and Remotion's "CSS `transition` or `animation` will not render correctly" ([remotion-markup SKILL.md](https://raw.githubusercontent.com/remotion-dev/skills/HEAD/skills/remotion-markup/SKILL.md)). 0xMovez adds a determinism check: "frame 300 rendered twice must hash the same" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- Audio sync: "Analyze the song with numpy for the beat grid and start on a downbeat. Place every UI sound by its measured peak." — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193). An older variant of his prompt says to "Calibrate the grid to the real kick hits" (corpus entry; [@twoclipping earlier post](https://x.com/twoclipping/status/2102554209166000267), not fetched directly).
- Tommy Rossi saw beat timestamps hard-coded as "magic numbers" and described the output as "spaghetti code with magic numbers… if things continue to go this way, humans can't look at the code anymore." — [@__morse](https://x.com/__morse/status/2103485566570369333)

**Janky or cheap easing**
- Fix prompts:
  - "Switch all the motion to time-based springs, with a little bounce on buttons and cards and none on headlines" ([Ciyo **[promo]**](https://ciyo.ai/blog/opus-5-5-video-motion-graphics-guide)).
  - "Replace every easing curve with closed-form springs from lib/motion.js. Tiny overshoot on UI, none on type. Any value with more than one target uses track()." 0xMovez says "Opus refactors the whole file in one pass." ([0xMovez](https://x.com/0xMovez/status/2104216919033192746))
- Daniel Haida's rules: "No linear movement", "Elements should not all start and stop at exactly the same frame", "No bouncing UI", "Avoid cartoon springiness". — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

**Visual self-critique loop (the main fix)**
- Verbatim critique prompt: "Open out/contact.png, out/strip.png and out/phone.png and look at them properly. Be a harsh motion director, not a proud author. Score 1-10: hook in first 2s · readability at phone size · motion quality (springs, no dead frames) · variety (new thing every 2-4s) · composition · brand accuracy · sound sync. List the 3 biggest problems with timestamps. Hunt specifically for: text overlapping during swaps, anything sliding instead of easing, corner labels and frame borders, centered-on-gradient shots, blurry scaled text, a dead beat with nothing happening, a stutter at the loop seam. Fix them, re-render only the affected seconds, show me the new contact sheet and new scores." — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- ffmpeg commands used for review:
  - contact sheet `fps=2,scale=270:-1,tile=6x5`
  - a 12-frame strip around fast action
  - a 360-px "phone test"
  - a `-stream_loop 1` loop check
  
  — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)
- Daniel Haida's prompt requires rendering frames at 0.0, 1.0, 2.5 … 14.8 s and saying "VISUALLY INSPECT THOSE IMAGES… Inspect multiple exact decoded frames from the final MP4, not only browser screenshots… Do not declare success because the code compiles. The deliverable is the FILM." — [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)
- l3d1c: "I didn't review it by watching renders. It rendered about 20 stills and tiled them into one contact sheet… My part was saying what felt wrong." — [@l3d1c](https://x.com/l3d1c/status/2104649028193632524)
- NathanWilbanks_'s fire film used vision-model grading: "render a frame, have a vision model pick it apart like a VFX supervisor, fix it, repeat. It caught a flame that kept dying, ring shaped artifacts on the ground, and coals that looked like cheese chips". He reports about 40 self-critiques. — [@NathanWilbanks_](https://x.com/NathanWilbanks_/status/2103881538592981110)

**Vague follow-ups**
- "give notes like a director: 'slow every zoom to 0.7x', 'hard cut here', 'push in on the button' … the first render is usually 80% there… vague notes like 'make it better' get random changes. camera words get exactly the change you want." — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)
- Charlie Hills's edit examples: "Slow down the second scene," "Swap the text," "Make the orange navy". — [charliehills.substack.com **[promo]**](https://charliehills.substack.com/p/claude-code-motion-graphics)

**Performance and render environment**
- p5.brush watercolour fills make renders "measured in seconds per frame" without a dedicated GPU. The advice is to ask the model to avoid those fills on integrated graphics. Linux needs `--no-sandbox`, `--soft-gl` for software WebGL, or `--gpu-angle=gl-egl` on NVIDIA cloud nodes. — [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
- Reported render times:
  - 3,570 frames "rendered in under 5 min" ([@oozn](https://x.com/oozn/status/2103482545111232946))
  - "12-minute render on a laptop" for a 45 s watercolour short ([@mablesjoseph](https://x.com/mablesjoseph/status/2103465246014746943))
  - the ant-colony example "Renders in ~27 s" ([buildwithhanif](https://github.com/buildwithhanif/claude-animation-skill))
- Runtime bug: "Script declared same variable twice, preview hung". Reporting the error fixed it in one message in ~40 s. — [dev.to **[promo]**](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)

**Fonts**
- Remotion's skill points agents to its Google Fonts and local-font loading docs ([remotion-markup SKILL.md](https://raw.githubusercontent.com/remotion-dev/skills/HEAD/skills/remotion-markup/SKILL.md)). opus6.video restricts fonts to Google Fonts and public CDNs ([dev.to **[promo]**](https://dev.to/jonathaneverleigh/opus-55-video-prompts-a-six-part-spec-that-gets-past-the-default-look-4ll3)). Creators name a single font explicitly, e.g. "one clean UI font (Geist)" ([@twoclipping](https://x.com/twoclipping/status/2103273003555402193)), or import their site's fonts ([@l3d1c](https://x.com/l3d1c/status/2104649028193632524)).

**Inflated "one-shot" claims, cost and time**
- Mable Joseph: "Does Opus 5.5 absolutely cook in one shot, not really? It's good but still needs a good supporting project." Her numbers: "62.7M tokens (96% cache reads) • 163 model calls • ~$34 at API list price • ~6¾ hrs start to finish, ~1½ hrs of it hands-on". — [@mablesjoseph](https://x.com/mablesjoseph/status/2103465246014746943)
- Donald's run took 12 hours ([@donaldjewkes](https://x.com/donaldjewkes/status/2102801274173587569)). Thariq's caveat about 10K-character prompts is in Q3 ([@trq212](https://x.com/trq212/status/2102870353781641416)).
- Latent Space's AINews summary of Reddit:
  - Autonomous Claude Code explainer pipelines cost about $3–4 per video on OpenRouter and take 1.5–2 hours per 30–60 s video, with "only minor manual corrections needed".
  - An 8-hour interactive island project cost about $1,874 in tokens (59% of a Max weekly allowance). That one is interactive, not a video.
  
  — [Latent Space AINews, ~24–30 Sep 2026 **[aggregator]**](https://www.latent.space/p/ainews-opus-55-is-good-at-explainer)
- An r/buildinpublic "visualOS" film was "one prompt and roughly 20 minutes of waiting", with access to a repository and a press folder, at Max effort, "zero adjustments". — [mubbits.com **[aggregator]**](https://mubbits.com/blog/claude-opus-5-5-motion-graphics)
- Mubbits also notes that "one-shot" can include many autonomous tool calls, renders and corrections inside the agent's run. — [mubbits.com **[aggregator]**](https://mubbits.com/blog/claude-opus-5-5-motion-graphics)

### Inferences
- Most "fixes" are preventive. They live in CLAUDE.md, skills or the spec, and are not reactive follow-up prompts. The single biggest quality lever creators report is letting the agent see its own frames through contact sheets and strips. This is why Claude Code or agent setups outperform chat-only use.
- "One prompt" usually means one human message plus a long autonomous agent run, frequently with prior scaffolding: skills, repos, reference folders and API keys.

### Gaps
- I found no specific, sourced reports of web fonts failing to load in headless renders for Opus 5.5. Font handling shows up only as preventive guidance.
- There is little quantitative data on frame-rate or performance problems in live (screen-recorded) HTML pieces, and no Hacker News thread was located.
- Ciyo and Everleigh are vendor blogs, so their test anecdotes are unaudited.

---

## Q5. Verbatim high-engagement example prompts (author, URL, engagement)

### Takeaway
The canonical prompts fall into four groups:
1. Stephan Livera's résumé-showreel one-liner, about 17K likes, the most copied.
2. @twoclipping's open-sourced XML UI-morph template, about 12K likes and 19K bookmarks.
3. Donald's ~9,500-character dictated music-video brief, about 10.9K likes on the video.
4. Long brand briefs (Daniel Haida's Remotion Taxtello prompt), compact Remotion prompts (wani_shola) and how-to threads (Rexan Wong, 0xMovez).

### Cited Findings

**1. Stephan Livera** — about 17K likes and 2.25M views, posted 25 Sep 2026. Run on Max effort. Copies by Rob Hallam (xhigh) and Himanshu are linked in Q3. — [@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926)
> "make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out."

**2. @twoclipping ("zero")** — about 12.1K likes and 1.03M views, posted 24 Sep 2026. Full template, verbatim. — [@twoclipping](https://x.com/twoclipping/status/2103273003555402193)
> `<inputs>` Ask me for: 8 to 12 UI states I want the shape to become (e.g. button, loader, player, slider, toggle, tabs, chart, command palette, toast), pure black and white or one accent color, and a royalty-free song around 120 BPM (e.g. Mixkit, free for commercial use). `</inputs>`
> `<direction>` Dribbble-level UI motion. One shape, never cut: every state is the same element morphing its size, radius and color while its content swaps with a short blur. A cursor drives every change with real clicks and drags. Light warm-gray canvas, black and white components, one clean UI font (Geist). Springs everywhere, a tiny overshoot at most. The camera zooms so each state fills the frame. The last frame is the first frame, so it loops. Banned: bouncy easing, particle bursts, glows, gradients on UI chrome, mismatched icon strokes, dead time, anything that looks like a template. `</direction>`
> `<structure>` 120 BPM, 7 bars, something happens on every beat. Button → loader → check → dynamic island → music player with a play/pause morph → scrub the progress bar → it becomes a volume slider that stretches when dragged past max → a toggle flips on the beat → the knob becomes a liquid tab indicator → the tabs open into a chart that draws itself, with a tooltip on hover → it collapses into ⌘K → type to filter → enter → toast → back to the button. `</structure>`
> `<build>` 1. One HTML file, square 1440x1440. Every style is computed from time inside seek(t): no CSS transitions, no timers, no state carried between frames. 2. Springs are closed-form step responses. A value that changes target many times is the sum of one spring per change, so it stays a pure function of time. 3. The tab indicator's two edges ride different springs, so the leading edge stretches ahead of the trailing one. Same trick for the toggle knob. 4. Drags are direct manipulation: while the cursor is held, the value is computed from its position. On release it springs back from wherever it was. 5. Analyze the song with numpy for the beat grid and start on a downbeat. Place every UI sound by its measured peak. 6. Render with Playwright: 4 subframes per frame, blended with ffmpeg tmix for motion blur at 60fps. 7. Render one frame per beat before the full render. Fix anything off the grid, cramped or hard to read. `</build>`
> `<gotchas>` Never put will-change on anything the camera scales or the text renders blurry. Text that swaps inside a morphing container needs its own enter and exit timing or it overlaps. Make the last frame identical to the first, cursor position and speed included, or the loop stutters. `</gotchas>`
> `<start>` Ask me for the inputs, then show me the state list on the beat grid before you write any code. `</start>`

**3. Donald (@donaldjewkes), "Claude Pop" music video** — the video post has about 10.9K likes and 3.9M views; the prompt reply has about 2.3K likes. The dictated brief is ~9,600 characters. Excerpts:
> "I want you to independently do an end-to-end complete pass on making an updated version of this video. Use the exact same audio track and think and feel very deeply about what is the best way to visually represent all of the lyrics on screen… beautifully rendered JavaScript animations with a papery feel… You can use the ElevenLabs API to do sound design… I don't want you to produce something that is GPT slop… use your visual reasoning skills and your ability to build animations in JavaScript, and then reconstruct the video from scratch as sort of an overlay… You're going to want to watch the entire video multiple times, take screenshots at individual parts, and think about if something is really up to the bar of quality… here's the source code for the JS animation video: https://github.com/JohnHeibel/PDoomVideo … make no mistakes."

Sources: [video post](https://x.com/donaldjewkes/status/2102801274173587569); [prompt](https://x.com/donaldjewkes/status/2102801469976248500)

**4. Rexan Wong, reverse-engineered workflow thread** — about 6.8K likes and 620K views, posted 26 Sep 2026. The steps are:
1. Get references from whatships.com.
2. Install HyperFrames or Remotion.
3. Install 21st.dev components.
4. Dump brand, screenshots, reference and braindump, and ask for 3 storyboard variants.
5. Ask for one still per scene.
6. "let claude cook" and give director notes.

Full quotes are in Q3 and Q4. — [@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437)

**5. 0xMovez, "How to build motion design studio with Opus 5.5 (Full-course)"** — X article, about 7.7K likes and 1.78M views, posted 27 Sep 2026. It is a compiled guide, not a single creator's prompt. It contains the CLAUDE.md house rules, the brand prompt, the reference prompt, the XML product-film spec, the director's-brief template, the critique prompt and the `motion-reel` SKILL.md (all quoted above). It also gives a repo list: PDoomVideo, ClaudeAnimationBase, buildwithhanif/claude-animation-skill, heygen-com/hyperframes, the Remotion skills, WinterArc21/Battle-of-Austerlitz-Film, guanmo-ai/awesome-ai-motion and athemeroy/awesome-opus-5-5-videos. It links to the author's Substack, so it is partly self-promotional. — [0xMovez](https://x.com/0xMovez/status/2104216919033192746)

**6. Daniel Haida, Taxtello Remotion product film** — 10 likes and about 3.5K views, so low engagement, but it is the most complete Remotion brief found (15,583 characters). Opening:
> "You are the senior motion designer, product designer and Remotion engineer for Taxtello. Your task is to create a genuinely premium, Apple-level product film for Taxtello. This is NOT a generic SaaS explainer. This is NOT a feature walkthrough. This is NOT a startup template animation… Think: Apple product launch film × premium fintech × editorial motion design × restrained Stripe-like product presentation × Taxtello's own visual identity."

Closing:
> "Go all out creatively, but exercise ruthless restraint. Make Taxtello look expensive."

Source: [@daniel_haida](https://x.com/daniel_haida/status/2104139720829636937)

**7. @verbove, MakerMap** — 227 likes and about 17K views. Spoken prompt: "explain MakerMap, but make it insane". The structured version has `<rules>`: "One HTML file. One canvas. One draw(t) function. No CSS transitions. No timers. No state carried between frames. One shape, never cut… Real UI. Real data. No placeholders." Its `<export>`: "First render one frame per beat as a contact sheet. Fix anything cramped or broken. Then render every frame in headless Chrome at 60fps, averaging 6 subframes for motion blur." — [@verbove](https://x.com/verbove/status/2103483957266268381)

**8. wani_shola, Remotion portfolio showreel** — 6 likes, verbatim:
> "Make a showreel-style motion graphics video for my portfolio website, http://sholajegede.com, using Remotion. It should show what I do as a developer relations engineer, like a showreel for my résumé. - Use as much of the real website as possible: capture the pages and sections in a browser (home, Ask, package pages, Hire, mobile view, dark mode) and animate them inside browser and phone frames. - Show the site's chat answering real questions about my work, with the questions and answers large and bold. Use only facts and numbers that are on the site. - Follow premium brand rules: three colours and the site's own fonts, one idea per shot, key objects centred, space to breathe, eased motion only, smooth transitions instead of hard cuts, and a rhythm that speeds up and slows down with the story. - Add music at about 120 BPM (elite, kinetic, sophisticated) and cut every scene on the beat. No extra sound effects. - 1920×1080, about 90 to 100 seconds, ending on the website and my contact email."

Source: [@wani_shola](https://x.com/wani_shola/status/2103769906638459278)

**9. @kloss_xyz, Python + ffmpeg** — 54 likes, verbatim:
> "Use Python to generate a 9:16 chaotic brain rot video with excellent motion + sound design and render it using ffmpeg. Put your own personal spin on it so it's aligned with Anthropic's new launch. Also fully express what it's like to be a very creative LLM used by me every day from your POV to give it some extra personality."

Source: [@kloss_xyz](https://x.com/kloss_xyz/status/2103664956482941143)

**10. Starter-kit and framework one-liners**
- "Read ANIMATION_GUIDE.md, then make a 15-second video of Clawd trying to catch a butterfly." — [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
- "Using /hyperframes, create a 10-second product intro with a fade-in title, a background video, and subtle background music." — [HyperFrames](https://github.com/heygen-com/hyperframes)
- "/remotion-create Make a promo video for a record store" — [Remotion](https://www.remotion.dev/docs/ai/skills)

**Other high-engagement videos without a published prompt in the post**
- Drew, "Made with @claudeai Opus 5.5": about 9.8K likes and 1.8M views on launch day ([@devteamdrew](https://x.com/devteamdrew/status/2102436464323661880)). 0xMovez describes it as having "visible cleanup rounds" ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- achxvi, "Opus 5.5 did this in 15 minutes": about 9K likes and 1.1M views ([@achxvi](https://x.com/achxvi/status/2103918792845963545)). Per 0xMovez, his Pocketsflow version used an ElevenLabs key and a talking mascot, and he now sells this as a service ([0xMovez](https://x.com/0xMovez/status/2104216919033192746)).
- Pleometric's TikTok-feed animation: about 3.8K likes ([@pleometric](https://x.com/pleometric/status/2102572941699354900)). His re-run of Donald's workflow: about 5K likes ([@pleometric](https://x.com/pleometric/status/2103082510607610023)).
- NFT_Chen: Opus "wrote a cartoon video editing software and then edited inside it", about 1.5K likes ([@NFT_Chen](https://x.com/NFT_Chen/status/2102681172367323300)).

### Inferences
- The most-copied prompt is also the least specific. The most-bookmarked and most-discussed "how" content is all structured and harness-heavy: twoclipping, Rexan Wong, 0xMovez, Donald.
- Remotion-based prompts tend to be brand or product films that reuse a codebase's tokens. HyperFrames posts lean to explainers and teasers. The zero-dependency HTML route dominates the showreel genre.

### Gaps
- Several viral posts (Drew, achxvi, Tony Dinh) put their prompts in replies or comments, which I could not retrieve. Their exact prompt text is unverified here.
- I could not capture YouTube tutorial descriptions or verbatim Reddit thread prompts.
- Engagement figures are a point-in-time snapshot (2026-10-05) from a third-party X mirror (fxtwitter), not from X directly.
