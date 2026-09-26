"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PILIERS, EVOLUTION_STATES, questionFieldName } from "@/lib/radar/constants";
import {
  computePillarScores,
  computeCercleScores,
  computeCapaciteScores,
  computeMetaIndicateurs,
  computeEtatDominant,
  computeFenetreTransformation,
  computeScoreCharge,
  computeScoreOuverture,
  computeScoreGlobal,
  computeTopPriorities,
} from "@/lib/radar/scoring";
import type { Json } from "@/lib/types/database.types";

export type RadarBilanFormState =
  | { success: true; id: string }
  | { success: false; error: string }
  | undefined;

/**
 * Lit les 60 réponses (1 à 5) du formulaire de session, recalcule
 * l'intégralité du bilan côté serveur (scoring.ts) et l'enregistre dans
 * `radar_bilans` (modèle 3 Cercles / 12 Piliers / 5 capacités / 4 méta-indicateurs).
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
  const cercleScores = computeCercleScores(pillarScores);
  const capaciteScores = computeCapaciteScores(answers);
  const metaIndicateurs = computeMetaIndicateurs(pillarScores, cercleScores, capaciteScores);

  const sR = computeScoreCharge(pillarScores);
  const aR = computeScoreOuverture(capaciteScores);
  const etat = computeEtatDominant(sR, aR);
  const topPriorities = computeTopPriorities(pillarScores);

  const { data, error } = await supabase
    .from("radar_bilans")
    .insert({
      user_id: user.id,
      etat,
      lune: EVOLUTION_STATES[etat].lune,
      fenetre_transformation: computeFenetreTransformation(capaciteScores),
      score_charge: sR,
      score_ouverture: aR,
      score_global: computeScoreGlobal(pillarScores),
      cercle_scores: cercleScores as unknown as Json,
      capacite_scores: capaciteScores as unknown as Json,
      meta_indicateurs: metaIndicateurs as unknown as Json,
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
