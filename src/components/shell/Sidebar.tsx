import Link from "next/link";
import { usePathname } from "next/navigation";
import { REFERENCE_PAGES, STAGES } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";

export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  const { done } = useManual();
  const complete = STAGES.filter((s) => done.has(s.slug)).length;
  const pct = Math.round((complete / STAGES.length) * 100);

  return (
    <aside className="sidebar" id="sidebar">
      <Link className="brand" href="/" onClick={onNavigate}>
        <span className="brand-mark">L</span>
        <span className="brand-text"><strong>Field manual</strong><small>AI Integration Engineer · v2</small></span>
      </Link>
      <nav className="nav">
        <Link className={path === "/" ? "active" : ""} href="/" onClick={onNavigate}>
          <span className="nav-num">◆</span><span>Start here</span>
        </Link>
        <div className="nav-label">The 2-hour route</div>
        {STAGES.map((s) => {
          const cls = [path === `/${s.slug}` ? "active" : "", done.has(s.slug) ? "is-done" : ""].join(" ").trim();
          return (
            <Link key={s.slug} className={cls} href={`/${s.slug}`} onClick={onNavigate}>
              <span className="nav-num">{s.num}</span>
              <span className="nav-title">{s.title}</span>
              <span className="nav-min">{s.minutes}′</span>
            </Link>
          );
        })}
        <div className="nav-label">Reference</div>
        {REFERENCE_PAGES.map((r) => (
          <Link key={r.slug} className={path === `/${r.slug}` ? "active" : ""} href={`/${r.slug}`} onClick={onNavigate}>
            <span className="nav-num">{r.slug.includes("map") ? "⟶" : "§"}</span>
            <span className="nav-title">{r.title}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="mini-progress"><span style={{ width: `${pct}%` }} /></div>
        <small>{complete} of {STAGES.length} stages complete</small>
      </div>
    </aside>
  );
}
