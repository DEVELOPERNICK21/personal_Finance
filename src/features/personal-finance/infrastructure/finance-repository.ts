import { DEFAULT_FINANCE_DATA } from "../core/domain/defaults";
import type { FinanceData } from "../core/domain/types";
import { getIdToken } from "./auth-repository";

const STORAGE_PREFIX = "personal-finance-data";

function storageKey(uid: string): string {
  return `${STORAGE_PREFIX}-${uid}`;
}

export function hasLocalFinanceData(uid: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(storageKey(uid)) !== null;
}

export function loadLocalFinanceData(uid: string): FinanceData {
  if (typeof window === "undefined") return DEFAULT_FINANCE_DATA;
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return DEFAULT_FINANCE_DATA;
    return { ...DEFAULT_FINANCE_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_FINANCE_DATA;
  }
}

/** @deprecated Use loadLocalFinanceData(uid) — kept for module API compat */
export function loadFinanceData(uid?: string): FinanceData {
  if (!uid) return DEFAULT_FINANCE_DATA;
  return loadLocalFinanceData(uid);
}

export function saveLocalFinanceData(uid: string, data: FinanceData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(uid), JSON.stringify(data));
}

/** @deprecated Use saveLocalFinanceData(uid, data) */
export function saveFinanceData(data: FinanceData, uid?: string): void {
  if (!uid) return;
  saveLocalFinanceData(uid, data);
}

export function exportFinanceData(data: FinanceData): string {
  return JSON.stringify(data, null, 2);
}

export function importFinanceData(json: string): FinanceData {
  const parsed = JSON.parse(json) as FinanceData;
  return { ...DEFAULT_FINANCE_DATA, ...parsed, lastUpdated: new Date().toISOString() };
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getIdToken(true);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRemoteFinanceData(): Promise<FinanceData | null> {
  const response = await fetch("/api/finance", {
    headers: await authHeaders(),
    cache: "no-store",
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 503) throw new Error("CLOUD_NOT_CONFIGURED");
  if (!response.ok) throw new Error("Failed to load finance data");

  const json = (await response.json()) as { data: FinanceData | null };
  return json.data;
}

export async function persistRemoteFinanceData(data: FinanceData): Promise<void> {
  const response = await fetch("/api/finance", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 503) throw new Error("CLOUD_NOT_CONFIGURED");
  if (!response.ok) throw new Error("Failed to save finance data");
}

export async function fetchCloudStatus(): Promise<{
  cloudConfigured: boolean;
  authMode: string;
}> {
  const response = await fetch("/api/finance/status", { cache: "no-store" });
  if (!response.ok) {
    return { cloudConfigured: false, authMode: "firebase" };
  }
  return response.json() as Promise<{ cloudConfigured: boolean; authMode: string }>;
}
