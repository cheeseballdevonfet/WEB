# Elvana Media website

The full site in the "Hoarding" direction (Mumbai street media made physical): 27 pages, one design system, no external requests, no frameworks.

## What's here

| Folder | What it is |
| --- | --- |
| `dist/` | **The site to deploy.** Shared CSS, JS and fonts in `assets/`, plus `sitemap.xml`, `robots.txt`, `404.html` and the social share image. Upload this folder's contents to any static host. |
| `preview/` | Every page as one self-contained HTML file, with fonts and code inlined. Open `preview/index.html` in a browser and click through, even offline. Use it for review, not for hosting. |
| `src/` | The source: pages, partials, CSS, JS and fonts. Edit here, never in `dist/` or `preview/`. |
| `lab/tear-lab.html` | The tear and peel engine on its own, with a slow-motion switch and a physics overlay. `lab/TEAR.md` explains the model. |
| `SYSTEM.md` | The design system and the guide for building or editing pages. |
| `tools/` | QA scripts (Playwright): screenshots, checks, the link crawl and the launch checks. |

## Build

```bash
python3 build.py              # rebuilds dist/ and preview/ and validates links, titles, h1s and copy rules
python3 build.py --base /sub/ # if the site is deployed under a subfolder
```

Then run QA (Node + Playwright):

```bash
NODE_PATH=$(npm root -g) node tools/qa.js     # every page at 390, 768 and 1440: errors, overflow, contrast, menu
NODE_PATH=$(npm root -g) node tools/crawl.js  # every link in dist/ and preview/
NODE_PATH=$(npm root -g) node tools/ship.js   # launch checks on the home page
```

## Deploy

Any static host works: Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, or a plain web server.

1. Upload the contents of `dist/`.
2. Set the host's "not found" page to `/404.html`. Netlify and Cloudflare Pages pick it up automatically.
3. Point www.elvanamedia.com at it. Canonical URLs, the sitemap and the structured data already use `https://www.elvanamedia.com`.
4. **Contact form:** the form opens the visitor's email app (mailto) and also offers WhatsApp. To receive form posts directly, connect a form endpoint (for example Netlify Forms, Formspree or your CRM) in `src/js/pages/contact.js`, then rebuild.

## Before launch: content Elvana needs to supply or confirm

These show on the site as "Coming soon" strips or are noted in `../CONTENT-PAGES.md`.

| What's needed | Where it goes |
| --- | --- |
| Prices for the three engagement models | Engagement models page, home rate card |
| Team photos | About |
| Focus areas for Kunal Verma and Srinivas Mahindrakar | About |
| First case studies | Work, using the ready template at `/work/case-study-template/` |
| The official logo as an SVG | Header wordmark; marked in `src/partials/header.html` |
| Privacy policy and terms (legal text) | Privacy and Terms pages |
| `[confirm]` lines in `CONTENT-PAGES.md` | Service pages: languages, crew, media lists, formats, DLT and WhatsApp wording |
| Hindi and Hinglish lines | Home, Work, the AI-calling and publishing specimens, legal headers. Each has an HTML comment with its English meaning; a native speaker should sign them off. |
