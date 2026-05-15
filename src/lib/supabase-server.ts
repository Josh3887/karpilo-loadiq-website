import "server-only";

import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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
