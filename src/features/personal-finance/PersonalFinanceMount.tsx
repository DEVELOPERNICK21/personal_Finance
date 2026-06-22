"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useState } from "react";
import { VaultShell } from "./components/vault/VaultShell";
import { FinanceProvider, useFinance } from "./presentation/providers/FinanceProvider";
import { useAuth } from "./presentation/providers/AuthProvider";
import { useVault } from "./presentation/providers/VaultProvider";
import { VaultUnlockPage } from "./presentation/components/VaultUnlockPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { AccountsPage } from "./pages/AccountsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { EmergencyPage } from "./pages/EmergencyPage";
import { GoalsPage } from "./pages/GoalsPage";
import { InsurancePage } from "./pages/InsurancePage";
import { InvestmentsPage } from "./pages/InvestmentsPage";
import { MonthlyMoneyPage } from "./pages/MonthlyMoneyPage";
import { MorePage } from "./pages/MorePage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { resolveFinanceSlug, type FinanceRouteSlug } from "./routes";
import type { FinanceConfig, FinanceData } from "./types";
import { GUEST_UID, loadGuestProfile } from "./lib/guest-profile";
import { normalizeFinanceData } from "./core/domain/defaults";
import { loadLocalFinanceData, saveLocalFinanceData } from "./infrastructure/finance-repository";

const PAGE_MAP: Record<FinanceRouteSlug, ComponentType> = {
  "": DashboardPage,
  accounts: AccountsPage,
  investments: InvestmentsPage,
  monthly: MonthlyMoneyPage,
  goals: GoalsPage,
  roadmap: RoadmapPage,
  insurance: InsurancePage,
  documents: DocumentsPage,
  emergency: EmergencyPage,
  more: MorePage,
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

  return <Page />;
}

function AppChrome({
  slug,
  config,
  initialData,
}: PersonalFinanceMountProps) {
  return (
    <FinanceProvider config={config} initialData={initialData} guestMode>
      <VaultShell>
        <FinanceShell slug={slug} />
      </VaultShell>
    </FinanceProvider>
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-sm text-white/60">
        Securing your vault...
      </div>
    );
  }

  if (vaultStatus === "locked" || vaultStatus === "setup") {
    return <VaultUnlockPage />;
  }

  return (
    <FinanceProvider config={config} initialData={initialData}>
      <VaultShell>
        <FinanceShell slug={slug} />
      </VaultShell>
    </FinanceProvider>
  );
}

function AuthenticatedApp(props: PersonalFinanceMountProps) {
  return <VaultGate {...props} />;
}

function GuestOrAuthApp(props: PersonalFinanceMountProps) {
  const { status: authStatus, user } = useAuth();

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-sm text-white/60">
        Loading...
      </div>
    );
  }

  if (user) {
    return <AuthenticatedApp {...props} />;
  }

  return <AppChrome {...props} />;
}

function OnboardingGate(props: PersonalFinanceMountProps) {
  const [ready, setReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [guestInitial, setGuestInitial] = useState<FinanceData | undefined>();

  useEffect(() => {
    const profile = loadGuestProfile();
    if (profile.onboardingComplete) {
      void loadLocalFinanceData(GUEST_UID).then((data) => {
        setGuestInitial(data);
        setOnboardingDone(true);
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback((partial: Partial<FinanceData>) => {
    const merged = normalizeFinanceData(partial);
    void saveLocalFinanceData(GUEST_UID, merged, null, null);
    setGuestInitial(merged);
    setOnboardingDone(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-muted dark:bg-zinc-900">
        Loading...
      </div>
    );
  }

  if (!onboardingDone) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return <GuestOrAuthApp {...props} initialData={guestInitial ?? props.initialData} />;
}

export function PersonalFinanceMount(props: PersonalFinanceMountProps) {
  return <OnboardingGate {...props} />;
}
