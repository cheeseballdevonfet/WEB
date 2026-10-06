#!/usr/bin/env python3
"""Build the Creative Motion Prompt Kit.

PROMPTS.md is the single source of truth. This script parses it and writes:
  prompts.json   structured data for apps, scripts and automations
  prompts.csv    one row per prompt, for Notion / Airtable / Google Sheets
  kit.html       an offline, single-file browser for the whole kit
  skill/creative-motion/PROMPTS.md   a copy so the Claude Code skill is self-contained

Usage: python3 tools/build.py   (from anywhere; paths are resolved from this file)
"""
import csv
import json
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "PROMPTS.md"
TEMPLATE = ROOT / "tools" / "kit.template.html"

LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
ROULETTE_KEYS = {
    "Style": "style",
    "Motion technique": "technique",
    "Mood": "mood",
    "Constraint": "constraint",
}


def plain(md):
    """Markdown links -> their text; trim stray whitespace."""
    return LINK.sub(r"\1", md).strip()


def sources_of(md):
    return [{"handle": t, "url": u} for t, u in LINK.findall(md)]


def reflow(text):
    """Undo the hard wrapping used for readability in PROMPTS.md.

    A line break is kept after the BRAND line, at blank lines, and where a sentence
    ends and the next line starts a new one; every other break joins with a space.
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
        sentence_break = re.search(r"[.:;!?\"”)]$", prev) and re.match(r"[A-Z0-9{\"“(]", line)
        if prev.startswith("BRAND:") or sentence_break:
            out.append(line)
        else:
            out[-1] = prev + " " + line
    return "\n".join(out)


def split_blocks(lines):
    """Group lines into (level, heading, body_lines) for H2 and H3 headings."""
    blocks, current = [], None
    in_code = False
    for line in lines:
        if line.startswith("```"):
            in_code = not in_code
        if not in_code and (line.startswith("## ") or line.startswith("### ")):
            level = 2 if line.startswith("## ") else 3
            current = [level, line.lstrip("#").strip(), []]
            blocks.append(current)
        elif current is not None:
            current[2].append(line)
    return blocks


def parse_entry(body):
    """Parse the body of an H3 entry into its fields."""
    entry = {"text": None, "twists": [], "items": [], "options": [], "lines": []}
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
        m = re.match(r"^(id|note):\s*(.+)$", s)
        if m:
            entry[m.group(1)] = m.group(2).strip()
        elif s.startswith("Twists:"):
            entry["twists"] = [t.strip() for t in s[len("Twists:"):].split(" · ") if t.strip()]
        elif s.startswith("Based on:"):
            entry["based_on"] = s[len("Based on:"):].strip()
        else:
            entry["lines"].append(s)
    return entry


def build_data():
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    title = lines[0].lstrip("# ").strip()
    blocks = split_blocks(lines[1:])

    data = {
        "name": title,
        "version": "1.0",
        "updated": date.today().isoformat(),
        "howToUse": [],
        "powerups": [],
        "roulette": {
            "template": "Style: {style}. Motion technique: {technique}. Mood: {mood}. Constraint: {constraint}.",
        },
        "categories": [],
        "prompts": [],
        "remixes": [],
    }

    section = None
    for level, heading, body in blocks:
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
            continue

        entry = parse_entry(body)

        if section == "Power-ups":
            data["powerups"].append({
                "id": entry["id"],
                "name": heading,
                "note": plain(entry.get("note", "")).replace("`", ""),
                "text": entry["text"],
                "options": entry["options"],
            })
        elif section == "Style roulette":
            if heading in ROULETTE_KEYS:
                data["roulette"][ROULETTE_KEYS[heading]] = [
                    re.sub(r"^\d+\.\s*", "", line.strip())
                    for line in body if re.match(r"^\d+\.\s", line.strip())
                ]
            elif heading == "Let Claude roll":
                data["roulette"]["letClaudeRoll"] = entry["text"]
        elif section and section.startswith("Prompts: "):
            m = re.match(r"^(\d+)\.\s+(.+)$", heading)
            assert m, f"Prompt heading needs a number: {heading!r}"
            credit_md = entry.get("based_on") or " ".join(entry["lines"])
            data["prompts"].append({
                "id": int(m.group(1)),
                "title": m.group(2),
                "category": section[len("Prompts: "):],
                "origin": "adapted" if entry.get("based_on") else "original",
                "credit": ("Based on " if entry.get("based_on") else "") + plain(credit_md),
                "sources": sources_of(credit_md),
                "prompt": entry["text"],
                "twists": entry["twists"],
            })
        elif section == "Remixes":
            credit_md = entry.get("based_on", "")
            data["remixes"].append({
                "name": heading,
                "note": plain(entry.get("note", "")),
                "credit": ("Based on " + plain(credit_md)) if credit_md else "",
                "sources": sources_of(credit_md),
                "text": entry["text"],
                "items": entry["items"],
            })
    return data


def validate(data):
    ids = [p["id"] for p in data["prompts"]]
    assert ids == list(range(1, len(ids) + 1)), f"Prompt numbers must run 1..N without gaps: {ids}"
    for p in data["prompts"]:
        assert p["prompt"], f"Prompt {p['id']} has no text block"
        assert p["prompt"].startswith("BRAND:"), f"Prompt {p['id']} must start with a BRAND: line"
    for key in ROULETTE_KEYS.values():
        assert len(data["roulette"].get(key, [])) == 20, f"Roulette list {key!r} needs 20 items"
    have = {p["id"] for p in data["powerups"]}
    assert {"allout", "variety", "brand", "video", "format"} <= have, f"Missing power-ups: {have}"
    for p in data["powerups"]:
        assert p["text"] or p["options"], f"Power-up {p['id']} is empty"
    for r in data["remixes"]:
        assert r["text"] or r["items"], f"Remix {r['name']!r} is empty"


def write_outputs(data):
    (ROOT / "prompts.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    with open(ROOT / "prompts.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "category", "title", "origin", "credit", "source_urls", "prompt", "twists"])
        for p in data["prompts"]:
            w.writerow([p["id"], p["category"], p["title"], p["origin"], p["credit"],
                        " ".join(s["url"] for s in p["sources"]), p["prompt"], " | ".join(p["twists"])])

    # Embed the data in a JSON script tag; escape "</" so no string can close the tag.
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8").replace("__KIT_DATA__", payload)
    (ROOT / "kit.html").write_text(html, encoding="utf-8")

    skill_dir = ROOT / "skill" / "creative-motion"
    skill_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SOURCE, skill_dir / "PROMPTS.md")


if __name__ == "__main__":
    kit = build_data()
    validate(kit)
    write_outputs(kit)
    print(f"Built {len(kit['prompts'])} prompts in {len(kit['categories'])} categories, "
          f"{len(kit['powerups'])} power-ups, {len(kit['remixes'])} remixes.")
