# nextjs-auth-armor

> A Next.js 14 App Router starter with Supabase auth, Row-Level Security policies, honeypot-protected forms, and a proper security-header middleware. The stack I actually ship at DarkForge AI, hardened.

[![Next.js](https://img.shields.io/badge/Next.js-14-000000.svg)]() [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)]() [![Supabase](https://img.shields.io/badge/Supabase-Auth_%2B_RLS-3FCF8E.svg)]() [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What this is

Most Next.js starters skip the boring-but-load-bearing stuff:

- **Auth that works on both server and client components** (this matters a lot in App Router).
- **Row-Level Security policies** so the database actually enforces who can see what — not just the app layer.
- **Security headers** wired into `middleware.ts` (HSTS, CSP, XCTO, XFO, Referrer-Policy, Permissions-Policy).
- **Honeypot-protected contact forms** that block 99% of spam bots without a third-party captcha.
- **Server actions** for the things they're actually good at (mutations) and **route handlers** for the things they're not (file uploads, public APIs).

`nextjs-auth-armor` ships all of that as a working starter you can `git clone`, `npm install`, and have running in under five minutes.

---

## What's inside

```
.
├── middleware.ts                  # Security headers + auth redirect logic
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout w/ session-aware nav
│   │   ├── page.tsx               # Public landing
│   │   ├── login/page.tsx         # Email magic-link or password login
│   │   ├── dashboard/page.tsx     # Protected route (RSC reads user profile)
│   │   └── api/contact/route.ts   # Honeypot-protected contact form handler
│   ├── components/ContactForm.tsx # Form with hidden honeypot field
│   └── lib/
│       ├── supabase/server.ts     # Server-side Supabase client (RSC, route handlers)
│       └── supabase/client.ts     # Client-side Supabase client (browser)
├── supabase/migrations/
│   ├── 0001_profiles_table.sql    # Profiles table linked to auth.users
│   └── 0002_rls_policies.sql      # RLS: users can read/update only their own row
└── package.json
```

---

## Hardened in three places

### 1. Middleware: security headers + auth gate

```ts
// middleware.ts
const headers = new Headers(req.headers);

const response = NextResponse.next({ request: { headers } });

response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
response.headers.set("Content-Security-Policy", "default-src 'self'; ...");
response.headers.set("X-Content-Type-Options", "nosniff");
response.headers.set("X-Frame-Options", "DENY");
response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

if (isProtected(req) && !session) return NextResponse.redirect(loginUrl);
return response;
```

### 2. Postgres: RLS policies in version-controlled SQL

```sql
-- 0002_rls_policies.sql
alter table profiles enable row level security;

create policy "users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

Even if a bug in the app layer leaked a `SELECT * FROM profiles`, Supabase would still only return the calling user's row.

### 3. Honeypot contact form

```tsx
<form action="/api/contact" method="POST">
  <input name="name" required />
  <input name="email" type="email" required />
  <textarea name="message" required />

  {/* Honeypot: hidden from real users, irresistible to dumb bots. */}
  <input
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden
    className="absolute -left-[10000px]"
  />
  <button>Send</button>
</form>
```

Server-side, the route handler rejects any submission where `website` is non-empty. No third-party captcha required, no user friction.

---

## Quick start

```bash
git clone https://github.com/forgehk/nextjs-auth-armor
cd nextjs-auth-armor
cp .env.example .env.local           # fill in your Supabase URL + anon key
npm install
npx supabase db push                  # apply migrations to your project
npm run dev
```

Then visit http://localhost:3000.

---

## Why I built this

I ship Next.js + Supabase platforms at [DarkForge AI](https://darkforgeai.com). After the third project I noticed the same hardening steps every time — security headers, RLS policies, honeypot forms, auth on both sides of the server/client boundary. This is that checklist as a starter template.

It's also a useful interview artifact: it concretely demonstrates **AppSec** instincts (defense-in-depth, server-side input validation, headers as policy) without being a toy security demo.

---

## Roadmap

- [x] Supabase email/password + magic link auth
- [x] RLS migrations
- [x] Security-header middleware
- [x] Honeypot contact form
- [x] Server-side session validation
- [ ] Stripe subscription billing
- [ ] Optional 2FA (TOTP via Supabase)
- [ ] Audit-log table + Postgres trigger
- [ ] Built-in dark mode

---

## License

[MIT](LICENSE)

---

*Built by [@forgehk](https://github.com/forgehk) — [DarkForge AI](https://darkforgeai.com)*
