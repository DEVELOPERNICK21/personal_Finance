"use client";

import type { ReactNode } from "react";
import { Lock, LockOpen, Shield } from "lucide-react";
import { useAuth } from "../../presentation/providers/AuthProvider";
import { useVault } from "../../presentation/providers/VaultProvider";
import { loadGuestProfile } from "../../lib/guest-profile";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import { MobileBottomNav } from "./MobileBottomNav";

interface MobileFinanceLayoutProps {
  children: ReactNode;
}

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

export function MobileFinanceLayout({ children }: MobileFinanceLayoutProps) {
  const { user } = useAuth();
  const { status: vaultStatus } = useVault();
  const { data } = useFinance();
  const profile = loadGuestProfile();

  const isVaultUnlocked = vaultStatus === "unlocked";
  const docCount = data.documents.length;

  return (
    <div className="finance-app min-h-screen bg-white dark:bg-zinc-900">
      <div className="mx-auto min-h-screen max-w-[420px] pb-24">
        <header className="flex items-center justify-between px-5 pt-6 pb-2">
          <h1 className="text-lg font-medium text-foreground">
            {getGreeting()}, {displayName(user?.email, profile.displayName)}
          </h1>
          <VaultPill unlocked={isVaultUnlocked} docCount={docCount} />
        </header>

        <main className="px-5 py-4">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function VaultPill({ unlocked, docCount }: { unlocked: boolean; docCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1 rounded-full border border-border/50 bg-gray-50 px-2 py-1 text-[10px] text-muted dark:bg-zinc-800 sm:flex">
        <Shield className="h-3 w-3 text-[var(--accent-teal)]" />
        E2EE
      </span>
      <span
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          unlocked
            ? "bg-[var(--accent-teal-muted)]/30 text-[var(--accent-teal)]"
            : "bg-gray-100 text-muted dark:bg-zinc-800"
        }`}
      >
        {unlocked ? (
          <LockOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : (
          <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
        {unlocked ? "Vault open" : "Vault locked"}
      </span>
      {docCount >= 0 && (
        <span className="sr-only">{docCount} documents stored</span>
      )}
    </div>
  );
}
