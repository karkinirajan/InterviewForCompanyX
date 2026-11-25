"""Compile the curriculum in content/curriculum/ into JSON the Next.js app renders.

content/curriculum/
  NN-track-slug/
    _track.md            track front matter + introduction
    NN-lesson-slug.md    one lesson: front matter + Markdown body

Front matter is YAML between `---` fences.
  track:  title, kicker, summary
  lesson: title, level (0-4), summary, outcomes [list], keypoints [list],
          projects [exactly 2 x {name, stack [list], build, practises}], minutes (optional)

content/interview-route.yaml lists lessons in the order to follow before an interview.

Outputs (src/content/generated/):
  tracks.json   table of contents: tracks, lessons, levels, reading time
  pages.json    rendered HTML per page, keyed "track" or "track/lesson"
  refs.json     explicit <a id="..."> anchors (Q12, D1, C2, P1, S4, g-rrf...) for hover previews
  search.json   lessons, headings and anchors for the search palette
  route.json    the interview route, resolved against the lessons

The build fails on a link to a page or anchor that doesn't exist, or a lesson missing
key points or its two projects (set CONTENT_DRAFT=1 to only warn).

Run:  npm run content   (runs automatically before dev and build)
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
from pathlib import Path

import markdown
import yaml
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "curriculum"
OUT = ROOT / "src" / "content" / "generated"
FRONT_RE = re.compile(r"\A---\n(.*?)\n---\n", re.S)
DIR_RE = re.compile(r"^(\d{2})-([a-z0-9-]+)$")
FILE_RE = re.compile(r"^(\d{2})-([a-z0-9-]+)\.md$")
STATIC_ROUTES = {"/", "/tech-map", "/interview-route"}
ROUTE_FILE = ROOT / "content" / "interview-route.yaml"


def parse_front(text: str, where: Path) -> tuple[dict, str]:
    m = FRONT_RE.match(text)
    if not m:
        raise SystemExit(f"{where}: missing front matter")
    try:
        meta = yaml.safe_load(m.group(1))
    except yaml.YAMLError as exc:
        raise SystemExit(f"{where}: invalid YAML front matter: {exc}") from exc
    if not isinstance(meta, dict) or not isinstance(meta.get("title"), str):
        raise SystemExit(f"{where}: front matter needs at least a title")
    return meta, text[m.end():]


def render_inline(text: str) -> str:
    """Markdown for one short string (key point, project line), without the wrapping <p>."""
    html_ = markdown.markdown(str(text), output_format="html")
    return re.sub(r"^<p>(.*)</p>$", r"\1", html_.strip(), flags=re.S)


PROBLEMS: list[str] = []


def check_lesson(meta: dict, where: Path) -> None:
    kps = meta.get("keypoints")
    if not (isinstance(kps, list) and 3 <= len(kps) <= 8 and all(isinstance(k, str) for k in kps)):
        PROBLEMS.append(f"{where}: needs 3-8 keypoints")
    projects = meta.get("projects")
    if not (isinstance(projects, list) and len(projects) == 2):
        PROBLEMS.append(f"{where}: needs exactly 2 projects")
        return
    for pr in projects:
        if not (isinstance(pr, dict) and {"name", "stack", "build", "practises"} <= pr.keys()
                and isinstance(pr["stack"], list) and pr["stack"]):
            PROBLEMS.append(f"{where}: project needs name, stack [list], build, practises")


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
            level = int(lmeta.get("level", 0))
            if not 0 <= level <= 4:
                raise SystemExit(f"{f}: level must be 0-4")
            check_lesson(lmeta, f)
            track["lessons"].append({
                "slug": f"{tdir.name}/{f.stem}", "num": f"{track['num']}.{int(fm.group(1))}",
                "title": lmeta["title"], "level": level, "summary": lmeta.get("summary", ""),
                "outcomes": [render_inline(o) for o in lmeta.get("outcomes") or []],
                "keypoints": [render_inline(k) for k in lmeta.get("keypoints") or []],
                "projects": [{"name": pr.get("name", ""), "stack": [str(x) for x in pr.get("stack") or []],
                              "build": render_inline(pr.get("build", "")),
                              "practises": render_inline(pr.get("practises", ""))}
                             for pr in lmeta.get("projects") or [] if isinstance(pr, dict)],
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
                           "context": t["title"], "kind": "lesson",
                           "text": re.sub(r"<[^>]+>", " ", " ".join([les["summary"], *les["keypoints"],
                                   *(f"{pr['name']} {' '.join(pr['stack'])}" for pr in les["projects"])]))})

    lessons_by_slug = {les["slug"]: les for t in toc for les in t["lessons"]}
    route = []
    for stage in yaml.safe_load(ROUTE_FILE.read_text(encoding="utf-8"))["stages"]:
        steps = []
        for step in stage["steps"]:
            les = lessons_by_slug.get(step["lesson"])
            if les is None:
                PROBLEMS.append(f"{ROUTE_FILE.name}: unknown lesson {step['lesson']}")
                continue
            steps.append({"slug": les["slug"], "num": les["num"], "title": les["title"], "minutes": les["minutes"],
                          "focus": render_inline(step.get("focus", ""))})
        route.append({"title": stage["title"], "goal": render_inline(stage.get("goal", "")), "steps": steps})

    if PROBLEMS:
        print("\n".join(PROBLEMS), file=sys.stderr)
        if not os.environ.get("CONTENT_DRAFT"):
            raise SystemExit(f"{len(PROBLEMS)} content problem(s); set CONTENT_DRAFT=1 to build anyway")

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "route.json").write_text(json.dumps(route, ensure_ascii=False, indent=1), encoding="utf-8")
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
