"use client";

import Link from "next/link";
import { INTERVIEW_ROUTE } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";

/** The interview route: stages of lessons with what to focus on, and progress from lesson completion. */
export function RouteList() {
  const { done } = useManual();
  return (
    <ol className="route-stages">
      {INTERVIEW_ROUTE.map((stage) => {
        const n = stage.steps.filter((s) => done.has(s.slug)).length;
        const minutes = stage.steps.reduce((sum, s) => sum + s.minutes, 0);
        return (
          <li key={stage.title} className={n === stage.steps.length ? "is-done" : ""}>
            <header>
              <h2>{stage.title}</h2>
              <span className="meta-chip">{n}/{stage.steps.length} · ≈ {minutes} min</span>
            </header>
            <p className="route-goal" dangerouslySetInnerHTML={{ __html: stage.goal }} />
            <ol className="route-steps">
              {stage.steps.map((s) => (
                <li key={s.slug} className={done.has(s.slug) ? "is-done" : ""}>
                  <Link href={`/${s.slug}`}>
                    <span className="rs-num">{s.num}</span>
                    <span className="rs-body">
                      <strong>{s.title}</strong>
                      <small dangerouslySetInnerHTML={{ __html: s.focus }} />
                    </span>
                    <span className="rs-min">{s.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}
