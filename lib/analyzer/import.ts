import { createAnalyzerClient } from "@/lib/analyzer/client";
import { ANALYZER_PILLAR_KEY_TO_ID, ANALYZER_CAPACITY_KEYS, type AnalyzerBilanPayload } from "@/lib/analyzer/mapping";
import { PILIERS, CAPACITES, type CapaciteId } from "@/lib/radar/constants";
import {
  computeCercleScores,
  computeMetaIndicateurs,
  computeEtatDominant,
  computeScoreCharge,
  computeScoreOuverture,
  computeScoreGlobal,
  computeFenetreTransformation,
  computeTopPriorities,
  type PillarScore,
  type CapaciteScores,
} from "@/lib/radar/scoring";
import { EVOLUTION_STATES } from "@/lib/radar/constants";
import type { Database, Json } from "@/lib/types/database.types";

/** Interroge la passerelle Re-Naissance Analyzer™ pour le dernier bilan d'un client, par email. */
export async function fetchAnalyzerBilan(email: string): Promise<AnalyzerBilanPayload> {
  const analyzer = createAnalyzerClient();

  const { data, error } = await analyzer.rpc("rr_export_latest_bilan", {
    p_email: email,
    p_token: process.env.ANALYZER_INTEGRATION_TOKEN,
  });

  if (error) {
    throw new Error("Impossible de joindre l'Analyzer. Réessaie dans un instant.");
  }

  return (data as AnalyzerBilanPayload) ?? { found: false };
}

export type RadarBilanInsert = Database["public"]["Tables"]["radar_bilans"]["Insert"];

/**
 * Convertit le dernier bilan Analyzer (scores 0-10, orientés ressource) en
 * un bilan Radar Re-Naissance™ (tension 0-1), en réutilisant exactement les
 * mêmes formules que le questionnaire pour rester comparables.
 */
export function buildRadarBilanFromAnalyzer(userId: string, payload: AnalyzerBilanPayload): RadarBilanInsert | null {
  if (!payload.found || !payload.session || !payload.pillar_scores || payload.pillar_scores.length === 0) {
    return null;
  }

  const valuesByPillar = new Map<number, Partial<Record<CapaciteId, number>>>();
  for (const row of payload.pillar_scores) {
    const pilierId = ANALYZER_PILLAR_KEY_TO_ID[row.pillar_key];
    if (!pilierId || row.value === null) continue;
    const entry = valuesByPillar.get(pilierId) ?? {};
    entry[row.capacity_key] = Number(row.value);
    valuesByPillar.set(pilierId, entry);
  }

  const pillarScores: PillarScore[] = PILIERS.map((pilier) => {
    const values = valuesByPillar.get(pilier.id);
    const present = values ? ANALYZER_CAPACITY_KEYS.filter((c) => values[c] !== undefined) : [];
    const count = present.length;

    if (count === 0) {
      return { pilierId: pilier.id, total: 0, count: 0, max: 0, ratio: 0 };
    }

    // Ressource moyenne (0-10) -> tension (0-1) : plus la ressource est
    // haute, moins le pilier demande d'attention.
    const avgResource = present.reduce((sum, c) => sum + (values![c] ?? 0), 0) / count;
    const ratio = 1 - avgResource / 10;

    return { pilierId: pilier.id, total: Math.round(ratio * count * 10), count, max: count * 10, ratio };
  });

  const capaciteScores: CapaciteScores = {} as CapaciteScores;
  for (const capacite of CAPACITES) {
    const values = PILIERS.map((p) => valuesByPillar.get(p.id)?.[capacite.id]).filter(
      (v): v is number => v !== undefined
    );
    capaciteScores[capacite.id] = values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length / 10 : 0;
  }

  const cercleScores = computeCercleScores(pillarScores);
  const metaIndicateurs = computeMetaIndicateurs(pillarScores, cercleScores, capaciteScores);
  const scoreCharge = computeScoreCharge(pillarScores);
  const scoreOuverture = computeScoreOuverture(capaciteScores);
  const scoreGlobal = computeScoreGlobal(pillarScores);
  const fenetreTransformation = computeFenetreTransformation(capaciteScores);
  const etat = computeEtatDominant(scoreCharge, scoreOuverture);
  const topPriorities = computeTopPriorities(pillarScores);

  return {
    user_id: userId,
    etat,
    lune: EVOLUTION_STATES[etat].lune,
    fenetre_transformation: fenetreTransformation,
    score_charge: scoreCharge,
    score_ouverture: scoreOuverture,
    score_global: scoreGlobal,
    cercle_scores: cercleScores,
    capacite_scores: capaciteScores,
    meta_indicateurs: metaIndicateurs as unknown as Json,
    raw_answers: { source: "analyzer", session: payload.session, pillar_scores: payload.pillar_scores } as unknown as Json,
    pillar_scores: pillarScores as unknown as Json,
    top_priorities: topPriorities as unknown as Json,
    source: "analyzer",
    analyzer_session_id: payload.session.id,
  };
}
