"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "../../presentation/components/ThemeToggle";
import { FinanceNav } from "./FinanceNav";
import { useAuth } from "../../presentation/providers/AuthProvider";
import { Button } from "../ui/Button";

interface FinanceLayoutProps {
  children: ReactNode;
}

export function FinanceLayout({ children }: FinanceLayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Personal Finance</h1>
              <p className="mt-1 text-sm text-muted">
                Your complete financial picture in under 2 minutes
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {user?.email && (
                <span className="text-xs text-muted">{user.email}</span>
              )}
              <ThemeToggle />
              <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
          {user && !user.emailVerified && (
            <p className="mt-3 rounded-lg border border-accent-warning/30 bg-accent-warning/10 px-3 py-2 text-xs text-accent-warning">
              Please verify your email address. Check your inbox for a verification link from Firebase.
            </p>
          )}
        </header>
        <FinanceNav />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
