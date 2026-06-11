import type { EtatDominant } from "@/lib/types/database.types";

/**
 * Messages personnalisés par état dominant. Contenu repris tel quel depuis
 * la spécification.
 */
/** Courte explication affichée pour chaque pilier de survie en zone prioritaire. */
export const PRIORITY_REASONS: Record<number, string> = {
  1: "Ton corps semble porter une charge de tension ou de fatigue qui demande à être écoutée.",
  2: "L'argent occupe une place importante dans ton équilibre intérieur en ce moment.",
  3: "Tes relations semblent activer des mécanismes de protection ou d'adaptation.",
  4: "Une partie de toi cherche encore sa juste place, entre rôle et identité profonde.",
  5: "Le besoin de maîtriser ce qui t'entoure semble particulièrement présent.",
  6: "Ton système nerveux semble en état d'alerte plus souvent que nécessaire.",
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
