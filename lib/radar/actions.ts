"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RADAR_DIMENSIONS, type RadarDimensionKey } from "@/lib/radar/constants";
import type { RadarPhase } from "@/lib/types/database.types";

export type RadarFormState = { success?: boolean; error?: string } | undefined;

const VALID_PHASES: RadarPhase[] = ["before", "week4", "week8"];

/** Enregistre (ou met à jour) une réponse au Radar Renaissance™ pour une étape donnée. */
export async function saveRadarAssessment(
  _prevState: RadarFormState,
  formData: FormData
): Promise<RadarFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const phase = formData.get("phase");
  if (typeof phase !== "string" || !VALID_PHASES.includes(phase as RadarPhase)) {
    return { error: "Étape invalide." };
  }

  const scores = {} as Record<RadarDimensionKey, number>;
  for (const dimension of RADAR_DIMENSIONS) {
    const raw = formData.get(dimension.key);
    const value = Number(raw);

    if (typeof raw !== "string" || Number.isNaN(value) || value < 1 || value > 10) {
      return { error: "Merci de répondre à chaque question entre 1 et 10." };
    }

    scores[dimension.key] = value;
  }

  const { error } = await supabase.from("radar_assessments").upsert(
    {
      user_id: user.id,
      phase: phase as RadarPhase,
      ...scores,
    },
    { onConflict: "user_id,phase" }
  );

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/radar");
  revalidatePath("/dashboard");

  return { success: true };
}
