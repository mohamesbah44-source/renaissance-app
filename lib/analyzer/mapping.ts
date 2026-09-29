import type { CapaciteId } from "@/lib/radar/constants";

/** Correspondance entre le `pillar_key` (texte) de l'Analyzer et l'id numérique (1 à 12) de nos piliers. */
export const ANALYZER_PILLAR_KEY_TO_ID: Record<string, number> = {
  corps: 1,
  systeme_nerveux: 2,
  emotions: 3,
  mental: 4,
  identite: 5,
  histoire: 6,
  attachement: 7,
  relations: 8,
  intimite_sexualite: 9,
  appartenance: 10,
  matiere_oeuvre: 11,
  sens_spiritualite: 12,
};

export const ANALYZER_CAPACITY_KEYS: CapaciteId[] = [
  "conscience",
  "regulation",
  "comprehension",
  "action",
  "integration",
];

export interface AnalyzerPillarScoreRow {
  pillar_key: string;
  circle: "moi" | "nous" | "monde";
  capacity_key: CapaciteId;
  value: number | null;
}

export interface AnalyzerDetectedPattern {
  description: string;
  pillars_concerned: string[] | null;
  confidence: "faible" | "moyen" | "haut" | null;
}

export interface AnalyzerBilanPayload {
  found: boolean;
  client?: { first_name: string | null; last_name: string | null };
  session?: { id: string; title: string; recorded_at: string } | null;
  pillar_scores?: AnalyzerPillarScoreRow[];
  detected_patterns?: AnalyzerDetectedPattern[];
}
