"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useVault } from "../providers/VaultProvider";

export function VaultUnlockPage() {
  const { status, unlock, setup, error, clearError } = useVault();
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSetup = status === "setup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isSetup && passphrase !== confirm) {
      return;
    }

    setLoading(true);
    try {
      if (isSetup) {
        await setup(passphrase);
      } else {
        await unlock(passphrase);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSetup ? "Create your vault" : "Unlock your vault"}
            </h1>
            <p className="text-sm text-white/50">
              {isSetup
                ? "Your finance data is encrypted on this device before it reaches the cloud."
                : "Enter your vault passphrase to decrypt your financial data."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-brand-gray p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Vault passphrase</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type={showPass ? "text" : "password"}
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="h-11 w-full rounded-xl border-none bg-black/40 py-2 pr-11 pl-10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40"
                aria-label={showPass ? "Hide passphrase" : "Show passphrase"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSetup && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm passphrase</label>
              <input
                type={showPass ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat passphrase"
                className="h-11 w-full rounded-xl border-none bg-black/40 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
              {confirm && passphrase !== confirm && (
                <p className="text-xs text-rose-400">Passphrases do not match.</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || (isSetup && passphrase !== confirm)}
            className="h-12 w-full rounded-xl bg-white font-semibold text-black hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "Please wait…" : isSetup ? "Create encrypted vault" : "Unlock"}
          </button>
        </form>

        <p className="text-center text-xs leading-relaxed text-white/35">
          End-to-end encrypted with AES-256-GCM. We cannot recover your passphrase if you lose it —
          store it somewhere safe, separate from your login password.
        </p>
      </motion.div>
    </main>
  );
}
