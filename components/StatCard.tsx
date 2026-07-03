type Tone = "neutral" | "blue" | "orange" | "green" | "red";

const TONE_BG: Record<Tone, string> = {
  neutral: "#f8faf9",
  blue: "var(--color-blue-bg)",
  orange: "var(--color-orange-bg)",
  green: "var(--color-green-bg)",
  red: "var(--color-red-bg)",
};

export default function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] p-3"
      style={{ background: TONE_BG[tone] }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </span>
      <span className="text-xl font-bold" style={{ color: tone === "red" ? "var(--color-red)" : "var(--color-text)" }}>
        {value}
      </span>
      {sub && <span className="text-[11px] text-[var(--color-muted)]">{sub}</span>}
    </div>
  );
}
