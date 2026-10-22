"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { saveRadarBilan } from "@/lib/radar/actions";
import { ALL_QUESTIONS, CERCLES, TOTAL_QUESTIONS, cercleOf, questionFieldName } from "@/lib/radar/constants";
import { RadarProgressBar } from "@/components/features/radar/RadarProgressBar";
import { RadarQuestion } from "@/components/features/radar/RadarQuestion";
import { RadarScale } from "@/components/features/radar/RadarScale";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "rr_session_v2";
const AUTO_ADVANCE_DELAY_MS = 350;

interface StoredSession {
  answers: Record<string, number>;
  index: number;
}

function readStoredSession(): StoredSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as StoredSession;
      return { answers: stored.answers ?? {}, index: stored.index ?? 0 };
    }
  } catch {
    // session storage indisponible : on repart d'une session vierge
  }
  return { answers: {}, index: 0 };
}

/**
 * `doneHref` : page où envoyer le membre une fois le bilan enregistré
 * (l'identifiant du bilan est ajouté en `?id=`). Sans ce paramètre, le membre
 * va vers la page de résultats habituelle du Radar.
 */
export function RadarSessionFlow({ doneHref }: { doneHref?: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveRadarBilan, undefined);
  const [session, setSession] = useState<StoredSession>(readStoredSession);
  const { answers, index } = session;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAdvanceTimer = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (state?.success) {
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(doneHref ? `${doneHref}?id=${state.id}` : `/radar/resultats/${state.id}`);
    }
  }, [state, router, doneHref]);

  const question = ALL_QUESTIONS[index];
  const isLast = index === ALL_QUESTIONS.length - 1;
  const currentValue = answers[question.id];
  const currentCercle = cercleOf(question.pilierId).id;

  const goToIndex = (next: number) => {
    clearAdvanceTimer();
    setSession((current) => ({ ...current, index: next }));
  };

  const setAnswer = (value: number) => {
    setSession((current) => ({ ...current, answers: { ...current.answers, [question.id]: value } }));

    if (!isLast) {
      clearAdvanceTimer();
      const target = index + 1;
      advanceTimer.current = setTimeout(() => {
        setSession((current) => ({ ...current, index: target }));
        advanceTimer.current = null;
      }, AUTO_ADVANCE_DELAY_MS);
    }
  };

  return (
    <form action={formAction} className="flex min-h-[78dvh] flex-col">
      {ALL_QUESTIONS.map((q) => (
        <input key={q.id} type="hidden" name={questionFieldName(q)} value={answers[q.id] ?? ""} readOnly />
      ))}

      <RadarProgressBar current={index + 1} total={TOTAL_QUESTIONS} />

      <div className="mt-6 flex gap-2" role="img" aria-label={`Cercle ${CERCLES.find((c) => c.id === currentCercle)?.nom}`}>
        {CERCLES.map((cercle) => (
          <span
            key={cercle.id}
            className={cn(
              "flex h-[34px] flex-1 items-center justify-center rounded-full border font-rr-label text-[10px] uppercase tracking-[0.22em]",
              cercle.id === currentCercle
                ? "border-rr-or/50 bg-rr-or/[0.16] text-rr-or"
                : "border-white/[0.12] text-rr-gris-clair"
            )}
          >
            {cercle.nom}
          </span>
        ))}
      </div>

      <RadarQuestion pilierNom={question.pilierNom} text={question.t} />

      <RadarScale value={currentValue} onChange={setAnswer} />

      {state?.success === false && <p className="mt-6 text-center text-sm text-rr-rouge">{state.error}</p>}

      <div className="mt-auto flex items-center gap-3 pt-12">
        <button
          type="button"
          onClick={() => goToIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Question précédente"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-rr-ivoire/20 text-rr-gris-clair transition-colors duration-300 hover:text-rr-ivoire disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
        </button>

        {isLast ? (
          <button
            type="submit"
            disabled={currentValue === undefined || isPending}
            className="h-14 flex-1 rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
          >
            {isPending ? "Un instant…" : "Voir mes résultats"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goToIndex(Math.min(ALL_QUESTIONS.length - 1, index + 1))}
            disabled={currentValue === undefined}
            className="h-14 flex-1 rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90 disabled:opacity-40"
          >
            Suivant
          </button>
        )}
      </div>
    </form>
  );
}
