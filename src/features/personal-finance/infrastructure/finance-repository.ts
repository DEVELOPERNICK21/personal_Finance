import { DEFAULT_FINANCE_DATA } from "../core/domain/defaults";
import type { FinanceData } from "../core/domain/types";
import {
  isEncryptedFinanceRecord,
  isLegacyFinanceData,
  type EncryptedFinanceRecord,
  type FinanceStoragePayload,
} from "../core/domain/storage-record";
import { encryptFinanceData } from "./crypto-vault";
import { getIdToken } from "./auth-repository";

const STORAGE_PREFIX = "personal-finance-data";

function storageKey(uid: string): string {
  return `${STORAGE_PREFIX}-${uid}`;
}

export function hasLocalFinanceData(uid: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(storageKey(uid)) !== null;
}

export function loadLocalFinancePayload(uid: string): FinanceStoragePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return null;
    return JSON.parse(raw) as FinanceStoragePayload;
  } catch {
    return null;
  }
}

/** Decrypt or merge legacy local payload into FinanceData. */
export async function loadLocalFinanceData(
  uid: string,
  cryptoKey?: CryptoKey | null
): Promise<FinanceData> {
  const payload = loadLocalFinancePayload(uid);
  if (!payload) return DEFAULT_FINANCE_DATA;

  if (isEncryptedFinanceRecord(payload)) {
    if (!cryptoKey) throw new Error("VAULT_LOCKED");
    const { decryptFinanceData } = await import("./crypto-vault");
    const data = await decryptFinanceData(payload, cryptoKey);
    return { ...DEFAULT_FINANCE_DATA, ...data };
  }

  if (isLegacyFinanceData(payload)) {
    return { ...DEFAULT_FINANCE_DATA, ...payload };
  }

  return DEFAULT_FINANCE_DATA;
}

export function saveLocalFinancePayload(uid: string, payload: FinanceStoragePayload): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(uid), JSON.stringify(payload));
}

export async function saveLocalFinanceData(
  uid: string,
  data: FinanceData,
  cryptoKey?: CryptoKey | null,
  salt?: Uint8Array | null
): Promise<void> {
  if (cryptoKey && salt) {
    const record = await encryptFinanceData(data, cryptoKey, salt);
    saveLocalFinancePayload(uid, record);
    return;
  }
  saveLocalFinancePayload(uid, data);
}

/** @deprecated Use loadLocalFinanceData(uid, key) */
export function loadFinanceData(uid?: string): FinanceData {
  if (!uid) return DEFAULT_FINANCE_DATA;
  const payload = loadLocalFinancePayload(uid);
  if (!payload) return DEFAULT_FINANCE_DATA;
  if (isLegacyFinanceData(payload)) {
    return { ...DEFAULT_FINANCE_DATA, ...payload };
  }
  return DEFAULT_FINANCE_DATA;
}

/** @deprecated Use saveLocalFinanceData */
export function saveFinanceData(data: FinanceData, uid?: string): void {
  if (!uid) return;
  void saveLocalFinanceData(uid, data);
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

export async function peekRemoteFinancePayload(): Promise<FinanceStoragePayload | null> {
  return fetchRemoteFinancePayload();
}

export async function fetchRemoteFinancePayload(): Promise<FinanceStoragePayload | null> {
  const response = await fetch("/api/finance", {
    headers: await authHeaders(),
    cache: "no-store",
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 503) throw new Error("CLOUD_NOT_CONFIGURED");
  if (!response.ok) throw new Error("Failed to load finance data");

  const json = (await response.json()) as { data: FinanceStoragePayload | null };
  return json.data;
}

/** @deprecated Use fetchRemoteFinancePayload */
export async function fetchRemoteFinanceData(): Promise<FinanceData | null> {
  const payload = await fetchRemoteFinancePayload();
  if (!payload || !isLegacyFinanceData(payload)) return null;
  return payload;
}

export async function persistRemoteFinancePayload(
  payload: FinanceStoragePayload
): Promise<void> {
  const response = await fetch("/api/finance", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 503) throw new Error("CLOUD_NOT_CONFIGURED");
  if (!response.ok) throw new Error("Failed to save finance data");
}

export async function persistRemoteFinanceData(
  data: FinanceData,
  cryptoKey?: CryptoKey | null,
  salt?: Uint8Array | null
): Promise<void> {
  if (cryptoKey && salt) {
    const record = await encryptFinanceData(data, cryptoKey, salt);
    await persistRemoteFinancePayload(record);
    return;
  }
  await persistRemoteFinancePayload(data);
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

export async function decryptPayload(
  payload: EncryptedFinanceRecord,
  cryptoKey: CryptoKey
): Promise<FinanceData> {
  const { decryptFinanceData } = await import("./crypto-vault");
  const data = await decryptFinanceData(payload, cryptoKey);
  return { ...DEFAULT_FINANCE_DATA, ...data };
}
