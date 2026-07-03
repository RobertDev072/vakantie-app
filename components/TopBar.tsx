"use client";

import { useApp } from "@/lib/store";

export default function TopBar() {
  const { totals } = useApp();

  return (
    <header
      className="sticky top-0 z-20 text-white"
      style={{
        background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <div>
          <h1 className="text-[15px] font-semibold leading-tight">🌴 Brazilië 2026</h1>
          <p className="text-[11px] leading-tight text-white/85">28 aug – 23 sep</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          {totals.tripProgressText}
        </span>
      </div>
    </header>
  );
}
