/**
 * Sign-out handler.
 *
 * The "Sign out" form in the header posts here. Signing out through the
 * server-side client clears the session cookies via the same cookie adapter
 * the rest of the app uses, so the middleware treats the very next request as
 * anonymous. POST only: a GET endpoint could be triggered by any page that
 * embeds the URL in an <img> tag.
 */

import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  await supabase.auth.signOut();

  // 303 turns the POST into a GET of the landing page.
  return NextResponse.redirect(new URL("/", req.url), 303);
}
