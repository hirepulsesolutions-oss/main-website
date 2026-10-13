import { createClient } from "@supabase/supabase-js";

// Server-side client for the contact API route. The publishable key is safe to expose; what it
// can do is limited by Row Level Security (see supabase/contact_submissions.sql).
export function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}
