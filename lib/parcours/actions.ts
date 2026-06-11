"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JournalingResponses } from "@/lib/types/database.types";

export type JournalingFormState = { success?: boolean; error?: string } | undefined;

/** Enregistre les réponses de journalisation d'une semaine, sans écraser les semaines précédentes. */
export async function saveJournalingResponses(
  _prevState: JournalingFormState,
  formData: FormData
): Promise<JournalingFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e pour enregistrer tes réflexions." };
  }

  const weekId = formData.get("weekId");
  if (typeof weekId !== "string" || !weekId) {
    return { error: "Semaine introuvable." };
  }

  const responses: JournalingResponses = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("prompt-") && typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        responses[key.slice("prompt-".length)] = trimmed;
      }
    }
  }

  const { data: existing } = await supabase
    .from("user_progress")
    .select("status, journaling_responses")
    .eq("user_id", user.id)
    .eq("week_id", weekId)
    .maybeSingle();

  const mergedResponses: JournalingResponses = {
    ...((existing?.journaling_responses as JournalingResponses | null) ?? {}),
    ...responses,
  };

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      week_id: weekId,
      journaling_responses: mergedResponses,
      status: existing?.status === "completed" ? "completed" : "in_progress",
    },
    { onConflict: "user_id,week_id" }
  );

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath(`/parcours/semaine/${weekId}`);
  revalidatePath("/parcours");
  revalidatePath("/dashboard");

  return { success: true };
}

/** Marque une semaine comme terminée et fait avancer la semaine en cours si besoin. */
export async function markWeekComplete(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const weekId = formData.get("weekId");
  const weekNumberRaw = formData.get("weekNumber");

  if (typeof weekId !== "string" || typeof weekNumberRaw !== "string") return;

  const weekNumber = Number(weekNumberRaw);

  await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      week_id: weekId,
      status: "completed",
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_id" }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("current_week")
    .eq("id", user.id)
    .single();

  if (profile && profile.current_week === weekNumber && weekNumber < 8) {
    await supabase.from("profiles").update({ current_week: weekNumber + 1 }).eq("id", user.id);
  }

  revalidatePath(`/parcours/semaine/${weekId}`);
  revalidatePath("/parcours");
  revalidatePath("/dashboard");
}
