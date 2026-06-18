"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  HandCoins,
  Landmark,
  Shield,
  Target,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { DashCard } from "../components/ui/DashCard";
import { StatCard } from "../components/ui/StatCard";
import { SimpleProgress } from "../components/ui/ProgressBar";
import { useFinance } from "../presentation/providers/FinanceProvider";
import { financeHref } from "../routes";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatShortDate,
} from "../lib/format";

const QUICK_LINKS = [
  { slug: "accounts" as const, label: "Accounts", desc: "Banks & balances", icon: Landmark },
  { slug: "monthly" as const, label: "Monthly Money", desc: "Income & spending", icon: Wallet },
  { slug: "investments" as const, label: "Investments", desc: "Portfolio value", icon: TrendingUp },
  { slug: "goals" as const, label: "Goals", desc: "Savings targets", icon: Target },
  { slug: "insurance" as const, label: "Insurance", desc: "Policies & renewals", icon: Shield },
  { slug: "emergency" as const, label: "Emergency", desc: "SOS & contacts", icon: AlertTriangle },
];

const CHECKLIST_ITEMS = [
  { key: "verifyBankLogs", label: "Verify bank balances" },
  { key: "confirmSipClearance", label: "Confirm SIP cleared" },
  { key: "verifyBurnUnder30k", label: "Monthly burn under cap" },
  { key: "auditPolicyDates", label: "Check policy renewals" },
];

