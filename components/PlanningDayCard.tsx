"use client";

import { useApp } from "@/lib/store";
import { accStatusKind } from "@/lib/calc";
import { formatDateNL } from "@/lib/date";
import type { PlanningDag } from "@/lib/types";

const ACC_BG: Record<ReturnType<typeof accStatusKind>, string> = {
  geboekt: "var(--color-green-bg)",
  nogboeken: "var(--color-orange-bg)",
  neutraal: "#ffffff",
};

const fieldClass =
  "w-full rounded-lg border border-[var(--color-border)] px-2.5 py-2 text-sm outline-none focus:border-[var(--color-primary)]";

export default function PlanningDayCard({ day }: { day: PlanningDag }) {
  const { updatePlanning } = useApp();
  const kind = accStatusKind(day.statusAccommodatie);

  return (
    <div className="mb-3 rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
      <p className="mb-2 text-[13px] font-semibold capitalize text-[var(--color-primary-dark)]">
        {formatDateNL(day.datum)}
      </p>
      <div className="flex flex-col gap-2">
        <input
          className={fieldClass}
          placeholder="Plaats"
          value={day.plaats}
          onChange={(e) => updatePlanning(day.datum, "plaats", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Wat gaan we doen"
          value={day.wat}
          onChange={(e) => updatePlanning(day.datum, "wat", e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Status accommodatie"
          value={day.statusAccommodatie}
          onChange={(e) => updatePlanning(day.datum, "statusAccommodatie", e.target.value)}
          style={{ background: ACC_BG[kind], borderColor: kind !== "neutraal" ? "transparent" : undefined }}
        />
        <input
          className={fieldClass}
          placeholder="Notities"
          value={day.notities}
          onChange={(e) => updatePlanning(day.datum, "notities", e.target.value)}
        />
      </div>
    </div>
  );
}
