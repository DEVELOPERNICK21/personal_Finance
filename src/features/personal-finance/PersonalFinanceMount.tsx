"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { AuthGate } from "./components/AuthGate";
import { FinanceLayout } from "./components/layout/FinanceLayout";
import { SaveStatusBar } from "./components/layout/SaveStatusBar";
import { FinanceProvider, useFinance } from "./context/FinanceProvider";
import { getStoredAccessKey } from "./lib/remote-storage";
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
  const { saveStatus, isAuthenticated, usesCloudStorage, retryCloudSync } = useFinance();
  const [cloudAvailable, setCloudAvailable] = useState<boolean | null>(null);
  const resolvedSlug = resolveFinanceSlug(slug);
  const Page = PAGE_MAP[resolvedSlug] ?? DashboardPage;

  useEffect(() => {
    void fetch("/api/finance/status")
      .then((r) => r.json())
      .then((json: { cloudConfigured: boolean }) => setCloudAvailable(json.cloudConfigured))
      .catch(() => setCloudAvailable(false));
  }, []);

  const needsAuth =
    cloudAvailable === true && !isAuthenticated && !getStoredAccessKey();

  if (needsAuth) {
    return <AuthGate onAuthenticated={() => retryCloudSync()} />;
  }

  if (saveStatus === "loading" || cloudAvailable === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-400">
        Loading your finance data...
      </div>
    );
  }

  return (
    <>
      <SaveStatusBar
        status={saveStatus}
        usesCloudStorage={usesCloudStorage}
        onRetry={retryCloudSync}
      />
      <Page />
    </>
  );
}

export function PersonalFinanceMount({
  slug,
  config,
  initialData,
}: PersonalFinanceMountProps) {
  return (
    <FinanceProvider config={config} initialData={initialData}>
      <FinanceLayout>
        <FinanceShell slug={slug} />
      </FinanceLayout>
    </FinanceProvider>
  );
}
