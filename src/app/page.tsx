import Link from "next/link";
import { HeroCards, RouteGrid } from "@/components/home/HomeWidgets";

const ID_LEGEND = [
  { prefix: "R", means: "Red flags to fix or prepare", ref: "part1", href: "/01-fix-and-decide#part1", where: "Stage 1" },
  { prefix: "P", means: "Project dossiers", ref: "part4", href: "/04-project-dossiers#part4", where: "Stage 4" },
  { prefix: "S", means: "Stories (STAR)", ref: "part6", href: "/03-narrative-and-stories#part6", where: "Stage 3" },
  { prefix: "Q", means: "Technical questions with answers", ref: "part7", href: "/05-technical-qa#part7", where: "Stage 5" },
  { prefix: "D", means: "System design drills", ref: "part9", href: "/06-aws-and-system-design#part9", where: "Stage 6" },
  { prefix: "C", means: "Code you may have to write", ref: "part10", href: "/07-code-culture-questions#part10", where: "Stage 7" },
  { prefix: "G", means: "Glossary terms", ref: "part17", href: "/10-appendix#part17", where: "Appendix" },
];

export default function HomePage() {
  return (
    <div className="layout page-index">
      <main className="main" id="main">
        <section className="hero">
          <div className="hero-kicker">Leapfrog Technology · AI Integration Engineer</div>
          <h1>Interview field manual <em>v2</em></h1>
          <p className="hero-lede">
            Eight stages, two hours, one rule: <strong>if you can&apos;t survive three follow-up questions on it, don&apos;t say it.</strong>
          </p>
          <HeroCards />
        </section>

        <section>
          <h2 id="route">The 2-hour route</h2>
          <p className="muted">Each stage has a time budget and a gate. Fail a gate, repeat the loop. Start the route to see each stage&apos;s clock window.</p>
          <RouteGrid />
        </section>

        <section className="two-col">
          <div>
            <h2 id="at-a-glance">At a glance</h2>
            <div className="table-wrap"><table><tbody>
              <tr><th>Interview</th><td><strong>Wednesday 25 November 2026, 13:00 to 14:00 NPT</strong> (moved from Monday; invite accepted)</td></tr>
              <tr><th>Role</th><td>AI Integration Engineer · Development · Hybrid, Kathmandu · <a className="ext" target="_blank" rel="noopener noreferrer" href="https://career.lftechnology.com/o/ai-integration-engineer-1">vacancy</a></td></tr>
              <tr><th>What&apos;s new in v2</th><td>Your GitHub (88 repos scanned, 16 public READMEs and histories read), reelslicer read in full (README, 14 ADRs, code), resume and homepage re-read, Glassdoor reports on Leapfrog&apos;s process, AgentCore updates through November 2026, and a <strong>new red-flag list (<Link className="xref" data-ref="part1" href="/01-fix-and-decide#part1">Part 1</Link>) that matters more than anything else in this file</strong></td></tr>
              <tr><th>Rule for every line</th><td>If you can&apos;t survive three follow-up questions on it, don&apos;t say it</td></tr>
            </tbody></table></div>
          </div>
          <div>
            <h2 id="id-legend">How IDs work</h2>
            <p className="muted">Every item has a short, stable ID. Hover any ID link for a preview; click to jump, even across pages. Press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd> to search them.</p>
            <div className="table-wrap"><table>
              <thead><tr><th>Prefix</th><th>Means</th><th>Lives in</th></tr></thead>
              <tbody>
                {ID_LEGEND.map((r) => (
                  <tr key={r.prefix}>
                    <td><strong>{r.prefix}</strong></td><td>{r.means}</td>
                    <td><Link className="xref" data-ref={r.ref} href={r.href}>{r.where}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            <Link className="map-teaser" href="/09-tech-flow-map">
              <span>⟶</span>
              <div><strong>Tech flow map</strong><small>Every library and framework in the manual, in build order. Click any node for definition, usage and importance.</small></div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
