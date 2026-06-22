"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Lightbulb,
  Lock,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { FinanceData } from "../../core/domain/types";
import {
  getFullRoadmapSteps,
  getNextStepInsight,
  type RoadmapStep,
} from "../../core/domain/levels";

interface FinancialRoadmapProps {
  data: FinanceData;
  basePath: string;
  /** Compact card for embedding on Goals / Dashboard desktop */
  compact?: boolean;
  showInsight?: boolean;
  title?: string;
  backHref?: string;
}

export function FinancialRoadmap({
  data,
  basePath,
  compact = false,
  showInsight = true,
  title = "Financial Roadmap",
  backHref,
}: FinancialRoadmapProps) {
  const steps = getFullRoadmapSteps(data);
  const insight = showInsight ? getNextStepInsight(data, basePath) : null;

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--vault-outline-variant)] text-[var(--vault-on-surface-variant)] hover:bg-[var(--vault-surface-container-low)]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <h2 className={compact ? "vault-headline-sm" : "vault-headline-md"}>{title}</h2>
      </div>

      <div
        className={`vault-card ${compact ? "p-4" : "p-5"} ${!compact ? "md:p-6" : ""}`}
      >
        <ol className="relative space-y-0">
          {steps.map((step, i) => (
            <RoadmapRow key={step.level} step={step} isLast={i === steps.length - 1} />
          ))}
        </ol>
      </div>

      {insight && (
        <div className="rounded-xl bg-[var(--vault-primary)] p-5 text-[var(--vault-on-primary)]">
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className="vault-label-md uppercase tracking-wider opacity-90">Next step insight</p>
            <Lightbulb className="h-4 w-4 shrink-0 opacity-80" />
          </div>
          <p className="vault-body-sm leading-relaxed opacity-95">{insight.message}</p>
          <Link
            href={insight.ctaHref}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--vault-primary-container)] py-3.5 vault-label-md font-medium text-[var(--vault-on-primary-container)] transition-transform active:scale-[0.98]"
          >
            {insight.ctaLabel}
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

