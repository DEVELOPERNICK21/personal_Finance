import { calculateMetrics } from "../domain/calculations";
import { DEFAULT_FINANCE_DATA } from "../domain/defaults";
import type { FinanceData, FinanceMetrics } from "../domain/types";
import {
  isEncryptedFinanceRecord,
  isLegacyFinanceData,
} from "../domain/storage-record";
import {
  decryptPayload,
  fetchRemoteFinancePayload,
  hasLocalFinanceData,
  loadLocalFinanceData,
  persistRemoteFinanceData,
  saveLocalFinanceData,
} from "../../infrastructure/finance-repository";

export interface VaultCrypto {
  key: CryptoKey;
  salt: Uint8Array;
}

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

async function resolveRemoteData(crypto?: VaultCrypto | null): Promise<FinanceData | null> {
  const payload = await fetchRemoteFinancePayload();
  if (!payload) return null;

  if (isEncryptedFinanceRecord(payload)) {
    if (!crypto) throw new Error("VAULT_LOCKED");
    return decryptPayload(payload, crypto.key);
  }

  if (isLegacyFinanceData(payload)) {
    return mergeFinanceData(payload);
  }

  return null;
}

export async function loadFinanceForUser(
  uid: string,
  crypto?: VaultCrypto | null
): Promise<{
  data: FinanceData;
  source: "remote" | "local" | "default";
}> {
  try {
    const remote = await resolveRemoteData(crypto);
    if (remote) {
      await saveLocalFinanceData(uid, remote, crypto?.key, crypto?.salt);
      return { data: remote, source: "remote" };
    }

    if (hasLocalFinanceData(uid)) {
      const local = await loadLocalFinanceData(uid, crypto?.key);
      await persistRemoteFinanceData(local, crypto?.key, crypto?.salt);
      return { data: local, source: "local" };
    }

    await persistRemoteFinanceData(DEFAULT_FINANCE_DATA, crypto?.key, crypto?.salt);
    return { data: DEFAULT_FINANCE_DATA, source: "default" };
  } catch (error) {
    if (error instanceof Error && error.message === "CLOUD_NOT_CONFIGURED") {
      const local = await loadLocalFinanceData(uid, crypto?.key);
      return { data: local, source: "local" };
    }
    throw error;
  }
}

export async function saveFinanceForUser(
  uid: string,
  data: FinanceData,
  crypto?: VaultCrypto | null
): Promise<void> {
  await saveLocalFinanceData(uid, data, crypto?.key, crypto?.salt);
  await persistRemoteFinanceData(data, crypto?.key, crypto?.salt);
}
