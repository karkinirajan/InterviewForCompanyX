"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { store } from "@/lib/storage";

interface TimerState { end: number; minutes: number; paused: boolean; remaining: number | null; warned: boolean }

interface ManualState {
  hydrated: boolean;
  now: number;
  /** Lesson slugs ("track/lesson") marked complete. */
  done: Set<string>;
  timer: TimerState | null;
  timerLeft: number | null;
  toastMsg: string | null;
  toggleComplete: (slug: string) => void;
  resetProgress: () => void;
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  toast: (msg: string, ms?: number) => void;
}

const Ctx = createContext<ManualState | null>(null);

export function useManual(): ManualState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useManual must be used inside <ManualProvider>");
  return v;
}

/** Study progress, the study timer and toasts. Everything persists in localStorage. */
export function ManualProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load persisted state after mount (keeps server HTML and first client render identical).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, an external store
    setDone(new Set(store.get<string[]>("lessons-done", [])));
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

  useEffect(() => {
    if (timer && timerLeft !== null && timerLeft <= 0 && !timer.warned) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to the wall clock, an external system
      saveTimer({ ...timer, warned: true });
      toast("Time's up: answer the check-yourself questions before moving on.", 5000);
    }
  }, [timer, timerLeft, saveTimer, toast]);

  const startTimer = useCallback((minutes: number) => {
    saveTimer({ end: Date.now() + minutes * 60000, minutes, paused: false, remaining: null, warned: false });
    toast(`${minutes}-minute study timer started`);
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
      else { next.add(slug); toast("Lesson complete. Review it again in a week."); }
      store.set("lessons-done", [...next]);
      return next;
    });
  }, [toast]);

  const resetProgress = useCallback(() => {
    if (!window.confirm("Clear lesson progress? Checklists are kept.")) return;
    setDone(new Set()); store.del("lessons-done");
  }, []);

  const value = useMemo<ManualState>(() => ({
    hydrated, now, done, timer, timerLeft, toastMsg,
    toggleComplete, resetProgress, startTimer, pauseTimer, stopTimer, toast,
  }), [hydrated, now, done, timer, timerLeft, toastMsg, toggleComplete, resetProgress, startTimer, pauseTimer, stopTimer, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
