#!/usr/bin/env python3
"""Build the Creative Prompt Kit.

Each library has one Markdown source file, which is the single source of truth:
  PROMPTS.md  Motion & showreels
  WEB.md      Websites & UI

This script parses them and writes:
  prompts.json   structured data for every library (apps, scripts, automations)
  prompts.csv    one row per prompt, with a library column (Notion / Airtable / Sheets)
  kit.html       an offline, single-file browser for the whole kit
  skill/<name>/  a copy of each library's source next to its Claude Code skill

Usage: python3 tools/build.py   (from anywhere; paths are resolved from this file)
"""
import csv
import json
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "kit.template.html"
LIBRARIES = [
    # id, short label, source file, skill folder, number prefix shown in the UI
    ("motion", "Motion & showreels", "PROMPTS.md", "creative-motion", ""),
    ("web", "Websites & UI", "WEB.md", "creative-web", "W"),
]

LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


def plain(md):
    """Markdown links -> their text; trim stray whitespace."""
    return LINK.sub(r"\1", md).strip()


def sources_of(md):
    return [{"handle": t, "url": u} for t, u in LINK.findall(md)]


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def reflow(text):
    """Undo the hard wrapping used for readability in the source files.

    A line break is kept after the BRAND/STACK header lines, at blank lines, at list items,
    and where a sentence ends and the next line starts a new one; every other break joins
    with a space.
    """
    if not text:
        return text
    out = []
    for line in text.split("\n"):
        line = line.strip()
        if not out or not line or not out[-1]:
            out.append(line)
            continue
        prev = out[-1]
        header = re.match(r"^(BRAND|STACK):", prev)
        item = re.match(r"^(\d+[.)]|[-•])\s", line)
        sentence_break = re.search(r"[.:;!?\"”)]$", prev) and re.match(r"[A-Z0-9{\"“(]", line)
        if header or item or sentence_break:
            out.append(line)
        else:
            out[-1] = prev + " " + line
    return "\n".join(out)


def split_blocks(lines):
    """Group lines into (level, heading, body_lines) for H2 and H3 headings."""
    blocks, current, in_code = [], None, False
    for line in lines:
        if line.startswith("```"):
            in_code = not in_code
        if not in_code and (line.startswith("## ") or line.startswith("### ")):
            current = [2 if line.startswith("## ") else 3, line.lstrip("#").strip(), []]
            blocks.append(current)
        elif current is not None:
            current[2].append(line)
    return blocks


def parse_entry(body):
    """Parse the body of an H3 entry into its fields."""
    entry = {"text": None, "twists": [], "items": [], "options": [], "lines": [], "numbered": []}
    in_code, code, in_options = False, [], False
    for line in body:
        if line.startswith("```"):
            if in_code:
                entry["text"] = reflow("\n".join(code).rstrip())
                code, in_code = [], False
            else:
                in_code = True
            continue
        if in_code:
            code.append(line)
            continue
        s = line.strip()
        if not s:
            continue
        if s == "options:":
            in_options = True
            continue
        if s.startswith("- "):
            (entry["options"] if in_options else entry["items"]).append(s[2:].strip())
            continue
        in_options = False
        m = re.match(r"^(\d+)\.\s+(.+)$", s)
        if m:
            entry["numbered"].append(m.group(2).strip())
            continue
        m = re.match(r"^(id|note|mode|line):\s*(.+)$", s)
        if m:
            entry[m.group(1)] = m.group(2).strip()
        elif s.startswith("Twists:"):
            entry["twists"] = [t.strip() for t in s[len("Twists:"):].split(" · ") if t.strip()]
        elif s.startswith("Based on:"):
            entry["based_on"] = s[len("Based on:"):].strip()
        else:
            entry["lines"].append(s)
    return entry


