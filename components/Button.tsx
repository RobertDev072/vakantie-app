import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-[var(--color-primary)] text-white active:bg-[var(--color-primary-dark)]",
  secondary: "bg-white border border-[var(--color-border)] text-[var(--color-text)] active:bg-gray-50",
  danger: "bg-[var(--color-red-bg)] border border-red-200 text-[var(--color-red)] active:bg-red-100",
};

export default function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${VARIANT_CLASS[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
