# Creative Motion Prompt Kit

63 standalone prompts for creative motion graphics, animation, 3D, interactive toys and generative art, written for Claude Opus 5.5 (they work with any strong model that can write HTML/JS). Every prompt works on its own, with or without brand guidelines.

## How to use

Every prompt works on its own: copy it, paste it into Claude (Opus 5.5 on high or max effort works best), and you get a finished piece as one HTML file you can open and play.

The first line of every prompt is `BRAND: open`. Leave it as `open` and Claude invents its own look, which is where the variety comes from. Or replace `open` with your guidelines, e.g. `BRAND: Acme Studio · colours #1B1F3B, #F2E8DA, #FF5A36 · fonts Fraunces + Satoshi · logo attached`, and Claude keeps everything on-brand.

To get variety instead of the same result every time: use the Twists under each prompt, paste the Anti-repetition power-up onto any prompt, roll the Style roulette, and send the Remix prompts after any result.

Want an MP4 instead of an HTML page? Paste the Video export power-up. It works in Claude Code (which can run a browser and ffmpeg); in the Claude app you can screen-record the HTML instead.

Prompts marked "Based on" are adapted from creators who shared them during Opus 5.5's first week (linked so you can see their originals). The rest were written for this kit. None have been tested as written here, so expect to iterate.

## Power-ups

### Anti-repetition
id: variety
note: Makes Claude reject its first, most obvious idea. Paste onto any prompt for more variety.

```text
Before designing anything, list 6 completely different visual directions for this prompt (medium, palette, type,
motion language, reference era or art movement). Throw out the 3 most obvious ones, the ones any AI would pick.
Commit to the boldest remaining direction and tell me in one line which one you chose and why.
```

### ALL OUT booster
id: allout
note: The "go all out" energy from the viral prompts, plus the craft rules that separated great results from generic ones.

```text
Go all out. Treat this as the centerpiece of your showreel: if it's weak, you don't get hired.
Three extraordinary moments beat ten mediocre ones. Every frame matters, from the first to the last.
Craft rules: springs with a tiny overshoot at most; nothing linear that starts and stops; elements never all start
and stop on the same frame; when a key line lands, hold it still long enough to read. Transitions should feel
inevitable: one object becomes the next.
Banned (the giveaways of AI-made motion): centered title on a gradient, everything fading in, purple-to-blue neon,
glassmorphism, near-black with one acid-green accent, cream with terracotta, Inter/Roboto/Geist, corner labels,
frame borders, fake timecodes, fake dashboards, spinning logos, lens flares, stock AI imagery.
Before you finish, screenshot 6 key moments, critique them as a harsh creative director, and fix the 3 weakest.
```

### Brand block
id: brand
note: Replace the `BRAND: open` line with this, filled in, when you want results on-brand.

```text
BRAND: {{NAME}} — {{WHAT YOU DO, ONE LINE}}.
Colours: {{3–5 HEX CODES WITH ROLES, e.g. #1B1F3B ink, #F2E8DA paper, #FF5A36 accent}}.
Fonts: {{DISPLAY FONT}} for headlines, {{TEXT FONT}} for everything else.
Logo: {{ATTACHED / URL / "none"}} — use it as given, never redraw it.
Personality: {{3 ADJECTIVES}}. Use only facts and numbers I give you; never invent stats, clients or quotes.
```

### Video export
id: video
note: When you want an MP4. Best in Claude Code, which can run a browser and ffmpeg.

```text
Make every frame a pure function of time: expose window.seek(t) and draw from t only, with no CSS transitions,
timers or unseeded Math.random. Then render it: capture every frame at 60fps with Playwright and encode with ffmpeg
to an H.264 MP4 (yuv420p). Before the full render, make a contact sheet of one frame per second, check it for
overlapping text, dead frames and clipped edges, and fix them. If there's sound, generate it in code (Web Audio) and
sync every cut to it.
```

### Format switch
id: format
mode: append
line: Format
note: Add one line to change the canvas.
options:
- 9:16 vertical for Reels/TikTok, key content inside the centre safe zone
- 1:1 square, seamless loop
- 16:9, 1920×1080
- a live interactive web page that reacts to the cursor and scroll

## Style roulette

Pick one item from each list (or roll a 20-sided die four times) and add this line to any prompt: `Style: {{STYLE}}. Motion technique: {{TECHNIQUE}}. Mood: {{MOOD}}. Constraint: {{CONSTRAINT}}.` That's 160,000 combinations.

### Style
1. Swiss International grid
2. Bauhaus primary geometry
3. Memphis 80s
4. Japanese woodblock print
5. Risograph, 2 inks
6. Paper cut-out
7. Claymation
8. Blueprint technical drawing
9. Art Deco gold and black
10. Soviet constructivist poster
11. Botanical engraving
12. Stained glass
13. Cross-stitch embroidery
14. Chalkboard
15. Watercolour wash
16. Comic book with Ben-Day dots
17. Topographic map
18. Mid-century travel poster
19. Origami
20. Cyanotype print

