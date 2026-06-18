export const financeInputClassName =
  "w-full rounded-xl border border-[var(--finance-input-border)] bg-[var(--finance-input-bg)] px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-[var(--finance-input-focus)] focus:ring-2 focus:ring-[var(--finance-input-ring)] focus:outline-none transition-colors";

interface FieldProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  readOnly?: boolean;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted">{label}</label>
      {readOnly || !onChange ? (
        <div className={`${financeInputClassName} bg-[var(--finance-subtle)]`}>
          {value || placeholder || "—"}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={financeInputClassName}
        />
      )}
    </div>
  );
}
