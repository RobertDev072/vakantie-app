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
  bedrag: number; // in R$
  betaalmethode: string;
  status: KostenStatus;
  opmerking: string;
};

export type AppState = {
  startbudget: number; // in R$
  tripStart: string;
  tripEnd: string;
  planning: PlanningDag[];
  kosten: KostenPost[];
};
