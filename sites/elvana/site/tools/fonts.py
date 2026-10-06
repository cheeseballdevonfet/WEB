#!/usr/bin/env python3
"""Fetch the site's woff2 subsets into src/fonts/ (run once; the results are committed).

Same pipeline as variation A's build (Google Fonts css2 `text=` subsetting, same
user agent, same cache key = sha1(spec + text)[:16]) and the same cache folder
(tools/fontcache, seeded from A), so the glyphs are byte-for-byte A's source.
The difference is coverage: A asked for the characters on one page; the site
asks for whole ranges, so page builders can write anything.

  Mukta 400 / 600 / 800   full Latin + U+20B9 (rupee)
  Yatra One 400           full Latin + U+20B9, and separately the full
                          Devanagari block (U+0900-097F) + ZWNJ/ZWJ + dotted circle

usage: python3 tools/fonts.py          (fetches only what is not cached)
The unicode-range strings below are reused by build.py (import fonts).
"""
import hashlib, os, re, subprocess, sys, urllib.parse, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
CACHE = os.path.join(HERE, 'fontcache')
OUT = os.path.join(SITE, 'src', 'fonts')
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"

# Google Fonts' own "latin" subset, written out, plus the rupee sign.
# U+200C-200D (ZWNJ, ZWJ) are left to the Devanagari face so the ranges never overlap.
LATIN_RANGES = [(0x20, 0x7E), (0xA0, 0xFF), (0x131, 0x131), (0x152, 0x153), (0x2BB, 0x2BC), (0x2C6, 0x2C6),
                (0x2DA, 0x2DA), (0x2DC, 0x2DC), (0x304, 0x304), (0x308, 0x308), (0x329, 0x329),
                (0x2000, 0x200B), (0x200E, 0x206F), (0x20AC, 0x20AC), (0x20B9, 0x20B9), (0x2122, 0x2122),
                (0x2191, 0x2191), (0x2193, 0x2193), (0x2212, 0x2212), (0x2215, 0x2215), (0xFEFF, 0xFEFF), (0xFFFD, 0xFFFD)]
DEVA_RANGES = [(0x900, 0x97F), (0x200C, 0x200D), (0x25CC, 0x25CC)]


def chars(ranges):
    return ''.join(chr(c) for a, b in ranges for c in range(a, b + 1))


def css_range(ranges):
    return ', '.join(f'U+{a:04X}' if a == b else f'U+{a:04X}-{b:04X}' for a, b in ranges)


def in_ranges(ch, ranges):
    o = ord(ch)
    return any(a <= o <= b for a, b in ranges)


# (file stem, css family, weight, google spec, ranges, preload in dist?)
FACES = [
    ('yatra-one-latin', 'Yatra One', 400, 'Yatra+One', LATIN_RANGES, True),
    ('yatra-one-devanagari', 'Yatra One', 400, 'Yatra+One', DEVA_RANGES, False),
    ('mukta-400-latin', 'Mukta', 400, 'Mukta:wght@400', LATIN_RANGES, True),
    ('mukta-600-latin', 'Mukta', 600, 'Mukta:wght@600', LATIN_RANGES, False),
    ('mukta-800-latin', 'Mukta', 800, 'Mukta:wght@800', LATIN_RANGES, True),
]


def fetch(spec, text):
    key = hashlib.sha1((spec + text).encode()).hexdigest()[:16]
    path = os.path.join(CACHE, key + '.woff2')
    if os.path.exists(path):
        return path, True
    url = f"https://fonts.googleapis.com/css2?family={spec}&text={urllib.parse.quote(text, safe='')}"
    css = subprocess.run(['curl', '-sS', '-A', UA, url], capture_output=True, text=True, check=True).stdout
    m = re.findall(r'url\((https://[^)]+)\)', css)
    if len(m) != 1:
        sys.exit(f'unexpected css for {spec}: {css[:300]}')
    os.makedirs(CACHE, exist_ok=True)
    subprocess.run(['curl', '-sS', '-A', UA, m[0], '-o', path], check=True)
    return path, False


def main():
    os.makedirs(OUT, exist_ok=True)
    for stem, fam, w, spec, ranges, _ in FACES:
        path, cached = fetch(spec, chars(ranges))
        dst = os.path.join(OUT, stem + '.woff2')
        shutil.copyfile(path, dst)
        print(f'{stem:24s} {os.path.getsize(dst):7d} bytes  {"cache" if cached else "fetched"}  {os.path.basename(path)}')


if __name__ == '__main__':
    main()
