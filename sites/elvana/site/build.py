#!/usr/bin/env python3
"""Elvana Media site build.

    python3 build.py                 build dist/ and preview/, validate, exit 1 on any error
    python3 build.py --clean-urls    dist links as ../contact/ instead of ../contact/index.html
                                     (for a web server; default links work from file:// too)
    python3 build.py --base /sub/    dist/404.html links for a site deployed under /sub/
    python3 build.py --out DIR       build into DIR/dist, DIR/preview, DIR/build-report.json (parallel work);
                                     then run the tools with ELVANA_OUT=DIR

Sources (see SYSTEM.md):
    src/partials/head.html header.html footer.html   the shell
    src/pages/**/*.html                              front matter + body markup (files starting
                                                     with "_" are templates and are not built)
    src/css/base.css components.css tear.css pages/*.css
    src/js/core.js tear.js pages/*.js
    src/fonts/*.woff2                                (tools/fonts.py fetches them)
    src/og/og-default.html -> og-default.png        (tools/render-og.js renders it)

Outputs:
    dist/      deploy: shared /assets/{css,js,fonts}, relative links, sitemap.xml, robots.txt, 404.html
    preview/   every page self-contained (CSS, JS and only the font subsets it uses inlined)
    build-report.json   pages, sizes, warnings (read by tools/qa.js)

Authoring rules the build relies on:
    - Write internal links root-absolute: href="/services/seo-sem/", href="/#contact".
      The build rewrites them relative to each page.
    - Page placeholders: {{crumbs}} {{name}} {{title}} {{path}} {{description}}
    - Page JSON-LD: put <script type="application/ld+json"> in the body; the build moves it to <head>.
"""
import argparse, base64, datetime, html, json, os, re, shutil, subprocess, sys
from html.parser import HTMLParser
from posixpath import relpath as prel, dirname as pdir, join as pjoin, normpath as pnorm

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
DIST = os.path.join(HERE, 'dist')
PREVIEW = os.path.join(HERE, 'preview')
REPORT_DIR = HERE
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.join(HERE, 'tools'))
from fonts import FACES, css_range, in_ranges, DEVA_RANGES, LATIN_RANGES  # noqa: E402

SITE_URL = 'https://www.elvanamedia.com'
OG_DEFAULT = SITE_URL + '/assets/og-default.png'
OG_ALT = 'Elvana Media: a yellow hoarding poster reading "Ideas that create impact.", torn at one corner to show a red poster underneath.'

# Favicon: a typographic "E" poster, ink on hoarding yellow, brush-cut strokes. Inline SVG (no request).
FAVICON_SVG = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
               "<rect width='32' height='32' fill='#FFD000'/>"
               "<path d='M8.6 6.2l15.9.5-.7 4.4-10.2-.3-.1 3.4 8.4.1-.5 4.1-8 .1.1 3.6 10.7-.4-.6 4.6-15.4.4z' fill='#1A1814'/>"
               "</svg>")
FAVICON = 'data:image/svg+xml,' + FAVICON_SVG.replace('#', '%23').replace('<', '%3C').replace('>', '%3E').replace("'", '%27').replace(' ', '%20')

# Copy that must never ship (ALL OUT ban list, October 2026), checked in visible text and attributes.
BANNED = [
    ('—', 'em dash'), ('→', 'arrow on a link'), ('·', 'middle-dot meta string'),
    (r'\blorem\b', 'lorem ipsum'), (r'\bipsum\b', 'lorem ipsum'), (r'\bJohn Doe\b', 'placeholder name'), (r'\bAcme\b', 'placeholder company'),
    (r'\belevat(e|es|ed|ing)\b', 'filler word "elevate"'), (r'\bseamless(ly)?\b', 'filler word "seamless"'),
    (r'\bunleash(es|ed|ing)?\b', 'filler word "unleash"'), (r'\bnext-gen\b', 'filler word "next-gen"'),
    (r'\bcutting-edge\b', 'filler word "cutting-edge"'), (r'\bworld-class\b', 'filler word "world-class"'),
    (r'\bgame-chang', 'filler word "game-changing"'), (r'\bsynerg', 'filler word "synergy"'),
    (r'\btestimonial', 'testimonials are not allowed (none exist)'),
]

errors, warnings = [], []
def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)
def read(p): return open(p, encoding='utf-8').read()
def write(p, s, mode='w'):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f: f.write(s)


