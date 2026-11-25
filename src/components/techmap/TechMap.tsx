"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { REFS, refHref, TECH_MAP_SLUG } from "@/lib/content";
import { store } from "@/lib/storage";
import { TECH_PHASES, type TechKind, type TechNode } from "@/data/tech-data";

const KIND_LABEL: Record<TechKind, string> = {
  used: "You've shipped with it",
  know: "Know it (not shipped yet)",
  concept: "Concept / pattern",
};

interface ChainNode extends TechNode { index: number; id: string; phase: string; phaseNum: number }

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Build one elbow/straight arrow path between two node boxes (coordinates relative to the flow container). */
function arrowPath(a: DOMRect, b: DOMRect, box: DOMRect): string {
  const ax = a.left - box.left, ay = a.top - box.top, bx = b.left - box.left, by = b.top - box.top;
  if (Math.abs(ay - by) < 6 && bx > ax) {
    const y = ay + a.height / 2;
    return `M${ax + a.width + 3},${y} L${bx - 5},${y}`;
  }
  const sx = ax + a.width / 2, sy = ay + a.height + 2;
  const ex = bx + Math.min(26, b.width / 2), ey = by - 5;
  const my = sy + Math.max(10, (ey - sy) / 2);
  const r = 10, dir = ex >= sx ? 1 : -1;
  if (Math.abs(ex - sx) < 2 * r) return `M${sx},${sy} L${sx},${my} L${ex},${my} L${ex},${ey}`;
  return `M${sx},${sy} L${sx},${my - r} Q${sx},${my} ${sx + dir * r},${my} L${ex - dir * r},${my} Q${ex},${my} ${ex},${my + r} L${ex},${ey}`;
}

