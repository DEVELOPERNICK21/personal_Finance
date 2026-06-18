import type { ReactNode } from "react";

interface DashCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function DashCard({
  title,
  subtitle,
  children,
  className = "",
  dark = false,
}: DashCardProps) {
  return (
    <section
      className={`rounded-3xl p-6 ${
        dark
          ? "bg-[#171717] text-white dark:bg-[#0a0a0a]"
          : "border border-border bg-[var(--finance-card)] text-foreground shadow-sm shadow-black/[0.04] dark:shadow-black/20"
      } ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className={`mt-0.5 text-xs ${dark ? "text-white/50" : "text-muted"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
