import type { FinanceData } from "../types";

const ACCESS_KEY_STORAGE = "personal-finance-access-key";

export function getStoredAccessKey(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_KEY_STORAGE);
}

export function setStoredAccessKey(key: string): void {
  sessionStorage.setItem(ACCESS_KEY_STORAGE, key);
}

export function clearStoredAccessKey(): void {
  sessionStorage.removeItem(ACCESS_KEY_STORAGE);
}

function authHeaders(): HeadersInit {
  const key = getStoredAccessKey();
  return key ? { Authorization: `Bearer ${key}` } : {};
}

export async function fetchFinanceData(): Promise<FinanceData | null> {
  const response = await fetch("/api/finance", {
    headers: authHeaders(),
    cache: "no-store",
  });

  if (response.status === 401) {
    clearStoredAccessKey();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 503) {
    throw new Error("CLOUD_NOT_CONFIGURED");
  }

  if (!response.ok) {
    throw new Error("Failed to load finance data");
  }

  const json = (await response.json()) as { data: FinanceData | null };
  return json.data;
}

export async function persistFinanceData(data: FinanceData): Promise<void> {
  const response = await fetch("/api/finance", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    clearStoredAccessKey();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 503) {
    throw new Error("CLOUD_NOT_CONFIGURED");
  }

  if (!response.ok) {
    throw new Error("Failed to save finance data");
  }
}

export async function verifyAccessKey(key: string): Promise<boolean> {
  const response = await fetch("/api/finance", {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  if (response.status === 401) return false;
  if (response.status === 503) throw new Error("CLOUD_NOT_CONFIGURED");
  return response.ok;
}
