import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this file from a "use client" component —
// it holds the service role key, which bypasses Row Level Security.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminConfigured = Boolean(url && serviceKey);

export const supabaseAdmin = supabaseAdminConfigured
  ? createClient(url as string, serviceKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
