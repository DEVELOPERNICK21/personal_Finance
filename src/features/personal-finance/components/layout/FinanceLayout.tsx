"use client";

import type { ReactNode } from "react";
import { FinanceNav } from "./FinanceNav";

interface FinanceLayoutProps {
  children: ReactNode;
}

export function FinanceLayout({ children }: FinanceLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Personal Finance
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your complete financial picture in under 2 minutes
          </p>
        </header>
        <FinanceNav />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
