import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REFS, STAGES, TECH_MAP_SLUG } from "@/lib/content";

interface Entry { id: string; label: string; title: string; page: string; pageTitle: string; kind: string; hay: string }

const INDEX: Entry[] = [
  ...Object.entries(REFS).map(([id, r]) => ({
    id, label: r.label, title: r.title, page: r.page, pageTitle: r.pageTitle, kind: r.kind,
    hay: `${r.label} ${r.title} ${r.snippet.replace(/<[^>]+>/g, " ")}`.toLowerCase(),
  })),
  ...STAGES.map((s) => ({
    id: "", label: `Stage ${s.num}`, title: s.title, page: s.slug, pageTitle: `${s.minutes} min`, kind: "stage",
    hay: `stage ${s.num} ${s.title} ${s.kicker}`.toLowerCase(),
  })),
  { id: "", label: "Map", title: "Tech flow map", page: TECH_MAP_SLUG, pageTitle: "Reference", kind: "stage", hay: "tech flow map libraries frameworks diagram" },
];

function search(raw: string): Entry[] {
  const q = raw.trim().toLowerCase();
  if (!q) return INDEX.filter((x) => x.kind === "stage");
  const terms = q.split(/\s+/);
  return INDEX.map((x) => {
    const label = x.label.toLowerCase();
    let score = 0;
    if (label === q) score += 100;
    else if (label.startsWith(q)) score += 50;
    if (x.title.toLowerCase().includes(q)) score += 25;
    if (terms.every((t) => x.hay.includes(t))) score += 10;
    else if (score === 0) return null;
    if (x.kind === "item") score += 3;
    return { x, score };
  })
    .filter((r): r is { x: Entry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map((r) => r.x);
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); window.setTimeout(() => input.current?.focus(), 0); }
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(".sel")?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  const go = (r?: Entry) => {
    if (!r) return;
    onClose();
    router.push(`/${r.page === "index" ? "" : r.page}${r.id ? `#${r.id}` : ""}`);
  };

  return (
    <div className="palette" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette-box" role="dialog" aria-modal="true" aria-label="Search">
        <input
          ref={input}
          id="palette-input"
          type="search"
          value={q}
          autoComplete="off"
          placeholder="Type an ID (Q20, R1, P1) or a word (injection, pgvector)…"
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { setSel((s) => Math.min(s + 1, results.length - 1)); e.preventDefault(); }
            else if (e.key === "ArrowUp") { setSel((s) => Math.max(s - 1, 0)); e.preventDefault(); }
            else if (e.key === "Enter") go(results[sel]);
            else if (e.key === "Escape") onClose();
          }}
        />
        <ul id="palette-results" ref={list}>
          {results.length === 0 && (
            <li><span /><span className="pr-title muted">No match. Try an ID like Q12 or a word like “retry”.</span></li>
          )}
          {results.map((r, i) => (
            <li key={`${r.page}-${r.id}-${r.label}`} className={i === sel ? "sel" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
              <span className="pr-label">{r.label}</span>
              <span className="pr-title">{r.title}</span>
              <span className="pr-page">{r.pageTitle}</span>
            </li>
          ))}
        </ul>
        <div className="palette-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
