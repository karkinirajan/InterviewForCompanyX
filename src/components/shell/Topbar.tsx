import { useManual } from "@/components/ManualProvider";

function formatLeft(ms: number): string {
  const abs = Math.abs(ms);
  const m = Math.floor(abs / 60000);
  const s = Math.floor((abs % 60000) / 1000);
  return `${ms < 0 ? "+" : ""}${m}:${String(s).padStart(2, "0")}`;
}

export function Topbar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { timer, timerLeft, pauseTimer, stopTimer } = useManual();

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("lf-theme", next);
    document.dispatchEvent(new CustomEvent("themechange"));
  };

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">☰</button>
      <button className="search-trigger" onClick={onSearch}>
        <span>⌕</span><span className="st-text">Search lessons, questions, terms…</span><kbd>/</kbd>
      </button>
      {timer && timerLeft !== null && (
        <div className={`timer${timer.paused ? " paused" : ""}${timerLeft < 0 ? " overtime" : ""}`} role="timer">
          <span className="timer-dot" />
          <span>{formatLeft(timerLeft)}</span>
          <button className="icon-btn" onClick={pauseTimer} aria-label={timer.paused ? "Resume timer" : "Pause timer"}>
            {timer.paused ? "▶" : "❚❚"}
          </button>
          <button className="icon-btn" onClick={stopTimer} aria-label="Stop timer">✕</button>
        </div>
      )}
      <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
        <span className="theme-icon">◐</span>
      </button>
    </header>
  );
}
