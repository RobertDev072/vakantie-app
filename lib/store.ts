import { useCallback, useMemo, useSyncExternalStore } from "react";
import { buildDefaultKosten, buildDefaultPlanning, buildDefaultState } from "./defaults";
import { computeTotals } from "./calc";
import type { AppState, KostenPost, KostenStatus, PlanningDag } from "./types";

// Kleine module-level store (vergelijkbaar met Zustand) i.p.v. React Context: state leeft
// buiten React, useSyncExternalStore levert bij hydratie eerst DEFAULT_STATE (gelijk aan de
// server-render) en herrendert direct daarna automatisch zodra de echte localStorage-data
// is geladen. Zo is er geen setState-in-effect nodig voor deze client-only databron.
const STORAGE_KEY = "brazilie2026_vakantieplanner_v1";
const DEFAULT_STATE = buildDefaultState();

let state: AppState = DEFAULT_STATE;
let loadedFromStorage = false;
const listeners = new Set<() => void>();

// Eenmalige migratie voor data die is opgeslagen vóór de overstap naar "alles in R$":
// posten die toen in € stonden, rekenen we om met de laatst bekende koers en verliezen
// daarna hun valutaveld, zodat het opgeslagen bedrag weer klopt met de R$-werkelijkheid.
function migrateLegacy(parsed: {
  startbudget?: number;
  wisselkoers?: number;
  tripStart?: string;
  tripEnd?: string;
  planning?: PlanningDag[];
  kosten?: Array<KostenPost & { valuta?: "€" | "R$" }>;
}): AppState {
  const legacyKoers = typeof parsed.wisselkoers === "number" && parsed.wisselkoers > 0 ? parsed.wisselkoers : 6;
  const kosten = (parsed.kosten ?? []).map((k) => {
    const { valuta, ...rest } = k;
    return valuta === "€" ? { ...rest, bedrag: rest.bedrag * legacyKoers } : rest;
  });
  return {
    startbudget: parsed.startbudget ?? DEFAULT_STATE.startbudget,
    tripStart: parsed.tripStart ?? DEFAULT_STATE.tripStart,
    tripEnd: parsed.tripEnd ?? DEFAULT_STATE.tripEnd,
    planning: parsed.planning ?? DEFAULT_STATE.planning,
    kosten,
  };
}

function loadOnce(): AppState {
  if (loadedFromStorage || typeof window === "undefined") return state;
  loadedFromStorage = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.planning) && Array.isArray(parsed.kosten)) {
        state = migrateLegacy(parsed);
      }
    }
  } catch {
    // corrupte data: bij DEFAULT_STATE blijven
  }
  return state;
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mutate(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppState {
  return loadOnce();
}

function getServerSnapshot(): AppState {
  return DEFAULT_STATE;
}

export function useApp() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totals = useMemo(() => computeTotals(snapshot), [snapshot]);

  const setStartbudget = useCallback((value: number) => {
    mutate((s) => ({ ...s, startbudget: Number.isFinite(value) ? value : 0 }));
  }, []);

  const updatePlanning = useCallback((datum: string, field: keyof PlanningDag, value: string) => {
    mutate((s) => ({
      ...s,
      planning: s.planning.map((p) => (p.datum === datum ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const updateKosten = useCallback((id: string, field: keyof KostenPost, value: string | number) => {
    mutate((s) => ({
      ...s,
      kosten: s.kosten.map((k) => {
        if (k.id !== id) return k;
        if (field === "bedrag") {
          const n = typeof value === "number" ? value : parseFloat(value);
          return { ...k, bedrag: Number.isFinite(n) ? n : 0 };
        }
        if (field === "status") return { ...k, status: value as KostenStatus };
        return { ...k, [field]: value };
      }),
    }));
  }, []);

  const addKosten = useCallback(() => {
    const id = "k" + Date.now();
    mutate((s) => ({
      ...s,
      kosten: [...s.kosten, { id, onderdeel: "", bedrag: 0, betaalmethode: "", status: "nog betalen", opmerking: "" }],
    }));
    return id;
  }, []);

  const deleteKosten = useCallback((id: string) => {
    mutate((s) => ({ ...s, kosten: s.kosten.filter((k) => k.id !== id) }));
  }, []);

  const resetSettings = useCallback(() => {
    const def = buildDefaultState();
    mutate((s) => ({ ...s, startbudget: def.startbudget }));
  }, []);

  const resetPlanning = useCallback(() => {
    mutate((s) => ({ ...s, planning: buildDefaultPlanning() }));
  }, []);

  const resetKosten = useCallback(() => {
    mutate((s) => ({ ...s, kosten: buildDefaultKosten() }));
  }, []);

  const resetAll = useCallback(() => {
    mutate(() => buildDefaultState());
  }, []);

  return {
    state: snapshot,
    totals,
    setStartbudget,
    updatePlanning,
    updateKosten,
    addKosten,
    deleteKosten,
    resetSettings,
    resetPlanning,
    resetKosten,
    resetAll,
  };
}
