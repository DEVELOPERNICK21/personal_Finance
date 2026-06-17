"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import {
  setStoredAccessKey,
  verifyAccessKey,
} from "../lib/remote-storage";

interface AuthGateProps {
  onAuthenticated: () => void;
}

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) {
      setError("Enter your access key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const valid = await verifyAccessKey(key.trim());
      if (!valid) {
        setError("Invalid access key");
        return;
      }
      setStoredAccessKey(key.trim());
      onAuthenticated();
    } catch (err) {
      if (err instanceof Error && err.message === "CLOUD_NOT_CONFIGURED") {
        setError("Cloud storage is not configured. Add Firebase env vars on the server.");
      } else {
        setError("Could not verify access key. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Unlock Your Finance Dashboard</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your private access key to load and save your data securely in the cloud.
        </p>
        <div className="mt-6 space-y-4">
          <Field
            label="Access Key"
            value={key}
            onChange={setKey}
            placeholder="Your FINANCE_ACCESS_KEY"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button onClick={handleSubmit} className="w-full">
            {loading ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
