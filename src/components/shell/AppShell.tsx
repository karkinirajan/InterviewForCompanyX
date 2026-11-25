"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { REFS, type Ref } from "@/lib/content";
import { useManual } from "@/components/ManualProvider";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SearchPalette } from "./SearchPalette";

interface PopState { ref: Ref; left: number; top: number; samePage: boolean }

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.replace(/^\/|\/$/g, "") || "index";
  const { toastMsg } = useManual();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pop, setPop] = useState<PopState | null>(null);
  const [scroll, setScroll] = useState(0);
  const popEl = useRef<HTMLDivElement>(null);
  const timers = useRef<{ show?: number; hide?: number }>({});

  // Keyboard: "/" or Ctrl/Cmd+K opens search; Esc closes overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /input|textarea/i.test(t.tagName) || t.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === "Escape") { setSearchOpen(false); setPop(null); setNavOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Scroll progress bar; hide preview on scroll.
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScroll(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
      setPop(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setPop(null); setNavOpen(false); }, [pathname]);

  // Internal links inside rendered Markdown are plain <a>: route them client-side.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("data-next")) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") && !href.startsWith("//") && a.closest(".prose, .rp-body, .tm-links, .ref-pop")) {
        e.preventDefault();
        setPop(null);
        router.push(href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // Hover / focus previews for every a.xref[data-ref] on the page.
  useEffect(() => {
    const show = (a: HTMLElement) => {
      const r = REFS[a.dataset.ref ?? ""];
      if (!r) return;
      const rect = a.getBoundingClientRect();
      setPop({ ref: r, left: rect.left, top: rect.bottom + 8, samePage: r.page === page });
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t.closest?.<HTMLElement>("a.xref[data-ref]");
      if (a && !a.closest(".ref-pop")) {
        window.clearTimeout(timers.current.hide);
        window.clearTimeout(timers.current.show);
        timers.current.show = window.setTimeout(() => show(a), 140);
      } else if (t.closest?.(".ref-pop")) window.clearTimeout(timers.current.hide);
    };
    const out = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.("a.xref, .ref-pop")) {
        window.clearTimeout(timers.current.show);
        timers.current.hide = window.setTimeout(() => setPop(null), 180);
      }
    };
    const focus = (e: FocusEvent) => {
      const a = (e.target as HTMLElement).closest?.<HTMLElement>("a.xref[data-ref]");
      if (a) show(a);
    };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("focusin", focus);
    };
  }, [page]);

  // Keep the preview inside the viewport once its size is known.
  useEffect(() => {
    const el = popEl.current;
    if (!pop || !el) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    const left = Math.min(Math.max(12, pop.left), window.innerWidth - w - 12);
    let top = pop.top;
    if (top + h > window.innerHeight - 12) top = Math.max(12, pop.top - h - 40);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [pop]);

  return (
    <div className={navOpen ? "nav-open" : ""}>
      <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${(scroll * 100).toFixed(2)}%` }} /></div>
      <Sidebar onNavigate={() => setNavOpen(false)} />
      <div className="scrim" onClick={() => setNavOpen(false)} />
      <div className="shell">
        <Topbar onMenu={() => setNavOpen((v) => !v)} onSearch={() => setSearchOpen(true)} />
        {children}
      </div>

      {pop && (
        <div className="ref-pop" ref={popEl} role="tooltip" style={{ left: pop.left, top: pop.top }}>
          <div className="rp-head">
            <span className="rp-label">{pop.ref.label}</span>
            <span className="rp-page">{pop.samePage ? "on this page" : pop.ref.pageTitle}</span>
          </div>
          {pop.ref.title && <p className="rp-title">{pop.ref.title}</p>}
          <div className="rp-body" dangerouslySetInnerHTML={{ __html: pop.ref.snippet }} />
          <div className="rp-foot">Click to open →</div>
        </div>
      )}

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </div>
  );
}
