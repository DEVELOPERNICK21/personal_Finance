export const FINANCE_ROUTES = [
  { slug: "", label: "Dashboard", icon: "🏠" },
  { slug: "accounts", label: "Accounts", icon: "💰" },
  { slug: "investments", label: "Investments", icon: "📈" },
  { slug: "monthly", label: "Monthly Money", icon: "📊" },
  { slug: "goals", label: "Goals", icon: "🎯" },
  { slug: "roadmap", label: "Roadmap", icon: "🗺️" },
  { slug: "insurance", label: "Insurance", icon: "🛡️" },
  { slug: "documents", label: "Documents", icon: "📄" },
  { slug: "emergency", label: "Emergency Info", icon: "☎" },
  { slug: "more", label: "More", icon: "⋯" },
] as const;

export type FinanceRouteSlug = (typeof FINANCE_ROUTES)[number]["slug"];

export function resolveFinanceSlug(slug?: string[]): FinanceRouteSlug {
  const segment = slug?.[0] ?? "";
  const match = FINANCE_ROUTES.find((r) => r.slug === segment);
  return match ? match.slug : "";
}

export function financeHref(basePath: string, slug: FinanceRouteSlug): string {
  const base = basePath.replace(/\/$/, "");
  return slug ? `${base}/${slug}` : base;
}
