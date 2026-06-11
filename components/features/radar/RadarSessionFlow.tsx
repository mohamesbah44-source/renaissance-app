"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveRadarBilan } from "@/lib/radar/actions";
import { ALL_QUESTIONS, TOTAL_QUESTIONS, questionFieldName } from "@/lib/radar/constants";
import { RadarProgressBar } from "@/components/features/radar/RadarProgressBar";
import { RadarQuestion } from "@/components/features/radar/RadarQuestion";
import { RadarScale } from "@/components/features/radar/RadarScale";

const STORAGE_KEY = "rr_session_v2";

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

export function RadarSessionFlow() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveRadarBilan, undefined);
  const [session, setSession] = useState<StoredSession>(readStoredSession);
  const { answers, index } = session;

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (state?.success) {
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/radar/resultats/${state.id}`);
    }
  }, [state, router]);

  const question = ALL_QUESTIONS[index];
  const isLast = index === ALL_QUESTIONS.length - 1;
  const currentValue = answers[question.id];

  const goToIndex = (next: number) => setSession((current) => ({ ...current, index: next }));
  const setAnswer = (value: number) =>
    setSession((current) => ({ ...current, answers: { ...current.answers, [question.id]: value } }));

  return (
    <form action={formAction} className="flex min-h-[70dvh] flex-col pt-2">
      {ALL_QUESTIONS.map((q) => (
        <input key={q.id} type="hidden" name={questionFieldName(q)} value={answers[q.id] ?? ""} readOnly />
      ))}

      <RadarProgressBar current={index + 1} total={TOTAL_QUESTIONS} />

      <RadarQuestion pilierNom={question.pilierNom} text={question.t} />

      <RadarScale value={currentValue} onChange={setAnswer} />

      {state?.success === false && <p className="mt-6 text-center text-sm text-rr-rouge">{state.error}</p>}

      <div className="mt-auto flex items-center justify-between gap-4 pt-12">
        <button
          type="button"
          onClick={() => goToIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="rounded-full border border-rr-or/30 px-6 py-3 text-xs uppercase tracking-[0.25em] text-rr-creme transition-colors hover:border-rr-or/60 disabled:opacity-30"
        >
          Précédent
        </button>

        {isLast ? (
          <button
            type="submit"
            disabled={currentValue === undefined || isPending}
            className="rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-colors hover:bg-rr-or-clair disabled:opacity-40"
          >
            {isPending ? "Un instant..." : "Voir mes résultats"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goToIndex(Math.min(ALL_QUESTIONS.length - 1, index + 1))}
            disabled={currentValue === undefined}
            className="rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-colors hover:bg-rr-or-clair disabled:opacity-40"
          >
            Suivant
          </button>
        )}
      </div>
    </form>
  );
}
