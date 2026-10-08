import { CERCLES, type CercleId } from "@/lib/radar/constants";

/** Niveau de 1 (très chargé) à 5 (apaisé) pour chaque pilier, indexé par identifiant de pilier. */
export type Levels = Record<string, number>;

export type Trend = "up" | "down" | "stable";

/** Semaine du programme (1 à 8), calculée depuis la date de début, comme sur la page Aujourd'hui. */
export function programWeek(startDate: string | null | undefined, today: string, fallback = 1): number {
  if (!startDate) return fallback;
  const start = new Date(`${String(startDate).slice(0, 10)}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const diff = Math.max(0, Math.round((now.getTime() - start.getTime()) / 86400000));
  return Math.min(8, Math.floor(diff / 7) + 1);
}

/**
 * Convertit les scores de tension d'un Radar complet (ratio de 0.2 à 1, plus c'est haut plus c'est chargé)
 * en niveaux d'apaisement de 1 à 5, comparables au Radar express.
 */
export function levelsFromPillarScores(pillarScores: unknown): Levels | null {
  if (!Array.isArray(pillarScores)) return null;
  const levels: Levels = {};
  for (const item of pillarScores) {
    if (item && typeof item === "object") {
      const { pilierId, ratio } = item as { pilierId?: unknown; ratio?: unknown };
      if (typeof pilierId === "number" && typeof ratio === "number") {
        levels[String(pilierId)] = Math.min(5, Math.max(1, 6 - ratio * 5));
      }
    }
  }
  return Object.keys(levels).length > 0 ? levels : null;
}

/** Niveau moyen de chaque cercle (Moi / Nous / Monde). */
export function cercleLevels(levels: Levels | null): Record<CercleId, number | null> {
  const out: Record<CercleId, number | null> = { moi: null, nous: null, monde: null };
  if (!levels) return out;
  for (const cercle of CERCLES) {
    const values = cercle.pilierIds
      .map((id) => levels[String(id)])
      .filter((v): v is number => typeof v === "number");
    out[cercle.id] = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }
  return out;
}

/** Mot doux pour un niveau moyen (mêmes seuils que l'écran de résultats de l'accueil). */
export function levelWord(level: number | null): string {
  if (level === null) return "à découvrir";
  if (level > 3.9) return "plutôt apaisé";
  if (level > 2.9) return "nuancé";
  return "plus chargé";
}

export function trendOf(current: number | null, previous: number | null): Trend | null {
  if (current === null || previous === null) return null;
  const diff = current - previous;
  if (diff >= 0.3) return "up";
  if (diff <= -0.3) return "down";
  return "stable";
}
