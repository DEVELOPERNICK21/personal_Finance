"use client";

import { Award, ArrowRight, Timer, TrendingUp, Wallet } from "lucide-react";
import { formatCurrency } from "../../lib/format";
import { VaultButton } from "./OnboardingUI";

interface OnboardingMobileStep2Props {
  monthlySave: number;
  incomeNum: number;
  runwayMonths: number;
  savingsNum: number;
  expensesNum: number;
  level: number;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingMobileStep2({
  monthlySave,
  incomeNum,
  runwayMonths,
  savingsNum,
  expensesNum,
  level,
  onNext,
  onSkip,
}: OnboardingMobileStep2Props) {
  const hasSavings = savingsNum > 0 && expensesNum > 0;
  const runwayDisplay = hasSavings ? `${runwayMonths.toFixed(1)} months` : "—";
  const runwayPercent = hasSavings
    ? Math.min(100, (runwayMonths / 6) * 100)
    : monthlySave > 0
      ? 12
      : 0;
  const saveRate = incomeNum > 0 ? Math.round((Math.max(0, monthlySave) / incomeNum) * 100) : 0;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <header className="mb-6">
        <span className="mb-2 inline-block rounded-full border border-[var(--vault-outline-variant)] px-2 py-0.5 vault-label-sm uppercase tracking-wider text-[var(--vault-on-surface-variant)]">
          Step 2 of 3
        </span>
        <h1 className="vault-display-lg tracking-tight">Here&apos;s where you stand</h1>
        <p className="mt-2 vault-body-md text-[var(--vault-on-surface-variant)]">
          We&apos;ve analyzed your numbers. Your foundation is starting to take shape.
        </p>
      </header>

      <div className="flex-grow space-y-3">
        {/* Monthly surplus */}
        <div className="vault-card relative overflow-hidden p-5">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="vault-label-md mb-1 text-[var(--vault-on-surface-variant)]">
                Monthly surplus
              </p>
              <p className="vault-headline-md text-[var(--vault-primary)]">
                {formatCurrency(Math.max(0, monthlySave))}
                <span className="vault-body-md text-[var(--vault-on-surface-variant)]"> / month</span>
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--vault-primary-container)] text-[var(--vault-on-primary-container)]">
              <Wallet className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
          {monthlySave > 0 && incomeNum > 0 && (
            <div className="relative z-10 mt-4 flex items-center gap-2 border-t border-[var(--vault-outline-variant)] pt-4">
              <TrendingUp className="h-4 w-4 text-[var(--vault-tertiary)]" />
              <p className="vault-body-sm text-[var(--vault-on-surface-variant)]">
                {saveRate}% of income left after expenses — your financial breathability.
              </p>
            </div>
          )}
          <div className="relative z-10 mt-4 flex h-20 items-end gap-1.5">
            {[35, 55, 28, 65, 85].map((h, i) => (
              <div
                key={i}
                className={`relative flex-1 rounded-t ${
                  i === 4 ? "bg-[var(--vault-primary)]" : "bg-[var(--vault-primary)]/20"
                }`}
                style={{ height: `${h}%` }}
              >
                {i === 4 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--vault-on-primary-fixed)] px-1.5 py-0.5 vault-label-sm text-[var(--vault-on-primary-container)]">
                    Now
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financial runway */}
        <div className="vault-card p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-[var(--vault-primary)]" />
              <p className="vault-label-md uppercase tracking-wide text-[var(--vault-on-surface-variant)]">
                Financial runway
              </p>
            </div>
            <span className="vault-headline-sm text-[var(--vault-primary)]">{runwayDisplay}</span>
          </div>
          <div className="relative mb-3 h-3 w-full overflow-hidden rounded-full bg-[var(--vault-surface-container)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[var(--vault-primary)] transition-all duration-700"
              style={{ width: `${runwayPercent}%` }}
            />
          </div>
          <div className="mb-4 flex justify-between vault-label-sm text-[var(--vault-outline)]">
            <span>0m</span>
            <span>3m</span>
            <span>6m+</span>
          </div>
          {hasSavings ? (
            <p className="vault-body-sm text-[var(--vault-on-surface)]">
              You can survive{" "}
              <strong className="text-[var(--vault-primary)]">{runwayMonths.toFixed(1)} months</strong>{" "}
              without new income. Target: 6 months.
            </p>
          ) : (
            <div className="rounded-lg border border-[var(--vault-primary)]/15 bg-[var(--vault-primary)]/5 p-3">
              <p className="vault-body-sm leading-relaxed text-[var(--vault-on-primary-fixed-variant)]">
                <strong className="text-[var(--vault-primary)]">Insight:</strong> Add your savings to
                see how long you could survive if income stopped today.
              </p>
            </div>
          )}
        </div>

        {/* Level status */}
        <div className="vault-card border-[var(--vault-secondary-container)]/40 p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="vault-label-md uppercase tracking-wide text-[var(--vault-on-surface-variant)]">
                Current status
              </p>
              <h2 className="mt-1 vault-headline-sm text-[var(--vault-on-surface)]">
                Level {level}: Initializing
              </h2>
            </div>
            <div className="rounded-lg bg-[var(--vault-secondary)]/10 p-2.5">
              <Award className="h-5 w-5 text-[var(--vault-secondary)]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex flex-col items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--vault-secondary)]">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--vault-secondary)]" />
                </div>
                <div className="h-8 border-l border-dashed border-[var(--vault-outline-variant)]" />
              </div>
              <div>
                <span className="vault-label-md font-medium text-[var(--vault-secondary)]">
                  In progress
                </span>
                <p className="vault-body-sm text-[var(--vault-on-surface)]">Establishing runway base</p>
              </div>
            </div>
            <div className="flex items-start gap-3 opacity-50">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--vault-outline-variant)]" />
              <div>
                <span className="vault-label-md font-medium text-[var(--vault-on-surface-variant)]">
                  Level 1
                </span>
                <p className="vault-body-sm text-[var(--vault-on-surface)]">Optimize monthly surplus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nudge */}
        <div className="rounded-2xl bg-[var(--vault-surface-container-high)] p-5 text-center">
          <p className="vault-body-md font-medium text-[var(--vault-on-surface)]">
            Want to go deeper?
          </p>
          <p className="mt-1 vault-body-sm text-[var(--vault-on-surface-variant)]">
            Add your savings to unlock runway insights and reach Level 1.
          </p>
        </div>
      </div>

      <footer className="space-y-3 py-8">
        <VaultButton onClick={onNext}>
          Add details to reach Level 1
          <ArrowRight className="h-5 w-5" />
        </VaultButton>
        <VaultButton variant="ghost" onClick={onSkip}>
          Skip for now, I&apos;ll explore first
        </VaultButton>
      </footer>
    </div>
  );
}
