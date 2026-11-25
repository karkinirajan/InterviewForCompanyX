import tracksJson from "@/content/generated/tracks.json";
import pagesJson from "@/content/generated/pages.json";
import refsJson from "@/content/generated/refs.json";
import searchJson from "@/content/generated/search.json";

export type Level = 0 | 1 | 2 | 3 | 4;
export interface Lesson {
  slug: string; num: string; title: string; level: Level; summary: string;
  outcomes: string[]; minutes: number; words: number;
}
export interface Track {
  slug: string; num: number; title: string; kicker: string; summary: string;
  levels: Level[]; lessons: Lesson[];
}
export interface Ref { page: string; pageTitle: string; label: string; title: string; snippet: string; kind: "item" }
export interface RenderedPage { title: string; html: string }
export interface SearchEntry { label: string; title: string; href: string; context: string; kind: "track" | "lesson" | "heading" | "item"; text: string }

export const TRACKS = tracksJson as Track[];
export const PAGES: Record<string, RenderedPage> = pagesJson;
export const REFS = refsJson as Record<string, Ref>;
export const SEARCH = searchJson as SearchEntry[];
export const TECH_MAP_SLUG = "tech-map";

/** Career levels the curriculum is graded against. */
export const LEVELS: { level: Level; name: string; short: string; blurb: string }[] = [
  { level: 0, name: "Intern", short: "L0", blurb: "Tools, one language, how the web works. You can follow a ticket with help." },
  { level: 1, name: "Junior engineer", short: "L1", blurb: "Ships features end to end in an existing codebase, with tests and review." },
  { level: 2, name: "Mid-level engineer", short: "L2", blurb: "Owns services: data, auth, deploys, observability. Unblocks themselves." },
  { level: 3, name: "Senior engineer", short: "L3", blurb: "Designs systems, makes trade-offs explicit, raises the bar for the team." },
  { level: 4, name: "Applied AI engineer", short: "L4", blurb: "Puts LLMs, RAG and agents into production software reliably, safely and at a known cost." },
];

export const ALL_LESSONS: (Lesson & { track: Track })[] = TRACKS.flatMap((t) => t.lessons.map((l) => ({ ...l, track: t })));
export const TOTAL_MINUTES = ALL_LESSONS.reduce((n, l) => n + l.minutes, 0);

export function findTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function refHref(id: string, currentPage?: string): string {
  const r = REFS[id];
  if (!r) return `#${id}`;
  return r.page === currentPage ? `#${id}` : `/${r.page}#${id}`;
}
