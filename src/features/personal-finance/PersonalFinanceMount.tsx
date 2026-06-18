"use client";

import type { ComponentType } from "react";
import { FinanceLayout } from "./components/layout/FinanceLayout";
import { FinanceProvider, useFinance } from "./presentation/providers/FinanceProvider";
import { useAuth } from "./presentation/providers/AuthProvider";
import { useVault } from "./presentation/providers/VaultProvider";
import { LoginPage } from "./presentation/components/LoginPage";
import { VaultUnlockPage } from "./presentation/components/VaultUnlockPage";
import { AccountsPage } from "./pages/AccountsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { EmergencyPage } from "./pages/EmergencyPage";
import { GoalsPage } from "./pages/GoalsPage";
import { InsurancePage } from "./pages/InsurancePage";
import { InvestmentsPage } from "./pages/InvestmentsPage";
import { MonthlyMoneyPage } from "./pages/MonthlyMoneyPage";
import { resolveFinanceSlug, type FinanceRouteSlug } from "./routes";
import type { FinanceConfig, FinanceData } from "./types";

const PAGE_MAP: Record<FinanceRouteSlug, ComponentType> = {
  "": DashboardPage,
  accounts: AccountsPage,
  investments: InvestmentsPage,
  monthly: MonthlyMoneyPage,
  goals: GoalsPage,
  insurance: InsurancePage,
  documents: DocumentsPage,
  emergency: EmergencyPage,
};

export interface PersonalFinanceMountProps {
  slug?: string[];
  config?: Partial<FinanceConfig>;
  initialData?: FinanceData;
}

function FinanceShell({ slug }: { slug?: string[] }) {
  const { saveStatus } = useFinance();
  const resolvedSlug = resolveFinanceSlug(slug);
  const Page = PAGE_MAP[resolvedSlug] ?? DashboardPage;

  if (saveStatus === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
        Loading your finance data...
      </div>
    );
  }

  return (
    <>
      <Page />
    </>
  );
}

function VaultGate({
  slug,
  config,
  initialData,
}: PersonalFinanceMountProps) {
  const { status: vaultStatus } = useVault();

  if (vaultStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/60">
        Securing your vault...
      </div>
    );
  }

  if (vaultStatus === "locked" || vaultStatus === "setup") {
    return <VaultUnlockPage />;
  }

  return (
    <FinanceProvider config={config} initialData={initialData}>
      <FinanceLayout>
        <FinanceShell slug={slug} />
      </FinanceLayout>
    </FinanceProvider>
  );
}

function AuthGate({
  slug,
  config,
  initialData,
}: PersonalFinanceMountProps) {
  const { status: authStatus } = useAuth();

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/60">
        Loading...
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return <LoginPage />;
  }

  return (
    <VaultGate slug={slug} config={config} initialData={initialData} />
  );
}

export function PersonalFinanceMount({
  slug,
  config,
  initialData,
}: PersonalFinanceMountProps) {
  return <AuthGate slug={slug} config={config} initialData={initialData} />;
}
