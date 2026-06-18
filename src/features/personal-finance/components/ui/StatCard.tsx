import type { LucideIcon } from "lucide-react";
import { MoreVertical } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-[var(--finance-card)] p-5 shadow-sm shadow-black/[0.04] dark:shadow-black/20">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--finance-subtle)]">
          <Icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
        </div>
        <button
          type="button"
          className="text-muted/50 hover:text-muted"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {trend && (
        <span
          className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            trend.positive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
          }`}
        >
          {trend.value}
        </span>
      )}
    </div>
  );
}
