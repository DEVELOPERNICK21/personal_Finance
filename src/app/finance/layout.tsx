"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/features/personal-finance/presentation/providers/AuthProvider";
import { VaultProvider } from "@/features/personal-finance/presentation/providers/VaultProvider";

/** Keeps auth + vault state alive while navigating between /finance/* routes. */
export default function FinanceRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <VaultProvider>{children}</VaultProvider>
    </AuthProvider>
  );
}
