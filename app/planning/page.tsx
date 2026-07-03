"use client";

import { useApp } from "@/lib/store";
import PlanningDayCard from "@/components/PlanningDayCard";
import Button from "@/components/Button";

export default function PlanningPage() {
  const { state, resetPlanning } = useApp();

  return (
    <div>
      {state.planning.map((day) => (
        <PlanningDayCard key={day.datum} day={day} />
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
