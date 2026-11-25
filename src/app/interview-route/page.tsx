import type { Metadata } from "next";
import { INTERVIEW_ROUTE } from "@/lib/content";
import { RouteList } from "@/components/route/RouteList";

export const metadata: Metadata = { title: "Interview route" };

export default function InterviewRoutePage() {
  const lessons = INTERVIEW_ROUTE.reduce((n, s) => n + s.steps.length, 0);
  const minutes = INTERVIEW_ROUTE.reduce((n, s) => n + s.steps.reduce((m, x) => m + x.minutes, 0), 0);
  return (
    <div className="layout page-index">
      <main className="main" id="main">
        <header className="stage-hero">
          <div className="stage-kicker">Follow-through mode</div>
          <h1>The interview route</h1>
          <p className="lesson-summary">
            The order to work through the guide before an applied AI or full-stack interview: {INTERVIEW_ROUTE.length} stages,
            {" "}{lessons} lessons, about {Math.round(minutes / 60)} hours of reading plus practice. Each step says what to focus on.
            Read the <strong>key points</strong> first, answer the <strong>check-yourself</strong> questions out loud, then mark the lesson complete.
          </p>
        </header>
        <RouteList />
      </main>
    </div>
  );
}
