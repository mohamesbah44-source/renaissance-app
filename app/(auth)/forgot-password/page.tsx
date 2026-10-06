"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const ETAPES = [
  {
    titre: "Reviens à ton souffle",
    texte:
      "Inspire doucement par le nez sur 4 temps, retiens l'air 4 temps, expire longuement par la bouche sur 6 à 8 temps. Répète ce cycle cinq à six fois, sans forcer.",
  },
  {
    titre: "Ancre ton corps ici",
    texte:
      "Nomme, dans ta tête ou à voix basse : 5 choses que tu vois, 4 choses que tu entends, 3 choses que tu touches, 2 choses que tu sens, 1 chose que tu goûtes. Reviens au concret, à l'instant présent.",
  },
  {
    titre: "Nomme ce qui traverse",
    texte:
      "\"En ce moment, je ressens ___.\" Tu n'as pas besoin de comprendre ou de justifier ce qui se passe pour le traverser. Ce que tu ressens est légitime, même si c'est inconfortable.",
  },
  {
    titre: "Relie-toi si tu en as besoin",
    texte:
      "Tu n'as pas à traverser cela seul·e. Écris un message à ton praticien si tu sens que tu as besoin d'être accompagné·e maintenant.",
  },
];

/** Protocole SOS Re-Naissance™ — accessible à tout moment, sans dépendre de l'avancée dans le parcours. */
export default function SosPage() {
  const [step, setStep] = useState(0);
  const etape = ETAPES[step];
  const isFirst = step === 0;
  const isLast = step === ETAPES.length - 1;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Le Programme Re-Naissance™</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Protocole SOS</h1>
        <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-creme">
          Pour les moments où tout s&apos;accélère ou se referme. Prends ce qui t&apos;aide, dans l&apos;ordre
          qui te convient.
        </p>
      </header>

      <GlassCard className="mt-8 p-6 sm:p-8">
        <div className="flex items-center gap-2" role="tablist" aria-label="Étapes du protocole">
          {ETAPES.map((e, i) => (
            <button
              key={e.titre}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`Étape ${i + 1} : ${e.titre}`}
              onClick={() => setStep(i)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center rounded-full border text-sm transition-all duration-300",
                i === step
                  ? "border-rr-or bg-rr-or/[0.16] text-rr-or-clair"
                  : "border-white/10 text-rr-gris hover:border-rr-or/40 hover:text-rr-gris-clair"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center text-center" key={step}>
          {isFirst && (
            <div aria-hidden="true" className="relative mb-8 flex h-28 w-28 items-center justify-center">
              <span className="animate-breathe absolute inset-0 rounded-full bg-rr-or/15 blur-xl" />
              <span className="animate-breathe h-20 w-20 rounded-full border border-rr-or/40 bg-rr-or/10" />
            </div>
          )}

          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">
            Étape {step + 1} sur {ETAPES.length}
          </p>
          <h2 className="mt-3 font-rr-display text-3xl leading-snug text-rr-ivoire">{etape.titre}</h2>
          <p className="mt-6 font-rr-serif text-xl leading-relaxed text-rr-creme">{etape.texte}</p>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={isFirst}
            aria-label="Étape précédente"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rr-or/30 text-rr-creme transition-all duration-300 hover:border-rr-or/60 disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => setStep(Math.min(ETAPES.length - 1, step + 1))}
            disabled={isLast}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-rr-or text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:bg-rr-or-clair disabled:opacity-40"
          >
            Étape suivante
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6 text-center">
        <p className="text-sm leading-relaxed text-rr-gris-clair">
          Ce protocole est un outil d&apos;auto-régulation, il ne remplace pas une aide médicale ou d&apos;urgence.
          Si tu es en danger immédiat, contacte les secours de ton pays ou rends-toi aux urgences les plus proches.
        </p>
        <Link
          href="/messages"
          className="mt-5 inline-flex h-12 items-center justify-center rounded-full border border-rr-or/30 px-8 text-xs uppercase tracking-[0.25em] text-rr-or-clair transition-all duration-300 hover:bg-white/[0.05]"
        >
          Écrire à mon praticien
        </Link>
      </GlassCard>
    </div>
  );
}
