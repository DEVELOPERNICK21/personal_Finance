interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:opacity-90"
      : "border border-[var(--btn-secondary-border)] bg-transparent text-foreground hover:bg-surface";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
