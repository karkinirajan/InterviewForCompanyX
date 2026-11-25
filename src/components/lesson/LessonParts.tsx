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
      <div className="lesson-brief">
        {lesson.keypoints.length > 0 && (
          <div className="keypoints" id="key-points">
            <span className="brief-k">Key points · the two-minute version</span>
            <ol>{lesson.keypoints.map((k) => <li key={k} dangerouslySetInnerHTML={{ __html: k }} />)}</ol>
          </div>
        )}
        {lesson.outcomes.length > 0 && (
          <div className="outcomes">
            <span className="brief-k">You should be able to</span>
            <ul>{lesson.outcomes.map((o) => <li key={o} dangerouslySetInnerHTML={{ __html: o }} />)}</ul>
          </div>
        )}
      </div>
      <div className="stage-actions">
        <button className="btn btn-primary" onClick={() => startTimer(lesson.minutes + 10)}>
          ▶ Study timer ({lesson.minutes + 10} min)
        </button>
      </div>
    </header>
  );
}

/** Two hands-on projects per lesson: build one to make the lesson stick. */
export function LessonProjects({ lesson }: { lesson: Lesson }) {
  if (!lesson.projects.length) return null;
  return (
    <section className="projects" aria-labelledby="build-to-remember">
      <h2 id="build-to-remember" className="section-title">Build it to remember</h2>
      <p className="muted">Two hands-on projects that exercise this lesson. Pick one, build it end to end, and keep it in your portfolio.</p>
      <div className="project-grid">
        {lesson.projects.map((p, i) => (
          <article key={p.name} className="project-card">
            <div className="pc-top"><span className="pc-num">Project {i + 1}</span></div>
            <h3>{p.name}</h3>
            <p dangerouslySetInnerHTML={{ __html: p.build }} />
            <ul className="stack-chips" aria-label="Stack">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="pc-practises"><b>Practises</b> <span dangerouslySetInnerHTML={{ __html: p.practises }} /></p>
          </article>
        ))}
      </div>
    </section>
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
      <LessonProjects lesson={lesson} />
      <section className="stage-done">
        <p>Can you answer every <strong>check-yourself</strong> question out loud without opening the answer?</p>
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