# --------------------------------------------------------------------------- pages
class Page:
    def __init__(self, src):
        self.src = src
        text = read(src)
        m = re.match(r'---\n(.*?)\n---\n', text, re.S)
        if not m:
            sys.exit(f'{rel(src)}: missing front matter')
        self.meta = {}
        for line in m.group(1).splitlines():
            if not line.strip() or line.lstrip().startswith('#'):
                continue
            k, _, v = line.partition(':')
            self.meta[k.strip()] = v.strip()
        self.body = text[m.end():]
        g = self.meta.get
        for k in ('title', 'description', 'path'):
            if not g(k):
                err(f'{rel(src)}: front matter needs `{k}`')
        self.title = g('title', '')
        self.name = g('name') or self.title.split(' | ')[0]
        self.description = g('description', '')
        self.path = g('path', '/')
        self.body_class = g('body_class', '')
        self.css = [c.strip() for c in g('css', '').split(',') if c.strip()]
        self.js = [c.strip() for c in g('js', '').split(',') if c.strip()]
        self.noindex = g('noindex', '').lower() in ('true', 'yes', '1')
        self.og_title = g('og_title') or self.title
        self.og_image = g('og_image') or OG_DEFAULT
        self.og_image_alt = g('og_image_alt') or OG_ALT
        self.is404 = self.path.endswith('404.html')
        # output file, relative to the output root, posix style
        self.out = self.path.lstrip('/') + ('index.html' if self.path.endswith('/') else '')
        self.dir = pdir(self.out)


def rel(p): return os.path.relpath(p, HERE)


def load_pages():
    pages = []
    for d, _, files in os.walk(os.path.join(SRC, 'pages')):
        for f in sorted(files):
            if f.endswith('.html') and not f.startswith('_'):
                pages.append(Page(os.path.join(d, f)))
    seen = {}
    for p in pages:
        if p.path in seen:
            err(f'duplicate path {p.path}: {rel(p.src)} and {rel(seen[p.path].src)}')
        seen[p.path] = p
        if not (p.path.startswith('/') and (p.path.endswith('/') or p.path.endswith('.html'))):
            err(f'{rel(p.src)}: path must start with / and end with / (or .html)')
    pages.sort(key=lambda p: (p.path != '/', p.path))
    return pages, seen


# --------------------------------------------------------------------------- helpers
def crumbs_of(page, by_path):
    """[(name, path)] from Home down to the page, using each ancestor page's `name`."""
    if page.path == '/' or page.is404:
        return []
    out = [('Home', '/')]
    parts = [x for x in page.path.strip('/').split('/') if x]
    for i in range(1, len(parts)):
        anc = '/' + '/'.join(parts[:i]) + '/'
        if anc in by_path:
            out.append((by_path[anc].name, anc))
    out.append((page.name, page.path))
    return out


def crumbs_html(page, by_path):
    cr = crumbs_of(page, by_path)
    if not cr:
        return ''
    items = []
    for i, (n, p) in enumerate(cr):
        if i == len(cr) - 1:
            items.append(f'<li aria-current="page">{html.escape(n)}</li>')
        else:
            items.append(f'<li><a href="{p}">{html.escape(n)}</a></li>')
    return '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + ''.join(items) + '</ol></nav>'


