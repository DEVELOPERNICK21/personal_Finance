export const financeInputClassName =
  "w-full rounded-xl border border-[var(--finance-input-border)] bg-[var(--finance-input-bg)] px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:border-[var(--finance-input-focus)] focus:ring-2 focus:ring-[var(--finance-input-ring)] focus:outline-none transition-colors";

interface FieldProps {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  readOnly?: boolean;
  /** When true (default for number fields), 0 renders as empty input; empty input saves as 0. */
  emptyZero?: boolean;
}

function formatInputValue(
  value: string | number,
  type: FieldProps["type"],
  emptyZero: boolean
): string {
  if (type === "number" && emptyZero) {
    if (value === 0 || value === "0" || value === "" || value == null) return "";
    return String(value);
  }
  if (value == null) return "";
  return String(value);
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
  emptyZero = type === "number",
}: FieldProps) {
  const displayValue = formatInputValue(value, type, emptyZero);
  const numberPlaceholder = placeholder ?? (type === "number" && emptyZero ? "0" : undefined);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-muted">{label}</label>
      {readOnly || !onChange ? (
        <div className={`${financeInputClassName} bg-[var(--finance-subtle)]`}>
          {type === "number" && emptyZero && (value === 0 || value === "0")
            ? "0"
            : displayValue || numberPlaceholder || "—"}
        </div>
      ) : (
        <input
          type={type}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={numberPlaceholder}
          autoComplete="off"
          min={type === "number" ? 0 : undefined}
          className={financeInputClassName}
        />
      )}
    </div>
  );
}
