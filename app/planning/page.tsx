"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { groupPlanningDays } from "@/lib/planning";
import { todayISO } from "@/lib/date";
import PlanningSegment from "@/components/PlanningSegment";
import Button from "@/components/Button";

export default function PlanningPage() {
  const { state, resetPlanning } = useApp();
  const groups = useMemo(() => groupPlanningDays(state.planning), [state.planning]);

  const defaultOpenKey = useMemo(() => {
    const today = todayISO();
    const current = groups.find((g) => today >= g.days[0].datum && today <= g.days[g.days.length - 1].datum);
    return (current ?? groups[0])?.key;
  }, [groups]);

  return (
    <div>
      {groups.map((g) => (
        <PlanningSegment key={g.key} group={g} defaultOpen={g.key === defaultOpenKey} />
      ))}
      <Button
        variant="secondary"
        className="mb-4 w-full"
        onClick={() => {
          if (confirm("Planning resetten naar standaard? Eigen aanpassingen gaan verloren.")) {
            resetPlanning();
          }
        }}
      >
        Reset planning naar standaard
      </Button>
    </div>
  );
}
