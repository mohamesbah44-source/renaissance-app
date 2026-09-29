"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchAnalyzerBilan, buildRadarBilanFromAnalyzer } from "@/lib/analyzer/import";
import { ANALYZER_PILLAR_KEY_TO_ID } from "@/lib/analyzer/mapping";
import type { Json } from "@/lib/types/database.types";

export type ImportAnalyzerState = { success?: boolean; error?: string; info?: string } | undefined;

/**
 * Importe le dernier bilan Re-Naissance Analyzer™ d'un membre (identifié par
 * son email) : crée un bilan Radar équivalent, et une entrée Carnet à
 * partir des patterns détectés en séance.
 */
export async function importAnalyzerBilan(
  _prevState: ImportAnalyzerState,
  formData: FormData
): Promise<ImportAnalyzerState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expirée. Reconnecte-toi." };
  }

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (caller?.role !== "admin") {
    return { error: "Action réservée à l'accompagnant·e." };
  }

  const clientId = formData.get("clientId");
  if (typeof clientId !== "string" || !clientId) {
    return { error: "Client introuvable." };
  }

  const { data: client } = await supabase.from("profiles").select("email").eq("id", clientId).maybeSingle();
  if (!client?.email) {
    return { error: "Ce membre n'a pas d'email enregistré." };
  }

  let payload;
  try {
    payload = await fetchAnalyzerBilan(client.email);
  } catch {
    return { error: "Impossible de joindre l'Analyzer. Réessaie dans un instant." };
  }

  if (!payload.found) {
    return { error: "Aucun client correspondant à cet email n'a été trouvé dans l'Analyzer." };
  }

  const bilanPayload = buildRadarBilanFromAnalyzer(clientId, payload);
  if (!bilanPayload) {
    return { error: "Ce client n'a pas encore de séance analysée dans l'Analyzer." };
  }

  const { error: insertError } = await supabase.from("radar_bilans").insert(bilanPayload);

  if (insertError) {
    if (insertError.code === "23505") {
      return { info: "Cette séance a déjà été importée." };
    }
    return { error: "Une erreur est survenue lors de l'import. Réessaie dans un instant." };
  }

  const detectedPatterns = payload.detected_patterns ?? [];
  if (detectedPatterns.length > 0 && payload.session) {
    const pilierIds = Array.from(
      new Set(
        detectedPatterns
          .flatMap((p) => p.pillars_concerned ?? [])
          .map((key) => ANALYZER_PILLAR_KEY_TO_ID[key])
          .filter((id): id is number => Boolean(id))
      )
    );

    await supabase.from("carnet_entries").insert({
      user_id: clientId,
      source: "analyzer",
      titre: payload.session.title,
      synthese: detectedPatterns.map((p) => `• ${p.description}`).join("\n"),
      hypotheses: detectedPatterns as unknown as Json,
      pilier_ids: pilierIds,
      published_by: user.id,
    });
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/radar");
  revalidatePath("/journal");

  return { success: true };
}
