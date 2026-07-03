import type { ReactNode } from "react";

export default function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mb-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 ${className ?? ""}`}>
      {title && <h2 className="mb-3 text-[15px] font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
