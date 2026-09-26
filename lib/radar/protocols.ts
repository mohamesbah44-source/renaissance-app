export interface ProtocolActe {
  nom: string;
  frequence: string;
  description: string;
}

export interface PilierProtocol {
  acte1: ProtocolActe;
  acte2: ProtocolActe;
}

/** Micro-protocoles recommandés par pilier (1 à 12) du Radar Re-Naissance™ v2. */
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
  3: {
    acte1: {
      nom: "Nommer sans corriger",
      frequence: "au moment où ça monte",
      description:
        "Identifier l'émotion présente en une phrase courte : « Là, je ressens... », sans chercher à l'expliquer ni à la faire cesser.",
    },
    acte2: {
      nom: "Espace de traversée",
      frequence: "5 minutes par jour",
      description:
        "S'asseoir avec ce qui est ressenti sans le fuir ni le nourrir, en respirant simplement à travers.",
    },
  },
  4: {
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
  5: {
    acte1: {
      nom: "Je ne suis pas mon rôle",
      frequence: "5 minutes par jour",
      description: "Écrire trois phrases commençant par : « Même si je ne fais rien, je reste... »",
    },
    acte2: {
      nom: "Vérité nue",
      frequence: "2 fois par semaine",
      description: "Répondre sans filtre à la question : « Qu'est-ce qui est vrai pour moi, même si personne ne valide ? »",
    },
  },
  6: {
    acte1: {
      nom: "Fil du temps",
      frequence: "1 fois par semaine",
      description:
        "Repérer un schéma actuel et remonter doucement à la première fois où il s'est manifesté, sans jugement.",
    },
    acte2: {
      nom: "Lettre de compassion",
      frequence: "1 fois par semaine",
      description: "Écrire quelques lignes à la version plus jeune de soi qui a mis ce schéma en place pour survivre.",
    },
  },
  7: {
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
  8: {
    acte1: {
      nom: "Tri relationnel",
      frequence: "1 fois par semaine",
      description:
        "Repérer une relation qui nourrit et une relation qui coûte ; ajuster consciemment le temps donné à chacune.",
    },
    acte2: {
      nom: "Demander sa part",
      frequence: "1 fois par jour",
      description: "Déléguer, demander de l'aide ou refuser de porter seul ce qui pourrait être partagé.",
    },
  },
  9: {
    acte1: {
      nom: "Présence au corps partagé",
      frequence: "lors des moments d'intimité",
      description:
        "Ralentir, respirer, et nommer intérieurement une sensation agréable présente, sans objectif de performance.",
    },
    acte2: {
      nom: "Mots simples",
      frequence: "1 fois par semaine",
      description: "Exprimer à voix haute un désir, une limite ou un besoin lié à l'intimité, même imparfaitement.",
    },
  },
  10: {
    acte1: {
      nom: "Un pas vers le collectif",
      frequence: "1 fois par semaine",
      description: "S'engager, même modestement, dans un groupe ou une communauté qui reflète une part de soi.",
    },
    acte2: {
      nom: "Appartenir sans se fondre",
      frequence: "quotidien",
      description: "Répéter : « Je peux appartenir à quelque chose sans disparaître à l'intérieur. »",
    },
  },
  11: {
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
  12: {
    acte1: {
      nom: "Présence silencieuse",
      frequence: "5 minutes par jour",
      description: "S'asseoir sans téléphone, sans objectif, sans performance. Juste sentir que l'on existe.",
    },
    acte2: {
      nom: "Ce qui compte vraiment",
      frequence: "1 fois par semaine",
      description: "Écrire une action concrète, même petite, en direction de ce qui donne du sens — puis la poser dans la semaine.",
    },
  },
};
