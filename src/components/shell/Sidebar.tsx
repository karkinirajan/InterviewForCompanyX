import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ALL_LESSONS, ROUTE_SLUG, TECH_MAP_SLUG, TRACKS } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";

export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  const currentTrack = path.split("/")[1] ?? "";
  const { done } = useManual();
  const [open, setOpen] = useState<string>(currentTrack);
  // Expand the current part when the route changes (adjusting state during render, not in an effect).
  const [lastTrack, setLastTrack] = useState(currentTrack);
  if (currentTrack !== lastTrack) {
    setLastTrack(currentTrack);
    setOpen(currentTrack);
  }

  const complete = ALL_LESSONS.filter((l) => done.has(l.slug)).length;
  const pct = Math.round((complete / Math.max(1, ALL_LESSONS.length)) * 100);

  return (
    <aside className="sidebar" id="sidebar">
      <Link className="brand" href="/" onClick={onNavigate}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-mark" src="/brand/mark.svg" alt="" width={40} height={40} />
        <span className="brand-text"><strong>Field guide</strong><small>Full-stack → applied AI</small></span>
      </Link>
      <nav className="nav">
        <Link className={path === "/" ? "active" : ""} href="/" onClick={onNavigate}>
          <span className="nav-num">◆</span><span>Start here</span>
        </Link>
        <Link className={path === `/${ROUTE_SLUG}` ? "active" : ""} href={`/${ROUTE_SLUG}`} onClick={onNavigate}>
          <span className="nav-num">➜</span><span>Interview route</span>
        </Link>
        <div className="nav-label">The book</div>
        {TRACKS.map((t) => {
          const isOpen = open === t.slug;
          const n = t.lessons.filter((l) => done.has(l.slug)).length;
          const allDone = n === t.lessons.length && n > 0;
          return (
            <div key={t.slug} className={`nav-track${isOpen ? " open" : ""}`}>
              <div className="nav-track-row">
                <Link className={`${path === `/${t.slug}` ? "active" : ""}${allDone ? " is-done" : ""}`} href={`/${t.slug}`} onClick={onNavigate}>
                  <span className="nav-num">{t.num}</span>
                  <span className="nav-title">{t.title}</span>
                  <span className="nav-min">{n}/{t.lessons.length}</span>
                </Link>
                <button className="nav-toggle" aria-expanded={isOpen} aria-label={`Show lessons in ${t.title}`}
                  onClick={() => setOpen(isOpen ? "" : t.slug)}>▸</button>
              </div>
              {isOpen && (
                <div className="nav-lessons">
                  {t.lessons.map((l) => (
                    <Link key={l.slug} href={`/${l.slug}`} onClick={onNavigate}
                      className={`${path === `/${l.slug}` ? "active" : ""}${done.has(l.slug) ? " is-done" : ""}`}>
                      <span className="nav-lnum">{l.num}</span><span className="nav-title">{l.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="nav-label">Tools</div>
        <Link className={path === `/${TECH_MAP_SLUG}` ? "active" : ""} href={`/${TECH_MAP_SLUG}`} onClick={onNavigate}>
          <span className="nav-num">⟶</span><span className="nav-title">Tech flow map</span>
        </Link>
      </nav>
      <div className="sidebar-foot">
        <div className="mini-progress"><span style={{ width: `${pct}%` }} /></div>
        <small>{complete} of {ALL_LESSONS.length} lessons complete</small>
      </div>
    </aside>
  );
}
