import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const ETAPES = [
  {
    titre: "1. Reviens à ton souffle",
    texte:
      "Inspire doucement par le nez sur 4 temps, retiens l'air 4 temps, expire longuement par la bouche sur 6 à 8 temps. Répète ce cycle cinq à six fois, sans forcer.",
  },
  {
    titre: "2. Ancre ton corps ici",
    texte:
      "Nomme, dans ta tête ou à voix basse : 5 choses que tu vois, 4 choses que tu entends, 3 choses que tu touches, 2 choses que tu sens, 1 chose que tu goûtes. Reviens au concret, à l'instant présent.",
  },
  {
    titre: "3. Nomme ce qui traverse",
    texte:
      "\"En ce moment, je ressens ___.\" Tu n'as pas besoin de comprendre ou de justifier ce qui se passe pour le traverser. Ce que tu ressens est légitime, même si c'est inconfortable.",
  },
  {
    titre: "4. Relie-toi si tu en as besoin",
    texte:
      "Tu n'as pas à traverser cela seul·e. Écris un message à ton praticien si tu sens que tu as besoin d'être accompagné·e maintenant.",
  },
];

/** Protocole SOS Re-Naissance™ — accessible à tout moment, sans dépendre de l'avancée dans le parcours. */
export default function SosPage() {
  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Le Programme Re-Naissance™</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">
          Protocole SOS Re-Naissance™
        </h1>
        <p className="mt-3 font-rr-serif text-lg italic leading-relaxed text-rr-creme">
          Pour les moments où tout s&apos;accélère ou se referme. Prends ce qui t&apos;aide, dans l&apos;ordre
          qui te convient.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        {ETAPES.map((etape) => (
          <GlassCard key={etape.titre} className="p-6">
            <p className="font-rr-display text-base uppercase tracking-[0.08em] text-rr-or-clair">{etape.titre}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{etape.texte}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6 p-6 text-center">
        <p className="text-sm leading-relaxed text-white/60">
          Ce protocole est un outil d&apos;auto-régulation, il ne remplace pas une aide médicale ou d&apos;urgence.
          Si tu es en danger immédiat, contacte les secours de ton pays ou rends-toi aux urgences les plus proches.
        </p>
        <Link
          href="/messages"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair"
        >
          Écrire à mon praticien
        </Link>
      </GlassCard>
    </div>
  );
}
