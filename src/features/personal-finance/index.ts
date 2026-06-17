/**
 * Personal Finance — pluggable Next.js feature module
 *
 * Copy `src/features/personal-finance/` into any Next.js App Router project
 * and mount via PersonalFinanceMount in a catch-all route.
 */

// Mount component (primary integration point)
export { PersonalFinanceMount } from "./PersonalFinanceMount";
export type { PersonalFinanceMountProps } from "./PersonalFinanceMount";

// Provider & hooks (for custom layouts)
export { FinanceProvider, useFinance } from "./context/FinanceProvider";

// Layout & navigation (for custom routing)
export { FinanceLayout } from "./components/layout/FinanceLayout";
export { FinanceNav } from "./components/layout/FinanceNav";

// Individual pages (for custom route wiring)
export { DashboardPage } from "./pages/DashboardPage";
export { AccountsPage } from "./pages/AccountsPage";
export { InvestmentsPage } from "./pages/InvestmentsPage";
export { MonthlyMoneyPage } from "./pages/MonthlyMoneyPage";
export { GoalsPage } from "./pages/GoalsPage";
export { InsurancePage } from "./pages/InsurancePage";
export { DocumentsPage } from "./pages/DocumentsPage";
export { EmergencyPage } from "./pages/EmergencyPage";

// Routes manifest
export {
  FINANCE_ROUTES,
  resolveFinanceSlug,
  financeHref,
  type FinanceRouteSlug,
} from "./routes";

// Config
export { createFinanceConfig, DEFAULT_CONFIG as FINANCE_DEFAULT_CONFIG } from "./config";

// Types
export type {
  FinanceData,
  FinanceConfig,
  FinanceMetrics,
  Account,
  AccountType,
  Goal,
  InsurancePolicy,
  Document,
  EmergencyContact,
  MonthlyMoney,
  AssetInventory,
  FinalInstructions,
} from "./types";

// Utilities
export { calculateMetrics } from "./lib/calculations";
export { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from "./lib/format";
export {
  loadFinanceData,
  saveFinanceData,
  exportFinanceData,
  importFinanceData,
} from "./lib/storage";
export { DEFAULT_FINANCE_DATA } from "./lib/defaults";
