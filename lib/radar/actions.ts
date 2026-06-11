"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PILIERS, EVOLUTION_STATES, questionFieldName } from "@/lib/radar/constants";
import {
  computePillarScores,
  computeEtatDominant,
  computeFenetreTransformation,
  computeScoreAlignement,
  computeScoreGlobal,
  computeScoreSurvie,
  computeTopPriorities,
} from "@/lib/radar/scoring";
import type { Json } from "@/lib/types/database.types";

export type RadarBilanFormState =
  | { success: true; id: string }
  | { success: false; error: string }
  | undefined;

/**
 * Lit les 40 réponses (1 à 5) du formulaire de session, recalcule l'intégralité
 * du bilan côté serveur (scoring.ts) et l'enregistre dans `radar_bilans`.
 */
export async function saveRadarBilan(
  _prevState: RadarBilanFormState,
  formData: FormData
): Promise<RadarBilanFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tu dois être connecté·e." };
  }

  const answers: Record<string, number> = {};

  for (const pilier of PILIERS) {
    for (const question of pilier.questions) {
      const raw = formData.get(questionFieldName(question));
      const value = Number(raw);

      if (typeof raw !== "string" || Number.isNaN(value) || value < 1 || value > 5) {
        return { success: false, error: "Merci de répondre à toutes les questions (de 1 à 5)." };
      }

      answers[question.id] = value;
    }
  }

  const pillarScores = computePillarScores(answers);
  const etat = computeEtatDominant(pillarScores);
  const topPriorities = computeTopPriorities(pillarScores);

  const { data, error } = await supabase
    .from("radar_bilans")
    .insert({
      user_id: user.id,
      etat,
      lune: EVOLUTION_STATES[etat].lune,
      fenetre_transformation: computeFenetreTransformation(pillarScores),
      score_survie: computeScoreSurvie(pillarScores),
      score_alignement: computeScoreAlignement(pillarScores),
      score_global: computeScoreGlobal(pillarScores),
      raw_answers: answers,
      pillar_scores: pillarScores as unknown as Json,
      top_priorities: topPriorities as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/radar");

  return { success: true, id: data.id };
}
