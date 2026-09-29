import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client (sans session) vers le projet Supabase séparé de l'app
 * Re-Naissance Analyzer™. La clé utilisée est la clé publique (anon) de ce
 * projet — l'accès réel aux données est protégé par un jeton partagé,
 * vérifié à l'intérieur de la fonction RPC `rr_export_latest_bilan`.
 */
export function createAnalyzerClient() {
  return createSupabaseClient(process.env.ANALYZER_SUPABASE_URL!, process.env.ANALYZER_SUPABASE_ANON_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
