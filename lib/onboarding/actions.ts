"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { todayISODate } from "@/lib/habits/streak";

function validScale(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= 5;
}

export async function completeOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;

  // Le premier check-in est facultatif : on l'enregistre seulement s'il est complet.
  const energy = Number(formData.get("energy"));
  const tension = Number(formData.get("tension"));
  if (validScale(energy) && validScale(tension)) {
    const today = todayISODate();
    const { data: existing } = await db
      .from("daily_checkins")
      .select("id")
      .eq("user_id", user.id)
      .eq("checkin_date", today)
      .maybeSingle();
    if (!existing) {
      await db.from("daily_checkins").insert({ user_id: user.id, checkin_date: today, energy, tension });
    }
  }

  await db.from("profiles").update({ onboarded_at: new Date().toISOString() }).eq("id", user.id);

  revalidatePath("/aujourdhui");
  redirect("/aujourdhui");
}
