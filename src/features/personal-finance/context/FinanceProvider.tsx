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
import { createFinanceConfig } from "../config";
import { calculateMetrics } from "../lib/calculations";
import { DEFAULT_FINANCE_DATA } from "../lib/defaults";
import {
  fetchFinanceData,
  getStoredAccessKey,
  persistFinanceData,
} from "../lib/remote-storage";
import { loadFinanceData, saveFinanceData } from "../lib/storage";
import type { FinanceConfig, FinanceData, FinanceMetrics } from "../types";

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error" | "offline";

interface FinanceContextValue {
  data: FinanceData;
  metrics: FinanceMetrics;
  config: FinanceConfig;
  saveStatus: SaveStatus;
  isAuthenticated: boolean;
  usesCloudStorage: boolean;
  updateData: (updater: (prev: FinanceData) => FinanceData) => void;
  commitReview: () => void;
  toggleSosMode: () => void;
  retryCloudSync: () => void;
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
  const config = useMemo(
    () => createFinanceConfig(configOverrides),
    [configOverrides]
  );

  const [data, setData] = useState<FinanceData>(() => initialData ?? DEFAULT_FINANCE_DATA);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    initialData ? "saved" : "loading"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialData));
  const [usesCloudStorage, setUsesCloudStorage] = useState(false);
  const skipSaveRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);

  const loadFromCloud = useCallback(async () => {
    const hasKey = Boolean(getStoredAccessKey());
    if (!hasKey) {
      setData(loadFinanceData());
      setSaveStatus("offline");
      setIsAuthenticated(false);
      setUsesCloudStorage(false);
      return;
    }

    setSaveStatus("loading");
    try {
      const remote = await fetchFinanceData();
      setUsesCloudStorage(true);
      setIsAuthenticated(true);

      if (remote) {
        const merged = { ...DEFAULT_FINANCE_DATA, ...remote };
        setData(merged);
        saveFinanceData(merged);
      } else {
        const local = loadFinanceData();
        setData(local);
        await persistFinanceData(local);
      }

      setSaveStatus("saved");
    } catch (error) {
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        setIsAuthenticated(false);
        setUsesCloudStorage(false);
        setData(loadFinanceData());
        setSaveStatus("offline");
        return;
      }

      if (error instanceof Error && error.message === "CLOUD_NOT_CONFIGURED") {
        setUsesCloudStorage(false);
        setIsAuthenticated(true);
        setData(loadFinanceData());
        setSaveStatus("offline");
        return;
      }

      setData(loadFinanceData());
      setSaveStatus("error");
    }
  }, []);

  useEffect(() => {
    if (initialData) return;
    queueMicrotask(() => {
      void loadFromCloud();
    });
  }, [initialData, loadFromCloud]);

  useEffect(() => {
    skipSaveRef.current = false;
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (skipSaveRef.current) return;

    saveFinanceData(data);

    if (!usesCloudStorage || !isAuthenticated) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saving");
      void persistFinanceData(dataRef.current)
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("error"));
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data, usesCloudStorage, isAuthenticated]);

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
    void loadFromCloud();
  }, [loadFromCloud]);

  const metrics = useMemo(
    () => calculateMetrics(data, config.emergencyFundTarget),
    [data, config.emergencyFundTarget]
  );

  const value = useMemo(
    () => ({
      data,
      metrics,
      config,
      saveStatus,
      isAuthenticated,
      usesCloudStorage,
      updateData,
      commitReview,
      toggleSosMode,
      retryCloudSync,
    }),
    [
      data,
      metrics,
      config,
      saveStatus,
      isAuthenticated,
      usesCloudStorage,
      updateData,
      commitReview,
      toggleSosMode,
      retryCloudSync,
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

export { DEFAULT_CONFIG } from "../config";
