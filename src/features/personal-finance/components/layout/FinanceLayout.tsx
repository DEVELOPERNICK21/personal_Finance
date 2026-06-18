"use client";

import type { ReactNode } from "react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../presentation/providers/AuthProvider";
import { ThemeToggle } from "../../presentation/components/ThemeToggle";
import { FinanceSidebar } from "./FinanceSidebar";
import { useFinance } from "../../presentation/providers/FinanceProvider";
import type { SaveStatus } from "../../presentation/providers/FinanceProvider";

interface FinanceLayoutProps {
  children: ReactNode;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(email?: string | null): string {
  if (!email) return "there";
  const local = email.split("@")[0] ?? "there";
  const name = local.split(/[._-]/)[0] ?? local;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const colors: Record<SaveStatus, string> = {
    idle: "bg-muted/40",
    loading: "bg-amber-400",
    saving: "bg-amber-400 animate-pulse",
    saved: "bg-emerald-500",
    error: "bg-rose-500",
    offline: "bg-amber-400",
  };

  const labels: Record<SaveStatus, string> = {
    idle: "Ready",
    loading: "Loading",
    saving: "Saving…",
    saved: "Saved",
    error: "Save failed",
    offline: "Local only",
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span className={`h-2 w-2 rounded-full ${colors[status]}`} />
      {labels[status]}
    </div>
  );
}

export function FinanceLayout({ children }: FinanceLayoutProps) {
  const { user, signOut } = useAuth();
  const { saveStatus, usesCloudStorage, retryCloudSync } = useFinance();

  return (
    <div className="finance-app flex min-h-screen bg-[var(--finance-canvas)] text-foreground antialiased">
      <FinanceSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getGreeting()}, {displayName(user?.email)}!
            </h1>
            <p className="mt-0.5 text-sm text-muted">Your financial snapshot at a glance</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SaveIndicator status={saveStatus} />
            {usesCloudStorage && saveStatus === "saved" && (
              <span className="hidden text-xs text-muted/70 sm:inline">· cloud sync on</span>
            )}
            {saveStatus === "error" && (
              <button
                type="button"
                onClick={() => retryCloudSync()}
                className="text-xs font-medium text-accent-danger hover:underline"
              >
                Retry save
              </button>
            )}
            <ThemeToggle />
            <button
              type="button"
              className="text-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <div className="flex items-center gap-2 rounded-full bg-[var(--finance-header-chip)] py-1 pl-1 pr-2 shadow-sm ring-1 ring-border/60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white dark:bg-white dark:text-[#171717]">
                {displayName(user?.email).charAt(0)}
              </div>
              <ChevronDown className="h-4 w-4 text-muted" />
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-[var(--finance-card)] px-3 py-2 text-xs font-medium text-muted hover:bg-[var(--finance-subtle)] hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </header>

        {user && !user.emailVerified && (
          <div className="mx-6 mb-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 lg:mx-8">
            Please verify your email — check your inbox for a link from Firebase.
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-6 pb-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
