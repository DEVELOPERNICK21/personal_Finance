import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

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
