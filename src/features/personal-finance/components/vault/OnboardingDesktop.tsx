"use client";

import {
  ArrowRight,
  Calculator,
  Lock,
  Shield,
  ShieldCheck,
  Timer,
  TrendingUp,
  Wallet,
  Award,
} from "lucide-react";
import { formatCurrency } from "../../lib/format";

export function OnboardingDesktopHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-black/5 bg-[#f8f9fa]/95 px-8 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#00694c]" strokeWidth={2} />
        <h1 className="vault-headline-sm font-medium tracking-tight text-[#00694c]">Vault Finance</h1>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-[#bccac1]/30 bg-[#f3f4f5] px-3 py-1.5 shadow-[0_0_12px_rgba(0,105,76,0.1)]">
        <Lock className="h-4 w-4 text-[#00694c]" strokeWidth={2} fill="#00694c" />
        <span className="vault-label-md uppercase tracking-wider text-[#3d4943]">
          Secure vault active
        </span>
      </div>
    </header>
  );
}

export function DesktopCardStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center gap-4">
          {i > 0 && (
            <div className="h-px w-8 bg-[#e1e3e4]" />
          )}
          {n === step ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5951b4] vault-label-md font-medium text-white">
              {n}
            </div>
          ) : n < step ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00694c] text-xs text-white">
              ✓
            </div>
          ) : (
            <div className="h-2 w-2 rounded-full bg-[#e1e3e4]" />
          )}
        </div>
      ))}
    </div>
  );
}

interface DesktopFloatingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}

export function DesktopFloatingInput({
  id,
  label,
  value,
  onChange,
  hint,
}: DesktopFloatingInputProps) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="absolute -top-3 left-4 z-10 bg-white px-2 vault-label-md text-[#6d7a73] transition-colors group-focus-within:text-[#00694c]"
      >
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-[#bccac1] p-4 transition-all focus-within:border-[#00694c] focus-within:shadow-[0_0_0_1px_#00694c]">
        <span className="mr-3 vault-headline-sm text-[#bccac1]">₹</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="0.00"
          className="w-full border-none bg-transparent p-0 vault-headline-md text-[#191c1d] placeholder:text-[#e1e3e4] focus:outline-none focus:ring-0"
        />
      </div>
      {hint && (
        <p className="ml-4 mt-2 vault-label-md italic text-[#6d7a73]">{hint}</p>
      )}
    </div>
  );
}

interface DesktopStep1Props {
  income: string;
  expenses: string;
  setIncome: (v: string) => void;
  setExpenses: (v: string) => void;
  canProceed: boolean;
  onNext: () => void;
}

export function DesktopOnboardingStep1({
  income,
  expenses,
  setIncome,
  setExpenses,
  canProceed,
  onNext,
}: DesktopStep1Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-32">
      <div className="flex w-full max-w-[480px] flex-col items-center rounded-xl border border-black/5 bg-white p-10">
        <DesktopCardStepper step={1} />

        <div className="mb-10 text-center">
          <h2 className="vault-display-lg mb-2 text-[#191c1d]">Let&apos;s start simple</h2>
          <p className="vault-body-md text-[#3d4943]">
            Build your financial runway. Only you can see this data.
          </p>
        </div>

        <div className="mb-10 flex items-center gap-2 rounded-full border border-[#bccac1]/20 bg-[#f3f4f5] px-4 py-2">
          <ShieldCheck className="h-4 w-4 text-[#008560]" strokeWidth={2} />
          <span className="vault-label-md text-[#008560]">Private to your vault</span>
        </div>

        <div className="mb-12 w-full space-y-8">
          <DesktopFloatingInput
            id="desktop-income"
            label="Monthly take-home income"
            value={income}
            onChange={setIncome}
            hint="After taxes and deductions"
          />
          <DesktopFloatingInput
            id="desktop-expenses"
            label="Monthly usual expenses"
            value={expenses}
            onChange={setExpenses}
            hint="Rent, food, EMI, and lifestyle"
          />
        </div>

        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#008560] py-4 vault-body-lg font-medium text-[#f5fff7] shadow-sm transition-all hover:bg-[#00694c] active:scale-[0.98] disabled:opacity-40"
        >
          Show my picture
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        <p className="mt-6 text-center vault-label-md text-[#3d4943] opacity-60">
          You can change these values at any time in your Settings.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-8 opacity-40 grayscale transition-all duration-700 hover:grayscale-0">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#6d7a73]" />
          <span className="vault-label-md uppercase tracking-widest text-[#6d7a73]">
            End-to-end encryption
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#6d7a73]" />
          <span className="vault-label-md uppercase tracking-widest text-[#6d7a73]">
            Bank-grade security
          </span>
        </div>
      </div>
    </main>
  );
}

