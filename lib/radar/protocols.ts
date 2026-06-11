export interface ProtocolActe {
  nom: string;
  frequence: string;
  description: string;
}

export interface PilierProtocol {
  acte1: ProtocolActe;
  acte2: ProtocolActe;
}

/**
 * Micro-protocoles recommandés par pilier (1 à 8). Contenu repris tel quel
 * depuis la spécification.
 */
export const MICRO_PROTOCOLS: Record<number, PilierProtocol> = {
  1: {
    acte1: {
      nom: "Retour au corps",
      frequence: "3 minutes, 2 fois par jour",
      description:
        "Poser les pieds au sol, respirer lentement, sentir le poids du corps et nommer trois sensations physiques sans les analyser.",
    },
    acte2: {
      nom: "Décharge douce",
      frequence: "5 minutes par jour",
      description:
        "Marcher lentement ou secouer doucement les bras et les jambes pour laisser le système nerveux sortir de la tension accumulée.",
    },
  },
  2: {
    acte1: {
      nom: "Clarification du réel",
      frequence: "1 fois par semaine",
      description:
        "Regarder les chiffres concrets sans projection catastrophique : entrées, sorties, besoins réels, marge disponible.",
    },
    acte2: {
      nom: "Séparer argent et valeur",
      frequence: "3 fois par semaine",
      description: "Écrire : « Ma valeur ne dépend pas de mon solde, de mon chiffre ou de ma performance. »",
    },
  },
  3: {
    acte1: {
      nom: "Limite simple",
      frequence: "1 fois par jour",
      description:
        "Identifier une micro-limite à respecter : répondre plus tard, dire non, demander du temps, exprimer un besoin.",
    },
    acte2: {
      nom: "Retour à soi",
      frequence: "après chaque tension relationnelle",
      description: "Se demander : « Est-ce que je réponds depuis l'amour, la peur ou la culpabilité ? »",
    },
  },
  4: {
    acte1: {
      nom: "Je ne suis pas mon rôle",
      frequence: "5 minutes par jour",
      description: "Écrire trois phrases commençant par : « Même si je ne fais rien, je reste… »",
    },
    acte2: {
      nom: "Vérité nue",
      frequence: "2 fois par semaine",
      description: "Répondre sans filtre à la question : « Qu'est-ce qui est vrai pour moi, même si personne ne valide ? »",
    },
  },
  5: {
    acte1: {
      nom: "Zone non contrôlée",
      frequence: "1 fois par jour",
      description:
        "Choisir volontairement une petite chose à ne pas maîtriser entièrement, puis observer ce qui se passe dans le corps.",
    },
    acte2: {
      nom: "Phrase d'abandon",
      frequence: "matin et soir",
      description: "Répéter lentement : « Je peux être en sécurité même lorsque je ne contrôle pas tout. »",
    },
  },
  6: {
    acte1: {
      nom: "Orientation sécurité",
      frequence: "3 fois par jour",
      description:
        "Regarder autour de soi et nommer cinq éléments neutres ou rassurants présents dans l'environnement.",
    },
    acte2: {
      nom: "Signal de fin d'alerte",
      frequence: "le soir",
      description: "Poser une main sur le cœur et dire : « Pour aujourd'hui, je n'ai plus besoin de surveiller. »",
    },
  },
  7: {
    acte1: {
      nom: "Recevoir sans rendre",
      frequence: "1 fois par jour",
      description:
        "Accepter un compliment, une aide ou une attention sans se justifier, minimiser ou rendre immédiatement.",
    },
    acte2: {
      nom: "Permission",
      frequence: "3 fois par semaine",
      description: "Écrire : « J'ai le droit de recevoir sans devoir mériter chaque chose par l'effort. »",
    },
  },
  8: {
    acte1: {
      nom: "Présence silencieuse",
      frequence: "5 minutes par jour",
      description: "S'asseoir sans téléphone, sans objectif, sans performance. Juste sentir que l'on existe.",
    },
    acte2: {
      nom: "Rien à prouver",
      frequence: "matin",
      description: "Répéter : « Aujourd'hui, je n'ai pas besoin de me battre pour avoir le droit d'être. »",
    },
  },
};
