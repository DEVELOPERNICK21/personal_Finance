"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  FileText,
  Landmark,
  LayoutDashboard,
  MoreHorizontal,
  Phone,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import { FINANCE_ROUTES, financeHref, type FinanceRouteSlug } from "../../routes";

const ROUTE_ICONS: Record<FinanceRouteSlug, typeof LayoutDashboard> = {
  "": LayoutDashboard,
  accounts: Landmark,
  investments: TrendingUp,
  monthly: Wallet,
  goals: Target,
  insurance: Shield,
  documents: FileText,
  emergency: Phone,
  more: MoreHorizontal,
};

export function FinanceSidebar() {
  const pathname = usePathname();
  const { config, flushSave } = useFinance();
  const [expanded, setExpanded] = useState(false);
  const base = config.basePath.replace(/\/$/, "");

  useEffect(() => {
    void flushSave();
  }, [pathname, flushSave]);

  return (
    <aside
      className={`relative flex shrink-0 flex-col bg-[#171717] py-6 transition-all duration-300 ${
        expanded ? "w-52 px-4" : "w-[72px] items-center px-3"
      }`}
    >
      <div className={`mb-8 ${expanded ? "px-1" : ""}`}>
        <span className="text-lg font-semibold tracking-tight text-white">
          {expanded ? "finance" : "f"}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {FINANCE_ROUTES.map((route) => {
          const href = financeHref(config.basePath, route.slug);
          const isActive =
            route.slug === ""
              ? pathname === base || pathname === config.basePath
              : pathname.startsWith(href);
          const Icon = ROUTE_ICONS[route.slug];

          return (
            <Link
              key={route.slug || "dashboard"}
              href={href}
              title={route.label}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              } ${expanded ? "" : "justify-center"}`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              {expanded && <span className="text-sm font-medium">{route.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <button
          type="button"
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-white/50 hover:bg-white/10 hover:text-white ${
            expanded ? "" : "justify-center"
          }`}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          {expanded && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="absolute top-1/2 -right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8F1F2]/20 bg-white text-[#171717] shadow-md"
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </aside>
  );
}
