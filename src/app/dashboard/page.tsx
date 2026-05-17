import { createServerClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // RLS makes this query safe — Postgres will only return the calling user's
  // row regardless of what the WHERE clause says.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .single();

  return (
    <div className="space-y-6 pt-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Session</h2>
        <p className="text-sm text-neutral-600">Email: {user?.email}</p>
        <p className="text-sm text-neutral-600">User ID: {user?.id}</p>
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Profile</h2>
        {error ? (
          <p className="text-sm text-red-600">No profile row yet (insert one in Supabase).</p>
        ) : (
          <pre className="overflow-auto rounded bg-neutral-100 p-2 text-xs">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
