"use client";

import Link from "next/link";
import { INTERVIEW_AT, STAGES } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";
import { StageWindow } from "@/components/stage/StageParts";

function formatCountdown(d: number): string {
  if (d <= 0) return d > -3600000 ? "In progress" : "Done: write down every question";
  const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000);
  return h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h ${m}m` : `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export function HeroCards() {
  const { now, hydrated, done, startRoute, resetRoute } = useManual();
  const pct = Math.round((STAGES.filter((s) => done.has(s.slug)).length / STAGES.length) * 100);
  return (
    <div className="hero-grid">
      <div className="countdown-card">
        <div className="cd-label">Interview starts in</div>
        <div className="cd-value">{hydrated ? formatCountdown(INTERVIEW_AT - now) : "—"}</div>
        <div className="cd-meta">Wednesday 25 November 2026 · 13:00–14:00 NPT · log in by 12:50</div>
      </div>
      <div className="progress-card">
        <div className="cd-label">Route progress</div>
        <div className="progress-ring" style={{ ["--p" as string]: pct }}><span>{pct}%</span></div>
        <div className="progress-actions">
          <button className="btn btn-primary" onClick={startRoute}>▶ Start the 2-hour route now</button>
          <button className="btn btn-ghost" onClick={resetRoute}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export function RouteGrid() {
  const { done, now, stageWindow } = useManual();
  return (
    <div className="route-grid">
      {STAGES.map((s) => {
        const w = stageWindow(s.slug);
        const isNow = !!w && now >= w.from && now < w.to;
        const isDone = done.has(s.slug);
        return (
          <Link key={s.slug} href={`/${s.slug}`} className={`route-card${isDone ? " is-done" : ""}${isNow ? " is-now" : ""}`}>
            <div className="rc-top"><span className="rc-num">{String(s.num).padStart(2, "0")}</span><span className="rc-min">{s.minutes} min</span></div>
            <h3>{s.title}</h3>
            <p className="rc-kicker">{s.kicker}</p>
            <p className="rc-goal">{s.goal}</p>
            <div className="rc-foot"><StageWindow slug={s.slug} /><span className="rc-state">{isDone ? "✓ Done" : ""}</span></div>
          </Link>
        );
      })}
    </div>
  );
}
