import { calculateMetrics } from "../domain/calculations";
import { DEFAULT_FINANCE_DATA } from "../domain/defaults";
import type { FinanceData, FinanceMetrics } from "../domain/types";
import {
  fetchRemoteFinanceData,
  hasLocalFinanceData,
  loadLocalFinanceData,
  persistRemoteFinanceData,
  saveLocalFinanceData,
} from "../../infrastructure/finance-repository";

export function deriveMetrics(
  data: FinanceData,
  emergencyFundTarget: number
): FinanceMetrics {
  return calculateMetrics(data, emergencyFundTarget);
}

export function mergeFinanceData(remote: FinanceData | null): FinanceData {
  if (!remote) return DEFAULT_FINANCE_DATA;
  return { ...DEFAULT_FINANCE_DATA, ...remote };
}

export async function loadFinanceForUser(uid: string): Promise<{
  data: FinanceData;
  source: "remote" | "local" | "default";
}> {
  try {
    const remote = await fetchRemoteFinanceData();
    if (remote) {
      const merged = mergeFinanceData(remote);
      saveLocalFinanceData(uid, merged);
      return { data: merged, source: "remote" };
    }

    const local = loadLocalFinanceData(uid);
    if (hasLocalFinanceData(uid)) {
      await persistRemoteFinanceData(local);
      return { data: local, source: "local" };
    }

    await persistRemoteFinanceData(DEFAULT_FINANCE_DATA);
    return { data: DEFAULT_FINANCE_DATA, source: "default" };
  } catch (error) {
    if (error instanceof Error && error.message === "CLOUD_NOT_CONFIGURED") {
      return { data: loadLocalFinanceData(uid), source: "local" };
    }
    throw error;
  }
}

export async function saveFinanceForUser(uid: string, data: FinanceData): Promise<void> {
  saveLocalFinanceData(uid, data);
  await persistRemoteFinanceData(data);
}
