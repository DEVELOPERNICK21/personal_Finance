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
      className={`rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-xs font-medium tracking-widest text-zinc-500 uppercase">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
