import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const FINANCE_DOC_PATH = "personalFinance/main";

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

export async function loadFinanceFromDb(): Promise<Record<string, unknown> | null> {
  const snapshot = await getAdminDb().doc(FINANCE_DOC_PATH).get();
  if (!snapshot.exists) return null;
  return snapshot.data() ?? null;
}

export async function saveFinanceToDb(data: Record<string, unknown>): Promise<void> {
  await getAdminDb().doc(FINANCE_DOC_PATH).set(data, { merge: false });
}

export function isCloudStorageConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}
