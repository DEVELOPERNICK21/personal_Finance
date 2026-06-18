import type { ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, icon, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-border bg-[var(--finance-card)] p-5 shadow-sm shadow-black/[0.04] dark:shadow-black/20 ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
