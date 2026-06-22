import type { FinanceData } from "./types";

export type FinanceLevel = 0 | 1 | 2 | 3;

export interface LevelDefinition {
  level: FinanceLevel;
  title: string;
  description: string;
}

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: 0, title: "Awareness", description: "Tracking income & expenses" },
  { level: 1, title: "Protection", description: "Insurance & documents" },
  { level: 2, title: "Emergency fund", description: "3–6 months saved" },
  { level: 3, title: "Stability", description: "Debt & investing" },
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
    Math.min(3, focus + 1) as FinanceLevel,
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
