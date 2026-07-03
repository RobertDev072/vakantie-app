export type Currency = "€" | "R$";
export type KostenStatus = "betaald" | "nog betalen";

export type PlanningDag = {
  datum: string; // ISO YYYY-MM-DD, dient ook als unieke sleutel
  plaats: string;
  wat: string;
  statusAccommodatie: string;
  notities: string;
};

export type KostenPost = {
  id: string;
  onderdeel: string;
  bedrag: number;
  valuta: Currency;
  betaalmethode: string;
  status: KostenStatus;
  opmerking: string;
};

export type AppState = {
  startbudget: number;
  wisselkoers: number; // 1 euro = wisselkoers reais
  tripStart: string;
  tripEnd: string;
  planning: PlanningDag[];
  kosten: KostenPost[];
};
