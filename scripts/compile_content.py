"""Compile the curriculum in content/curriculum/ into JSON the Next.js app renders.

content/curriculum/
  NN-track-slug/
    _track.md            track front matter + introduction
    NN-lesson-slug.md    one lesson: front matter + Markdown body

Front matter is a block of `key: value` lines between `---` fences.
  track:  title, kicker, summary
  lesson: title, level (0-4), summary, outcomes (separated by " | "), minutes (optional)

Outputs (src/content/generated/):
  tracks.json   table of contents: tracks, lessons, levels, reading time
  pages.json    rendered HTML per page, keyed "track" or "track/lesson"
  refs.json     explicit <a id="..."> anchors (Q12, D1, C2, P1, S4, g-rrf...) for hover previews
  search.json   lessons, headings and anchors for the search palette

The build fails on a link to a page or anchor that doesn't exist.

Run:  npm run content   (runs automatically before dev and build)
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

import markdown
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "curriculum"
OUT = ROOT / "src" / "content" / "generated"
FRONT_RE = re.compile(r"\A---\n(.*?)\n---\n", re.S)
DIR_RE = re.compile(r"^(\d{2})-([a-z0-9-]+)$")
FILE_RE = re.compile(r"^(\d{2})-([a-z0-9-]+)\.md$")
STATIC_ROUTES = {"/", "/tech-map"}


def parse_front(text: str, where: Path) -> tuple[dict[str, str], str]:
    m = FRONT_RE.match(text)
    if not m:
        raise SystemExit(f"{where}: missing front matter")
    meta: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        key, sep, value = line.partition(":")
        if not sep:
            raise SystemExit(f"{where}: bad front matter line: {line!r}")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] == '"':
            value = value[1:-1]  # quoted values (needed when the text contains ": ")
        meta[key.strip()] = value
    return meta, text[m.end():]


def render_md(text: str) -> str:
    return markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "toc", "md_in_html"],
        extension_configs={"toc": {"permalink": False}},
        output_format="html",
    )


def clean_text(node: Tag) -> str:
    return re.sub(r"\s+", " ", node.get_text("")).strip()


def label_for(ref_id: str) -> str:
    m = re.fullmatch(r"([a-z])(\d+)", ref_id)
    if m:
        return m.group(1).upper() + m.group(2)
    if ref_id.startswith("g-"):
        return ref_id[2:].upper()
    return ref_id.replace("-", " ").title()


def strip_ids(fragment: Tag | str) -> str:
    frag = BeautifulSoup(str(fragment), "html.parser")
    for el in frag.find_all(True):
        if el.has_attr("id"):
            del el["id"]
    for a in frag.find_all("a"):
        if not a.get("href") and not a.get_text(strip=True):
            a.decompose()
    return str(frag)


def is_anchor_paragraph(el: Tag | None) -> bool:
    if el is None or el.name != "p":
        return False
    kids = [k for k in el.children if not (isinstance(k, NavigableString) and not k.strip())]
    return len(kids) == 1 and isinstance(kids[0], Tag) and kids[0].name == "a" and kids[0].has_attr("id")


def build_ref(el: Tag, page: str, page_title: str) -> dict[str, str]:
    """Preview for an explicit anchor: a table row, or the blocks that follow it."""
    ref_id = el["id"]
    entry = {"page": page, "pageTitle": page_title, "label": label_for(ref_id), "title": "", "snippet": ""}

    td = el.find_parent("td")
    if td is not None:
        tr = td.find_parent("tr")
        table = tr.find_parent("table")
        headers = [clean_text(th) for th in table.find_all("th")]
        cells = tr.find_all("td")
        texts = [clean_text(c) for c in cells]
        entry["title"] = next((t for t in texts[1:] if len(t) > 3), texts[0])[:140]
        rows = [f"<dt>{html.escape(h or '·')}</dt><dd>{strip_ids(c.decode_contents())}</dd>"
                for h, c in zip(headers, cells) if clean_text(c)]
        entry["snippet"] = "<dl class='ref-dl'>" + "".join(rows) + "</dl>"
        return entry

    start = el.parent if is_anchor_paragraph(el.parent) else el
    blocks: list[Tag] = []
    sib = start.find_next_sibling()
    while sib is not None and len(blocks) < 3:
        if is_anchor_paragraph(sib) or (blocks and sib.name in {"h2", "h3"}):
            break
        if sib.name in {"h2", "h3", "h4"} and not entry["title"]:
            entry["title"] = clean_text(sib)
        else:
            blocks.append(sib)
        sib = sib.find_next_sibling()
    if not entry["title"] and blocks:
        strong = blocks[0].find("strong")
        entry["title"] = clean_text(strong) if strong else clean_text(blocks[0])[:120]
    snippet = "".join(strip_ids(b) for b in blocks)
    if len(snippet) > 2600:
        snippet = strip_ids(blocks[0]) if blocks else ""
    entry["snippet"] = snippet
    return entry


def load() -> list[dict]:
    tracks = []
    for tdir in sorted(p for p in SRC.iterdir() if p.is_dir()):
        m = DIR_RE.match(tdir.name)
        if not m:
            raise SystemExit(f"{tdir}: track folders are named NN-slug")
        meta, body = parse_front((tdir / "_track.md").read_text(encoding="utf-8"), tdir / "_track.md")
        track = {"slug": tdir.name, "num": int(m.group(1)), "title": meta["title"], "kicker": meta.get("kicker", ""),
                 "summary": meta.get("summary", ""), "body": body, "lessons": []}
        for f in sorted(tdir.glob("*.md")):
            if f.name == "_track.md":
                continue
            fm = FILE_RE.match(f.name)
            if not fm:
                raise SystemExit(f"{f}: lesson files are named NN-slug.md")
            lmeta, lbody = parse_front(f.read_text(encoding="utf-8"), f)
            words = len(re.findall(r"\w+", lbody))
            level = int(lmeta.get("level", "0"))
            if not 0 <= level <= 4:
                raise SystemExit(f"{f}: level must be 0-4")
            track["lessons"].append({
                "slug": f"{tdir.name}/{f.stem}", "num": f"{track['num']}.{int(fm.group(1))}",
                "title": lmeta["title"], "level": level, "summary": lmeta.get("summary", ""),
                "outcomes": [o.strip() for o in lmeta.get("outcomes", "").split("|") if o.strip()],
                "minutes": int(lmeta.get("minutes") or max(5, round(words / 180))), "words": words, "body": lbody,
            })
        track["levels"] = sorted({les["level"] for les in track["lessons"]})
        tracks.append(track)
    return tracks


def post_process(soup: BeautifulSoup, page: str) -> None:
    for table in soup.find_all("table"):
        table.wrap(soup.new_tag("div", attrs={"class": "table-wrap"}))
    for n, li in enumerate(soup.find_all("li")):
        first = li.contents[0] if li.contents else None
        if isinstance(first, NavigableString) and first.startswith("[ ] "):
            first.replace_with(first[4:])
            li.insert(0, soup.new_tag("input", attrs={"type": "checkbox", "class": "task-box", "data-key": f"{page}:{n}"}))
            li["class"] = li.get("class", []) + ["task"]
    for bq in soup.find_all("blockquote"):
        strong = bq.find("strong")
        if strong and clean_text(strong).lower().startswith("say"):
            bq["class"] = bq.get("class", []) + ["say"]
    for details in soup.find_all("details"):
        details["class"] = details.get("class", []) + ["qa"]


def main() -> None:
    tracks = load()
    pages: dict[str, dict] = {}
    for t in tracks:
        pages[t["slug"]] = {"title": f"{t['num']} · {t['title']}", "md": t["body"]}
        for les in t["lessons"]:
            pages[les["slug"]] = {"title": f"{les['num']} {les['title']}", "md": les["body"]}

    soups: dict[str, BeautifulSoup] = {}
    page_ids: dict[str, set[str]] = {}
    anchor_page: dict[str, str] = {}  # explicit <a id> anchors: globally unique
    for slug, p in pages.items():
        soup = BeautifulSoup(render_md(p["md"]), "html.parser")
        soups[slug] = soup
        page_ids[slug] = {el["id"] for el in soup.find_all(id=True)}
        for a in soup.find_all("a", id=True):
            if a["id"] in anchor_page:
                raise SystemExit(f"Duplicate anchor id {a['id']!r} in {slug} and {anchor_page[a['id']]}")
            anchor_page[a["id"]] = slug

    errors: list[str] = []
    for slug, soup in soups.items():
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("#"):
                target = href[1:]
                if target in page_ids[slug]:
                    dest = slug
                elif target in anchor_page:
                    dest = anchor_page[target]
                else:
                    errors.append(f"{slug}: unknown anchor {href}")
                    continue
                if target in anchor_page:
                    a["data-ref"] = target
                    a["class"] = a.get("class", []) + ["xref"]
                a["href"] = href if dest == slug else f"/{dest}#{target}"
            elif href.startswith("/") and not href.startswith("//"):
                path, _, frag = href.partition("#")
                path = path.rstrip("/") or "/"
                if path not in STATIC_ROUTES and path.lstrip("/") not in pages:
                    errors.append(f"{slug}: unknown page {href}")
                elif frag and path.lstrip("/") in page_ids and frag not in page_ids[path.lstrip("/")]:
                    errors.append(f"{slug}: unknown anchor {href}")
            elif href.startswith("http"):
                a["target"] = "_blank"
                a["rel"] = "noopener noreferrer"
                a["class"] = a.get("class", []) + ["ext"]
        post_process(soup, slug)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(f"{len(errors)} broken link(s)")

    refs: dict[str, dict] = {}
    search: list[dict] = []
    for slug, soup in soups.items():
        title = pages[slug]["title"]
        for a in soup.find_all("a", id=True):
            entry = build_ref(a, slug, title)
            entry["kind"] = "item"
            refs[a["id"]] = entry
            search.append({"label": entry["label"], "title": entry["title"], "href": f"/{slug}#{a['id']}",
                           "context": title, "kind": "item", "text": re.sub(r"<[^>]+>", " ", entry["snippet"])[:400]})
        for h in soup.find_all(["h2", "h3"], id=True):
            search.append({"label": "§", "title": clean_text(h), "href": f"/{slug}#{h['id']}",
                           "context": title, "kind": "heading", "text": ""})

    toc = []
    for t in tracks:
        lessons = [{k: v for k, v in les.items() if k != "body"} for les in t["lessons"]]
        toc.append({k: v for k, v in t.items() if k not in {"body", "lessons"}} | {"lessons": lessons})
        search.append({"label": f"Part {t['num']}", "title": t["title"], "href": f"/{t['slug']}",
                       "context": t["kicker"], "kind": "track", "text": t["summary"]})
        for les in lessons:
            search.append({"label": les["num"], "title": les["title"], "href": f"/{les['slug']}",
                           "context": t["title"], "kind": "lesson", "text": les["summary"]})

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "tracks.json").write_text(json.dumps(toc, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT / "pages.json").write_text(json.dumps({s: {"title": p["title"], "html": str(soups[s])} for s, p in pages.items()},
                                               ensure_ascii=False), encoding="utf-8")
    (OUT / "refs.json").write_text(json.dumps(refs, ensure_ascii=False), encoding="utf-8")
    (OUT / "search.json").write_text(json.dumps(search, ensure_ascii=False), encoding="utf-8")
    n_lessons = sum(len(t["lessons"]) for t in tracks)
    words = sum(les["words"] for t in tracks for les in t["lessons"])
    print(f"Compiled {len(tracks)} tracks, {n_lessons} lessons, {words:,} words, {len(refs)} anchors -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
