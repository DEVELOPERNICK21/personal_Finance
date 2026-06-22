"use client";

import { ShieldCheck } from "lucide-react";

interface OnboardingStepperProps {
  step: 1 | 2 | 3;
}

export function OnboardingStepper({ step }: OnboardingStepperProps) {
  return (
    <div className="mb-12 mt-8 flex items-center justify-start gap-3">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center gap-3">
          {i > 0 && (
            <div className="h-px w-8 border-t-2 border-dashed border-[var(--vault-outline-variant)]" />
          )}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              n < step
                ? "bg-[var(--vault-primary)] text-[var(--vault-on-primary)]"
                : n === step
                  ? "bg-[var(--vault-primary)] text-[var(--vault-on-primary)]"
                  : "border-2 border-[var(--vault-outline-variant)]"
            }`}
          >
            {n < step ? (
              <span className="text-xs font-medium">✓</span>
            ) : n === step ? (
              <span className="h-2 w-2 rounded-full bg-[var(--vault-on-primary)]" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-[var(--vault-outline-variant)]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface CurrencyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  secure?: boolean;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  hint,
  secure,
}: CurrencyInputProps) {
  return (
    <div className="group">
      <label htmlFor={id} className="vault-label-md mb-2 block text-[var(--vault-on-surface-variant)]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 vault-headline-sm text-[var(--vault-outline)]">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={placeholder}
          className="h-16 w-full rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)] pl-10 pr-4 vault-headline-md text-[var(--vault-on-surface)] transition-all focus:border-[var(--vault-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--vault-primary)]/10 dark:focus:bg-[var(--vault-surface-container)]"
        />
      </div>
      {secure && (
        <div className="mt-2 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--vault-primary)]" strokeWidth={2} />
          <p className="vault-label-sm text-[var(--vault-on-surface-variant)]">Private to your vault</p>
        </div>
      )}
      {hint && !secure && (
        <p className="mt-2 vault-label-sm text-[var(--vault-on-surface-variant)]">{hint}</p>
      )}
    </div>
  );
}

interface VaultButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "nudge";
  className?: string;
}

export function VaultButton({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
  className = "",
}: VaultButtonProps) {
  const styles = {
    primary:
      "h-14 w-full bg-[var(--vault-primary)] text-[var(--vault-on-primary)] shadow-sm active:scale-[0.98]",
    ghost: "text-[var(--vault-on-surface-variant)] hover:text-[var(--vault-on-surface)]",
    nudge:
      "w-full border border-[var(--vault-secondary)] bg-[var(--vault-secondary-fixed)] p-4 text-left text-[var(--vault-on-secondary-fixed-variant)] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl vault-headline-sm font-medium transition-transform disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function VaultSecurityBadge() {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-low)] px-3 py-1.5">
        <span className="text-[var(--vault-primary)]">🔒</span>
        <span className="vault-label-sm uppercase tracking-wider text-[var(--vault-on-surface-variant)]">
          End-to-end encrypted vault
        </span>
      </div>
    </div>
  );
}
