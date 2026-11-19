import { createClient } from "@supabase/supabase-js";

// URL e chiave "anon" sono pubbliche per design: la sicurezza dei dati
// è garantita dalle policy RLS del database, non dal segreto della chiave.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://gybecigtxffoswpouwdx.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YmVjaWd0eGZmb3N3cG91d2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NjY1NjgsImV4cCI6MjExMDU0MjU2OH0.qqPLGbnhcQYK9CJgekLHUE-8yp5nsIz0_rr0I0Z-TNU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
