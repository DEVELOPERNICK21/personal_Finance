"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Circle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

type AuthMode = "signin" | "signup" | "reset";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4";

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LoginPage() {
  const { signIn, signUp, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    setMessage("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (mode !== "reset" && !password) {
      setError("Password is required");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Password requires at least 8 characters");
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

  const title =
    mode === "signin"
      ? "Welcome Back"
      : mode === "signup"
        ? "Create New Profile"
        : "Reset Password";

  const subtitle =
    mode === "signin"
      ? "Sign in to access your personal finance dashboard."
      : mode === "signup"
        ? "Input your basic details to begin the journey."
        : "Enter your email to receive a password reset link.";

  const heroTitle = mode === "signup" ? "Join Personal Finance" : "Personal Finance";
  const activeStep: number = mode === "signup" ? 1 : mode === "signin" ? 2 : 1;

  return (
    <main className="auth-page flex min-h-screen w-full bg-black text-white selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* Left column — hero */}
      <section className="relative hidden h-full w-[52%] flex-col items-center justify-end overflow-hidden rounded-3xl px-12 pb-32 shadow-2xl lg:flex">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        <motion.div
          className="relative z-10 w-full max-w-xs space-y-8"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={heroChildVariants} className="flex items-center gap-2">
            <Circle className="h-5 w-5 fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight">Personal Finance</span>
          </motion.div>

          <motion.div variants={heroChildVariants} className="space-y-3 text-center">
            <h1 className="whitespace-nowrap text-4xl font-medium tracking-tight">{heroTitle}</h1>
            <p className="px-4 text-sm leading-relaxed text-white/60">
              Follow these 3 quick phases to activate your space.
            </p>
          </motion.div>

          <motion.div variants={heroChildVariants} className="space-y-3">
            <StepItem number={1} text="Register your identity" active={activeStep === 1} />
            <StepItem number={2} text="Configure your dashboard" active={activeStep === 2} />
            <StepItem number={3} text="Finalize your profile" active={activeStep === 3} />
          </motion.div>
        </motion.div>
      </section>

      {/* Right column — form */}
      <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-12 lg:overflow-hidden lg:px-16 lg:py-6 xl:px-24">
        <motion.div
          className="w-full max-w-xl space-y-8 sm:space-y-10 lg:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 lg:hidden">
            <Circle className="h-5 w-5 fill-white text-white" />
            <span className="text-lg font-semibold tracking-tight">Personal Finance</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
            <p className="text-sm text-white/40">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputGroup
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            {mode !== "reset" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 pr-11 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 hover:text-white/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-white/30">Requires at least 8 symbols.</p>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-14 w-full rounded-xl bg-white font-semibold text-black hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Send Reset Email"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="text-white hover:underline"
                  onClick={() => switchMode("signup")}
                >
                  Create account
                </button>
                {" · "}
                <button
                  type="button"
                  className="text-white hover:underline"
                  onClick={() => switchMode("reset")}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                Member of the team?{" "}
                <button
                  type="button"
                  className="text-white hover:underline"
                  onClick={() => switchMode("signin")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function StepItem({
  number,
  text,
  active = false,
}: {
  number: number;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${
        active
          ? "border border-white bg-white text-black"
          : "border-none bg-brand-gray text-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          active ? "bg-black text-white" : "bg-white/10 text-white/40"
        }`}
      >
        {number}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function InputGroup({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
      />
    </div>
  );
}
