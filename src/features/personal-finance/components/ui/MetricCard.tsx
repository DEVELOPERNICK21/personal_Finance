interface MetricCardProps {
  label: string;
  value: string;
  variant?: "default" | "warning" | "success";
}

const variantStyles = {
  default: "text-zinc-100",
  warning: "text-orange-400",
  success: "text-emerald-400",
};

export function MetricCard({ label, value, variant = "default" }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-[10px] tracking-wider text-zinc-500 uppercase">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${variantStyles[variant]}`}>
        {value}
      </p>
    </div>
  );
}
