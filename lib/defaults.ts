import { TRIP_START, TRIP_END, generateDateRange } from "./date";
import type { AppState, KostenPost, PlanningDag } from "./types";

type Segment = {
  start: string;
  end: string;
  plaats: string;
  acc: string;
};

// Elke reeks is start-end (beide inclusief) en sluit naadloos aan op de volgende,
// zodat elke dag van de reis precies één segment heeft.
const SEGMENTS: Segment[] = [
  { start: "2026-08-28", end: "2026-09-03", plaats: "Fortaleza", acc: "Hotel Luzeiros - geboekt" },
  { start: "2026-09-04", end: "2026-09-11", plaats: "Fortaleza", acc: "Nog boeken" },
  { start: "2026-09-12", end: "2026-09-12", plaats: "Canoa Quebrada", acc: "Jardim dos Orixás - geboekt" },
  { start: "2026-09-13", end: "2026-09-13", plaats: "", acc: "Nog boeken" },
  { start: "2026-09-14", end: "2026-09-16", plaats: "Jericoacoara", acc: "Residence Bons Ventos - geboekt" },
  { start: "2026-09-17", end: "2026-09-23", plaats: "Fortaleza", acc: "Nog boeken" },
];

export function buildDefaultPlanning(): PlanningDag[] {
  return generateDateRange(TRIP_START, TRIP_END).map((datum) => {
    const seg = SEGMENTS.find((s) => datum >= s.start && datum <= s.end);
    return {
      datum,
      plaats: seg?.plaats ?? "",
      wat: "",
      statusAccommodatie: seg?.acc ?? "",
      notities: "",
    };
  });
}

export function buildDefaultKosten(): KostenPost[] {
  return [
    { id: "k1", onderdeel: "Hotels reeds geboekt", bedrag: 1007, valuta: "€", betaalmethode: "ING creditcard (limiet €1.000)", status: "betaald", opmerking: "" },
    { id: "k2", onderdeel: "Huurauto", bedrag: 4410, valuta: "R$", betaalmethode: "PIX of debit bij aankomst", status: "nog betalen", opmerking: "" },
    { id: "k3", onderdeel: "Borg auto", bedrag: 2000, valuta: "R$", betaalmethode: "PIX of debit bij aankomst", status: "nog betalen", opmerking: "Wordt terugbetaald bij inlevering auto" },
    { id: "k4", onderdeel: "Benzine", bedrag: 1700, valuta: "R$", betaalmethode: "", status: "nog betalen", opmerking: "" },
    { id: "k5", onderdeel: "Taxi luchthaven", bedrag: 100, valuta: "R$", betaalmethode: "", status: "nog betalen", opmerking: "" },
    { id: "k6", onderdeel: "Dagbudget eten + leuke dingen", bedrag: 15600, valuta: "R$", betaalmethode: "", status: "nog betalen", opmerking: "R$ 600 per dag × 26 dagen" },
    { id: "k7", onderdeel: "Nog te boeken hotels", bedrag: 950, valuta: "€", betaalmethode: "", status: "nog betalen", opmerking: "Kan lager uitvallen als we bij familie slapen" },
  ];
}

export function buildDefaultState(): AppState {
  return {
    startbudget: 5500,
    wisselkoers: 6.0,
    tripStart: TRIP_START,
    tripEnd: TRIP_END,
    planning: buildDefaultPlanning(),
    kosten: buildDefaultKosten(),
  };
}
