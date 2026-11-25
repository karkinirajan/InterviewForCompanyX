# Deliberate bugs in the content compiler (scripts/compile_content.py); each must make pytest fail.
# Run from the repository root (the driver checks the suite is green first; hands off the tree while it runs):
#   python3 tests/mutation/mutate.py tests/mutation/mutants_compiler.py -- uv run --locked pytest -x -q
#
# Not listed, because they cannot change behaviour: none so far.

CC = "scripts/compile_content.py"

M = [
    # front matter
    ("front: a lesson without a title is accepted", CC,
     'if not isinstance(meta, dict) or not isinstance(meta.get("title"), str):', "if not isinstance(meta, dict):"),
    ("inline: the wrapping <p> is kept", CC,
     'return re.sub(r"^<p>(.*)</p>$", r"\\1", html_.strip(), flags=re.S)', "return html_.strip()"),
    # quality gate: key points and projects
    ("gate: two key points are enough", CC, "3 <= len(kps) <= 8", "2 <= len(kps) <= 8"),
    ("gate: nine key points are allowed", CC, "3 <= len(kps) <= 8", "3 <= len(kps) <= 9"),
    ("gate: non-string key points pass", CC, " and all(isinstance(k, str) for k in kps)", ""),
    ("gate: one project is enough", CC, "and len(projects) == 2)", "and len(projects) >= 1)"),
    ("gate: a project needs no stack", CC, '{"name", "stack", "build", "practises"} <= pr.keys()', '{"name", "build", "practises"} <= pr.keys()'),
    ("gate: an empty stack passes", CC, 'and isinstance(pr["stack"], list) and pr["stack"]):', 'and isinstance(pr["stack"], list)):'),
    ("gate: drafting is the default", CC, 'if not os.environ.get("CONTENT_DRAFT"):', 'if os.environ.get("CONTENT_DRAFT"):'),
    ("route: an unknown lesson is skipped silently", CC,
     "            if les is None:\n                PROBLEMS.append(", "            if les is None:\n                (lambda *_: None)("),
    # links and anchors
    ("links: duplicate anchors are allowed", CC,
     "raise SystemExit(f\"Duplicate anchor id {a['id']!r} in {slug} and {anchor_page[a['id']]}\")", "pass"),
    ("links: unknown same-page anchors pass", CC,
     '                else:\n                    errors.append(f"{slug}: unknown anchor {href}")\n                    continue',
     '                else:\n                    continue'),
    ("links: unknown pages pass", CC,
     'if path not in STATIC_ROUTES and path.lstrip("/") not in pages:', "if False:"),
    ("links: unknown anchors on other pages pass", CC,
     'elif frag and path.lstrip("/") in page_ids and frag not in page_ids[path.lstrip("/")]:', "elif False:"),
    ("links: static routes are rejected", CC, 'STATIC_ROUTES = {"/", "/tech-map", "/interview-route"}', 'STATIC_ROUTES = {"/"}'),
    ("links: cross-page anchors are not rewritten", CC,
     'a["href"] = href if dest == slug else f"/{dest}#{target}"', 'a["href"] = href'),
    ("links: ID links lose their preview hook", CC, 'a["data-ref"] = target', 'a["data-x"] = target'),
    ("links: a broken link does not stop the build", CC, "    if errors:\n", "    if False:\n"),
    ("render: check-yourself blocks lose their class", CC,
     'details["class"] = details.get("class", []) + ["qa"]', 'details["class"] = details.get("class", [])'),
]
