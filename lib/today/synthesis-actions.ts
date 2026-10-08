"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Enregistre (ou met à jour) la synthèse de fin de semaine du client. */
export async function saveWeeklySynthesis(formData: FormData): Promise<void> {
  const weekId = String(formData.get("weekId") ?? "");
  const response = String(formData.get("response") ?? "").trim();
  if (!weekId || !response) return;

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return;

  // Client non typé : les tables du Lot 1 ne sont pas encore dans les types générés.
  const db = client as unknown as SupabaseClient;

  const { data: existing } = await db
    .from("weekly_syntheses")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_id", weekId)
    .maybeSingle();

  if (existing) {
    await db
      .from("weekly_syntheses")
      .update({ response, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await db.from("weekly_syntheses").insert({ user_id: user.id, week_id: weekId, response });
  }

  revalidatePath("/bilan");
}
