import { NextRequest, NextResponse } from "next/server";
import {
  isCloudStorageConfigured,
  loadFinanceFromDb,
  saveFinanceToDb,
  verifyIdToken,
} from "@/lib/firebase-admin";
import type { FinanceData } from "@/features/personal-finance/core/domain/types";

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

export async function GET(request: NextRequest) {
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
    const data = await loadFinanceFromDb(uid);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to load finance data:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const body = (await request.json()) as FinanceData;
    await saveFinanceToDb(uid, body as unknown as Record<string, unknown>);
    return NextResponse.json({ ok: true, lastUpdated: body.lastUpdated });
  } catch (error) {
    console.error("Failed to save finance data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
