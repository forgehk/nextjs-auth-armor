"use client";

import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", { method: "POST", body: data });
    if (res.status === 204 || res.ok) {
      setState("sent");
      e.currentTarget.reset();
      return;
    }
    setState("error");
    try {
      const body = await res.json();
      setError(body?.error || "Something went wrong.");
    } catch {
      setError("Something went wrong.");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded border border-green-200 bg-green-50 p-3 text-sm">
        Thanks — we'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-3">
      <input name="name" placeholder="Your name" required className="w-full rounded border p-2" />
      <input name="email" type="email" placeholder="you@example.com" required className="w-full rounded border p-2" />
      <textarea name="message" rows={4} placeholder="What's up?" required className="w-full rounded border p-2" />

      {/* HONEYPOT — humans never see this; bots fill it. */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {state === "sending" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
