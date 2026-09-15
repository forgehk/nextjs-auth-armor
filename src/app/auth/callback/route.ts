/**
 * Magic-link callback.
 *
 * Supabase sends the user here from the sign-in email with a one-time `code`.
 * Exchanging it sets the session cookies, after which the middleware will let
 * the user through to protected routes.
 */

import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

/**
 * Only same-origin, non-protocol-relative paths are accepted as a redirect
 * target. `next` arrives in a link sent by email, so treating it as trusted
 * would turn the sign-in flow into an open redirect.
 */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const next = safeNext(searchParams.get("next"));

  // Supabase reports a rejected or expired link with error params, not a code.
  const errorDescription = searchParams.get("error_description");
  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription)}`
    );
  }

  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
