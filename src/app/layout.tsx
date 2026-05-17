import type { Metadata } from "next";
import Link from "next/link";

import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "nextjs-auth-armor",
  description: "Next.js + Supabase + RLS + security headers, hardened.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-bold">nextjs-auth-armor</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/">Home</Link>
              {user ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="rounded border px-3 py-1">Sign out</button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="rounded bg-black px-3 py-1 text-white">Sign in</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
