import type { EtatDominant } from "@/lib/types/database.types";

/** Courte explication affichée pour chaque pilier en zone prioritaire (1 à 12). */
export const PRIORITY_REASONS: Record<number, string> = {
  1: "Ton corps semble porter une charge de tension ou de fatigue qui demande à être écoutée.",
  2: "Ton système nerveux semble en état d'alerte plus souvent que nécessaire.",
  3: "Tes émotions semblent chercher un espace pour être traversées plutôt qu'évitées.",
  4: "Ton mental semble particulièrement mobilisé par le besoin de tout anticiper ou maîtriser.",
  5: "Une partie de toi cherche encore sa juste place, entre rôle et identité profonde.",
  6: "Des schémas issus de ton histoire semblent encore actifs dans ton présent.",
  7: "Tes liens proches semblent activer des mécanismes de protection ou d'adaptation.",
  8: "Tes relations semblent demander un rééquilibrage entre ce que tu donnes et ce que tu reçois.",
  9: "L'intimité semble un espace où la présence à toi-même se dérobe encore parfois.",
  10: "Ton sentiment d'appartenance semble encore fragile ou coûteux à maintenir.",
  11: "La sécurité matérielle et la reconnaissance de ton œuvre occupent une place importante en toi.",
  12: "Une question de sens semble présente, en arrière-plan de ton quotidien.",
};

export const ETAT_MESSAGES: Record<EtatDominant, string> = {
  SURVIE:
    "Ton système semble encore mobilisé autour de la protection. Ce n'est pas un échec. C'est une intelligence intérieure qui a appris à te garder debout. La première étape n'est pas de forcer le changement, mais de restaurer de la sécurité.",
  ADAPTATION:
    "Tu as déjà développé une grande capacité à fonctionner, avancer et tenir. Mais une partie de toi semble encore payer le prix de cette adaptation. Le travail commence ici : ne plus seulement réussir à tenir, mais apprendre à vivre depuis un espace plus libre.",
  ALIGNEMENT:
    "Une stabilité intérieure commence à apparaître. Tu n'es plus uniquement guidé par la protection ou la performance. Il devient possible d'écouter ton corps, tes besoins, ton rythme et tes élans profonds avec plus de clarté.",
  EXPANSION:
    "Ton système semble disponible pour une transformation plus vaste. Tu peux créer, recevoir, ralentir, choisir et rayonner sans devoir constamment lutter pour exister. L'enjeu est maintenant d'incarner cette expansion dans le réel.",
};

/** Libellés des 4 méta-indicateurs et de leur pôle bas / haut. */
export const META_LABELS: Record<
  "equilibre" | "flexibilite" | "vitalite" | "ecartIncarnation",
  { nom: string; bas: string; haut: string }
> = {
  equilibre: {
    nom: "Équilibre",
    bas: "Un cercle (Moi, Nous ou Monde) porte visiblement plus de charge que les autres.",
    haut: "Ta charge est répartie de façon assez homogène entre Moi, Nous et Monde.",
  },
  flexibilite: {
    nom: "Flexibilité",
    bas: "Il te faut du temps et de l'effort pour changer d'état intérieur.",
    haut: "Tu sembles capable de te réguler et de t'ajuster avec une relative souplesse.",
  },
  vitalite: {
    nom: "Vitalité",
    bas: "Ton énergie de base (corps, système nerveux, émotions) semble sollicitée.",
    haut: "Ton socle corporel et émotionnel semble être une ressource disponible.",
  },
  ecartIncarnation: {
    nom: "Écart d'Incarnation",
    bas: "Ton action et ta compréhension semblent proches — tu vis ce que tu comprends.",
    haut: "Tu sembles comprendre certaines choses plus vite que tu ne les incarnes au quotidien.",
  },
};
