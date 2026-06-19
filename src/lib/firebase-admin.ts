import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: Firestore | undefined;

function getFirebaseApp(): App {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  app =
    getApps()[0] ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });

  return app;
}

export function getAdminDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

function userFinancePath(uid: string): string {
  // Firestore doc paths must be collection/document pairs — store finance data on the user doc
  return `users/${uid}`;
}

export async function verifyIdToken(token: string): Promise<string> {
  const decoded = await getAuth(getFirebaseApp()).verifyIdToken(token);
  return decoded.uid;
}

export async function loadFinanceFromDb(uid: string): Promise<Record<string, unknown> | null> {
  const userDoc = await getAdminDb().doc(userFinancePath(uid)).get();
  if (userDoc.exists) return userDoc.data() ?? null;
  return null;
}

export async function saveFinanceToDb(
  uid: string,
  data: Record<string, unknown>
): Promise<void> {
  await getAdminDb().doc(userFinancePath(uid)).set(data, { merge: false });
}

export function isCloudStorageConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}
