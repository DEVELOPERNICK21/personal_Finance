import { NextRequest, NextResponse } from "next/server";
import {
  isCloudStorageConfigured,
  loadFinanceFromDb,
  saveFinanceToDb,
} from "@/lib/firebase-admin";
import type { FinanceData } from "@/features/personal-finance/types";

const ACCESS_KEY_HEADER = "authorization";

function verifyAccess(request: NextRequest): boolean {
  const expected = process.env.FINANCE_ACCESS_KEY;
  if (!expected) return false;

  const header = request.headers.get(ACCESS_KEY_HEADER);
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header;
  return token === expected;
}

export async function GET(request: NextRequest) {
  if (!isCloudStorageConfigured()) {
    return NextResponse.json(
      { error: "Cloud storage is not configured on the server." },
      { status: 503 }
    );
  }

  if (!verifyAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await loadFinanceFromDb();
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

  if (!verifyAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as FinanceData;
    await saveFinanceToDb(body as unknown as Record<string, unknown>);
    return NextResponse.json({ ok: true, lastUpdated: body.lastUpdated });
  } catch (error) {
    console.error("Failed to save finance data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