def jsonld(page, by_path, extra):
    org = {
        '@type': 'Organization', '@id': SITE_URL + '/#organization',
        'name': 'Elvana Media', 'legalName': 'ELEVANA MEDIA PRIVATE LIMITED', 'url': SITE_URL + '/',
        'email': 'info@elvanamedia.com', 'telephone': '+91 89283 39531', 'foundingDate': '2026-06-04',
        'slogan': 'Ideas that create impact.',
        'description': 'Digital marketing, media & AI-powered growth.',
        'image': OG_DEFAULT,
        'parentOrganization': {'@type': 'Organization', 'name': 'BeyondSure Private Limited'},
        'areaServed': [{'@type': 'City', 'name': c} for c in ('Mumbai', 'Delhi', 'Gurgaon', 'Noida')],
        'address': {'@id': SITE_URL + '/#registered-office'},
    }
    biz = {
        '@type': 'LocalBusiness', '@id': SITE_URL + '/#mumbai',
        'name': 'Elvana Media', 'url': SITE_URL + '/', 'image': OG_DEFAULT,
        'email': 'info@elvanamedia.com', 'telephone': '+91 89283 39531',
        'parentOrganization': {'@id': SITE_URL + '/#organization'},
        'address': {
            '@type': 'PostalAddress', '@id': SITE_URL + '/#registered-office',
            'streetAddress': '203, Shivam Square, Building No. 4, Sahar Road, Andheri East',
            'addressLocality': 'Mumbai', 'addressRegion': 'Maharashtra', 'postalCode': '400069', 'addressCountry': 'IN'},
    }
    graph = [org, biz, {'@type': 'WebSite', '@id': SITE_URL + '/#website', 'url': SITE_URL + '/', 'name': 'Elvana Media',
                        'publisher': {'@id': SITE_URL + '/#organization'}, 'inLanguage': 'en-IN'}]
    if not page.is404:
        url = SITE_URL + page.path
        wp = {'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': page.title, 'description': page.description,
              'isPartOf': {'@id': SITE_URL + '/#website'}, 'about': {'@id': SITE_URL + '/#organization'}, 'inLanguage': 'en-IN'}
        cr = crumbs_of(page, by_path)
        if cr:
            wp['breadcrumb'] = {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': SITE_URL + p} for i, (n, p) in enumerate(cr)]}
        graph.append(wp)
    out = ['<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':')) + '</script>']
    for block in extra:
        try:
            json.loads(block)
        except ValueError as e:
            err(f'{page.path}: page JSON-LD does not parse: {e}')
        out.append('<script type="application/ld+json">' + block.strip() + '</script>')
    return '\n'.join(out)


def mark_current(shell_html, page, by_path):
    """aria-current="page" on links to this page; aria-current="true" on the main-nav link of its section."""
    def fix(m):
        tag, href = m.group(0), m.group(1)
        if 'aria-current' in tag or href.startswith('#'):
            return tag
        if href == page.path:
            return tag[:-1] + ' aria-current="page">'
        return tag
    s = re.sub(r'<a\b[^>]*?href="([^"]*)"[^>]*>', fix, shell_html)
    # section ancestor in the header nav (e.g. Services on a service page)
    if page.path != '/':
        first = '/' + page.path.strip('/').split('/')[0] + '/'
        if first != page.path:
            s = re.sub(r'(<ul class="nav-links">.*?</ul>)', lambda m: m.group(1).replace(f'href="{first}">', f'href="{first}" aria-current="true">'), s, flags=re.S)
            s = re.sub(r'(<nav id="menu".*?</nav>)', lambda m: m.group(1).replace(f'href="{first}">', f'href="{first}" aria-current="true">'), s, flags=re.S)
    return s


def target_file(path):
    """root-absolute URL path (no query/fragment) -> output file, posix, relative to root"""
    if path.endswith('/'):
        return path.lstrip('/') + 'index.html'
    return path.lstrip('/')


def rewrite_links(s, page, mode, base='/'):
    """mode: 'file' (relative, explicit index.html), 'clean' (relative, ../dir/), 'absolute' (base + clean path)"""
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if not url.startswith('/') or url.startswith('//'):
            return m.group(0)
        path, frag = (url.split('#', 1) + [''])[:2]
        frag = ('#' + frag) if '#' in url else ''
        if mode == 'absolute':
            new = base.rstrip('/') + path
        else:
            tgt = target_file(path)
            if mode == 'clean' and path.endswith('/'):
                d = prel(path.lstrip('/') or '.', page.dir or '.')
                new = '' if d == '.' else d + '/'
                new = new or './'
            else:
                new = prel(tgt, page.dir or '.')
            if frag and tgt == page.out:
                new = ''           # same page: keep just the fragment
        return f'{attr}="{new}{frag}"'
    return re.sub(r'\b(href|src|action)="([^"]*)"', fix, s)


# --------------------------------------------------------------------------- fonts and assets
FONT_DIR = os.path.join(SRC, 'fonts')


def font_faces(mode, chars=None):
    """mode 'url': dist @font-face with unicode-range, swap. mode 'inline': base64, only the faces `chars` need."""
    out = []
    for stem, fam, w, spec, ranges, _ in FACES:
        f = os.path.join(FONT_DIR, stem + '.woff2')
        if not os.path.exists(f):
            err(f'missing font {rel(f)} (run python3 tools/fonts.py)')
            continue
        if mode == 'inline':
            if chars is not None and not any(in_ranges(c, ranges) for c in chars):
                continue
            src = 'url(data:font/woff2;base64,' + base64.b64encode(open(f, 'rb').read()).decode() + ") format('woff2')"
            disp = 'block'
        else:
            src = f"url(../fonts/{stem}.woff2) format('woff2')"
            disp = 'swap'
        out.append(f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:{disp};src:{src};unicode-range:{css_range(ranges)}}}")
    return '\n'.join(out)


def css_files(page):
    files = ['base.css', 'components.css']
    for c in page.css:
        files.append(c + '.css')
    for f in files:
        if not os.path.exists(os.path.join(SRC, 'css', f)):
            err(f'{rel(page.src)}: css `{f}` not found in src/css/')
    return [f for f in files if os.path.exists(os.path.join(SRC, 'css', f))]


def js_files(page):
    libs = [j + '.js' for j in page.js if not j.startswith('pages/')]
    own = [j + '.js' for j in page.js if j.startswith('pages/')]
    files = libs + ['core.js'] + own
    for f in files:
        if not os.path.exists(os.path.join(SRC, 'js', f)):
            err(f'{rel(page.src)}: js `{f}` not found in src/js/')
    return [f for f in files if os.path.exists(os.path.join(SRC, 'js', f))]


def page_chars(s):
    return set(html.unescape(re.sub(r'<(script|style)\b.*?</\1>', '', s, flags=re.S)))


def inline_css(page, chars):
    parts = []
    for f in css_files(page):
        c = read(os.path.join(SRC, 'css', f))
        if f == 'base.css':
            c = c.replace('/*@FONTS@*/', font_faces('inline', chars))
        parts.append(f'/* {f} */\n' + c)
    return '<style>\n' + '\n'.join(parts) + '\n</style>'


# --------------------------------------------------------------------------- assemble
def assemble(page, by_path, partials, mode, opts):
    """mode 'dist' or 'preview' -> final HTML string"""
    body = page.body
    extra_ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, flags=re.S)
    body = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', body, flags=re.S)
    vars_ = {'crumbs': crumbs_html(page, by_path), 'name': html.escape(page.name), 'title': html.escape(page.title),
             'path': page.path, 'description': html.escape(page.description)}
    body = re.sub(r'\{\{(\w+)\}\}', lambda m: vars_.get(m.group(1), m.group(0)), body)

    selfcontained = mode == 'preview' or page.is404
    url = SITE_URL + page.path
    head = partials['head']
    if selfcontained:
        styles = '@STYLES@'      # filled after we know the page's characters
        head_scripts = ''
        body_end = '\n'.join('<script>\n' + read(os.path.join(SRC, 'js', f)) + '\n</script>' for f in js_files(page))
    else:
        # Font preloads: added by script, and never on file:// (Chromium blocks CORS font preloads there,
        # while the @font-face loads themselves work).
        up = prel('assets/fonts', page.dir or '.')
        pre = ','.join(f"'{up}/{stem}.woff2'" for stem, fam, w, spec, rng, preload in FACES if preload)
        pre = ("<script>if(location.protocol!=='file:')[" + pre + "].forEach(function(h){var l=document.createElement('link');"
               "l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='';l.href=h;document.head.appendChild(l)})</script>")
        styles = '\n'.join([pre] + [f'<link rel="stylesheet" href="/assets/css/{f}">' for f in css_files(page)])
        head_scripts = '\n'.join(f'<script defer src="/assets/js/{f}"></script>' for f in js_files(page))
        body_end = ''
    hv = {
        'title': html.escape(page.title), 'description': html.escape(page.description, quote=True),
        'robots': '<meta name="robots" content="noindex, follow">\n' if page.noindex else '',
        'canonical_link': '' if page.is404 else f'<link rel="canonical" href="{url}">\n',
        'favicon': FAVICON, 'og_title': html.escape(page.og_title), 'url': SITE_URL + ('/' if page.is404 else page.path),
        'og_image': page.og_image, 'og_image_alt': html.escape(page.og_image_alt), 'styles': styles,
        'head_scripts': head_scripts, 'jsonld': jsonld(page, by_path, extra_ld), 'body_class': page.body_class,
    }
    s = re.sub(r'\{\{(\w+)\}\}', lambda m: hv.get(m.group(1), m.group(0)), head)
    shell_top = mark_current(partials['header'], page, by_path)
    shell_bot = mark_current(partials['footer'], page, by_path).replace('{{body_end}}', body_end)
    s += shell_top + '\n<main id="main">\n' + body.strip('\n') + '\n</main>\n\n' + shell_bot
    if selfcontained:
        s = s.replace('@STYLES@', inline_css(page, page_chars(s)), 1)
    if page.is404 and mode == 'dist':
        s = rewrite_links(s, page, 'absolute', opts.base)
    else:
        s = rewrite_links(s, page, 'clean' if (mode == 'dist' and opts.clean_urls) else 'file')
    return s


