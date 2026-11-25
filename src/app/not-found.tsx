import Link from "next/link";

export default function NotFound() {
  return (
    <div className="layout page-index">
      <main className="main">
        <section className="hero">
          <div className="hero-kicker">404</div>
          <h1>Not in the manual</h1>
          <p className="hero-lede">That page doesn&apos;t exist. Press <kbd>/</kbd> to search, or go back to the <Link href="/">start</Link>.</p>
        </section>
      </main>
    </div>
  );
}
