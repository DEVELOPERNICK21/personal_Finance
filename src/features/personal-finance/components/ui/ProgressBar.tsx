interface ProgressBarProps {
  segments: { label: string; percent: number; color: string }[];
}

export function AllocationBar({ segments }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-surface-elevated">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all`}
            style={{ width: `${Math.max(seg.percent, 0)}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        {segments.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${seg.color}`} />
            {seg.label} ({Math.round(seg.percent)}%)
          </span>
        ))}
      </div>
    </div>
  );
}

interface SimpleProgressProps {
  percent: number;
  color?: string;
}

export function SimpleProgress({
  percent,
  color = "bg-accent-success",
}: SimpleProgressProps) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-surface-elevated">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
