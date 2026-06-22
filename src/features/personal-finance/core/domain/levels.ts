import type { FinanceData } from "./types";

export type FinanceLevel = 0 | 1 | 2 | 3 | 4;

export interface LevelDefinition {
  level: FinanceLevel;
  title: string;
  description: string;
  shortLabel: string;
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: 0, title: "Awareness", shortLabel: "Awareness", description: "Income and expenses identified" },
  { level: 1, title: "Protection", shortLabel: "Protection", description: "Insurance and critical documents vault" },
  { level: 2, title: "Emergency Fund", shortLabel: "Emergency Fund", description: "Building 6 months of survival runway" },
  { level: 3, title: "Wealth Building", shortLabel: "Wealth Building", description: "Diversified investments and tax planning" },
  { level: 4, title: "Financial Independence", shortLabel: "Financial Independence", description: "Reaching your FI number and passive income" },
];

export function getMonthlySpend(data: FinanceData): number {
  const m = data.monthly;
  return (
    m.fixedExpenses +
    m.variableExpenses +
    m.momSupport +
    m.rentUtilities +
    m.lifestyleCap
  );
}

export function hasLevel0Inputs(data: FinanceData): boolean {
  return data.monthly.income > 0 && getMonthlySpend(data) > 0;
}

export function hasBankOrSavings(data: FinanceData): boolean {
  return (
    data.accounts.some((a) => a.type === "bank" && a.currentValue > 0) ||
    data.assets.emergencyCash > 0
  );
}

export function hasSavingsAccount(data: FinanceData): boolean {
  return data.accounts.some((a) => a.type === "bank");
}

/** The level the user is currently working on (0 = awareness). */
export function deriveCurrentLevel(data: FinanceData): FinanceLevel {
  if (!hasLevel0Inputs(data)) return 0;
  if (!hasSavingsAccount(data)) return 1;
  return 2;
}

/** Display level after first onboarding step (income + expenses only). */
export function deriveOnboardingLevel(): FinanceLevel {
  return 0;
}

export function isLevelComplete(level: FinanceLevel, data: FinanceData): boolean {
  switch (level) {
    case 0:
      return hasLevel0Inputs(data);
    case 1:
      return hasLevel0Inputs(data);
    case 2:
      return hasSavingsAccount(data);
    default:
      return false;
  }
}

export interface JourneyStep {
  level: FinanceLevel;
  title: string;
  description: string;
  status: "done" | "now" | "next" | "later";
}

/** Show current level ±1 for the journey strip. */
export function getJourneySteps(data: FinanceData): JourneyStep[] {
  const focus = deriveCurrentLevel(data);
  const level0Done = hasLevel0Inputs(data);

  const visible: FinanceLevel[] = [
    Math.max(0, focus - 1) as FinanceLevel,
    focus,
    Math.min(4, focus + 1) as FinanceLevel,
  ];

  const unique = [...new Set(visible)];

  return unique.map((level) => {
    const def = LEVEL_DEFINITIONS[level]!;
    let status: JourneyStep["status"];

    if (level === 0 && level0Done) {
      status = "done";
    } else if (level < focus) {
      status = "done";
    } else if (level === focus) {
      status = "now";
    } else if (level === focus + 1) {
      status = "next";
    } else {
      status = "later";
    }

    return {
      level,
      title: def.title,
      description: def.description,
      status,
    };
  });
}

export function countActiveSips(data: FinanceData): number {
  return data.accounts.filter((a) => a.type === "mutual_fund").length;
}

export function monthlySipTotal(data: FinanceData): number {
  return data.monthly.sipCapacity;
}

export type RoadmapStatus = "done" | "active" | "locked";

export interface RoadmapStep {
  level: FinanceLevel;
  title: string;
  shortLabel: string;
  description: string;
  status: RoadmapStatus;
  /** Emergency fund progress when level 2 is active */
  progress?: {
    monthsSaved: number;
    monthsGoal: number;
    percent: number;
  };
}

const ROADMAP_LEVELS: FinanceLevel[] = [0, 1, 2, 3, 4];

/** Full vertical roadmap — all finance stages with done / active / locked. */
export function getFullRoadmapSteps(
  data: FinanceData,
  monthsGoal = 6
): RoadmapStep[] {
  const focus = deriveCurrentLevel(data);
  const monthlySpend = getMonthlySpend(data);
  const bankValue = data.accounts
    .filter((a) => a.type === "bank")
    .reduce((sum, a) => sum + a.currentValue, 0);
  const liquidSavings = data.assets.emergencyCash + bankValue;
  const monthsSaved = monthlySpend > 0 ? liquidSavings / monthlySpend : 0;

  return ROADMAP_LEVELS.map((level) => {
    const def = LEVEL_DEFINITIONS[level]!;
    let status: RoadmapStatus;
    if (level < focus) status = "done";
    else if (level === focus) status = "active";
    else status = "locked";

    const step: RoadmapStep = {
      level,
      title: def.title,
      shortLabel: def.shortLabel,
      description: def.description,
      status,
    };

    if (level === 2 && status === "active" && monthlySpend > 0) {
      step.progress = {
        monthsSaved: Math.min(monthsGoal, monthsSaved),
        monthsGoal,
        percent: Math.min(100, (monthsSaved / monthsGoal) * 100),
      };
    }

    return step;
  });
}

export interface NextStepInsight {
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

export function getNextStepInsight(
  data: FinanceData,
  basePath: string,
  monthsGoal = 6
): NextStepInsight | null {
  const focus = deriveCurrentLevel(data);
  const monthlySpend = getMonthlySpend(data);
  const monthlySave = data.monthly.income - monthlySpend - data.monthly.sipCapacity;

  if (focus === 0) {
    return {
      message: "Add your monthly income and expenses to unlock your financial picture.",
      ctaLabel: "Add my numbers",
      ctaHref: `${basePath.replace(/\/$/, "")}/monthly`,
    };
  }

  if (focus === 1) {
    return {
      message: "Secure your family — add at least one insurance policy and upload your PAN or Aadhaar.",
      ctaLabel: "Add protection",
      ctaHref: `${basePath.replace(/\/$/, "")}/insurance`,
    };
  }

  if (focus === 2 && monthlySpend > 0) {
    const bankValue = data.accounts
      .filter((a) => a.type === "bank")
      .reduce((sum, a) => sum + a.currentValue, 0);
    const liquid = data.assets.emergencyCash + bankValue;
    const monthsSaved = liquid / monthlySpend;
    const monthsLeft = Math.max(0, monthsGoal - monthsSaved);

    if (monthsLeft <= 0) {
      return {
        message: "Your emergency fund target is met. You're ready to start building wealth.",
        ctaLabel: "Explore investments",
        ctaHref: `${basePath.replace(/\/$/, "")}/investments`,
      };
    }

    const monthlyTopUp =
      monthlySave > 0
        ? Math.ceil((monthsLeft * monthlySpend - liquid) / Math.max(1, monthsLeft))
        : Math.ceil((monthsGoal * monthlySpend - liquid) / 6);

    const monthsPhrase =
      monthsLeft < 1
        ? "less than a month"
        : monthsLeft === 1
          ? "1 month"
          : `${Math.ceil(monthsLeft)} months`;

    return {
      message: `You're ${monthsPhrase} away from completing your emergency fund. Adding ${formatInr(monthlyTopUp)} this month will put you ahead of schedule.`,
      ctaLabel: "Optimize my savings",
      ctaHref: `${basePath.replace(/\/$/, "")}/goals`,
    };
  }

  return null;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, amount));
}
