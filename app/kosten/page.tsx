"use client";

import { useApp } from "@/lib/store";
import { formatEUR } from "@/lib/calc";
import KostenCard from "@/components/KostenCard";
import Button from "@/components/Button";

export default function KostenPage() {
  const { state, totals, addKosten, resetKosten } = useApp();

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <div className="flex-1 rounded-xl border border-[var(--color-border)] p-3" style={{ background: "var(--color-blue-bg)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">Betaald</p>
          <p className="text-base font-bold">{formatEUR(totals.betaald)}</p>
        </div>
        <div className="flex-1 rounded-xl border border-[var(--color-border)] p-3" style={{ background: "var(--color-orange-bg)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">Nog te betalen</p>
          <p className="text-base font-bold">{formatEUR(totals.nogTeBetalen)}</p>
        </div>
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
