"use client";

import Link from "next/link";
import { ALL_LESSONS, LEVELS, TOTAL_MINUTES, TRACKS } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";
import { LevelBadge } from "@/components/lesson/LessonParts";

export function HeroCards() {
  const { done, hydrated, resetProgress } = useManual();
  const n = ALL_LESSONS.filter((l) => done.has(l.slug)).length;
  const pct = Math.round((n / Math.max(1, ALL_LESSONS.length)) * 100);
  const next = ALL_LESSONS.find((l) => !done.has(l.slug));
  return (
    <div className="hero-grid">
      <div className="countdown-card">
        <div className="cd-label">{n === 0 ? "Begin" : "Continue where you left off"}</div>
        {hydrated && next ? (
          <Link className="continue-link" href={`/${next.slug}`}>
            <span className="cd-value">{next.num}</span>
            <span className="continue-title">{next.title} →</span>
          </Link>
        ) : (
          <div className="cd-value">{hydrated ? "All done" : "—"}</div>
        )}
        <div className="cd-meta">{TRACKS.length} parts · {ALL_LESSONS.length} lessons · about {Math.round(TOTAL_MINUTES / 60)} hours of reading, plus practice</div>
      </div>
      <div className="progress-card">
        <div className="cd-label">Your progress</div>
        <div className="progress-ring" style={{ ["--p" as string]: pct }}><span>{pct}%</span></div>
        <div className="progress-actions">
          <span className="muted">{n} of {ALL_LESSONS.length} lessons complete</span>
          <button className="btn btn-ghost" onClick={resetProgress}>Reset progress</button>
        </div>
      </div>
    </div>
  );
}

export function LevelLadder() {
  return (
    <ol className="level-ladder">
      {LEVELS.map((l) => {
        const lessons = ALL_LESSONS.filter((x) => x.level === l.level);
        const first = lessons[0];
        return (
          <li key={l.level} className={`lv-${l.level}`}>
            <LevelBadge level={l.level} />
            <p>{l.blurb}</p>
            <small className="muted">{lessons.length} lessons{first ? <> · start at <Link href={`/${first.slug}`}>{first.num} {first.title}</Link></> : null}</small>
          </li>
        );
      })}
    </ol>
  );
}

export function TrackGrid() {
  const { done } = useManual();
  return (
    <div className="route-grid">
      {TRACKS.map((t) => {
        const n = t.lessons.filter((l) => done.has(l.slug)).length;
        const isDone = n === t.lessons.length && n > 0;
        return (
          <Link key={t.slug} href={`/${t.slug}`} className={`route-card${isDone ? " is-done" : ""}`}>
            <div className="rc-top"><span className="rc-num">{String(t.num).padStart(2, "0")}</span><span className="rc-min">{t.lessons.length} lessons</span></div>
            <h3>{t.title}</h3>
            <p className="rc-kicker">{t.kicker}</p>
            <p className="rc-goal">{t.summary}</p>
            <div className="rc-foot">
              <span className="rc-levels">{t.levels.map((l) => <LevelBadge key={l} level={l} />)}</span>
              <span className="rc-state">{n ? `${n}/${t.lessons.length}` : ""}{isDone ? " ✓" : ""}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
