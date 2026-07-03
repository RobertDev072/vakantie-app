"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

function iconProps(active: boolean) {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: active ? "var(--color-primary)" : "var(--color-muted)",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

const TABS: Tab[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: (active) => (
      <svg {...iconProps(active)}>
        <path d="M3 12 12 3l9 9" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    href: "/planning",
    label: "Planning",
    icon: (active) => (
      <svg {...iconProps(active)}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
      </svg>
    ),
  },
  {
    href: "/kosten",
    label: "Kosten",
    icon: (active) => (
      <svg {...iconProps(active)}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 8.5c-1.5 0-2.5 1-2.5 2.2s1 1.8 2.5 1.8 2.5.6 2.5 1.8-1 2.2-2.5 2.2c-1 0-1.9-.4-2.3-1" />
        <path d="M12 7v2" />
        <path d="M12 15v2" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--color-border)] bg-white/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
              style={{ color: active ? "var(--color-primary)" : "var(--color-muted)" }}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
