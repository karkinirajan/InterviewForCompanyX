"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STAGES } from "@/lib/content";
import { store } from "@/lib/storage";

interface TimerState { end: number; minutes: number; paused: boolean; remaining: number | null; warned: boolean }

interface ManualState {
  hydrated: boolean;
  now: number;
  done: Set<string>;
  routeStart: number | null;
  timer: TimerState | null;
  timerLeft: number | null;
  toastMsg: string | null;
  toggleComplete: (slug: string) => void;
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  startRoute: () => void;
  resetRoute: () => void;
  toast: (msg: string, ms?: number) => void;
  stageWindow: (slug: string) => { from: number; to: number } | null;
}

const Ctx = createContext<ManualState | null>(null);

export function useManual(): ManualState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useManual must be used inside <ManualProvider>");
  return v;
}

export function ManualProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [routeStart, setRouteStart] = useState<number | null>(null);
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load persisted state after mount (keeps server HTML and first client render identical).
  useEffect(() => {
    setDone(new Set(store.get<string[]>("done", [])));
    setRouteStart(store.get<number | null>("route-start", null));
    setTimer(store.get<TimerState | null>("timer", null));
    setNow(Date.now());
    setHydrated(true);
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const toast = useCallback((msg: string, ms = 2600) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg((m) => (m === msg ? null : m)), ms);
  }, []);

  const saveTimer = useCallback((t: TimerState | null) => {
    setTimer(t);
    if (t) store.set("timer", t); else store.del("timer");
  }, []);

  const timerLeft = timer ? (timer.paused ? timer.remaining ?? 0 : timer.end - now) : null;

  // One-time "time's up" notice.
  useEffect(() => {
    if (timer && timerLeft !== null && timerLeft <= 0 && !timer.warned) {
      saveTimer({ ...timer, warned: true });
      toast("Time's up: check the gate, then move on.", 5000);
    }
  }, [timer, timerLeft, saveTimer, toast]);

  const startTimer = useCallback((minutes: number) => {
    saveTimer({ end: Date.now() + minutes * 60000, minutes, paused: false, remaining: null, warned: false });
    toast(`${minutes}-minute timer started`);
  }, [saveTimer, toast]);

  const pauseTimer = useCallback(() => {
    if (!timer) return;
    if (timer.paused) saveTimer({ ...timer, end: Date.now() + (timer.remaining ?? 0), paused: false, remaining: null });
    else saveTimer({ ...timer, remaining: timer.end - Date.now(), paused: true });
  }, [timer, saveTimer]);

  const stopTimer = useCallback(() => saveTimer(null), [saveTimer]);

  const toggleComplete = useCallback((slug: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else { next.add(slug); toast("Stage complete. On to the next gate."); }
      store.set("done", [...next]);
      return next;
    });
  }, [toast]);

  const startRoute = useCallback(() => {
    const t = Date.now();
    setRouteStart(t); store.set("route-start", t);
    saveTimer({ end: t + STAGES[0].minutes * 60000, minutes: STAGES[0].minutes, paused: false, remaining: null, warned: false });
    toast("Route started: Stage 1 timer running");
  }, [saveTimer, toast]);

  const resetRoute = useCallback(() => {
    if (!window.confirm("Reset route start time and stage progress? Checklists and notes are kept.")) return;
    setRouteStart(null); store.del("route-start");
    setDone(new Set()); store.del("done");
    saveTimer(null);
  }, [saveTimer]);

  const stageWindow = useCallback((slug: string) => {
    if (!routeStart) return null;
    let offset = 0;
    for (const s of STAGES) {
      if (s.slug === slug) return { from: routeStart + offset * 60000, to: routeStart + (offset + s.minutes) * 60000 };
      offset += s.minutes;
    }
    return null;
  }, [routeStart]);

  const value = useMemo<ManualState>(() => ({
    hydrated, now, done, routeStart, timer, timerLeft, toastMsg,
    toggleComplete, startTimer, pauseTimer, stopTimer, startRoute, resetRoute, toast, stageWindow,
  }), [hydrated, now, done, routeStart, timer, timerLeft, toastMsg, toggleComplete, startTimer, pauseTimer, stopTimer, startRoute, resetRoute, toast, stageWindow]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function fmtClock(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
