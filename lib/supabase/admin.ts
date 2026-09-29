import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

/**
 * Client Supabase avec la clé de service (service_role) : contourne la RLS
 * et donne accès à l'API Admin (création d'utilisateurs, invitations).
 * Réservé aux actions serveur déclenchées par un·e admin — ne jamais
 * exposer ce client ou sa clé côté navigateur.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
