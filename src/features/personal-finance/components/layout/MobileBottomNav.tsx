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

export function MobileBottomNav() {
  const pathname = usePathname();
  const { config } = useFinance();
  const base = config.basePath.replace(/\/$/, "");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-white/95 backdrop-blur-md dark:bg-zinc-900/95">
      <div className="mx-auto flex max-w-[420px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
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
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-[var(--accent-level)]"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
