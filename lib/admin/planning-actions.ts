"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { parsePlanning } from "@/lib/admin/planning";

export type PlanningState = { success?: boolean; error?: string; message?: string } | undefined;

/**
 * Importe un planning collé (une ligne par rendez-vous). Un rendez-vous déjà
 * présent à la même date et heure est mis à jour (titre, durée) au lieu
 * d'être dupliqué, donc on peut recoller un planning corrigé sans risque.
 */
export async function importPlanning(_prev: PlanningState, formData: FormData): Promise<PlanningState> {
  const clientId = formData.get("clientId");
  const text = formData.get("planning");
  if (typeof clientId !== "string" || !clientId) return { error: "Participant·e introuvable." };
  if (typeof text !== "string" || !text.trim()) return { error: "Colle d'abord le planning." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée." };

  const db = supabase as unknown as SupabaseClient;
  const { data: me } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (me?.role !== "admin") return { error: "Réservé à l'administrateur." };

  const { lines, errors } = parsePlanning(text);
  if (errors.length > 0) return { error: errors.join(" ") };
  if (lines.length === 0) return { error: "Aucune ligne reconnue." };

  let created = 0;
  let updated = 0;

  for (const l of lines) {
    const { data: existing } = await db
      .from("appointments")
      .select("id")
      .eq("user_id", clientId)
      .eq("scheduled_at", l.scheduledAt)
      .maybeSingle();

    const payload = {
      user_id: clientId,
      scheduled_at: l.scheduledAt,
      session_type: l.sessionType,
      title: l.title,
      notes: l.notes,
      duration_minutes: l.durationMinutes,
    };

    if (existing?.id) {
      const { error } = await db.from("appointments").update({ ...payload, reminder_sent_at: null }).eq("id", existing.id);
      if (error) return { error: `Erreur à la mise à jour de « ${l.title} ».` };
      updated += 1;
    } else {
      const { error } = await db.from("appointments").insert(payload);
      if (error) return { error: `Erreur à l'enregistrement de « ${l.title} ».` };
      created += 1;
    }
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/calendrier");
  revalidatePath("/aujourdhui");

  return {
    success: true,
    message: `${created} rendez-vous créé${created > 1 ? "s" : ""}, ${updated} mis à jour.`,
  };
}
