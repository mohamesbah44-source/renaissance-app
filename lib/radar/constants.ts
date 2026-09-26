import type { EtatDominant } from "@/lib/types/database.types";

export type CercleId = "moi" | "nous" | "monde";

export type CapaciteId = "conscience" | "regulation" | "comprehension" | "action" | "integration";

export interface RadarQuestion {
  /** Identifiant unique : "<pilierId>-<n>" */
  id: string;
  /** Texte de la question (affirmation à évaluer de 1 à 5). */
  t: string;
  /** Si true, la réponse est inversée (6 - rep) avant d'entrer dans le score de tension du pilier. */
  inv: boolean;
  /** Capacité transversale principalement sondée par cette question. */
  capacite: CapaciteId;
}

export interface Pilier {
  id: number;
  nom: string;
  court: string;
  cercle: CercleId;
  questions: RadarQuestion[];
}

export interface Cercle {
  id: CercleId;
  nom: string;
  pilierIds: number[];
}

export const CERCLES: Cercle[] = [
  { id: "moi", nom: "Moi", pilierIds: [1, 2, 3, 4, 5, 6] },
  { id: "nous", nom: "Nous", pilierIds: [7, 8, 9, 10] },
  { id: "monde", nom: "Monde", pilierIds: [11, 12] },
];

export const CAPACITES: { id: CapaciteId; nom: string }[] = [
  { id: "conscience", nom: "Conscience" },
  { id: "regulation", nom: "Régulation" },
  { id: "comprehension", nom: "Compréhension" },
  { id: "action", nom: "Action" },
  { id: "integration", nom: "Intégration" },
];

/**
 * Les 3 Cercles (Moi / Nous / Monde), 12 Piliers et 60 questions du
 * Radar Re-Naissance™ v2. Chaque pilier contribue une question à chacune
 * des 5 capacités transversales (Conscience, Régulation, Compréhension,
 * Action, Intégration), qui restent transversales plutôt qu'un 13e pilier.
 * Ne pas simplifier, renommer ou retirer les inversions (`inv`).
 */