function RoadmapRow({ step, isLast }: { step: RoadmapStep; isLast: boolean }) {
  const isActive = step.status === "active";
  const isDone = step.status === "done";
  const isLocked = step.status === "locked";

  return (
    <li className={`relative flex gap-4 pb-8 ${isLast ? "pb-0" : ""}`}>
      {!isLast && (
        <div
          className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
            isDone ? "bg-[var(--vault-primary)]" : "bg-[var(--vault-outline-variant)]"
          }`}
          aria-hidden
        />
      )}

      <div className="relative z-10 shrink-0">
        <RoadmapIcon step={step} />
      </div>

      <div
        className={`min-w-0 flex-1 ${isActive ? "rounded-xl border border-[var(--vault-secondary)]/40 bg-[var(--vault-secondary-fixed)]/15 p-4 -m-1" : ""}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className={isLocked ? "opacity-50" : ""}>
            <p className="vault-label-sm uppercase tracking-wider text-[var(--vault-outline)]">
              Level {step.level}
            </p>
            <p
              className={`vault-body-md font-medium ${
                isActive
                  ? "text-[var(--vault-secondary)]"
                  : isDone
                    ? "text-[var(--vault-on-surface)]"
                    : "text-[var(--vault-outline)]"
              }`}
            >
              {step.shortLabel}
            </p>
            <p
              className={`mt-0.5 vault-label-sm ${
                isLocked
                  ? "text-[var(--vault-outline)]"
                  : "text-[var(--vault-on-surface-variant)]"
              }`}
            >
              {step.description}
            </p>
          </div>
          <StatusBadge status={step.status} />
        </div>

        {step.progress && (
          <div className="mt-4 space-y-2">
            <div className="relative h-2 overflow-hidden rounded-full bg-[var(--vault-surface-container-high)]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[var(--vault-secondary)] transition-all duration-700"
                style={{ width: `${step.progress.percent}%` }}
              />
            </div>
            <div className="flex justify-between vault-label-sm text-[var(--vault-on-surface-variant)]">
              <span>
                {step.progress.monthsSaved.toFixed(1)} / {step.progress.monthsGoal} months
              </span>
              <span>{Math.round(step.progress.percent)}%</span>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function RoadmapIcon({ step }: { step: RoadmapStep }) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full";

  if (step.status === "done") {
    return (
      <span className={`${base} bg-[var(--vault-primary)] text-[var(--vault-on-primary)]`}>
        {step.level === 1 ? (
          <Shield className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        )}
      </span>
    );
  }

  if (step.status === "active") {
    return (
      <span
        className={`${base} bg-[var(--vault-secondary)] text-white ring-4 ring-[var(--vault-secondary)]/25`}
      >
        <Zap className="h-4 w-4" strokeWidth={2} fill="currentColor" />
      </span>
    );
  }

  return (
    <span
      className={`${base} border border-dashed border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-low)] text-[var(--vault-outline)]`}
    >
      <Lock className="h-3.5 w-3.5" />
    </span>
  );
}

function StatusBadge({ status }: { status: RoadmapStep["status"] }) {
  if (status === "done") {
    return (
      <span className="rounded-full bg-[var(--vault-primary)]/15 px-2 py-0.5 vault-label-sm font-medium uppercase tracking-wide text-[var(--vault-primary)]">
        Done
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="rounded-full bg-[var(--vault-secondary)] px-2 py-0.5 vault-label-sm font-medium uppercase tracking-wide text-white">
        Active
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[var(--vault-surface-container-high)] px-2 py-0.5 vault-label-sm uppercase tracking-wide text-[var(--vault-outline)]">
      <Lock className="mr-0.5 inline h-3 w-3" />
    </span>
  );
}

/** Desktop goals sidebar card — milestone path summary */
export function FinancialMilestonePath({
  data,
  basePath,
}: {
  data: FinanceData;
  basePath: string;
}) {
  const steps = getFullRoadmapSteps(data);
  const done = steps.filter((s) => s.status === "done");
  const active = steps.find((s) => s.status === "active");
  const next = steps.find((s) => s.status === "locked");

  return (
    <div className="vault-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="vault-headline-sm">Financial Milestone Path</h3>
        <Sparkles className="h-4 w-4 text-[var(--vault-secondary)]" />
      </div>
      <ol className="space-y-4">
        {done.slice(-1).map((step) => (
          <li key={step.level} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--vault-secondary)] text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <div>
              <p className="vault-label-sm text-[var(--vault-outline)] line-through opacity-70">
                Milestone {step.level + 1}
              </p>
              <p className="vault-body-sm text-[var(--vault-on-surface-variant)]">{step.title}</p>
            </div>
          </li>
        ))}
        {active && (
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--vault-secondary)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--vault-secondary)]" />
            </span>
            <div>
              <p className="vault-label-sm font-medium text-[var(--vault-secondary)]">In progress</p>
              <p className="vault-body-sm font-medium text-[var(--vault-on-surface)]">
                {active.title}
                {active.progress
                  ? ` (${active.progress.monthsGoal}m)`
                  : ""}
              </p>
            </div>
          </li>
        )}
        {next && (
          <li className="flex items-start gap-3 opacity-50">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--vault-outline-variant)]" />
            <div>
              <p className="vault-label-sm text-[var(--vault-outline)]">Upcoming</p>
              <p className="vault-body-sm text-[var(--vault-on-surface-variant)]">{next.title}</p>
            </div>
          </li>
        )}
      </ol>
      <Link
        href={`${basePath.replace(/\/$/, "")}/roadmap`}
        className="mt-4 block text-center vault-label-md text-[var(--vault-primary)] hover:underline"
      >
        View full roadmap →
      </Link>
    </div>
  );
}
