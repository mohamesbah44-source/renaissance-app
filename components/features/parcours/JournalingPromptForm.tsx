"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveJournalingResponses } from "@/lib/parcours/actions";
import type { JournalingPrompt, JournalingResponses } from "@/lib/types/database.types";

interface JournalingPromptFormProps {
  weekId: string;
  prompts: JournalingPrompt[];
  responses: JournalingResponses;
}

export function JournalingPromptForm({ weekId, prompts, responses }: JournalingPromptFormProps) {
  const [state, formAction] = useActionState(saveJournalingResponses, undefined);
  const [step, setStep] = useState(0);

  const total = prompts.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  return (
    <GlassCard className="mt-8 p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Journal</p>
        {total > 1 && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-rr-or">
            {step + 1} / {total}
          </p>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {prompts.map((prompt, i) => (
            <span
              key={prompt.id}
              className={i <= step ? "h-1 flex-1 rounded-full bg-rr-or" : "h-1 flex-1 rounded-full bg-white/10"}
            />
          ))}
        </div>
      )}

      <form action={formAction} className="mt-7">
        <input type="hidden" name="weekId" value={weekId} />

        {prompts.map((prompt, i) => (
          <div key={prompt.id} className={i === step ? "" : "hidden"}>
            <label
              htmlFor={`prompt-${prompt.id}`}
              className="block font-rr-serif text-xl italic leading-relaxed text-rr-ivoire"
            >
              {prompt.label}
            </label>
            <div className="mt-5">
              <Textarea
                id={`prompt-${prompt.id}`}
                name={`prompt-${prompt.id}`}
                defaultValue={responses[prompt.id] ?? ""}
                rows={7}
                placeholder="Écris librement…"
              />
            </div>
          </div>
        ))}

        {state?.error && <p className="mt-4 text-sm text-rr-rouge">{state.error}</p>}
        {state?.success && <p className="mt-4 text-sm text-rr-or-clair">Tes réflexions ont été enregistrées.</p>}

        <div className="mt-6 flex items-center gap-3">
          {total > 1 && !isFirst && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              aria-label="Question précédente"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rr-or/20 text-rr-or-clair transition-all duration-300 hover:bg-white/[0.05]"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}

          {isLast ? (
            <div className="flex-1">
              <SubmitButton variant="outline">Enregistrer mes réflexions</SubmitButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-rr-or text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:bg-rr-or-clair"
            >
              Suivant
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-rr-gris">
          Il n&apos;y a pas de bonne réponse, seulement la tienne.
        </p>
      </form>
    </GlassCard>
  );
}
