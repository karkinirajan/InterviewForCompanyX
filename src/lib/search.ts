import type { SearchEntry } from "@/lib/content";

/** A search entry with its lowercased haystack precomputed. */
export type IndexedEntry = SearchEntry & { hay: string };

export const KIND_BONUS: Record<SearchEntry["kind"], number> = { lesson: 8, track: 6, item: 4, heading: 0 };
export const MAX_RESULTS = 50;

export function buildIndex(entries: SearchEntry[]): IndexedEntry[] {
  return entries.map((e) => ({ ...e, hay: `${e.label} ${e.title} ${e.context} ${e.text}`.toLowerCase() }));
}

/**
 * Rank entries for a query. An exact ID (Q12) wins; an ID prefix and a title match rank next; otherwise every
 * term must appear somewhere. Lessons outrank parts, items and headings at equal score. Empty query: the parts.
 */
export function search(index: IndexedEntry[], raw: string): IndexedEntry[] {
  const q = raw.trim().toLowerCase();
  if (!q) return index.filter((x) => x.kind === "track");
  const terms = q.split(/\s+/);
  return index
    .map((x) => {
      const label = x.label.toLowerCase();
      let score = 0;
      if (label === q) score += 100;
      else if (label.startsWith(q) && x.kind !== "heading") score += 40;
      if (x.title.toLowerCase().includes(q)) score += 30;
      if (terms.every((t) => x.hay.includes(t))) score += 10;
      else if (score === 0) return null;
      return { x, score: score + KIND_BONUS[x.kind] };
    })
    .filter((r): r is { x: IndexedEntry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((r) => r.x);
}
