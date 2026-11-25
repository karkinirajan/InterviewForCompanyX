// Small typed wrapper over localStorage. All keys are prefixed "lf-".
export const store = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const v = window.localStorage.getItem("lf-" + key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try { window.localStorage.setItem("lf-" + key, JSON.stringify(value)); } catch { /* private mode */ }
  },
  del(key: string): void {
    try { window.localStorage.removeItem("lf-" + key); } catch { /* ignore */ }
  },
};
