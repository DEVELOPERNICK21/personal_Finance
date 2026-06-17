"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import { FINANCE_ROUTES, financeHref } from "../../routes";

export function FinanceNav() {
  const pathname = usePathname();
  const { config, flushSave } = useFinance();
  const base = config.basePath.replace(/\/$/, "");

  useEffect(() => {
    void flushSave();
  }, [pathname, flushSave]);

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-4">
      {FINANCE_ROUTES.map((route) => {
        const href = financeHref(config.basePath, route.slug);
        const isActive =
          route.slug === ""
            ? pathname === base || pathname === config.basePath
            : pathname.startsWith(href);

        return (
          <Link
            key={route.slug || "dashboard"}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-surface text-foreground"
                : "text-muted hover:bg-surface/50 hover:text-foreground"
            }`}
          >
            <span className="mr-1.5">{route.icon}</span>
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
