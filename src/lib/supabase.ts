import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

function normalizeSupabaseProjectUrl(value: string | undefined) {
  if (!value) return value;

  try {
    return new URL(value.trim()).origin;
  } catch {
    return value;
  }
}

type SupabaseBrowserConfig = {
  url?: string;
  key?: string;
};

let supabaseBrowserClient: SupabaseClient | null = null;

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig {
  return {
    url: normalizeSupabaseProjectUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    key:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasSupabaseBrowserConfig() {
  const { url, key } = getSupabaseBrowserConfig();
  return Boolean(url && key);
}

export function getSupabaseBrowserClient() {
  const { url, key } = getSupabaseBrowserConfig();

  if (!url || !key) {
    return null;
  }

  supabaseBrowserClient ??= createClient(url, key);
  return supabaseBrowserClient;
}
