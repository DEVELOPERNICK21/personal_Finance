"use client";

import { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useVault } from "../providers/VaultProvider";

function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
      ? (error as { code: string }).code
      : null;

  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "Incorrect password. Try again.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Wait a moment and try again.";
  }
  return "Could not delete account. Please try again.";
}

export function AccountSettings() {
  const { user, signOut, deleteAccount } = useAuth();
  const { lock } = useVault();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      lock();
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Enter your password to confirm deletion.");
      return;
    }

    setDeleting(true);
    setError("");
    try {
      lock();
      await deleteAccount(password);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setPassword("");
    setError("");
  };

  return (
    <section className="space-y-3">
      <div>
        <h3 className="vault-label-md font-medium text-[var(--vault-on-surface)]">Account</h3>
        <p className="mt-0.5 vault-label-sm text-[var(--vault-outline)]">Signed in as {user.email}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)]">
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut || deleting}
          className="flex w-full items-center gap-3 px-4 py-3.5 vault-body-sm text-[var(--vault-on-surface)] hover:bg-[var(--vault-surface-container-low)] disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 text-[var(--vault-outline)]" strokeWidth={1.75} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>

        <div className="border-t border-[var(--vault-outline-variant)]/50">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={signingOut || deleting}
            className="flex w-full items-center gap-3 px-4 py-3.5 vault-body-sm text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            Delete account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[var(--vault-outline-variant)] bg-[var(--vault-surface)] p-5 shadow-xl">
            <h4 id="delete-account-title" className="vault-headline-sm font-medium text-red-600 dark:text-red-400">
              Delete account permanently?
            </h4>
            <p className="mt-2 vault-body-sm text-[var(--vault-on-surface-variant)]">
              This removes your encrypted vault, cloud sync data, and login. This cannot be undone.
            </p>

            <label className="mt-4 block">
              <span className="vault-label-sm text-[var(--vault-on-surface-variant)]">
                Confirm with your password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-lg border border-[var(--vault-outline-variant)] bg-[var(--vault-surface-container-lowest)] px-3 py-2.5 vault-body-sm outline-none focus:border-red-400"
                placeholder="Your password"
              />
            </label>

            {error && (
              <p className="mt-2 vault-label-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={deleting}
                className="rounded-lg border border-[var(--vault-outline-variant)] px-4 py-2.5 vault-label-md hover:bg-[var(--vault-surface-container-low)] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 vault-label-md text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
