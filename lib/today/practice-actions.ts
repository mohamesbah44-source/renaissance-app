"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { todayISODate } from "@/lib/habits/streak";

export type PracticeMode = "morning" | "evening" | "sleep";

/** Enregistre une pratique terminée. Matin / soir : coche l'habitude. Sommeil : usage ponctuel, jamais compté. */
export async function completePractice(mode: PracticeMode, seconds: number): Promise<void> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return;

  // Client non typé : les tables du Lot 1 ne sont pas encore dans les types générés.
  const db = client as unknown as SupabaseClient;
  const duration = Math.max(0, Math.min(3600, Math.round(Number(seconds) || 0)));
  const key = mode === "morning" ? "morning_breath" : "evening_breath";

  if (mode === "sleep") {
    const { data: practice } = await db.from("practices").select("id").eq("key", key).maybeSingle();
    if (practice) {
      await db.from("protocol_uses").insert({ user_id: user.id, practice_id: practice.id, duration_seconds: duration });
    }
  } else {
    const { data: habit } = await db
      .from("habits")
      .select("id")
      .eq("user_id", user.id)
      .eq("system_key", key)
      .maybeSingle();
    if (habit) {
      await db
        .from("habit_logs")
        .upsert({ habit_id: habit.id, user_id: user.id, log_date: todayISODate() }, { onConflict: "habit_id,log_date" });
    }
  }

  revalidatePath("/aujourdhui");
  revalidatePath("/dashboard");
  revalidatePath("/habitudes");
}
