import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

export type RadarDimensionKey =
  | "securite_physique"
  | "securite_financiere"
  | "securite_relationnelle"
  | "securite_identitaire"
  | "besoin_controle"
  | "hypervigilance"
  | "capacite_recevoir"
  | "capacite_etre";

interface RadarDimension {
  key: RadarDimensionKey;
  label: string;
  question: string;
}

/** Les 8 dimensions du Radar Renaissance™. Un score élevé = plus proche de l'Expansion. */
export const RADAR_DIMENSIONS: RadarDimension[] = [
  {
    key: "securite_physique",
    label: "Sécurité physique",
    question: "À quel point te sens-tu en sécurité dans ton corps, ton énergie, ton sommeil ?",
  },
  {
    key: "securite_financiere",
    label: "Sécurité financière",
    question: "À quel point te sens-tu en sécurité par rapport à l'argent et à tes ressources ?",
  },
  {
    key: "securite_relationnelle",
    label: "Sécurité relationnelle",
    question: "À quel point te sens-tu en sécurité dans tes relations proches ?",
  },
  {
    key: "securite_identitaire",
    label: "Sécurité identitaire",
    question: "À quel point te sens-tu aligné·e avec qui tu es vraiment ?",
  },
  {
    key: "besoin_controle",
    label: "Lâcher-prise",
    question: "À quel point arrives-tu à lâcher le besoin de tout contrôler ?",
  },
  {
    key: "hypervigilance",
    label: "Calme intérieur",
    question: "À quel point te sens-tu apaisé·e, loin de l'hypervigilance ?",
  },
  {
    key: "capacite_recevoir",
    label: "Capacité à recevoir",
    question: "À quel point arrives-tu à recevoir : aide, amour, repos, reconnaissance ?",
  },
  {
    key: "capacite_etre",
    label: "Capacité à être",
    question: "À quel point arrives-tu à simplement être, sans avoir à prouver ou produire ?",
  },
];

export const RADAR_PHASES: { key: RadarPhase; title: string; description: string; color: string }[] = [
  {
    key: "before",
    title: "Avant le programme",
    description: "Ton point de départ. Une photographie honnête de là où tu en es aujourd'hui.",
    color: "#94a3b8",
  },
  {
    key: "week4",
    title: "À la semaine 4",
    description: "À mi-parcours, observe ce qui a déjà bougé en toi.",
    color: "#a78bfa",
  },
  {
    key: "week8",
    title: "À la semaine 8",
    description: "Au terme du parcours, mesure le chemin parcouru.",
    color: "#fbc382",
  },
];

export const EVOLUTION_PHASES = ["Survie", "Adaptation", "Alignement", "Expansion"] as const;
export type EvolutionPhase = (typeof EVOLUTION_PHASES)[number];

export function averageScore(assessment: RadarAssessment): number {
  const total = RADAR_DIMENSIONS.reduce((sum, dimension) => sum + assessment[dimension.key], 0);
  return total / RADAR_DIMENSIONS.length;
}

export function evolutionPhase(average: number): EvolutionPhase {
  if (average < 4) return "Survie";
  if (average < 6) return "Adaptation";
  if (average < 8) return "Alignement";
  return "Expansion";
}
