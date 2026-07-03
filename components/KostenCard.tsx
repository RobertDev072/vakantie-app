"use client";

import { useApp } from "@/lib/store";
import AmountInput from "@/components/AmountInput";
import type { KostenPost } from "@/lib/types";

const fieldClass =
  "w-full rounded-lg border border-[var(--color-border)] px-2.5 py-2 text-sm outline-none focus:border-[var(--color-primary)]";

export default function KostenCard({ item }: { item: KostenPost }) {
  const { updateKosten, deleteKosten } = useApp();
  const betaald = item.status === "betaald";

  return (
    <div className="mb-3 rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <input
          className={`${fieldClass} flex-1 font-semibold`}
          placeholder="Onderdeel"
          value={item.onderdeel}
          onChange={(e) => updateKosten(item.id, "onderdeel", e.target.value)}
        />
        <button
          type="button"
          aria-label="Verwijderen"
          onClick={() => {
            if (confirm("Deze kostenpost verwijderen?")) deleteKosten(item.id);
          }}
          className="shrink-0 rounded-lg border border-red-200 bg-[var(--color-red-bg)] px-2.5 py-2 text-[var(--color-red)]"
        >
          🗑️
        </button>
      </div>

      <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-2">
        <span className="text-sm text-[var(--color-muted)]">R$</span>
        <AmountInput
          className="w-full bg-transparent text-sm outline-none"
          value={item.bedrag}
          onChange={(n) => updateKosten(item.id, "bedrag", n)}
        />
      </div>

      <input
        className={`${fieldClass} mb-2`}
        placeholder="Betaalmethode"
        value={item.betaalmethode}
        onChange={(e) => updateKosten(item.id, "betaalmethode", e.target.value)}
      />

      <select
        className={`${fieldClass} mb-2 font-medium`}
        value={item.status}
        onChange={(e) => updateKosten(item.id, "status", e.target.value)}
        style={{
          background: betaald ? "var(--color-green-bg)" : "var(--color-orange-bg)",
          color: betaald ? "#0f5132" : "#7a4a02",
        }}
      >
        <option value="betaald">Betaald</option>
        <option value="nog betalen">Nog betalen</option>
      </select>

      <input
        className={fieldClass}
        placeholder="Opmerking"
        value={item.opmerking}
        onChange={(e) => updateKosten(item.id, "opmerking", e.target.value)}
      />
    </div>
  );
}
