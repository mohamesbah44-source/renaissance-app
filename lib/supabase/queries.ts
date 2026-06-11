import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/lib/types/database.types";

/** Profil étendu de l'utilisateur courant (créé automatiquement à l'inscription). */
export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

/** Le ou la praticien·ne du programme, destinataire de la messagerie côté client. */
export async function getPractitioner(supabase: SupabaseClient<Database>): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("role", "admin").limit(1).maybeSingle();
  return data;
}
