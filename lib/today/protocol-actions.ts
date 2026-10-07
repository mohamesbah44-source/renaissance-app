"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Enregistre l'usage ponctuel d'un protocole d'ancrage. Jamais compté, jamais noté. */
export async function recordProtocolUse(practiceKey: string, seconds: number): Promise<void> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return;

  // Client non typé : les tables du Lot 1 ne sont pas encore dans les types générés.
  const db = client as unknown as SupabaseClient;
  const duration = Math.max(0, Math.min(3600, Math.round(Number(seconds) || 0)));

  const { data: practice } = await db
    .from("practices")
    .select("id")
    .eq("key", practiceKey)
    .eq("category", "besoin")
    .maybeSingle();

  if (practice) {
    await db
      .from("protocol_uses")
      .insert({ user_id: user.id, practice_id: practice.id, duration_seconds: duration });
  }
}
