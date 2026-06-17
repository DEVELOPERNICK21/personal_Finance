"use client";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { useAuth } from "../providers/AuthProvider";

type AuthMode = "signin" | "signup" | "reset";

export function LoginPage() {
  const { signIn, signUp, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (mode !== "reset" && !password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
      } else if (mode === "signup") {
        await signUp(email.trim(), password);
        setMessage("Account created. You are now signed in.");
      } else {
        await sendPasswordReset(email.trim());
        setMessage("Password reset email sent. Check your inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card
        title={mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Reset Password"}
        icon="🔐"
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {mode === "reset"
              ? "Enter your email to receive a password reset link."
              : "Sign in with your email to access your finance dashboard."}
          </p>
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
          {mode !== "reset" && (
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-accent-success">{message}</p>}
          <Button onClick={handleSubmit} className="w-full">
            {loading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Email"}
          </Button>
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            {mode !== "signin" && (
              <button type="button" className="hover:text-foreground" onClick={() => setMode("signin")}>
                Back to sign in
              </button>
            )}
            {mode === "signin" && (
              <>
                <button type="button" className="hover:text-foreground" onClick={() => setMode("signup")}>
                  Create account
                </button>
                <button type="button" className="hover:text-foreground" onClick={() => setMode("reset")}>
                  Forgot password?
                </button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
