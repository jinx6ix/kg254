import { createClient } from "@supabase/supabase-js";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Browser / client components — uses anon key, respects RLS
export function createBrowserClient() {
  return createClient(URL, ANON);
}

// Server / API routes — uses service role, bypasses RLS
export function createServerClient() {
  return createClient(URL, SVC, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
