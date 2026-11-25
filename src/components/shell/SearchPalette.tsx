import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTE_SLUG, SEARCH, TECH_MAP_SLUG, type SearchEntry } from "@/lib/content";

type Entry = SearchEntry & { hay: string };

const INDEX: Entry[] = [
  ...SEARCH,
  { label: "Map", title: "Tech flow map", href: `/${TECH_MAP_SLUG}`, context: "Tools", kind: "track" as const, text: "libraries frameworks diagram" },
  { label: "Route", title: "Interview route", href: `/${ROUTE_SLUG}`, context: "Follow-through", kind: "track" as const, text: "interview prep order plan follow through" },
].map((e) => ({ ...e, hay: `${e.label} ${e.title} ${e.context} ${e.text}`.toLowerCase() }));

const KIND_BONUS: Record<SearchEntry["kind"], number> = { lesson: 8, track: 6, item: 4, heading: 0 };

function search(raw: string): Entry[] {
  const q = raw.trim().toLowerCase();
  if (!q) return INDEX.filter((x) => x.kind === "track");
  const terms = q.split(/\s+/);
  return INDEX.map((x) => {
    const label = x.label.toLowerCase();
    const title = x.title.toLowerCase();
    let score = 0;
    if (label === q) score += 100;
    else if (label.startsWith(q) && x.kind !== "heading") score += 40;
    if (title.includes(q)) score += 30;
    if (terms.every((t) => x.hay.includes(t))) score += 10;
    else if (score === 0) return null;
    return { x, score: score + KIND_BONUS[x.kind] };
  })
    .filter((r): r is { x: Entry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
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
    router.push(r.href);
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
          placeholder="Search lessons, questions (Q12), drills (D1), terms (pgvector, retry)…"
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
            <li key={`${r.href}-${r.label}`} className={i === sel ? "sel" : ""} onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
              <span className="pr-label">{r.label}</span>
              <span className="pr-title">{r.title}</span>
              <span className="pr-page">{r.context}</span>
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
