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
import { deriveMetrics, loadFinanceForUser, saveFinanceForUser } from "../../core/application/finance-service";
import { DEFAULT_FINANCE_DATA } from "../../core/domain/defaults";
import type { FinanceConfig, FinanceData, FinanceMetrics } from "../../core/domain/types";
import { saveLocalFinanceData } from "../../infrastructure/finance-repository";
import { createFinanceConfig } from "../../config";
import { useAuth } from "./AuthProvider";
import { useVault } from "./VaultProvider";

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error" | "offline";

interface FinanceContextValue {
  data: FinanceData;
  metrics: FinanceMetrics;
  config: FinanceConfig;
  saveStatus: SaveStatus;
  usesCloudStorage: boolean;
  updateData: (updater: (prev: FinanceData) => FinanceData) => void;
  commitReview: () => void;
  toggleSosMode: () => void;
  retryCloudSync: () => void;
  flushSave: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

interface FinanceProviderProps {
  children: ReactNode;
  config?: Partial<FinanceConfig>;
  initialData?: FinanceData;
}

const SAVE_DEBOUNCE_MS = 600;

export function FinanceProvider({
  children,
  config: configOverrides,
  initialData,
}: FinanceProviderProps) {
  const { user, status: authStatus } = useAuth();
  const { cryptoKey, salt, status: vaultStatus } = useVault();
  const config = useMemo(
    () => createFinanceConfig(configOverrides),
    [configOverrides]
  );

  const [data, setData] = useState<FinanceData>(() => initialData ?? DEFAULT_FINANCE_DATA);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    initialData ? "saved" : "loading"
  );
  const [usesCloudStorage, setUsesCloudStorage] = useState(false);
  const skipSaveRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  const userRef = useRef(user);
  const usesCloudRef = useRef(usesCloudStorage);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    usesCloudRef.current = usesCloudStorage;
  }, [usesCloudStorage]);

  const vaultCrypto = useMemo(
    () => (cryptoKey && salt ? { key: cryptoKey, salt } : null),
    [cryptoKey, salt]
  );

  const persistToCloud = useCallback(async (payload: FinanceData) => {
    const uid = userRef.current?.uid;
    if (!uid || !usesCloudRef.current || !vaultCrypto) return;

    setSaveStatus("saving");
    try {
      await saveFinanceForUser(uid, payload, vaultCrypto);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [vaultCrypto]);

  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const uid = userRef.current?.uid;
    if (!uid || skipSaveRef.current || !vaultCrypto) return;

    void saveLocalFinanceData(uid, dataRef.current, vaultCrypto.key, vaultCrypto.salt);
    if (usesCloudRef.current) {
      await persistToCloud(dataRef.current);
    }
  }, [persistToCloud, vaultCrypto]);

  const loadUserFinance = useCallback(async (uid: string) => {
    if (!vaultCrypto) return;
    setSaveStatus("loading");
    try {
      const result = await loadFinanceForUser(uid, vaultCrypto);
      setData(result.data);
      dataRef.current = result.data;
      setUsesCloudStorage(true);
      setSaveStatus("saved");
    } catch (error) {
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        setSaveStatus("error");
        return;
      }
      if (error instanceof Error && error.message === "CLOUD_NOT_CONFIGURED") {
        setUsesCloudStorage(false);
        setSaveStatus("offline");
        return;
      }
      setSaveStatus("error");
    }
  }, [vaultCrypto]);

  useEffect(() => {
    if (initialData) return;
    if (authStatus === "loading" || vaultStatus !== "unlocked" || !vaultCrypto) return;

    if (!user) {
      queueMicrotask(() => {
        setData(DEFAULT_FINANCE_DATA);
        setSaveStatus("offline");
        setUsesCloudStorage(false);
      });
      return;
    }

    queueMicrotask(() => {
      void loadUserFinance(user.uid);
    });
  }, [initialData, authStatus, vaultStatus, vaultCrypto, user, loadUserFinance]);

  useEffect(() => {
    skipSaveRef.current = false;
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (skipSaveRef.current || !user || !vaultCrypto) return;

    void saveLocalFinanceData(user.uid, data, vaultCrypto.key, vaultCrypto.salt);

    if (!usesCloudStorage) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      void persistToCloud(dataRef.current);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data, usesCloudStorage, user, persistToCloud, vaultCrypto]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const uid = userRef.current?.uid;
      if (!uid || skipSaveRef.current || !vaultCrypto) return;
      void saveLocalFinanceData(uid, dataRef.current, vaultCrypto.key, vaultCrypto.salt);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void flushSave();
    };
  }, [flushSave, vaultCrypto]);

  const updateData = useCallback((updater: (prev: FinanceData) => FinanceData) => {
    setData((prev) => {
      const next = updater(prev);
      return { ...next, lastUpdated: new Date().toISOString() };
    });
  }, []);

  const commitReview = useCallback(() => {
    updateData((prev) => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      monthEndChecklist: {
        verifyBankLogs: false,
        confirmSipClearance: false,
        verifyBurnUnder30k: false,
        auditPolicyDates: false,
      },
    }));
  }, [updateData]);

  const toggleSosMode = useCallback(() => {
    updateData((prev) => ({ ...prev, sosMode: !prev.sosMode }));
  }, [updateData]);

  const retryCloudSync = useCallback(() => {
    if (user) void loadUserFinance(user.uid);
  }, [user, loadUserFinance]);

  const metrics = useMemo(
    () => deriveMetrics(data, config.emergencyFundTarget),
    [data, config.emergencyFundTarget]
  );

  const value = useMemo(
    () => ({
      data,
      metrics,
      config,
      saveStatus,
      usesCloudStorage,
      updateData,
      commitReview,
      toggleSosMode,
      retryCloudSync,
      flushSave,
    }),
    [
      data,
      metrics,
      config,
      saveStatus,
      usesCloudStorage,
      updateData,
      commitReview,
      toggleSosMode,
      retryCloudSync,
      flushSave,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return ctx;
}

export { DEFAULT_CONFIG } from "../../config";
