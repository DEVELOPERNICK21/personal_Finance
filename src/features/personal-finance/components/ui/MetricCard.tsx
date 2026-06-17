interface MetricCardProps {
  label: string;
  value: string;
  variant?: "default" | "warning" | "success";
}

const variantStyles = {
  default: "text-foreground",
  warning: "text-accent-warning",
  success: "text-accent-success",
};

export function MetricCard({ label, value, variant = "default" }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-input p-4">
      <p className="text-[10px] tracking-wider text-muted uppercase">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${variantStyles[variant]}`}>
        {value}
      </p>
    </div>
  );
}