def build_library(lib_id, label, source, skill, prefix):
    lines = (ROOT / source).read_text(encoding="utf-8").splitlines()
    title = lines[0].lstrip("# ").strip()
    intro = []
    for line in lines[1:]:
        if line.startswith("## "):
            break
        if line.strip():
            intro.append(line.strip())
    data = {
        "id": lib_id, "label": label, "title": title, "prefix": prefix, "skill": skill,
        "intro": plain(" ".join(intro)), "howToUse": [], "powerups": [],
        "roulette": {"lists": [], "letClaudeRoll": None, "title": "Roulette"},
        "categories": [], "prompts": [], "remixes": [],
    }
    section = None
    for level, heading, body in split_blocks(lines[1:]):
        if level == 2:
            section = heading
            if heading == "How to use":
                paras, buf = [], []
                for line in body + [""]:
                    if line.strip():
                        buf.append(line.strip())
                    elif buf:
                        paras.append(plain(" ".join(buf)).replace("`", ""))
                        buf = []
                data["howToUse"] = paras
            elif heading.startswith("Prompts: "):
                data["categories"].append(heading[len("Prompts: "):])
            elif heading.endswith("roulette"):
                data["roulette"]["title"] = heading
            continue

        entry = parse_entry(body)
        if section == "Power-ups":
            data["powerups"].append({
                "id": entry["id"], "name": heading,
                "note": plain(entry.get("note", "")).replace("`", ""),
                "text": entry["text"], "options": entry["options"],
                "mode": entry.get("mode", "append" if entry["options"] else "toggle"),
                "line": entry.get("line", ""),
            })
        elif section and section.endswith("roulette"):
            if entry["numbered"]:
                data["roulette"]["lists"].append({"key": slug(heading), "name": heading, "items": entry["numbered"]})
            elif heading == "Let Claude roll":
                data["roulette"]["letClaudeRoll"] = entry["text"]
        elif section and section.startswith("Prompts: "):
            m = re.match(r"^(\d+)\.\s+(.+)$", heading)
            assert m, f"{source}: prompt heading needs a number: {heading!r}"
            credit_md = entry.get("based_on") or " ".join(entry["lines"])
            data["prompts"].append({
                "id": int(m.group(1)), "title": m.group(2),
                "category": section[len("Prompts: "):],
                "origin": "adapted" if entry.get("based_on") else "original",
                "credit": ("Based on " if entry.get("based_on") else "") + plain(credit_md),
                "sources": sources_of(credit_md),
                "prompt": entry["text"], "twists": entry["twists"],
            })
        elif section == "Remixes":
            credit_md = entry.get("based_on", "")
            data["remixes"].append({
                "name": heading, "note": plain(entry.get("note", "")),
                "credit": ("Based on " + plain(credit_md)) if credit_md else "",
                "sources": sources_of(credit_md),
                "text": entry["text"], "items": entry["items"] or entry["numbered"],
            })
    data["intro"] = data["intro"].replace("__COUNT__", str(len(data["prompts"])))
    lists = data["roulette"]["lists"]
    data["roulette"]["template"] = " ".join(l["name"] + ": {" + l["key"] + "}." for l in lists)
    return data


def validate(lib):
    src = lib["id"]
    ids = [p["id"] for p in lib["prompts"]]
    assert ids == list(range(1, len(ids) + 1)), f"{src}: prompt numbers must run 1..N without gaps: {ids}"
    replace_lines = [p["line"] for p in lib["powerups"] if p["mode"] == "replace"]
    for p in lib["prompts"]:
        assert p["prompt"], f"{src} #{p['id']}: no text block"
        assert p["prompt"].startswith("BRAND:"), f"{src} #{p['id']}: must start with a BRAND: line"
        for ln in replace_lines:
            assert re.search(r"^" + re.escape(ln) + r":", p["prompt"], re.M), f"{src} #{p['id']}: needs a {ln}: line"
    for l in lib["roulette"]["lists"]:
        assert len(l["items"]) == 20, f"{src}: roulette list {l['name']!r} needs 20 items"
    assert lib["roulette"]["letClaudeRoll"], f"{src}: missing 'Let Claude roll'"
    have = {p["id"] for p in lib["powerups"]}
    assert {"variety", "allout", "brand"} <= have, f"{src}: missing core power-ups: {have}"
    for p in lib["powerups"]:
        assert p["text"] or p["options"], f"{src}: power-up {p['id']} is empty"
        if p["mode"] in ("append", "replace"):
            assert p["line"] or p["mode"] == "append", f"{src}: power-up {p['id']} needs line:"
    for r in lib["remixes"]:
        assert r["text"] or r["items"], f"{src}: remix {r['name']!r} is empty"


def write_outputs(kit):
    (ROOT / "prompts.json").write_text(json.dumps(kit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with open(ROOT / "prompts.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["library", "id", "category", "title", "origin", "credit", "source_urls", "prompt", "twists"])
        for lib in kit["libraries"]:
            for p in lib["prompts"]:
                w.writerow([lib["label"], lib["prefix"] + str(p["id"]), p["category"], p["title"], p["origin"], p["credit"],
                            " ".join(s["url"] for s in p["sources"]), p["prompt"], " | ".join(p["twists"])])
    payload = json.dumps(kit, ensure_ascii=False).replace("</", "<\\/")
    (ROOT / "kit.html").write_text(TEMPLATE.read_text(encoding="utf-8").replace("__KIT_DATA__", payload), encoding="utf-8")
    for lib_id, _, source, skill, _ in LIBRARIES:
        if not (ROOT / source).exists():
            continue
        d = ROOT / "skill" / skill
        d.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / source, d / source)


if __name__ == "__main__":
    libs = []
    for spec in LIBRARIES:
        if not (ROOT / spec[2]).exists():
            continue
        lib = build_library(*spec)
        validate(lib)
        libs.append(lib)
    kit = {"name": "Creative Prompt Kit", "version": "2.0", "updated": date.today().isoformat(), "libraries": libs}
    write_outputs(kit)
    for lib in libs:
        print(f"{lib['label']}: {len(lib['prompts'])} prompts in {len(lib['categories'])} categories, "
              f"{len(lib['powerups'])} power-ups, {len(lib['roulette']['lists'])} roulette lists, {len(lib['remixes'])} remixes.")
