import { NextResponse } from "next/server";
import { isCloudStorageConfigured } from "@/lib/firebase-admin";

export async function GET() {
  return NextResponse.json({
    cloudConfigured: isCloudStorageConfigured(),
    authMode: "firebase",
  });
}