export function TechMap() {
  const chain = useMemo<ChainNode[]>(() => {
    const out: ChainNode[] = [];
    TECH_PHASES.forEach((ph, pi) => ph.nodes.forEach((n) => {
      out.push({ ...n, index: out.length, id: `tech-${slug(n.name)}`, phase: ph.title, phaseNum: pi + 1 });
    }));
    return out;
  }, []);

  const flowRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [paths, setPaths] = useState<{ from: number; d: string }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [filter, setFilter] = useState("");
  const [current, setCurrent] = useState(-1);
  const [visited, setVisited] = useState<Set<number>>(new Set());

  const draw = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const box = flow.getBoundingClientRect();
    const next: { from: number; d: string }[] = [];
    for (let i = 0; i < chain.length - 1; i++) {
      const a = nodeRefs.current[i], b = nodeRefs.current[i + 1];
      if (a && b) next.push({ from: i, d: arrowPath(a.getBoundingClientRect(), b.getBoundingClientRect(), box) });
    }
    setSize({ w: box.width, h: box.height });
    setPaths(next);
  }, [chain.length]);

  useLayoutEffect(() => {
    draw();
    const flow = flowRef.current;
    if (!flow) return;
    const ro = new ResizeObserver(() => requestAnimationFrame(draw));
    ro.observe(flow);
    document.fonts?.ready.then(draw);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    setVisited(new Set(store.get<number[]>("tech-visited", [])));
    const hash = window.location.hash.slice(1);
    const i = chain.findIndex((n) => n.id === hash);
    if (i >= 0) setCurrent(i);
  }, [chain]);

  const open = useCallback((i: number) => {
    if (i < 0 || i >= chain.length) return;
    setCurrent(i);
    setVisited((prev) => {
      const next = new Set(prev).add(i);
      store.set("tech-visited", [...next]);
      return next;
    });
    window.history.replaceState(null, "", `#${chain[i].id}`);
    nodeRefs.current[i]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [chain]);

  const close = useCallback(() => {
    const i = current;
    setCurrent(-1);
    window.history.replaceState(null, "", `/${TECH_MAP_SLUG}`);
    nodeRefs.current[i]?.focus({ preventScroll: true });
  }, [current]);

  useEffect(() => {
    if (current < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") open(current + 1);
      else if (e.key === "ArrowLeft") open(current - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, open, close]);

  const terms = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (n: ChainNode) => {
    if (!terms.length) return true;
    const hay = [n.name, n.def, n.use, n.why, n.phase, n.kind].join(" ").toLowerCase();
    return terms.every((t) => hay.includes(t));
  };

  const node = current >= 0 ? chain[current] : null;
  const nextNode = node ? chain[node.index + 1] : undefined;

  let cursor = 0;
  return (
    <>
      <header className="stage-hero map-hero">
        <div className="stage-kicker">Reference · Every library, framework and service in the guide</div>
        <h1>Tech flow map</h1>
        <p className="hero-lede">
          Read it top to bottom: it follows the order you would build an AI product in, from language and framework to data,
          models, the RAG chain, agents, evaluation, cloud and shipping. Every arrow points to the next item in line. Click any
          node for its definition, where it shows up, and why it matters.
        </p>
        <div className="map-tools">
          <input type="search" id="map-filter" value={filter} onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter: e.g. rerank, AWS, speech…" autoComplete="off" />
          <div className="map-legend">
            <span><i className="lg lg-used" />You&apos;ve shipped with it</span>
            <span><i className="lg lg-know" />Know it (not shipped yet)</span>
            <span><i className="lg lg-concept" />Concept / pattern</span>
          </div>
          <button className="btn btn-primary" onClick={() => open(0)}>▶ Walk the chain from 1</button>
        </div>
      </header>

      <div className="flow" ref={flowRef}>
        <svg className="flow-arrows" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="ah-head" />
            </marker>
          </defs>
          {paths.map((p) => (
            <path key={p.from} d={p.d} markerEnd="url(#ah)"
              className={current >= 0 && (p.from === current || p.from === current - 1) ? "hot" : undefined} />
          ))}
        </svg>

        {TECH_PHASES.map((ph, pi) => {
          const first = cursor + 1;
          const nodes = chain.slice(cursor, cursor + ph.nodes.length);
          cursor += ph.nodes.length;
          return (
            <section className="phase" key={ph.title}>
              <div className="phase-head">
                <div className="phase-num">Phase {String(pi + 1).padStart(2, "0")} · {first}–{cursor}</div>
                <h3>{ph.title}</h3>
                <p>{ph.blurb}</p>
              </div>
              <div className="phase-nodes">
                {nodes.map((n) => (
                  <button
                    key={n.id}
                    id={n.id}
                    type="button"
                    ref={(el) => { nodeRefs.current[n.index] = el; }}
                    title={n.def}
                    onClick={() => open(n.index)}
                    className={["node", n.kind, matches(n) ? "" : "dim", visited.has(n.index) ? "visited" : "", current === n.index ? "current" : ""].join(" ").trim()}
                  >
                    <span className="n-idx">{n.index + 1}</span><span>{n.name}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {node && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="tm-title">
            <button className="icon-btn modal-close" onClick={close} aria-label="Close">✕</button>
            <div className="tm-kicker">#{node.index + 1} · Phase {node.phaseNum}: {node.phase} · {KIND_LABEL[node.kind]}</div>
            <h2 id="tm-title">{node.name}</h2>
            <ol className="tm-points">
              {[
                ["What it is", node.def],
                [node.kind === "used" ? "How you've used it" : "Where it shows up", node.use],
                ["Why it matters", node.why],
                ["Next in line", nextNode ? `${nextNode.name} (${nextNode.phase})` : "End of the chain. Back to the cheat sheet."],
              ].map(([k, v]) => (
                <li key={k}><div><b>{k}</b><span>{v}</span></div></li>
              ))}
            </ol>
            <div className="tm-links">
              {node.refs.some((id) => REFS[id]) && <span className="muted">In the guide:</span>}
              {node.refs.filter((id) => REFS[id]).map((id) => (
                <a key={id} className="xref" data-ref={id} href={refHref(id, TECH_MAP_SLUG)}>{REFS[id].label}</a>
              ))}
              {node.url && <a className="ext" href={node.url} target="_blank" rel="noopener noreferrer">Official docs</a>}
            </div>
            <div className="tm-nav">
              <button className="btn btn-ghost" onClick={() => open(node.index - 1)} disabled={node.index === 0}>← Previous in chain</button>
              <span>{node.index + 1} / {chain.length}</span>
              <button className="btn btn-primary" onClick={() => open(node.index + 1)} disabled={!nextNode}>Next in chain →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