### Motion technique
1. Object-driven transitions (one thing becomes the next)
2. Per-glyph spring typography
3. Mask wipes through letterforms
4. Stroke-by-stroke draw-on
5. Camera push through layered planes
6. Deep parallax
7. Particles assembling into forms
8. Scroll-scrubbed timeline
9. 12fps stop motion with line boil
10. Flocking (boids)
11. Cloth or soft-body physics
12. Liquid simulation
13. Kaleidoscope symmetry
14. Slit-scan time distortion
15. Split-screen in sync
16. Match cuts
17. Infinite zoom
18. Typewriter and teletype
19. Elastic grid distortion
20. Morph between states

### Mood
1. Calm, meditative
2. Triumphant
3. Mischievous
4. Eerie
5. Nostalgic
6. Luxurious
7. Chaotic fun
8. Tender
9. Deadpan
10. Epic
11. Cozy
12. Urgent
13. Dreamy
14. Playful
15. Film noir
16. Hopeful
17. Absurd
18. Tense
19. Elegant
20. Joyful

### Constraint
1. Only 2 colours
2. One shape only, never cut
3. No text at all
4. A 6-second seamless loop
5. One continuous shot, no cuts
6. Everything made of circles
7. Black and white plus one colour
8. Sound drives every movement
9. Must read perfectly on a phone
10. Type only, no imagery
11. Only straight lines
12. Built from exactly 100 squares
13. Perfect mirror symmetry
14. One light source
15. Told backwards
16. Every scene a different aspect ratio
17. No curves
18. 3 frames per second
19. Seen only from directly above
20. Objects shown at real-world scale

### Let Claude roll

```text
Before you start, choose one style, one motion technique, one mood and one constraint from the most unexpected
combination you can justify for this prompt. Tell me the four choices in one line, then commit to them fully.
```

## Prompts: Go-all-out one-liners

### 1. The showreel
Based on: [@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926), the prompt that started the trend (about 17K likes).

```text
BRAND: open
Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your
showreel for a résumé. Go all out. One self-contained HTML file.
```

Twists: "…like it's your showreel for a job at a Japanese type foundry / Formula 1 team / natural history museum" · "…but every shot uses a different art movement" · "…in 6 seconds, seamless loop"

