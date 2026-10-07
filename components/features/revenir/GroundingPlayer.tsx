"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { recordProtocolUse } from "@/lib/today/protocol-actions";
import { cn } from "@/lib/utils";

export interface GroundingStep {
  prompt: string;
  count?: number;
}

interface GroundingPlayerProps {
  practiceKey: string;
  title: string;
  description: string;
  steps: GroundingStep[];
}

/** Protocole d'ancrage guidé : une étape à la fois, sans score, sans chronomètre visible. */
export function GroundingPlayer({ practiceKey, title, description, steps }: GroundingPlayerProps) {
  // -1 = introduction, 0..n-1 = étapes, n = fin
  const [index, setIndex] = useState(-1);
  const startedAt = useRef<number | null>(null);
  const recorded = useRef(false);

  const isIntro = index < 0;
  const isDone = index >= steps.length;
  const step = !isIntro && !isDone ? steps[index] : null;

  useEffect(() => {
    if (isDone && !recorded.current) {
      recorded.current = true;
      const seconds = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
      void recordProtocolUse(practiceKey, seconds);
    }
  }, [isDone, practiceKey]);

  function start() {
    startedAt.current = Date.now();
    setIndex(0);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-rr-noir text-rr-ivoire">
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="text-xs uppercase tracking-[0.25em] text-rr-gris-clair">{title}</span>
        <Link
          href="/revenir-a-moi"
          aria-label="Quitter"
          className="rounded-full p-2 text-rr-gris-clair transition-colors hover:text-rr-ivoire"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {isIntro && (
          <div className="max-w-md space-y-6">
            <h1 className="font-rr-display text-3xl">{title}</h1>
            <p className="font-rr-serif text-lg leading-relaxed text-rr-gris-clair">{description}</p>
            <p className="text-sm text-rr-gris">Il n&apos;y a rien à réussir. Tu peux t&apos;arrêter à tout moment.</p>
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair"
            >
              Commencer
            </button>
          </div>
        )}

        {step && (
          <div key={index} className="max-w-md space-y-8">
            {typeof step.count === "number" && (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-rr-or/60 font-rr-display text-5xl text-rr-or">
                {step.count}
              </div>
            )}
            <p className="font-rr-serif text-2xl leading-relaxed">{step.prompt}</p>
            <p className="text-sm text-rr-gris">Prends ton temps. Passe à la suite quand tu es prêt(e).</p>
          </div>
        )}

        {isDone && (
          <div className="max-w-md space-y-6">
            <h1 className="font-rr-display text-3xl">Tu es là, maintenant.</h1>
            <p className="font-rr-serif text-lg leading-relaxed text-rr-gris-clair">
              Prends encore une respiration lente si tu le souhaites. Tu peux revenir ici chaque fois que tu en as besoin.
            </p>
            <div className="flex flex-col items-center gap-3 pt-2">
              <Link
                href="/aujourdhui"
                className="rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair"
              >
                Retour à ma journée
              </Link>
              <button
                type="button"
                onClick={() => setIndex(-1)}
                className="text-sm text-rr-gris-clair underline-offset-4 hover:underline"
              >
                Recommencer
              </button>
            </div>
          </div>
        )}
      </div>

      {step && (
        <div className="px-6 pb-8">
          <div className="mb-6 flex justify-center gap-2" aria-hidden="true">
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 w-1.5 rounded-full", i === index ? "bg-rr-or" : i < index ? "bg-rr-or/50" : "bg-rr-gris/40")}
              />
            ))}
          </div>
          <div className="mx-auto flex max-w-md items-center justify-between">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="flex items-center gap-2 text-sm text-rr-gris-clair transition-colors hover:text-rr-ivoire disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Précédent
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="flex items-center gap-2 rounded-full bg-rr-or px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-rr-noir transition-all duration-300 hover:bg-rr-or-clair"
            >
              {index === steps.length - 1 ? "Terminer" : "Suivant"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
