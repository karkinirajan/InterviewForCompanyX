"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { store } from "@/lib/storage";

interface Heading { id: string; text: string; level: number }

const FILL_RE = /(\[(?:fill each|fill|confirm)\])/;

/** Highlight the element a #hash points at (the row for table anchors, the next block for bare anchors). */
export function flashHash(): void {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  let target: Element = el;
  const row = el.closest("tr");
  if (row) target = row;
  else if (el.tagName === "A" && el.parentElement?.tagName === "P" && el.parentElement.textContent?.trim() === "")
    target = el.parentElement.nextElementSibling ?? el;
  target.classList.remove("flash");
  void (target as HTMLElement).offsetWidth;
  target.classList.add("flash");
  el.scrollIntoView({ block: "start" });
}

function enhance(root: HTMLElement): void {
  // Copy buttons on code blocks.
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return;
    const code = pre.innerText;
    const b = document.createElement("button");
    b.className = "copy-btn"; b.type = "button"; b.textContent = "Copy";
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(code); b.textContent = "Copied ✓"; }
      catch { b.textContent = "Select & copy"; }
      window.setTimeout(() => (b.textContent = "Copy"), 1600);
    });
    pre.appendChild(b);
  });

  // Highlight [fill] / [confirm] markers (facts only you can supply).
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits: Text[] = [];
  while (walker.nextNode()) {
    const n = walker.currentNode as Text;
    if (FILL_RE.test(n.nodeValue ?? "") && !n.parentElement?.closest("pre, code, .fill-tag")) hits.push(n);
  }
  hits.forEach((n) => {
    const frag = document.createDocumentFragment();
    (n.nodeValue ?? "").split(FILL_RE).forEach((part) => {
      if (!part) return;
      if (FILL_RE.test(part) && part.startsWith("[")) {
        const s = document.createElement("span");
        s.className = "fill-tag"; s.textContent = part; frag.appendChild(s);
      } else frag.appendChild(document.createTextNode(part));
    });
    n.parentNode?.replaceChild(frag, n);
  });

  // Persistent checklists.
  root.querySelectorAll<HTMLInputElement>(".task-box").forEach((box) => {
    const key = `task:${box.dataset.key}`;
    const li = box.closest("li");
    box.checked = store.get(key, false);
    li?.classList.toggle("checked", box.checked);
    box.addEventListener("change", () => {
      store.set(key, box.checked);
      li?.classList.toggle("checked", box.checked);
    });
  });
}

/** Rendered Markdown for one page. HTML comes from our own build step (content/curriculum/). */
export const Prose = memo(function Prose({ html, page, before, after }: { html: string; page: string; before?: ReactNode; after?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [heads, setHeads] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    enhance(root);
    const hs: HTMLElement[] = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"));
    // Lesson chrome outside the article: the key points box and the projects section.
    const top = document.getElementById("key-points");
    const bottom = document.getElementById("build-to-remember");
    if (top) hs.unshift(top);
    if (bottom) hs.push(bottom);
    setHeads(hs.map((h) => ({
      id: h.id,
      text: h === top ? "Key points" : (h.textContent ?? "").replace(/^Part \d+ · /, ""),
      level: h.tagName === "H3" ? 3 : 2,
    })));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-80px 0px -70% 0px" });
    hs.forEach((h) => io.observe(h));

    const t = window.setTimeout(flashHash, 80);
    window.addEventListener("hashchange", flashHash);
    return () => { io.disconnect(); window.clearTimeout(t); window.removeEventListener("hashchange", flashHash); };
  }, [html, page]);

  return (
    <div className="layout">
      <main className="main" id="main">
        {before}
        <article className="prose" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        {after}
      </main>
      <aside className="rail" aria-label="On this page">
        {heads.length > 0 && <h4>On this page</h4>}
        {heads.map((h) => (
          <a key={h.id} href={`#${h.id}`} className={`lvl-${h.level}${active === h.id ? " active" : ""}`}>{h.text}</a>
        ))}
      </aside>
    </div>
  );
});
