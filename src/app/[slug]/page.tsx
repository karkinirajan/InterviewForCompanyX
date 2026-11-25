import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGES, REFERENCE_PAGES, STAGES } from "@/lib/content";
import { Prose } from "@/components/content/Prose";
import { StageFooter, StageHero } from "@/components/stage/StageParts";

// Only the pages compiled from content/manual.md exist; everything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: PAGES[slug]?.title ?? "Not found" };
}

export default async function ManualPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const stage = STAGES.find((s) => s.slug === slug);
  if (stage) {
    return <Prose html={page.html} page={slug} before={<StageHero stage={stage} />} after={<StageFooter stage={stage} />} />;
  }

  const ref = REFERENCE_PAGES.find((r) => r.slug === slug);
  return (
    <Prose
      html={page.html}
      page={slug}
      before={
        <header className="stage-hero">
          <div className="stage-kicker">Reference · {ref?.kicker}</div>
          <h1>{ref?.title ?? page.title}</h1>
        </header>
      }
    />
  );
}
