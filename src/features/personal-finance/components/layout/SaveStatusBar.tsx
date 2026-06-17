"use client";

import type { SaveStatus } from "../../presentation/providers/FinanceProvider";
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
      ? "text-accent-success"
      : status === "error"
        ? "text-accent-danger"
        : status === "saving"
          ? "text-accent-warning"
          : "text-muted";

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`font-medium ${color}`}>{STATUS_LABELS[status]}</span>
        {usesCloudStorage && status === "saved" && (
          <span className="text-muted">· synced to cloud</span>
        )}
        {!usesCloudStorage && (
          <span className="text-muted">· configure Firebase env vars for cloud save</span>
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
