import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findTrack, PAGES, TRACKS } from "@/lib/content";
import { Prose } from "@/components/content/Prose";
import { LessonFooter, LessonHero } from "@/components/lesson/LessonParts";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRACKS.flatMap((t) => t.lessons.map((l) => {
    const [track, lesson] = l.slug.split("/");
    return { track, lesson };
  }));
}

type Props = { params: Promise<{ track: string; lesson: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track, lesson } = await params;
  return { title: PAGES[`${track}/${lesson}`]?.title ?? "Not found" };
}

export default async function LessonPage({ params }: Props) {
  const { track: trackSlug, lesson: lessonSlug } = await params;
  const slug = `${trackSlug}/${lessonSlug}`;
  const track = findTrack(trackSlug);
  const lesson = track?.lessons.find((l) => l.slug === slug);
  const page = PAGES[slug];
  if (!track || !lesson || !page) notFound();

  return <Prose html={page.html} page={slug} before={<LessonHero lesson={lesson} track={track} />} after={<LessonFooter lesson={lesson} />} />;
}
