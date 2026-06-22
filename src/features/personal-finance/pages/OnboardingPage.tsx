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
import {
  DesktopOnboardingStep1,
  DesktopOnboardingStep2,
  DesktopOnboardingStep3,
  OnboardingDesktopBackground,
  OnboardingDesktopHeader,
} from "../components/vault/OnboardingDesktop";

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
    <>
      {/* ——— Mobile (unchanged) ——— */}
      <main className="finance-app relative mx-auto flex min-h-screen max-w-[var(--vault-max-width)] flex-col bg-[var(--vault-background)] px-[var(--vault-margin)] text-[var(--vault-on-surface)] lg:hidden">
        <OnboardingStepper step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <MobileStep1
              income={income}
              expenses={expenses}
              setIncome={setIncome}
              setExpenses={setExpenses}
              canProceed={canProceedStep1}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <MobileStep2
              monthlySave={monthlySave}
              runwayMonths={runwayMonths}
              savingsNum={savingsNum}
              expensesNum={expensesNum}
              level={level}
              onNext={() => setStep(3)}
              onSkip={() => finish(false)}
            />
          )}
          {step === 3 && (
            <MobileStep3
              savings={savings}
              investments={investments}
              setSavings={setSavings}
              setInvestments={setInvestments}
              onFinish={() => finish(true)}
              onSkip={() => finish(true)}
            />
          )}
        </AnimatePresence>

        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] rounded-full bg-[var(--vault-primary)]/5 blur-[100px]" />
          <div className="absolute -bottom-[5%] -left-[5%] h-[300px] w-[300px] rounded-full bg-[var(--vault-tertiary)]/5 blur-[80px]" />
        </div>
      </main>

      {/* ——— Desktop (Stitch layouts) ——— */}
      <div className="onboarding-desktop relative hidden min-h-screen text-[#191c1d] lg:block">
        <OnboardingDesktopBackground />
        <OnboardingDesktopHeader />
        {step === 1 && (
          <DesktopOnboardingStep1
            income={income}
            expenses={expenses}
            setIncome={setIncome}
            setExpenses={setExpenses}
            canProceed={canProceedStep1}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <DesktopOnboardingStep2
            monthlySave={monthlySave}
            runwayMonths={runwayMonths}
            savingsNum={savingsNum}
            expensesNum={expensesNum}
            level={level}
            onNext={() => setStep(3)}
            onSkip={() => finish(false)}
          />
        )}
        {step === 3 && (
          <DesktopOnboardingStep3
            savings={savings}
            investments={investments}
            setSavings={setSavings}
            setInvestments={setInvestments}
            expensesNum={expensesNum}
            onFinish={() => finish(true)}
            onSkipSavings={() => finish(false)}
          />
        )}
      </div>
    </>
  );
}

function MobileStep1({
  income,
  expenses,
  setIncome,
  setExpenses,
  canProceed,
  onNext,
}: {
  income: string;
  expenses: string;
  setIncome: (v: string) => void;
  setExpenses: (v: string) => void;
  canProceed: boolean;
  onNext: () => void;
}) {
  return (
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
      </section>
      <footer className="space-y-6 py-8">
        <VaultButton disabled={!canProceed} onClick={onNext}>
          Show my picture
          <ArrowRight className="h-5 w-5" />
        </VaultButton>
        <VaultSecurityBadge />
      </footer>
    </motion.div>
  );
}

function MobileStep2({
  monthlySave,
  runwayMonths,
  savingsNum,
  expensesNum,
  level,
  onNext,
  onSkip,
}: {
  monthlySave: number;
  runwayMonths: number;
  savingsNum: number;
  expensesNum: number;
  level: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
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
          Want to go deeper? <span className="opacity-70">Add your savings — optional.</span>
        </p>
      </div>
      <footer className="mt-auto space-y-3 py-8">
        <VaultButton onClick={onNext}>
          Add savings
          <ArrowRight className="h-5 w-5" />
        </VaultButton>
        <VaultButton variant="ghost" onClick={onSkip}>
          Skip for now →
        </VaultButton>
      </footer>
    </motion.div>
  );
}

function MobileStep3({
  savings,
  investments,
  setSavings,
  setInvestments,
  onFinish,
  onSkip,
}: {
  savings: string;
  investments: string;
  setSavings: (v: string) => void;
  setInvestments: (v: string) => void;
  onFinish: () => void;
  onSkip: () => void;
}) {
  return (
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
        <CurrencyInput
          id="savings"
          label="Current total savings"
          value={savings}
          onChange={setSavings}
          placeholder="240000"
        />
        <CurrencyInput
          id="investments"
          label="Any investments? (rough total)"
          value={investments}
          onChange={setInvestments}
          placeholder="Optional"
        />
      </section>
      <footer className="space-y-3 py-8">
        <VaultButton onClick={onFinish}>
          Done, take me to my dashboard
          <ArrowRight className="h-5 w-5" />
        </VaultButton>
        <VaultButton variant="ghost" onClick={onSkip}>
          Skip for now →
        </VaultButton>
      </footer>
    </motion.div>
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
