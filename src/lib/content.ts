import stagesConfig from "@content/stages.json";
import pagesJson from "@/content/generated/pages.json";
import refsJson from "@/content/generated/refs.json";

export interface Stage {
  slug: string; num: number; minutes: number; parts: number[];
  title: string; kicker: string; goal: string; gate: string;
}
export interface ReferencePage { slug: string; title: string; kicker: string; parts?: number[] }
export interface Ref { page: string; pageTitle: string; label: string; title: string; snippet: string; kind: "heading" | "item" }
export interface RenderedPage { title: string; html: string }

export const STAGES: Stage[] = stagesConfig.stages;
export const REFERENCE_PAGES: ReferencePage[] = stagesConfig.reference;
export const PAGES: Record<string, RenderedPage> = pagesJson;
export const REFS: Record<string, Ref> = refsJson as Record<string, Ref>;

export const TOTAL_MINUTES = STAGES.reduce((n, s) => n + s.minutes, 0);
export const INTERVIEW_AT = new Date("2026-11-25T13:00:00+05:45").getTime();
export const TECH_MAP_SLUG = "09-tech-flow-map";

export function refHref(id: string, currentPage?: string): string {
  const r = REFS[id];
  if (!r) return `#${id}`;
  return r.page === currentPage ? `#${id}` : `/${r.page}#${id}`;
}
