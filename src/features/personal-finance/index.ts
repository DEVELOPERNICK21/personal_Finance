/**
 * Personal Finance — pluggable Next.js feature module
 */

export { PersonalFinanceMount } from "./PersonalFinanceMount";
export type { PersonalFinanceMountProps } from "./PersonalFinanceMount";

export { FinanceProvider, useFinance, DEFAULT_CONFIG } from "./presentation/providers/FinanceProvider";
export type { SaveStatus } from "./presentation/providers/FinanceProvider";

export { AuthProvider, useAuth } from "./presentation/providers/AuthProvider";

export { FinanceLayout } from "./components/layout/FinanceLayout";
export { FinanceNav } from "./components/layout/FinanceNav";
export { ThemeToggle } from "./presentation/components/ThemeToggle";
export { LoginPage } from "./presentation/components/LoginPage";

export { DashboardPage } from "./pages/DashboardPage";
export { AccountsPage } from "./pages/AccountsPage";
export { InvestmentsPage } from "./pages/InvestmentsPage";
export { MonthlyMoneyPage } from "./pages/MonthlyMoneyPage";
export { GoalsPage } from "./pages/GoalsPage";
export { InsurancePage } from "./pages/InsurancePage";
export { DocumentsPage } from "./pages/DocumentsPage";
export { EmergencyPage } from "./pages/EmergencyPage";

export {
  FINANCE_ROUTES,
  resolveFinanceSlug,
  financeHref,
  type FinanceRouteSlug,
} from "./routes";

export { createFinanceConfig, DEFAULT_CONFIG as FINANCE_DEFAULT_CONFIG } from "./config";

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
  MoneyReceivable,
  MonthlyMoney,
  AssetInventory,
  FinalInstructions,
} from "./types";

export { calculateMetrics } from "./lib/calculations";
export { formatCurrency, formatCompactCurrency, formatPercent, formatDate } from "./lib/format";
export {
  loadFinanceData,
  saveFinanceData,
  exportFinanceData,
  importFinanceData,
} from "./lib/storage";
export { DEFAULT_FINANCE_DATA } from "./lib/defaults";
