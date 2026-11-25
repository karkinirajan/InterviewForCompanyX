"use client";

import Link from "next/link";
import { STAGES, TECH_MAP_SLUG, type Stage } from "@/lib/content";
import { fmtClock, useManual } from "@/components/ManualProvider";

export function StageWindow({ slug }: { slug: string }) {
  const { stageWindow } = useManual();
  const w = stageWindow(slug);
  return <span className="stage-window">{w ? `Planned ${fmtClock(w.from)}–${fmtClock(w.to)}` : ""}</span>;
}

export function StageHero({ stage }: { stage: Stage }) {
  const { startTimer } = useManual();
  return (
    <header className="stage-hero">
      <div className="stage-kicker">Stage {stage.num} of {STAGES.length} · {stage.kicker}</div>
      <h1>{stage.title}</h1>
      <div className="stage-brief">
        <div className="brief-item"><span className="brief-k">Time</span><span className="brief-v">{stage.minutes} minutes</span></div>
        <div className="brief-item"><span className="brief-k">Goal</span><span className="brief-v">{stage.goal}</span></div>
        <div className="brief-item gate"><span className="brief-k">Gate</span><span className="brief-v">{stage.gate}</span></div>
      </div>
      <div className="stage-actions">
        <button className="btn btn-primary" onClick={() => startTimer(stage.minutes)}>▶ Start {stage.minutes}-minute timer</button>
        <StageWindow slug={stage.slug} />
      </div>
    </header>
  );
}

export function StageFooter({ stage }: { stage: Stage }) {
  const { done, toggleComplete } = useManual();
  const i = STAGES.findIndex((s) => s.slug === stage.slug);
  const prev = STAGES[i - 1];
  const next = STAGES[i + 1];
  const isDone = done.has(stage.slug);
  return (
    <>
      <section className="stage-done">
        <p>Passed the gate? <strong>{stage.gate}</strong></p>
        <button className={`btn btn-done${isDone ? " is-done" : ""}`} onClick={() => toggleComplete(stage.slug)}>
          {isDone ? "✓ Completed (click to undo)" : `✓ Mark stage ${stage.num} complete`}
        </button>
      </section>
      <nav className="pagers">
        {prev
          ? <Link className="pager prev" href={`/${prev.slug}`}><small>← Stage {prev.num}</small>{prev.title}</Link>
          : <Link className="pager prev" href="/"><small>←</small>Start here</Link>}
        {next
          ? <Link className="pager next" href={`/${next.slug}`}><small>Stage {next.num} →</small>{next.title}</Link>
          : <Link className="pager next" href={`/${TECH_MAP_SLUG}`}><small>Reference →</small>Tech flow map</Link>}
      </nav>
    </>
  );
}
