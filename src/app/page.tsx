import Link from "next/link";
import { HeroCards, LevelLadder, TrackGrid } from "@/components/home/HomeWidgets";
import { StrataHero } from "@/components/home/StrataHero";

const ID_LEGEND = [
  { prefix: "Q", means: "Interview questions with model answers", href: "/14-reference/01-question-bank" },
  { prefix: "D", means: "System design drills", href: "/06-system-design/04-ai-system-design-drills" },
  { prefix: "C", means: "Code you should be able to write from memory", href: "/14-reference/04-code-kit" },
  { prefix: "P", means: "Project case studies (my casebook)", href: "/13-casebook" },
  { prefix: "S", means: "Stories in STAR shape", href: "/12-career-and-interviews/03-story-bank" },
  { prefix: "G", means: "Glossary terms", href: "/14-reference/02-glossary" },
];

export default function HomePage() {
  return (
    <div className="layout page-index">
      <main className="main" id="main">
        <section className="hero">
          <div className="hero-top">
          <div className="hero-copy">
          <div className="hero-kicker">A reference handbook for full-stack engineers moving into applied AI</div>
          <h1>The engineering field guide</h1>
          <p className="hero-lede">
            Everything a full-stack engineer needs to build, ship and talk about AI products: backend, frontend, cloud and
            security, then LLMs, RAG, agents, production AI and automation. Every lesson opens with its <strong>key points</strong>,
            explains <strong>how</strong> and <strong>why this way</strong>, ends with <strong>questions to answer out loud</strong>,
            and gives <strong>two projects to build</strong> so it sticks.
          </p>
          </div>
          <StrataHero />
          </div>
          <HeroCards />
        </section>

        <section className="two-ways">
          <h2 id="two-ways">Two ways to use it</h2>
          <div className="ways-grid">
            <div className="way-card">
              <span className="way-kicker">Look it up</span>
              <h3>Come back for the detail you need</h3>
              <p>Press <kbd>/</kbd> and type a topic, a question ID (Q12) or a term (pgvector, retry). Read the lesson&apos;s key points first; open the full text only for what you&apos;ve forgotten.</p>
              <ul>
                <li><Link href="/14-reference/01-question-bank">Question bank</Link>: all 44 interview questions with model answers</li>
                <li><Link href="/14-reference/04-code-kit">Code kit</Link>: the snippets to write from memory</li>
                <li><Link href="/14-reference/02-glossary">Glossary</Link> and the <Link href="/tech-map">tech flow map</Link></li>
              </ul>
            </div>
            <div className="way-card way-primary">
              <span className="way-kicker">Follow it through</span>
              <h3>Prepare for an interview end to end</h3>
              <p>Nine stages in a deliberate order, from your story to RAG, agents, production AI and system design, each step saying exactly what to focus on.</p>
              <Link className="btn btn-primary" href="/interview-route">Open the interview route →</Link>
              <p className="muted">New to engineering? Read the book in order from <Link href="/00-start-here/01-how-to-use-this-guide">0.1</Link> instead.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 id="levels">The career ladder</h2>
          <p className="muted">Every lesson is tagged with the level where it starts to matter. Read in order, or jump to your level and fill gaps backwards.</p>
          <LevelLadder />
        </section>

        <section>
          <h2 id="book">The book</h2>
          <p className="muted">Fifteen parts. Parts 0–6 are the full-stack core; 7–11 are the applied AI layer built on top; 12–14 turn it into interviews, case studies and reference.</p>
          <TrackGrid />
        </section>

        <section className="two-col">
          <div>
            <h2 id="how-to-study">How to study with this</h2>
            <ol className="study-steps">
              <li><strong>Read the lesson once</strong>, fast. Don&apos;t take notes yet.</li>
              <li><strong>Answer the check-yourself questions out loud</strong> before opening the answers. Speaking exposes gaps that reading hides.</li>
              <li><strong>Build one of its two projects.</strong> Each lesson lists two, with a stack; knowledge you haven&apos;t typed is borrowed.</li>
              <li><strong>Mark it complete</strong>, then come back in a week and answer the questions again (spaced repetition).</li>
            </ol>
            <p className="muted">Start with <Link href="/00-start-here/01-how-to-use-this-guide">0.1 How to use this guide</Link>.</p>
          </div>
          <div>
            <h2 id="id-legend">How IDs work</h2>
            <p className="muted">Reusable items have short, stable IDs. Hover any ID link for a preview; click to jump, even across pages. Press <kbd>/</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd> to search.</p>
            <div className="table-wrap"><table>
              <thead><tr><th>Prefix</th><th>Means</th></tr></thead>
              <tbody>
                {ID_LEGEND.map((r) => (
                  <tr key={r.prefix}><td><strong>{r.prefix}</strong></td><td><Link href={r.href}>{r.means}</Link></td></tr>
                ))}
              </tbody>
            </table></div>
            <Link className="map-teaser" href="/tech-map">
              <span>⟶</span>
              <div><strong>Tech flow map</strong><small>Every library and framework in build order. Click any node for its definition, where it&apos;s used and why it matters.</small></div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
