"use client";

import { useState } from "react";
import PlanningDayCard from "@/components/PlanningDayCard";
import { accStatusKind } from "@/lib/calc";
import { formatDateNL } from "@/lib/date";
import type { PlanningGroup } from "@/lib/planning";

const BADGE_CLASS: Record<ReturnType<typeof accStatusKind>, string> = {
  geboekt: "bg-[var(--color-green-bg)] text-[#0f5132]",
  nogboeken: "bg-[var(--color-orange-bg)] text-[#7a4a02]",
  neutraal: "bg-gray-100 text-[var(--color-muted)]",
};

export default function PlanningSegment({ group, defaultOpen }: { group: PlanningGroup; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const kind = accStatusKind(group.statusAccommodatie);
  const first = group.days[0];
  const last = group.days[group.days.length - 1];
  const range =
    group.days.length > 1 ? `${formatDateNL(first.datum)} – ${formatDateNL(last.datum)}` : formatDateNL(first.datum);

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-3.5 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{group.plaats || "Onderweg"}</p>
          <p className="text-[12px] text-[var(--color-muted)]">
            {range} · {group.days.length} {group.days.length === 1 ? "dag" : "dagen"}
          </p>
        </div>
        {group.statusAccommodatie && (
          <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${BADGE_CLASS[kind]}`}>
            {group.statusAccommodatie}
          </span>
        )}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-[var(--color-muted)] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="border-t border-[var(--color-border)] bg-[#f8faf9] p-3">
            {group.days.map((day) => (
              <PlanningDayCard key={day.datum} day={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
