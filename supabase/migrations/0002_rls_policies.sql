-- 0002_rls_policies.sql
--
-- Row-Level Security policies for `profiles`.
-- These run inside Postgres and are enforced regardless of what the API does.
-- Even if a route handler accidentally said SELECT *, Postgres will still
-- only return the calling user's row.

alter table public.profiles enable row level security;

-- READ: only your own row.
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- UPDATE: only your own row.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT: only as yourself. (The auth-user trigger inserts on signup with
-- elevated privileges; this policy guards client-driven inserts.)
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- DELETE: deliberately not allowed. Removing your profile means deleting your
-- auth.users row through Supabase's account-deletion flow, which cascades here.
