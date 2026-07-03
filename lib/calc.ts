import { getDaysRemaining, getTripProgressText } from "./date";
import type { AppState } from "./types";

export function formatBRL(x: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(x);
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
    if (k.status === "betaald") betaald += k.bedrag;
    else nogTeBetalen += k.bedrag;
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
