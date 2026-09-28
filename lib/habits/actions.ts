"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HABIT_SUGGESTIONS } from "@/lib/habits/constants";

export type GenerateHabitsState = { success?: boolean; error?: string; addedCount?: number } | undefined;

/**
 * Génère des habitudes suggérées à partir des 3 zones prioritaires
 * (top_priorities) du dernier bilan Radar du membre connecté — sans
 * dupliquer une habitude déjà active sur le même pilier.
 */
export async function generateSuggestedHabits(prevState: GenerateHabitsState): Promise<GenerateHabitsState> {
  void prevState;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expirée. Reconnecte-toi." };
  }

  const { data: bilan } = await supabase
    .from("radar_bilans")
    .select("top_priorities")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const topPriorities = (bilan?.top_priorities as { pilierId: number; ratio: number }[] | null) ?? [];

  if (topPriorities.length === 0) {
    return { error: "Fais d'abord un bilan Radar pour obtenir des suggestions personnalisées." };
  }

  const { data: existing } = await supabase
    .from("habits")
    .select("pilier_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const existingPilierIds = new Set((existing ?? []).map((h) => h.pilier_id));

  const toInsert = topPriorities
    .filter((p) => !existingPilierIds.has(p.pilierId) && HABIT_SUGGESTIONS[p.pilierId])
    .map((p) => ({
      user_id: user.id,
      pilier_id: p.pilierId,
      titre: HABIT_SUGGESTIONS[p.pilierId],
      source: "auto" as const,
    }));

  if (toInsert.length === 0) {
    return { error: "Tes habitudes actuelles couvrent déjà tes zones prioritaires." };
  }

  const { error } = await supabase.from("habits").insert(toInsert);

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/habitudes");
  revalidatePath("/dashboard");

  return { success: true, addedCount: toInsert.length };
}

/** Coche ou décoche l'habitude pour aujourd'hui (toggle). */
export async function toggleHabitToday(formData: FormData): Promise<void> {
  const habitId = formData.get("habitId");
  if (typeof habitId !== "string" || !habitId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);

  const { data: existingLog } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("log_date", today)
    .maybeSingle();

  if (existingLog) {
    await supabase.from("habit_logs").delete().eq("id", existingLog.id);
  } else {
    await supabase.from("habit_logs").insert({ habit_id: habitId, user_id: user.id, log_date: today });
  }

  revalidatePath("/habitudes");
  revalidatePath("/dashboard");
}

/** Désactive une habitude (le membre arrête de la suivre, sans perdre son historique). */
export async function archiveHabit(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await supabase.from("habits").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/habitudes");
  revalidatePath("/dashboard");
}

export type AdminHabitFormState = { success?: boolean; error?: string } | undefined;

/** Ajoute manuellement une habitude pour un client donné, depuis l'admin. */
export async function adminAddHabit(
  _prevState: AdminHabitFormState,
  formData: FormData
): Promise<AdminHabitFormState> {
  const supabase = await createClient();

  const clientId = formData.get("clientId");
  const pilierId = formData.get("pilierId");
  const titre = formData.get("titre");

  if (typeof clientId !== "string" || !clientId) {
    return { error: "Client introuvable." };
  }
  if (typeof titre !== "string" || !titre.trim()) {
    return { error: "Le titre de l'habitude est requis." };
  }
  const pilierIdNumber = typeof pilierId === "string" ? Number(pilierId) : NaN;
  if (!Number.isInteger(pilierIdNumber) || pilierIdNumber < 1 || pilierIdNumber > 12) {
    return { error: "Pilier invalide." };
  }

  const { error } = await supabase.from("habits").insert({
    user_id: clientId,
    pilier_id: pilierIdNumber,
    titre: titre.trim(),
    source: "manuel",
  });

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath(`/admin/clients/${clientId}`);

  return { success: true };
}

/** Active/désactive une habitude depuis l'admin. */
export async function adminSetHabitActive(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id");
  const clientId = formData.get("clientId");
  const isActive = formData.get("isActive") === "true";
  if (typeof id !== "string" || !id) return;

  await supabase.from("habits").update({ is_active: !isActive, updated_at: new Date().toISOString() }).eq("id", id);

  if (typeof clientId === "string" && clientId) {
    revalidatePath(`/admin/clients/${clientId}`);
  }
}

/** Supprime définitivement une habitude depuis l'admin. */
export async function adminDeleteHabit(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id");
  const clientId = formData.get("clientId");
  if (typeof id !== "string" || !id) return;

  await supabase.from("habits").delete().eq("id", id);

  if (typeof clientId === "string" && clientId) {
    revalidatePath(`/admin/clients/${clientId}`);
  }
}