interface DesktopStep2Props {
  monthlySave: number;
  runwayMonths: number;
  savingsNum: number;
  expensesNum: number;
  level: number;
  onNext: () => void;
  onSkip: () => void;
}

export function DesktopOnboardingStep2({
  monthlySave,
  runwayMonths,
  savingsNum,
  expensesNum,
  level,
  onNext,
  onSkip,
}: DesktopStep2Props) {
  const runwayDisplay =
    savingsNum > 0 && expensesNum > 0 ? `${runwayMonths.toFixed(1)} Months` : "—";
  const runwayPercent =
    expensesNum > 0 && savingsNum > 0
      ? Math.min(100, (runwayMonths / 6) * 100)
      : monthlySave > 0
        ? 15
        : 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center px-8 pb-12 pt-24">
      <div className="mb-12 w-full max-w-4xl text-center">
        <span className="mb-4 inline-block vault-label-md uppercase tracking-widest text-[#00694c]">
          Step 2: Analysis
        </span>
        <h1 className="vault-display-lg mb-3 text-[#191c1d]">Here&apos;s where you stand</h1>
        <p className="mx-auto max-w-2xl vault-body-lg text-[#3d4943]">
          We&apos;ve analyzed your numbers. Your financial foundation is starting to take shape in
          the vault.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-xl border border-[#bccac1]/40 bg-white p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="vault-label-md uppercase tracking-wide text-[#3d4943]">
                  Current status
                </span>
                <h2 className="mt-1 vault-headline-md text-[#191c1d]">
                  Level {level}: Initializing
                </h2>
              </div>
              <div className="rounded-lg bg-[#5951b4]/10 p-3">
                <Award className="h-6 w-6 text-[#5951b4]" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#5951b4]">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#5951b4]" />
                  </div>
                  <div className="h-12 border-l border-dashed border-[#bccac1]/50" />
                </div>
                <div>
                  <span className="vault-label-md font-medium text-[#5951b4]">In progress</span>
                  <p className="mt-1 vault-body-md text-[#191c1d]">Establishing runway base</p>
                </div>
              </div>
              <div className="flex items-start gap-4 opacity-50">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#bccac1]" />
                <div>
                  <span className="vault-label-md font-medium text-[#3d4943]">Level 1</span>
                  <p className="mt-1 vault-body-md text-[#191c1d]">Optimize monthly surplus</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[#00694c]/5 blur-3xl" />
          </div>

          <div className="rounded-xl border border-[#bccac1]/40 bg-white p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-[#00694c]" />
                <span className="vault-label-md uppercase tracking-wide text-[#3d4943]">
                  Financial runway
                </span>
              </div>
              <span className="vault-headline-sm font-medium text-[#00694c]">{runwayDisplay}</span>
            </div>
            <div className="space-y-4">
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#edeeef]">
                <div
                  className="h-full bg-[#00694c] transition-all duration-1000"
                  style={{ width: `${runwayPercent}%` }}
                />
              </div>
              <div className="flex justify-between vault-label-md text-[#3d4943]">
                <span>0 months</span>
                <span>3 months</span>
                <span>6 months+</span>
              </div>
            </div>
            {expensesNum > 0 && (
              <div className="mt-8 rounded-lg border border-[#00694c]/10 bg-[#00694c]/5 p-4">
                <p className="vault-body-sm leading-relaxed text-[#00513a]">
                  <strong className="text-[#00694c]">Insight:</strong>{" "}
                  {savingsNum > 0
                    ? `Based on your spending, you can survive ${runwayMonths.toFixed(1)} months without new income. Let's aim for the 6-month safety net.`
                    : "Add your savings to see how long you could survive if income stopped today."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-xl border border-[#bccac1]/40 bg-white p-8">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <Wallet className="h-5 w-5 text-[#00694c]" />
                <span className="vault-label-md uppercase tracking-wide text-[#3d4943]">
                  Monthly surplus
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="vault-display-lg font-medium text-[#191c1d]">
                  {formatCurrency(Math.max(0, monthlySave))}
                </span>
                <span className="vault-body-md font-medium text-[#00694c]">/ month</span>
              </div>
              <p className="mt-4 vault-body-md text-[#3d4943]">
                This is your financial breathability — money left after committed expenses.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex h-40 items-end gap-2">
              {[40, 60, 30, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className={`relative flex-1 rounded-t ${i === 4 ? "bg-[#00694c]" : "bg-[#00694c]/20"}`}
                  style={{ height: `${h}%` }}
                >
                  {i === 4 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#002115] px-2 py-0.5 vault-label-sm text-white">
                      Current
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex w-full max-w-xl flex-col items-center gap-6">
        <button
          type="button"
          onClick={onNext}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#00694c] py-4 vault-headline-sm font-medium text-white shadow-lg shadow-[#00694c]/20 transition-all hover:-translate-y-0.5 hover:bg-[#008560] active:scale-95"
        >
          Add details to reach Level 1
          <ArrowRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="vault-label-md text-[#3d4943] underline decoration-[#bccac1]/40 underline-offset-4 hover:text-[#00694c]"
        >
          Skip for now, I&apos;ll explore first
        </button>
        <div className="mt-2 flex items-center gap-2 text-[#6d7a73]/60">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="vault-label-sm uppercase tracking-tight">
            Your data is encrypted with AES-256 at rest
          </span>
        </div>
      </div>
    </main>
  );
}

interface DesktopStep3Props {
  savings: string;
  investments: string;
  setSavings: (v: string) => void;
  setInvestments: (v: string) => void;
  expensesNum: number;
  onFinish: () => void;
  onSkipSavings: () => void;
}

export function DesktopOnboardingStep3({
  savings,
  investments,
  setSavings,
  setInvestments,
  expensesNum,
  onFinish,
  onSkipSavings,
}: DesktopStep3Props) {
  const hasData = savings.length > 0 || investments.length > 0;
  const savingsNum = Number(savings) || 0;
  const runwayPreview = expensesNum > 0 ? savingsNum / expensesNum : 0;

  return (
    <main className="mx-auto mt-24 flex w-full max-w-[900px] flex-col items-start justify-center gap-8 px-6 pb-20 md:flex-row">
      <section className="w-full flex-1 rounded-xl border border-black/5 bg-white p-8 shadow-sm">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#5951b4]" />
              <div className="h-2 w-2 rounded-full bg-[#5951b4]" />
              <div className="h-6 w-2 animate-pulse rounded-full bg-[#5951b4]" />
            </div>
            <span className="vault-label-md uppercase tracking-widest text-[#5951b4]">
              Step 3 of 3
            </span>
          </div>
          <h1 className="vault-display-lg mb-2 text-[#191c1d]">Almost there</h1>
          <p className="vault-body-md text-[#3d4943]">
            Complete your vault to unlock your financial runway insights.
          </p>
        </header>

        <div className="space-y-6">
          <DesktopSimpleInput
            id="desktop-savings"
            label="Current total savings"
            value={savings}
            onChange={setSavings}
          />
          <DesktopSimpleInput
            id="desktop-investments"
            label="Any investments"
            value={investments}
            onChange={setInvestments}
            placeholder="Stocks, mutual funds, gold..."
          />
          <div className="pt-4">
            <button
              type="button"
              onClick={onFinish}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#008560] py-4 vault-headline-sm font-medium text-[#f5fff7] transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Done, take me to my dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={onSkipSavings}
              className="mt-4 w-full text-center vault-label-md text-[#6d7a73] hover:text-[#00694c]"
            >
              Skip for now →
            </button>
            <p className="mt-4 text-center vault-label-md text-[#6d7a73]">
              <Lock className="mr-1 inline h-3.5 w-3.5" fill="currentColor" />
              Your data is encrypted end-to-end and never leaves your vault.
            </p>
          </div>
        </div>
      </section>

      <aside className="w-full space-y-6 md:w-80">
        <div className="rounded-xl border border-black/5 bg-[#e7e8e9]/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#3c6700]/10 text-[#3c6700]">
            <Calculator className="h-5 w-5" />
          </div>
          <h3 className="vault-headline-sm mb-2 text-[#191c1d]">Why share this?</h3>
          <p className="vault-body-sm leading-relaxed text-[#3d4943]">
            By understanding your total liquidity, Vault can calculate your{" "}
            <strong className="text-[#00694c]">freedom months</strong> — how long you can sustain
            your lifestyle without new income.
          </p>
          <div className="mt-6 rounded-lg border border-[#bccac1]/30 bg-[#f8f9fa] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="vault-label-md uppercase text-[#3d4943]">Projected runway</span>
              <span className="vault-label-md font-medium text-[#00694c]">Live</span>
            </div>
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#e1e3e4]">
              <div
                className={`h-full bg-[#00694c] transition-all ${hasData ? "w-1/3" : "w-1/4"}`}
              />
              <div
                className={`h-full transition-all ${hasData ? "w-1/4 bg-[#00694c]" : "w-1/4 animate-pulse bg-[#00694c]/40"}`}
              />
            </div>
            <p className="mt-2 vault-label-sm italic text-[#6d7a73]">
              {hasData && expensesNum > 0
                ? `~${runwayPreview.toFixed(1)} months based on savings`
                : "Calculating based on entries..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-[#bccac1] bg-white/40 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00694c]/5">
            <Shield className="h-6 w-6 text-[#00694c]" />
          </div>
          <div>
            <h4 className="vault-label-md font-medium uppercase tracking-tight text-[#191c1d]">
              Vault protocol
            </h4>
            <p className="vault-body-sm text-[#3d4943]">Zero-knowledge encryption.</p>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-gradient-to-br from-[#00694c]/10 via-[#5951b4]/10 to-[#f8f9fa]">
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="h-16 w-16 text-[#00694c]/30" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f8f9fa]/90 to-transparent p-4">
            <p className="vault-label-sm text-[#3d4943]">Your secure financial vault</p>
          </div>
        </div>
      </aside>
    </main>
  );
}

function DesktopSimpleInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0.00",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="mb-2 block vault-label-md text-[#3d4943] transition-colors group-focus-within:text-[#00694c]"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 vault-body-lg text-[#3d4943]">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[#bccac1] bg-[#f8f9fa] py-3 pl-10 pr-4 vault-body-lg text-[#191c1d] outline-none transition-all focus:border-[#00694c] focus:ring-1 focus:ring-[#00694c]"
        />
      </div>
    </div>
  );
}

export function OnboardingDesktopBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f8f9fa]">
      <div className="absolute -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-[#68dbae]/10 blur-[120px]" />
      <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-[#c5c0ff]/10 blur-[120px]" />
    </div>
  );
}
