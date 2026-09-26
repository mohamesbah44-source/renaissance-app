import { PILIERS, CERCLES, CAPACITES, type CercleId, type CapaciteId } from "@/lib/radar/constants";
import type { EtatDominant } from "@/lib/types/database.types";

export interface PillarScore {
  pilierId: number;
  total: number;
  count: number;
  max: number;
  /** Ratio de tension (0 à 1) : plus c'est haut, plus le pilier demande d'attention. */
  ratio: number;
}

export interface TopPriority {
  pilierId: number;
  ratio: number;
}

export type CercleScores = Record<CercleId, number>;
export type CapaciteScores = Record<CapaciteId, number>;

export interface MetaIndicateurs {
  /** 1 - écart entre le cercle le plus chargé et le moins chargé. */
  equilibre: number;
  /** Moyenne des capacités Régulation et Intégration. */
  flexibilite: number;
  /** 1 - tension moyenne des piliers Corps, Système nerveux, Émotions. */
  vitalite: number;
  /**
   * Compréhension moins la moyenne de (Action, Intégration).
   * Positif : la compréhension dépasse l'incarnation ("je comprends plus que je ne vis").
   * Négatif : l'action précède la compréhension consciente.
   */
  ecartIncarnation: number;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calcule le score de tension (total/count/max/ratio) de chaque pilier à
 * partir des réponses brutes (1 à 5, indexées par id de question
 * "<pilierId>-<n>"). Inversion : si la question est `inv`, la valeur
 * retenue est `6 - rep` (s'applique aux 12 piliers, sans distinction de type).
 */
export function computePillarScores(answers: Record<string, number>): PillarScore[] {
  return PILIERS.map((pilier) => {
    let total = 0;
    let count = 0;

    for (const question of pilier.questions) {
      const rep = answers[question.id];
      if (rep === undefined) continue;

      const val = question.inv ? 6 - rep : rep;
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

/** Score de tension moyen (0 à 1) des piliers d'un cercle. */
export function computeCercleScores(pillarScores: PillarScore[]): CercleScores {
  const result = {} as CercleScores;
  for (const cercle of CERCLES) {
    result[cercle.id] = average(cercle.pilierIds.map((id) => ratioOf(pillarScores, id)));
  }
  return result;
}

/**
 * Score de capacité (0 à 1, plus haut = plus de ressource) : pour chaque
 * capacité transversale, moyenne sur les 12 piliers de (1 - valeur de
 * tension de la question taguée pour cette capacité).
 */
export function computeCapaciteScores(answers: Record<string, number>): CapaciteScores {
  const result = {} as CapaciteScores;

  for (const capacite of CAPACITES) {
    const values: number[] = [];

    for (const pilier of PILIERS) {
      const question = pilier.questions.find((q) => q.capacite === capacite.id);
      if (!question) continue;

      const rep = answers[question.id];
      if (rep === undefined) continue;

      const tension = question.inv ? 6 - rep : rep;
      values.push(1 - (tension - 1) / 4); // tension 1..5 -> ressource 1..0
    }

    result[capacite.id] = average(values);
  }

  return result;
}

export function computeMetaIndicateurs(
  pillarScores: PillarScore[],
  cercleScores: CercleScores,
  capaciteScores: CapaciteScores
): MetaIndicateurs {
  const cercleValues = Object.values(cercleScores);
  const equilibre = 1 - (Math.max(...cercleValues) - Math.min(...cercleValues));

  const flexibilite = average([capaciteScores.regulation, capaciteScores.integration]);

  const vitalite =
    1 - average([1, 2, 3].map((id) => ratioOf(pillarScores, id)));

  const ecartIncarnation =
    capaciteScores.comprehension - average([capaciteScores.action, capaciteScores.integration]);

  return { equilibre, flexibilite, vitalite, ecartIncarnation };
}

/**
 * État dominant : SURVIE / ADAPTATION / ALIGNEMENT / EXPANSION.
 * sR = charge protectrice = moyenne des ratios de tension des piliers des
 *      cercles Moi + Nous (les 10 premiers piliers).
 * aR = ouverture = moyenne des 5 capacités transversales.
 * Seuils exacts de la spécification d'origine, conservés à l'identique.
 */
export function computeEtatDominant(sR: number, aR: number): EtatDominant {
  if (sR >= 0.72 && aR <= 0.38) return "SURVIE";
  if (sR >= 0.54) return "ADAPTATION";
  if (aR >= 0.68 && sR <= 0.4) return "EXPANSION";
  return "ALIGNEMENT";
}

/** Charge protectrice (sR) : moyenne des ratios de tension des piliers Moi + Nous (1 à 10). */
export function computeScoreCharge(pillarScores: PillarScore[]): number {
  return average(
    pillarScores.filter((p) => p.pilierId >= 1 && p.pilierId <= 10).map((p) => p.ratio)
  );
}

/** Ouverture (aR) : moyenne des 5 capacités transversales. */
export function computeScoreOuverture(capaciteScores: CapaciteScores): number {
  return average(Object.values(capaciteScores));
}

/** Score global de tension : moyenne des ratios des 12 piliers. */
export function computeScoreGlobal(pillarScores: PillarScore[]): number {
  return average(pillarScores.map((p) => p.ratio));
}

/** Fenêtre de Transformation : identique à l'ouverture (aR), moyenne des 5 capacités. */
export function computeFenetreTransformation(capaciteScores: CapaciteScores): number {
  return computeScoreOuverture(capaciteScores);
}

export type FenetreInterpretation = "Haute ouverture" | "Ouverture partielle" | "Résistance active probable";

/** Interprétation de la Fenêtre de Transformation. Seuils exacts : 0.65 / 0.40. */
export function fenetreInterpretation(fScore: number): FenetreInterpretation {
  if (fScore >= 0.65) return "Haute ouverture";
  if (fScore >= 0.4) return "Ouverture partielle";
  return "Résistance active probable";
}

/**
 * Top 3 zones prioritaires : les 3 piliers (parmi les 12) avec les ratios
 * de tension les plus élevés, tous cercles confondus.
 */
export function computeTopPriorities(pillarScores: PillarScore[]): TopPriority[] {
  return pillarScores
    .slice()
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3)
    .map((p) => ({ pilierId: p.pilierId, ratio: p.ratio }));
}
