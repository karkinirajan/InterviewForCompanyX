"""Behaviour of the content compiler: front matter, quality gates, links and outputs."""
import json
import pathlib

import pytest

ROOT = pathlib.Path(__file__).resolve().parents[2]

PROJECTS = """projects:
- name: First
  stack: [Python]
  build: Build it.
  practises: Things.
- name: Second
  stack: [TypeScript]
  build: Build that.
  practises: Other things.
"""


def lesson(title="A lesson", body="## Why this matters\n\nText.\n", keypoints=3, projects=PROJECTS):
    kps = "".join(f"- Point {i}\n" for i in range(keypoints))
    return f"---\ntitle: {title}\nlevel: 1\nsummary: S.\nkeypoints:\n{kps}{projects}---\n{body}"


def make_site(tmp_path, cc, lessons, route=None):
    """Write a curriculum under tmp_path and point the compiler at it."""
    src = tmp_path / "curriculum"
    for slug, text in lessons.items():
        track, name = slug.split("/")
        (src / track).mkdir(parents=True, exist_ok=True)
        if not (src / track / "_track.md").exists():
            (src / track / "_track.md").write_text(f"---\ntitle: Track {track}\n---\nIntro.\n")
        (src / track / f"{name}.md").write_text(text)
    route_file = tmp_path / "route.yaml"
    route_file.write_text(route or "stages: []\n")
    cc.SRC, cc.OUT, cc.ROUTE_FILE, cc.ROOT = src, tmp_path / "out", route_file, tmp_path
    return tmp_path / "out"


# ---- front matter ---------------------------------------------------------------------------

def test_front_matter_is_parsed_as_yaml(cc, tmp_path):
    meta, body = cc.parse_front('---\ntitle: "A: b"\nlevel: 2\n---\nBody\n', tmp_path / "x.md")
    assert meta == {"title": "A: b", "level": 2}
    assert body == "Body\n"


@pytest.mark.parametrize("text", ["no front matter\n", "---\ntitle: [unclosed\n---\n", "---\nlevel: 1\n---\n"])
def test_bad_front_matter_stops_the_build(cc, tmp_path, text):
    with pytest.raises(SystemExit):
        cc.parse_front(text, tmp_path / "x.md")


def test_render_inline_drops_the_wrapping_paragraph(cc):
    assert cc.render_inline("Use **RRF** and `k=60`") == "Use <strong>RRF</strong> and <code>k=60</code>"


@pytest.mark.parametrize(("ref", "label"), [("q12", "Q12"), ("p0", "P0"), ("g-rrf", "RRF"), ("m-defense", "M Defense")])
def test_anchor_labels(cc, ref, label):
    assert cc.label_for(ref) == label


# ---- lesson quality gate --------------------------------------------------------------------

def gate(cc, meta):
    cc.PROBLEMS.clear()
    cc.check_lesson(meta, pathlib.Path("x.md"))
    return list(cc.PROBLEMS)


GOOD_PROJECTS = [{"name": "a", "stack": ["x"], "build": "b", "practises": "p"},
                 {"name": "c", "stack": ["y"], "build": "d", "practises": "q"}]


@pytest.mark.parametrize("count", [3, 8])
def test_three_to_eight_keypoints_pass(cc, count):
    assert gate(cc, {"keypoints": ["k"] * count, "projects": GOOD_PROJECTS}) == []


@pytest.mark.parametrize("keypoints", [["k"] * 2, ["k"] * 9, None, ["k", "k", {"not": "a string"}]])
def test_wrong_keypoints_fail(cc, keypoints):
    assert gate(cc, {"keypoints": keypoints, "projects": GOOD_PROJECTS})


@pytest.mark.parametrize("projects", [GOOD_PROJECTS[:1], GOOD_PROJECTS * 2, None])
def test_exactly_two_projects_required(cc, projects):
    assert gate(cc, {"keypoints": ["k"] * 3, "projects": projects})


@pytest.mark.parametrize("broken", [
    {"name": "a", "build": "b", "practises": "p"},                     # no stack
    {"name": "a", "stack": [], "build": "b", "practises": "p"},        # empty stack
    {"name": "a", "stack": "Python", "build": "b", "practises": "p"},  # stack not a list
    {"name": "a", "stack": ["x"], "practises": "p"},                   # no build
])
def test_incomplete_project_fails(cc, broken):
    assert gate(cc, {"keypoints": ["k"] * 3, "projects": [GOOD_PROJECTS[0], broken]})


