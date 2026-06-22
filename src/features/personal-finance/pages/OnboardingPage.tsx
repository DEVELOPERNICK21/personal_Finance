"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { FinanceData } from "../core/domain/types";
import { deriveOnboardingLevel } from "../core/domain/levels";
import { markOnboardingComplete, saveGuestProfile } from "../lib/guest-profile";
import { formatCurrency } from "../lib/format";
import {
  CurrencyInput,
  OnboardingStepper,
  VaultButton,
  VaultSecurityBadge,
} from "../components/vault/OnboardingUI";

interface OnboardingPageProps {
  onComplete: (data: Partial<FinanceData>, displayName?: string) => void;
}

function parseAmount(value: string): number {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [investments, setInvestments] = useState("");

  const incomeNum = parseAmount(income);
  const expensesNum = parseAmount(expenses);
  const savingsNum = parseAmount(savings);
  const investmentsNum = parseAmount(investments);
  const monthlySave = incomeNum - expensesNum;
  const runwayMonths = expensesNum > 0 ? savingsNum / expensesNum : 0;
  const level = deriveOnboardingLevel();
  const canProceedStep1 = incomeNum > 0 && expensesNum > 0;

  const finish = (includeSavings: boolean) => {
    const data: Partial<FinanceData> = {
      monthly: {
        income: incomeNum,
        fixedExpenses: 0,
        variableExpenses: expensesNum,
        investments: 0,
        momSupport: 0,
        rentUtilities: 0,
        lifestyleCap: 0,
        emergencyTopUp: 0,
        sipCapacity: 0,
      },
      assets: {
        emergencyCash: includeSavings ? savingsNum : 0,
        vaultLocation: "",
        providentFund: 0,
        uanNumber: "",
      },
      accounts: [],
    };

    if (includeSavings && savingsNum > 0) {
      data.accounts = [
        {
          id: crypto.randomUUID(),
          type: "bank",
          name: "Savings",
          institution: "",
          accountNumber: "",
          currentValue: savingsNum,
          nominee: "",
        },
      ];
    }

    if (includeSavings && investmentsNum > 0) {
      data.accounts = [
        ...(data.accounts ?? []),
        {
          id: crypto.randomUUID(),
          type: "mutual_fund",
          name: "Investments",
          institution: "",
          accountNumber: "",
          currentValue: investmentsNum,
          nominee: "",
        },
      ];
    }

    saveGuestProfile({ level, onboardingComplete: true });
    markOnboardingComplete();
    onComplete(data);
  };

  return (
    <main className="finance-app relative mx-auto flex min-h-screen max-w-[var(--vault-max-width)] flex-col bg-[var(--vault-background)] px-[var(--vault-margin)] text-[var(--vault-on-surface)] lg:max-w-3xl lg:px-12">
      {/* Desktop split layout */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-[var(--vault-surface-container-low)] lg:px-16">
        <h2 className="vault-display-lg text-[var(--vault-primary)]">Vault Finance</h2>
        <p className="mt-4 max-w-md vault-body-md text-[var(--vault-on-surface-variant)]">
          Three numbers. One clear picture. Your data stays encrypted — we never see your
          finances.
        </p>
        <OnboardingStepper step={step} />
      </div>

      <div className="lg:ml-[50%] lg:w-1/2 lg:py-12">
        <div className="lg:hidden">
          <OnboardingStepper step={step} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex min-h-[calc(100vh-8rem)] flex-col"
            >
              <header className="mb-12">
                <h1 className="vault-display-lg tracking-tight">Let&apos;s start simple</h1>
                <p className="mt-2 vault-body-md text-[var(--vault-on-surface-variant)]">
                  Tell us your typical monthly flow to build your first vault insight.
                </p>
              </header>

              <section className="flex-grow space-y-6">
                <CurrencyInput
                  id="income"
                  label="Monthly take-home income (INR/₹)"
                  value={income}
                  onChange={setIncome}
                  secure
                />
                <CurrencyInput
                  id="expenses"
                  label="Monthly usual expenses (INR/₹)"
                  value={expenses}
                  onChange={setExpenses}
                  hint="Includes rent, bills, and groceries."
                />
                <div className="mt-8 rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-low)] p-4 opacity-60">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-4 w-24 rounded-full bg-[var(--vault-outline-variant)]/30" />
                    <div className="h-6 w-16 rounded-full bg-[var(--vault-primary)]/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-[var(--vault-outline-variant)]/20" />
                    <div className="h-2 w-2/3 rounded-full bg-[var(--vault-outline-variant)]/20" />
                  </div>
                </div>
              </section>

              <footer className="space-y-6 py-8">
                <VaultButton disabled={!canProceedStep1} onClick={() => setStep(2)}>
                  Show my picture
                  <ArrowRight className="h-5 w-5" />
                </VaultButton>
                <VaultSecurityBadge />
              </footer>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex min-h-[calc(100vh-8rem)] flex-col"
            >
              <header className="mb-8">
                <h1 className="vault-display-lg tracking-tight">Here&apos;s where you stand</h1>
                <p className="mt-2 vault-body-md text-[var(--vault-on-surface-variant)]">
                  Computed instantly — no judgment, just clarity.
                </p>
              </header>

              <div className="space-y-3">
                <InsightCard label="You save each month" value={formatCurrency(Math.max(0, monthlySave))} accent />
                <InsightCard
                  label="Runway if income stops"
                  value={
                    savingsNum > 0 && expensesNum > 0
                      ? `${runwayMonths.toFixed(1)} months`
                      : "Add savings to see"
                  }
                  accent
                />
                <InsightCard label="You are at" value={`Level ${level}`} />
              </div>

              <div className="mt-6 rounded-xl border border-[var(--vault-secondary)] bg-[var(--vault-secondary-fixed)] p-4">
                <p className="vault-body-sm text-[var(--vault-on-secondary-fixed-variant)]">
                  Want to go deeper?{" "}
                  <span className="opacity-70">Add your savings — optional.</span>
                </p>
              </div>

              <footer className="mt-auto space-y-3 py-8">
                <VaultButton onClick={() => setStep(3)}>
                  Add savings
                  <ArrowRight className="h-5 w-5" />
                </VaultButton>
                <VaultButton variant="ghost" onClick={() => finish(false)}>
                  Skip for now →
                </VaultButton>
              </footer>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex min-h-[calc(100vh-8rem)] flex-col"
            >
              <header className="mb-8">
                <h1 className="vault-display-lg tracking-tight">Your savings picture</h1>
                <p className="mt-2 vault-body-md text-[var(--vault-on-surface-variant)]">
                  Approximate is fine — refine anytime.
                </p>
              </header>

              <section className="space-y-6">
                <div>
                  <CurrencyInput
                    id="savings"
                    label="Current total savings"
                    value={savings}
                    onChange={setSavings}
                    placeholder="240000"
                  />
                  <button
                    type="button"
                    onClick={() => finish(true)}
                    className="mt-1.5 vault-label-sm text-[var(--vault-on-surface-variant)] hover:text-[var(--vault-on-surface)]"
                  >
                    Skip for now →
                  </button>
                </div>
                <div>
                  <CurrencyInput
                    id="investments"
                    label="Any investments? (rough total)"
                    value={investments}
                    onChange={setInvestments}
                    placeholder="Optional"
                  />
                  <button
                    type="button"
                    onClick={() => setInvestments("")}
                    className="mt-1.5 vault-label-sm text-[var(--vault-on-surface-variant)] hover:text-[var(--vault-on-surface)]"
                  >
                    Skip for now →
                  </button>
                </div>
              </section>

              <footer className="py-8">
                <VaultButton onClick={() => finish(true)}>
                  Done, take me to my dashboard
                  <ArrowRight className="h-5 w-5" />
                </VaultButton>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] rounded-full bg-[var(--vault-primary)]/5 blur-[100px]" />
        <div className="absolute -bottom-[5%] -left-[5%] h-[300px] w-[300px] rounded-full bg-[var(--vault-tertiary)]/5 blur-[80px]" />
      </div>
    </main>
  );
}

function InsightCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="vault-card p-4">
      <p className="vault-label-md text-[var(--vault-on-surface-variant)]">{label}</p>
      <p
        className={`mt-1 vault-headline-md ${accent ? "text-[var(--vault-primary)]" : "text-[var(--vault-on-surface)]"}`}
      >
        {value}
      </p>
    </div>
  );
}
