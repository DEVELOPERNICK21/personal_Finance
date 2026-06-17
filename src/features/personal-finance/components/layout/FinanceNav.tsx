"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFinance } from "../../context/FinanceProvider";
import { FINANCE_ROUTES, financeHref } from "../../routes";

export function FinanceNav() {
  const pathname = usePathname();
  const { config } = useFinance();
  const base = config.basePath.replace(/\/$/, "");

  return (
    <nav className="flex flex-wrap gap-1 border-b border-zinc-800 pb-4">
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
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
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
