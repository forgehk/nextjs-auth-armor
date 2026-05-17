"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 pt-12">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {sent ? (
        <p className="rounded border border-green-200 bg-green-50 p-3 text-sm">
          Check your email for a sign-in link.
        </p>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded bg-black p-2 text-white">
            Send magic link
          </button>
        </form>
      )}
    </div>
  );
}
