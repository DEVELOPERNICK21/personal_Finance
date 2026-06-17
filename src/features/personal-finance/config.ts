import type { FinanceConfig } from "./types";

export const DEFAULT_CONFIG: FinanceConfig = {
  basePath: "/finance",
  currency: "INR",
  locale: "en-IN",
  emergencyFundTarget: 250000,
};

export function createFinanceConfig(
  overrides: Partial<FinanceConfig> = {}
): FinanceConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}
