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
      <label className="block text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </label>
      {readOnly || !onChange ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100">
          {value || placeholder || "—"}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
      )}
    </div>
  );
}
