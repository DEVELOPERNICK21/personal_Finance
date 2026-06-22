import { NextRequest, NextResponse } from "next/server";
import {
  deleteAuthUser,
  deleteUserFinanceFromDb,
  isCloudStorageConfigured,
  verifyIdToken,
} from "@/lib/firebase-admin";

async function getUidFromRequest(request: NextRequest): Promise<string | null> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;

  try {
    return await verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function DELETE(request: NextRequest) {
  if (!isCloudStorageConfigured()) {
    return NextResponse.json(
      { error: "Cloud storage is not configured on the server." },
      { status: 503 }
    );
  }

  const uid = await getUidFromRequest(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteUserFinanceFromDb(uid);
    await deleteAuthUser(uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
