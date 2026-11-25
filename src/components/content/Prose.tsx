"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { store } from "@/lib/storage";

interface Heading { id: string; text: string; level: number }

const FILL_RE = /(\[(?:fill each|fill|decide|confirm)\])/;

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

function enhance(root: HTMLElement, page: string): void {
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

  // Severity colouring for red-flag rows.
  root.querySelectorAll("tbody tr").forEach((tr) => {
    const t = tr.textContent ?? "";
    if (t.includes("🔴")) tr.classList.add("sev-red");
    else if (t.includes("🟠")) tr.classList.add("sev-orange");
    else if (t.includes("🟡")) tr.classList.add("sev-yellow");
  });

  // Highlight [fill] / [decide] / [confirm] markers.
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

  // Empty cells in the decide / metric tables become saved notes.
  root.querySelectorAll("table").forEach((table, ti) => {
    if (table.closest("#x1") || table.querySelector("th:nth-child(9)")) return; // evidence matrix blanks are meaningful
    table.querySelectorAll<HTMLTableCellElement>("tbody td").forEach((td, ci) => {
      if (td.isContentEditable || td.textContent?.trim() || td.children.length) return;
      const key = `cell:${page}:${ti}:${ci}`;
      td.contentEditable = "true";
      td.textContent = store.get(key, "");
      td.addEventListener("input", () => store.set(key, td.textContent ?? ""));
    });
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

/** Rendered Markdown for one page. HTML comes from our own build step (content/manual.md). */
export const Prose = memo(function Prose({ html, page, before, after }: { html: string; page: string; before?: ReactNode; after?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [heads, setHeads] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    enhance(root, page);
    const hs = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"));
    setHeads(hs.map((h) => ({ id: h.id, text: (h.textContent ?? "").replace(/^Part \d+ · /, ""), level: Number(h.tagName[1]) })));

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
