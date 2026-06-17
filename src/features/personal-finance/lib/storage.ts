import { DEFAULT_FINANCE_DATA } from "./defaults";
import type { FinanceData } from "../types";

const STORAGE_KEY = "personal-finance-data";

export function loadFinanceData(): FinanceData {
  if (typeof window === "undefined") return DEFAULT_FINANCE_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FINANCE_DATA;
    return { ...DEFAULT_FINANCE_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_FINANCE_DATA;
  }
}

export function saveFinanceData(data: FinanceData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportFinanceData(data: FinanceData): string {
  return JSON.stringify(data, null, 2);
}

export function importFinanceData(json: string): FinanceData {
  const parsed = JSON.parse(json) as FinanceData;
  return { ...DEFAULT_FINANCE_DATA, ...parsed, lastUpdated: new Date().toISOString() };
}
