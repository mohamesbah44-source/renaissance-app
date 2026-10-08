"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { PILIERS } from "@/lib/radar/constants";
import { programWeek, type Levels } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";

/** Enregistre (ou met à jour) le Radar express de la semaine en cours : 12 niveaux de 1 à 5. */
export async function saveRadarExpress(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const levels: Levels = {};
  for (const pilier of PILIERS) {
    const value = Number(formData.get(`p_${pilier.id}`));
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      redirect("/bilan");
    }
    levels[String(pilier.id)] = value;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();

  const weekNumber = programWeek(profile?.program_start_date, todayISODate(), profile?.current_week ?? 1);

  const db = supabase as unknown as SupabaseClient;
  await db.from("radar_express").upsert(
    {
      user_id: user.id,
      week_number: weekNumber,
      levels,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_number" }
  );

  revalidatePath("/bilan");
  redirect(`/bilan?semaine=${weekNumber}#radar`);
}
