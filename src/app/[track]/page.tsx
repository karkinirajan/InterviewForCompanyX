import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findTrack, PAGES, TRACKS } from "@/lib/content";
import { Prose } from "@/components/content/Prose";
import { LevelBadge, TrackLessons, TrackProgress } from "@/components/lesson/LessonParts";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRACKS.map((t) => ({ track: t.slug }));
}

type Props = { params: Promise<{ track: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = await params;
  return { title: findTrack(track)?.title ?? "Not found" };
}

export default async function TrackPage({ params }: Props) {
  const { track: slug } = await params;
  const track = findTrack(slug);
  const page = PAGES[slug];
  if (!track || !page) notFound();

  return (
    <Prose
      html={page.html}
      page={slug}
      before={
        <header className="stage-hero">
          <div className="stage-kicker">Part {track.num} · {track.kicker}</div>
          <h1>{track.title}</h1>
          <p className="lesson-summary">{track.summary}</p>
          <div className="lesson-meta">{track.levels.map((l) => <LevelBadge key={l} level={l} />)}</div>
          <TrackProgress track={track} />
        </header>
      }
      after={
        <section>
          <h2 className="section-title">Lessons in this part</h2>
          <TrackLessons track={track} />
        </section>
      }
    />
  );
}
