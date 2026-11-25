import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTE_SLUG, SEARCH, TECH_MAP_SLUG } from "@/lib/content";
import { buildIndex, search, type IndexedEntry } from "@/lib/search";

type Entry = IndexedEntry;

const INDEX = buildIndex([
  ...SEARCH,
  { label: "Map", title: "Tech flow map", href: `/${TECH_MAP_SLUG}`, context: "Tools", kind: "track", text: "libraries frameworks diagram" },
  { label: "Route", title: "Interview route", href: `/${ROUTE_SLUG}`, context: "Follow-through", kind: "track", text: "interview prep order plan follow through" },
]);

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const results = useMemo(() => search(INDEX, q), [q]);

  // Reset the query each time the palette opens (adjusting state during render, not in an effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) { setQ(""); setSel(0); }
  }

  useEffect(() => {
    if (open) window.setTimeout(() => input.current?.focus(), 0);
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