### 2. Title sequence for a show that doesn't exist
Based on: [@abhinayguptha](https://x.com/abhinayguptha/status/2103565090721259981)

```text
BRAND: open
Make a 20-second main title sequence for a {{GENRE}} series that doesn't exist yet. Invent the title. Make it feel
like it won an Emmy for main title design. One self-contained HTML file.
```

Twists: Nordic noir · heist comedy · nature documentary · 70s cop show · cosmic horror · cooking competition

### 3. What it feels like to be you
Based on: [@SuryaRajendhran](https://x.com/SuryaRajendhran/status/2103122292343730437)

```text
BRAND: open
Make a 30-second animation about what it feels like to be you, using whatever techniques you like. No text
explaining it; let the motion carry the feeling. One self-contained HTML file.
```

Twists: "…to be a city at 4am" · "…to be a raindrop" · "…to be the last tab left open"

### 4. One idea, every style
Based on: [@emollick](https://x.com/emollick/status/2103688362960019567)

```text
BRAND: open
Make a fast, clever animation explaining {{TOPIC}}, where every explanation uses a radically different visual style
(at least 6 styles), and the transitions between styles are part of the joke. One self-contained HTML file.
```

Twists: recursion · compound interest · how a rumour spreads · why the sky is blue · your own product

### 5. Breaking out of the frame
Based on: [@pankajkumar_dev](https://x.com/pankajkumar_dev/status/2103502614134718609)

```text
BRAND: open
Create a motion design piece of a poster breaking out of its own frame. Go all out. One self-contained HTML file.
```

Twists: "…a word escaping its sentence" · "…a chart line escaping its graph" · "…a cartoon escaping its panel"

### 6. A machine that makes music
Based on: [@KamStudioLabs](https://x.com/KamStudioLabs/status/2102899866762440893)

```text
BRAND: open
Build a 45-second machine that plays an original piece of music, where every note comes from a visible collision.
Generate the sound in code with Web Audio. One self-contained HTML file; click to start.
```

Twists: "…a Rube Goldberg kitchen" · "…marbles on a xylophone staircase" · "…raindrops on a city of tin roofs"

### 7. A silent short film
Based on: [@KamStudioLabs](https://x.com/KamStudioLabs/status/2102908742518100086)

```text
BRAND: open
Make a 45-second silent short film with no dialogue, where sound tells half the story. Invent the story. Generate
every sound in code. One self-contained HTML file; click to start.
```

### 8. The object that refuses
Based on: [@KamStudioLabs](https://x.com/KamStudioLabs/status/2102903173161877996) ("a bug that doesn't want to be fixed")

```text
BRAND: open
Make a 60-second animated short about {{AN OBJECT}} that refuses to do its job. Give it a personality, a problem and a
surprising ending. One self-contained HTML file.
```

Twists: a loading spinner that won't stop · an umbrella afraid of rain · a cursor that wants to retire

### 9. The window
Based on: [@itsolelehmann](https://x.com/itsolelehmann/status/2103124033365762215)

```text
BRAND: open
Four seasons passing outside a train window, a cozy carriage, a cup of coffee on the table, in the style of a
symmetrical pastel film set. 20 seconds, seamless loop. One self-contained HTML file.
```

Twists: "…outside a submarine porthole" · "…from a Tokyo apartment, one day in 20 seconds" · "…from a spaceship over 1,000 years"

### 10. The loop of a life
Based on: [@loicRambo](https://x.com/loicRambo/status/2103428454355980558)

```text
BRAND: open
Make a 20-second animation about the cycle of life: the same individual going from childhood to adolescence to the
9-to-5, to family life, to old age, then cutting back seamlessly to the beginning. Go all out. One self-contained
HTML file.
```

### 11. Make them say "wow"
Based on: [@MiaAI_lab](https://x.com/MiaAI_lab/status/2103837519615774895)

```text
BRAND: open
Build me something that makes people say "wow" the second they see it. Immersive, unique, something no other model
has done before. It can be a video, a toy, a world, anything. No AI slop. Show your best. One self-contained HTML file.
```

### 12. A manifesto written entirely in code
Based on: [@advait_jayant](https://x.com/advait_jayant/status/2103565104243712107)

```text
BRAND: open
Make a 20-second motion graphics manifesto for the line "{{YOUR BELIEF IN ONE SENTENCE}}". Every frame and every
sound is written in code: no images, no video, no audio files. One self-contained HTML file; click to start.
```

### 13. Homage to a legendary ad
Based on: [@1littlecoder](https://x.com/1littlecoder/status/2103746736980378066)

```text
BRAND: open
Create a 30-second ad for {{PRODUCT}} inspired by a legendary TV commercial of your choice (tell me which). Capture its
spirit without copying it shot for shot. No border text or frames. One self-contained HTML file.
```

### 14. The most elaborate pelican on a bicycle
Based on: [@AxtonLiu](https://x.com/AxtonLiu/status/2103119648271290566), a riff on the classic AI benchmark.

```text
BRAND: open
Everyone tests models by asking for a pelican riding a bicycle. Make the most complex, detailed and beautiful animated
pelican riding a bicycle ever made. Use any technique. Take your time. One self-contained HTML file.
```

## Prompts: Kinetic typography and title sequences

### 15. Words that become architecture
Based on: [@Gdgtify](https://x.com/Gdgtify/status/2103458245213929495) ("BUILD THE FLOOR")

```text
BRAND: open
Create a 20-second kinetic typography film. Treat it as a miniature speech staged entirely through type: every line
changes the architecture of the frame, and the final line must stand on something the earlier words physically built.
Speech (exact words, exact order): {{4–6 SHORT LINES}}.
Central rule: key words have physical roles. One is a beam the next line rests on, one is a column, one is a doorway
the camera passes through, one is a floor. These roles must come from the actual letterforms, not from illustrations
behind the text. Keep letters legible while they deform.
Type: a high-contrast serif for the speech, a heavy grotesque for load-bearing words. Hold at least one 400ms moment
of absolute stillness. 1080×1080, 60fps. One self-contained HTML file using SVG and/or Canvas.
```

Twists: words become a bridge · a staircase · a boat · a bird's nest · a city skyline

### 16. Type on the beat
Based on: [@techhalla](https://x.com/techhalla/status/2103411244468498547)

```text
BRAND: open
Make a 15-second kinetic type piece for the phrase "{{PHRASE}}" cut to a 120 BPM beat (generate the beat in code).
Per-glyph springs on position and opacity; stagger each glyph by a 1/16 note (125ms). Letters scramble through seeded
random glyphs, then snap into place exactly on the beat. Each new line replaces the old one through a mask wipe that
runs through the letterforms (the outgoing line is the mask). End on a still frame held for 1 second.
One strict 3-colour palette of your choice (not black with acid green). One self-contained HTML file; click to start.
```

Twists: 90 BPM lo-fi · 174 BPM drum and bass · a waltz in 3/4

### 17. The spinning slot
Based on: [@jake11moran](https://x.com/jake11moran/status/2103237884564414633)

```text
BRAND: open
Open on a big line, "{{OPENING LINE, e.g. These days, the hard part is}}", entering word by word from the right, then
scale it down into place above a spinning list. The list rotates fast through 30 options (too fast to read, it's
texture), then decelerates and lands slowly on "{{LANDING PHRASE}}". Camera moves at half the speed you'd default to.
12 seconds. One self-contained HTML file.
```

### 18. Lyric video
Based on: [@samaote](https://x.com/samaote/status/2103510974796124569)

```text
BRAND: open
Make a dynamic lyric video for {{ATTACHED SONG, or: an original 30-second song you compose in code with Web Audio,
with lyrics you write about {{THEME}}}}. Sync every word to the vocals and beat. Each section of the song gets its own
typographic treatment (verse, pre-chorus, chorus). Make it feel like an incredible motion designer's showreel. Go
all out. One self-contained HTML file; click to start.
```

### 19. Words that act out their meaning
Written for this kit.

```text
BRAND: open
Make a 25-second kinetic type piece where 12 words each behave exactly like what they mean: FALL falls, SHY hides
behind the next word, EXPAND pushes the frame edges, ECHO repeats and fades, MELT drips, ORBIT circles the others,
and so on (choose the other 6 yourself, surprising ones). Each word hands off to the next with an object-driven
transition, so the piece never cuts. One typeface family only. One self-contained HTML file.
```

### 20. One title, six eras
Written for this kit.

```text
BRAND: open
Animate the title "{{TITLE}}" six times in a row, each as a main title sequence from a different era of design:
1920s Art Deco, 1950s Saul Bass cut-paper, 1970s disco chrome, 1980s VHS, 1990s grunge, and a 2030s style you invent.
Each era morphs into the next instead of cutting. 30 seconds. Research-accurate type and colour for each era.
One self-contained HTML file.
```

## Prompts: Logo and brand reveals

### 21. Wireframe to shards to logo
Based on: [@Mounnna](https://x.com/Mounnna/status/2103802871934497266)

```text
BRAND: open (if open, invent a brand name and a simple geometric logo first)
Create a slow-reveal logo animation. Draw the logo as a thin wireframe first, then fly in faceted low-poly shards one
by one until they assemble the logo. Finish by bringing in the app-icon background and typing out the brand name.
8 seconds, ends on a still frame held for 1.5s. Springs, no visible overshoot on the final lock. One self-contained
HTML file.
```

### 22. The logo built from its own story
Written for this kit.

```text
BRAND: open (if open, invent a brand that makes something physical, and its logo)
Make a 10-second logo reveal where the logo assembles from objects connected to what the brand does: a coffee brand's
mark forms from falling beans and a pour of steam; a bike brand's from spokes and chain links. Each object travels on
a physically plausible path, lands, and becomes one stroke or shape of the mark. Final frame: logo + name, held 1.5s.
One self-contained HTML file.
```

### 23. Flocking mosaic
Based on: [@zeezomb](https://x.com/zeezomb/status/2102906701552726206)

```text
BRAND: open
Make a 15-second square logo film in WebGL2 and plain JavaScript, no libraries, no image or font files. It looks like
a glass and gold-leaf wall mosaic whose tiles were never glued down, so they lift, flip, fly and click back into
place. The logo forms from a flock of tiles, holds, then scatters into a second shape that hints at what the brand
does, and flocks back into the logo. One self-contained HTML file.
```

Twists: tiles become paper confetti · pixels · dominoes · sugar cubes · LEGO-like bricks

### 24. Ten materials in ten seconds
Written for this kit.

```text
BRAND: open
Render the logo in 10 different materials, one per second, each transforming into the next: liquid metal, folded
paper, knitted wool, sliced fruit, chalk on a blackboard, frosted ice, stitched leather, a line of ants, bubbling
lava, and finally its true flat brand colours. Make every transition physical (it melts, unfolds, unravels) rather
than a crossfade. One self-contained HTML file.
```

### 25. The 3-second sting
Written for this kit.

```text
BRAND: open
Make a 3-second logo sting for the start of social videos, in three versions (16:9, 9:16, 1:1). One idea only, executed
perfectly: anticipation (0.5s), one decisive move (1s), settle and hold (1.5s). Add a short sound designed in code
that matches the move exactly. One self-contained HTML file with a switcher between the three versions.
```

### 26. Invent a brand and launch it
Written for this kit. Great for variety: every run is a different company.

```text
BRAND: open
Invent a fictional company that doesn't exist (pick an unexpected industry). Design its name, logo, palette and
typeface, then make its 20-second launch film: hook in the first second, three beats showing what it does, and a
logo end card. Before you start, tell me the brand in 3 lines. Go all out. One self-contained HTML file.
```

## Prompts: Abstract and generative loops

### 27. Living gradient atmosphere
Written for this kit.

```text
BRAND: open (if open, choose an unexpected 4-colour palette inspired by a real place at a specific time of day; name it)
Make a full-screen animated atmosphere in one WebGL fragment shader: soft layered fbm noise, slow drifting light, a
luminous glow near one corner deepening toward the edges. Period ~16s, seamless loop. The cursor gently bends the
flow (≤5%). No purple-to-blue neon. Cap pixel ratio at 2, pause when the tab is hidden, and fall back to a static
CSS gradient in the same colours. Add a palette switcher with 5 presets you design. One self-contained HTML file.
```

### 28. Ink flow field
Written for this kit.

```text
BRAND: open
Thousands of particles drift through a flow field, leaving ink trails like sumi-e brushstrokes on rice paper. Every
8 seconds the field quietly reorganises so the trails write a word, "{{WORD}}", hold it for a breath, then let it
dissolve back into flow. Paper texture and ink bleed made in code. Click for a new seed. One self-contained HTML file.
```

Twists: chalk on a blackboard · gold thread on navy silk · sand blown across dunes

### 29. A scene drawn only with light specks
Based on: [@ishuagra02](https://x.com/ishuagra02/status/2102920408743678129)

```text
BRAND: open
Create a stylised 3D environment of {{A BUSY PLACE, e.g. a beach boardwalk}} that adapts to the visitor's local time
of day. The art style is a particle illustration: thousands of tiny glowing specks instead of solid fills, with
flowing ribbon strokes behind moving figures to suggest motion. Slow orbiting camera; the cursor parts the specks.
One self-contained HTML file.
```

Twists: a night market · a train station at rush hour · a coral reef · a football stadium

### 30. Handmade fractal explorer
Based on: [@jrayon](https://x.com/jrayon/status/2102861376184054015)

```text
BRAND: open
Build an art project: a fractal visualiser (Mandelbrot, Julia and one more of your choice) where the fractals look
handcrafted from paper, cardboard and string, with layered cut-paper depth and soft shadows. Add cinematic
post-processing, elaborate transitions between fractals and a beautiful minimal UI. Plan it first and show me a
preview frame before coding everything. One self-contained HTML file.
```

### 31. Growth
Written for this kit.

```text
BRAND: open
Simulate something growing, for real: reaction-diffusion, a coral, lichen or a frost pattern spreading across glass
(your choice; tell me which). It starts from a single seed point and fills the frame over 30 seconds, then gently
recedes back to the seed, so it loops. Run the actual simulation on the GPU, don't fake it. Click anywhere to plant a
new seed. One self-contained HTML file.
```

### 32. Infinite poster generator
Written for this kit. Built-in variety: every click is a new design.

```text
BRAND: open
Build a generative poster machine. Each click creates a new animated A-series poster in a different design system:
Swiss grid, Bauhaus geometry, Memphis, Japanese minimalism, psychedelic 60s, brutalist, and 4 more you choose. Each
poster has a headline from a list of 20 odd, poetic phrases you write, a looping 6-second animation, and correct
typographic hierarchy for its style. Show the style name small in the corner of the UI, not on the poster. Add
"Download PNG". One self-contained HTML file.
```

## Prompts: 3D worlds and scenes

### 33. Invent a story, then animate it in 3D
Based on: [@Ryzoft](https://x.com/Ryzoft/status/2102989395359887481), [@Anilraok](https://x.com/Anilraok/status/2103087766662009118)

```text
BRAND: open (if a brand is given, the story should subtly reflect what it stands for, without an ad feel)
Imagine a short story with a character, a problem and a twist. Then, using Three.js, create the full 60-second
animation in the style of {{a 90s Saturday-morning cartoon / a stop-motion claymation / a modern animated feature}}.
All models built in code. Real camera language: establishing shot, close-ups, a reveal. Generate music and sound
effects in code. Tell me the story in 4 lines before you build. One self-contained HTML file; click to start.
```

### 34. Walk inside a painting
Based on: [@MandelDuck](https://x.com/MandelDuck/status/2103802923465768972)

```text
BRAND: open
Make a small 3D world you can walk around in (WASD + mouse, and touch controls) that is set inside {{A FAMOUS PAINTING,
e.g. The Starry Night}}, with its brushwork, palette and lighting carried into 3D. Hide 8 {{cats / clocks / birds}}
to find, with a counter and a gentle reward when you find them all. One self-contained HTML file.
```

Twists: inside a Hokusai wave · a Hopper diner at night · a Mondrian city · a Moebius desert

### 35. The diorama
Written for this kit, using tricks from [@op7418](https://x.com/op7418/status/2103724883301814408) (edge-detected outlines) and [@dreyk0o0](https://x.com/dreyk0o0/status/2103822946800165270) ("What looks least realistic? Fix it").

```text
BRAND: open
Build a tiny isometric 3D diorama of {{A PLACE, e.g. a rainy noodle shop corner at night}} in Three.js, all geometry
in code. Toon-shaded, with outlines made by edge detection on the normal and depth buffers (not scaled-up back faces).
Soft shadows, ambient occlusion, small moving details (steam, flickering sign, a cat's tail). Slow orbit; drag to
rotate. Target 60fps on an average laptop. When done, screenshot it, ask yourself "what looks least crafted?", and
fix it. Repeat twice. One self-contained HTML file.
```

### 36. Hero object, exploded
Written for this kit.

```text
BRAND: open (if a brand is given, the object is its product; otherwise invent a beautifully designed everyday object)
Model {{AN OBJECT, e.g. a pair of headphones}} procedurally in Three.js with studio lighting and a soft reflective
floor. It turns slowly on a turntable. On scroll, it explodes into its parts with labelled callouts (each label says
what the part does), then reassembles. Physically based materials, no external files. One self-contained HTML file.
```

### 37. A tiny planet
Written for this kit.

```text
BRAND: open
Create a tiny low-poly planet you can spin with the mouse: oceans, a forest, a small town, clouds that drift, a full
day-night cycle every 30 seconds with lights coming on in windows at dusk, and one surprising inhabitant. Gentle
ambient sound made in code. Click anywhere on the planet to plant a tree that grows. One self-contained HTML file.
```

### 38. A character's routine
Based on: [@chrisjdimarco](https://x.com/chrisjdimarco/status/2103232192847524106)

```text
BRAND: open
Make {{A CHARACTER, e.g. a samurai}} in pure JavaScript, performing a routine in one spot, moving through a sequence
of seriously impressive poses and motions in a {{fiery / snowy / underwater}} setting. Believable weight, anticipation
and follow-through on every move. 30 seconds, seamless loop. One self-contained HTML file.
```

## Prompts: Explainers and data stories

### 39. Step by step, empty to finished
Based on: [@Ror_Fly](https://x.com/Ror_Fly/status/2102853258582880547), [@Sarut0biSasuke](https://x.com/Sarut0biSasuke/status/2103418429248069973)

```text
BRAND: open
Make a 30-second explainer animation showing {{A PROCESS, e.g. how to make a White Russian}} from start to finish
(empty glass to finished cocktail). Show each ingredient and measurement as it goes in, with liquids that pour, layer
and mix believably. Clean labels that appear exactly when each step happens. One self-contained HTML file.
```

Twists: brewing pour-over coffee · building a sourdough loaf · assembling a bike wheel · planting a herb garden

### 40. Simulate it for real
Based on: [@AstroTheWizard](https://x.com/AstroTheWizard/status/2103629247751618782)

```text
BRAND: open
Make an animated explainer of {{A SCIENCE IDEA, e.g. how a black hole bends light}}. Wherever you can, simulate the
real thing: a random walk should be an actual random walk, orbits should follow real gravity, not drawings of them.
Include real numbers with units, and be honest about uncertainty. 45 seconds in 4 scenes, one idea per scene.
One self-contained HTML file.
```

### 41. Whiteboard explainer
Based on: [@tak3sh8](https://x.com/tak3sh8/status/2103667481139441895)

```text
BRAND: open
Make a quick hand-drawn whiteboard animation explaining {{A HARD TOPIC}} to a curious 15-year-old. A marker draws
each diagram stroke by stroke, with handwritten labels, arrows and the occasional doodle joke. Wobbly, human lines.
60 seconds. One self-contained HTML file.
```

### 42. Five-scene explainer for any business
Based on: [@alex_prompter](https://x.com/alex_prompter/status/2103499977632997524)

```text
BRAND: open (if open, invent a small business)
Adopt the role of an expert motion designer. Build a 30-second animated explainer as a single HTML page. 5 scenes:
the customer's problem, what the business does, how it works in 3 steps, one proof point, and the name at the end.
Bold text, smooth transitions. Business: {{DESCRIBE WHAT YOU SELL AND WHO IT'S FOR}}.
```

### 43. A dataset becomes a story
Written for this kit.

```text
BRAND: open
Turn this data into a 40-second animated data story: {{PASTE A CSV, or: "use public data you know well about TOPIC,
and cite the source on screen"}}. Find the single most surprising finding and build the whole piece toward it. Start
with context, then let the chart transform (bars become a line become a map) instead of cutting between charts. End on
the finding as one sentence with its number. Axes honest, units labelled. One self-contained HTML file.
```

### 44. How it works, frame by frame
Based on: [@ParkerRex](https://x.com/ParkerRex/status/2103206747846701462)

```text
BRAND: open
Explain {{A SYSTEM, e.g. how a token bucket rate limiter works / how GPS finds you}}. Canvas only, no libraries,
every frame a pure function of time, so it can be scrubbed backwards and forwards with a slider. Show the mechanism
working, not a diagram of it. 30 seconds. One self-contained HTML file.
```

## Prompts: UI and product motion

### 45. One shape, never cut
Based on: [@twoclipping](https://x.com/twoclipping/status/2103273003555402193), the open-sourced UI-morph template (about 12K likes).

```text
BRAND: open
Make a 20-second UI motion piece where one shape is never cut: a button becomes a loader, becomes a check, becomes a
dynamic island, becomes a tab bar, becomes a chart that draws itself, becomes a toast, and returns to the button.
The shape's silhouette visibly connects every state. Content enters after its container starts morphing and leaves
before the next morph, so text never overlaps. Springs everywhere, a tiny overshoot at most. The tab indicator's two
edges ride different springs so the leading edge stretches ahead. Banned: bouncy easing, particle bursts, glows,
gradients on UI chrome. Show me the list of states before you write code. One self-contained HTML file.
```

### 46. Product launch film
Based on: [@jhylee95](https://x.com/jhylee95/status/2103604431627452427), [@hqmank](https://x.com/hqmank/status/2103831140033241156)

```text
BRAND: open (if open, invent a product and its UI)
You're a world-class motion designer making a 20-second launch video for {{PRODUCT + ONE-LINE PITCH}}, as if it's the
hero video on its homepage. Hook in the first second, then distinct beats for the product's proof points. Show real
UI (rebuilt in code, not screenshots pasted flat), broken into parts that animate. Compose a track in code and land
every cut and animation hit on a beat. Go all out. One self-contained HTML file; click to start.
```

### 47. Micro-interaction playground
Written for this kit.

```text
BRAND: open
Build a playground of 8 micro-interactions, each a small masterpiece: a like button, a toggle, a copy-to-clipboard,
a password strength meter, a slider with a value bubble, a download button with progress, a tab bar, and a
pull-to-refresh. Each has a distinct but related personality, springs tuned by hand, hover, focus, pressed and
disabled states, and respects reduced-motion settings. Lay them out as a gallery. One self-contained HTML file.
```

### 48. App walkthrough in a phone
Written for this kit.

```text
BRAND: open (if open, invent an app with an unusual purpose)
Make a 25-second app walkthrough inside a realistic phone frame floating in a styled scene. Show 4 screens of the app
doing its job, with shared-element transitions between screens (a card grows into the next screen; a photo flies
into its detail view). A finger cursor taps with small press ripples. The camera drifts and pushes in on key moments.
One self-contained HTML file.
```

### 49. Five scroll sections, five ideas
Based on: [@ercankeskinx](https://x.com/ercankeskinx/status/2102995443818897906)

```text
BRAND: open
Build 5 completely different scroll-driven sections on one page. Decide the context and layout of each yourself, and
make each use a different technique: pinned storytelling, horizontal scroll, scroll-scrubbed 3D, text that assembles
on scroll, and one you invent. Smooth, no scroll-jacking, works on phones. One self-contained HTML file.
```

## Prompts: Handmade and retro looks

### 50. Paper shadow theatre
Based on: [@x4b47x](https://x.com/x4b47x/status/2103019799614034026)

```text
BRAND: open
Create a pure JavaScript animation, 30–60 seconds, vertical 9:16, in a paper cut-out shadow theatre style, with gentle
fitting audio made in code, on the topic: {{A QUESTION, e.g. What makes a place feel like home?}}. Puppets on visible
rods, a warm lamp that flickers, paper edges and slight wobble. One self-contained HTML file; click to start.
```

Twists: "Why do we keep old letters?" · "What does a city sound like at dawn?" · "What is courage?"

### 51. Whimsical collage story
Based on: [@TomAndrieu96707](https://x.com/TomAndrieu96707/status/2103411144899875264)

```text
BRAND: open (if a brand is given, tell its "about us" story)
Create a pure JavaScript animation, 30–60 seconds, in a whimsical hand-drawn collage style (torn paper, magazine
cut-outs, doodles, tape) with fitting audio made in code, telling the story of {{A STORY}}. One self-contained HTML file.
```

### 52. Risograph zine
Based on: [@rneayan](https://x.com/rneayan/status/2103401006281441493)

```text
BRAND: open
Make an animated risograph zine about {{A SUBJECT}}: 6 spreads that turn like pages. Two or three flat ink colours
only, with real riso tells: halftone dots, slight registration misalignment between ink layers, paper grain, ink
that's darker where it overlaps. Each spread has one small loop of motion. One self-contained HTML file.
```

### 53. Retro-futurist broadcast
Based on: [@johnsavage_ai](https://x.com/johnsavage_ai/status/2103792769982427263)

```text
BRAND: open
Create a 20-second retro-futuristic launch video for {{SUBJECT}}, as if broadcast on a 1980s TV in a world that
invented the internet in 1975. Film grain, CRT scanlines, slight curvature and chromatic bleed made in code. Make it
mesmerising and show off your skills as a motion designer. 16:9. One self-contained HTML file.
```

### 54. Sand animation
Based on: [@Michaelzsguo](https://x.com/Michaelzsguo/status/2102592355165782312)

```text
BRAND: open
Make a 90-second sand animation, like a live sand artist on a lightbox, that tells the story of {{A LONG STORY, e.g.
the history of flight}}. Each scene is swept, smeared and redrawn by an invisible hand into the next. Lively,
engaging and tasteful. Background music and sound design made in code. One self-contained HTML file; click to start.
```

### 55. Hand-drawn stop motion
Based on: [@_nikolajankovic](https://x.com/_nikolajankovic/status/2102867033100616097)

```text
BRAND: open
Make a hand-drawn stop-motion animation at 12 frames per second with line boil (lines redrawn slightly differently
every frame). Story: {{A CHARACTER OR PRODUCT}} explains itself in the first person, with a twist at the end.
30 seconds. One self-contained HTML file.
```

### 56. 16-bit cutscene
Written for this kit.

```text
BRAND: open
Create a 30-second 16-bit pixel art cutscene, as if from a lost 1994 adventure game: {{A SCENE, e.g. a lighthouse
keeper spotting a ship in a storm}}. Limited 32-colour palette, parallax layers, dithering for gradients, pixel-perfect
scaling, a dialogue box with typewriter text, and a chiptune soundtrack made in code. One self-contained HTML file;
click to start.
```

## Prompts: Interactive toys, games and music

### 57. The unlock moment
Based on: [@op7418](https://x.com/op7418/status/2103724883301814408)

```text
BRAND: open
Make a single-file web page that plays a full reward reveal with one click: {{A REWARD, e.g. opening a mystery box /
unlocking a rare card}}. Five phases, none optional: 1) ready: an idle float with a hint every few seconds that it's
clickable; 2) charge: building anticipation; 3) burst: the decisive reveal; 4) reveal: the prize shown off; 5) settle:
it flies to its place. The state machine must be rigorous: ignore clicks during playback, no corrupted state. Works at
phone width, respects reduced motion, 60fps, and the first load shows the full idle scene, never blank.
```

### 58. The premium badge
Based on: [@BThreeAgency](https://x.com/BThreeAgency/status/2103739079745827092)

```text
BRAND: open
Build an achievement-badge unlock screen. Design the badge yourself (or use mine). Animate it so it feels premium and
celebratory: build its scene, then celebrate. Treat the badge as a solid 3D object that tilts toward the cursor
following the rules of physics. Fast and smooth, not bouncy. Light glints across its surface as it tilts.
One self-contained HTML file.
```

### 59. Pixel-art card battler
Based on: [@aisongman](https://x.com/aisongman/status/2103763192971461057)

```text
BRAND: open
Create a 1-on-1 card game in the spirit of Hearthstone, in pixel art style. Just make it, as well as you can: 12
unique cards, a simple AI opponent, juicy card animations (draw, play, attack, damage numbers, death), and chiptune
sound effects made in code. One self-contained HTML file.
```

Twists: cards are kitchen utensils · planets · famous painters · houseplants

### 60. Cursor playground
Written for this kit.

```text
BRAND: open
Build a playground where the cursor becomes a different physical tool every time you press space, across 6 modes: a
magnet pulling iron filings, wind blowing through tall grass, a brush pushing wet paint, a torch lighting a dark room,
a finger poking jelly, and a mode you invent. Each mode has its own sound made in code. Works with touch.
One self-contained HTML file.
```

### 61. Music visualiser
Written for this kit.

```text
BRAND: open
Make an audio-reactive visualiser. Sources: the microphone (ask permission) or a built-in 60-second track you compose
in code. Split the sound into bass, mids and highs, and give each band its own visual job (bass moves the camera,
mids reshape the main form, highs spark detail). Three scenes you switch between with keys 1–3, each in a completely
different visual style. One self-contained HTML file.
```

### 62. Physics toy
Written for this kit.

```text
BRAND: open
Make a physics toy where you fling {{OBJECTS, e.g. soft rubber letters}} around a room with the mouse or finger. Make
every impact feel great: a tiny hit-stop, a little screen shake scaled to the force, a squash on contact, and a sound
made in code whose pitch depends on the object's size. Objects stack, tumble and settle believably. A reset button
rains new objects in. One self-contained HTML file.
```

### 63. The painter
Based on: [@ehsanik](https://x.com/ehsanik/status/2102885216692162993)

```text
BRAND: open
Make an animation of an invisible painter recreating {{A FAMOUS PAINTING}} from a blank canvas, stroke by stroke, with
visible brushes changing size and colour, paint that blends and builds up, and the composition emerging the way a real
painter would work (blocking in, then shapes, then detail). 60 seconds; a slider lets you scrub through the painting's
history. One self-contained HTML file.
```

## Remixes

### Three radically different versions

```text
Now make 3 radically different versions of this, each in its own file. Different medium, palette, type and motion
language every time; one of them should be a direction I would never have thought to ask for. Keep the core idea.
```

### Push it further

```text
This is a good first draft. Now make the version that wins an award. Find the single most memorable moment and make
it twice as strong. Cut anything that doesn't serve it. Add one detail that rewards watching it a second time.
```

### The harsh client
Based on: [@sachaarbonel](https://x.com/sachaarbonel/status/2103614797501673648) ("I would not hire you or pay you for this as a motion designer")

```text
Be honest: would a top studio put this in their showreel? Critique it as a harsh creative director. Score it 1–10 for
hook, originality, motion quality, pacing and polish. List the 3 weakest moments with timestamps, fix them, show me
the new scores, and repeat until every score is 8 or higher.
```

### Same idea, new medium

```text
Keep the story and timing exactly, but rebuild it in a completely different medium: {{e.g. paper cut-out / 3D
claymation / pixel art / ink on rice paper}}. Everything should look like it was physically made in that medium.
```

### Mash-up

```text
Combine prompt #{{A}} and prompt #{{B}} from my list into one piece: take the subject of the first and the visual
system of the second. Find the version where the combination makes something neither could alone.
```

### Director notes
note: Vague notes like "make it better" get random changes; specific ones get exactly what you want.

- At 0:04 the headline and the image collide. The headline should exit before the image arrives.
- Slow the opening move to 0.7x speed and hold the final frame 1 second longer.
- Hard cut here instead of a fade; push the camera in on the logo.
- The easing feels cheap. Replace every curve with springs, tiny overshoot at most, nothing linear.
- It looks AI-made. Tell me which choices are generic defaults and replace each one with something specific.

### Format remixes

- Make it a 6-second seamless loop for Instagram, 1:1.
- Recut it as 9:16 for TikTok with key content in the centre safe zone.
- Turn it into a live web page: the cursor and scroll drive the animation instead of time.
- Make a 3-second version that keeps only the best moment.