# --------------------------------------------------------------------------- validation
class Scan(HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.res, self.text, self.attrtext = set(), [], [], [], []
        self.h1 = 0; self.title = ''; self.desc = None; self.canon = None; self.og = {}
        self.has = {'header.hdr': 0, 'main#main': 0, 'footer.foot': 0}
        self._skip = 0; self._in_title = False; self.stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            if a['id'] in self.ids:
                self.dup = getattr(self, 'dup', []) + [a['id']]
            self.ids.add(a['id'])
        cls = (a.get('class') or '').split()
        if tag == 'h1': self.h1 += 1
        if tag == 'header' and 'hdr' in cls: self.has['header.hdr'] += 1
        if tag == 'main' and a.get('id') == 'main': self.has['main#main'] += 1
        if tag == 'footer' and 'foot' in cls: self.has['footer.foot'] += 1
        if tag in ('script', 'style'): self._skip += 1
        if tag == 'title': self._in_title = True
        if tag == 'a' and 'href' in a: self.links.append(a['href'])
        if tag == 'meta':
            if a.get('name') == 'description': self.desc = a.get('content')
            if (a.get('property') or a.get('name') or '').startswith(('og:', 'twitter:')): self.og[a.get('property') or a.get('name')] = a.get('content')
        if tag == 'link':
            r = (a.get('rel') or '').split()
            if 'canonical' in r: self.canon = a.get('href')
            if set(r) & {'stylesheet', 'preload', 'icon', 'modulepreload', 'manifest', 'prefetch'}: self.res.append(('link', a.get('href', '')))
        for k in ('src', 'srcset', 'poster', 'data'):
            if k in a and tag in ('script', 'img', 'source', 'iframe', 'video', 'audio', 'embed', 'object', 'track', 'input'):
                self.res.append((tag, a[k]))
        for k in ('alt', 'aria-label', 'title', 'placeholder'):
            if a.get(k): self.attrtext.append(a[k])

    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self._skip -= 1
        if tag == 'title': self._in_title = False

    def handle_data(self, d):
        if self._in_title: self.title += d
        elif not self._skip: self.text.append(d)


def is_external(u):
    return bool(re.match(r'^(https?:)?//', u.strip()))


def validate_tree(root, pages, label, opts):
    scans, titles, descs = {}, {}, {}
    for p in pages:
        f = os.path.join(root, p.out)
        sc = Scan(); sc.feed(read(f)); scans[p.out] = sc
    for p in pages:
        sc = scans[p.out]; where = f'{label}/{p.out}'
        if sc.h1 != 1: err(f'{where}: {sc.h1} <h1> elements (need exactly 1)')
        for k, n in sc.has.items():
            if n != 1: err(f'{where}: needs exactly one {k} (found {n})')
        if getattr(sc, 'dup', None): err(f'{where}: duplicate ids {sorted(set(sc.dup))}')
        t = sc.title.strip()
        if t in titles: err(f'{where}: <title> "{t}" also on {titles[t]}')
        titles[t] = p.out
        if not sc.desc: err(f'{where}: no meta description')
        elif sc.desc in descs: err(f'{where}: meta description also on {descs[sc.desc]}')
        else: descs[sc.desc] = p.out
        if label == 'dist':
            if len(t) > 65: warn(f'{where}: title is {len(t)} chars (aim for 65 or fewer)')
            if sc.desc and not 70 <= len(sc.desc) <= 170: warn(f'{where}: description is {len(sc.desc)} chars (aim for 70 to 170)')
            if not p.is404 and sc.canon != SITE_URL + p.path: err(f'{where}: canonical is {sc.canon}')
            for k in ('og:title', 'og:description', 'og:image', 'og:url', 'twitter:card'):
                if not sc.og.get(k): err(f'{where}: missing {k}')
        # no external requests
        for tag, u in sc.res:
            if is_external(u): err(f'{where}: external request <{tag}> {u}')
        src = read(os.path.join(root, p.out))
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', re.sub(r'<!--.*?-->', '', src, flags=re.S), flags=re.S):
            try:
                json.loads(block)
            except ValueError as e:
                err(f'{where}: JSON-LD does not parse: {e}')
        for u in re.findall(r'url\(\s*["\']?([^"\')]+)', re.sub(r'<script\b.*?</script>', '', src, flags=re.S)):
            if is_external(u): err(f'{where}: external url() {u}')
        for u in re.findall(r'@import\s+["\']?([^"\';]+)', src):
            err(f'{where}: @import {u}')
        # copy rules
        text = ' '.join(sc.text + sc.attrtext + [t, sc.desc or ''])
        for pat, why in BANNED:
            for m in re.finditer(pat, text, flags=re.I):
                ctx = text[max(0, m.start() - 30):m.end() + 30].replace('\n', ' ')
                err(f'{where}: banned ({why}): "...{ctx.strip()}..."')
        # links resolve
        for href in sc.links:
            if re.match(r'^(mailto:|tel:|https?:)', href):
                continue
            path, _, frag = href.partition('#')
            if not path:
                tgt = p.out
            elif path.startswith('/'):
                if not (p.is404 and label == 'dist'):
                    err(f'{where}: root-absolute link left in output: {href}'); continue
                base = opts.base.rstrip('/')
                tgt = target_file(path[len(base):] if path.startswith(base) else path)
            else:
                tgt = pnorm(pjoin(p.dir, path))
                if path.endswith('/') or path in ('.', './') or tgt == '.':
                    tgt = pjoin(tgt, 'index.html') if tgt != '.' else 'index.html'
            if tgt not in scans:
                err(f'{where}: link to {href} does not resolve (looked for {tgt})'); continue
            if frag and frag != 'top' and frag not in scans[tgt].ids:
                err(f'{where}: link {href}: no id="{frag}" in {tgt}')
            elif frag == 'top' and 'top' not in scans[tgt].ids:
                err(f'{where}: link {href}: no id="top"')
    return scans


def check_js_and_css(root):
    for d, _, files in os.walk(root):
        for f in files:
            if f.endswith(('.js', '.css')):
                s = read(os.path.join(d, f))
                for u in re.findall(r'https?://[^\s\'"`)]+', s):
                    if not u.startswith('http://www.w3.org/'):
                        err(f'{rel(os.path.join(d, f))}: external URL {u}')


# --------------------------------------------------------------------------- OG image
def og_image(opts):
    """src/og/og-default.html (+ the system CSS) -> src/og/og-default.png via tools/render-og.js"""
    og_html = os.path.join(SRC, 'og', 'og-default.html')
    og_png = os.path.join(SRC, 'og', 'og-default.png')
    srcs = [og_html] + [os.path.join(SRC, 'css', f) for f in ('base.css', 'components.css', 'tear.css', 'pages/home.css')]
    stale = not os.path.exists(og_png) or any(os.path.getmtime(x) > os.path.getmtime(og_png) for x in srcs if os.path.exists(x))
    if stale and not opts.no_og:
        css = ''
        for f in ('base.css', 'components.css', 'tear.css', 'pages/home.css'):
            c = read(os.path.join(SRC, 'css', f))
            css += c.replace('/*@FONTS@*/', font_faces('inline', None)) + '\n'
        page = read(og_html).replace('/*@CSS@*/', css)
        tmp = os.path.join(HERE, 'tools', '.og-render.html')
        write(tmp, page)
        try:
            r = subprocess.run(['node', os.path.join(HERE, 'tools', 'render-og.js'), tmp, og_png], capture_output=True, text=True, timeout=120)
            if r.returncode: warn('OG render failed: ' + (r.stderr or r.stdout).strip()[:300])
        except (OSError, subprocess.TimeoutExpired) as e:
            warn(f'OG render skipped ({e}); using the committed src/og/og-default.png')
        finally:
            if os.path.exists(tmp): os.remove(tmp)
    if os.path.exists(og_png):
        shutil.copyfile(og_png, os.path.join(DIST, 'assets', 'og-default.png'))
    else:
        err('src/og/og-default.png is missing (node tools/render-og.js)')


# --------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--clean-urls', action='store_true')
    ap.add_argument('--base', default='/')
    ap.add_argument('--no-og', action='store_true', help='do not re-render the OG image')
    ap.add_argument('--out', default=None, help='write dist/, preview/ and build-report.json under this folder '
                    '(for parallel builders; QA tools read it from ELVANA_OUT)')
    opts = ap.parse_args()
    global DIST, PREVIEW, REPORT_DIR
    if opts.out:
        out = os.path.abspath(opts.out)
        DIST, PREVIEW, REPORT_DIR = os.path.join(out, 'dist'), os.path.join(out, 'preview'), out
        os.makedirs(out, exist_ok=True)
    partials = {k: read(os.path.join(SRC, 'partials', k + '.html')) for k in ('head', 'header', 'footer')}
    pages, by_path = load_pages()
    if errors:
        print('\n'.join('ERROR ' + e for e in errors)); sys.exit(1)

    for d in (DIST, PREVIEW):
        if os.path.isdir(d): shutil.rmtree(d)

    # dist assets
    for sub in ('css', 'js'):
        for d, _, files in os.walk(os.path.join(SRC, sub)):
            for f in files:
                srcf = os.path.join(d, f)
                dst = os.path.join(DIST, 'assets', sub, os.path.relpath(srcf, os.path.join(SRC, sub)))
                s = read(srcf)
                if f == 'base.css':
                    s = s.replace('/*@FONTS@*/', font_faces('url'))
                write(dst, s)
    for stem, *_ in FACES:
        f = os.path.join(FONT_DIR, stem + '.woff2')
        if os.path.exists(f):
            os.makedirs(os.path.join(DIST, 'assets', 'fonts'), exist_ok=True)
            shutil.copyfile(f, os.path.join(DIST, 'assets', 'fonts', stem + '.woff2'))

    report = {'built': datetime.datetime.now().isoformat(timespec='seconds'), 'pages': []}
    for p in pages:
        d = assemble(p, by_path, partials, 'dist', opts)
        v = assemble(p, by_path, partials, 'preview', opts)
        write(os.path.join(DIST, p.out), d)
        write(os.path.join(PREVIEW, p.out), v)
        deva = any(in_ranges(c, DEVA_RANGES) for c in page_chars(v))
        odd = sorted({c for c in page_chars(v) if ord(c) > 0x7e and not in_ranges(c, LATIN_RANGES) and not in_ranges(c, DEVA_RANGES)})
        if odd:
            warn(f'{p.out}: characters outside the font subsets: {"".join(odd)}')
        report['pages'].append({'path': p.path, 'out': p.out, 'name': p.name, 'title': p.title, 'noindex': p.noindex,
                                'is404': p.is404, 'src': rel(p.src), 'dist_bytes': len(d.encode()), 'preview_bytes': len(v.encode()),
                                'devanagari': deva})

    # SEO files
    today = datetime.date.today().isoformat()
    urls = [p for p in pages if not p.noindex and not p.is404]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in urls:
        sm.append(f'  <url><loc>{SITE_URL}{p.path}</loc><lastmod>{today}</lastmod></url>')
    sm.append('</urlset>')
    write(os.path.join(DIST, 'sitemap.xml'), '\n'.join(sm) + '\n')
    write(os.path.join(DIST, 'robots.txt'), f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n')
    og_image(opts)

    # validation
    validate_tree(DIST, pages, 'dist', opts)
    validate_tree(PREVIEW, pages, 'preview', opts)
    check_js_and_css(os.path.join(DIST, 'assets'))
    foot_links = set(re.findall(r'href="([^"#]*)"', partials['footer']))
    for p in urls:
        if p.path not in foot_links:
            err(f'{p.path} is not linked from the footer (partials/footer.html)')
    report['errors'], report['warnings'] = errors, warnings
    write(os.path.join(REPORT_DIR, 'build-report.json'), json.dumps(report, indent=1, ensure_ascii=False))

    total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(DIST) for f in fs)
    print(f'built {len(pages)} pages -> dist/ ({total // 1024} KB) and preview/ '
          f'(largest {max(x["preview_bytes"] for x in report["pages"]) // 1024} KB)')
    for w in warnings: print('warn ', w)
    for e in errors: print('ERROR', e)
    print(f'{len(errors)} errors, {len(warnings)} warnings')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
