"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, MoreHorizontal, Target, Wallet } from "lucide-react";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import { financeHref } from "../../routes";

const NAV_ITEMS = [
  { slug: "" as const, label: "Home", icon: Home },
  { slug: "monthly" as const, label: "Money", icon: Wallet },
  { slug: "goals" as const, label: "Goals", icon: Target },
  { slug: "documents" as const, label: "Docs", icon: FileText },
  { slug: "more" as const, label: "More", icon: MoreHorizontal },
] as const;

export function VaultBottomNav() {
  const pathname = usePathname();
  const { config } = useFinance();
  const base = config.basePath.replace(/\/$/, "");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)] px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex w-full max-w-[var(--vault-max-width)] justify-around">
        {NAV_ITEMS.map((item) => {
          const href = financeHref(config.basePath, item.slug);
          const isActive =
            item.slug === ""
              ? pathname === base || pathname === config.basePath
              : pathname.startsWith(href);

          return (
            <Link
              key={item.slug || "home"}
              href={href}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-95 ${
                isActive
                  ? "bg-[var(--vault-primary-container)] text-[var(--vault-on-primary-container)]"
                  : "text-[var(--vault-on-surface-variant)] hover:bg-[var(--vault-surface-container-high)]"
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} />
              <span className="vault-label-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
