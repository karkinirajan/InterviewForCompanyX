import Link from "next/link";
import { ALL_LESSONS, LEVELS } from "@/lib/content";

/** The brand mark drawn large as a labelled geological section: five strata, one per career level,
 *  the applied-AI summit lit in ochre. Each label links to the first lesson at that level. */
/** Like the logo mark, but the hill lands on the ground on both sides (the mark bleeds off its tile). */
const HILL = "M1 60 C9 58.5 15 46 22 38 C28 31 32 18 39 15 C44 13 47 19 50 26 C54 36 57 51 63 60 Z";
const HEIGHT = 61;
const BANDS = [
  { d: "M0 48.6 C16 47.2 32 50.2 64 47.6 V64 H0 Z", fill: "var(--strata-0)", labelY: 54 },
  { d: "M0 41.2 C16 39.8 32 42.8 64 40.2 V45.9 C32 48.5 16 45.5 0 46.9 Z", fill: "var(--strata-1)", labelY: 43.6 },
  { d: "M0 33.8 C16 32.4 32 35.4 64 32.8 V38.5 C32 41.1 16 38.1 0 39.5 Z", fill: "var(--strata-2)", labelY: 36.2 },
  { d: "M0 26.4 C16 25 32 28 64 25.4 V31.1 C32 33.7 16 30.7 0 32.1 Z", fill: "var(--strata-3)", labelY: 28.8 },
  { d: "M0 0 H64 V23.7 C32 26.3 16 23.3 0 24.7 Z", fill: "var(--strata-4)", labelY: 19 },
];
const SCALE = 5;

export function StrataHero() {
  return (
    <figure className="strata-hero">
      <svg viewBox={`0 0 ${64 * SCALE} ${HEIGHT * SCALE}`} className="strata-svg" role="img"
        aria-labelledby="strata-title">
        <title id="strata-title">Five strata, one per career level, from Intern at the base to Applied AI engineer at the summit</title>
        <defs>
          <clipPath id="strata-hill"><path d={HILL} transform={`scale(${SCALE})`} /></clipPath>
        </defs>
        <g clipPath="url(#strata-hill)">
          {BANDS.map((b) => <path key={b.d} d={b.d} fill={b.fill} transform={`scale(${SCALE})`} />)}
        </g>
      </svg>
      <ol className="strata-labels" reversed>
        {[...LEVELS].reverse().map((l) => {
          const first = ALL_LESSONS.find((x) => x.level === l.level);
          const band = BANDS[l.level];
          return (
            <li key={l.level} className={`sl-${l.level}`} style={{ top: `${(band.labelY / HEIGHT) * 100}%` }}>
              {first
                ? <Link href={`/${first.slug}`}><b>L{l.level}</b> {l.name}</Link>
                : <span><b>L{l.level}</b> {l.name}</span>}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
