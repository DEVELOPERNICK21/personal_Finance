"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  deleteUserAccount,
  isAuthConfigured,
  resetPassword,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeToAuth,
  type AuthUser,
} from "../../infrastructure/auth-repository";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const isConfigured = isAuthConfigured();

  useEffect(() => {
    if (!isConfigured) {
      queueMicrotask(() => setStatus("unauthenticated"));
      return;
    }
    return subscribeToAuth((authUser) => {
      setUser(authUser);
      setStatus(authUser ? "authenticated" : "unauthenticated");
    });
  }, [isConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmail(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await signUpWithEmail(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    await deleteUserAccount(password);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await resetPassword(email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isConfigured,
      signIn,
      signUp,
      signOut,
      deleteAccount,
      sendPasswordReset,
    }),
    [user, status, isConfigured, signIn, signUp, signOut, deleteAccount, sendPasswordReset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
