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
      <label className="block text-[10px] font-medium tracking-wider text-muted uppercase">
        {label}
      </label>
      {readOnly || !onChange ? (
        <div className="rounded-lg border border-border bg-surface-input px-3 py-2.5 text-sm text-foreground">
          {value || placeholder || "—"}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-surface-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-muted focus:outline-none"
        />
      )}
    </div>
  );
}
