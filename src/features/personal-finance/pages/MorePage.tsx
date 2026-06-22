"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  Landmark,
  LogIn,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../presentation/providers/AuthProvider";
import { useFinance } from "../presentation/providers/FinanceProvider";
import { LoginPage } from "../presentation/components/LoginPage";
import { financeHref } from "../routes";

const MORE_LINKS = [
  { slug: "accounts" as const, label: "Accounts", icon: Landmark },
  { slug: "investments" as const, label: "Investments", icon: TrendingUp },
  { slug: "insurance" as const, label: "Insurance", icon: Shield },
  { slug: "emergency" as const, label: "Emergency contacts", icon: AlertTriangle },
] as const;

export function MorePage() {
  const { config } = useFinance();
  const { user, status, isConfigured } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const base = config.basePath;

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="vault-headline-sm">More</h2>
        <p className="mt-1 vault-body-sm text-[var(--vault-on-surface-variant)]">
          Accounts, insurance, and settings
        </p>
      </div>

      <ul className="divide-y divide-[var(--vault-outline-variant)]/50 overflow-hidden rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)]">
        {MORE_LINKS.map((link) => (
          <li key={link.slug}>
            <Link
              href={financeHref(base, link.slug)}
              className="flex items-center gap-3 px-4 py-3.5 vault-body-sm hover:bg-[var(--vault-surface-container-low)]"
            >
              <link.icon className="h-4 w-4 text-[var(--vault-outline)]" strokeWidth={1.75} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {isConfigured && status === "unauthenticated" && (
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="w-full rounded-xl border border-[var(--vault-primary)]/30 bg-[var(--vault-primary)]/10 p-4 text-left"
        >
          <div className="flex items-start gap-3">
            <LogIn className="mt-0.5 h-4 w-4 text-[var(--vault-primary)]" />
            <div>
              <p className="vault-body-sm font-medium">Sign in to encrypt & sync</p>
              <p className="mt-1 vault-label-sm text-[var(--vault-on-surface-variant)]">
                Your data stays on this device until you create an account and unlock your vault.
              </p>
            </div>
          </div>
        </button>
      )}

      {user && (
        <p className="text-center vault-label-sm text-[var(--vault-outline)]">
          Signed in as {user.email}
        </p>
      )}
    </div>
  );
}
