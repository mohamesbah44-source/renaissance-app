import { PILIERS } from "@/lib/radar/constants";
import type { EtatDominant } from "@/lib/types/database.types";

export interface PillarScore {
  pilierId: number;
  total: number;
  count: number;
  max: number;
  ratio: number;
}

export interface TopPriority {
  pilierId: number;
  ratio: number;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calcule le score (total/count/max/ratio) de chaque pilier à partir des
 * réponses brutes (1 à 5, indexées par id de question "<pilierId>-<n>").
 * Inversion : si la question est `inv` et le pilier de type "survie",
 * la valeur retenue est `6 - rep`.
 */
export function computePillarScores(answers: Record<string, number>): PillarScore[] {
  return PILIERS.map((pilier) => {
    let total = 0;
    let count = 0;

    for (const question of pilier.questions) {
      const rep = answers[question.id];
      if (rep === undefined) continue;

      const val = question.inv && pilier.type === "survie" ? 6 - rep : rep;
      total += val;
      count += 1;
    }

    const max = count * 5;
    const ratio = max > 0 ? total / max : 0;

    return { pilierId: pilier.id, total, count, max, ratio };
  });
}

function ratioOf(pillarScores: PillarScore[], pilierId: number): number {
  return pillarScores.find((p) => p.pilierId === pilierId)?.ratio ?? 0;
}

/**
 * État dominant : SURVIE / ADAPTATION / ALIGNEMENT / EXPANSION.
 * sR = moyenne des ratios des piliers 1 à 6 (survie)
 * aR = moyenne des ratios des piliers 7 à 8 (alignement)
 * Seuils exacts de la spécification, à ne pas modifier.
 */
export function computeEtatDominant(pillarScores: PillarScore[]): EtatDominant {
  const sR = average(pillarScores.filter((p) => p.pilierId >= 1 && p.pilierId <= 6).map((p) => p.ratio));
  const aR = average(pillarScores.filter((p) => p.pilierId >= 7 && p.pilierId <= 8).map((p) => p.ratio));

  if (sR >= 0.72 && aR <= 0.38) return "SURVIE";
  if (sR >= 0.54) return "ADAPTATION";
  if (aR >= 0.68 && sR <= 0.4) return "EXPANSION";
  return "ALIGNEMENT";
}

/** Score "survie" (sR) : moyenne des ratios des piliers 1 à 6. */
export function computeScoreSurvie(pillarScores: PillarScore[]): number {
  return average(pillarScores.filter((p) => p.pilierId >= 1 && p.pilierId <= 6).map((p) => p.ratio));
}

/** Score "alignement" (aR) : moyenne des ratios des piliers 7 et 8. */
export function computeScoreAlignement(pillarScores: PillarScore[]): number {
  return average(pillarScores.filter((p) => p.pilierId >= 7 && p.pilierId <= 8).map((p) => p.ratio));
}

/** Score global : moyenne des ratios des 8 piliers. */
export function computeScoreGlobal(pillarScores: PillarScore[]): number {
  return average(pillarScores.map((p) => p.ratio));
}

/**
 * Fenêtre de Transformation : (ratio pilier 7 + ratio pilier 8) / 2.
 */
export function computeFenetreTransformation(pillarScores: PillarScore[]): number {
  return (ratioOf(pillarScores, 7) + ratioOf(pillarScores, 8)) / 2;
}

export type FenetreInterpretation = "Haute ouverture" | "Ouverture partielle" | "Résistance active probable";

/** Interprétation de la Fenêtre de Transformation. Seuils exacts : 0.65 / 0.40. */
export function fenetreInterpretation(fScore: number): FenetreInterpretation {
  if (fScore >= 0.65) return "Haute ouverture";
  if (fScore >= 0.4) return "Ouverture partielle";
  return "Résistance active probable";
}

/**
 * Top 3 zones prioritaires : les piliers de survie (1 à 6) avec les
 * ratios les plus élevés, triés par ordre décroissant.
 */
export function computeTopPriorities(pillarScores: PillarScore[]): TopPriority[] {
  return pillarScores
    .filter((p) => p.pilierId >= 1 && p.pilierId <= 6)
    .slice()
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3)
    .map((p) => ({ pilierId: p.pilierId, ratio: p.ratio }));
}