# ---- whole build ----------------------------------------------------------------------------

def test_valid_site_compiles_and_rewrites_cross_page_anchors(cc, tmp_path):
    out = make_site(tmp_path, cc, {
        "01-a/01-one": lesson(body='## Why this matters\n\n<a id="q1"></a>\n\n**Q1. A question?** Answer.\n'),
        "01-a/02-two": lesson(body="## Why\n\nSee [Q1](#q1) and [why](#why) and [one](/01-a/01-one).\n"),
    }, route="stages:\n- title: S\n  steps:\n  - lesson: 01-a/02-two\n    focus: F\n")
    cc.main()
    pages = json.loads((out / "pages.json").read_text())
    two = pages["01-a/02-two"]["html"]
    assert 'href="/01-a/01-one#q1"' in two and 'data-ref="q1"' in two      # cross-page ID link
    assert 'href="#why"' in two                                            # same-page heading stays local
    refs = json.loads((out / "refs.json").read_text())
    assert refs["q1"]["page"] == "01-a/01-one" and refs["q1"]["label"] == "Q1"
    route = json.loads((out / "route.json").read_text())
    assert route[0]["steps"][0]["slug"] == "01-a/02-two"
    tracks = json.loads((out / "tracks.json").read_text())
    assert [les["num"] for les in tracks[0]["lessons"]] == ["1.1", "1.2"]


@pytest.mark.parametrize("body", ["[x](/01-a/99-missing)", "[x](#nowhere)", "[x](/01-a/01-one#nowhere)"])
def test_broken_links_stop_the_build(cc, tmp_path, body):
    make_site(tmp_path, cc, {"01-a/01-one": lesson(body=f"## H\n\n{body}\n")})
    with pytest.raises(SystemExit, match="broken link"):
        cc.main()


def test_static_routes_are_valid_link_targets(cc, tmp_path):
    out = make_site(tmp_path, cc, {"01-a/01-one": lesson(body="[a](/) [b](/tech-map) [c](/interview-route)\n")})
    cc.main()
    assert (out / "pages.json").exists()


def test_duplicate_anchor_ids_stop_the_build(cc, tmp_path):
    make_site(tmp_path, cc, {
        "01-a/01-one": lesson(body='<a id="q1"></a>\n\nA\n'),
        "01-a/02-two": lesson(body='<a id="q1"></a>\n\nB\n'),
    })
    with pytest.raises(SystemExit, match="Duplicate anchor"):
        cc.main()


def test_route_to_unknown_lesson_stops_the_build(cc, tmp_path):
    make_site(tmp_path, cc, {"01-a/01-one": lesson()},
              route="stages:\n- title: S\n  steps:\n  - lesson: 01-a/09-gone\n")
    with pytest.raises(SystemExit, match="content problem"):
        cc.main()


def test_missing_keypoints_stop_the_build_unless_drafting(cc, tmp_path, monkeypatch):
    make_site(tmp_path, cc, {"01-a/01-one": lesson(keypoints=1)})
    with pytest.raises(SystemExit, match="content problem"):
        cc.main()
    monkeypatch.setenv("CONTENT_DRAFT", "1")
    cc.PROBLEMS.clear()
    cc.main()


def test_check_yourself_details_get_the_qa_class(cc, tmp_path):
    body = '<details markdown="1"><summary>Q?</summary>\n\nA.\n\n</details>\n'
    out = make_site(tmp_path, cc, {"01-a/01-one": lesson(body=body)})
    cc.main()
    html = json.loads((out / "pages.json").read_text())["01-a/01-one"]["html"]
    assert '<details class="qa">' in html and "<p>A.</p>" in html


# ---- golden: the real curriculum ------------------------------------------------------------

def test_real_curriculum_compiles_with_every_numbered_item(cc, tmp_path):
    cc.OUT = tmp_path / "out"
    cc.main()
    refs = json.loads((cc.OUT / "refs.json").read_text())
    expected = ([f"q{i}" for i in range(1, 45)] + [f"d{i}" for i in range(1, 5)] + [f"c{i}" for i in range(1, 6)]
                + [f"p{i}" for i in range(0, 20)] + [f"s{i}" for i in range(1, 12)])
    assert [r for r in expected if r not in refs] == []
    tracks = json.loads((cc.OUT / "tracks.json").read_text())
    lessons = [les for t in tracks for les in t["lessons"]]
    assert len(tracks) == 15
    assert all(len(les["projects"]) == 2 and 3 <= len(les["keypoints"]) <= 8 for les in lessons)
