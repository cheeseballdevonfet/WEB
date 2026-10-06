# Creative Prompt Kit

Two libraries of standalone prompts written for Claude Opus 5.5. Every prompt works on its own, with or without brand guidelines, and each library has built-in ways to get a different result every time.

- **Motion & showreels:** 63 prompts for motion graphics, animation, 3D, generative art and interactive toys.
- **Websites & UI:** 63 prompts for award-level websites, app screens and UI components. The web library is built from 57 real prompts people published with their results, the design skills and system prompts behind the best of them, and what 2025–26 award-winning sites actually do.

## What's in the kit

| File | What it's for |
| --- | --- |
| `kit.html` | Open in any browser, works offline. Switch libraries, search and filter, paste your brand once, toggle power-ups, roll a random style, and copy finished prompts in one click. |
| `PROMPTS.md` | The Motion & showreels library as plain text. |
| `WEB.md` | The Websites & UI library as plain text. |
| `prompts.json` | Both libraries as structured data, for apps, scripts, Raycast/Alfred snippets or automations. |
| `prompts.csv` | One row per prompt with a library column, ready to import into Notion, Airtable or Google Sheets. |
| `skill/creative-motion/` | A Claude Code skill for creative motion work. |
| `skill/creative-web/` | A Claude Code skill for websites and UI, which runs the brief → art direction → design system → build → screenshot-critique process. |
| `tools/` | The build script and page template. |

`PROMPTS.md` and `WEB.md` are the source files; everything else is built from them.

## Four ways to use it

1. **In the browser.** Double-click `kit.html` and pick a library tab. Type your brand in the sidebar (or leave it empty for `BRAND: open`), switch on power-ups, then hit **Copy prompt** and paste into Claude. **Surprise me** picks a random prompt and a fresh style combination.
2. **Copy and paste.** Open `PROMPTS.md` or `WEB.md`, copy any prompt, and paste it into Claude, ChatGPT or any other model.
3. **In other tools.** Import `prompts.csv` into Notion, Airtable or Sheets, or load `prompts.json` into whatever you use.
4. **As Claude Code skills.** Copy `skill/creative-motion` and `skill/creative-web` to `~/.claude/skills/` (every project) or to `.claude/skills/` inside a project. Then ask Claude Code for something like "a 15-second logo reveal for my brand, go all out" or "a landing page for my studio that could win Site of the Day".

## How the prompts work

- **The BRAND line.** Every prompt starts with `BRAND: open`. Keep it to let Claude invent a look (best for variety), or replace it with your name, colours, fonts and logo to keep results on-brand. The brand you type in `kit.html` is shared by both libraries.
- **The STACK line (web only).** Every web prompt has a `STACK:` line. The default is one self-contained HTML file. The **Stack switch** changes it to vanilla + GSAP, Next.js + Tailwind + Motion, React Three Fiber or Astro.
- **Placeholders.** Text in `{{DOUBLE BRACES}}` is yours to fill in. Leave one in and Claude will usually pick something itself.
- **Power-ups** are add-ons appended to any prompt.
  - Motion has: **ALL OUT**, **Anti-repetition**, **Video export** and a **Format switch**.
  - Web has: **Interview me first**, **Anti-repetition**, **Design system first**, **ALL OUT** (craft rules plus a dated ban list of AI-site giveaways), **Motion review switch**, **Juror critique**, **Ship-ready checks** and **Component donor**.
- **Roulette.** Each library has four lists of 20 to add to any prompt, which gives 160,000 combinations.
- **Remixes** are follow-ups to send after a result.
  - Motion has: three directions, push it further, a critique loop and director notes.
  - Web has: the art director pass, the honest six-point review, the taste critic, make it less AI, borrow a real interface's discipline, pre-ship QA with subagents, and more.

## Getting results like the ones people post

The web research found that none of the viral "one prompt" sites were really one prompt. They used a short, specific brief, a design skill, real assets, a browser so the model could screenshot its own work, and two to four rounds of fixes. The kit bakes that in:

- Start from W01 (the brief) or W09 (from sites you admire).
- Turn on Interview me first, Anti-repetition, Design system first, ALL OUT and Juror critique.
- Give Claude your real copy, photos and logo.
- Send a remix afterwards with notes like an art director's.

Use Claude Opus 5.5 on high effort for the signature moment and medium for the rest.

The ALL OUT ban list is dated October 2026, and the defaults keep moving: last year's fix (cream, italic serif, grain, mono labels) is this year's tell. When a result swaps in a new default, add it to the list in `WEB.md` and rebuild.

## Proof

`../sites/metis/index.html` in this repository is a full landing page built only by following the creative-web skill (W01 plus four component prompts and the power-ups). It went through three juror rounds, from 6.95 to 7.95 weighted, and passes the ship-ready checks. What that build found unclear in the kit has been folded back into `WEB.md` and the skill.

## Editing the kit

Edit `PROMPTS.md` or `WEB.md`, then rebuild everything else:

```bash
python3 tools/build.py
```

The script checks each library before writing `prompts.json`, `prompts.csv`, `kit.html` and the skills' copies of the prompts. It checks:

- numbering;
- a `BRAND:` line on every prompt;
- a `STACK:` line on every web prompt;
- 20 items per roulette list.

Keep the existing format:

- `## Prompts: <Category>` for categories.
- `### <number>. <Title>` for prompts.
- An optional `Based on:` line.
- One ```` ```text ```` block.
- An optional `Twists:` line, separated by ` · `.

## Credits and caveats

Prompts marked "Based on" are adapted from the creators, sites or guides linked in each entry.

- **Motion:** prompts come from posts on X during Opus 5.5's first week (22–28 September 2026), collected in the [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) list.
- **Web:** prompts come from creators' published prompts (Muzli, monokern, Voxyz, Charlie Hills, Nate Herk, Meng To and others), Anthropic's and OpenAI's design guidance, and Awwwards and Codrops write-ups of 2025–26 award-winning sites.
- **Research notes:** the full notes with every source are in `research_notes/Creative web kit research/` in this repository.

The rest of the prompts were written for this kit. None have been tested exactly as written, so expect to iterate.
