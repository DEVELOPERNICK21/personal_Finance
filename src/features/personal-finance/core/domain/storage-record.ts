import type { FinanceData } from "./types";

/** Encrypted blob stored in Firestore / localStorage — server cannot read contents. */
export interface EncryptedFinanceRecord {
  v: 1;
  salt: string;
  encrypted: {
    ciphertext: string;
    iv: string;
  };
  lastUpdated: string;
}

export function isEncryptedFinanceRecord(
  value: unknown
): value is EncryptedFinanceRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as EncryptedFinanceRecord;
  return (
    r.v === 1 &&
    typeof r.salt === "string" &&
    typeof r.encrypted?.ciphertext === "string" &&
    typeof r.encrypted?.iv === "string"
  );
}

export function isLegacyFinanceData(value: unknown): value is FinanceData {
  if (!value || typeof value !== "object") return false;
  const d = value as FinanceData;
  return Array.isArray(d.accounts) && typeof d.monthly === "object";
}

export type FinanceStoragePayload = EncryptedFinanceRecord | FinanceData;
