"use client";

import Link from "next/link";
import {
  Calendar,
  Check,
  ChevronRight,
  Landmark,
  Shield,
  Upload,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useFinance } from "../presentation/providers/FinanceProvider";
import { financeHref } from "../routes";
import {
  deriveCurrentLevel,
  getJourneySteps,
  getMonthlySpend,
  hasLevel0Inputs,
  countActiveSips,
  monthlySipTotal,
} from "../core/domain/levels";
import { formatCurrency, formatShortDate } from "../lib/format";

export function DashboardPage() {
  const { data, metrics, config } = useFinance();
  const base = config.basePath;
  const level = deriveCurrentLevel(data);
  const journey = getJourneySteps(data);
  const monthlySpend = getMonthlySpend(data);
  const income = data.monthly.income;
  const spentPercent = income > 0 ? Math.round((monthlySpend / income) * 100) : 0;
  const sipCount = countActiveSips(data);
  const sipMonthly = monthlySipTotal(data);
  const runwayGoal = 6;
  const runwayProgress = Math.min(100, (metrics.survivalRunwayMonths / runwayGoal) * 100);
  const showLevelNudge = !hasLevel0Inputs(data);

  return (
    <div className="space-y-6">
      {/* Level 0 nudge */}
      {showLevelNudge && (
        <Link
          href={financeHref(base, "monthly")}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--vault-secondary)] bg-[var(--vault-secondary-fixed)] p-4 text-left vault-label-md text-[var(--vault-on-secondary-fixed-variant)] transition-transform active:scale-95"
        >
          <span>Add 3 numbers to see your full picture →</span>
          <Zap className="h-4 w-4 shrink-0" />
        </Link>
      )}

      {/* Hero: Net worth & runway */}
      <section className="vault-card p-5">
        <p className="vault-label-md mb-1 text-[var(--vault-on-surface-variant)]">Total Net Worth</p>
        <h1 className="vault-display-lg mb-6 text-[var(--vault-on-surface)]">
          {formatCurrency(metrics.netWorth)}
        </h1>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <span className="vault-label-md italic text-[var(--vault-on-surface-variant)]">
              {monthlySpend > 0
                ? `${metrics.survivalRunwayMonths.toFixed(1)} months if income stops`
                : "Add expenses to see runway"}
            </span>
            <span className="vault-label-sm text-[var(--vault-primary)]">Target: 6m</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--vault-surface-container-high)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[var(--vault-primary)] transition-all duration-700"
              style={{ width: `${runwayProgress}%` }}
            />
          </div>
          <div className="flex justify-between vault-label-sm text-[var(--vault-outline)]">
            <span>0m</span>
            <span>2m</span>
            <span>4m</span>
            <span>6m</span>
          </div>
        </div>
      </section>

      {/* This month grid */}
      <section>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Income" value={formatCurrency(income)} valueClass="text-[var(--vault-primary)]" />
          <StatTile label="Spent" value={formatCurrency(monthlySpend)} valueClass="text-[var(--vault-error)]" />
          <StatTile
            label="Remaining"
            value={formatCurrency(Math.max(0, metrics.monthlyRemaining))}
          />
          <StatTile
            label="SIPs running"
            value={sipCount > 0 || sipMonthly > 0 ? `${sipCount || 1} active` : "None yet"}
            valueClass="text-[var(--vault-secondary)]"
            sub={sipMonthly > 0 ? `${formatCurrency(sipMonthly)}/mo` : undefined}
          />
          {income > 0 && monthlySpend > 0 && (
            <p className="col-span-2 vault-label-sm text-[var(--vault-on-surface-variant)]">
              {spentPercent}% of income spent this month
            </p>
          )}
        </div>
      </section>

      {/* Journey */}
      <section className="rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-low)] p-5">
        <h2 className="vault-headline-sm mb-6">Financial Journey</h2>
        <div className="relative space-y-8">
          {journey.map((step, i) => (
            <div key={step.level} className="relative flex gap-4">
              {i < journey.length - 1 && (
                <div
                  className={`vault-journey-line ${step.status === "done" ? "vault-journey-line-active" : ""}`}
                />
              )}
              <JourneyDot status={step.status} level={step.level} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`vault-label-md ${
                        step.status === "now"
                          ? "font-semibold text-[var(--vault-secondary)]"
                          : step.status === "done"
                            ? "text-[var(--vault-on-surface)]"
                            : "text-[var(--vault-outline)]"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="vault-label-sm text-[var(--vault-on-surface-variant)]">
                      {step.description}
                    </p>
                  </div>
                  <StatusPill status={step.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Level 1+: renewing soon */}
      {level >= 1 && (
        <section className="relative overflow-hidden rounded-2xl border border-[var(--vault-secondary-container)]/30 bg-[var(--vault-secondary-container)]/20 p-5">
          <h4 className="vault-headline-sm mb-1 text-[var(--vault-on-secondary-container)]">
            What&apos;s renewing soon?
          </h4>
          {metrics.nextInsuranceRenewal ? (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--vault-secondary-container)]/30 bg-[var(--vault-surface-container-lowest)]/80 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--vault-secondary)]/10 text-[var(--vault-secondary)]">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="vault-label-md">{metrics.nextInsuranceRenewal.name}</p>
                <p className="vault-label-sm text-[var(--vault-error)]">
                  {formatShortDate(metrics.nextInsuranceRenewal.date)}
                </p>
              </div>
            </div>
          ) : (
            <p className="vault-body-sm text-[var(--vault-on-secondary-container)]/80">
              No renewals tracked yet — add an insurance policy.
            </p>
          )}
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[var(--vault-secondary)]/10 blur-2xl" />
        </section>
      )}

      {/* Quick actions */}
      <section>
        <h3 className="vault-headline-sm mb-3">Quick actions</h3>
        {level === 0 ? (
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              href={financeHref(base, "monthly")}
              icon={Calendar}
              label="Set monthly budget"
            />
            <QuickActionCard
              href={financeHref(base, "accounts")}
              icon={Landmark}
              label="Add bank account"
            />
          </div>
        ) : (
          <ul className="divide-y divide-[var(--vault-outline-variant)]/50 overflow-hidden rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)]">
            {getListActions(level, data, base).map((action) => (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--vault-surface-container-low)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--vault-outline-variant)]">
                    <action.icon className="h-4 w-4 text-[var(--vault-on-surface-variant)]" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1 vault-body-sm">{action.label}</span>
                  <span className="vault-label-sm text-[var(--vault-outline)]">{action.meta}</span>
                  <ChevronRight className="h-4 w-4 text-[var(--vault-outline)]/50" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  valueClass = "text-[var(--vault-on-surface)]",
  sub,
}: {
  label: string;
  value: string;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <div className="vault-card flex flex-col justify-between p-4">
      <span className="vault-label-sm text-[var(--vault-on-surface-variant)]">{label}</span>
      <span className={`vault-body-lg ${valueClass}`}>{value}</span>
      {sub && <span className="vault-label-sm text-[var(--vault-outline)]">{sub}</span>}
    </div>
  );
}

function JourneyDot({
  status,
  level,
}: {
  status: "done" | "now" | "next" | "later";
  level: number;
}) {
  if (status === "done") {
    return (
      <span className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--vault-secondary)] text-[var(--vault-on-secondary)]">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "now") {
    return (
      <span className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--vault-secondary)] bg-[var(--vault-surface)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--vault-secondary)]" />
      </span>
    );
  }
  return (
    <span className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--vault-outline-variant)] text-[10px] text-[var(--vault-outline)]">
      {level}
    </span>
  );
}

function StatusPill({ status }: { status: "done" | "now" | "next" | "later" }) {
  const map = {
    done: "bg-[var(--vault-tertiary)]/15 text-[var(--vault-tertiary)]",
    now: "bg-[var(--vault-secondary)]/15 text-[var(--vault-secondary)]",
    next: "bg-[var(--vault-surface-container-high)] text-[var(--vault-outline)]",
    later: "bg-[var(--vault-surface-container-high)] text-[var(--vault-outline)]",
  };
  const labels = { done: "Done", now: "Now", next: "Next", later: "Later" };
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 vault-label-sm ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function QuickActionCard({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Calendar;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-3 rounded-xl bg-[var(--vault-primary)] p-4 text-[var(--vault-on-primary)] transition-opacity hover:opacity-90 active:scale-95"
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="vault-label-md text-left">{label}</span>
    </Link>
  );
}

function getListActions(
  level: number,
  data: ReturnType<typeof useFinance>["data"],
  base: string
) {
  if (level === 1) {
    return [
      { label: "Add insurance policy", href: financeHref(base, "insurance"), icon: Shield, meta: "Level 1" },
      { label: "Upload documents", href: financeHref(base, "documents"), icon: Upload, meta: `${data.documents.length} added` },
      { label: "Emergency contacts", href: financeHref(base, "emergency"), icon: Users, meta: data.contacts.length > 0 ? `${data.contacts.length} set` : "Not set" },
    ];
  }
  return [
    { label: "Top up emergency fund", href: financeHref(base, "goals"), icon: Wallet, meta: "Level 2" },
    { label: "Check runway goal", href: financeHref(base, "goals"), icon: Wallet, meta: "6 month target" },
  ];
}
