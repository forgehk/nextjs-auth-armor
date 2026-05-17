/**
 * Honeypot-protected contact form handler.
 *
 * The form ships a hidden `website` field. Real users never see it (CSS hides
 * it, screen readers skip it via aria-hidden, autocomplete is off). Bots fill
 * every input they find. We silently 204 the bot — no error, no signal that
 * we caught them — and only process submissions where the honeypot is empty.
 *
 * In production you'd also rate-limit by IP and validate every field server-side.
 */

import { NextResponse } from "next/server";

const NAME_MAX = 100;
const EMAIL_MAX = 200;
const MESSAGE_MAX = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const form = await req.formData();

  // Honeypot: if a hidden field was filled, this is a bot. Return 204
  // (no content) so the bot thinks it succeeded and stops retrying.
  const honeypot = String(form.get("website") || "");
  if (honeypot.trim().length > 0) {
    return new NextResponse(null, { status: 204 });
  }

  const name = String(form.get("name") || "").trim().slice(0, NAME_MAX);
  const email = String(form.get("email") || "").trim().slice(0, EMAIL_MAX);
  const message = String(form.get("message") || "").trim().slice(0, MESSAGE_MAX);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  // Put your real handling here — DB insert, Slack notification, email forwarder, etc.
  console.log("contact form submission:", { name, email, message });

  return NextResponse.json({ ok: true });
}
