"use client";

import Link from "next/link";
import { ALL_LESSONS, LEVELS, TECH_MAP_SLUG, type Lesson, type Level, type Track } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";

export function LevelBadge({ level }: { level: Level }) {
  const l = LEVELS[level];
  return <span className={`level-badge lv-${level}`} title={l.blurb}>{l.short} · {l.name}</span>;
}

export function LessonHero({ lesson, track }: { lesson: Lesson; track: Track }) {
  const { startTimer } = useManual();
  return (
    <header className="stage-hero">
      <div className="stage-kicker">
        <Link href={`/${track.slug}`}>Part {track.num} · {track.title}</Link> · Lesson {lesson.num}
      </div>
      <h1>{lesson.title}</h1>
      <p className="lesson-summary">{lesson.summary}</p>
      <div className="lesson-meta">
        <LevelBadge level={lesson.level} />
        <span className="meta-chip">≈ {lesson.minutes} min read</span>
      </div>
      {lesson.outcomes.length > 0 && (
        <div className="outcomes">
          <span className="brief-k">After this lesson you can</span>
          <ul>{lesson.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
      )}
      <div className="stage-actions">
        <button className="btn btn-primary" onClick={() => startTimer(lesson.minutes + 10)}>
          ▶ Study timer ({lesson.minutes + 10} min)
        </button>
      </div>
    </header>
  );
}

export function LessonFooter({ lesson }: { lesson: Lesson }) {
  const { done, toggleComplete } = useManual();
  const i = ALL_LESSONS.findIndex((l) => l.slug === lesson.slug);
  const prev = ALL_LESSONS[i - 1];
  const next = ALL_LESSONS[i + 1];
  const isDone = done.has(lesson.slug);
  return (
    <>
      <section className="stage-done">
        <p>Answered every <strong>check-yourself</strong> question without opening the answer?</p>
        <button className={`btn btn-done${isDone ? " is-done" : ""}`} onClick={() => toggleComplete(lesson.slug)}>
          {isDone ? "✓ Completed (click to undo)" : `✓ Mark lesson ${lesson.num} complete`}
        </button>
      </section>
      <nav className="pagers">
        {prev
          ? <Link className="pager prev" href={`/${prev.slug}`}><small>← {prev.num}</small>{prev.title}</Link>
          : <Link className="pager prev" href="/"><small>←</small>Start here</Link>}
        {next
          ? <Link className="pager next" href={`/${next.slug}`}><small>{next.num} →</small>{next.title}</Link>
          : <Link className="pager next" href={`/${TECH_MAP_SLUG}`}><small>Reference →</small>Tech flow map</Link>}
      </nav>
    </>
  );
}

export function TrackLessons({ track }: { track: Track }) {
  const { done } = useManual();
  return (
    <ol className="lesson-list">
      {track.lessons.map((l) => (
        <li key={l.slug} className={done.has(l.slug) ? "is-done" : ""}>
          <Link href={`/${l.slug}`}>
            <span className="ll-num">{l.num}</span>
            <span className="ll-body">
              <strong>{l.title}</strong>
              <small>{l.summary}</small>
            </span>
            <span className="ll-meta"><LevelBadge level={l.level} /><small>{l.minutes} min</small></span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function TrackProgress({ track }: { track: Track }) {
  const { done } = useManual();
  const n = track.lessons.filter((l) => done.has(l.slug)).length;
  const pct = track.lessons.length ? Math.round((n / track.lessons.length) * 100) : 0;
  return (
    <div className="track-progress">
      <div className="mini-progress"><span style={{ width: `${pct}%` }} /></div>
      <small>{n} of {track.lessons.length} lessons · {track.lessons.reduce((s, l) => s + l.minutes, 0)} min</small>
    </div>
  );
}
