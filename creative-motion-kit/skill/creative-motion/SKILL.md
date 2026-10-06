---
name: creative-motion
description: Make striking creative motion pieces as self-contained HTML using a library of 63 proven prompts — motion graphics videos, showreels, kinetic typography, title sequences, logo reveals, generative and shader loops, Three.js scenes, animated explainers, UI motion, retro and handmade looks, interactive toys and music visualisers. Use when the user asks for any of these, says "go all out", wants a creative animation with or without brand guidelines, or wants more variety than the usual result.
---

# Creative motion

`PROMPTS.md` (next to this file) holds the kit: 63 numbered prompts in 9 categories, plus power-ups, a style roulette and remix follow-ups. Treat each prompt as a creative brief to execute, not as text to show the user.

## How to run a request

1. **Pick the brief.** Find the prompt in `PROMPTS.md` that best fits the request (search its headings and categories). If the user names a number ("do #23"), use that one. If nothing fits, write a brief in the same style: format and length, one central visual rule, motion rules, what's banned, and "one self-contained HTML file".
2. **Set the BRAND line.** If the user gave brand guidelines (name, colours, fonts, logo), replace `BRAND: open` with them and keep every choice on-brand; use their logo as given, never redraw it. Otherwise keep it open and invent a distinctive look.
3. **Fill placeholders.** Replace every `{{...}}` with what the user said. For anything they didn't specify, pick something specific and surprising rather than generic, and say what you picked.
4. **Apply power-ups.** For showpiece work, apply the **ALL OUT booster**. When the user wants variety, or asks again for something similar, apply **Anti-repetition** and roll the **Style roulette** (one style, technique, mood and constraint; say which). Apply **Video export** only when they want an MP4 and you can run a browser and ffmpeg.
5. **Build it.** Deliver one self-contained HTML file with no external assets except, optionally, web fonts. Honour `prefers-reduced-motion`, pause work when the tab is hidden, and keep it smooth on an average laptop.
6. **Critique before handing over.** Screenshot or mentally step through the key moments, judge them as a harsh creative director (hook, originality, motion quality, pacing, polish), and fix the weakest three before you finish.
7. **Offer a remix.** End by offering one relevant follow-up from the Remixes section (e.g. three radically different versions, or a 9:16 cut).

## Craft rules that always apply

- Springs with a tiny overshoot at most; nothing linear that starts and stops; elements don't all start and stop on the same frame.
- Text never overlaps during transitions: content enters after its container starts moving and leaves before the next move.
- Avoid the giveaways of AI-made motion: centered title on a gradient, everything fading in, purple-to-blue neon, glassmorphism, near-black with one acid-green accent, cream with terracotta, Inter/Roboto/Geist, corner labels, frame borders, fake timecodes and dashboards, spinning logos.
- Never invent facts about a real brand: no made-up stats, clients or quotes.
