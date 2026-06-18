"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { deriveVaultKey, verifyPassphrase } from "../../infrastructure/crypto-vault";
import { peekRemoteFinancePayload } from "../../infrastructure/finance-repository";
import { isEncryptedFinanceRecord } from "../../core/domain/storage-record";
import { useAuth } from "./AuthProvider";

export type VaultStatus = "loading" | "setup" | "locked" | "unlocked";

interface VaultContextValue {
  status: VaultStatus;
  cryptoKey: CryptoKey | null;
  salt: Uint8Array | null;
  unlock: (passphrase: string) => Promise<void>;
  setup: (passphrase: string) => Promise<void>;
  lock: () => void;
  error: string;
  clearError: () => void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [status, setStatus] = useState<VaultStatus>("loading");
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [salt, setSalt] = useState<Uint8Array | null>(null);
  const [error, setError] = useState("");
  const encryptedRecordRef = useRef<Awaited<ReturnType<typeof peekRemoteFinancePayload>>>(null);
  const detectedUidRef = useRef<string | null>(null);
  const cryptoKeyRef = useRef<CryptoKey | null>(null);

  useEffect(() => {
    cryptoKeyRef.current = cryptoKey;
  }, [cryptoKey]);

  const clearError = useCallback(() => setError(""), []);

  const lock = useCallback(() => {
    cryptoKeyRef.current = null;
    setCryptoKey(null);
    setSalt(null);
    setStatus("locked");
  }, []);

  useEffect(() => {
    if (!uid) {
      detectedUidRef.current = null;
      cryptoKeyRef.current = null;
      queueMicrotask(() => {
        setCryptoKey(null);
        setSalt(null);
        setStatus("loading");
      });
      return;
    }

    // Session already unlocked — do not re-detect or lock on navigation / auth refresh
    if (cryptoKeyRef.current) {
      queueMicrotask(() => setStatus("unlocked"));
      return;
    }

    // Vault type already detected for this user (waiting on passphrase)
    if (detectedUidRef.current === uid) {
      return;
    }

    detectedUidRef.current = uid;
    let cancelled = false;

    async function detectVault() {
      setStatus("loading");
      setError("");
      try {
        const payload = await peekRemoteFinancePayload();
        if (cancelled || cryptoKeyRef.current) return;

        encryptedRecordRef.current = payload;

        if (payload && isEncryptedFinanceRecord(payload)) {
          setStatus("locked");
          return;
        }

        setStatus("setup");
      } catch {
        if (!cancelled && !cryptoKeyRef.current) setStatus("setup");
      }
    }

    void detectVault();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const unlock = useCallback(async (passphrase: string) => {
    setError("");
    const record = encryptedRecordRef.current;
    if (!record || !isEncryptedFinanceRecord(record)) {
      setError("No encrypted vault found for this account.");
      return;
    }

    const ok = await verifyPassphrase(record, passphrase);
    if (!ok) {
      setError("Incorrect vault passphrase.");
      return;
    }

    const saltBytes = Uint8Array.from(atob(record.salt), (c) => c.charCodeAt(0));
    const key = await deriveVaultKey(passphrase, saltBytes);
    cryptoKeyRef.current = key;
    setCryptoKey(key);
    setSalt(saltBytes);
    setStatus("unlocked");
  }, []);

  const setup = useCallback(async (passphrase: string) => {
    if (passphrase.length < 8) {
      setError("Vault passphrase must be at least 8 characters.");
      return;
    }

    setError("");
    const { generateSalt } = await import("../../infrastructure/crypto-vault");
    const newSalt = generateSalt();
    const key = await deriveVaultKey(passphrase, newSalt);
    cryptoKeyRef.current = key;
    setCryptoKey(key);
    setSalt(newSalt);
    setStatus("unlocked");
  }, []);

  const value = useMemo(
    () => ({
      status,
      cryptoKey,
      salt,
      unlock,
      setup,
      lock,
      error,
      clearError,
    }),
    [status, cryptoKey, salt, unlock, setup, lock, error, clearError]
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within VaultProvider");
  return ctx;
}
