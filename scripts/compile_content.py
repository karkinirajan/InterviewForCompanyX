"""Compile content/manual.md into JSON the Next.js app renders.

content/manual.md   single source of truth (Parts 0-17)
content/stages.json which Parts go on which page, plus stage metadata
  -> src/content/generated/pages.json  rendered HTML per page (links rewritten to /slug#id)
  -> src/content/generated/refs.json   reference index for hover previews and search

Run:  npm run content   (runs automatically before dev and build)
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

import markdown
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "manual.md"
CONFIG = json.loads((ROOT / "content" / "stages.json").read_text(encoding="utf-8"))
OUT = ROOT / "src" / "content" / "generated"
PART_RE = re.compile(r'<a id="part(\d+)"></a>')


def split_parts(text: str) -> dict[int, str]:
    pieces = PART_RE.split(text)
    return {int(pieces[i]): f'<a id="part{pieces[i]}"></a>' + pieces[i + 1] for i in range(1, len(pieces), 2)}


def render_md(text: str) -> str:
    return markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "toc"],
        extension_configs={"toc": {"permalink": False}},
        output_format="html",
    )


LABELS = {"m-table": "M-table", "lf-products": "Products", "lf-process": "Format", "why-leapfrog": "Why LF",
          "coding-round": "Protocol", "hipaa": "HIPAA", "x1": "X1", "jd": "JD map"}


def label_for(ref_id: str) -> str:
    if ref_id in LABELS:
        return LABELS[ref_id]
    m = re.fullmatch(r"([a-z])(\d+)", ref_id)
    if m:
        return m.group(1).upper() + m.group(2)
    m = re.fullmatch(r"part(\d+)", ref_id)
    if m:
        return f"Part {m.group(1)}"
    if ref_id.startswith("g-"):
        return ref_id[2:].upper()
    return ref_id.replace("-", " ").title()


def clean_text(node: Tag) -> str:
    return re.sub(r"\s+", " ", node.get_text("")).strip()


def strip_ids(fragment: Tag | str) -> str:
    frag = BeautifulSoup(str(fragment), "html.parser")
    for el in frag.find_all(True):
        if el.has_attr("id"):
            del el["id"]
    for a in frag.find_all("a"):
        if not a.get("href") and not a.get_text(strip=True):
            a.decompose()
    return str(frag)


def is_anchor_paragraph(el: Tag) -> bool:
    if el.name != "p":
        return False
    kids = [k for k in el.children if not (isinstance(k, NavigableString) and not k.strip())]
    return len(kids) == 1 and isinstance(kids[0], Tag) and kids[0].name == "a" and kids[0].has_attr("id")


def build_ref(el: Tag, page: str, page_title: str) -> dict[str, str]:
    ref_id = el["id"]
    entry = {"page": page, "pageTitle": page_title, "label": label_for(ref_id), "title": "", "snippet": ""}

    # Case 1: anchor inside a table row -> use header/cell pairs.
    td = el.find_parent("td")
    if td is not None:
        tr = td.find_parent("tr")
        table = tr.find_parent("table")
        headers = [clean_text(th) for th in table.find_all("th")]
        cells = tr.find_all("td")
        texts = [clean_text(c) for c in cells]
        entry["title"] = next((t for t in texts[1:] if len(t) > 3), texts[0])[:140]
        rows = []
        for h, c in zip(headers, cells):
            if not clean_text(c):
                continue
            rows.append(f"<dt>{html.escape(h or '·')}</dt><dd>{strip_ids(c.decode_contents())}</dd>")
        entry["snippet"] = "<dl class='ref-dl'>" + "".join(rows) + "</dl>"
        return entry

    # Case 2: heading with an id (toc extension) -> next blocks.
    if el.name in {"h2", "h3", "h4"}:
        start = el
        entry["title"] = clean_text(el)
    else:
        # Case 3: <p><a id></a></p> standing before its content.
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


def post_process(page_html: str, page: str, id_to_page: dict[str, str]) -> str:
    soup = BeautifulSoup(page_html, "html.parser")

    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("#"):
            target = href[1:]
            dest = id_to_page.get(target)
            if dest is None:
                continue
            a["href"] = href if dest == page else f"/{dest}#{target}"
            a["data-ref"] = target
            a["class"] = a.get("class", []) + ["xref"]
        elif href.startswith("http"):
            a["target"] = "_blank"
            a["rel"] = "noopener noreferrer"
            a["class"] = a.get("class", []) + ["ext"]

    for table in soup.find_all("table"):
        wrap = soup.new_tag("div", attrs={"class": "table-wrap"})
        table.wrap(wrap)

    for n, li in enumerate(soup.find_all("li")):
        first = li.contents[0] if li.contents else None
        if isinstance(first, NavigableString) and first.startswith("[ ] "):
            first.replace_with(first[4:])
            box = soup.new_tag("input", attrs={"type": "checkbox", "class": "task-box", "data-key": f"{page}:{n}"})
            li.insert(0, box)
            li["class"] = li.get("class", []) + ["task"]

    for bq in soup.find_all("blockquote"):
        strong = bq.find("strong")
        if strong and clean_text(strong).lower().startswith("say"):
            bq["class"] = bq.get("class", []) + ["say"]

    return str(soup)


def main() -> None:
    parts = split_parts(CONTENT.read_text(encoding="utf-8"))
    pages = [{"slug": s["slug"], "title": f"Stage {s['num']} · {s['title']}", "parts": s["parts"]} for s in CONFIG["stages"]]
    pages += [{"slug": r["slug"], "title": r["title"], "parts": r["parts"]} for r in CONFIG["reference"] if "parts" in r]

    missing = set(parts) - {p for page in pages for p in page["parts"]}
    if missing:
        raise SystemExit(f"Parts not placed on any page: {sorted(missing)}")

    id_to_page: dict[str, str] = {}
    for page in pages:
        page["html"] = render_md("\n\n".join(parts[n] for n in page["parts"]))
        for found in re.findall(r'id="([^"]+)"', page["html"]):
            id_to_page.setdefault(found, page["slug"])

    refs: dict[str, dict] = {}
    for page in pages:
        page["html"] = post_process(page["html"], page["slug"], id_to_page)
        soup = BeautifulSoup(page["html"], "html.parser")
        for el in soup.find_all(id=True):
            if el["id"] in refs:
                continue
            entry = build_ref(el, page["slug"], page["title"])
            entry["kind"] = "heading" if el.name in {"h2", "h3", "h4"} else "item"
            refs[el["id"]] = entry

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "pages.json").write_text(
        json.dumps({p["slug"]: {"title": p["title"], "html": p["html"]} for p in pages}, ensure_ascii=False), encoding="utf-8")
    (OUT / "refs.json").write_text(json.dumps(refs, ensure_ascii=False), encoding="utf-8")
    print(f"Compiled {len(pages)} pages, {len(refs)} references -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
