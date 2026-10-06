# Creative Motion Prompt Kit

63 standalone prompts for creative motion graphics, animation, 3D, generative art and interactive toys, written for Claude Opus 5.5. Every prompt works on its own, with or without brand guidelines, and the kit has built-in ways to get a different result every time.

## What's in the kit

| File | What it's for |
| --- | --- |
| `kit.html` | Open in any browser, works offline. Search and filter prompts, paste your brand once, toggle power-ups, roll a random style, and copy finished prompts in one click. |
| `PROMPTS.md` | Every prompt as plain text, to read or copy from anywhere. This is the source file; everything else is built from it. |
| `prompts.json` | The same content as structured data, for apps, scripts, Raycast/Alfred snippets or automations. |
| `prompts.csv` | One row per prompt, ready to import into Notion, Airtable or Google Sheets. |
| `skill/creative-motion/` | A Claude Code skill: Claude picks and runs the right prompt when you ask for creative motion work. |
| `tools/` | The build script and page template. |

## Four ways to use it

1. **In the browser.** Double-click `kit.html`. Type your brand in the sidebar (or leave it empty for `BRAND: open`), switch on any power-ups, then hit **Copy prompt** and paste into Claude. **Surprise me** picks a random prompt and a fresh style combination.
2. **Copy and paste.** Open `PROMPTS.md`, copy any prompt, and paste it into Claude, ChatGPT or any other model.
3. **In other tools.** Import `prompts.csv` into Notion, Airtable or Sheets, or load `prompts.json` into whatever you use.
4. **As a Claude Code skill.** Copy the `skill/creative-motion` folder to `~/.claude/skills/` (every project) or to `.claude/skills/` inside a project. Then just ask Claude Code for something like "a 15-second logo reveal for my brand, go all out" or "do #28 with a random style".

## How the prompts work

- **The BRAND line.** Every prompt starts with `BRAND: open`. Keep it to let Claude invent a look (best for variety), or replace it with your name, colours, fonts and logo to keep results on-brand.
- **Placeholders.** Text in `{{DOUBLE BRACES}}` is yours to fill in. Leave one in and Claude will usually pick something itself.
- **Power-ups** are add-ons you paste under any prompt: the **ALL OUT booster** (stakes and craft rules), **Anti-repetition** (makes Claude reject its first idea), **Video export** (MP4 via Playwright and ffmpeg, best in Claude Code) and a **Format switch** (9:16, 1:1, 16:9 or a live web page).
- **Style roulette** is four lists of 20 (style, motion technique, mood, constraint): 160,000 combinations to add to any prompt.
- **Remixes** are follow-ups to send after a result: three radically different versions, "push it further", a harsh critique loop, and precise director notes.

For best results, use Claude Opus 5.5 on high or max effort, and send at least one remix follow-up.

## Editing the kit

Edit `PROMPTS.md`, then rebuild everything else:

```bash
python3 tools/build.py
```

The script checks the file (numbering, a `BRAND:` line on every prompt, 20 items per roulette list) before writing `prompts.json`, `prompts.csv`, `kit.html` and the skill's copy of the prompts. Keep the existing format: `## Prompts: <Category>` for categories, `### <number>. <Title>` for prompts, an optional `Based on:` line, one ```` ```text ```` block, and an optional `Twists:` line separated by ` · `.

## Credits and caveats

Prompts marked "Based on" are adapted from creators who shared them on X during Opus 5.5's first week (22–28 September 2026), collected in the [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) list. Each links to the original post. The rest were written for this kit. None of the prompts have been tested exactly as written here, so expect to iterate.
