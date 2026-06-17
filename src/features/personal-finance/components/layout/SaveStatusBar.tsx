"use client";

import type { SaveStatus } from "../../context/FinanceProvider";
import { Button } from "../ui/Button";

interface SaveStatusBarProps {
  status: SaveStatus;
  usesCloudStorage: boolean;
  onRetry: () => void;
}

const STATUS_LABELS: Record<SaveStatus, string> = {
  idle: "Ready",
  loading: "Loading...",
  saving: "Saving...",
  saved: "All changes saved",
  error: "Save failed",
  offline: "Local only (not synced)",
};

export function SaveStatusBar({ status, usesCloudStorage, onRetry }: SaveStatusBarProps) {
  const color =
    status === "saved"
      ? "text-emerald-400"
      : status === "error"
        ? "text-red-400"
        : status === "saving"
          ? "text-yellow-400"
          : "text-zinc-500";

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`font-medium ${color}`}>{STATUS_LABELS[status]}</span>
        {usesCloudStorage && status === "saved" && (
          <span className="text-zinc-600">· synced to cloud</span>
        )}
        {!usesCloudStorage && (
          <span className="text-zinc-600">· configure Firebase env vars for cloud save</span>
        )}
      </div>
      {status === "error" && (
        <Button variant="secondary" className="!py-1 !px-2 text-xs" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
