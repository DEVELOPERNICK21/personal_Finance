import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { clearLocalFinanceData } from "./finance-repository";

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

export function mapAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

export function isAuthConfigured(): boolean {
  return isFirebaseClientConfigured();
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void): () => void {
  if (!isFirebaseClientConfigured()) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    callback(user ? mapAuthUser(user) : null);
  });
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return mapAuthUser(credential.user);
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  return mapAuthUser(credential.user);
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!isFirebaseClientConfigured()) return null;
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export async function deleteUserAccount(password: string): Promise<void> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user?.email) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  const uid = user.uid;
  const token = await user.getIdToken(true);
  const response = await fetch("/api/account", {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 503) {
    await deleteUser(user);
  } else if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "DELETE_FAILED");
  }

  clearLocalFinanceData(uid);
  await signOut(auth);
}
