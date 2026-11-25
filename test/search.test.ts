import { describe, expect, it } from "vitest";
import { buildIndex, search } from "@/lib/search";
import type { SearchEntry } from "@/lib/content";

const e = (label: string, title: string, kind: SearchEntry["kind"], text = ""): SearchEntry =>
  ({ label, title, kind, text, href: `/${label}`, context: "" });

const INDEX = buildIndex([
  e("Part 8", "Retrieval-augmented generation", "track", "embeddings rag"),
  e("8.4", "Vector stores and pgvector", "lesson", "pgvector hnsw tenant"),
  e("Q12", "Provider times out, returns 429, or returns garbage?", "item", "retry backoff"),
  e("Q1", "Walk me through a RAG pipeline end to end.", "item", "ingest chunk embed"),
  e("§", "Retry policy", "heading"),
  e("C4", "pgvector: schema, indexes, tenant-safe retrieval", "item", "rls hnsw"),
]);

describe("search", () => {
  it("returns only the parts for an empty or blank query", () => {
    expect(search(INDEX, "").map((r) => r.label)).toEqual(["Part 8"]);
    expect(search(INDEX, "   ").map((r) => r.label)).toEqual(["Part 8"]);
  });

  it("puts an exact ID first, ignoring case and surrounding space", () => {
    expect(search(INDEX, " q12 ")[0].label).toBe("Q12");
    expect(search(INDEX, "Q1")[0].label).toBe("Q1");
  });

  it("ranks an ID-prefix match above a text-only match", () => {
    const labels = search(INDEX, "q1").map((r) => r.label);
    expect(labels.indexOf("Q1")).toBeLessThan(labels.indexOf("Q12"));
  });

  it("requires every term to appear when nothing else matches", () => {
    expect(search(INDEX, "pgvector tenant").map((r) => r.label).sort()).toEqual(["8.4", "C4"]);
    expect(search(INDEX, "pgvector kafka")).toEqual([]);
  });

  it("prefers a lesson to an item at equal text score", () => {
    expect(search(INDEX, "pgvector")[0].label).toBe("8.4");
  });

  it("does not give headings the ID-prefix bonus", () => {
    const r = search(INDEX, "retry");
    expect(r[0].label).toBe("§");          // title match (30), no prefix bonus for "§"
    expect(r.map((x) => x.label)).toContain("Q12");
  });

  it("ranks a heading by its text, never by an ID-like label prefix", () => {
    const idx = buildIndex([e("Q1", "unrelated", "heading"), e("Z", "q notes", "item")]);
    // Heading: no prefix bonus, only the term match (10). Item: title (30) + term (10) + item bonus (4).
    expect(search(idx, "q").map((r) => r.label)).toEqual(["Z", "Q1"]);
  });

  it("caps the result list", () => {
    const many = buildIndex(Array.from({ length: 80 }, (_, i) => e(`X${i}`, "same words", "item")));
    expect(search(many, "same").length).toBe(50);
  });
});
