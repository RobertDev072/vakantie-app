import { getDaysRemaining, getTripProgressText } from "./date";
import type { AppState, Currency } from "./types";

export function toEUR(item: { bedrag: number; valuta: Currency }, wisselkoers: number): number {
  return item.valuta === "R$" ? item.bedrag / (wisselkoers || 1) : item.bedrag;
}

export function formatEUR(x: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(x);
}

export type Totals = {
  betaald: number;
  nogTeBetalen: number;
  uitgegeven: number;
  resterend: number;
  daysRemaining: number;
  perDag: number | null;
  pct: number;
  tripProgressText: string;
};

export function accStatusKind(text: string): "geboekt" | "nogboeken" | "neutraal" {
  const t = text.toLowerCase();
  if (t.includes("geboekt")) return "geboekt";
  if (t.includes("boeken")) return "nogboeken";
  return "neutraal";
}

export function computeTotals(state: AppState): Totals {
  let betaald = 0;
  let nogTeBetalen = 0;
  for (const k of state.kosten) {
    const eur = toEUR(k, state.wisselkoers);
    if (k.status === "betaald") betaald += eur;
    else nogTeBetalen += eur;
  }
  const uitgegeven = betaald + nogTeBetalen;
  const resterend = state.startbudget - uitgegeven;
  const daysRemaining = getDaysRemaining(state.tripStart, state.tripEnd);
  const perDag = daysRemaining > 0 ? resterend / daysRemaining : null;
  const pct = state.startbudget > 0 ? (uitgegeven / state.startbudget) * 100 : 0;

  return {
    betaald,
    nogTeBetalen,
    uitgegeven,
    resterend,
    daysRemaining,
    perDag,
    pct,
    tripProgressText: getTripProgressText(state.tripStart, state.tripEnd),
  };
}