export const PILIERS: Pilier[] = [
  // ───────────── Cercle Moi ─────────────
  {
    id: 1,
    nom: "Corps",
    court: "Corps",
    cercle: "moi",
    questions: [
      { id: "1-1", t: "Je ressens souvent des tensions, douleurs ou crispations dans mon corps.", inv: false, capacite: "conscience" },
      { id: "1-2", t: "Mon système se met en tension avant même que je comprenne pourquoi.", inv: false, capacite: "regulation" },
      { id: "1-3", t: "Je sais reconnaître, dans l'instant, ce que mon corps essaie de me dire.", inv: true, capacite: "comprehension" },
      { id: "1-4", t: "J'ignore les signaux de mon corps pour continuer à avancer.", inv: false, capacite: "action" },
      { id: "1-5", t: "Je me sens chez moi dans mon corps, au quotidien.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 2,
    nom: "Système nerveux",
    court: "Nerveux",
    cercle: "moi",
    questions: [
      { id: "2-1", t: "Je suis souvent en alerte intérieure, même quand rien de grave ne se passe.", inv: false, capacite: "conscience" },
      { id: "2-2", t: "Il me faut longtemps pour redescendre après une tension ou un imprévu.", inv: false, capacite: "regulation" },
      { id: "2-3", t: "Je comprends ce qui, en moi, déclenche cette mise en alerte.", inv: true, capacite: "comprehension" },
      { id: "2-4", t: "Je me prépare mentalement à plusieurs scénarios pour éviter d'être pris au dépourvu.", inv: false, capacite: "action" },
      { id: "2-5", t: "Je peux me détendre sans chercher ce qui pourrait mal tourner.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 3,
    nom: "Émotions",
    court: "Émotions",
    cercle: "moi",
    questions: [
      { id: "3-1", t: "J'ai du mal à identifier précisément ce que je ressens sur le moment.", inv: false, capacite: "conscience" },
      { id: "3-2", t: "Mes émotions me submergent ou, à l'inverse, semblent complètement coupées.", inv: false, capacite: "regulation" },
      { id: "3-3", t: "Je sais nommer ce que je ressens sans avoir besoin de l'expliquer ou de le justifier.", inv: true, capacite: "comprehension" },
      { id: "3-4", t: "Je repousse ou j'évite ce que je ressens plutôt que de le traverser.", inv: false, capacite: "action" },
      { id: "3-5", t: "Je peux accueillir mes émotions, même inconfortables, sans qu'elles me dirigent.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 4,
    nom: "Mental",
    court: "Mental",
    cercle: "moi",
    questions: [
      { id: "4-1", t: "Mon mental tourne en boucle, même quand je voudrais me reposer.", inv: false, capacite: "conscience" },
      { id: "4-2", t: "J'ai besoin d'anticiper beaucoup de choses pour me sentir en sécurité.", inv: false, capacite: "regulation" },
      { id: "4-3", t: "Je fais la différence entre une pensée et la réalité qu'elle décrit.", inv: true, capacite: "comprehension" },
      { id: "4-4", t: "J'ai du mal à déléguer ou à laisser les choses se faire autrement que comme je l'imaginais.", inv: false, capacite: "action" },
      { id: "4-5", t: "Je peux faire confiance au processus même quand je ne maîtrise pas tout.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 5,
    nom: "Identité",
    court: "Identité",
    cercle: "moi",
    questions: [
      { id: "5-1", t: "Je me demande souvent qui je suis vraiment derrière ce que je fais.", inv: false, capacite: "conscience" },
      { id: "5-2", t: "J'ai l'impression de jouer un rôle pour être accepté, reconnu ou respecté.", inv: false, capacite: "regulation" },
      { id: "5-3", t: "Je sais distinguer ce qui vient vraiment de moi de ce qu'on attend de moi.", inv: true, capacite: "comprehension" },
      { id: "5-4", t: "Je confonds parfois ma valeur avec mes résultats, mon image ou ma performance.", inv: false, capacite: "action" },
      { id: "5-5", t: "Je me sens profondément aligné avec la personne que je suis aujourd'hui.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 6,
    nom: "Histoire",
    court: "Histoire",
    cercle: "moi",
    questions: [
      { id: "6-1", t: "Certains schémas se répètent dans ma vie sans que j'en comprenne toujours l'origine.", inv: false, capacite: "conscience" },
      { id: "6-2", t: "Des réactions disproportionnées ressurgissent parfois, comme venues d'ailleurs.", inv: false, capacite: "regulation" },
      { id: "6-3", t: "Je fais le lien entre ce que je vis aujourd'hui et ce que j'ai traversé plus tôt.", inv: true, capacite: "comprehension" },
      { id: "6-4", t: "J'évite de regarder certaines périodes de mon histoire personnelle.", inv: false, capacite: "action" },
      { id: "6-5", t: "Je peux regarder mon histoire avec compassion, sans qu'elle me définisse.", inv: true, capacite: "integration" },
    ],
  },
  // ───────────── Cercle Nous ─────────────
  {
    id: 7,
    nom: "Attachement",
    court: "Attachement",
    cercle: "nous",
    questions: [
      { id: "7-1", t: "J'ai peur d'être rejeté, abandonné ou mal compris dans mes relations importantes.", inv: false, capacite: "conscience" },
      { id: "7-2", t: "Je ressens parfois une forte dépendance au regard ou à la validation des autres.", inv: false, capacite: "regulation" },
      { id: "7-3", t: "Je comprends mon fonctionnement dans les liens proches — ce qui me rassure, ce qui m'active.", inv: true, capacite: "comprehension" },
      { id: "7-4", t: "Je modifie souvent mon comportement pour éviter de décevoir ou de perdre l'autre.", inv: false, capacite: "action" },
      { id: "7-5", t: "Je me sens en sécurité dans mes liens, même dans la distance ou le silence.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 8,
    nom: "Relations",
    court: "Relations",
    cercle: "nous",
    questions: [
      { id: "8-1", t: "J'ai du mal à poser mes limites sans culpabiliser.", inv: false, capacite: "conscience" },
      { id: "8-2", t: "Certaines relations m'épuisent sans que j'arrive à m'en distancier.", inv: false, capacite: "regulation" },
      { id: "8-3", t: "Je sais reconnaître les relations qui me nourrissent de celles qui me coûtent.", inv: true, capacite: "comprehension" },
      { id: "8-4", t: "Je porte plus que ma part dans mes relations proches.", inv: false, capacite: "action" },
      { id: "8-5", t: "Je me sens libre d'être moi-même dans mes relations.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 9,
    nom: "Intimité & Sexualité",
    court: "Intimité",
    cercle: "nous",
    questions: [
      { id: "9-1", t: "Il m'est difficile de me sentir pleinement présent dans l'intimité.", inv: false, capacite: "conscience" },
      { id: "9-2", t: "Mon corps se ferme ou se met en retrait dans les moments de proximité.", inv: false, capacite: "regulation" },
      { id: "9-3", t: "Je comprends ce qui, chez moi, facilite ou freine l'intimité.", inv: true, capacite: "comprehension" },
      { id: "9-4", t: "J'évite certains sujets liés au désir, au corps ou à la sexualité.", inv: false, capacite: "action" },
      { id: "9-5", t: "Je me sens libre et en confiance dans mon intimité.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 10,
    nom: "Appartenance",
    court: "Appartenance",
    cercle: "nous",
    questions: [
      { id: "10-1", t: "Je me sens souvent en décalage avec les groupes ou les communautés auxquels j'appartiens.", inv: false, capacite: "conscience" },
      { id: "10-2", t: "Je m'adapte fortement pour être accepté par un groupe, quitte à m'effacer.", inv: false, capacite: "regulation" },
      { id: "10-3", t: "Je sais où je me sens vraiment à ma place.", inv: true, capacite: "comprehension" },
      { id: "10-4", t: "J'évite de m'engager pleinement dans un collectif de peur de ne pas y avoir ma place.", inv: false, capacite: "action" },
      { id: "10-5", t: "Je me sens appartenir à quelque chose de plus grand que moi, sans avoir à m'y fondre.", inv: true, capacite: "integration" },
    ],
  },
  // ───────────── Cercle Monde ─────────────
  {
    id: 11,
    nom: "Matière & Œuvre",
    court: "Matière",
    cercle: "monde",
    questions: [
      { id: "11-1", t: "L'argent occupe une place importante dans mes préoccupations mentales.", inv: false, capacite: "conscience" },
      { id: "11-2", t: "Je prends certaines décisions professionnelles principalement par peur de manquer.", inv: false, capacite: "regulation" },
      { id: "11-3", t: "Je comprends le lien entre ma sécurité matérielle et mes choix de vie.", inv: true, capacite: "comprehension" },
      { id: "11-4", t: "Je relie facilement ma valeur personnelle à ma réussite financière ou professionnelle.", inv: false, capacite: "action" },
      { id: "11-5", t: "Je me sens capable de recevoir de l'argent et de la reconnaissance sans culpabilité ni tension.", inv: true, capacite: "integration" },
    ],
  },
  {
    id: 12,
    nom: "Sens & Spiritualité",
    court: "Sens",
    cercle: "monde",
    questions: [
      { id: "12-1", t: "Il m'arrive de me demander quel est le sens profond de ce que je fais.", inv: false, capacite: "conscience" },
      { id: "12-2", t: "Je me sens coupé de quelque chose de plus grand que mon quotidien.", inv: false, capacite: "regulation" },
      { id: "12-3", t: "Je sais nommer ce qui, pour moi, donne du sens à ma vie.", inv: true, capacite: "comprehension" },
      { id: "12-4", t: "Je remets à plus tard ce qui compte vraiment pour moi intérieurement.", inv: false, capacite: "action" },
      { id: "12-5", t: "Je me sens relié à quelque chose qui dépasse le simple fait de faire et de réussir.", inv: true, capacite: "integration" },
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

/** Les 60 questions à plat, dans l'ordre des piliers, pour l'écran Session. */
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

export function pilierById(id: number): Pilier | undefined {
  return PILIERS.find((p) => p.id === id);
}

export function cercleOf(pilierId: number): Cercle {
  return CERCLES.find((c) => c.pilierIds.includes(pilierId))!;
}
