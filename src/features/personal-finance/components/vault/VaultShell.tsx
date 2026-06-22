"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  Landmark,
  Lock,
  MoreHorizontal,
  Phone,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../presentation/providers/AuthProvider";
import { useVault } from "../../presentation/providers/VaultProvider";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import { loadGuestProfile } from "../../lib/guest-profile";
import { financeHref } from "../../routes";
import { VaultBottomNav } from "./VaultBottomNav";

interface VaultShellProps {
  children: React.ReactNode;
  /** Hide chrome for full-screen flows like onboarding */
  bare?: boolean;
}

const SIDEBAR_LINKS = [
  { slug: "" as const, label: "Home", icon: Home },
  { slug: "monthly" as const, label: "Money", icon: Wallet },
  { slug: "goals" as const, label: "Goals", icon: Target },
  { slug: "documents" as const, label: "Docs", icon: FileText },
  { slug: "more" as const, label: "More", icon: MoreHorizontal },
] as const;

const MORE_LINKS = [
  { slug: "accounts" as const, label: "Accounts", icon: Landmark },
  { slug: "investments" as const, label: "Investments", icon: TrendingUp },
  { slug: "insurance" as const, label: "Insurance", icon: Shield },
  { slug: "emergency" as const, label: "Emergency", icon: Phone },
] as const;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(email?: string | null, guestName?: string): string {
  if (guestName) return guestName;
  if (!email) return "there";
  const local = email.split("@")[0] ?? "there";
  const name = local.split(/[._-]/)[0] ?? local;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function VaultShell({ children, bare = false }: VaultShellProps) {
  const { user } = useAuth();
  const { status: vaultStatus, lock } = useVault();
  const { data, config } = useFinance();
  const pathname = usePathname();
  const profile = loadGuestProfile();
  const base = config.basePath.replace(/\/$/, "");
  const isUnlocked = vaultStatus === "unlocked";
  const name = displayName(user?.email, profile.displayName);

  if (bare) {
    return (
      <div className="finance-app min-h-screen bg-[var(--vault-background)] text-[var(--vault-on-surface)]">
        {children}
      </div>
    );
  }

  return (
    <div className="finance-app min-h-screen bg-[var(--vault-background)] text-[var(--vault-on-surface)]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-[var(--vault-outline-variant)]/30 bg-[var(--vault-surface-container-low)] py-6 md:flex">
        <div className="mb-10 px-6">
          <h1 className="vault-headline-sm font-medium text-[var(--vault-primary)]">Vault</h1>
          <p className="vault-label-sm mt-1 flex items-center gap-1 uppercase tracking-wider text-[var(--vault-outline)]">
            <Shield className="h-3 w-3" strokeWidth={2} />
            {isUnlocked ? "Vault open" : "Secure vault"}
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const href = financeHref(config.basePath, link.slug);
            const isActive =
              link.slug === ""
                ? pathname === base || pathname === config.basePath
                : pathname.startsWith(href);
            return (
              <Link
                key={link.slug || "home"}
                href={href}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? "border-r-4 border-[var(--vault-primary)] bg-[var(--vault-primary-container)]/10 font-medium text-[var(--vault-primary)]"
                    : "text-[var(--vault-on-surface-variant)] hover:bg-[var(--vault-surface-container-high)] hover:text-[var(--vault-primary)]"
                }`}
              >
                <link.icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="vault-body-md">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 px-3">
          {MORE_LINKS.map((link) => {
            const href = financeHref(config.basePath, link.slug);
            return (
              <Link
                key={link.slug}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[var(--vault-on-surface-variant)] hover:bg-[var(--vault-surface-container-high)] hover:text-[var(--vault-primary)]"
              >
                <link.icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="vault-label-md">{link.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => lock()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--vault-on-surface)] py-3 text-[var(--vault-surface)] vault-label-md hover:opacity-90"
          >
            <Lock className="h-4 w-4" />
            Lock vault
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--vault-outline-variant)] bg-[var(--vault-surface)] px-[var(--vault-margin)] md:left-64 md:w-[calc(100%-16rem)]">
        <div className="flex flex-col md:hidden">
          <span className="vault-label-sm text-[var(--vault-on-surface-variant)]">
            {getGreeting()}, {name}
          </span>
          <span className="vault-headline-sm font-medium">Vault</span>
        </div>
        <div className="hidden md:block">
          <span className="vault-headline-sm font-medium">{getGreeting()}, {name}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-low)] px-3 py-1">
          <Lock
            className={`h-4 w-4 ${isUnlocked ? "text-[var(--vault-primary)]" : "text-[var(--vault-primary)]"}`}
            strokeWidth={2}
            fill={isUnlocked ? "currentColor" : "none"}
          />
          <span className="vault-label-md uppercase tracking-wider text-[var(--vault-primary)]">
            {isUnlocked ? "Open" : "Locked"}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto min-h-screen max-w-[var(--vault-max-width)] px-[var(--vault-margin)] pb-28 pt-20 md:ml-64 md:max-w-none md:pb-8 md:pt-20 lg:max-w-5xl lg:px-8">
        {children}
        <p className="mt-8 text-center vault-label-sm text-[var(--vault-outline)] md:text-left">
          {data.documents.length} documents · end-to-end encrypted
        </p>
      </main>

      <VaultBottomNav />
    </div>
  );
}
