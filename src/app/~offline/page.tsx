import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fafafa] px-6 text-center dark:bg-[#0a0a0a]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#171717] text-2xl text-white">
        ₹
      </div>
      <div className="max-w-sm space-y-2">
        <h1 className="text-xl font-semibold text-[#171717] dark:text-white">
          You&apos;re offline
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">
          Personal Finance needs a connection to sync with the cloud. Your last
          saved data may still be available once you reopen the app.
        </p>
      </div>
      <Link
        href="/finance"
        className="rounded-2xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white hover:bg-[#171717]/90 dark:bg-white dark:text-[#171717] dark:hover:bg-white/90"
      >
        Try again
      </Link>
    </main>
  );
}
