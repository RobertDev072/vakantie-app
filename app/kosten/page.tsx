"use client";

import { useApp } from "@/lib/store";
import { formatBRL } from "@/lib/calc";
import KostenCard from "@/components/KostenCard";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";

export default function KostenPage() {
  const { state, totals, addKosten, resetKosten } = useApp();

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <StatCard label="Betaald" value={formatBRL(totals.betaald)} tone="blue" />
        <StatCard label="Nog te betalen" value={formatBRL(totals.nogTeBetalen)} tone="orange" />
        <StatCard
          label="Resterend budget"
          value={formatBRL(totals.resterend)}
          tone={totals.resterend < 0 ? "red" : "green"}
        />
        <StatCard
          label="Gemiddeld/dag"
          value={totals.perDag !== null ? formatBRL(totals.perDag) : "—"}
          sub={
            totals.daysRemaining > 0
              ? `over ${totals.daysRemaining} ${totals.daysRemaining === 1 ? "dag" : "dagen"}`
              : "vakantie is voorbij"
          }
          tone="neutral"
        />
      </div>

      {state.kosten.map((item) => (
        <KostenCard key={item.id} item={item} />
      ))}

      <Button variant="primary" className="mb-2 w-full" onClick={() => addKosten()}>
        + Kostenpost toevoegen
      </Button>
      <Button
        variant="secondary"
        className="mb-4 w-full"
        onClick={() => {
          if (confirm("Kosten resetten naar standaard? Eigen aanpassingen gaan verloren.")) {
            resetKosten();
          }
        }}
      >
        Reset kosten naar standaard
      </Button>
    </div>
  );
}
