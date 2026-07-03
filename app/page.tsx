"use client";

import { useApp } from "@/lib/store";
import { formatBRL } from "@/lib/calc";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import AmountInput from "@/components/AmountInput";

export default function DashboardPage() {
  const { state, totals, setStartbudget, resetSettings } = useApp();

  const pctClamped = Math.min(100, Math.max(0, totals.pct));
  const over = totals.uitgegeven > state.startbudget;

  return (
    <div>
      <Card title="Budget instellingen">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Startbudget
          </span>
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-2">
            <span className="text-sm text-[var(--color-muted)]">R$</span>
            <AmountInput
              value={state.startbudget}
              onChange={setStartbudget}
              min={0}
              className="w-full bg-transparent text-lg font-bold outline-none"
            />
          </div>
        </label>
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => {
            if (confirm("Startbudget resetten naar standaard (R$ 33.000)?")) {
              resetSettings();
            }
          }}
        >
          Reset budget
        </Button>
      </Card>

      <Card title="Overzicht">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Totaal betaald" value={formatBRL(totals.betaald)} tone="blue" />
          <StatCard label="Nog te betalen" value={formatBRL(totals.nogTeBetalen)} tone="orange" />
          <StatCard label="Totaal uitgegeven" value={formatBRL(totals.uitgegeven)} tone="neutral" />
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
                ? `over ${totals.daysRemaining} resterende ${totals.daysRemaining === 1 ? "dag" : "dagen"}`
                : "vakantie is voorbij"
            }
            tone="neutral"
          />
        </div>

        <div className="mt-4">
          <div className="h-3.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pctClamped}%`,
                background: over ? "var(--color-red)" : "var(--color-primary)",
              }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--color-muted)]">
            {formatBRL(totals.uitgegeven)} van {formatBRL(state.startbudget)} gepland ({totals.pct.toFixed(0)}%)
          </p>
        </div>
      </Card>
    </div>
  );
}
