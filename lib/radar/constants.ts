import type { EtatDominant } from "@/lib/types/database.types";

export type PilierType = "survie" | "alignement";

export interface RadarQuestion {
  /** Identifiant unique : "<pilierId>-<n>" */
  id: string;
  /** Texte de la question (affirmation à évaluer de 1 à 5). */
  t: string;
  /** Si true et que le pilier est de type "survie", la réponse est inversée (6 - rep). */
  inv: boolean;
}

export interface Pilier {
  id: number;
  nom: string;
  court: string;
  type: PilierType;
  questions: RadarQuestion[];
}

/**
 * Les 8 piliers du Radar Renaissance™ et leurs 40 questions.
 * Contenu repris tel quel depuis la spécification : ne pas simplifier,
 * renommer ou retirer les inversions (`inv`).
 */
export const PILIERS: Pilier[] = [
  {
    id: 1,
    nom: "Sécurité physique",
    court: "Corps",
    type: "survie",
    questions: [
      { id: "1-1", t: "Je ressens souvent des tensions, douleurs ou crispations dans mon corps.", inv: false },
      {
        id: "1-2",
        t: "Mon sommeil est régulièrement perturbé par le stress, les pensées ou l'agitation intérieure.",
        inv: false,
      },
      { id: "1-3", t: "Je me sens en sécurité dans mon corps au quotidien.", inv: true },
      { id: "1-4", t: "Je ressens une fatigue profonde même lorsque je me repose.", inv: false },
      {
        id: "1-5",
        t: "J'ai tendance à ignorer les signaux de mon corps pour continuer à avancer.",
        inv: false,
      },
    ],
  },
  {
    id: 2,
    nom: "Sécurité financière",
    court: "Argent",
    type: "survie",
    questions: [
      { id: "2-1", t: "L'argent occupe une place importante dans mes préoccupations mentales.", inv: false },
      {
        id: "2-2",
        t: "Je ressens une peur de manquer même lorsque ma situation est objectivement stable.",
        inv: false,
      },
      { id: "2-3", t: "Je me sens capable de recevoir de l'argent sans culpabilité ni tension.", inv: true },
      {
        id: "2-4",
        t: "Je prends certaines décisions principalement par peur de perdre ma sécurité financière.",
        inv: false,
      },
      { id: "2-5", t: "Je relie facilement ma valeur personnelle à ma réussite financière.", inv: false },
    ],
  },
  {
    id: 3,
    nom: "Sécurité relationnelle",
    court: "Lien",
    type: "survie",
    questions: [
      {
        id: "3-1",
        t: "J'ai peur d'être rejeté, abandonné ou mal compris dans mes relations importantes.",
        inv: false,
      },
      {
        id: "3-2",
        t: "Je modifie souvent mon comportement pour éviter de décevoir ou de perdre l'autre.",
        inv: false,
      },
      { id: "3-3", t: "Je me sens libre d'être moi-même dans mes relations.", inv: true },
      {
        id: "3-4",
        t: "Je ressens parfois une forte dépendance au regard ou à la validation des autres.",
        inv: false,
      },
      { id: "3-5", t: "J'ai du mal à poser mes limites sans culpabiliser.", inv: false },
    ],
  },
  {
    id: 4,
    nom: "Sécurité identitaire",
    court: "Identité",
    type: "survie",
    questions: [
      { id: "4-1", t: "Je me demande souvent qui je suis vraiment derrière ce que je fais.", inv: false },
      {
        id: "4-2",
        t: "J'ai l'impression de jouer un rôle pour être accepté, reconnu ou respecté.",
        inv: false,
      },
      { id: "4-3", t: "Je me sens profondément aligné avec la personne que je suis aujourd'hui.", inv: true },
      { id: "4-4", t: "J'ai peur de perdre ma place si je ralentis ou si je change.", inv: false },
      {
        id: "4-5",
        t: "Je confonds parfois ma valeur avec mes résultats, mon image ou ma performance.",
        inv: false,
      },
    ],
  },
  {
    id: 5,
    nom: "Besoin de contrôle",
    court: "Contrôle",
    type: "survie",
    questions: [
      { id: "5-1", t: "J'ai besoin d'anticiper beaucoup de choses pour me sentir en sécurité.", inv: false },
      { id: "5-2", t: "L'imprévu me met rapidement sous tension.", inv: false },
      { id: "5-3", t: "Je peux faire confiance au processus même quand je ne maîtrise pas tout.", inv: true },
      {
        id: "5-4",
        t: "J'ai du mal à déléguer ou à laisser les choses se faire autrement que comme je l'imaginais.",
        inv: false,
      },
      {
        id: "5-5",
        t: "Je cherche souvent à comprendre, analyser ou contrôler ce que je ressens.",
        inv: false,
      },
    ],
  },
  {
    id: 6,
    nom: "Hypervigilance",
    court: "Vigilance",
    type: "survie",
    questions: [
      {
        id: "6-1",
        t: "Je suis souvent en alerte intérieure, même quand rien de grave ne se passe.",
        inv: false,
      },
      {
        id: "6-2",
        t: "Je capte rapidement les changements d'ambiance, de ton ou d'énergie autour de moi.",
        inv: false,
      },
      { id: "6-3", t: "Je peux me détendre sans chercher ce qui pourrait mal tourner.", inv: true },
      {
        id: "6-4",
        t: "Je me prépare mentalement à plusieurs scénarios pour éviter d'être pris au dépourvu.",
        inv: false,
      },
      { id: "6-5", t: "Je ressens souvent une tension intérieure difficile à expliquer.", inv: false },
    ],
  },
  {
    id: 7,
    nom: "Capacité à recevoir",
    court: "Recevoir",
    type: "alignement",
    questions: [
      {
        id: "7-1",
        t: "Je me sens capable de recevoir de l'aide sans me sentir faible ou redevable.",
        inv: false,
      },
      {
        id: "7-2",
        t: "J'accueille les compliments, l'amour ou la reconnaissance sans les minimiser.",
        inv: false,
      },
      {
        id: "7-3",
        t: "Je laisse les autres contribuer à ma vie sans vouloir tout porter seul.",
        inv: false,
      },
      { id: "7-4", t: "Je peux recevoir du repos, du plaisir ou de la douceur sans culpabilité.", inv: false },
      { id: "7-5", t: "Je me sens digne de recevoir même lorsque je ne produis rien.", inv: false },
    ],
  },
  {
    id: 8,
    nom: "Capacité à être",
    court: "Être",
    type: "alignement",
    questions: [
      { id: "8-1", t: "Je peux exister sans avoir besoin de prouver ma valeur.", inv: false },
      { id: "8-2", t: "Je m'autorise à ralentir sans avoir l'impression de perdre du temps.", inv: false },
      { id: "8-3", t: "Je me sens en paix avec le fait d'être simplement moi.", inv: false },
      {
        id: "8-4",
        t: "Je peux ressentir mes émotions sans chercher immédiatement à les corriger.",
        inv: false,
      },
      {
        id: "8-5",
        t: "Je sens que ma présence a de la valeur, même dans le silence ou l'immobilité.",
        inv: false,
      },
    ],
  },
];

