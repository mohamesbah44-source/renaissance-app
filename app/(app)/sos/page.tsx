import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const ETAPES = [
  {
    titre: "Reviens à ton souffle",
    texte: "Inspire sur 4 temps, expire longuement sur 6 à 8. Cinq à six fois, sans forcer.",
  },
  {
    titre: "Ancre ton corps ici",
    texte:
      "5 choses que tu vois, 4 que tu entends, 3 que tu touches, 2 que tu sens, 1 que tu goûtes.",
  },
  {
    titre: "Nomme ce qui traverse",
    texte: "« En ce moment, je ressens… » Ce que tu ressens est légitime.",
  },
  {
    titre: "Relie-toi",
    texte: "Écris à ton praticien si tu as besoin d'être accompagné maintenant.",
  },
];

/** Protocole SOS Re-Naissance™ — accessible à tout moment, sans dépendre de l'avancée dans le parcours. */
export default function SosPage() {
  return (
    <div className="relative mx-auto max-w-2xl pb-8">
      {/* Halo chaud : l'écran SOS se distingue par une lumière plus douce, ni froide ni alarmante */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[140%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(150,60,70,0.30) 0%, rgba(70,24,50,0.16) 55%, transparent 100%)",
        }}
      />

      <div className="rr-enter relative">
        <Link
          href="/profil"
          aria-label="Retour"
          className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
        </Link>

        <header className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#E0925A]">Protocole SOS</p>
          <h1 className="mt-4 font-rr-display text-[38px] leading-[1.05] text-rr-ivoire">
            Quand tout s&apos;accélère.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
            Prends ce qui t&apos;aide, dans l&apos;ordre qui te convient.
          </p>
        </header>

        <ol className="mt-10 flex flex-col">
          {ETAPES.map((etape, i) => (
            <li key={etape.titre} className="flex gap-4 border-b border-white/[0.08] py-5 last:border-b-0">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[#E0925A]/60 font-rr-label text-[13px] text-[#E0925A]">
                {i + 1}
              </span>
              <div>
                <p className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">{etape.titre}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-rr-gris-clair">{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href="/respiration"
          className="mt-10 flex h-14 w-full items-center justify-center rounded-full bg-[#E0925A] text-[15px] font-medium text-[#1a0d08] transition-opacity duration-300 hover:opacity-90"
        >
          Respirer avec le cercle
        </Link>

        <Link
          href="/messages"
          className="mt-3 flex h-14 w-full items-center justify-center rounded-full border border-rr-ivoire/20 text-[15px] text-rr-ivoire transition-colors duration-300 hover:bg-white/[0.05]"
        >
          Écrire à mon praticien
        </Link>

        <p className="mt-8 text-center text-xs leading-relaxed text-rr-gris">
          Ce protocole est un outil d&apos;auto-régulation, il ne remplace pas une aide médicale ou d&apos;urgence. Si
          tu es en danger immédiat, contacte les secours de ton pays ou rends-toi aux urgences les plus proches.
        </p>
      </div>
    </div>
  );
}