export function DashboardPage() {
  const { data, metrics, config, updateData, commitReview, toggleSosMode } = useFinance();
  const base = config.basePath;

  if (data.sosMode) {
    return (
      <div className="mx-auto max-w-2xl">
        <DashCard title="SOS Emergency View" subtitle="Critical info for your family">
          <dl className="space-y-4 text-sm">
            {[
              ["Salary account", data.instructions.salaryAccount],
              ["Investments", data.instructions.investmentLocations],
              ["Insurance claims", data.instructions.insuranceClaimSteps],
              ["Contact first", data.instructions.firstContact],
              ["Emergency cash", formatCurrency(data.assets.emergencyCash)],
              ["Vault location", data.assets.vaultLocation],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[var(--finance-subtle)] px-4 py-3">
                <dt className="text-xs font-medium text-muted">{label}</dt>
                <dd className="mt-1 font-medium text-foreground">{value || "—"}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={toggleSosMode}
            className="mt-6 w-full rounded-2xl bg-[#171717] py-3 text-sm font-semibold text-white hover:bg-[#171717]/90"
          >
            Exit SOS view
          </button>
        </DashCard>
      </div>
    );
  }

  const monthlyLeftPositive = metrics.monthlyRemaining >= 0;
  const emergencyTrend =
    metrics.emergencyFundProgress >= 100
      ? { value: "Target reached", positive: true }
      : { value: `${Math.round(metrics.emergencyFundProgress)}% funded`, positive: metrics.emergencyFundProgress >= 50 };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Top stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Wallet}
            label="Net worth"
            value={formatCompactCurrency(metrics.netWorth)}
          />
          <StatCard
            icon={HandCoins}
            label="Owed to you"
            value={formatCompactCurrency(metrics.totalReceivables)}
            trend={
              metrics.totalReceivables > 0
                ? { value: "Pending repayment", positive: true }
                : undefined
            }
          />
          <StatCard
            icon={Target}
            label="Emergency fund"
            value={formatPercent(metrics.emergencyFundProgress)}
            trend={emergencyTrend}
          />
          <StatCard
            icon={Calendar}
            label="Savings rate"
            value={formatPercent(metrics.savingsRate)}
            trend={{
              value: monthlyLeftPositive ? "On track" : "Over budget",
              positive: monthlyLeftPositive,
            }}
          />
        </div>

        {/* Middle row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <DashCard title="Monthly cash flow" subtitle="Income vs what you spend & save">
            <div className="space-y-4">
              <FlowRow label="Income" amount={metrics.monthlyIncome} max={metrics.monthlyIncome} color="bg-foreground" />
              <FlowRow
                label="Expenses"
                amount={metrics.monthlyExpenses}
                max={metrics.monthlyIncome}
                color="bg-rose-400"
              />
              <FlowRow
                label="Savings & SIPs"
                amount={metrics.monthlySavings}
                max={metrics.monthlyIncome}
                color="bg-emerald-500"
              />
              <div className="mt-2 flex items-center justify-between rounded-2xl bg-[var(--finance-subtle)] px-4 py-3">
                <span className="text-sm text-muted">Left after plan</span>
                <span
                  className={`text-lg font-semibold ${
                    monthlyLeftPositive ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(metrics.monthlyRemaining)}
                </span>
              </div>
            </div>
          </DashCard>

          <DashCard title="Salary split" subtitle="Where each paycheck goes">
            <div className="space-y-5">
              <SplitBar
                label="Fixed costs"
                percent={metrics.salaryAllocation.fixed}
                color="bg-foreground"
              />
              <SplitBar
                label="Lifestyle"
                percent={metrics.salaryAllocation.wants}
                color="bg-amber-400"
              />
              <SplitBar
                label="Saved"
                percent={metrics.salaryAllocation.saved}
                color="bg-emerald-500"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <MiniStat label="Runway" value={`${metrics.survivalRunwayMonths.toFixed(1)} mo`} />
                <MiniStat label="Cash on hand" value={formatCompactCurrency(metrics.cashAvailable)} />
              </div>
            </div>
          </DashCard>
        </div>

        {/* Quick links */}
        <DashCard title="Go deeper" subtitle="Edit details on each page">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.slug}
                href={financeHref(base, link.slug)}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-[var(--finance-subtle)]/60 p-4 transition-colors hover:bg-[var(--finance-subtle)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--finance-card)]">
                  <link.icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{link.label}</p>
                  <p className="text-xs text-muted">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-muted" />
              </Link>
            ))}
          </div>
        </DashCard>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <DashCard dark title="Emergency fund" subtitle="Protection pool progress">
          <p className="text-3xl font-semibold">{formatPercent(metrics.emergencyFundProgress)}</p>
          <div className="mt-4">
            <SimpleProgress percent={metrics.emergencyFundProgress} color="bg-white" />
          </div>
          <p className="mt-3 text-sm text-white/50">
            {metrics.emergencyFundDeficit > 0
              ? `${formatCurrency(metrics.emergencyFundDeficit)} to go · ~${metrics.emergencyFundMonthsToTarget} months at current pace`
              : "You've hit your emergency target. Well done."}
          </p>
          <Link
            href={financeHref(base, "goals")}
            className="mt-5 flex w-full items-center justify-center rounded-2xl bg-white py-3 text-sm font-semibold text-[#171717] hover:bg-white/90"
          >
            View goals
          </Link>
        </DashCard>

        <DashCard title="Month-end checklist" subtitle="Quick review tasks">
          <ul className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <li key={item.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={data.monthEndChecklist[item.key] ?? false}
                  onChange={(e) =>
                    updateData((d) => ({
                      ...d,
                      monthEndChecklist: {
                        ...d.monthEndChecklist,
                        [item.key]: e.target.checked,
                      },
                    }))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-[#171717]/20"
                />
                <span className="text-sm text-foreground">{item.label}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={commitReview}
            className="mt-5 w-full rounded-2xl border border-border py-2.5 text-sm font-medium hover:bg-[var(--finance-subtle)]"
          >
            Mark review complete
          </button>
        </DashCard>

        <DashCard title="Coming up" subtitle="Dates to watch">
          <ul className="space-y-4">
            {metrics.nextInsuranceRenewal && (
              <UpcomingItem
                title={metrics.nextInsuranceRenewal.name}
                date={formatShortDate(metrics.nextInsuranceRenewal.date)}
                dot="bg-amber-400"
              />
            )}
            {metrics.nextSipDate && (
              <UpcomingItem
                title="Next SIP date"
                date={formatShortDate(metrics.nextSipDate)}
                dot="bg-emerald-500"
              />
            )}
            {metrics.nextReceivableReturn && (
              <UpcomingItem
                title={`${metrics.nextReceivableReturn.borrowerName} repayment`}
                date={`${formatShortDate(metrics.nextReceivableReturn.date)} · ${formatCurrency(metrics.nextReceivableReturn.amount)}`}
                dot="bg-sky-500"
              />
            )}
            {!metrics.nextInsuranceRenewal &&
              !metrics.nextSipDate &&
              !metrics.nextReceivableReturn && (
              <p className="text-sm text-muted">No upcoming dates — add loans or insurance to track.</p>
            )}
          </ul>
        </DashCard>

        <button
          type="button"
          onClick={toggleSosMode}
          className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-left text-sm font-medium text-rose-800 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60"
        >
          Open SOS emergency view
        </button>
      </aside>
    </div>
  );
}

function FlowRow({
  label,
  amount,
  max,
  color,
}: {
  label: string;
  amount: number;
  max: number;
  color: string;
}) {
  const width = max > 0 ? Math.min(100, (amount / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--finance-subtle)]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SplitBar({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground">{Math.round(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--finance-subtle)]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--finance-subtle)] px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function UpcomingItem({
  title,
  date,
  dot,
}: {
  title: string;
  date: string;
  dot: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted">{date}</p>
      </div>
    </li>
  );
}