export const TOTAL_QUESTIONS = PILIERS.reduce((sum, pilier) => sum + pilier.questions.length, 0);

/** Champ de formulaire associé à une question : "q_<pilierId>_<n>". */
export function questionFieldName(question: RadarQuestion): string {
  return `q_${question.id.replace("-", "_")}`;
}

export interface FlatQuestion extends RadarQuestion {
  pilierId: number;
  pilierNom: string;
  pilierCourt: string;
}

/** Les 40 questions à plat, dans l'ordre des piliers, pour l'écran Session. */
export const ALL_QUESTIONS: FlatQuestion[] = PILIERS.flatMap((pilier) =>
  pilier.questions.map((question) => ({
    ...question,
    pilierId: pilier.id,
    pilierNom: pilier.nom,
    pilierCourt: pilier.court,
  }))
);

export const ANSWER_LABELS = ["Jamais", "Rarement", "Parfois", "Souvent", "Toujours"] as const;

export const EVOLUTION_STATES: Record<EtatDominant, { label: string; lune: string }> = {
  SURVIE: { label: "Survie", lune: "🌑" },
  ADAPTATION: { label: "Adaptation", lune: "🌒" },
  ALIGNEMENT: { label: "Alignement", lune: "🌓" },
  EXPANSION: { label: "Expansion", lune: "🌕" },
};
