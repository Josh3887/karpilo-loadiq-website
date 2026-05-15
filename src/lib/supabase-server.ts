import "server-only";

import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseProjectUrl(value: string | undefined) {
  if (!value) return value;

  try {
    return new URL(value.trim()).origin;
  } catch {
    return value;
  }
}

export function getSupabaseServer() {
  const supabaseUrl = normalizeSupabaseProjectUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serverKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(supabaseUrl, serverKey, {
    auth: {
      persistSession: false,
    },
  });
}
