import type { PlanningDag } from "./types";

export type PlanningGroup = {
  key: string;
  plaats: string;
  statusAccommodatie: string;
  days: PlanningDag[];
};

// Groepeert opeenvolgende dagen met dezelfde plaats + accommodatiestatus tot één
// sectie, zodat de planning als compacte agenda i.p.v. 27 losse kaarten oogt.
export function groupPlanningDays(planning: PlanningDag[]): PlanningGroup[] {
  const groups: PlanningGroup[] = [];
  for (const day of planning) {
    const last = groups[groups.length - 1];
    if (last && last.plaats === day.plaats && last.statusAccommodatie === day.statusAccommodatie) {
      last.days.push(day);
    } else {
      groups.push({ key: day.datum, plaats: day.plaats, statusAccommodatie: day.statusAccommodatie, days: [day] });
    }
  }
  return groups;
}
